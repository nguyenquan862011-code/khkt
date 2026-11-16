/**
 * TamGiang Physics — tầng truy cập dữ liệu học tập cá nhân.
 * Mọi hàm đều nhận userId của phiên đăng nhập và mọi câu truy vấn đều lọc theo user_id,
 * vì vậy một tài khoản không thể đọc hay sửa dữ liệu của tài khoản khác.
 */
import type { Database } from "./db";
import { randomId } from "./security";

export class StoreError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 400,
  ) {
    super(message);
  }
}

const ATTEMPT_SOURCES = ["practice", "lesson", "vdc", "experiment"] as const;
const MAX_ANSWERS = 200;

function str(value: unknown, max: number, fallback: string | null = null): string | null {
  if (typeof value !== "string") return fallback;
  const v = value.trim();
  return v ? v.slice(0, max) : fallback;
}

function isoDate(value: unknown, fallback: string): string {
  if (typeof value === "string") {
    const t = Date.parse(value);
    if (Number.isFinite(t)) return new Date(t).toISOString();
  }
  return fallback;
}

function int(value: unknown, min: number, max: number, fallback = 0): number {
  const n = typeof value === "number" && Number.isFinite(value) ? Math.round(value) : fallback;
  return Math.min(max, Math.max(min, n));
}

function jsonText(value: unknown, maxLength: number): string | null {
  if (value == null) return null;
  try {
    const text = JSON.stringify(value);
    return text.length <= maxLength ? text : null;
  } catch {
    return null;
  }
}

