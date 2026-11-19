import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { getRequestUser, handleAccountApi } from "./backend/api";
import { getDatabase } from "./backend/db";
import { listAttempts } from "./backend/store";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);

    // 0. Tài khoản, nhật ký học tập và đồng bộ tiến độ (/api/auth, /api/me, /api/admin)
    const accountResponse = await handleAccountApi(request);
    if (accountResponse) return accountResponse;

    // 1. Endpoint tương thích cho cầu nối nộp bài trong iframe mô phỏng.
    //    Kết quả được trang cha lưu qua /api/me/attempts (có xác thực). Endpoint này không còn
    //    giữ danh sách dùng chung trong bộ nhớ và chỉ trả về bài làm của chính người đang đăng nhập.
    if (url.pathname === "/api/submissions") {
      const headers = new Headers({
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      });
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers });
      }
      if (request.method === "POST") {
        return new Response(
          JSON.stringify({
            success: true,
            message: "Bài làm đã được chấm điểm. Đăng nhập để lưu vào nhật ký học tập của bạn.",
          }),
          { status: 200, headers },
        );
      }
      const user = getRequestUser(request);
      const db = getDatabase();
      if (!user || !db) {
        return new Response(
          JSON.stringify({ success: false, message: "Bạn cần đăng nhập để xem lịch sử bài làm." }),
          { status: 401, headers },
        );
      }
      const lessonQuery = url.searchParams.get("lesson");
      const submissions = listAttempts(db, user.id, { limit: 200 }).filter(
        (item) =>
          item.source === "lesson" &&
          (!lessonQuery || (item.lessonKey ?? "").includes(lessonQuery)),
      );
      return new Response(
        JSON.stringify({ success: true, count: submissions.length, submissions }),
        { status: 200, headers },
      );
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
