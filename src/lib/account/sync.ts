/**
 * Đồng bộ dữ liệu học tập giữa trình duyệt và tài khoản.
 *  - Khách: mọi thứ vẫn nằm ở localStorage như trước (không gọi máy chủ).
 *  - Đã đăng nhập: tiến độ (bài đã xem, thí nghiệm, yêu thích, câu đã lưu, ghi chú) đồng bộ qua
 *    /api/me/state với kiểm soát phiên bản; bài làm và nhật ký được xếp vào hàng chờ cục bộ và gửi
 *    lại khi có mạng (mỗi mục có clientId nên gửi lặp không tạo bản trùng).
 */
import {
  getLearningState,
  mergeLearningStates,
  replaceLearningState,
  subscribeLearningState,
  type LearningState,
} from "@/lib/learning-store";
import { ApiError, api, getAuthSnapshot, refreshAuth, subscribeAuth } from "./client";

const OWNER_KEY = "tamgiang_sync_owner_v1";
const VERSION_KEY = "tamgiang_sync_version_v1";
const OUTBOX_KEY = "tamgiang_sync_outbox_v1";
const OUTBOX_LIMIT = 200;

export interface AttemptAnswerInput {
  questionId: string;
  lessonKey?: string | null;
  level?: string | null;
  kind?: string | null;
  isCorrect: boolean;
  detail?: unknown;
}

export interface AttemptInput {
  clientId: string;
  source: "practice" | "lesson" | "vdc" | "experiment";
  title: string;
  grade?: string | null;
  topic?: string | null;
  lessonKey?: string | null;
  level?: string | null;
  startedAt: string;
  finishedAt: string;
  durationSec: number;
  total: number;
  correct: number;
  wrong: number;
  score: number;
  meta?: unknown;
  answers?: AttemptAnswerInput[];
}

export interface ActivityInput {
  clientId: string;
  type: string;
  ref?: string;
  title?: string;
  grade?: string | null;
  topic?: string | null;
  durationSec?: number;
  meta?: unknown;
  occurredAt: string;
}

type OutboxEntry =
  { kind: "attempt"; data: AttemptInput } | { kind: "activity"; data: ActivityInput };

export type SyncStatus = "guest" | "syncing" | "synced" | "offline";
let status: SyncStatus = "guest";
const statusListeners = new Set<(s: SyncStatus) => void>();

function setStatus(next: SyncStatus) {
  if (status === next) return;
  status = next;
  statusListeners.forEach((fn) => fn(next));
}

export function getSyncStatus(): SyncStatus {
  return status;
}

export function subscribeSyncStatus(listener: (s: SyncStatus) => void): () => void {
  statusListeners.add(listener);
  return () => statusListeners.delete(listener);
}

export function newClientId(prefix: string): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
  return `${prefix}-${random}`;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // bộ nhớ đầy — bỏ qua, dữ liệu vẫn còn trong phiên
  }
}

function readOutbox(): OutboxEntry[] {
  const list = readJson<OutboxEntry[]>(OUTBOX_KEY, []);
  return Array.isArray(list) ? list : [];
}

function enqueue(entry: OutboxEntry) {
  writeJson(OUTBOX_KEY, [...readOutbox(), entry].slice(-OUTBOX_LIMIT));
}

let flushing = false;

/** Gửi hàng chờ lên máy chủ. Mục nào lỗi mạng thì giữ lại để gửi sau. */
export async function flushOutbox(): Promise<void> {
  if (flushing || typeof window === "undefined" || !getAuthSnapshot().user) return;
  flushing = true;
  try {
    const pending = readOutbox();
    if (pending.length === 0) return;
    const sent = new Set<string>();
    const activities = pending
      .filter((e) => e.kind === "activity")
      .map((e) => e.data as ActivityInput);
    try {
      for (const entry of pending) {
        if (entry.kind !== "attempt") continue;
        try {
          await api("/api/me/attempts", { method: "POST", body: entry.data });
          sent.add(entry.data.clientId);
        } catch (err) {
          // Lỗi dữ liệu (4xx) thì bỏ mục đó; lỗi mạng/máy chủ thì dừng và thử lại sau.
          if (
            err instanceof ApiError &&
            err.status >= 400 &&
            err.status < 500 &&
            err.status !== 401 &&
            err.status !== 429
          ) {
            sent.add(entry.data.clientId);
          } else throw err;
        }
      }
      if (activities.length > 0) {
        await api("/api/me/activity", { method: "POST", body: { items: activities } });
        activities.forEach((a) => sent.add(a.clientId));
      }
      setStatus("synced");
    } catch {
      setStatus("offline");
    }
    // Đọc lại để không làm mất mục mới được thêm trong lúc đang gửi.
    writeJson(
      OUTBOX_KEY,
      readOutbox().filter((e) => !sent.has(e.data.clientId)),
    );
  } finally {
    flushing = false;
  }
}

/** Ghi một lần làm bài. Trả về true nếu đã xếp hàng để lưu vào tài khoản (đang đăng nhập). */
export function recordAttempt(attempt: AttemptInput): boolean {
  if (typeof window === "undefined" || !getAuthSnapshot().user) return false;
  enqueue({ kind: "attempt", data: attempt });
  void flushOutbox();
  return true;
}

export function recordActivity(
  activity: Omit<ActivityInput, "clientId" | "occurredAt"> & { clientId?: string },
) {
  if (typeof window === "undefined" || !getAuthSnapshot().user) return;
  enqueue({
    kind: "activity",
    data: {
      ...activity,
      clientId: activity.clientId ?? newClientId("act"),
      occurredAt: new Date().toISOString(),
    },
  });
  scheduleFlush();
}

let flushTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flushOutbox();
  }, 4000);
}

