/**
 * TamGiang Physics — API tài khoản & nhật ký học tập.
 *   /api/auth/*  đăng ký, đăng nhập, đăng xuất, quên/đặt lại mật khẩu, xác thực email, Google
 *   /api/me/*    hồ sơ, tiến độ (đồng bộ đa thiết bị), bài làm, nhật ký, sao lưu — chỉ dữ liệu của chính mình
 *   /api/admin/* thống kê tổng hợp cho giáo viên / quản trị
 */
import {
  AuthError,
  SESSION_TTL_SEC,
  authenticate,
  changePassword,
  createEmailVerifyToken,
  createPasswordResetToken,
  createSession,
  deleteUser,
  destroySession,
  getSessionUser,
  registerUser,
  resetPasswordWithRecoveryCode,
  resetPasswordWithToken,
  rotateRecoveryCode,
  updateProfile,
  upsertGoogleUser,
  verifyCurrentPassword,
  verifyEmailWithToken,
  type PublicUser,
} from "./auth";
import { getDatabase, runDailyBackup, type Database } from "./db";
import { isMailConfigured, sendAccountMail } from "./mailer";
import { RateLimiter, parseCookies, randomToken, serializeCookie } from "./security";
import {
  StoreError,
  deleteAttempt,
  exportUserData,
  getAdminOverview,
  getAttempt,
  getUserState,
  listActivities,
  listAttempts,
  putUserState,
  saveActivities,
  saveAttempt,
} from "./store";

export const SESSION_COOKIE = "tg_session";
const OAUTH_STATE_COOKIE = "tg_oauth_state";

const loginLimiter = new RateLimiter(10, 10 * 60_000);
const registerLimiter = new RateLimiter(10, 60 * 60_000);
const forgotLimiter = new RateLimiter(5, 60 * 60_000);
const resetLimiter = new RateLimiter(10, 60 * 60_000);

class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

function json(data: unknown, status = 200, extraHeaders?: Headers): Response {
  const headers = extraHeaders ?? new Headers();
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(JSON.stringify(data), { status, headers });
}

function errorResponse(status: number, code: string, message: string, extra?: object): Response {
  return json({ ok: false, error: { code, message, ...extra } }, status);
}

function isSecureRequest(request: Request, url: URL): boolean {
  const proto = request.headers.get("x-forwarded-proto");
  return url.protocol === "https:" || (proto ?? "").split(",")[0]?.trim() === "https";
}

function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

function publicOrigin(request: Request, url: URL): string {
  const configured = process.env["TAMGIANG_PUBLIC_URL"];
  if (configured) return configured.replace(/\/+$/, "");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || url.host;
  return `${isSecureRequest(request, url) ? "https" : "http"}://${host}`;
}

/** Chống CSRF: yêu cầu thay đổi dữ liệu phải xuất phát từ chính website này. */
function assertSameOrigin(request: Request, url: URL): void {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    throw new HttpError(403, "cross_site", "Yêu cầu bị từ chối (khác nguồn).");
  }
  const origin = request.headers.get("origin");
  if (!origin) return; // công cụ không phải trình duyệt
  let originHost = "";
  try {
    originHost = new URL(origin).host;
  } catch {
    throw new HttpError(403, "cross_site", "Yêu cầu bị từ chối (khác nguồn).");
  }
  const allowed = new Set<string>([url.host]);
  for (const name of ["host", "x-forwarded-host"]) {
    const v = request.headers.get(name);
    if (v) allowed.add(v.split(",")[0]!.trim());
  }
  if (process.env["TAMGIANG_PUBLIC_URL"]) {
    try {
      allowed.add(new URL(process.env["TAMGIANG_PUBLIC_URL"]).host);
    } catch {
      // bỏ qua cấu hình sai
    }
  }
  if (!allowed.has(originHost)) {
    throw new HttpError(403, "cross_site", "Yêu cầu bị từ chối (khác nguồn).");
  }
}

