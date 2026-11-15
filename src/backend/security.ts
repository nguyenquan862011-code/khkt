/**
 * TamGiang Physics — tiện ích bảo mật phía máy chủ.
 * Mật khẩu được băm bằng scrypt (muối riêng cho từng tài khoản); phiên đăng nhập và
 * mã khôi phục chỉ lưu dạng băm SHA-256, không bao giờ lưu giá trị gốc.
 */
import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const SCRYPT_N_LOG2 = 15;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LENGTH = 64;

function scryptAsync(password: string, salt: Buffer, nLog2: number, r: number, p: number) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(
      password.normalize("NFKC"),
      salt,
      KEY_LENGTH,
      { N: 2 ** nLog2, r, p, maxmem: 128 * 1024 * 1024 },
      (err, key) => (err ? reject(err) : resolve(key)),
    );
  });
}

export async function hashSecret(secret: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scryptAsync(secret, salt, SCRYPT_N_LOG2, SCRYPT_R, SCRYPT_P);
  return [
    "scrypt",
    SCRYPT_N_LOG2,
    SCRYPT_R,
    SCRYPT_P,
    salt.toString("base64"),
    key.toString("base64"),
  ].join("$");
}

export async function verifySecret(secret: string, stored: string | null): Promise<boolean> {
  if (!stored) {
    // Cân bằng thời gian xử lý để không lộ việc email có tồn tại hay không.
    await scryptAsync(secret, Buffer.alloc(16), SCRYPT_N_LOG2, SCRYPT_R, SCRYPT_P);
    return false;
  }
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, nLog2, r, p, saltB64, keyB64] = parts as [
    string,
    string,
    string,
    string,
    string,
    string,
  ];
  const expected = Buffer.from(keyB64, "base64");
  const actual = await scryptAsync(
    secret,
    Buffer.from(saltB64, "base64"),
    Number(nLog2),
    Number(r),
    Number(p),
  );
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

export function randomId(prefix: string): string {
  return `${prefix}_${randomBytes(12).toString("base64url")}`;
}

/** Mã khôi phục dễ đọc, ví dụ "TG-7K2M-Q9XD-4HPA-W3NB" (80 bit entropy). */
export function randomRecoveryCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(16);
  let out = "";
  for (let i = 0; i < 16; i++) {
    out += alphabet[bytes[i]! % alphabet.length];
    if (i % 4 === 3 && i < 15) out += "-";
  }
  return `TG-${out}`;
}

export function normalizeRecoveryCode(code: string): string {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx < 0) continue;
    const name = part.slice(0, idx).trim();
    if (!name) continue;
    try {
      out[name] = decodeURIComponent(part.slice(idx + 1).trim());
    } catch {
      // bỏ qua cookie sai định dạng
    }
  }
  return out;
}

export interface CookieOptions {
  maxAgeSec: number;
  secure: boolean;
  /** Trang đang chạy trong iframe khác site (bản xem trước) → cần SameSite=None; Partitioned. */
  embedded?: boolean;
}

export function serializeCookie(name: string, value: string, opts: CookieOptions): string {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    `Max-Age=${Math.max(0, Math.floor(opts.maxAgeSec))}`,
  ];
  if (opts.secure) parts.push("Secure");
  if (opts.secure && opts.embedded) parts.push("SameSite=None", "Partitioned");
  else parts.push("SameSite=Lax");
  return parts.join("; ");
}

/** Giới hạn tần suất theo cửa sổ trượt, lưu trong bộ nhớ tiến trình. */
export class RateLimiter {
  private hits = new Map<string, number[]>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  /** Trả về số giây cần chờ (0 nếu còn được phép). */
  check(key: string, now = Date.now()): number {
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    if (recent.length >= this.limit) {
      this.hits.set(key, recent);
      return Math.ceil((this.windowMs - (now - recent[0]!)) / 1000);
    }
    recent.push(now);
    this.hits.set(key, recent);
    if (this.hits.size > 5000) {
      for (const [k, list] of this.hits) {
        if (!list.some((t) => now - t < this.windowMs)) this.hits.delete(k);
      }
    }
    return 0;
  }

  reset(key: string): void {
    this.hits.delete(key);
  }
}
