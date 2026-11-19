import { useState } from "react";
import {
  Target,
  Info,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  CheckCircle2,
  XCircle,
  FlaskConical,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import type {
  LessonBlock,
  LessonContent,
  LessonExample,
  LessonExercise,
  LessonReflection,
} from "@/data/lessons/types";

/** Render **đậm** và *nghiêng* đơn giản, an toàn (không dùng dangerouslySetInnerHTML). */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-[#EDF5ED]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
          return (
            <em key={i} className="italic">
              {part.slice(1, -1)}
            </em>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

const CALLOUT_STYLES = {
  info: {
    icon: Info,
    wrap: "border-sky-500/30 bg-sky-500/10",
    title: "text-sky-200",
    iconColor: "text-sky-300",
  },
  warn: {
    icon: AlertTriangle,
    wrap: "border-amber-500/30 bg-amber-500/10",
    title: "text-amber-200",
    iconColor: "text-amber-300",
  },
  tip: {
    icon: Lightbulb,
    wrap: "border-[#38A875]/35 bg-[#38A875]/10",
    title: "text-[#72CF91]",
    iconColor: "text-[#38A875]",
  },
} as const;

function Block({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "text":
      return (
        <p className="text-sm leading-relaxed text-[#C8DACB]">
          <RichText text={block.value} />
        </p>
      );

    case "formula":
      return (
        <div className="rounded-xl border border-[#153325] bg-[#0B1511] p-4">
          <div className="font-mono text-base font-bold tracking-wide text-[#72CF91]">
            {block.expression}
          </div>
          {block.legend && (
            <p className="mt-2 text-xs leading-relaxed text-[#8AA08D]">{block.legend}</p>
          )}
        </div>
      );

    case "list":
      return (
        <ul className="space-y-2 text-sm leading-relaxed text-[#C8DACB]">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#38A875]" />
              <span>
                <RichText text={item} />
              </span>
            </li>
          ))}
        </ul>
      );

    case "callout": {
      const st = CALLOUT_STYLES[block.tone];
      const Icon = st.icon;
      return (
        <div className={`flex items-start gap-2.5 rounded-xl border p-3.5 ${st.wrap}`}>
          <Icon className={`mt-0.5 size-4 shrink-0 ${st.iconColor}`} />
          <div className="space-y-1">
            <p className={`text-xs font-semibold ${st.title}`}>{block.title}</p>
            <p className="text-xs leading-relaxed text-[#C8DACB]">
              <RichText text={block.value} />
            </p>
          </div>
        </div>
      );
    }

    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-[#153325]">
          <table className="w-full min-w-[30rem] border-collapse text-xs">
            <thead>
              <tr className="bg-[#0B1511]">
                {block.headers.map((h) => (
                  <th
                    key={h}
                    className="border-b border-[#153325] px-3 py-2 text-left font-semibold text-[#72CF91]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="even:bg-[#0B1511]/50">
                  {row.map((cell, c) => (
                    <td
                      key={c}
                      className="border-b border-[#153325]/60 px-3 py-2 align-top text-[#C8DACB]"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {block.caption && (
            <p className="bg-[#0B1511] px-3 py-1.5 text-[11px] text-[#8AA08D]">{block.caption}</p>
          )}
        </div>
      );

    default:
      return null;
  }
}

function ExampleCard({ example }: { example: LessonExample }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-[#153325] bg-[#0B1511]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-[#EDF5ED]">{example.title}</span>
        <ChevronDown
          className={`size-4 shrink-0 text-[#72CF91] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="space-y-3 border-t border-[#153325] px-4 py-3.5">
          <div>
            <p className="text-[11px] font-semibold tracking-wide text-[#72CF91] uppercase">
              Đề bài
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[#C8DACB]">{example.prompt}</p>
          </div>
          <ol className="space-y-2.5">
            {example.steps.map((s) => (
              <li key={s.label} className="flex items-start gap-2">
                <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-[#38A875]" />
                <div>
                  <p className="text-xs font-semibold text-[#A5B7A8]">{s.label}</p>
                  <p className="text-sm leading-relaxed text-[#C8DACB]">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="rounded-lg border border-[#38A875]/35 bg-[#38A875]/10 p-3">
            <p className="text-[11px] font-semibold tracking-wide text-[#72CF91] uppercase">
              Kết quả
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[#EDF5ED]">{example.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ExerciseCard({ exercise, index }: { exercise: LessonExercise; index: number }) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const correct = picked === exercise.correctIndex;

  return (
    <div className="rounded-xl border border-[#153325] bg-[#0B1511] p-4">
      <p className="text-sm font-semibold text-[#EDF5ED]">
        Câu {index + 1}. {exercise.prompt}
      </p>
      <div className="mt-3 space-y-2">
        {exercise.options.map((opt, i) => {
          const isPicked = picked === i;
          const isRight = i === exercise.correctIndex;
          let cls = "border-[#2B4033] bg-[#091A13] hover:border-[#38A875]/50";
          if (answered) {
            if (isRight) cls = "border-[#38A875] bg-[#38A875]/15";
            else if (isPicked) cls = "border-red-500/60 bg-red-500/10";
            else cls = "border-[#2B4033] bg-[#091A13] opacity-60";
          }
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => setPicked(i)}
              className={`flex w-full items-start gap-2.5 rounded-lg border px-3 py-2 text-left text-sm text-[#C8DACB] transition-colors ${cls}`}
            >
              <span className="mt-0.5 font-mono text-xs text-[#8AA08D]">
                {String.fromCharCode(65 + i)}.
              </span>
              <span className="flex-1">{opt}</span>
              {answered && isRight && <CheckCircle2 className="mt-0.5 size-4 text-[#38A875]" />}
              {answered && isPicked && !isRight && (
                <XCircle className="mt-0.5 size-4 text-red-400" />
              )}
            </button>
          );
        })}
      </div>
      {answered && (
        <div
          className={`mt-3 rounded-lg border p-3 text-xs leading-relaxed ${
            correct
              ? "border-[#38A875]/40 bg-[#38A875]/10 text-[#C8DACB]"
              : "border-amber-500/30 bg-amber-500/10 text-amber-100"
          }`}
        >
          <p className="font-semibold">
            {correct ? "Chính xác!" : "Chưa đúng — đáp án đúng là "}
            {!correct && (
              <span className="text-[#72CF91]">
                {String.fromCharCode(65 + exercise.correctIndex)}
              </span>
            )}
          </p>
          <p className="mt-1">{exercise.explanation}</p>
        </div>
      )}
    </div>
  );
}

function ReflectionCard({ reflection }: { reflection: LessonReflection }) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  return (
    <div className="rounded-2xl border border-[#38A875]/40 bg-[#091A13] p-4 sm:p-5">
      <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#72CF91] uppercase">
        <FlaskConical className="size-3.5" /> Suy ngẫm
      </p>
      <p className="mt-2 text-sm font-semibold text-[#EDF5ED]">{reflection.question}</p>
      <div className="mt-3 space-y-2">
        {reflection.options.map((opt, i) => {
          const isPicked = picked === i;
          const isRight = i === reflection.correctIndex;
          let cls = "border-[#2B4033] bg-[#0B1511] hover:border-[#38A875]/50";
          if (answered) {
            if (isRight) cls = "border-[#38A875] bg-[#38A875]/15";
            else if (isPicked) cls = "border-red-500/60 bg-red-500/10";
            else cls = "border-[#2B4033] bg-[#0B1511] opacity-60";
          }
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => setPicked(i)}
              className={`w-full rounded-lg border px-3 py-2 text-left text-sm text-[#C8DACB] transition-colors ${cls}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <p className="mt-3 rounded-lg border border-[#153325] bg-[#0B1511] p-3 text-xs leading-relaxed text-[#C8DACB]">
          {reflection.explanation}
        </p>
      )}
    </div>
  );
}

function ReviewBadge({ content }: { content: LessonContent }) {
  if (content.review.status === "teacher-reviewed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#38A875]/40 bg-[#38A875]/10 px-2.5 py-1 text-[11px] font-semibold text-[#72CF91]">
        <CheckCircle2 className="size-3" /> Giáo viên đã duyệt
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-200"
      title={content.review.note}
    >
      <ShieldAlert className="size-3" /> Bản nháp — chờ giáo viên duyệt
    </span>
  );
}

export function LessonContentView({ content }: { content: LessonContent }) {
  return (
    <article className="mx-auto max-w-3xl space-y-6 px-1 pb-10">
      <header className="space-y-3 border-b border-[#153325] pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <ReviewBadge content={content} />
          <span className="text-[11px] text-[#8AA08D]">Biên soạn: Trường THPT Tam Giang</span>
        </div>
        <h1 className="text-xl font-bold text-[#EDF5ED] sm:text-2xl">{content.title}</h1>
        {content.objectives.length > 0 && (
          <div className="rounded-xl border border-[#153325] bg-[#091A13] p-3.5">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-[#72CF91] uppercase">
              <Target className="size-3.5" /> Mục tiêu bài học
            </p>
            <ul className="mt-2 space-y-1.5">
              {content.objectives.map((o, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs leading-relaxed text-[#C8DACB]"
                >
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#38A875]" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <section className="space-y-4">
        {content.blocks.map((b, i) => (
          <Block key={i} block={b} />
        ))}
      </section>

      {content.examples.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-bold text-[#EDF5ED]">Ví dụ minh hoạ</h2>
          <div className="space-y-2.5">
            {content.examples.map((ex) => (
              <ExampleCard key={ex.id} example={ex} />
            ))}
          </div>
        </section>
      )}

      {content.exercises.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-bold text-[#EDF5ED]">Bài tập tự kiểm tra</h2>
          <div className="space-y-2.5">
            {content.exercises.map((ex, i) => (
              <ExerciseCard key={ex.id} exercise={ex} index={i} />
            ))}
          </div>
        </section>
      )}

      {content.reflection && <ReflectionCard reflection={content.reflection} />}
    </article>
  );
}
