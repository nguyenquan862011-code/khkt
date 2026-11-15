import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useRef } from "react";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { ClassicExperimentDiagram } from "@/components/classic-experiment-diagram";
import { ExperimentPhoto } from "@/components/experiment-photo";
import { CLASSIC_EXPERIMENTS, type ClassicCategory } from "@/data/classic-experiments";
import { getLearningState, subscribeLearningState, toggleFavoriteItem } from "@/lib/learning-store";
import {
  History,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Star,
  BookOpen,
  Lightbulb,
  ListChecks,
  HelpCircle,
  ExternalLink,
  Minus,
  Plus,
} from "lucide-react";

export const Route = createFileRoute("/thi-nghiem-kinh-dien")({
  head: () => ({
    meta: [
      { title: "Thí nghiệm Vật lý Kinh điển | Trường THPT Tam Giang" },
      {
        name: "description",
        content:
          "Thư viện 30 thí nghiệm kinh điển làm thay đổi lịch sử Vật lý nhân loại: Galilei, Newton, Young, Coulomb, Faraday, Millikan, Rutherford, Bohr với mô phỏng tương tác trực quan.",
      },
      { property: "og:title", content: "Thí nghiệm Vật lý Kinh điển | Trường THPT Tam Giang" },
      {
        property: "og:description",
        content:
          "Thư viện 30 thí nghiệm kinh điển làm thay đổi lịch sử Vật lý nhân loại với mô phỏng tương tác trực quan.",
      },
    ],
  }),
  component: ClassicExperimentsPage,
});

function clampParam(val: number, min: number, max: number, step: number): number {
  const safe = Number.isFinite(val) ? val : min;
  const clamped = Math.min(max, Math.max(min, safe));
  const decimals = step.toString().includes(".") ? step.toString().split(".")[1]!.length : 0;
  return Number(clamped.toFixed(decimals));
}

