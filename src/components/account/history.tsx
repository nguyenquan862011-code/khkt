import { useEffect, useState } from "react";
import { ApiError, api } from "@/lib/account/client";
import type { AttemptSummary } from "./dashboard";
import { Card, GhostButton, Notice, formatDateTime, formatDuration } from "./ui";

interface AnswerDetail {
  position: number;
  questionId: string;
  level: string | null;
  isCorrect: boolean;
  detail: { stem?: string; yours?: string; correct?: string; explanation?: string } | null;
}

const SOURCE_LABELS: Record<string, string> = {
  practice: "Luyện tập",
  lesson: "Bài học",
  vdc: "Thử thách VDC",
  experiment: "Thí nghiệm",
};

export function AttemptHistory() {
  const [attempts, setAttempts] = useState<AttemptSummary[] | null>(null);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, AnswerDetail[]>>({});

  const load = () => {
    api<{ attempts: AttemptSummary[] }>("/api/me/attempts?limit=300")
      .then((res) => setAttempts(res.attempts))
      .catch((err) => setError(err instanceof ApiError ? err.message : "Không tải được lịch sử."));
  };
  useEffect(load, []);

  const toggle = async (id: string) => {
    if (openId === id) return setOpenId(null);
    setOpenId(id);
    if (details[id]) return;
    try {
      const res = await api<{ attempt: { answers: AnswerDetail[] } }>(
        `/api/me/attempts/${encodeURIComponent(id)}`,
      );
      setDetails((cur) => ({ ...cur, [id]: res.attempt.answers }));
    } catch {
      setDetails((cur) => ({ ...cur, [id]: [] }));
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Xoá bài làm này khỏi lịch sử? Thao tác không thể hoàn tác.")) return;
    try {
      await api(`/api/me/attempts/${encodeURIComponent(id)}`, { method: "DELETE" });
      setAttempts((cur) => (cur ?? []).filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Không xoá được bài làm.");
    }
  };

  if (error) return <Notice tone="error">{error}</Notice>;
  if (!attempts) return <p className="text-sm text-muted-foreground">Đang tải lịch sử làm bài…</p>;
  if (attempts.length === 0) {
    return (
      <Card>
        <p className="text-sm text-muted-foreground">
          Em chưa có bài làm nào được lưu. Vào mục <b>Luyện tập</b> hoặc làm phần trắc nghiệm trong
          bài học khi đã đăng nhập, kết quả sẽ xuất hiện ở đây.
        </p>
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {attempts.map((a) => {
        const open = openId === a.id;
        const answers = details[a.id];
        return (
          <li key={a.id} className="rounded-2xl border border-border bg-card">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => void toggle(a.id)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold ${
                  a.score >= 8
                    ? "bg-[#16845A]/20 text-[#0f6b47] dark:text-[#9be3b4]"
                    : a.score >= 5
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                      : "bg-red-500/15 text-red-600 dark:text-red-400"
                }`}
              >
                {a.score.toFixed(1).replace(".", ",")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{a.title}</span>
                <span className="block text-[11px] text-muted-foreground">
                  {SOURCE_LABELS[a.source] ?? a.source}
                  {a.topic ? ` · ${a.topic}` : ""} · {formatDateTime(a.finishedAt)}
                </span>
                <span className="block text-[11px] text-muted-foreground">
                  {a.total} câu · đúng {a.correct} · sai {a.wrong} · {formatDuration(a.durationSec)}
                </span>
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {open ? "Thu gọn" : "Xem lại"}
              </span>
            </button>
            {open && (
              <div className="space-y-3 border-t border-border p-4">
                <p className="text-[11px] text-muted-foreground">
                  Bắt đầu {formatDateTime(a.startedAt)} · Kết thúc {formatDateTime(a.finishedAt)}
                </p>
                {!answers && <p className="text-sm text-muted-foreground">Đang tải chi tiết…</p>}
                {answers && answers.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Bài này chỉ lưu điểm tổng (bài trắc nghiệm trong trang bài học không gửi chi
                    tiết từng câu).
                  </p>
                )}
                {answers && answers.length > 0 && (
                  <ol className="space-y-3">
                    {answers.map((ans) => (
                      <li
                        key={ans.position}
                        className={`rounded-lg border p-3 text-sm ${ans.isCorrect ? "border-[#16845A]/40" : "border-red-500/40"}`}
                      >
                        <p className="font-medium">
                          Câu {ans.position + 1}. {ans.detail?.stem ?? ans.questionId}
                        </p>
                        <p className="mt-1 text-xs">
                          Em trả lời:{" "}
                          <b
                            className={
                              ans.isCorrect
                                ? "text-[#0f6b47] dark:text-[#9be3b4]"
                                : "text-red-600 dark:text-red-400"
                            }
                          >
                            {ans.detail?.yours ?? "—"}
                          </b>
                        </p>
                        <p className="text-xs">
                          Đáp án đúng: <b>{ans.detail?.correct ?? "—"}</b>
                        </p>
                        {ans.detail?.explanation && (
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            Lời giải: {ans.detail.explanation}
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                )}
                <GhostButton
                  type="button"
                  onClick={() => void remove(a.id)}
                  className="h-9 text-xs text-red-600 dark:text-red-400"
                >
                  Xoá bài làm này
                </GhostButton>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