async function readJson(request: Request, maxBytes = 64_000): Promise<Record<string, unknown>> {
  const type = request.headers.get("content-type") ?? "";
  if (!type.includes("application/json")) {
    throw new HttpError(415, "unsupported_media", "Yêu cầu phải ở định dạng JSON.");
  }
  const text = await request.text();
  if (text.length > maxBytes) throw new HttpError(413, "too_large", "Dữ liệu gửi lên quá lớn.");
  try {
    const parsed = JSON.parse(text || "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("shape");
    return parsed as Record<string, unknown>;
  } catch {
    throw new HttpError(400, "invalid_json", "Dữ liệu JSON không hợp lệ.");
  }
}

function sessionCookieHeaders(request: Request, url: URL, token: string): Headers {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    serializeCookie(SESSION_COOKIE, token, {
      maxAgeSec: SESSION_TTL_SEC,
      secure: isSecureRequest(request, url),
      embedded: request.headers.get("x-tg-embedded") === "1",
    }),
  );
  return headers;
}

function clearSessionHeaders(request: Request, url: URL): Headers {
  const headers = new Headers();
  const secure = isSecureRequest(request, url);
  headers.append("Set-Cookie", serializeCookie(SESSION_COOKIE, "", { maxAgeSec: 0, secure }));
  if (secure) {
    headers.append(
      "Set-Cookie",
      serializeCookie(SESSION_COOKIE, "", { maxAgeSec: 0, secure, embedded: true }),
    );
  }
  return headers;
}

function features(db: Database | null) {
  return {
    accounts: Boolean(db),
    google: Boolean(db && process.env["GOOGLE_CLIENT_ID"] && process.env["GOOGLE_CLIENT_SECRET"]),
    mail: Boolean(db && isMailConfigured()),
  };
}

function limited(waitSec: number): never {
  throw new HttpError(
    429,
    "rate_limited",
    `Bạn thao tác quá nhanh. Vui lòng thử lại sau ${Math.ceil(waitSec / 60)} phút.`,
  );
}

async function sendVerification(db: Database, request: Request, url: URL, user: PublicUser) {
  if (!isMailConfigured() && process.env["TAMGIANG_DEV_MAIL"] !== "1") return false;
  const token = createEmailVerifyToken(db, user.id);
  return sendAccountMail({
    to: user.email,
    subject: "Xác thực email tài khoản TamGiang Physics",
    intro: `Chào ${user.displayName}, hãy xác thực email để bảo vệ tài khoản học tập của bạn.`,
    actionLabel: "Xác thực email",
    actionUrl: `${publicOrigin(request, url)}/tai-khoan?verify=${encodeURIComponent(token)}`,
  });
}

