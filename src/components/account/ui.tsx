import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export const inputClass =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-[#16845A] focus-visible:ring-2 focus-visible:ring-[#16845A]/30";

export function Field({
  label,
  hint,
  ...props
}: { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block space-y-1.5 text-xs font-semibold">
      <span>{label}</span>
      <input {...props} className={inputClass + " font-normal"} />
      {hint && <span className="block text-[11px] font-normal text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function PrimaryButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#16845A] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#126b48] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-secondary/60 disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}

export function Notice({
  tone,
  children,
}: {
  tone: "error" | "success" | "info";
  children: ReactNode;
}) {
  const styles = {
    error: "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300",
    success: "border-[#16845A]/40 bg-[#16845A]/10 text-[#0f6b47] dark:text-[#9be3b4]",
    info: "border-border bg-secondary/50 text-muted-foreground",
  } as const;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-lg border px-3 py-2.5 text-sm leading-relaxed ${styles[tone]}`}
    >
      {children}
    </div>
  );
}

export function Card({
  title,
  children,
  action,
}: {
  title?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-xs sm:p-5">
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {title && <h2 className="text-sm font-bold">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function RecoveryCodeBox({ code, onDone }: { code: string; onDone: () => void }) {
  return (
    <div className="space-y-3 rounded-2xl border border-amber-500/50 bg-amber-500/10 p-4 sm:p-5">
      <h2 className="text-sm font-bold">Mã khôi phục của em — chỉ hiển thị một lần</h2>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Hãy chép mã này vào vở hoặc chụp màn hình. Khi quên mật khẩu, em dùng email cùng mã này để
        đặt lại. Mã chỉ dùng được một lần; sau khi dùng hệ thống sẽ cấp mã mới.
      </p>
      <div className="select-all rounded-lg bg-background px-3 py-3 text-center font-mono text-lg font-bold tracking-widest break-all">
        {code}
      </div>
      <div className="flex flex-wrap gap-2">
        <GhostButton type="button" onClick={() => void navigator.clipboard?.writeText(code)}>
          Sao chép
        </GhostButton>
        <PrimaryButton type="button" onClick={onDone}>
          Em đã lưu mã
        </PrimaryButton>
      </div>
    </div>
  );
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} giây`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} phút`;
  return `${Math.floor(minutes / 60)} giờ ${minutes % 60} phút`;
}
