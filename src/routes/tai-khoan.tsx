import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { AuthForms } from "@/components/account/auth-forms";
import { Dashboard } from "@/components/account/dashboard";
import { AttemptHistory } from "@/components/account/history";
import { Profile } from "@/components/account/profile";
import { Notice, RecoveryCodeBox } from "@/components/account/ui";
import { ApiError, api, refreshAuth, useAuth, type AccountUser } from "@/lib/account/client";

interface AccountSearch {
  verify?: string;
  reset?: string;
  google?: string;
  google_error?: string;
}

const text = (value: unknown) => (typeof value === "string" && value ? value : undefined);

export const Route = createFileRoute("/tai-khoan")({
  validateSearch: (search: Record<string, unknown>): AccountSearch => {
    const out: AccountSearch = {};
    const verify = text(search["verify"]);
    const reset = text(search["reset"]);
    const googleError = text(search["google_error"]);
    if (verify) out.verify = verify;
    if (reset) out.reset = reset;
    if (search["google"] != null) out.google = "1";
    if (googleError) out.google_error = googleError;
    return out;
  },
  head: () => ({
    meta: [
      { title: "Tài khoản & nhật ký học tập | Trường THPT Tam Giang" },
      {
        name: "description",
        content: "Hồ sơ học sinh, lịch sử làm bài và tiến độ học Vật lý trên TamGiang Physics.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TaiKhoanPage,
});

const TABS = [
  { id: "overview", label: "Tổng quan" },
  { id: "history", label: "Lịch sử làm bài" },
  { id: "profile", label: "Hồ sơ" },
] as const;

function TaiKhoanPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { status, user, features } = useAuth();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("overview");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [banner, setBanner] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    void refreshAuth();
  }, []);

  // Liên kết xác minh email từ thư.
  useEffect(() => {
    if (!search.verify) return;
    api<{ user: AccountUser }>("/api/auth/verify", {
      method: "POST",
      body: { token: search.verify },
    })
      .then(() => {
        setBanner({ tone: "success", text: "Email đã được xác minh. Cảm ơn em!" });
        return refreshAuth();
      })
      .catch((err) =>
        setBanner({
          tone: "error",
          text: err instanceof ApiError ? err.message : "Liên kết xác minh không hợp lệ.",
        }),
      )
      .finally(() => void navigate({ search: {}, replace: true }));
  }, [search.verify, navigate]);

  useEffect(() => {
    if (search.google) {
      void refreshAuth();
      void navigate({ search: {}, replace: true });
    }
  }, [search.google, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader currentPath="/tai-khoan" />
      <main className="flex-1 pb-16">
        <div className="mx-auto max-w-5xl space-y-4 px-3 pt-6 sm:px-6">
          <h1 className="text-xl font-bold sm:text-2xl">
            {user ? "Nhật ký học tập" : "Tài khoản học sinh"}
          </h1>
          {banner && <Notice tone={banner.tone}>{banner.text}</Notice>}
          {recoveryCode && (
            <RecoveryCodeBox code={recoveryCode} onDone={() => setRecoveryCode("")} />
          )}

          {status === "loading" && (
            <p className="text-sm text-muted-foreground">Đang kiểm tra phiên đăng nhập…</p>
          )}

          {status === "ready" && !user && (
            <AuthForms
              features={features}
              {...(search.reset ? { resetToken: search.reset } : {})}
              {...(search.google_error ? { googleError: search.google_error } : {})}
              onRecoveryCode={setRecoveryCode}
            />
          )}

          {status === "ready" && user && (
            <>
              <div
                role="tablist"
                className="flex gap-1 overflow-x-auto rounded-xl bg-secondary/60 p-1"
              >
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    type="button"
                    aria-selected={tab === t.id}
                    onClick={() => setTab(t.id)}
                    className={`h-10 flex-1 rounded-lg px-3 text-xs font-semibold whitespace-nowrap transition-colors ${
                      tab === t.id
                        ? "bg-[#16845A] text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              {tab === "overview" && <Dashboard />}
              {tab === "history" && <AttemptHistory />}
              {tab === "profile" && <Profile user={user} features={features} />}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