async function handleAuth(
  db: Database,
  request: Request,
  url: URL,
  route: string,
  sessionToken: string | undefined,
  user: PublicUser | null,
): Promise<Response> {
  const method = request.method;
  const ip = clientIp(request);

  if (route === "register" && method === "POST") {
    const wait = registerLimiter.check(ip);
    if (wait) limited(wait);
    const body = await readJson(request);
    const created = await registerUser(db, {
      email: body["email"],
      password: body["password"],
      displayName: body["displayName"],
      grade: body["grade"],
    });
    const token = createSession(db, created.user.id, request.headers.get("user-agent"));
    const verificationSent = await sendVerification(db, request, url, created.user);
    return json(
      { ok: true, user: created.user, recoveryCode: created.recoveryCode, verificationSent },
      201,
      sessionCookieHeaders(request, url, token),
    );
  }

  if (route === "login" && method === "POST") {
    const body = await readJson(request);
    const key = `${ip}|${String(body["email"] ?? "").toLowerCase()}`;
    const wait = loginLimiter.check(key);
    if (wait) limited(wait);
    const authed = await authenticate(db, { email: body["email"], password: body["password"] });
    loginLimiter.reset(key);
    if (sessionToken) destroySession(db, sessionToken);
    const token = createSession(db, authed.id, request.headers.get("user-agent"));
    return json({ ok: true, user: authed }, 200, sessionCookieHeaders(request, url, token));
  }

  if (route === "logout" && method === "POST") {
    destroySession(db, sessionToken);
    return json({ ok: true }, 200, clearSessionHeaders(request, url));
  }

  if (route === "forgot" && method === "POST") {
    const wait = forgotLimiter.check(ip);
    if (wait) limited(wait);
    const body = await readJson(request);
    const canSend = isMailConfigured() || process.env["TAMGIANG_DEV_MAIL"] === "1";
    if (canSend) {
      const reset = createPasswordResetToken(db, body["email"]);
      if (reset) {
        await sendAccountMail({
          to: reset.email,
          subject: "Đặt lại mật khẩu TamGiang Physics",
          intro: "Bạn vừa yêu cầu đặt lại mật khẩu. Liên kết có hiệu lực trong 30 phút.",
          actionLabel: "Đặt lại mật khẩu",
          actionUrl: `${publicOrigin(request, url)}/tai-khoan?reset=${encodeURIComponent(reset.token)}`,
        });
      }
    }
    // Phản hồi giống nhau dù email có tồn tại hay không.
    return json({ ok: true, mailEnabled: isMailConfigured() });
  }

  if (route === "reset" && method === "POST") {
    const body = await readJson(request);
    const wait = resetLimiter.check(`${ip}|${String(body["email"] ?? "token").toLowerCase()}`);
    if (wait) limited(wait);
    if (typeof body["token"] === "string") {
      const updated = await resetPasswordWithToken(db, {
        token: body["token"],
        password: body["password"],
      });
      const token = createSession(db, updated.id, request.headers.get("user-agent"));
      return json({ ok: true, user: updated }, 200, sessionCookieHeaders(request, url, token));
    }
    const result = await resetPasswordWithRecoveryCode(db, {
      email: body["email"],
      recoveryCode: body["recoveryCode"],
      password: body["password"],
    });
    const token = createSession(db, result.user.id, request.headers.get("user-agent"));
    return json(
      { ok: true, user: result.user, recoveryCode: result.recoveryCode },
      200,
      sessionCookieHeaders(request, url, token),
    );
  }

  if (route === "verify" && method === "POST") {
    const body = await readJson(request);
    return json({ ok: true, user: verifyEmailWithToken(db, body["token"]) });
  }

  if (route === "resend-verification" && method === "POST") {
    if (!user) throw new HttpError(401, "unauthenticated", "Bạn cần đăng nhập.");
    const wait = forgotLimiter.check(`verify|${user.id}`);
    if (wait) limited(wait);
    return json({ ok: true, sent: await sendVerification(db, request, url, user) });
  }

  if (route === "google/start" && method === "GET") return googleStart(request, url);
  if (route === "google/callback" && method === "GET") return googleCallback(db, request, url);

  throw new HttpError(404, "not_found", "Không tìm thấy API.");
}

function googleStart(request: Request, url: URL): Response {
  const clientId = process.env["GOOGLE_CLIENT_ID"];
  if (!clientId || !process.env["GOOGLE_CLIENT_SECRET"]) {
    throw new HttpError(404, "google_disabled", "Đăng nhập Google chưa được cấu hình.");
  }
  const state = randomToken(24);
  const target = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  target.searchParams.set("client_id", clientId);
  target.searchParams.set("redirect_uri", `${publicOrigin(request, url)}/api/auth/google/callback`);
  target.searchParams.set("response_type", "code");
  target.searchParams.set("scope", "openid email profile");
  target.searchParams.set("state", state);
  target.searchParams.set("prompt", "select_account");
  const headers = new Headers({ Location: target.toString(), "Cache-Control": "no-store" });
  headers.append(
    "Set-Cookie",
    serializeCookie(OAUTH_STATE_COOKIE, state, {
      maxAgeSec: 600,
      secure: isSecureRequest(request, url),
    }),
  );
  return new Response(null, { status: 302, headers });
}

