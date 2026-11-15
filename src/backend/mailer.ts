/**
 * Gửi email xác thực / đặt lại mật khẩu.
 * - Có RESEND_API_KEY + TAMGIANG_MAIL_FROM: gửi thật qua Resend (HTTPS, không cần thư viện).
 * - TAMGIANG_DEV_MAIL=1: chỉ in liên kết ra console máy chủ (dùng khi phát triển).
 * - Không cấu hình: không gửi; học sinh đặt lại mật khẩu bằng mã khôi phục.
 */
export function isMailConfigured(): boolean {
  return Boolean(process.env["RESEND_API_KEY"] && process.env["TAMGIANG_MAIL_FROM"]);
}

function escapeHtml(text: string): string {
  return text.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
  );
}

export async function sendAccountMail(input: {
  to: string;
  subject: string;
  intro: string;
  actionLabel: string;
  actionUrl: string;
}): Promise<boolean> {
  if (process.env["TAMGIANG_DEV_MAIL"] === "1") {
    console.info(`[TamGiang Mail · DEV] ${input.subject} → ${input.to}\n  ${input.actionUrl}`);
  }
  if (!isMailConfigured()) return false;
  const html = `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto;padding:24px;background:#0b1511;color:#edf5ed;border-radius:12px">
<h2 style="color:#72cf91;margin:0 0 12px">TamGiang Physics</h2>
<p>${escapeHtml(input.intro)}</p>
<p><a href="${escapeHtml(input.actionUrl)}" style="display:inline-block;background:#16845a;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600">${escapeHtml(input.actionLabel)}</a></p>
<p style="font-size:12px;color:#9db3a5">Nếu bạn không yêu cầu, hãy bỏ qua email này.</p></div>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env["RESEND_API_KEY"]}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env["TAMGIANG_MAIL_FROM"],
        to: [input.to],
        subject: input.subject,
        html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) console.warn("[TamGiang Mail] Gửi email thất bại:", res.status);
    return res.ok;
  } catch (err) {
    console.warn("[TamGiang Mail] Không kết nối được dịch vụ email:", err);
    return false;
  }
}
