import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "@/lib/account/client";
import { getAllLessons } from "@/data/curriculum";
import { PRACTICE_SETS } from "@/data/question-bank";
import { subscribeLearningState, type LearningState } from "@/lib/learning-store";
import { Card, Notice, formatDateTime, formatDuration } from "./ui";

export interface AttemptSummary {
  id: string;
  source: string;
  title: string;
  grade: string | null;
  topic: string | null;
  lessonKey: string | null;
  level: string | null;
  startedAt: string;
  finishedAt: string;
  durationSec: number;
  total: number;
  correct: number;
  wrong: number;
  score: number;
  meta: unknown;
}

interface ActivityItem {
  clientId: string;
  type: string;
  ref: string | null;
  title: string | null;
  durationSec: number;
  occurredAt: string;
}

const RANGES = [
  { id: "day", label: "Hôm nay", days: 1 },
  { id: "week", label: "7 ngày", days: 7 },
  { id: "month", label: "30 ngày", days: 30 },
  { id: "semester", label: "Học kì", days: 150 },
] as const;

const ACTIVITY_LABELS: Record<string, string> = {
  lesson_view: "Xem bài học",
  experiment_done: "Hoàn thành thí nghiệm",
  vdc_solved: "Giải thử thách VDC",
};

export function Dashboard() {
  const [range, setRange] = useState<(typeof RANGES)[number]["id"]>("month");
  const [attempts, setAttempts] = useState<AttemptSummary[] | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [error, setError] = useState("");
  const [learning, setLearning] = useState<LearningState | null>(null);

  useEffect(() => subscribeLearningState(setLearning), []);

  useEffect(() => {
    let cancelled = false;
    const days = RANGES.find((r) => r.id === range)!.days;
    const from = new Date();
    if (days === 1) from.setHours(0, 0, 0, 0);
    else from.setDate(from.getDate() - days);
    const query = `?from=${encodeURIComponent(from.toISOString())}`;
    setAttempts(null);
    setError("");
    Promise.all([
      api<{ attempts: AttemptSummary[] }>("/api/me/attempts" + query + "&limit=500"),
      api<{ activity: ActivityItem[] }>("/api/me/activity" + query + "&limit=1000"),
    ])
      .then(([a, b]) => {
        if (cancelled) return;
        setAttempts(a.attempts);
        setActivity(b.activity);
      })
      .catch(
        () =>
          !cancelled &&
          setError("Không tải được nhật ký học tập. Hãy kiểm tra mạng rồi tải lại trang."),
      );
    return () => {
      cancelled = true;
    };
  }, [range]);

  const lessonsByGrade = useMemo(() => {
    const totals = new Map<string, { total: number; paths: Set<string> }>();
    for (const lesson of getAllLessons()) {
      const entry = totals.get(lesson.grade) ?? { total: 0, paths: new Set<string>() };
      entry.total++;
      entry.paths.add(lesson.fullPath);
      totals.set(lesson.grade, entry);
    }
    return [...totals.entries()].sort(([a], [b]) => a.localeCompare(b, "vi"));
  }, []);

  if (error) return <Notice tone="error">{error}</Notice>;

  const list = attempts ?? [];
  const totalQuestions = list.reduce((s, a) => s + a.total, 0);
  const totalCorrect = list.reduce((s, a) => s + a.correct, 0);
  const average = list.length ? list.reduce((s, a) => s + a.score, 0) / list.length : 0;
  const studySeconds =
    activity.filter((a) => a.type === "study_time").reduce((s, a) => s + a.durationSec, 0) ||
    list.reduce((s, a) => s + a.durationSec, 0);
  const chart = [...list].reverse().map((a) => ({
    time: new Date(a.finishedAt).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    }),
    score: a.score,
    title: a.title,
  }));

  // Bài cần ôn lại: lấy lần làm gần nhất của mỗi bài, điểm dưới 6,5.
  const latest = new Map<string, AttemptSummary>();
  for (const a of list) {
    const key = a.lessonKey ?? a.title;
    if (!latest.has(key)) latest.set(key, a);
  }
  const review = [...latest.values()].filter((a) => a.score < 6.5).slice(0, 6);
  const recent = activity.filter((a) => a.type !== "study_time").slice(0, 8);

  const days = new Set(list.map((a) => a.finishedAt.slice(0, 10)));
  const achievements = [
    { label: "Bài làm đầu tiên", done: list.length >= 1 },
    { label: "10 bài luyện tập", done: list.length >= 10 },
    { label: "Điểm 10 tuyệt đối", done: list.some((a) => a.score >= 10 && a.total >= 5) },
    { label: "Học 5 ngày khác nhau", done: days.size >= 5 },
    { label: "5 thí nghiệm hoàn thành", done: (learning?.completedLabs.length ?? 0) >= 5 },
    { label: "50 bài học đã xem", done: (learning?.viewedLessons.length ?? 0) >= 50 },
  ];

  const stats = [
    { label: "Bài đã làm", value: String(list.length) },
    { label: "Điểm trung bình", value: list.length ? average.toFixed(1).replace(".", ",") : "—" },
    { label: "Câu đúng / tổng", value: `${totalCorrect}/${totalQuestions}` },
    { label: "Thời gian học", value: studySeconds ? formatDuration(studySeconds) : "—" },
  ];

  return (
    <div className="space-y-4">
      <div role="group" aria-label="Khoảng thời gian" className="flex flex-wrap gap-1.5">
        {RANGES.map((r) => (
          <button
            key={r.id}
            type="button"
            aria-pressed={range === r.id}
            onClick={() => setRange(r.id)}
            className={`h-9 rounded-lg border px-3 text-xs font-semibold ${
              range === r.id
                ? "border-[#16845A] bg-[#16845A] text-white"
                : "border-border hover:bg-secondary/60"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
            <div className="text-[11px] text-muted-foreground">{s.label}</div>
            <div className="mt-1 font-mono text-xl font-bold">{attempts ? s.value : "…"}</div>
          </div>
        ))}
      </div>

      <Card title="Điểm số theo thời gian">
        {chart.length >= 2 ? (
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
                <CartesianGrid strokeOpacity={0.15} />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value) => [String(value).replace(".", ","), "Điểm"]}
                  labelFormatter={(label, payload) =>
                    `${payload?.[0]?.payload?.title ?? ""} · ${label}`
                  }
                  contentStyle={{
                    background: "#0b1511",
                    border: "1px solid #1f3a2c",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "#edf5ed",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#38A875"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {attempts
              ? "Cần ít nhất 2 bài làm trong khoảng thời gian này để vẽ biểu đồ. "
              : "Đang tải… "}
            <Link
              to="/luyen-tap"
              className="font-medium text-[#16845A] underline dark:text-[#72CF91]"
            >
              Luyện tập ngay
            </Link>
          </p>
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Tiến độ theo khối lớp">
          <ul className="space-y-3">
            {lessonsByGrade.map(([grade, info]) => {
              const viewed = learning
                ? learning.viewedLessons.filter((p) => info.paths.has(p)).length
                : 0;
              const percent = Math.round((viewed / info.total) * 100);
              return (
                <li key={grade}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-semibold">{grade}</span>
                    <span className="font-mono text-muted-foreground">
                      {viewed}/{info.total} mục · {percent}%
                    </span>
                  </div>
                  <div
                    className="h-2 overflow-hidden rounded-full bg-secondary"
                    role="progressbar"
                    aria-valuenow={percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Tiến độ ${grade}`}
                  >
                    <div
                      className="h-full rounded-full bg-[#38A875]"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Thí nghiệm đã hoàn thành: <b>{learning?.completedLabs.length ?? 0}</b> · Thử thách VDC
            đã giải: <b>{learning?.solvedVdcIds.length ?? 0}</b> · Câu hỏi đã đánh dấu:{" "}
            <b>{learning?.savedQuestions.length ?? 0}</b>
          </p>
        </Card>

        <Card title="Nội dung cần ôn lại">
          {review.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {list.length
                ? "Chưa có bài nào dưới 6,5 điểm trong khoảng thời gian này."
                : "Chưa có bài làm nào."}
            </p>
          ) : (
            <ul className="space-y-2">
              {review.map((a) => {
                const set = PRACTICE_SETS.find((s) => s.key === a.lessonKey);
                return (
                  <li key={a.id} className="flex items-center justify-between gap-2 text-sm">
                    <span className="min-w-0 truncate">{a.title}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span className="font-mono text-xs text-red-600 dark:text-red-400">
                        {a.score.toFixed(1).replace(".", ",")}
                      </span>
                      {set && (
                        <Link
                          to="/luyen-tap"
                          search={{ bai: set.code }}
                          className="text-xs font-medium text-[#16845A] underline dark:text-[#72CF91]"
                        >
                          Luyện lại
                        </Link>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card title="Hoạt động gần đây">
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Chưa ghi nhận hoạt động nào trong khoảng thời gian này.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {recent.map((a) => (
                <li key={a.clientId} className="flex justify-between gap-3">
                  <span className="min-w-0 truncate">
                    {ACTIVITY_LABELS[a.type] ?? a.type}:{" "}
                    <span className="text-muted-foreground">{a.title ?? a.ref}</span>
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                    {formatDateTime(a.occurredAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Thành tích">
          <ul className="grid grid-cols-2 gap-2 text-xs">
            {achievements.map((a) => (
              <li
                key={a.label}
                className={`rounded-lg border px-3 py-2 ${
                  a.done
                    ? "border-[#16845A]/50 bg-[#16845A]/10 font-semibold"
                    : "border-border text-muted-foreground"
                }`}
              >
                {a.done ? "🏅 " : "○ "}
                {a.label}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Thành tích bài làm tính trong khoảng thời gian đang chọn.
          </p>
        </Card>
      </div>
    </div>
  );
}