async function googleCallback(db: Database, request: Request, url: URL): Promise<Response> {
  const fail = (reason: string) =>
    new Response(null, {
      status: 302,
      headers: { Location: `/tai-khoan?google_error=${encodeURIComponent(reason)}` },
    });
  const cookies = parseCookies(request.headers.get("cookie"));
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  if (!code || !state || !cookies[OAUTH_STATE_COOKIE] || cookies[OAUTH_STATE_COOKIE] !== state) {
    return fail("state");
  }
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env["GOOGLE_CLIENT_ID"] ?? "",
        client_secret: process.env["GOOGLE_CLIENT_SECRET"] ?? "",
        redirect_uri: `${publicOrigin(request, url)}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!tokenRes.ok) return fail("token");
    const tokens = (await tokenRes.json()) as { id_token?: string };
    const payloadPart = tokens.id_token?.split(".")[1];
    if (!payloadPart) return fail("token");
    // id_token nhận trực tiếp từ Google qua TLS bằng client_secret nên chỉ cần kiểm tra aud/iss.
    const claims = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf-8")) as {
      sub?: string;
      email?: string;
      email_verified?: boolean;
      name?: string;
      picture?: string;
      aud?: string;
      iss?: string;
    };
    const issOk =
      claims.iss === "https://accounts.google.com" || claims.iss === "accounts.google.com";
    if (!claims.sub || !claims.email || claims.aud !== process.env["GOOGLE_CLIENT_ID"] || !issOk) {
      return fail("claims");
    }
    const user = upsertGoogleUser(db, {
      sub: claims.sub,
      email: claims.email,
      emailVerified: claims.email_verified === true,
      name: claims.name,
      picture: claims.picture,
    });
    const token = createSession(db, user.id, request.headers.get("user-agent"));
    const headers = sessionCookieHeaders(request, url, token);
    headers.append(
      "Set-Cookie",
      serializeCookie(OAUTH_STATE_COOKIE, "", {
        maxAgeSec: 0,
        secure: isSecureRequest(request, url),
      }),
    );
    headers.set("Location", "/tai-khoan?google=1");
    return new Response(null, { status: 302, headers });
  } catch (err) {
    console.warn("[TamGiang Accounts] Google OAuth lỗi:", err);
    return fail("network");
  }
}

async function handleMe(
  db: Database,
  request: Request,
  url: URL,
  route: string,
  sessionToken: string | undefined,
  user: PublicUser,
): Promise<Response> {
  const method = request.method;
  const limitParam = Number(url.searchParams.get("limit"));
  const range: { from: string | null; to: string | null; limit?: number } = {
    from: url.searchParams.get("from"),
    to: url.searchParams.get("to"),
    ...(limitParam > 0 ? { limit: limitParam } : {}),
  };

  if (route === "profile" && method === "PATCH") {
    const body = await readJson(request, 160_000);
    return json({ ok: true, user: updateProfile(db, user.id, body) });
  }
  if (route === "password" && method === "POST") {
    const body = await readJson(request);
    await changePassword(db, user.id, {
      currentPassword: body["currentPassword"],
      newPassword: body["newPassword"],
    });
    // Mọi phiên cũ đã bị hủy → cấp phiên mới cho thiết bị hiện tại.
    const token = createSession(db, user.id, request.headers.get("user-agent"));
    return json({ ok: true }, 200, sessionCookieHeaders(request, url, token));
  }
  if (route === "recovery-code" && method === "POST") {
    const body = await readJson(request);
    if (user.hasPassword) await verifyCurrentPassword(db, user.id, body["currentPassword"]);
    return json({ ok: true, recoveryCode: await rotateRecoveryCode(db, user.id) });
  }
  if (route === "state" && method === "GET") {
    return json({ ok: true, ...getUserState(db, user.id) });
  }
  if (route === "state" && method === "PUT") {
    const body = await readJson(request, 1_600_000);
    const result = putUserState(db, user.id, {
      state: body["state"],
      baseVersion: body["baseVersion"],
    });
    if (!result.ok) return json({ ok: false, conflict: true, ...result.current }, 409);
    return json({ ok: true, version: result.version });
  }
  if (route === "attempts" && method === "GET") {
    return json({ ok: true, attempts: listAttempts(db, user.id, range) });
  }
  if (route === "attempts" && method === "POST") {
    const body = await readJson(request, 1_000_000);
    return json({ ok: true, attempt: saveAttempt(db, user.id, body) }, 201);
  }
  if (route.startsWith("attempts/")) {
    const id = decodeURIComponent(route.slice("attempts/".length));
    if (method === "GET") {
      const attempt = getAttempt(db, user.id, id);
      if (!attempt) throw new HttpError(404, "not_found", "Không tìm thấy bài làm.");
      return json({ ok: true, attempt });
    }
    if (method === "DELETE") return json({ ok: deleteAttempt(db, user.id, id) });
  }
  if (route === "activity" && method === "GET") {
    return json({ ok: true, activity: listActivities(db, user.id, range) });
  }
  if (route === "activity" && method === "POST") {
    const body = await readJson(request, 400_000);
    return json({ ok: true, saved: saveActivities(db, user.id, body["items"]) }, 201);
  }
  if (route === "export" && method === "GET") {
    const headers = new Headers({
      "Content-Disposition": `attachment; filename="tamgiang-physics-sao-luu-${new Date()
        .toISOString()
        .slice(0, 10)}.json"`,
    });
    return json({ user, ...exportUserData(db, user.id) }, 200, headers);
  }
  if (route === "" && method === "DELETE") {
    const body = await readJson(request);
    if (user.hasPassword) await verifyCurrentPassword(db, user.id, body["password"]);
    deleteUser(db, user.id);
    return json({ ok: true }, 200, clearSessionHeaders(request, url));
  }
  void sessionToken;
  throw new HttpError(404, "not_found", "Không tìm thấy API.");
}

