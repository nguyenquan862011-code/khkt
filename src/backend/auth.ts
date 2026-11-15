/**
 * TamGiang Physics — nghiệp vụ tài khoản: đăng ký, đăng nhập, phiên, khôi phục mật khẩu.
 */
import type { Database } from "./db";
import {
  hashSecret,
  normalizeRecoveryCode,
  randomId,
  randomRecoveryCode,
  randomToken,
  sha256,
  verifySecret,
} from "./security";

export const SESSION_TTL_SEC = 30 * 24 * 3600;
const RESET_TTL_MS = 30 * 60 * 1000;
const VERIFY_TTL_MS = 3 * 24 * 3600 * 1000;

export type UserRole = "student" | "teacher" | "admin";

export interface PublicUser {
  id: string;
  email: string;
  displayName: string;
  grade: string | null;
  avatar: string | null;
  role: UserRole;
  emailVerified: boolean;
  hasPassword: boolean;
  hasRecoveryCode: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export class AuthError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 400,
  ) {
    super(message);
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const GRADES = ["Lớp 10", "Lớp 11", "Lớp 12"] as const;

export function normalizeEmail(email: unknown): string {
  const value = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!value || value.length > 254 || !EMAIL_RE.test(value)) {
    throw new AuthError("invalid_email", "Email không hợp lệ.");
  }
  return value;
}

export function validatePassword(password: unknown): string {
  if (typeof password !== "string" || password.length < 8) {
    throw new AuthError("weak_password", "Mật khẩu cần ít nhất 8 ký tự.");
  }
  if (password.length > 128) throw new AuthError("weak_password", "Mật khẩu quá dài.");
  if (!/[A-Za-zÀ-ỹ]/.test(password) || !/\d/.test(password)) {
    throw new AuthError("weak_password", "Mật khẩu cần có cả chữ và số.");
  }
  return password;
}

export function validateDisplayName(name: unknown): string {
  const value = typeof name === "string" ? name.replace(/\s+/g, " ").trim() : "";
  if (value.length < 2 || value.length > 60) {
    throw new AuthError("invalid_name", "Tên hiển thị cần từ 2 đến 60 ký tự.");
  }
  return value;
}

export function validateGrade(grade: unknown): string | null {
  if (grade == null || grade === "") return null;
  if (typeof grade === "string" && (GRADES as readonly string[]).includes(grade)) return grade;
  throw new AuthError("invalid_grade", "Lớp học không hợp lệ.");
}

/** Ảnh đại diện: mã màu/biểu tượng có sẵn ("preset:...") hoặc ảnh nhỏ data URL (≤ 80 KB). */
export function validateAvatar(avatar: unknown): string | null {
  if (avatar == null || avatar === "") return null;
  if (typeof avatar !== "string") throw new AuthError("invalid_avatar", "Ảnh đại diện lỗi.");
  if (/^preset:[a-z0-9-]{1,24}$/.test(avatar)) return avatar;
  if (/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(avatar)) {
    if (avatar.length > 110_000) {
      throw new AuthError("invalid_avatar", "Ảnh đại diện quá lớn (tối đa khoảng 80 KB).");
    }
    return avatar;
  }
  if (/^https:\/\/[a-z0-9.-]+\.googleusercontent\.com\/[\w\-./=]+$/i.test(avatar)) return avatar;
  throw new AuthError("invalid_avatar", "Định dạng ảnh đại diện không được hỗ trợ.");
}

