// @vitest-environment node
import { beforeEach, describe, expect, it } from "vitest";
import { handleAccountApi } from "@/backend/api";
import { openDatabase, setDatabaseForTesting } from "@/backend/db";

const ORIGIN = "http://tamgiang.test";

/** Trình khách tối giản: tự giữ cookie phiên như một trình duyệt. */
function createClient(ip: string) {
  let cookie = "";
  return {
    get cookie() {
      return cookie;
    },
    async call(method: string, path: string, body?: unknown, headers: Record<string, string> = {}) {
      const res = await handleAccountApi(
        new Request(ORIGIN + path, {
          method,
          headers: {
            ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
            ...(cookie ? { Cookie: cookie } : {}),
            Origin: ORIGIN,
            "X-Forwarded-For": ip,
            ...headers,
          },
          ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
        }),
      );
      if (!res) throw new Error("API không xử lý " + path);
      for (const raw of res.headers.getSetCookie()) {
        const [pair] = raw.split(";");
        if (pair!.startsWith("tg_session=")) cookie = pair!.endsWith("=") ? "" : pair!;
      }
      const text = await res.text();
      return {
        status: res.status,
        headers: res.headers,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- phản hồi JSON tuỳ theo từng API
        data: JSON.parse(text) as Record<string, any>,
      };
    },
  };
}

async function registered(email: string, ip: string, name = "Học sinh thử nghiệm") {
  const client = createClient(ip);
  const res = await client.call("POST", "/api/auth/register", {
    email,
    password: "matkhau123",
    displayName: name,
    grade: "Lớp 11",
  });
  expect(res.status).toBe(201);
  return { client, recoveryCode: res.data["recoveryCode"] as string, user: res.data["user"] };
}

const sampleAttempt = (clientId: string) => ({
  clientId,
  source: "practice",
  title: "Luyện tập: Giao thoa sóng cơ",
  grade: "Lớp 11",
  topic: "Giao thoa sóng",
  lessonKey: "lop-11/song/chu-de-3-giao-thoa-song/bai-1-giao-thoa-song-co",
  level: "van-dung",
  startedAt: "2026-11-15T08:00:00.000Z",
  finishedAt: "2026-11-15T08:12:30.000Z",
  durationSec: 750,
  total: 2,
  correct: 1,
  wrong: 1,
  score: 5,
  answers: [
    {
      questionId: "q-1",
      level: "van-dung",
      kind: "tinh-toan",
      isCorrect: true,
      detail: { stem: "λ = ?", userAnswer: "4", correctAnswer: "4", explanation: "λ = v/f" },
    },
    {
      questionId: "q-2",
      level: "van-dung",
      kind: "trac-nghiem",
      isCorrect: false,
      detail: {
        stem: "Điều kiện cực đại?",
        userAnswer: "B",
        correctAnswer: "A",
        explanation: "d2 − d1 = kλ",
      },
    },
  ],
});