/** Trả về Response nếu URL thuộc API tài khoản; null để máy chủ xử lý tiếp các route khác. */
export async function handleAccountApi(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  const match = /^\/api\/(auth|me|admin)(?:\/(.*))?$/.exec(url.pathname);
  if (!match) return null;
  const area = match[1] as "auth" | "me" | "admin";
  const route = (match[2] ?? "").replace(/\/+$/, "");

  try {
    const db = getDatabase();
    if (area === "auth" && route === "me" && request.method === "GET") {
      const token = parseCookies(request.headers.get("cookie"))[SESSION_COOKIE];
      return json({
        ok: true,
        user: db ? getSessionUser(db, token) : null,
        features: features(db),
      });
    }
    if (!db) {
      return errorResponse(
        503,
        "accounts_unavailable",
        "Dịch vụ tài khoản chưa sẵn sàng trên máy chủ này. Bạn vẫn có thể học ở chế độ khách.",
      );
    }
    runDailyBackup();
    if (request.method !== "GET" && request.method !== "HEAD") assertSameOrigin(request, url);

    const token = parseCookies(request.headers.get("cookie"))[SESSION_COOKIE];
    const user = getSessionUser(db, token);

    if (area === "auth") return await handleAuth(db, request, url, route, token, user);
    if (!user)
      throw new HttpError(401, "unauthenticated", "Bạn cần đăng nhập để dùng tính năng này.");
    if (area === "me") return await handleMe(db, request, url, route, token, user);
    if (user.role !== "admin" && user.role !== "teacher") {
      throw new HttpError(403, "forbidden", "Bạn không có quyền truy cập khu vực này.");
    }
    if (route === "overview" && request.method === "GET") {
      return json({ ok: true, overview: getAdminOverview(db) });
    }
    throw new HttpError(404, "not_found", "Không tìm thấy API.");
  } catch (err) {
    if (err instanceof HttpError) return errorResponse(err.status, err.code, err.message);
    if (err instanceof AuthError || err instanceof StoreError) {
      return errorResponse(err.status, err.code, err.message);
    }
    console.error("[TamGiang Accounts] Lỗi API:", err);
    return errorResponse(500, "server_error", "Máy chủ gặp lỗi. Vui lòng thử lại sau.");
  }
}

/** Người dùng của phiên hiện tại (dùng cho các endpoint cũ như /api/submissions). */
export function getRequestUser(request: Request): PublicUser | null {
  const db = getDatabase();
  if (!db) return null;
  return getSessionUser(db, parseCookies(request.headers.get("cookie"))[SESSION_COOKIE]);
}
