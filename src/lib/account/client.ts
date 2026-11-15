/**
 * Lớp gọi API tài khoản TamGiang Physics phía trình duyệt.
 * Phiên đăng nhập nằm trong cookie HttpOnly do máy chủ cấp — không có mật khẩu hay token nào
 * được ghi vào localStorage/sessionStorage.
 */
import { useSyncExternalStore } from "react";

export interface AccountUser {
  id: string;
  email: string;
  displayName: string;
  grade: string | null;
  avatar: string | null;
  role: "student" | "teacher" | "admin";
  emailVerified: boolean;
  hasPassword: boolean;
  hasRecoveryCode: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface AccountFeatures {
  accounts: boolean;
  google: boolean;
  mail: boolean;
}

export interface AuthSnapshot {
  status: "loading" | "ready";
  user: AccountUser | null;
  features: AccountFeatures;
}

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly data?: Record<string, unknown>,
  ) {
    super(message);
  }
}

export async function api<T = Record<string, unknown>>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const method = options.method ?? "GET";
  let response: Response;
  try {
    const init: RequestInit = { method, credentials: "same-origin" };
    if (method !== "GET") {
      init.headers = { "Content-Type": "application/json" };
      init.body = JSON.stringify(options.body ?? {});
    }
    response = await fetch(path, init);
  } catch {
    throw new ApiError("offline", "Không kết nối được máy chủ. Hãy kiểm tra mạng rồi thử lại.", 0);
  }
  let data: Record<string, unknown> = {};
  try {
    data = (await response.json()) as Record<string, unknown>;
  } catch {
    // phản hồi không phải JSON
  }
  if (!response.ok || data["ok"] === false) {
    const error = (data["error"] ?? {}) as { code?: string; message?: string };
    throw new ApiError(
      error.code ?? "http_" + response.status,
      error.message ?? "Máy chủ đang bận, vui lòng thử lại sau.",
      response.status,
      data,
    );
  }
  return data as T;
}

const NO_FEATURES: AccountFeatures = { accounts: false, google: false, mail: false };
let snapshot: AuthSnapshot = { status: "loading", user: null, features: NO_FEATURES };
const SERVER_SNAPSHOT: AuthSnapshot = { status: "loading", user: null, features: NO_FEATURES };
const listeners = new Set<() => void>();
let loading: Promise<AuthSnapshot> | null = null;

function publish(next: AuthSnapshot) {
  snapshot = next;
  listeners.forEach((fn) => fn());
}

export function getAuthSnapshot(): AuthSnapshot {
  return snapshot;
}

export function subscribeAuth(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Hỏi máy chủ xem phiên hiện tại là của ai. Lỗi mạng ⇒ coi như khách, không chặn việc học. */
export function refreshAuth(): Promise<AuthSnapshot> {
  if (loading) return loading;
  loading = api<{ user: AccountUser | null; features: AccountFeatures }>("/api/auth/me")
    .then((res) => ({ status: "ready" as const, user: res.user, features: res.features }))
    .catch(() => ({ status: "ready" as const, user: null, features: snapshot.features }))
    .then((next) => {
      loading = null;
      publish(next);
      return next;
    });
  return loading;
}

export function setAuthUser(user: AccountUser | null) {
  publish({ ...snapshot, status: "ready", user });
}

export function useAuth(): AuthSnapshot {
  return useSyncExternalStore(subscribeAuth, getAuthSnapshot, () => SERVER_SNAPSHOT);
}

export const GRADE_OPTIONS = ["Lớp 10", "Lớp 11", "Lớp 12"] as const;

export const AVATAR_PRESETS: Record<string, { label: string; emoji: string; bg: string }> = {
  atom: { label: "Nguyên tử", emoji: "⚛️", bg: "#0f3d2c" },
  magnet: { label: "Nam châm", emoji: "🧲", bg: "#3d1f1f" },
  wave: { label: "Sóng", emoji: "🌊", bg: "#12324a" },
  bolt: { label: "Tia điện", emoji: "⚡", bg: "#4a3a0c" },
  rocket: { label: "Tên lửa", emoji: "🚀", bg: "#2b2350" },
  scope: { label: "Kính thiên văn", emoji: "🔭", bg: "#1d3a3a" },
};