function adminEmails(): string[] {
  return (process.env["TAMGIANG_ADMIN_EMAILS"] || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

type UserRow = Record<string, unknown>;

export function toPublicUser(row: UserRow): PublicUser {
  const email = String(row["email"]);
  const verified = Number(row["email_verified"]) === 1;
  let role = String(row["role"]) as UserRole;
  // Quyền quản trị theo biến môi trường chỉ áp dụng khi email đã được xác thực.
  if (verified && adminEmails().includes(email.toLowerCase())) role = "admin";
  return {
    id: String(row["id"]),
    email,
    displayName: String(row["display_name"]),
    grade: (row["grade"] as string | null) ?? null,
    avatar: (row["avatar"] as string | null) ?? null,
    role,
    emailVerified: verified,
    hasPassword: Boolean(row["password_hash"]),
    hasRecoveryCode: Boolean(row["recovery_hash"]),
    createdAt: String(row["created_at"]),
    lastLoginAt: (row["last_login_at"] as string | null) ?? null,
  };
}

function findUserByEmail(db: Database, email: string): UserRow | undefined {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
}

export function findUserById(db: Database, id: string): UserRow | undefined {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
}

export async function registerUser(
  db: Database,
  input: { email: unknown; password: unknown; displayName: unknown; grade?: unknown },
): Promise<{ user: PublicUser; recoveryCode: string }> {
  const email = normalizeEmail(input.email);
  const password = validatePassword(input.password);
  const displayName = validateDisplayName(input.displayName);
  const grade = validateGrade(input.grade);
  if (findUserByEmail(db, email)) {
    throw new AuthError("email_taken", "Email này đã được đăng ký. Hãy đăng nhập.", 409);
  }
  const recoveryCode = randomRecoveryCode();
  const [passwordHash, recoveryHash] = await Promise.all([
    hashSecret(password),
    hashSecret(normalizeRecoveryCode(recoveryCode)),
  ]);
  const id = randomId("u");
  const now = new Date().toISOString();
  try {
    db.prepare(
      `INSERT INTO users (id, email, password_hash, display_name, grade, recovery_hash, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(id, email, passwordHash, displayName, grade, recoveryHash, now, now);
  } catch (err) {
    if (String(err).includes("UNIQUE")) {
      throw new AuthError("email_taken", "Email này đã được đăng ký. Hãy đăng nhập.", 409);
    }
    throw err;
  }
  return { user: toPublicUser(findUserById(db, id)!), recoveryCode };
}

export async function authenticate(
  db: Database,
  input: { email: unknown; password: unknown },
): Promise<PublicUser> {
  const invalid = new AuthError("invalid_credentials", "Email hoặc mật khẩu không đúng.", 401);
  let email: string;
  try {
    email = normalizeEmail(input.email);
  } catch {
    throw invalid;
  }
  const password = typeof input.password === "string" ? input.password : "";
  const row = findUserByEmail(db, email);
  const ok = await verifySecret(password, (row?.["password_hash"] as string | null) ?? null);
  if (!row || !ok) throw invalid;
  return toPublicUser(row);
}

export function createSession(db: Database, userId: string, userAgent: string | null): string {
  const token = randomToken(32);
  const now = Date.now();
  db.prepare(
    "INSERT INTO sessions (token_hash, user_id, created_at, expires_at, user_agent) VALUES (?, ?, ?, ?, ?)",
  ).run(
    sha256(token),
    userId,
    new Date(now).toISOString(),
    new Date(now + SESSION_TTL_SEC * 1000).toISOString(),
    userAgent ? userAgent.slice(0, 200) : null,
  );
  db.prepare("UPDATE users SET last_login_at = ? WHERE id = ?").run(
    new Date(now).toISOString(),
    userId,
  );
  db.prepare("DELETE FROM sessions WHERE expires_at < ?").run(new Date(now).toISOString());
  return token;
}

export function getSessionUser(db: Database, token: string | undefined): PublicUser | null {
  if (!token) return null;
  const row = db
    .prepare(
      `SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > ?`,
    )
    .get(sha256(token), new Date().toISOString());
  return row ? toPublicUser(row) : null;
}

export function destroySession(db: Database, token: string | undefined): void {
  if (token) db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(sha256(token));
}

export function destroyAllSessions(db: Database, userId: string): void {
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
}

function issueAuthToken(db: Database, userId: string, kind: "reset" | "verify"): string {
  const token = randomToken(32);
  db.prepare("DELETE FROM auth_tokens WHERE user_id = ? AND kind = ?").run(userId, kind);
  db.prepare(
    "INSERT INTO auth_tokens (token_hash, user_id, kind, expires_at) VALUES (?, ?, ?, ?)",
  ).run(
    sha256(token),
    userId,
    kind,
    new Date(Date.now() + (kind === "reset" ? RESET_TTL_MS : VERIFY_TTL_MS)).toISOString(),
  );
  return token;
}

function consumeAuthToken(db: Database, token: unknown, kind: "reset" | "verify"): string {
  const bad = new AuthError("invalid_token", "Liên kết không hợp lệ hoặc đã hết hạn.");
  if (typeof token !== "string" || token.length < 20) throw bad;
  const row = db
    .prepare("SELECT * FROM auth_tokens WHERE token_hash = ? AND kind = ?")
    .get(sha256(token), kind);
  if (!row || row["used_at"] || String(row["expires_at"]) < new Date().toISOString()) throw bad;
  db.prepare("UPDATE auth_tokens SET used_at = ? WHERE token_hash = ?").run(
    new Date().toISOString(),
    sha256(token),
  );
  return String(row["user_id"]);
}

/** Tạo token đặt lại mật khẩu; trả về null nếu email không tồn tại (không tiết lộ cho client). */
export function createPasswordResetToken(
  db: Database,
  emailInput: unknown,
): { token: string; email: string } | null {
  let email: string;
  try {
    email = normalizeEmail(emailInput);
  } catch {
    return null;
  }
  const row = findUserByEmail(db, email);
  if (!row) return null;
  return { token: issueAuthToken(db, String(row["id"]), "reset"), email };
}

export function createEmailVerifyToken(db: Database, userId: string): string {
  return issueAuthToken(db, userId, "verify");
}

export function verifyEmailWithToken(db: Database, token: unknown): PublicUser {
  const userId = consumeAuthToken(db, token, "verify");
  db.prepare("UPDATE users SET email_verified = 1, updated_at = ? WHERE id = ?").run(
    new Date().toISOString(),
    userId,
  );
  return toPublicUser(findUserById(db, userId)!);
}

async function setPassword(db: Database, userId: string, password: string): Promise<void> {
  const hash = await hashSecret(password);
  db.prepare("UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?").run(
    hash,
    new Date().toISOString(),
    userId,
  );
  // Đổi mật khẩu → đăng xuất khỏi mọi thiết bị.
  destroyAllSessions(db, userId);
  db.prepare("DELETE FROM auth_tokens WHERE user_id = ? AND kind = 'reset'").run(userId);
}

export async function resetPasswordWithToken(
  db: Database,
  input: { token: unknown; password: unknown },
): Promise<PublicUser> {
  const password = validatePassword(input.password);
  const userId = consumeAuthToken(db, input.token, "reset");
  await setPassword(db, userId, password);
  // Nhận được email đặt lại ⇒ chủ tài khoản sở hữu hộp thư này.
  db.prepare("UPDATE users SET email_verified = 1 WHERE id = ?").run(userId);
  return toPublicUser(findUserById(db, userId)!);
}

export async function resetPasswordWithRecoveryCode(
  db: Database,
  input: { email: unknown; recoveryCode: unknown; password: unknown },
): Promise<{ user: PublicUser; recoveryCode: string }> {
  const password = validatePassword(input.password);
  const bad = new AuthError("invalid_recovery", "Email hoặc mã khôi phục không đúng.", 401);
  let email: string;
  try {
    email = normalizeEmail(input.email);
  } catch {
    throw bad;
  }
  const code = typeof input.recoveryCode === "string" ? input.recoveryCode : "";
  const row = findUserByEmail(db, email);
  const ok = await verifySecret(
    normalizeRecoveryCode(code),
    (row?.["recovery_hash"] as string | null) ?? null,
  );
  if (!row || !ok) throw bad;
  const userId = String(row["id"]);
  await setPassword(db, userId, password);
  // Mã khôi phục chỉ dùng một lần → cấp mã mới.
  const recoveryCode = await rotateRecoveryCode(db, userId);
  return { user: toPublicUser(findUserById(db, userId)!), recoveryCode };
}

export async function rotateRecoveryCode(db: Database, userId: string): Promise<string> {
  const code = randomRecoveryCode();
  const hash = await hashSecret(normalizeRecoveryCode(code));
  db.prepare("UPDATE users SET recovery_hash = ?, updated_at = ? WHERE id = ?").run(
    hash,
    new Date().toISOString(),
    userId,
  );
  return code;
}

export async function verifyCurrentPassword(
  db: Database,
  userId: string,
  password: unknown,
): Promise<void> {
  const row = findUserById(db, userId);
  const ok = await verifySecret(
    typeof password === "string" ? password : "",
    (row?.["password_hash"] as string | null) ?? null,
  );
  if (!ok) throw new AuthError("invalid_credentials", "Mật khẩu hiện tại không đúng.", 401);
}

export async function changePassword(
  db: Database,
  userId: string,
  input: { currentPassword: unknown; newPassword: unknown },
): Promise<void> {
  const next = validatePassword(input.newPassword);
  const row = findUserById(db, userId);
  // Tài khoản Google chưa có mật khẩu được phép đặt mật khẩu lần đầu.
  if (row?.["password_hash"]) await verifyCurrentPassword(db, userId, input.currentPassword);
  await setPassword(db, userId, next);
}

export function updateProfile(
  db: Database,
  userId: string,
  patch: { displayName?: unknown; grade?: unknown; avatar?: unknown },
): PublicUser {
  const row = findUserById(db, userId);
  if (!row) throw new AuthError("not_found", "Không tìm thấy tài khoản.", 404);
  const displayName =
    patch.displayName !== undefined
      ? validateDisplayName(patch.displayName)
      : String(row["display_name"]);
  const grade =
    patch.grade !== undefined ? validateGrade(patch.grade) : (row["grade"] as string | null);
  const avatar =
    patch.avatar !== undefined ? validateAvatar(patch.avatar) : (row["avatar"] as string | null);
  db.prepare(
    "UPDATE users SET display_name = ?, grade = ?, avatar = ?, updated_at = ? WHERE id = ?",
  ).run(displayName, grade, avatar, new Date().toISOString(), userId);
  return toPublicUser(findUserById(db, userId)!);
}

export function deleteUser(db: Database, userId: string): void {
  // ON DELETE CASCADE xóa toàn bộ phiên, bài làm, nhật ký và tiến độ của tài khoản.
  db.prepare("DELETE FROM users WHERE id = ?").run(userId);
}

/** Đăng nhập Google: tìm theo google_sub, liên kết theo email đã xác thực hoặc tạo mới. */
export function upsertGoogleUser(
  db: Database,
  profile: {
    sub: string;
    email: string;
    emailVerified: boolean;
    name?: string | undefined;
    picture?: string | undefined;
  },
): PublicUser {
  if (!profile.emailVerified) {
    throw new AuthError("google_unverified", "Email Google chưa được xác thực.", 403);
  }
  const email = normalizeEmail(profile.email);
  const now = new Date().toISOString();
  const bySub = db.prepare("SELECT * FROM users WHERE google_sub = ?").get(profile.sub);
  if (bySub) return toPublicUser(bySub);
  const byEmail = findUserByEmail(db, email);
  if (byEmail) {
    const existingId = String(byEmail["id"]);
    if (Number(byEmail["email_verified"]) !== 1) {
      // Tài khoản chưa xác thực có thể do người khác đăng ký trước bằng email này:
      // vô hiệu mật khẩu, mã khôi phục và mọi phiên cũ trước khi liên kết với Google.
      db.prepare("UPDATE users SET password_hash = NULL, recovery_hash = NULL WHERE id = ?").run(
        existingId,
      );
      destroyAllSessions(db, existingId);
    }
    db.prepare(
      "UPDATE users SET google_sub = ?, email_verified = 1, updated_at = ? WHERE id = ?",
    ).run(profile.sub, now, existingId);
    return toPublicUser(findUserById(db, String(byEmail["id"]))!);
  }
  const id = randomId("u");
  let avatar: string | null = null;
  try {
    avatar = validateAvatar(profile.picture);
  } catch {
    avatar = null;
  }
  const name = (profile.name || email.split("@")[0] || "Học sinh").slice(0, 60);
  db.prepare(
    `INSERT INTO users (id, email, display_name, avatar, email_verified, google_sub, created_at, updated_at)
     VALUES (?, ?, ?, ?, 1, ?, ?, ?)`,
  ).run(id, email, name.length < 2 ? "Học sinh" : name, avatar, profile.sub, now, now);
  return toPublicUser(findUserById(db, id)!);
}
