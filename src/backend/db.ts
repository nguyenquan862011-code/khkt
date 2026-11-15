/**
 * TamGiang Physics — cơ sở dữ liệu tài khoản & nhật ký học tập (SQLite tích hợp của Node.js).
 *
 * Quan hệ: users 1—n sessions, auth_tokens, attempts, activity; attempts 1—n attempt_answers;
 * users 1—1 user_state. Mọi bảng dữ liệu cá nhân đều có user_id NOT NULL + khóa ngoại
 * ON DELETE CASCADE, và tầng truy cập (store.ts) luôn bắt buộc truyền userId của phiên đăng nhập.
 * lesson_key / question_id tham chiếu tới danh mục bài học và ngân hàng câu hỏi tĩnh trong mã nguồn.
 */
import path from "node:path";
import fs from "node:fs";

type SqlValue = string | number | bigint | null | Uint8Array;

export interface Statement {
  run(...params: SqlValue[]): { changes: number | bigint; lastInsertRowid: number | bigint };
  get(...params: SqlValue[]): Record<string, unknown> | undefined;
  all(...params: SqlValue[]): Record<string, unknown>[];
}

export interface Database {
  exec(sql: string): void;
  prepare(sql: string): Statement;
  close(): void;
}

const SCHEMA_VERSION = 1;

const SCHEMA_V1 = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT,
  display_name TEXT NOT NULL,
  grade TEXT,
  avatar TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student','teacher','admin')),
  email_verified INTEGER NOT NULL DEFAULT 0,
  google_sub TEXT UNIQUE,
  recovery_hash TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_login_at TEXT
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  user_agent TEXT
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE TABLE IF NOT EXISTS auth_tokens (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('reset','verify')),
  expires_at TEXT NOT NULL,
  used_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_user ON auth_tokens(user_id, kind);
CREATE TABLE IF NOT EXISTS attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL,
  source TEXT NOT NULL,
  title TEXT NOT NULL,
  grade TEXT,
  topic TEXT,
  lesson_key TEXT,
  level TEXT,
  started_at TEXT NOT NULL,
  finished_at TEXT NOT NULL,
  duration_sec INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL,
  correct INTEGER NOT NULL,
  wrong INTEGER NOT NULL,
  score REAL NOT NULL,
  meta_json TEXT,
  created_at TEXT NOT NULL,
  UNIQUE (user_id, client_id)
);
CREATE INDEX IF NOT EXISTS idx_attempts_user_time ON attempts(user_id, finished_at DESC);
CREATE TABLE IF NOT EXISTS attempt_answers (
  attempt_id TEXT NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  question_id TEXT NOT NULL,
  lesson_key TEXT,
  level TEXT,
  kind TEXT,
  is_correct INTEGER NOT NULL,
  detail_json TEXT NOT NULL,
  PRIMARY KEY (attempt_id, position)
);
CREATE TABLE IF NOT EXISTS activity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL,
  type TEXT NOT NULL,
  ref TEXT,
  title TEXT,
  grade TEXT,
  topic TEXT,
  duration_sec INTEGER NOT NULL DEFAULT 0,
  meta_json TEXT,
  occurred_at TEXT NOT NULL,
  UNIQUE (user_id, client_id)
);
CREATE INDEX IF NOT EXISTS idx_activity_user_time ON activity(user_id, occurred_at DESC);
CREATE TABLE IF NOT EXISTS user_state (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  state_json TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);
`;

interface DbHolder {
  db: Database | null;
  error: string | null;
  path: string | null;
  lastBackupDay: string | null;
}

const globalKey = "__tamgiangAccountDb__";
const holder: DbHolder = ((globalThis as Record<string, unknown>)[globalKey] as DbHolder) ?? {
  db: null,
  error: null,
  path: null,
  lastBackupDay: null,
};
(globalThis as Record<string, unknown>)[globalKey] = holder;

function loadSqlite(): { DatabaseSync: new (file: string) => Database } | null {
  try {
    const getBuiltin = (process as unknown as { getBuiltinModule?: (id: string) => unknown })
      .getBuiltinModule;
    if (typeof getBuiltin !== "function") return null;
    const mod = getBuiltin("node:sqlite") as { DatabaseSync?: new (file: string) => Database };
    return mod?.DatabaseSync ? { DatabaseSync: mod.DatabaseSync } : null;
  } catch {
    return null;
  }
}

export function resolveDataDir(): string {
  return path.resolve(process.env["TAMGIANG_DATA_DIR"] || path.join(process.cwd(), "data"));
}

export function openDatabase(file: string): Database {
  const sqlite = loadSqlite();
  if (!sqlite) {
    throw new Error(
      "Môi trường chạy không có node:sqlite (cần Node.js ≥ 22.5). Tính năng tài khoản tạm tắt.",
    );
  }
  if (file !== ":memory:") fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new sqlite.DatabaseSync(file);
  db.exec("PRAGMA foreign_keys = ON;");
  if (file !== ":memory:") db.exec("PRAGMA journal_mode = WAL; PRAGMA synchronous = NORMAL;");
  const current = Number(db.prepare("PRAGMA user_version").get()?.["user_version"] ?? 0);
  if (current < SCHEMA_VERSION) {
    db.exec("BEGIN");
    try {
      db.exec(SCHEMA_V1);
      db.exec(`PRAGMA user_version = ${SCHEMA_VERSION}`);
      db.exec("COMMIT");
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
  }
  return db;
}

/** Trả về kết nối dùng chung; null nếu môi trường không hỗ trợ (website vẫn chạy ở chế độ khách). */
export function getDatabase(): Database | null {
  if (holder.db) return holder.db;
  if (holder.error) return null;
  try {
    const file =
      process.env["TAMGIANG_DB_FILE"] || path.join(resolveDataDir(), "tamgiang-accounts.sqlite");
    holder.db = openDatabase(file);
    holder.path = file;
    return holder.db;
  } catch (err) {
    holder.error = err instanceof Error ? err.message : String(err);
    console.error("[TamGiang Accounts] Không mở được cơ sở dữ liệu:", holder.error);
    return null;
  }
}

/** Dùng cho kiểm thử: thay kết nối dùng chung bằng một CSDL khác (ví dụ ":memory:"). */
export function setDatabaseForTesting(db: Database | null): void {
  holder.db = db;
  holder.error = null;
  holder.path = null;
}

/** Sao lưu mỗi ngày một bản (giữ 7 bản gần nhất) bằng VACUUM INTO — an toàn khi đang ghi. */
export function runDailyBackup(now = new Date()): string | null {
  const db = holder.db;
  if (!db || !holder.path || holder.path === ":memory:") return null;
  const day = now.toISOString().slice(0, 10);
  if (holder.lastBackupDay === day) return null;
  holder.lastBackupDay = day;
  try {
    const dir = path.join(path.dirname(holder.path), "backups");
    fs.mkdirSync(dir, { recursive: true });
    const target = path.join(dir, `tamgiang-accounts-${day}.sqlite`);
    if (!fs.existsSync(target)) {
      db.exec(`VACUUM INTO '${target.replace(/'/g, "''")}'`);
    }
    const old = fs
      .readdirSync(dir)
      .filter((f) => /^tamgiang-accounts-\d{4}-\d{2}-\d{2}\.sqlite$/.test(f))
      .sort()
      .slice(0, -7);
    for (const f of old) fs.rmSync(path.join(dir, f), { force: true });
    return target;
  } catch (err) {
    console.warn("[TamGiang Accounts] Sao lưu thất bại:", err);
    return null;
  }
}
