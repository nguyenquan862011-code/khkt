import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ClipboardList,
  FlaskConical,
  RotateCcw,
  Timer,
  XCircle,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { QuestionFigure } from "@/components/practice/question-figure";
import {
  CATEGORY_LABELS,
  LEVEL_LABELS,
  PENDING_LESSONS,
  PRACTICE_SETS,
  VDC_TYPES,
  countByLevel,
  getSetQuestions,
  type Question,
  type QuestionCategory,
  type QuestionLevel,
  type UserAnswer,
} from "@/data/question-bank";
import {
  formatCorrectAnswer,
  formatUserAnswer,
  gradeQuestion,
  pickQuestions,
} from "@/lib/practice/grading";
import {
  getLearningState,
  subscribeLearningState,
  toggleSavedQuestion,
} from "@/lib/learning-store";
import { useAuth } from "@/lib/account/client";
import { newClientId, recordAttempt } from "@/lib/account/sync";

export const Route = createFileRoute("/luyen-tap")({
  validateSearch: (search: Record<string, unknown>): { bai?: string } =>
    typeof search["bai"] === "string" ? { bai: search["bai"] } : {},
  head: () => ({
    meta: [
      { title: "Luyện tập Vật lý theo bài & mức độ | Trường THPT Tam Giang" },
      {
        name: "description",
        content:
          "Ngân hàng bài tập Vật lý THPT chia 4 mức độ (nhận biết, thông hiểu, vận dụng, vận dụng cao), chấm điểm tự động, có lời giải chi tiết và bài tập gắn với thí nghiệm.",
      },
    ],
  }),
  component: LuyenTapPage,
});

const LEVELS: QuestionLevel[] = [1, 2, 3, 4];
const COUNTS = [5, 10, 15, 20];

interface Session {
  setCode: string;
  questions: Question[];
  startedAt: number;
}

interface Result {
  finishedAt: number;
  durationSec: number;
  score: number;
  correct: number;
  savedToAccount: boolean;
}