describe("Hệ thống tài khoản TamGiang Physics (máy chủ)", () => {
  let db: ReturnType<typeof openDatabase>;

  beforeEach(() => {
    db = openDatabase(":memory:");
    setDatabaseForTesting(db);
  });

  it("đăng ký, băm mật khẩu, cấp cookie HttpOnly và trả hồ sơ qua /api/auth/me", async () => {
    const { client, recoveryCode, user } = await registered("an@tamgiang.test", "10.0.0.1");
    expect(user.email).toBe("an@tamgiang.test");
    expect(user.role).toBe("student");
    expect(recoveryCode).toMatch(/^TG-[A-Z0-9]{4}(-[A-Z0-9]{4}){3}$/);

    const row = db.prepare("SELECT * FROM users").get()!;
    expect(String(row["password_hash"])).toMatch(/^scrypt\$/);
    expect(JSON.stringify(row)).not.toContain("matkhau123");
    expect(JSON.stringify(row)).not.toContain(recoveryCode);

    const session = db.prepare("SELECT * FROM sessions").get()!;
    expect(client.cookie).not.toContain(String(session["token_hash"]));

    const me = await client.call("GET", "/api/auth/me");
    expect(me.data["user"].displayName).toBe("Học sinh thử nghiệm");
    expect(me.data["features"].accounts).toBe(true);
  });

  it("đặt cookie phiên HttpOnly + SameSite và từ chối mật khẩu yếu / email trùng", async () => {
    const client = createClient("10.0.0.2");
    const weak = await client.call("POST", "/api/auth/register", {
      email: "b@tamgiang.test",
      password: "12345678",
      displayName: "Bình",
    });
    expect(weak.status).toBe(400);
    expect(weak.data["error"].code).toBe("weak_password");

    const ok = await client.call("POST", "/api/auth/register", {
      email: "b@tamgiang.test",
      password: "vatly2026",
      displayName: "Bình",
    });
    const setCookie = ok.headers.getSetCookie().join("\n");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Lax");

    const dup = await createClient("10.0.0.3").call("POST", "/api/auth/register", {
      email: "B@TamGiang.test",
      password: "vatly2026",
      displayName: "Bình 2",
    });
    expect(dup.status).toBe(409);
  });

  it("đăng nhập đúng/sai, đăng xuất hủy phiên", async () => {
    await registered("chi@tamgiang.test", "10.0.0.4");
    const client = createClient("10.0.0.5");
    const bad = await client.call("POST", "/api/auth/login", {
      email: "chi@tamgiang.test",
      password: "saimatkhau1",
    });
    expect(bad.status).toBe(401);
    const unknown = await client.call("POST", "/api/auth/login", {
      email: "khongco@tamgiang.test",
      password: "saimatkhau1",
    });
    expect(unknown.data["error"].message).toBe(bad.data["error"].message);

    const good = await client.call("POST", "/api/auth/login", {
      email: "Chi@tamgiang.test",
      password: "matkhau123",
    });
    expect(good.status).toBe(200);
    expect((await client.call("GET", "/api/me/attempts")).status).toBe(200);

    const oldCookie = client.cookie;
    await client.call("POST", "/api/auth/logout");
    expect(client.cookie).toBe("");
    const replay = await handleAccountApi(
      new Request(ORIGIN + "/api/me/attempts", { headers: { Cookie: oldCookie } }),
    );
    expect(replay!.status).toBe(401);
  });

  it("khóa tạm sau quá nhiều lần đăng nhập sai", async () => {
    await registered("dung@tamgiang.test", "10.0.0.6");
    const client = createClient("10.0.0.7");
    let last = 0;
    for (let i = 0; i < 11; i++) {
      last = (
        await client.call("POST", "/api/auth/login", {
          email: "dung@tamgiang.test",
          password: "saimatkhau" + i,
        })
      ).status;
    }
    expect(last).toBe(429);
  });

  it("lưu chi tiết bài làm và KHÔNG lộ dữ liệu giữa hai tài khoản", async () => {
    const a = await registered("a1@tamgiang.test", "10.0.1.1");
    const b = await registered("b1@tamgiang.test", "10.0.1.2");

    const saved = await a.client.call("POST", "/api/me/attempts", sampleAttempt("att-a-1"));
    expect(saved.status).toBe(201);
    const attemptId = saved.data["attempt"].id as string;
    // Gửi lại (mất mạng rồi thử lại) không tạo bản trùng.
    await a.client.call("POST", "/api/me/attempts", sampleAttempt("att-a-1"));

    const listA = await a.client.call("GET", "/api/me/attempts");
    expect(listA.data["attempts"]).toHaveLength(1);
    const detail = await a.client.call("GET", `/api/me/attempts/${attemptId}`);
    expect(detail.data["attempt"].answers).toHaveLength(2);
    expect(detail.data["attempt"].answers[1].detail.correctAnswer).toBe("A");
    expect(detail.data["attempt"].answers[1].isCorrect).toBe(false);

    const listB = await b.client.call("GET", "/api/me/attempts");
    expect(listB.data["attempts"]).toHaveLength(0);
    expect((await b.client.call("GET", `/api/me/attempts/${attemptId}`)).status).toBe(404);
    expect((await b.client.call("GET", "/api/me/attempts/att-a-1")).status).toBe(404);
    expect((await b.client.call("DELETE", `/api/me/attempts/${attemptId}`)).data["ok"]).toBe(false);
    expect((await a.client.call("GET", "/api/me/attempts")).data["attempts"]).toHaveLength(1);

    const anonymous = await handleAccountApi(new Request(ORIGIN + "/api/me/attempts"));
    expect(anonymous!.status).toBe(401);
  });

  it("ghi nhật ký hoạt động theo từng tài khoản, chống trùng khi gửi lại", async () => {
    const a = await registered("a2@tamgiang.test", "10.0.2.1");
    const b = await registered("b2@tamgiang.test", "10.0.2.2");
    const items = [
      {
        clientId: "act-1",
        type: "lesson_view",
        ref: "lop-10/x",
        title: "Bài 5 - Sự rơi tự do",
        grade: "Lớp 10",
        durationSec: 320,
        occurredAt: "2026-11-15T09:00:00.000Z",
      },
      { clientId: "act-2", type: "lab_run", ref: "co-hoc", occurredAt: "2026-11-15T09:10:00.000Z" },
    ];
    expect((await a.client.call("POST", "/api/me/activity", { items })).data["saved"]).toBe(2);
    expect((await a.client.call("POST", "/api/me/activity", { items })).data["saved"]).toBe(0);
    const logA = await a.client.call("GET", "/api/me/activity?from=2026-11-15T09:05:00.000Z");
    expect(logA.data["activity"]).toHaveLength(1);
    expect(logA.data["activity"][0].type).toBe("lab_run");
    expect((await b.client.call("GET", "/api/me/activity")).data["activity"]).toHaveLength(0);
  });

  it("đồng bộ tiến độ đa thiết bị với kiểm soát phiên bản (không ghi đè mất dữ liệu)", async () => {
    const { client } = await registered("e@tamgiang.test", "10.0.3.1");
    const deviceB = createClient("10.0.3.2");
    await deviceB.call("POST", "/api/auth/login", {
      email: "e@tamgiang.test",
      password: "matkhau123",
    });

    const empty = await client.call("GET", "/api/me/state");
    expect(empty.data["version"]).toBe(0);
    const put1 = await client.call("PUT", "/api/me/state", {
      baseVersion: 0,
      state: { viewedLessons: ["bai-1"] },
    });
    expect(put1.data["version"]).toBe(1);

    const stale = await deviceB.call("PUT", "/api/me/state", {
      baseVersion: 0,
      state: { viewedLessons: ["bai-2"] },
    });
    expect(stale.status).toBe(409);
    expect(stale.data["state"].viewedLessons).toEqual(["bai-1"]);

    const merged = await deviceB.call("PUT", "/api/me/state", {
      baseVersion: 1,
      state: { viewedLessons: ["bai-2", "bai-1"] },
    });
    expect(merged.data["version"]).toBe(2);
    const seenOnA = await client.call("GET", "/api/me/state");
    expect(seenOnA.data["state"].viewedLessons).toEqual(["bai-2", "bai-1"]);
  });

  it("quên mật khẩu: đặt lại bằng mã khôi phục dùng một lần và hủy mọi phiên cũ", async () => {
    const { client, recoveryCode } = await registered("g@tamgiang.test", "10.0.4.1");
    const forgot = await createClient("10.0.4.2").call("POST", "/api/auth/forgot", {
      email: "g@tamgiang.test",
    });
    const forgotUnknown = await createClient("10.0.4.3").call("POST", "/api/auth/forgot", {
      email: "nobody@tamgiang.test",
    });
    expect(forgot.data).toEqual(forgotUnknown.data);

    const other = createClient("10.0.4.4");
    const wrong = await other.call("POST", "/api/auth/reset", {
      email: "g@tamgiang.test",
      recoveryCode: "TG-AAAA-BBBB-CCCC-DDDD",
      password: "matkhaumoi9",
    });
    expect(wrong.status).toBe(401);

    const reset = await other.call("POST", "/api/auth/reset", {
      email: "g@tamgiang.test",
      recoveryCode: recoveryCode.toLowerCase(),
      password: "matkhaumoi9",
    });
    expect(reset.status).toBe(200);
    expect(reset.data["recoveryCode"]).not.toBe(recoveryCode);

    expect((await client.call("GET", "/api/me/state")).status).toBe(401);
    const reuse = await createClient("10.0.4.5").call("POST", "/api/auth/reset", {
      email: "g@tamgiang.test",
      recoveryCode,
      password: "matkhaumoi10",
    });
    expect(reuse.status).toBe(401);
    const login = await createClient("10.0.4.6").call("POST", "/api/auth/login", {
      email: "g@tamgiang.test",
      password: "matkhaumoi9",
    });
    expect(login.status).toBe(200);
  });

  it("chặn yêu cầu khác nguồn (CSRF) và yêu cầu không phải JSON", async () => {
    const { client } = await registered("h@tamgiang.test", "10.0.5.1");
    const cross = await client.call(
      "PATCH",
      "/api/me/profile",
      { displayName: "Bị tấn công" },
      { Origin: "https://evil.example" },
    );
    expect(cross.status).toBe(403);
    const form = await handleAccountApi(
      new Request(ORIGIN + "/api/me/profile", {
        method: "PATCH",
        headers: { Cookie: client.cookie, "Content-Type": "text/plain" },
        body: "displayName=x",
      }),
    );
    expect(form!.status).toBe(415);
    expect((await client.call("GET", "/api/auth/me")).data["user"].displayName).not.toBe(
      "Bị tấn công",
    );
  });

  it("cập nhật hồ sơ, đổi mật khẩu, phân quyền và xóa tài khoản kèm dữ liệu", async () => {
    const { client } = await registered("k@tamgiang.test", "10.0.6.1");
    const patched = await client.call("PATCH", "/api/me/profile", {
      displayName: "  Trần   Khoa ",
      grade: "Lớp 12",
      avatar: "preset:atom",
    });
    expect(patched.data["user"].displayName).toBe("Trần Khoa");
    expect(patched.data["user"].grade).toBe("Lớp 12");
    expect((await client.call("PATCH", "/api/me/profile", { grade: "Lớp 9" })).status).toBe(400);

    expect((await client.call("GET", "/api/admin/overview")).status).toBe(403);

    const wrongPw = await client.call("POST", "/api/me/password", {
      currentPassword: "sai-roi-1",
      newPassword: "matkhaumoi7",
    });
    expect(wrongPw.status).toBe(401);
    const changed = await client.call("POST", "/api/me/password", {
      currentPassword: "matkhau123",
      newPassword: "matkhaumoi7",
    });
    expect(changed.status).toBe(200);
    expect((await client.call("GET", "/api/me/state")).status).toBe(200);

    await client.call("POST", "/api/me/attempts", sampleAttempt("att-k"));
    const exported = await client.call("GET", "/api/me/export");
    expect(exported.data["attempts"]).toHaveLength(1);
    expect(JSON.stringify(exported.data)).not.toContain("scrypt$");

    const del = await client.call("DELETE", "/api/me", { password: "matkhaumoi7" });
    expect(del.status).toBe(200);
    expect(Number(db.prepare("SELECT COUNT(*) AS n FROM attempts").get()!["n"])).toBe(0);
    expect(Number(db.prepare("SELECT COUNT(*) AS n FROM attempt_answers").get()!["n"])).toBe(0);
    expect(Number(db.prepare("SELECT COUNT(*) AS n FROM sessions").get()!["n"])).toBe(0);
  });
});
