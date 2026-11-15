import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import { AVATAR_PRESETS, useAuth, type AccountUser } from "@/lib/account/client";
import { startAccountSync } from "@/lib/account/sync";

export function UserAvatar({ user, size = 24 }: { user: AccountUser; size?: number }) {
  const style = { width: size, height: size, fontSize: Math.round(size * 0.5) };
  const preset = user.avatar?.startsWith("preset:")
    ? AVATAR_PRESETS[user.avatar.slice(7)]
    : undefined;
  if (preset) {
    return (
      <span
        className="inline-flex shrink-0 items-center justify-center rounded-full"
        style={{ ...style, background: preset.bg }}
        aria-hidden
      >
        {preset.emoji}
      </span>
    );
  }
  if (user.avatar && !user.avatar.startsWith("preset:")) {
    return (
      <img
        src={user.avatar}
        alt=""
        referrerPolicy="no-referrer"
        className="shrink-0 rounded-full object-cover"
        style={style}
      />
    );
  }
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#16845A] font-bold text-white"
      style={style}
      aria-hidden
    >
      {user.displayName.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}

/** Nút TÀI KHOẢN trên thanh điều hướng: hiện ảnh đại diện + tên sau khi đăng nhập. */
export function AccountButton({ active = false }: { active?: boolean }) {
  const { user } = useAuth();

  useEffect(() => {
    startAccountSync();
  }, []);

  return (
    <Link
      to="/tai-khoan"
      aria-label={user ? `Tài khoản của ${user.displayName}` : "Tài khoản"}
      title={user ? user.displayName : "Tài khoản học sinh"}
      className={`flex h-8.5 max-w-[9.5rem] shrink-0 items-center gap-1.5 rounded-lg border px-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
        active
          ? "border-[#C8ED78]/50 bg-[#16845A]/30 text-[#C8ED78]"
          : "border-white/10 bg-white/5 text-[#EDF5ED] hover:bg-white/10"
      }`}
    >
      {user ? <UserAvatar user={user} size={22} /> : <UserRound className="size-3.5" />}
      <span className="hidden truncate normal-case sm:inline">
        {user ? user.displayName.split(" ").slice(-1)[0] : "Tài khoản"}
      </span>
    </Link>
  );
}