function emptyAnswer(question: Question): UserAnswer {
  if (question.form === "mcq") return { form: "mcq", choice: null };
  if (question.form === "tf") return { form: "tf", choices: question.statements.map(() => null) };
  if (question.form === "short") return { form: "short", text: "" };
  return { form: "numeric", text: "" };
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function LuyenTapPage() {
  const search = Route.useSearch();
  const { user } = useAuth();
  const grades = useMemo(() => [...new Set(PRACTICE_SETS.map((s) => s.grade))], []);
  const initialSet = PRACTICE_SETS.find((s) => s.code === search.bai) ?? PRACTICE_SETS[0]!;

  const [grade, setGrade] = useState(initialSet.grade);
  const [setCode, setSetCode] = useState(initialSet.code);
  const [levels, setLevels] = useState<QuestionLevel[]>(LEVELS);
  const [category, setCategory] = useState<QuestionCategory | "all">("all");
  const [count, setCount] = useState(10);
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);

  const [session, setSession] = useState<Session | null>(null);
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [wrongOnly, setWrongOnly] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => subscribeLearningState((state) => setSaved(state.savedQuestions)), []);

  useEffect(() => {
    if (!session || result) return;
    const timer = window.setInterval(
      () => setElapsed(Math.round((Date.now() - session.startedAt) / 1000)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [session, result]);

  const setsOfGrade = PRACTICE_SETS.filter((s) => s.grade === grade);
  const currentSet = PRACTICE_SETS.find((s) => s.code === setCode) ?? initialSet;
  const allOfSet = useMemo(() => getSetQuestions(currentSet.code), [currentSet.code]);
  const levelCounts = countByLevel(allOfSet);
  const categories = useMemo(() => [...new Set(allOfSet.map((x) => x.category))], [allOfSet]);
  const pool = allOfSet.filter(
    (x) =>
      levels.includes(x.level) &&
      (category === "all" || x.category === category) &&
      (!savedOnly || saved.includes(x.id)),
  );

  const begin = (questions: Question[]) => {
    setSession({ setCode: currentSet.code, questions, startedAt: Date.now() });
    setAnswers({});
    setResult(null);
    setWrongOnly(false);
    setElapsed(0);
    topRef.current?.scrollIntoView({ block: "start" });
  };

  const submit = () => {
    if (!session) return;
    const finishedAt = Date.now();
    const durationSec = Math.max(1, Math.round((finishedAt - session.startedAt) / 1000));
    const graded = session.questions.map((item) => ({
      item,
      grade: gradeQuestion(item, answers[item.id]),
    }));
    const total = graded.length;
    const correct = graded.filter((x) => x.grade.correct).length;
    const score =
      Math.round((graded.reduce((sum, x) => sum + x.grade.score, 0) / total) * 100) / 10;
    const savedToAccount = recordAttempt({
      clientId: newClientId("lt"),
      source: currentSet.experiment ? "experiment" : "practice",
      title: currentSet.name,
      grade: currentSet.grade,
      topic: currentSet.topic,
      lessonKey: currentSet.key,
      level: levels.length === 4 ? "tong-hop" : levels.map((l) => LEVEL_LABELS[l]).join(", "),
      startedAt: new Date(session.startedAt).toISOString(),
      finishedAt: new Date(finishedAt).toISOString(),
      durationSec,
      total,
      correct,
      wrong: total - correct,
      score,
      meta: { setCode: currentSet.code, href: currentSet.href },
      answers: graded.map(({ item, grade: g }) => ({
        questionId: item.id,
        lessonKey: item.lessonKey,
        level: String(item.level),
        kind: item.category,
        isCorrect: g.correct,
        detail: {
          stem: item.stem,
          yours: formatUserAnswer(item, answers[item.id]),
          correct: formatCorrectAnswer(item),
          explanation: item.explanation,
          score: g.score,
        },
      })),
    });
    setResult({ finishedAt, durationSec, score, correct, savedToAccount });
    topRef.current?.scrollIntoView({ block: "start" });
  };

  const answeredCount = session
    ? session.questions.filter((item) => gradeQuestion(item, answers[item.id]).answered).length
    : 0;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader currentPath="/luyen-tap" />
      <main className="flex-1 pb-16">
        <div ref={topRef} className="mx-auto max-w-4xl scroll-mt-16 px-3 pt-6 sm:px-6">
          <div className="mb-5 flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#16845A]/15 text-[#16845A] dark:text-[#72CF91]">
              <ClipboardList className="size-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold sm:text-2xl">Luyện tập theo bài học</h1>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Chọn bài, mức độ và số câu. Hệ thống chấm tự động, hiển thị đáp án và lời giải từng
                bước.
                {user
                  ? " Kết quả được lưu vào tài khoản của em."
                  : " Em đang học ở chế độ khách — đăng nhập để lưu kết quả và xem lại trên thiết bị khác."}
              </p>
            </div>
          </div>

          {!session && (
            <section className="space-y-5 rounded-2xl border border-border bg-card p-4 shadow-xs sm:p-6">
              <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
                <label className="space-y-1.5 text-xs font-semibold">
                  <span>Khối lớp</span>
                  <select
                    value={grade}
                    onChange={(e) => {
                      setGrade(e.target.value);
                      const first = PRACTICE_SETS.find((s) => s.grade === e.target.value);
                      if (first) setSetCode(first.code);
                      setCategory("all");
                    }}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm font-normal"
                  >
                    {grades.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1.5 text-xs font-semibold">
                  <span>Bài học / thí nghiệm</span>
                  <select
                    value={setCode}
                    onChange={(e) => {
                      setSetCode(e.target.value);
                      setCategory("all");
                    }}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm font-normal"
                  >
                    {[...new Set(setsOfGrade.map((s) => s.topic))].map((topic) => (
                      <optgroup key={topic} label={topic}>
                        {setsOfGrade
                          .filter((s) => s.topic === topic)
                          .map((s) => (
                            <option key={s.code} value={s.code}>
                              {s.name}
                            </option>
                          ))}
                      </optgroup>
                    ))}
                  </select>
                </label>
              </div>

              <fieldset>
                <legend className="mb-2 text-xs font-semibold">Mức độ</legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {LEVELS.map((level) => {
                    const on = levels.includes(level);
                    return (
                      <button
                        key={level}
                        type="button"
                        aria-pressed={on}
                        onClick={() =>
                          setLevels((cur) =>
                            on
                              ? cur.length > 1
                                ? cur.filter((l) => l !== level)
                                : cur
                              : [...cur, level].sort(),
                          )
                        }
                        className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                          on
                            ? "border-[#16845A] bg-[#16845A]/12 font-semibold text-[#0f6b47] dark:text-[#9be3b4]"
                            : "border-border text-muted-foreground hover:bg-secondary/50"
                        }`}
                      >
                        <span className="block">{LEVEL_LABELS[level]}</span>
                        <span className="font-mono text-[10px] opacity-75">
                          {levelCounts[level]} câu
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 text-xs font-semibold">
                  <span>Dạng bài</span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as QuestionCategory | "all")}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm font-normal"
                  >
                    <option value="all">Tất cả các dạng</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {CATEGORY_LABELS[c]}
                      </option>
                    ))}
                  </select>
                </label>
                <fieldset>
                  <legend className="mb-1.5 text-xs font-semibold">Số câu</legend>
                  <div className="flex gap-2">
                    {COUNTS.map((n) => (
                      <button
                        key={n}
                        type="button"
                        aria-pressed={count === n}
                        onClick={() => setCount(n)}
                        className={`h-10 flex-1 rounded-lg border text-sm ${
                          count === n
                            ? "border-[#16845A] bg-[#16845A] font-semibold text-white"
                            : "border-border hover:bg-secondary/50"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>

              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={savedOnly}
                  onChange={(e) => setSavedOnly(e.target.checked)}
                  className="size-4 accent-[#16845A]"
                />
                Chỉ luyện các câu em đã đánh dấu (
                {allOfSet.filter((x) => saved.includes(x.id)).length} câu trong bài này)
              </label>

              <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
                <button
                  type="button"
                  disabled={pool.length === 0}
                  onClick={() => begin(pickQuestions(pool, count))}
                  className="h-11 rounded-lg bg-[#16845A] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#126b48] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Bắt đầu làm bài ({Math.min(count, pool.length)} câu)
                </button>
                <a
                  href={currentSet.href}
                  className="text-xs font-medium text-[#16845A] hover:underline dark:text-[#72CF91]"
                >
                  {currentSet.experiment ? "Mở thí nghiệm liên quan →" : "Ôn lại bài học này →"}
                </a>
                {pool.length === 0 && (
                  <span className="text-xs text-amber-600 dark:text-amber-400">
                    Không có câu nào khớp bộ lọc — hãy nới điều kiện.
                  </span>
                )}
              </div>

              {PENDING_LESSONS.length > 0 && (
                <p className="rounded-lg bg-secondary/50 p-3 text-[11px] leading-relaxed text-muted-foreground">
                  Ngân hàng nội bộ hiện có {PRACTICE_SETS.length} bộ đề (Lớp 10 và bài tập gắn thí
                  nghiệm). {PENDING_LESSONS.length} bài của Lớp 11–12 đang được biên soạn; trong lúc
                  chờ, em luyện các bài đó tại phần Trắc nghiệm của từng bài trong{" "}
                  <Link to="/mo-phong" className="underline">
                    Phòng Lab
                  </Link>
                  .
                </p>
              )}
            </section>
          )}

          {session && (
            <section className="space-y-4">
              <div className="sticky top-14 z-20 -mx-3 flex flex-wrap items-center justify-between gap-2 border-b border-border bg-background/95 px-3 py-2.5 backdrop-blur sm:mx-0 sm:rounded-xl sm:border">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{currentSet.name}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {result
                      ? `Đúng ${result.correct}/${session.questions.length} câu · ${formatDuration(result.durationSec)}`
                      : `Đã trả lời ${answeredCount}/${session.questions.length} câu`}
                  </div>
                </div>
                {result ? (
                  <div className="rounded-lg bg-[#16845A] px-3 py-1.5 font-mono text-sm font-bold text-white">
                    {String(result.score).replace(".", ",")} / 10
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 font-mono text-sm">
                    <Timer className="size-4 text-muted-foreground" />
                    {formatDuration(elapsed)}
                  </div>
                )}
              </div>

              {result && (
                <div className="space-y-3 rounded-2xl border border-border bg-card p-4 text-sm">
                  <p role="status">
                    {result.savedToAccount ? (
                      <span className="text-[#0f6b47] dark:text-[#9be3b4]">
                        Kết quả đã được lưu vào lịch sử làm bài của em.{" "}
                        <Link to="/tai-khoan" className="underline">
                          Xem nhật ký học tập
                        </Link>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        Kết quả này chưa được lưu vì em đang ở chế độ khách.{" "}
                        <Link
                          to="/tai-khoan"
                          className="font-medium text-[#16845A] underline dark:text-[#72CF91]"
                        >
                          Đăng nhập
                        </Link>{" "}
                        trước khi làm bài để lưu lịch sử.
                      </span>
                    )}
                  </p>
                  {result.correct < session.questions.length && (
                    <p className="text-xs text-muted-foreground">
                      Gợi ý: em sai {session.questions.length - result.correct} câu, chủ yếu ở mức{" "}
                      <b>
                        {
                          LEVEL_LABELS[
                            LEVELS.map((l) => ({
                              l,
                              n: session.questions.filter(
                                (x) => x.level === l && !gradeQuestion(x, answers[x.id]).correct,
                              ).length,
                            })).sort((a, b) => b.n - a.n)[0]!.l
                          ]
                        }
                      </b>
                      . Hãy xem lời giải bên dưới rồi{" "}
                      <a href={currentSet.href} className="underline">
                        {currentSet.experiment ? "mở lại thí nghiệm" : "ôn lại bài học"}
                      </a>
                      .
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {result.correct < session.questions.length && (
                      <button
                        type="button"
                        onClick={() =>
                          begin(
                            session.questions.filter(
                              (x) => !gradeQuestion(x, answers[x.id]).correct,
                            ),
                          )
                        }
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#16845A] px-3 text-xs font-semibold text-white hover:bg-[#126b48]"
                      >
                        <RotateCcw className="size-3.5" /> Làm lại các câu sai
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => begin(session.questions)}
                      className="h-9 rounded-lg border border-border px-3 text-xs font-medium hover:bg-secondary/50"
                    >
                      Làm lại cả đề
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSession(null);
                        setResult(null);
                      }}
                      className="h-9 rounded-lg border border-border px-3 text-xs font-medium hover:bg-secondary/50"
                    >
                      Chọn đề khác
                    </button>
                    <label className="ml-auto flex items-center gap-1.5 text-xs">
                      <input
                        type="checkbox"
                        checked={wrongOnly}
                        onChange={(e) => setWrongOnly(e.target.checked)}
                        className="size-4 accent-[#16845A]"
                      />
                      Chỉ xem câu sai
                    </label>
                  </div>
                </div>
              )}

              <ol className="space-y-4">
                {session.questions.map((item, index) => {
                  const g = result ? gradeQuestion(item, answers[item.id]) : null;
                  if (result && wrongOnly && g?.correct) return null;
                  return (
                    <QuestionCard
                      key={item.id}
                      index={index + 1}
                      question={item}
                      answer={answers[item.id] ?? emptyAnswer(item)}
                      onChange={(next) => setAnswers((cur) => ({ ...cur, [item.id]: next }))}
                      locked={Boolean(result)}
                      correct={g ? g.correct : null}
                      partial={g ? g.score : null}
                      flagged={saved.includes(item.id)}
                    />
                  );
                })}
              </ol>

              {!result && (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={submit}
                    className="h-11 rounded-lg bg-[#16845A] px-6 text-sm font-semibold text-white hover:bg-[#126b48]"
                  >
                    Nộp bài và xem lời giải
                  </button>
                  <button
                    type="button"
                    onClick={() => setSession(null)}
                    className="h-11 rounded-lg border border-border px-4 text-sm hover:bg-secondary/50"
                  >
                    Thoát
                  </button>
                  {answeredCount < session.questions.length && (
                    <span className="text-xs text-muted-foreground">
                      Còn {session.questions.length - answeredCount} câu chưa trả lời (sẽ tính là
                      sai).
                    </span>
                  )}
                </div>
              )}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function QuestionCard({
  index,
  question,
  answer,
  onChange,
  locked,
  correct,
  partial,
  flagged,
}: {
  index: number;
  question: Question;
  answer: UserAnswer;
  onChange: (next: UserAnswer) => void;
  locked: boolean;
  correct: boolean | null;
  partial: number | null;
  flagged: boolean;
}) {
  const inputId = `q-${question.id}`;
  return (
    <li
      className={`rounded-2xl border bg-card p-4 shadow-xs sm:p-5 ${
        correct == null ? "border-border" : correct ? "border-[#16845A]/60" : "border-red-500/50"
      }`}
    >
      <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[10px] font-semibold">
        <span className="rounded-md bg-[#16845A]/15 px-2 py-0.5 text-[#0f6b47] dark:text-[#9be3b4]">
          Câu {index} · {LEVEL_LABELS[question.level]}
        </span>
        <span className="rounded-md bg-secondary px-2 py-0.5 text-muted-foreground">
          {CATEGORY_LABELS[question.category]}
        </span>
        {question.deep && (
          <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-amber-700 dark:text-amber-300">
            {VDC_TYPES[question.deep.type]}
          </span>
        )}
        {question.experiment && (
          <FlaskConical
            className="size-3.5 text-muted-foreground"
            aria-label="Gắn với thí nghiệm"
          />
        )}
        <button
          type="button"
          onClick={() => toggleSavedQuestion(question.id)}
          aria-pressed={flagged}
          className={`ml-auto inline-flex h-7 items-center gap-1 rounded-md px-2 text-[11px] font-medium ${
            flagged
              ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
              : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          {flagged ? <BookmarkCheck className="size-3.5" /> : <Bookmark className="size-3.5" />}
          {flagged ? "Đã đánh dấu" : "Đánh dấu"}
        </button>
      </div>

      <p className="text-sm leading-relaxed font-medium">{question.stem}</p>
      {question.figure && <QuestionFigure figure={question.figure} />}

      <div className="mt-3">
        {question.form === "mcq" && answer.form === "mcq" && (
          <div className="grid gap-2 sm:grid-cols-2">
            {question.options.map((option, i) => {
              const chosen = answer.choice === i;
              const isRight = locked && i === question.answerIndex;
              const isWrong = locked && chosen && i !== question.answerIndex;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={locked}
                  aria-pressed={chosen}
                  onClick={() => onChange({ form: "mcq", choice: i })}
                  className={`flex min-h-11 items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    isRight
                      ? "border-[#16845A] bg-[#16845A]/12"
                      : isWrong
                        ? "border-red-500 bg-red-500/10"
                        : chosen
                          ? "border-[#16845A] bg-[#16845A]/10"
                          : "border-border hover:bg-secondary/50"
                  }`}
                >
                  <span className="font-mono font-bold">{"ABCD"[i]}.</span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
        )}

        {question.form === "tf" && answer.form === "tf" && (
          <div className="space-y-2">
            {question.statements.map((statement, i) => {
              const value = answer.choices[i] ?? null;
              const wrong = locked && value !== statement.answer;
              return (
                <div
                  key={i}
                  className={`flex flex-col gap-2 rounded-lg border px-3 py-2 text-sm sm:flex-row sm:items-center ${
                    wrong ? "border-red-500/60 bg-red-500/5" : "border-border"
                  }`}
                >
                  <span className="flex-1">
                    <b className="font-mono">{"abcd"[i]})</b> {statement.text}
                    {locked && (
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        Đáp án: <b>{statement.answer ? "Đúng" : "Sai"}</b>
                        {statement.note ? ` — ${statement.note}` : ""}
                      </span>
                    )}
                  </span>
                  <span className="flex shrink-0 gap-1.5">
                    {[true, false].map((choice) => (
                      <button
                        key={String(choice)}
                        type="button"
                        disabled={locked}
                        aria-pressed={value === choice}
                        onClick={() =>
                          onChange({
                            form: "tf",
                            choices: question.statements.map((_, k) =>
                              k === i ? choice : (answer.choices[k] ?? null),
                            ),
                          })
                        }
                        className={`h-9 min-w-14 rounded-md border px-2 text-xs font-semibold ${
                          value === choice
                            ? "border-[#16845A] bg-[#16845A] text-white"
                            : "border-border hover:bg-secondary/50"
                        }`}
                      >
                        {choice ? "Đúng" : "Sai"}
                      </button>
                    ))}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {(question.form === "numeric" || question.form === "short") &&
          (answer.form === "numeric" || answer.form === "short") && (
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor={inputId} className="text-xs font-semibold">
                Trả lời:
              </label>
              <input
                id={inputId}
                value={answer.text}
                disabled={locked}
                onChange={(e) =>
                  onChange({ form: answer.form, text: e.target.value } as UserAnswer)
                }
                inputMode={question.form === "numeric" ? "decimal" : "text"}
                autoComplete="off"
                placeholder={
                  question.form === "numeric"
                    ? "ví dụ 12,5 hoặc 4,5·10^-5"
                    : "nhập câu trả lời ngắn"
                }
                className="h-10 w-full max-w-xs rounded-lg border border-border bg-background px-3 text-sm"
              />
              {question.form === "numeric" && question.unit && (
                <span className="font-mono text-sm text-muted-foreground">{question.unit}</span>
              )}
            </div>
          )}
      </div>

      {locked && (
        <div className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
          <p
            className={`flex items-center gap-1.5 font-semibold ${correct ? "text-[#0f6b47] dark:text-[#9be3b4]" : "text-red-600 dark:text-red-400"}`}
          >
            {correct ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
            {correct
              ? "Chính xác"
              : partial && partial > 0
                ? `Đúng một phần (${partial} điểm)`
                : "Chưa đúng"}
            <span className="font-normal text-foreground">
              — Đáp án: {formatCorrectAnswer(question)}
            </span>
          </p>
          <p className="leading-relaxed text-muted-foreground">
            <b className="text-foreground">Lời giải: </b>
            {question.explanation}
          </p>
          {question.deep && (
            <dl className="space-y-1.5 rounded-lg bg-secondary/50 p-3 text-xs leading-relaxed">
              <div>
                <dt className="inline font-semibold">Phân tích tư duy: </dt>
                <dd className="inline text-muted-foreground">{question.deep.thinking}</dd>
              </div>
              <div>
                <dt className="inline font-semibold">Kiến thức cần vận dụng: </dt>
                <dd className="inline text-muted-foreground">{question.deep.knowledge}</dd>
              </div>
              <div>
                <dt className="inline font-semibold">Lỗi sai thường gặp: </dt>
                <dd className="inline text-muted-foreground">{question.deep.pitfall}</dd>
              </div>
            </dl>
          )}
        </div>
      )}
    </li>
  );
}