function parseJson(text: unknown): unknown {
  if (typeof text !== "string") return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export interface AttemptSummary {
  id: string;
  clientId: string;
  source: string;
  title: string;
  grade: string | null;
  topic: string | null;
  lessonKey: string | null;
  level: string | null;
  startedAt: string;
  finishedAt: string;
  durationSec: number;
  total: number;
  correct: number;
  wrong: number;
  score: number;
  meta: unknown;
}

export interface AttemptAnswer {
  position: number;
  questionId: string;
  lessonKey: string | null;
  level: string | null;
  kind: string | null;
  isCorrect: boolean;
  detail: unknown;
}

function toAttemptSummary(row: Record<string, unknown>): AttemptSummary {
  return {
    id: String(row["id"]),
    clientId: String(row["client_id"]),
    source: String(row["source"]),
    title: String(row["title"]),
    grade: (row["grade"] as string | null) ?? null,
    topic: (row["topic"] as string | null) ?? null,
    lessonKey: (row["lesson_key"] as string | null) ?? null,
    level: (row["level"] as string | null) ?? null,
    startedAt: String(row["started_at"]),
    finishedAt: String(row["finished_at"]),
    durationSec: Number(row["duration_sec"]),
    total: Number(row["total"]),
    correct: Number(row["correct"]),
    wrong: Number(row["wrong"]),
    score: Number(row["score"]),
    meta: parseJson(row["meta_json"]),
  };
}

/** Lưu một lần làm bài kèm chi tiết từng câu. Gửi lại cùng clientId sẽ không tạo bản trùng. */
export function saveAttempt(db: Database, userId: string, input: unknown): AttemptSummary {
  if (!input || typeof input !== "object") {
    throw new StoreError("invalid_attempt", "Dữ liệu bài làm không hợp lệ.");
  }
  const body = input as Record<string, unknown>;
  const clientId = str(body["clientId"], 80);
  if (!clientId) throw new StoreError("invalid_attempt", "Thiếu mã bài làm (clientId).");

  const existing = db
    .prepare("SELECT * FROM attempts WHERE user_id = ? AND client_id = ?")
    .get(userId, clientId);
  if (existing) return toAttemptSummary(existing);

  const source = (ATTEMPT_SOURCES as readonly string[]).includes(String(body["source"]))
    ? String(body["source"])
    : "practice";
  const now = new Date().toISOString();
  const answersRaw = Array.isArray(body["answers"]) ? body["answers"].slice(0, MAX_ANSWERS) : [];
  const total = int(body["total"], 1, 500, Math.max(1, answersRaw.length));
  const correct = int(body["correct"], 0, total);
  const wrong = int(body["wrong"], 0, total, total - correct);
  const scoreRaw = typeof body["score"] === "number" ? body["score"] : (correct / total) * 10;
  const score = Math.round(Math.min(10, Math.max(0, scoreRaw)) * 100) / 100;
  const finishedAt = isoDate(body["finishedAt"], now);
  const startedAt = isoDate(body["startedAt"], finishedAt);
  const id = randomId("att");

  db.exec("BEGIN");
  try {
    db.prepare(
      `INSERT INTO attempts (id, user_id, client_id, source, title, grade, topic, lesson_key, level,
        started_at, finished_at, duration_sec, total, correct, wrong, score, meta_json, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      userId,
      clientId,
      source,
      str(body["title"], 200, "Bài luyện tập Vật lí")!,
      str(body["grade"], 20),
      str(body["topic"], 200),
      str(body["lessonKey"], 300),
      str(body["level"], 40),
      startedAt,
      finishedAt,
      int(body["durationSec"], 0, 24 * 3600),
      total,
      correct,
      wrong,
      score,
      jsonText(body["meta"], 8_000),
      now,
    );
    const insertAnswer = db.prepare(
      `INSERT INTO attempt_answers (attempt_id, position, question_id, lesson_key, level, kind, is_correct, detail_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    answersRaw.forEach((raw, index) => {
      if (!raw || typeof raw !== "object") return;
      const a = raw as Record<string, unknown>;
      const detail = jsonText(a["detail"] ?? {}, 20_000);
      if (!detail) return;
      insertAnswer.run(
        id,
        index,
        str(a["questionId"], 160, `q${index + 1}`)!,
        str(a["lessonKey"], 300),
        str(a["level"], 40),
        str(a["kind"], 40),
        a["isCorrect"] === true ? 1 : 0,
        detail,
      );
    });
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return toAttemptSummary(db.prepare("SELECT * FROM attempts WHERE id = ?").get(id)!);
}

export function listAttempts(
  db: Database,
  userId: string,
  opts: { limit?: number; from?: string | null; to?: string | null } = {},
): AttemptSummary[] {
  const limit = int(opts.limit, 1, 1000, 300);
  const from = opts.from ? isoDate(opts.from, "0000") : "0000";
  const to = opts.to ? isoDate(opts.to, "9999") : "9999";
  return db
    .prepare(
      `SELECT * FROM attempts WHERE user_id = ? AND finished_at >= ? AND finished_at <= ?
       ORDER BY finished_at DESC LIMIT ?`,
    )
    .all(userId, from, to, limit)
    .map(toAttemptSummary);
}

export function getAttempt(
  db: Database,
  userId: string,
  attemptId: string,
): (AttemptSummary & { answers: AttemptAnswer[] }) | null {
  // Tìm theo id máy chủ hoặc clientId — luôn kèm điều kiện user_id của người đang đăng nhập.
  const row = db
    .prepare("SELECT * FROM attempts WHERE user_id = ? AND (id = ? OR client_id = ?)")
    .get(userId, attemptId, attemptId);
  if (!row) return null;
  const answers = db
    .prepare("SELECT * FROM attempt_answers WHERE attempt_id = ? ORDER BY position")
    .all(String(row["id"]))
    .map((a) => ({
      position: Number(a["position"]),
      questionId: String(a["question_id"]),
      lessonKey: (a["lesson_key"] as string | null) ?? null,
      level: (a["level"] as string | null) ?? null,
      kind: (a["kind"] as string | null) ?? null,
      isCorrect: Number(a["is_correct"]) === 1,
      detail: parseJson(a["detail_json"]),
    }));
  return { ...toAttemptSummary(row), answers };
}

export function deleteAttempt(db: Database, userId: string, attemptId: string): boolean {
  const res = db
    .prepare("DELETE FROM attempts WHERE user_id = ? AND (id = ? OR client_id = ?)")
    .run(userId, attemptId, attemptId);
  return Number(res.changes) > 0;
}

export interface ActivityItem {
  clientId: string;
  type: string;
  ref: string | null;
  title: string | null;
  grade: string | null;
  topic: string | null;
  durationSec: number;
  meta: unknown;
  occurredAt: string;
}

export function saveActivities(db: Database, userId: string, input: unknown): number {
  const list = Array.isArray(input) ? input.slice(0, 200) : [];
  const stmt = db.prepare(
    `INSERT OR IGNORE INTO activity (user_id, client_id, type, ref, title, grade, topic, duration_sec, meta_json, occurred_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const now = new Date().toISOString();
  let saved = 0;
  db.exec("BEGIN");
  try {
    for (const raw of list) {
      if (!raw || typeof raw !== "object") continue;
      const a = raw as Record<string, unknown>;
      const clientId = str(a["clientId"], 80);
      const type = str(a["type"], 40);
      if (!clientId || !type || !/^[a-z_]+$/.test(type)) continue;
      const res = stmt.run(
        userId,
        clientId,
        type,
        str(a["ref"], 300),
        str(a["title"], 200),
        str(a["grade"], 20),
        str(a["topic"], 200),
        int(a["durationSec"], 0, 24 * 3600),
        jsonText(a["meta"], 4_000),
        isoDate(a["occurredAt"], now),
      );
      saved += Number(res.changes);
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  return saved;
}

export function listActivities(
  db: Database,
  userId: string,
  opts: { limit?: number; from?: string | null; to?: string | null } = {},
): ActivityItem[] {
  const limit = int(opts.limit, 1, 2000, 500);
  const from = opts.from ? isoDate(opts.from, "0000") : "0000";
  const to = opts.to ? isoDate(opts.to, "9999") : "9999";
  return db
    .prepare(
      `SELECT * FROM activity WHERE user_id = ? AND occurred_at >= ? AND occurred_at <= ?
       ORDER BY occurred_at DESC LIMIT ?`,
    )
    .all(userId, from, to, limit)
    .map((row) => ({
      clientId: String(row["client_id"]),
      type: String(row["type"]),
      ref: (row["ref"] as string | null) ?? null,
      title: (row["title"] as string | null) ?? null,
      grade: (row["grade"] as string | null) ?? null,
      topic: (row["topic"] as string | null) ?? null,
      durationSec: Number(row["duration_sec"]),
      meta: parseJson(row["meta_json"]),
      occurredAt: String(row["occurred_at"]),
    }));
}

export interface StoredState {
  state: unknown;
  version: number;
  updatedAt: string | null;
}

export function getUserState(db: Database, userId: string): StoredState {
  const row = db.prepare("SELECT * FROM user_state WHERE user_id = ?").get(userId);
  if (!row) return { state: null, version: 0, updatedAt: null };
  return {
    state: parseJson(row["state_json"]),
    version: Number(row["version"]),
    updatedAt: String(row["updated_at"]),
  };
}

/**
 * Ghi tiến độ học tập với kiểm soát phiên bản lạc quan: nếu thiết bị khác đã ghi trước
 * (baseVersion lệch) thì trả về conflict để client hợp nhất rồi gửi lại — tránh ghi đè mất dữ liệu.
 */
export function putUserState(
  db: Database,
  userId: string,
  input: { state: unknown; baseVersion: unknown },
): { ok: true; version: number } | { ok: false; current: StoredState } {
  const text = jsonText(input.state, 1_500_000);
  if (!text || typeof input.state !== "object" || input.state === null) {
    throw new StoreError("invalid_state", "Dữ liệu tiến độ không hợp lệ hoặc quá lớn.");
  }
  const current = getUserState(db, userId);
  const base = typeof input.baseVersion === "number" ? input.baseVersion : -1;
  if (base !== current.version) return { ok: false, current };
  const now = new Date().toISOString();
  const version = current.version + 1;
  db.prepare(
    `INSERT INTO user_state (user_id, state_json, version, updated_at) VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET state_json = excluded.state_json,
       version = excluded.version, updated_at = excluded.updated_at`,
  ).run(userId, text, version, now);
  return { ok: true, version };
}

/** Bản sao lưu toàn bộ dữ liệu học tập của chính người dùng (tải về dạng JSON). */
export function exportUserData(db: Database, userId: string) {
  const attempts = listAttempts(db, userId, { limit: 1000 }).map((a) =>
    getAttempt(db, userId, a.id)!,
  );
  return {
    exportedAt: new Date().toISOString(),
    state: getUserState(db, userId),
    attempts,
    activity: listActivities(db, userId, { limit: 2000 }),
  };
}

export function getAdminOverview(db: Database) {
  const count = (sql: string) => Number(db.prepare(sql).get()?.["n"] ?? 0);
  return {
    users: count("SELECT COUNT(*) AS n FROM users"),
    attempts: count("SELECT COUNT(*) AS n FROM attempts"),
    activities: count("SELECT COUNT(*) AS n FROM activity"),
    averageScore:
      Math.round(
        Number(db.prepare("SELECT AVG(score) AS n FROM attempts").get()?.["n"] ?? 0) * 100,
      ) / 100,
    byGrade: db
      .prepare("SELECT COALESCE(grade, 'Chưa chọn') AS grade, COUNT(*) AS n FROM users GROUP BY 1")
      .all()
      .map((r) => ({ grade: String(r["grade"]), users: Number(r["n"]) })),
  };
}
