import { useEffect, useState, type FormEvent } from "react";
import { UserAvatar } from "@/components/account-button";
import {
  ApiError,
  AVATAR_PRESETS,
  GRADE_OPTIONS,
  api,
  refreshAuth,
  setAuthUser,
  type AccountFeatures,
  type AccountUser,
} from "@/lib/account/client";
import { getSyncStatus, signOut, subscribeSyncStatus, type SyncStatus } from "@/lib/account/sync";
import { subscribeLearningState, type LearningState } from "@/lib/learning-store";
import {
  Card,
  Field,
  GhostButton,
  Notice,
  PrimaryButton,
  RecoveryCodeBox,
  formatDateTime,
  inputClass,
} from "./ui";

const SYNC_LABELS: Record<SyncStatus, string> = {
  guest: "Chưa đồng bộ",
  syncing: "Đang đồng bộ…",
  synced: "Đã đồng bộ với tài khoản",
  offline: "Mất kết nối — sẽ tự đồng bộ lại khi có mạng",
};

function message(err: unknown): string {
  return err instanceof ApiError ? err.message : "Có lỗi xảy ra, em hãy thử lại.";
}

export function Profile({ user, features }: { user: AccountUser; features: AccountFeatures }) {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [grade, setGrade] = useState(user.grade ?? "");
  const [avatar, setAvatar] = useState(user.avatar ?? "");
  const [note, setNote] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [sync, setSync] = useState<SyncStatus>(getSyncStatus());
  const [learning, setLearning] = useState<LearningState | null>(null);
  const [attemptCount, setAttemptCount] = useState<number | null>(null);

  useEffect(() => subscribeSyncStatus(setSync), []);
  useEffect(() => subscribeLearningState(setLearning), []);
  useEffect(() => {
    api<{ attempts: unknown[] }>("/api/me/attempts?limit=1000")
      .then((res) => setAttemptCount(res.attempts.length))
      .catch(() => setAttemptCount(null));
  }, []);

  const guard = async (action: () => Promise<string | void>) => {
    if (busy) return;
    setBusy(true);
    setNote(null);
    try {
      const text = await action();
      if (text) setNote({ tone: "success", text });
    } catch (err) {
      setNote({ tone: "error", text: message(err) });
    } finally {
      setBusy(false);
    }
  };

  const saveProfile = (e: FormEvent) => {
    e.preventDefault();
    void guard(async () => {
      const res = await api<{ user: AccountUser }>("/api/me/profile", {
        method: "PATCH",
        body: { displayName, grade: grade || null, avatar: avatar || null },
      });
      setAuthUser(res.user);
      return "Đã lưu hồ sơ.";
    });
  };

  const changePassword = (e: FormEvent) => {
    e.preventDefault();
    void guard(async () => {
      await api("/api/me/password", { method: "POST", body: { currentPassword, newPassword } });
      setCurrentPassword("");
      setNewPassword("");
      await refreshAuth();
      return "Đã đổi mật khẩu. Các thiết bị khác đã bị đăng xuất.";
    });
  };

  const stats = [
    { label: "Bài học đã xem", value: learning?.viewedLessons.length ?? 0 },
    { label: "Bài tập đã làm", value: attemptCount ?? "—" },
    { label: "Thí nghiệm đã khám phá", value: learning?.completedLabs.length ?? 0 },
    {
      label: "Mục yêu thích",
      value: learning
        ? learning.favoriteLessons.length +
          learning.favoriteFormulas.length +
          learning.favoriteExperiments.length +
          learning.favoriteDocs.length
        : 0,
    },
  ];

  return (
    <div className="space-y-4">
      {note && <Notice tone={note.tone}>{note.text}</Notice>}
      {recoveryCode && <RecoveryCodeBox code={recoveryCode} onDone={() => setRecoveryCode("")} />}

      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <UserAvatar user={{ ...user, avatar: avatar || null }} size={64} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-lg font-bold">{user.displayName}</div>
            <div className="truncate text-xs text-muted-foreground">{user.email}</div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              {user.grade ?? "Chưa chọn lớp"} · Tham gia{" "}
              {formatDateTime(user.createdAt).split(" ").pop()} · {SYNC_LABELS[sync]}
            </div>
          </div>
          <GhostButton type="button" disabled={busy} onClick={() => void guard(() => signOut())}>
            Đăng xuất
          </GhostButton>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-secondary/50 p-3">
              <dt className="text-[11px] text-muted-foreground">{s.label}</dt>
              <dd className="font-mono text-lg font-bold">{s.value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      {!user.emailVerified && (
        <Notice tone="info">
          Email chưa được xác minh.{" "}
          {features.mail ? (
            <button
              type="button"
              className="font-medium underline"
              onClick={() =>
                void guard(async () => {
                  await api("/api/auth/resend-verification", { method: "POST" });
                  return "Đã gửi lại email xác minh.";
                })
              }
            >
              Gửi lại email xác minh
            </button>
          ) : (
            "Máy chủ chưa bật gửi email nên chưa thể xác minh; tài khoản vẫn dùng được bình thường."
          )}
        </Notice>
      )}

      <Card title="Thông tin cá nhân">
        <form onSubmit={saveProfile} className="space-y-3">
          <fieldset>
            <legend className="mb-1.5 text-xs font-semibold">Ảnh đại diện</legend>
            <div className="flex flex-wrap gap-2">
              {Object.entries(AVATAR_PRESETS).map(([id, preset]) => {
                const value = `preset:${id}`;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-label={preset.label}
                    aria-pressed={avatar === value}
                    onClick={() => setAvatar(value)}
                    className={`flex size-11 items-center justify-center rounded-full text-xl ring-offset-2 ring-offset-card ${
                      avatar === value ? "ring-2 ring-[#38A875]" : ""
                    }`}
                    style={{ background: preset.bg }}
                  >
                    {preset.emoji}
                  </button>
                );
              })}
              <button
                type="button"
                aria-pressed={!avatar}
                onClick={() => setAvatar("")}
                className={`h-11 rounded-full border border-border px-3 text-xs ${!avatar ? "ring-2 ring-[#38A875]" : ""}`}
              >
                Chữ cái đầu
              </button>
            </div>
          </fieldset>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Tên hiển thị"
              required
              maxLength={60}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <label className="block space-y-1.5 text-xs font-semibold">
              <span>Lớp</span>
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
          </div>
          <Field label="Email (không đổi được)" value={user.email} readOnly disabled />
          <PrimaryButton type="submit" disabled={busy}>
            Lưu hồ sơ
          </PrimaryButton>
        </form>
      </Card>

      <Card title="Bảo mật">
        {user.hasPassword ? (
          <form onSubmit={changePassword} className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Mật khẩu hiện tại"
              type="password"
              required
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Field
              label="Mật khẩu mới"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              hint="Ít nhất 8 ký tự, có cả chữ và số."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <PrimaryButton type="submit" disabled={busy}>
                Đổi mật khẩu
              </PrimaryButton>
              <GhostButton
                type="button"
                disabled={busy || !currentPassword}
                title="Nhập mật khẩu hiện tại để cấp mã mới"
                onClick={() =>
                  void guard(async () => {
                    const res = await api<{ recoveryCode: string }>("/api/me/recovery-code", {
                      method: "POST",
                      body: { currentPassword },
                    });
                    setRecoveryCode(res.recoveryCode);
                    setCurrentPassword("");
                  })
                }
              >
                Cấp mã khôi phục mới
              </GhostButton>
            </div>
          </form>
        ) : (
          <p className="text-sm text-muted-foreground">
            Tài khoản này đăng nhập bằng Google nên không có mật khẩu riêng.
          </p>
        )}
      </Card>

      <Card title="Dữ liệu của em">
        <div className="flex flex-wrap gap-2">
          <a
            href="/api/me/export"
            download
            className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-secondary/60"
          >
            Tải toàn bộ dữ liệu (JSON)
          </a>
          <GhostButton
            type="button"
            disabled={busy}
            className="text-red-600 dark:text-red-400"
            onClick={() => {
              const password = user.hasPassword
                ? window.prompt(
                    "Nhập mật khẩu để xác nhận xoá vĩnh viễn tài khoản và toàn bộ nhật ký học tập:",
                  )
                : "";
              if (password === null) return;
              if (
                !user.hasPassword &&
                !window.confirm("Xoá vĩnh viễn tài khoản và toàn bộ nhật ký học tập?")
              )
                return;
              void guard(async () => {
                await api("/api/me", { method: "DELETE", body: { password } });
                setAuthUser(null);
              });
            }}
          >
            Xoá tài khoản
          </GhostButton>
        </div>
      </Card>
    </div>
  );
}
