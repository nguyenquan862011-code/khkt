/**
 * Trang chi tiết thí nghiệm — /thi-nghiem/$slug
 * Đầy đủ 14 phần chuẩn + câu hỏi kiểm tra tương tác.
 */
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock,
  FlaskConical,
  HelpCircle,
  Lightbulb,
  PlayCircle,
  Target,
  Wrench,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { ExperimentPhoto } from "@/components/experiments/experiment-photo";
import { ExperimentSim } from "@/components/experiments/experiment-sim";
import {
  EXPERIMENT_KIND_LABELS,
  EXPERIMENT_LEVEL_LABELS,
  EXPERIMENT_TOPIC_LABELS,
  getExperimentBySlug,
} from "@/data/experiments";
import { getEngine } from "@/data/experiments/engines";

export const Route = createFileRoute("/thi-nghiem_/$slug")({
  loader: ({ params }) => {
    const experiment = getExperimentBySlug(params.slug);
    if (!experiment) throw notFound();
    return { experiment };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.experiment.title ?? "Thí nghiệm"} | TamGiang Physics` },
      { name: "description", content: loaderData?.experiment.description },
    ],
  }),
  component: ExperimentDetailPage,
  notFoundComponent: ExperimentNotFound,
});

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
      <span className="text-[#16845A]">{icon}</span> {children}
    </h2>
  );
}

function ExperimentDetailPage() {
  const { experiment } = Route.useLoaderData();
  const engine = getEngine(experiment.sim.engineId);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const quizScore = useMemo(() => {
    let correct = 0;
    for (const [i, a] of Object.entries(answers)) {
      const q = experiment.quiz[Number(i)];
      if (q && q.answerIndex === a) correct += 1;
    }
    return correct;
  }, [answers, experiment.quiz]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200">
      <SiteHeader currentPath="/thi-nghiem" />

      <main className="flex-1 pb-20">
        {/* Đầu trang */}
        <section className="border-b border-border bg-gradient-to-b from-secondary/50 via-background to-background px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Link
              to="/thi-nghiem"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> Về thư viện thí nghiệm
            </Link>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#16845A]/40 px-3 py-1 text-xs font-semibold text-[#16845A]">
              <FlaskConical className="size-3.5" /> {experiment.code} ·{" "}
              {EXPERIMENT_TOPIC_LABELS[experiment.topic]} ·{" "}
              {EXPERIMENT_LEVEL_LABELS[experiment.level]} ·{" "}
              {EXPERIMENT_KIND_LABELS[experiment.kind]}
            </p>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {experiment.title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {experiment.description}
            </p>
            <p className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" /> {experiment.durationMinutes} phút
              </span>
              <span>{experiment.chapter}</span>
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
          {/* 1. Giới thiệu */}
          <section className="space-y-3">
            <SectionTitle icon={<BookOpen className="size-5" />}>1. Giới thiệu</SectionTitle>
            <p className="text-sm leading-relaxed text-muted-foreground">{experiment.intro}</p>
          </section>

          {/* 2. Mục tiêu */}
          <section className="space-y-3">
            <SectionTitle icon={<Target className="size-5" />}>2. Mục tiêu thí nghiệm</SectionTitle>
            <ul className="space-y-2">
              {experiment.objectives.map((o) => (
                <li key={o} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#16845A]" /> {o}
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Kiến thức */}
          <section className="space-y-3">
            <SectionTitle icon={<Lightbulb className="size-5" />}>3. Kiến thức Vật lý</SectionTitle>
            <ul className="space-y-2 rounded-2xl border border-border bg-card p-4">
              {experiment.knowledge.map((k) => (
                <li key={k} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#16845A]" /> {k}
                </li>
              ))}
            </ul>
          </section>

          {/* 4. Dụng cụ */}
          <section className="space-y-3">
            <SectionTitle icon={<Wrench className="size-5" />}>4. Dụng cụ – Vật liệu</SectionTitle>
            <div className="grid gap-2 sm:grid-cols-2">
              {experiment.apparatus.map((a) => (
                <div
                  key={a}
                  className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-muted-foreground"
                >
                  {a}
                </div>
              ))}
            </div>
          </section>

          {/* 5. Hình ảnh thực tế */}
          <section className="space-y-3">
            <SectionTitle icon={<FlaskConical className="size-5" />}>
              5. Hình ảnh thực tế
            </SectionTitle>
            <ExperimentPhoto photoIds={experiment.photoIds} title={experiment.title} />
          </section>

          {/* 6. Quy trình */}
          <section className="space-y-3">
            <SectionTitle icon={<ClipboardList className="size-5" />}>
              6. Quy trình thực hiện
            </SectionTitle>
            <ol className="space-y-3">
              {experiment.procedure.map((step, i) => (
                <li key={step} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#16845A] text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </section>

          {/* 7–11. Mô phỏng tương tác */}
          <section className="space-y-3">
            <SectionTitle icon={<PlayCircle className="size-5" />}>
              7–11. Mô phỏng tương tác, thông số, kết quả & đồ thị
            </SectionTitle>
            {engine ? (
              <ExperimentSim engine={engine} initialParams={experiment.sim.params} />
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Mô phỏng đang được hoàn thiện cho thí nghiệm này.
              </div>
            )}
          </section>

          {/* 10. Bảng số liệu */}
          <section className="space-y-3">
            <SectionTitle icon={<ClipboardList className="size-5" />}>
              10. Bảng số liệu
            </SectionTitle>
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[520px] text-sm">
                <thead className="bg-secondary/60">
                  <tr>
                    {experiment.dataRows.columns.map((c) => (
                      <th key={c} className="px-4 py-2.5 text-left font-semibold text-foreground">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {experiment.dataRows.rows.map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-2.5 text-muted-foreground">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 12. Giải thích */}
          <section className="space-y-3">
            <SectionTitle icon={<Lightbulb className="size-5" />}>
              12. Giải thích hiện tượng
            </SectionTitle>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {experiment.explanation}
            </p>
          </section>

          {/* 13. Kết luận */}
          <section className="rounded-2xl border border-[#16845A]/40 bg-[#16845A]/5 p-5">
            <SectionTitle icon={<CheckCircle2 className="size-5" />}>13. Kết luận</SectionTitle>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{experiment.conclusion}</p>
          </section>

          {/* 14. Câu hỏi kiểm tra */}
          <section className="space-y-4">
            <SectionTitle icon={<HelpCircle className="size-5" />}>
              14. Câu hỏi kiểm tra
            </SectionTitle>
            {experiment.quiz.map((q, qi) => {
              const chosen = answers[qi];
              const answered = chosen !== undefined;
              return (
                <div key={q.q} className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-sm font-semibold">
                    Câu {qi + 1}. {q.q}
                  </p>
                  <div className="mt-3 space-y-2">
                    {q.options.map((opt, oi) => {
                      const isChosen = chosen === oi;
                      const isCorrect = q.answerIndex === oi;
                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={answered}
                          onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                          className={`block w-full rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                            answered
                              ? isCorrect
                                ? "border-[#16845A] bg-[#16845A]/10 text-foreground"
                                : isChosen
                                  ? "border-red-400 bg-red-400/10 text-foreground"
                                  : "border-border text-muted-foreground"
                              : "border-border text-muted-foreground hover:border-[#16845A] hover:bg-secondary/50"
                          }`}
                        >
                          {String.fromCharCode(65 + oi)}. {opt}
                        </button>
                      );
                    })}
                  </div>
                  {answered && (
                    <p className="mt-3 rounded-xl bg-secondary/60 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
                      {q.answerIndex === chosen ? "✅ Chính xác! " : "❌ Chưa đúng. "}
                      {q.explain}
                    </p>
                  )}
                </div>
              );
            })}
            {Object.keys(answers).length === experiment.quiz.length && (
              <p className="rounded-2xl border border-[#16845A]/40 bg-[#16845A]/5 p-4 text-center text-sm font-semibold">
                Kết quả: {quizScore}/{experiment.quiz.length} câu đúng
              </p>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ExperimentNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader currentPath="/thi-nghiem" />
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center">
        <HelpCircle className="size-12 text-amber-500" />
        <h1 className="text-xl font-bold">Không tìm thấy thí nghiệm</h1>
        <p className="text-sm text-muted-foreground">
          Đường dẫn này không khớp thí nghiệm nào trong thư viện.
        </p>
        <Link
          to="/thi-nghiem"
          className="inline-flex items-center gap-2 rounded-xl bg-[#16845A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#126b48]"
        >
          <ArrowLeft className="size-4" /> Về thư viện thí nghiệm
        </Link>
      </div>
      <Footer />
    </div>
  );
}