/* ---------- Đồng bộ tiến độ (learning-store) ---------- */

let pushTimer: ReturnType<typeof setTimeout> | null = null;
let applyingRemote = false;
let lastPushed = "";

async function pushState(attempt = 0): Promise<void> {
  const user = getAuthSnapshot().user;
  if (!user) return;
  const state = getLearningState();
  const text = JSON.stringify(state);
  if (text === lastPushed) return;
  setStatus("syncing");
  try {
    const res = await api<{ version: number }>("/api/me/state", {
      method: "PUT",
      body: { state, baseVersion: readJson<number>(VERSION_KEY, 0) },
    });
    writeJson(VERSION_KEY, res.version);
    lastPushed = text;
    setStatus("synced");
  } catch (err) {
    if (err instanceof ApiError && err.status === 409 && attempt < 2) {
      // Thiết bị khác đã ghi trước: hợp nhất rồi gửi lại, không ghi đè.
      const remote = (err.data?.["state"] ?? {}) as Partial<LearningState>;
      writeJson(VERSION_KEY, Number(err.data?.["version"] ?? 0));
      applyRemote(mergeLearningStates(getLearningState(), remote));
      return pushState(attempt + 1);
    }
    setStatus("offline");
  }
}

function applyRemote(next: unknown) {
  applyingRemote = true;
  try {
    replaceLearningState(next);
  } finally {
    applyingRemote = false;
  }
}

async function pullState(userId: string): Promise<void> {
  setStatus("syncing");
  try {
    const res = await api<{ state: Partial<LearningState> | null; version: number }>(
      "/api/me/state",
    );
    const owner = readJson<string | null>(OWNER_KEY, null);
    writeJson(VERSION_KEY, res.version);
    if (owner && owner !== userId) {
      // Máy dùng chung: tiến độ cục bộ là của tài khoản khác ⇒ không trộn vào tài khoản này.
      applyRemote(res.state ?? {});
      writeJson(OUTBOX_KEY, []);
    } else if (res.state) {
      // Dữ liệu khách (hoặc thay đổi lúc ngoại tuyến) được gộp vào tài khoản, không bị mất.
      applyRemote(mergeLearningStates(getLearningState(), res.state));
    }
    writeJson(OWNER_KEY, userId);
    await pushState();
    await flushOutbox();
  } catch {
    setStatus("offline");
  }
}

function diffActivities(prev: LearningState, next: LearningState) {
  const added = (a: string[], b: string[]) => b.filter((x) => !a.includes(x));
  for (const path of added(prev.viewedLessons, next.viewedLessons).slice(0, 5)) {
    recordActivity({
      clientId: `view-${path}`.slice(0, 80),
      type: "lesson_view",
      ref: path,
      title: path.split("/").pop() ?? path,
    });
  }
  for (const id of added(prev.completedLabs, next.completedLabs).slice(0, 5)) {
    recordActivity({
      clientId: `lab-${id}`.slice(0, 80),
      type: "experiment_done",
      ref: id,
      title: id,
    });
  }
  for (const id of added(prev.solvedVdcIds, next.solvedVdcIds).slice(0, 5)) {
    recordActivity({ clientId: `vdc-${id}`.slice(0, 80), type: "vdc_solved", ref: id, title: id });
  }
}

/** Đăng xuất: cố gắng đẩy thay đổi cuối, xoá phiên trên máy chủ rồi dọn dữ liệu cá nhân khỏi máy này. */
export async function signOut(): Promise<void> {
  await pushState().catch(() => undefined);
  await flushOutbox().catch(() => undefined);
  try {
    await api("/api/auth/logout", { method: "POST" });
  } finally {
    const clean = status === "synced" && readOutbox().length === 0;
    if (clean) {
      // Chỉ dọn khi chắc chắn dữ liệu đã nằm an toàn trên tài khoản.
      applyRemote({});
      lastPushed = "";
      try {
        localStorage.removeItem(OWNER_KEY);
        localStorage.removeItem(VERSION_KEY);
      } catch {
        // ignore
      }
    }
    setStatus("guest");
    await refreshAuth();
  }
}

let started = false;

/** Gọi một lần ở phía trình duyệt (từ header). An toàn khi gọi lặp. */
export function startAccountSync(): void {
  if (started || typeof window === "undefined") return;
  started = true;

  let currentUserId: string | null = null;
  let previous = getLearningState();
  let activeSince = document.visibilityState === "visible" ? Date.now() : 0;
  let activeMs = 0;

  const reportStudyTime = () => {
    if (activeSince) {
      activeMs += Date.now() - activeSince;
      activeSince = document.visibilityState === "visible" ? Date.now() : 0;
    }
    const seconds = Math.round(activeMs / 1000);
    if (seconds >= 30 && getAuthSnapshot().user) {
      activeMs = 0;
      recordActivity({
        type: "study_time",
        ref: window.location.pathname,
        durationSec: Math.min(seconds, 3600),
      });
    }
  };

  subscribeAuth(() => {
    const user = getAuthSnapshot().user;
    if (user && user.id !== currentUserId) {
      currentUserId = user.id;
      void pullState(user.id);
    } else if (!user) {
      currentUserId = null;
      setStatus("guest");
    }
  });

  subscribeLearningState((next) => {
    const prev = previous;
    previous = next;
    if (applyingRemote || !getAuthSnapshot().user) return;
    diffActivities(prev, next);
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(() => void pushState(), 1500);
  });

  window.addEventListener("online", () => {
    void pushState();
    void flushOutbox();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      reportStudyTime();
      void flushOutbox();
    } else {
      activeSince = Date.now();
    }
  });
  window.setInterval(reportStudyTime, 5 * 60 * 1000);

  void refreshAuth();
}
