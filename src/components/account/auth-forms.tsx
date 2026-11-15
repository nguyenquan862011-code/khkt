import { useState, type FormEvent } from "react";
import {
  ApiError,
  GRADE_OPTIONS,
  api,
  setAuthUser,
  type AccountFeatures,
  type AccountUser,
} from "@/lib/account/client";
import { Field, GhostButton, Notice, PrimaryButton, inputClass } from "./ui";

type Mode = "login" | "register" | "forgot";

const GOOGLE_ERRORS: Record<string, string> = {
  state: "Phiên đăng nhập Google đã hết hạn, em hãy thử lại.",
  token: "Google không xác nhận được tài khoản, em hãy thử lại.",
  claims: "Tài khoản Google chưa xác minh email nên không dùng được.",
  network: "Không kết nối được tới Google, em hãy thử lại sau.",
  disabled: "Đăng nhập Google chưa được nhà trường bật.",
};

export function AuthForms({
  features,
  resetToken,
  googleError,
  onRecoveryCode,
}: {
  features: AccountFeatures;
  resetToken?: string;
  googleError?: string;
  onRecoveryCode: (code: string) => void;
}) {
  const [mode, setMode] = useState<Mode>(resetToken ? "forgot" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [grade, setGrade] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(
    googleError ? (GOOGLE_ERRORS[googleError] ?? "Đăng nhập Google không thành công.") : "",
  );
  const [info, setInfo] = useState("");

  const run = async (event: FormEvent, action: () => Promise<void>) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setInfo("");
    try {
      await action();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Có lỗi xảy ra, em hãy thử lại.");
    } finally {
      setBusy(false);
    }
  };

  const login = (e: FormEvent) =>
    run(e, async () => {
      const res = await api<{ user: AccountUser }>("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });
      setAuthUser(res.user);
    });

  const register = (e: FormEvent) =>
    run(e, async () => {
      const res = await api<{ user: AccountUser; recoveryCode: string }>("/api/auth/register", {
        method: "POST",
        body: { email, password, displayName, grade: grade || undefined },
      });
      onRecoveryCode(res.recoveryCode);
      setAuthUser(res.user);
    });

  const forgot = (e: FormEvent) =>
    run(e, async () => {
      const res = await api<{ mailEnabled: boolean }>("/api/auth/forgot", {
        method: "POST",
        body: { email },
      });
      setInfo(
        res.mailEnabled
          ? "Nếu email này đã đăng ký, hệ thống vừa gửi liên kết đặt lại (hiệu lực 30 phút). Em cũng có thể dùng mã khôi phục ở dưới."
          : "Hệ thống chưa bật gửi email. Em hãy dùng mã khôi phục đã lưu lúc đăng ký để đặt lại ở dưới.",
      );
    });

  const reset = (e: FormEvent) =>
    run(e, async () => {
      const res = await api<{ user: AccountUser; recoveryCode?: string }>("/api/auth/reset", {
        method: "POST",
        body: resetToken ? { token: resetToken, password } : { email, recoveryCode, password },
      });
      if (res.recoveryCode) onRecoveryCode(res.recoveryCode);
      if (res.user) setAuthUser(res.user);
      else {
        setMode("login");
        setInfo("Đã đặt lại. Em hãy đăng nhập bằng thông tin mới.");
      }
    });

  if (!features.accounts) {
    return (
      <Notice tone="info">
        Máy chủ hiện chưa bật lưu trữ tài khoản nên chưa thể đăng nhập. Em vẫn học bài, làm thí
        nghiệm và luyện tập bình thường ở chế độ khách.
      </Notice>
    );
  }

  const tabs: { id: Mode; label: string }[] = [
    { id: "login", label: "Đăng nhập" },
    { id: "register", label: "Đăng ký" },
    { id: "forgot", label: "Quên mật khẩu" },
  ];

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <div role="tablist" className="grid grid-cols-3 gap-1 rounded-xl bg-secondary/60 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={mode === tab.id}
            onClick={() => {
              setMode(tab.id);
              setError("");
              setInfo("");
            }}
            className={`h-10 rounded-lg text-xs font-semibold transition-colors ${
              mode === tab.id
                ? "bg-[#16845A] text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <Notice tone="error">{error}</Notice>}
      {info && <Notice tone="success">{info}</Notice>}

      {mode === "login" && (
        <form
          onSubmit={login}
          className="space-y-3 rounded-2xl border border-border bg-card p-4 sm:p-5"
        >
          <Field
            label="Email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Field
            label="Mật khẩu"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PrimaryButton type="submit" disabled={busy} className="w-full">
            {busy ? "Đang đăng nhập…" : "Đăng nhập"}
          </PrimaryButton>
        </form>
      )}

      {mode === "register" && (
        <form
          onSubmit={register}
          className="space-y-3 rounded-2xl border border-border bg-card p-4 sm:p-5"
        >
          <Field
            label="Họ và tên hiển thị"
            required
            maxLength={60}
            autoComplete="name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Field
            label="Email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="block space-y-1.5 text-xs font-semibold">
            <span>Lớp (không bắt buộc)</span>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className={inputClass + " font-normal"}
            >
              <option value="">Chưa chọn</option>
              {GRADE_OPTIONS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </label>
          <Field
            label="Mật khẩu"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            hint="Ít nhất 8 ký tự, có cả chữ và số."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PrimaryButton type="submit" disabled={busy} className="w-full">
            {busy ? "Đang tạo…" : "Tạo tài khoản"}
          </PrimaryButton>
        </form>
      )}

      {mode === "forgot" && (
        <div className="space-y-3">
          {!resetToken && (
            <form
              onSubmit={forgot}
              className="space-y-3 rounded-2xl border border-border bg-card p-4 sm:p-5"
            >
              <Field
                label="Email đã đăng ký"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <GhostButton type="submit" disabled={busy} className="w-full">
                {features.mail ? "Gửi liên kết đặt lại qua email" : "Kiểm tra cách đặt lại"}
              </GhostButton>
            </form>
          )}
          <form
            onSubmit={reset}
            className="space-y-3 rounded-2xl border border-border bg-card p-4 sm:p-5"
          >
            <h2 className="text-sm font-bold">
              {resetToken ? "Đặt mật khẩu mới" : "Đặt lại bằng mã khôi phục"}
            </h2>
            {!resetToken && (
              <>
                <Field
                  label="Email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Field
                  label="Mã khôi phục"
                  required
                  autoComplete="off"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                />
              </>
            )}
            <Field
              label="Mật khẩu mới"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              hint="Ít nhất 8 ký tự, có cả chữ và số."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PrimaryButton type="submit" disabled={busy} className="w-full">
              {busy ? "Đang lưu…" : "Đặt lại mật khẩu"}
            </PrimaryButton>
          </form>
        </div>
      )}

      {features.google && mode !== "forgot" && (
        <a
          href="/api/auth/google/start"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-secondary/60"
        >
          <span className="font-bold text-[#4285F4]">G</span> Tiếp tục với Google
        </a>
      )}

      <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
        Không cần tài khoản để học: bài học, thí nghiệm và luyện tập luôn mở cho khách. Tài khoản
        chỉ để lưu tiến độ, lịch sử làm bài và đồng bộ giữa các thiết bị.
      </p>
    </div>
  );
}