function ClassicExperimentsPage() {
  const [selectedExpId, setSelectedExpId] = useState<string>(CLASSIC_EXPERIMENTS[0]!.id);
  const [selectedCategory, setSelectedCategory] = useState<"all" | ClassicCategory | "favorites">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [paramValues, setParamValues] = useState<Record<string, Record<string, number>>>({});
  const [favoriteIds, setFavoriteIds] = useState<string[]>(
    () => getLearningState().favoriteExperiments,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    return subscribeLearningState((state) => {
      setFavoriteIds(state.favoriteExperiments);
    });
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
      return;
    }
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase((p) => p + 0.5);
      setIsPlaying(false);
      return;
    }

    const tick = (now: number) => {
      if (lastTimeRef.current !== null) {
        const dt = Math.min(0.05, (now - lastTimeRef.current) / 1000);
        setPhase((p) => p + dt * 1.4);
      }
      lastTimeRef.current = now;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying]);

  const filteredExperiments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CLASSIC_EXPERIMENTS.filter((e) => {
      const catMatch =
        selectedCategory === "all"
          ? true
          : selectedCategory === "favorites"
            ? favoriteIds.includes(e.id)
            : e.category === selectedCategory;
      const queryMatch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.scientist.toLowerCase().includes(q) ||
        e.code.toLowerCase().includes(q) ||
        e.significance.toLowerCase().includes(q);
      return catMatch && queryMatch;
    });
  }, [selectedCategory, searchQuery, favoriteIds]);

  const activeExperiment = useMemo(() => {
    return (
      filteredExperiments.find((e) => e.id === selectedExpId) ||
      filteredExperiments[0] ||
      CLASSIC_EXPERIMENTS[0]!
    );
  }, [selectedExpId, filteredExperiments]);

  const activeParams = useMemo(() => {
    const stored = paramValues[activeExperiment.id];
    if (stored) return stored;
    const defaults: Record<string, number> = {};
    activeExperiment.modelParams.forEach((p) => {
      defaults[p.label] = p.defaultVal;
    });
    return defaults;
  }, [activeExperiment, paramValues]);

  const result = useMemo(() => {
    return activeExperiment.compute(activeParams);
  }, [activeExperiment, activeParams]);

  const handleSelectExperiment = (id: string) => {
    setSelectedExpId(id);
    setIsPlaying(false);
    setPhase(0);
  };

  const handleParamChange = (
    label: string,
    val: number,
    min: number,
    max: number,
    step: number,
  ) => {
    const clamped = clampParam(val, min, max, step);
    setParamValues((prev) => ({
      ...prev,
      [activeExperiment.id]: {
        ...activeParams,
        [label]: clamped,
      },
    }));
  };

  const handleReset = () => {
    const defaults: Record<string, number> = {};
    activeExperiment.modelParams.forEach((p) => {
      defaults[p.label] = p.defaultVal;
    });
    setParamValues((prev) => ({
      ...prev,
      [activeExperiment.id]: defaults,
    }));
    setIsPlaying(false);
    setPhase(0);
  };

  const isFavorite = favoriteIds.includes(activeExperiment.id);
  const selectedQuizIdx = quizAnswers[activeExperiment.id];
  const quizAnswered = selectedQuizIdx !== undefined;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader currentPath="/thi-nghiem-kinh-dien" />

      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border bg-[#091A13] dark:bg-[#06120D] text-[#EDF5ED] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#72CF91] mb-3">
              <History className="size-3.5 text-[#C8ED78]" />
              <span>Thư viện {CLASSIC_EXPERIMENTS.length} thí nghiệm vật lý kinh điển</span>
            </p>
            <h1 className="text-balance text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Những Thí Nghiệm Làm Thay Đổi Lịch Sử Vật Lý
            </h1>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-[#EDF5ED]/80 leading-relaxed">
              Tái hiện {CLASSIC_EXPERIMENTS.length} thí nghiệm kinh điển từ Galilei, Newton, Young,
              Faraday đến Rutherford, Bohr và Einstein: thiết lập giả thuyết, điều chỉnh thông số,
              chạy mô phỏng trực quan và tự kiểm tra bản chất vật lý.
            </p>

            {/* Category Filter & Quick Search */}
            <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all" as const, label: `Tất cả (${CLASSIC_EXPERIMENTS.length})` },
                  { id: "co-hoc" as const, label: "Cơ học & Động lực học" },
                  { id: "song-dao-dong" as const, label: "Sóng & Dao động" },
                  { id: "dien-hoc" as const, label: "Điện học" },
                  { id: "tu-truong" as const, label: "Từ trường & Cảm ứng" },
                  { id: "quang-hien-dai" as const, label: "Quang học & Hiện đại" },
                  { id: "favorites" as const, label: `Yêu thích (${favoriteIds.length})` },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      selectedCategory === cat.id
                        ? "bg-[#16845A] text-white shadow-sm"
                        : "bg-white/5 text-[#EDF5ED]/75 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm thí nghiệm hoặc nhà vật lý..."
                className="w-full lg:w-64 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white placeholder:text-white/50 outline-none focus:border-[#72CF91]"
                aria-label="Tìm thí nghiệm kinh điển"
              />
            </div>
          </div>
        </section>

        {/* Main Interactive Stage */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar list of experiments */}
            <div className="lg:col-span-4 space-y-2">
              <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground px-1 mb-2">
                Danh mục thí nghiệm ({filteredExperiments.length})
              </h2>
              <div className="space-y-2 max-h-[760px] overflow-y-auto pr-1">
                {filteredExperiments.length === 0 ? (
                  <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
                    Không có thí nghiệm nào khớp với bộ lọc hiện tại.
                  </div>
                ) : (
                  filteredExperiments.map((exp) => {
                    const isSelected = exp.id === activeExperiment.id;
                    const fav = favoriteIds.includes(exp.id);
                    return (
                      <div
                        key={exp.id}
                        className={`rounded-xl p-3.5 transition-all border ${
                          isSelected
                            ? "border-[#16845A] dark:border-[#38A875] bg-[#16845A]/10 dark:bg-[#16845A]/20 shadow-sm"
                            : "border-border bg-card hover:border-[#16845A]/40"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => handleSelectExperiment(exp.id)}
                            className="flex-1 text-left"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-xs font-bold text-[#16845A] dark:text-[#72CF91]">
                                {exp.code}
                              </span>
                              <span className="text-[10px] text-muted-foreground">{exp.year}</span>
                            </div>
                            <h3 className="text-sm font-semibold mt-1 text-foreground">
                              {exp.title}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {exp.significance}
                            </p>
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleFavoriteItem("favoriteExperiments", exp.id)}
                            aria-label={fav ? `Bỏ lưu ${exp.code}` : `Lưu ${exp.code}`}
                            className={`self-start p-1.5 rounded-md transition-colors ${
                              fav
                                ? "text-amber-500 hover:bg-amber-500/10"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                            }`}
                          >
                            <Star className={`size-4 ${fav ? "fill-amber-400" : ""}`} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Experiment Active Simulator Stage */}
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-border pb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#16845A] dark:text-[#72CF91]">
                        {activeExperiment.code}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        · {activeExperiment.categoryName} · {activeExperiment.scientist} (
                        {activeExperiment.year})
                      </span>
                    </div>
                    <h2 className="text-xl font-bold mt-1 text-foreground">
                      {activeExperiment.title}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPlaying((p) => !p)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#16845A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#38A875] transition-colors whitespace-nowrap shrink-0"
                    >
                      {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                      <span>{isPlaying ? "Tạm dừng" : "Chạy mô phỏng"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFavoriteItem("favoriteExperiments", activeExperiment.id)}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        isFavorite
                          ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-300"
                          : "border-border bg-secondary text-foreground hover:bg-muted"
                      }`}
                    >
                      <Star className={`size-3.5 ${isFavorite ? "fill-amber-400" : ""}`} />
                      <span>{isFavorite ? "Đã yêu thích" : "Yêu thích"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted whitespace-nowrap shrink-0"
                    >
                      <RotateCcw className="size-3.5" />
                      <span>Đặt lại</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {activeExperiment.description}
                </p>

                {/* Live Interactive SVG Visualizer */}
                <ClassicExperimentDiagram
                  experiment={activeExperiment}
                  params={activeParams}
                  phase={phase}
                />

                {/* Verified Real-World Laboratory Photo */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    <span>Ảnh thí nghiệm thực tế ngoài đời</span>
                    <span>{activeExperiment.code}</span>
                  </div>
                  <ExperimentPhoto photoId={activeExperiment.id} />
                </div>

                {/* Parameters Tuning Controls */}
                <div className="rounded-xl border border-border bg-secondary/50 p-4 space-y-4">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Sliders className="size-3.5 text-[#16845A] dark:text-[#38A875]" />
                    Điều chỉnh tham số thực nghiệm
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeExperiment.modelParams.map((param) => {
                      const currentVal = activeParams[param.label] ?? param.defaultVal;
                      return (
                        <div
                          key={param.label}
                          className="rounded-lg border border-border/70 bg-card/60 p-3 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-medium text-foreground">{param.label}</span>
                            <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                              [{param.min} – {param.max}] {param.unit}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label={`Giảm ${param.label}`}
                              onClick={() =>
                                handleParamChange(
                                  param.label,
                                  currentVal - param.step,
                                  param.min,
                                  param.max,
                                  param.step,
                                )
                              }
                              className="p-1 rounded-md border border-border bg-background hover:bg-secondary text-foreground"
                            >
                              <Minus className="size-3" />
                            </button>
                            <input
                              type="range"
                              min={param.min}
                              max={param.max}
                              step={param.step}
                              value={currentVal}
                              onChange={(e) =>
                                handleParamChange(
                                  param.label,
                                  parseFloat(e.target.value),
                                  param.min,
                                  param.max,
                                  param.step,
                                )
                              }
                              className="flex-1 accent-[#16845A] dark:accent-[#38A875] cursor-pointer h-1.5 bg-border rounded-lg"
                              aria-label={param.label}
                            />
                            <button
                              type="button"
                              aria-label={`Tăng ${param.label}`}
                              onClick={() =>
                                handleParamChange(
                                  param.label,
                                  currentVal + param.step,
                                  param.min,
                                  param.max,
                                  param.step,
                                )
                              }
                              className="p-1 rounded-md border border-border bg-background hover:bg-secondary text-foreground"
                            >
                              <Plus className="size-3" />
                            </button>
                            <input
                              type="number"
                              min={param.min}
                              max={param.max}
                              step={param.step}
                              value={currentVal}
                              onChange={(e) =>
                                handleParamChange(
                                  param.label,
                                  parseFloat(e.target.value),
                                  param.min,
                                  param.max,
                                  param.step,
                                )
                              }
                              className="w-20 rounded-md border border-border bg-background px-2 py-1 text-right text-xs font-mono font-bold tabular-nums text-[#16845A] dark:text-[#72CF91]"
                              aria-label={`Giá trị số ${param.label}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Real-time Scientific Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {result.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-border bg-card p-3.5 text-center shadow-xs"
                    >
                      <span className="text-[11px] text-muted-foreground block truncate">
                        {metric.label}
                      </span>
                      <div className="mt-1 font-mono text-2xl font-extrabold tabular-nums text-[#16845A] dark:text-[#72CF91]">
                        {metric.value}{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          {metric.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live Observation & Verified Law */}
                <div className="rounded-xl border border-[#16845A]/30 bg-[#16845A]/10 dark:bg-[#16845A]/20 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-[#16845A] dark:text-[#72CF91] font-semibold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="size-4" />
                    <span>{result.lawConfirmed}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                    {result.summary}
                  </p>
                </div>

                {/* Hypothesis & Procedure */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-2">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <Lightbulb className="size-3.5 text-amber-500" />
                      Giả thuyết khoa học
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {activeExperiment.hypothesis}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-2">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <ListChecks className="size-3.5 text-[#16845A] dark:text-[#72CF91]" />
                      Quy trình thực nghiệm
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-xs text-muted-foreground">
                      {activeExperiment.procedure.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Reflection Quiz */}
                <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <HelpCircle className="size-3.5 text-[#16845A] dark:text-[#72CF91]" />
                    Câu hỏi kiểm chứng nhận thức
                  </h4>
                  <p className="text-xs sm:text-sm font-medium text-foreground">
                    {activeExperiment.reflectionQuestion}
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {activeExperiment.reflectionOptions.map((opt, idx) => {
                      const isChosen = selectedQuizIdx === idx;
                      const isCorrect = idx === activeExperiment.reflectionCorrectIndex;
                      let btnStyle =
                        "border-border bg-secondary/30 text-foreground hover:bg-secondary/60";
                      if (quizAnswered) {
                        if (isCorrect) {
                          btnStyle =
                            "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold";
                        } else if (isChosen) {
                          btnStyle = "border-red-500 bg-red-500/15 text-red-700 dark:text-red-300";
                        }
                      }
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            setQuizAnswers((prev) => ({
                              ...prev,
                              [activeExperiment.id]: idx,
                            }))
                          }
                          className={`text-left rounded-lg border px-3 py-2 text-xs transition-colors ${btnStyle}`}
                        >
                          {String.fromCharCode(65 + idx)}. {opt}
                        </button>
                      );
                    })}
                  </div>
                  {quizAnswered && (
                    <p className="text-xs text-muted-foreground rounded-lg bg-secondary/40 p-3">
                      <strong className="text-foreground">Giải thích:</strong>{" "}
                      {activeExperiment.reflectionExplain}
                    </p>
                  )}
                </div>

                {/* Related Lesson Link */}
                {activeExperiment.relatedLessonPath && (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/30 px-4 py-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <BookOpen className="size-4 text-[#16845A] dark:text-[#72CF91] shrink-0" />
                      <span>Có bài mô phỏng SGK liên quan trực tiếp đến thí nghiệm này</span>
                    </div>
                    <Link
                      to="/mo-phong/$"
                      params={{ _splat: activeExperiment.relatedLessonPath }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#16845A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#38A875] transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>Mở mô phỏng bài học</span>
                      <ExternalLink className="size-3" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
