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

    // 2. Seamless proxy and rebranding for interactive physics simulations
    if (url.pathname.startsWith("/api/mo-phong/")) {
      let proxyPath = url.pathname;
      const decodedTail = decodeURIComponent(proxyPath.slice("/api/mo-phong/".length));
      if (decodedTail.startsWith("https://vatly.ai/api/mo-phong/")) {
        proxyPath = "/api/mo-phong/" + decodedTail.slice("https://vatly.ai/api/mo-phong/".length);
      } else if (decodedTail.startsWith("http://vatly.ai/api/mo-phong/")) {
        proxyPath = "/api/mo-phong/" + decodedTail.slice("http://vatly.ai/api/mo-phong/".length);
      }
      const targetUrl = "https://vatly.ai" + proxyPath + url.search;
      try {
        const upstream = await fetch(targetUrl, {
          method: request.method,
          headers: {
            "User-Agent": request.headers.get("User-Agent") || "Mozilla/5.0",
            Accept: request.headers.get("Accept") || "*/*",
          },
        });

        const headers = new Headers(upstream.headers);
        headers.set("Access-Control-Allow-Origin", "*");
        // Node fetch transparently decompresses gzip/br/deflate streams, so forwarding
        // upstream Content-Encoding or Content-Length causes ERR_CONTENT_DECODING_FAILED.
        headers.delete("content-encoding");
        headers.delete("content-length");
        headers.delete("transfer-encoding");
        // Keep simulation running cleanly without third-party iframe frame-ancestor blocks
        headers.delete("X-Frame-Options");
        headers.delete("Content-Security-Policy");
        headers.delete("Content-Security-Policy-Report-Only");

        const contentType = upstream.headers.get("content-type") || "";

        // If not HTML (e.g. css, js, svg, mp3), pass through stream directly
        if (!contentType.includes("text/html")) {
          return new Response(upstream.body, {
            status: upstream.status,
            headers,
          });
        }

        // Rebrand HTML and inject submission bridge & confirm modal polyfill
        let html = await upstream.text();

        // 2a. Rebrand header logo with official Trường THPT Tam Giang emblem
        html = html.replace(
          /<span class="logo">[\s\S]*?<\/span>/gi,
          `<span class="logo" style="background:transparent;display:flex;align-items:center;justify-content:center;padding:2px"><img alt="Logo Trường THPT Tam Giang" src="/logo-tamgiang.png" style="width:48px;height:48px;border-radius:50%;object-fit:cover;box-shadow:0 0 10px rgba(56,168,117,0.45)"></span>`,
        );

        // 2b. Rebrand slogan
        html = html.replace(
          /<p class="slogan">[^<]*<\/p>/gi,
          `<p class="slogan" style="color:#72CF91;font-weight:700">Trường THPT Tam Giang — Phòng Thí Nghiệm Vật Lý Số</p>`,
        );

        // 2c. Rebrand footer (both <div class="foot"> and <footer class="foot">)
        html = html.replace(
          /<(div|footer) class="foot">[\s\S]*?<\/\1>/gi,
          `<$1 class="foot"><b>Trường THPT Tam Giang — Phòng Thí Nghiệm Vật Lý Số</b><span>Cổng học tập & Khảo sát Vật lý trực quan THPT</span></$1>`,
        );

        // 2d. Clean up any remaining legacy branding, hotline, or external simulation links
        html = html.replace(/Hệ thống giáo dục Vật Lý Siêu Nhẩm/gi, "Trường THPT Tam Giang");
        html = html.replace(/Vật Lý Siêu Nhẩm/gi, "Trường THPT Tam Giang");
        html = html.replace(/VậtLý\.ai|VatLy\.ai/gi, "Trường THPT Tam Giang");
        html = html.replace(
          /Hotline:\s*0978\s*650\s*726\s*-\s*0326\s*425\s*111/gi,
          "Trường THPT Tam Giang",
        );
        html = html.replace(/https?:\/\/vatly\.ai\/api\/mo-phong\//gi, "/api/mo-phong/");
        html = html.replace(/<script[^>]*cloudflareinsights\.com[^>]*>[\s\S]*?<\/script>/gi, "");
        html = html.replace(/<script[^>]*>[\s\S]*?\/cdn-cgi\/rum[\s\S]*?<\/script>/gi, "");

        // 2e. Inject script bridge: safe confirm dialog, submission interceptor, postMessage, & server persistence
        const bridgeScript = `
<script id="tamgiang-submission-bridge">
(function() {
  // 1. Safe confirm polyfill so sandboxed iframes without native modal dialogs don't block submission
  var _origConfirm = window.confirm;
  window.confirm = function(msg) {
    try {
      if (typeof _origConfirm === 'function') {
        var res = _origConfirm(msg);
        if (typeof res === 'boolean') return res;
      }
    } catch(e) {
      console.warn('[TamGiang] Sandboxed confirm intercepted, auto-confirming:', e);
    }
    return true;
  };

  // 2. Submission Listener and Bridge
  function attachTamGiangBridge() {
    var submitB = document.getElementById('submitB');
    if (!submitB || submitB.__tgHooked) return;
    submitB.__tgHooked = true;

    var prevOnClick = submitB.onclick;
    submitB.onclick = function(e) {
      var isSubmitting = submitB.getAttribute('data-submitting') === 'true';
      if (isSubmitting) return;

      submitB.setAttribute('data-submitting', 'true');
      var originalText = submitB.textContent;
      submitB.textContent = 'Đang nộp bài...';

      try {
        if (typeof prevOnClick === 'function') {
          prevOnClick.call(submitB, e);
        }
      } catch (err) {
        console.error('[TamGiang] Error in original submission handler:', err);
      }

      setTimeout(function() {
        submitB.removeAttribute('data-submitting');
        submitB.textContent = originalText;

        try {
          if (typeof scoreNow === 'function' && typeof S !== 'undefined') {
            var r = scoreNow();
            var timeStr = (typeof clock === 'function') ? clock() : '00:00';
            var p1Len = (typeof P1 !== 'undefined' && Array.isArray(P1)) ? P1.length : 0;
            var p2Len = (typeof P2 !== 'undefined' && Array.isArray(P2)) ? P2.reduce(function(acc, q){ return acc + (q.it ? q.it.length : 0); }, 0) : 0;
            var p3Len = (typeof P3 !== 'undefined' && Array.isArray(P3)) ? P3.length : 0;
            var totalQ = p1Len + (typeof P2 !== 'undefined' ? P2.length : 0) + p3Len;

            var payload = {
              lessonPath: window.location.pathname.replace(/^\\/api\\/mo-phong\\/?/, ''),
              title: document.title || 'Bài tập Vật lý',
              mode: S.mode || 'thi',
              score: r ? r.ten : 0,
              rawScore: r ? r.raw : 0,
              correctCount: r ? (r.c1 + r.c2 + r.c3) : 0,
              totalQuestions: totalQ,
              p1: r ? { correct: r.c1, total: p1Len } : null,
              p2: r ? { correct: r.c2, total: p2Len } : null,
              p3: r ? { correct: r.c3, total: p3Len } : null,
              timeSpent: timeStr,
              submittedAt: new Date().toISOString()
            };

            // Post to parent window for react viewer modal & local persistence
            if (window.parent && window.parent !== window) {
              window.parent.postMessage({
                type: 'TAMGIANG_SUBMISSION_RESULT',
                payload: payload
              }, '*');
            }

            // Post to server storage API
            fetch('/api/submissions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            }).catch(function(err) {
              console.warn('[TamGiang] Could not post to /api/submissions:', err);
            });
          }
        } catch(ex) {
          console.error('[TamGiang] Error calculating submission data:', ex);
        }
      }, 150);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachTamGiangBridge);
  } else {
    attachTamGiangBridge();
  }
  setInterval(attachTamGiangBridge, 1000);
})();
</script>
`;

        if (html.includes("</head>")) {
          html = html.replace("</head>", bridgeScript + "</head>");
        } else if (html.includes("</body>")) {
          html = html.replace("</body>", bridgeScript + "</body>");
        } else {
          html += bridgeScript;
        }

        return new Response(html, {
          status: 200,
          headers,
        });
      } catch (err) {
        console.error("Simulation proxy error for", targetUrl, err);
      }
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
