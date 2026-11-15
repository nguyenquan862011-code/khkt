import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { FORMULA_DATABASE, FORMULA_DOMAINS, type FormulaDomain } from "@/data/formulas";
import { getLearningState, subscribeLearningState, toggleFavoriteItem } from "@/lib/learning-store";
import {
  BookOpen,
  Search,
  Calculator,
  Copy,
  Check,
  Star,
  ExternalLink,
  Ruler,
  Lightbulb,
} from "lucide-react";

export const Route = createFileRoute("/cong-thuc")({
  head: () => ({
    meta: [
      { title: "Kho công thức Vật lý THPT | Trường THPT Tam Giang" },
      {
        name: "description",
        content:
          "Thư viện công thức Vật lý THPT chuẩn hóa 8 chuyên đề Lớp 10, 11, 12: Đầy đủ ký hiệu, thứ nguyên SI, ví dụ minh họa và máy tính thay số từng bước.",
      },
    ],
  }),
  component: CongThucPage,
});

function CongThucPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [domainFilter, setDomainFilter] = useState<"all" | FormulaDomain | "favorites">("all");
  const [selectedFormulaId, setSelectedFormulaId] = useState(FORMULA_DATABASE[0]!.id);
  const [calcInputs, setCalcInputs] = useState<Record<string, Record<string, number>>>({});
  const [favoriteIds, setFavoriteIds] = useState<string[]>(
    () => getLearningState().favoriteFormulas,
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    return subscribeLearningState((state) => {
      setFavoriteIds(state.favoriteFormulas);
    });
  }, []);

  const filteredFormulas = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return FORMULA_DATABASE.filter((f) => {
      const matchGrade = gradeFilter === "all" || f.grade === gradeFilter;
      const matchDomain =
        domainFilter === "all"
          ? true
          : domainFilter === "favorites"
            ? favoriteIds.includes(f.id)
            : f.domain === domainFilter;
      const matchQuery =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.topic.toLowerCase().includes(q) ||
        f.domain.toLowerCase().includes(q) ||
        f.expression.toLowerCase().includes(q);
      return matchGrade && matchDomain && matchQuery;
    });
  }, [searchTerm, gradeFilter, domainFilter, favoriteIds]);

  const activeFormula = useMemo(() => {
    return (
      filteredFormulas.find((f) => f.id === selectedFormulaId) ||
      filteredFormulas[0] ||
      FORMULA_DATABASE[0]!
    );
  }, [selectedFormulaId, filteredFormulas]);

  const currentCalcInputs = useMemo(() => {
    if (!activeFormula.calculator) return {};
    const stored = calcInputs[activeFormula.id];
    if (stored) return stored;
    const defaults: Record<string, number> = {};
    activeFormula.calculator.inputs.forEach((inp) => {
      defaults[inp.symbol] = inp.defaultVal;
    });
    return defaults;
  }, [activeFormula, calcInputs]);

  const calcResult = useMemo(() => {
    if (!activeFormula.calculator) return null;
    return activeFormula.calculator.calcFormula(currentCalcInputs);
  }, [activeFormula, currentCalcInputs]);

  const handleInputChange = (sym: string, val: number, min?: number) => {
    const safeVal = Number.isFinite(val) ? val : (min ?? 0);
    const clamped = min !== undefined ? Math.max(min, safeVal) : safeVal;
    setCalcInputs((prev) => ({
      ...prev,
      [activeFormula.id]: {
        ...currentCalcInputs,
        [sym]: clamped,
      },
    }));
  };

  const handleCopyExpression = async () => {
    try {
      await navigator.clipboard.writeText(activeFormula.expression);
      setCopiedId(activeFormula.id);
      setTimeout(() => setCopiedId((cur) => (cur === activeFormula.id ? null : cur)), 2000);
    } catch {
      // clipboard unavailable in restricted environments
    }
  };

  const isFavorite = favoriteIds.includes(activeFormula.id);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader currentPath="/cong-thuc" />

      <main className="flex-1 pb-16">
        {/* Hero */}
        <section className="border-b border-border bg-[#091A13] dark:bg-[#06120D] text-[#EDF5ED] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#72CF91] mb-3">
              <BookOpen className="size-3.5 text-[#C8ED78]" />
              <span>
                Kho công thức · {FORMULA_DATABASE.length} biểu thức chuẩn 8 chuyên đề THPT
              </span>
            </p>
            <h1 className="text-balance text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Mỗi Công Thức Là Một Câu Chuyện Về Cách Tự Nhiên Vận Hành
            </h1>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-[#EDF5ED]/85 leading-relaxed">
              Công thức chỉ có ý nghĩa khi bạn biết nó đến từ đâu. Tra cứu ý nghĩa vật lý, kiểm
              chứng thứ nguyên SI, điều kiện áp dụng và máy tính thay số cho từng đại lượng Lớp 10,
              11, 12.
            </p>

            {/* Filter controls and Search Bar */}
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-2.5 size-4 text-[#EDF5ED]/50" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên công thức, chuyên đề hoặc biểu thức..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2 text-xs text-white placeholder:text-[#EDF5ED]/40 focus:border-[#38A875] focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {["all", "Lớp 10", "Lớp 11", "Lớp 12"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGradeFilter(g)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        gradeFilter === g
                          ? "bg-[#16845A] text-white shadow-sm"
                          : "bg-white/5 text-[#EDF5ED]/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {g === "all" ? "Tất cả lớp" : g}
                    </button>
                  ))}
                </div>
              </div>

              {/* 8 Domains + Saved filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setDomainFilter("all")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    domainFilter === "all"
                      ? "bg-[#38A875] text-[#06120D] font-semibold"
                      : "bg-white/5 text-[#EDF5ED]/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Tất cả lĩnh vực ({FORMULA_DATABASE.length})
                </button>
                {FORMULA_DOMAINS.map((dom) => (
                  <button
                    key={dom}
                    type="button"
                    onClick={() => setDomainFilter(dom)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      domainFilter === dom
                        ? "bg-[#38A875] text-[#06120D] font-semibold"
                        : "bg-white/5 text-[#EDF5ED]/75 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {dom}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setDomainFilter("favorites")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    domainFilter === "favorites"
                      ? "bg-amber-400 text-[#06120D] font-semibold"
                      : "bg-white/5 text-amber-200 hover:bg-white/10"
                  }`}
                >
                  Đã lưu ({favoriteIds.length})
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar list */}
            <div className="lg:col-span-5 space-y-2">
              <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground px-1 mb-2">
                Danh sách công thức ({filteredFormulas.length})
              </h2>

              <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
                {filteredFormulas.length === 0 ? (
                  <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
                    Không có công thức nào khớp với điều kiện tìm kiếm.
                  </div>
                ) : (
                  filteredFormulas.map((f) => {
                    const isSelected = f.id === activeFormula.id;
                    const fav = favoriteIds.includes(f.id);
                    return (
                      <div
                        key={f.id}
                        className={`rounded-xl p-3.5 transition-all border ${
                          isSelected
                            ? "border-[#16845A] dark:border-[#38A875] bg-[#16845A]/10 dark:bg-[#16845A]/20 shadow-sm"
                            : "border-border bg-card hover:border-[#16845A]/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedFormulaId(f.id)}
                            className="flex-1 text-left"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-medium text-muted-foreground">
                                {f.grade} · {f.domain} · {f.topic}
                              </span>
                              <span className="font-mono text-xs font-bold text-[#16845A] dark:text-[#72CF91]">
                                {f.expression}
                              </span>
                            </div>
                            <h3 className="text-sm font-semibold mt-1 text-foreground">{f.name}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                              {f.meaning}
                            </p>
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleFavoriteItem("favoriteFormulas", f.id)}
                            aria-label={fav ? `Bỏ lưu ${f.name}` : `Lưu ${f.name}`}
                            className={`p-1.5 rounded-md transition-colors ${
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

            {/* Formula Detail & Interactive Calculator */}
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-[#16845A] dark:text-[#72CF91]">
                      {activeFormula.grade} · {activeFormula.domain} · {activeFormula.topic}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyExpression}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors whitespace-nowrap shrink-0"
                      >
                        {copiedId === activeFormula.id ? (
                          <>
                            <Check className="size-3.5 text-emerald-500" />
                            <span>Đã sao chép</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3.5" />
                            <span>Sao chép công thức</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleFavoriteItem("favoriteFormulas", activeFormula.id)}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                          isFavorite
                            ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-300"
                            : "border-border bg-secondary text-foreground hover:bg-muted"
                        }`}
                      >
                        <Star className={`size-3.5 ${isFavorite ? "fill-amber-400" : ""}`} />
                        <span>{isFavorite ? "Đã lưu" : "Lưu"}</span>
                      </button>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold mt-2 text-foreground">{activeFormula.name}</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {activeFormula.meaning}
                  </p>

                  <div className="mt-4 rounded-xl border border-border bg-secondary/40 p-4 text-center space-y-2">
                    <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
                      Biểu thức giải tích
                    </span>
                    <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#16845A] dark:text-[#72CF91]">
                      {activeFormula.expression}
                    </div>
                    <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                      <Ruler className="size-3 text-[#16845A] dark:text-[#72CF91]" />
                      <span>Thứ nguyên SI: {activeFormula.dimension}</span>
                    </div>
                  </div>
                </div>

                {/* Variables & Units Table */}
                <div className="space-y-2">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Giải thích đại lượng & Đơn vị chuẩn SI
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {activeFormula.variables.map((v) => (
                      <div
                        key={v.symbol}
                        className="rounded-lg border border-border bg-secondary/30 p-2.5 flex items-center justify-between gap-2"
                      >
                        <div>
                          <strong className="font-mono text-[#16845A] dark:text-[#72CF91] mr-1.5">
                            {v.symbol}
                          </strong>
                          <span className="text-foreground">{v.name}</span>
                        </div>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {v.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Condition & Worked Example */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="rounded-xl border border-border bg-secondary/20 p-3 text-xs text-muted-foreground">
                    <strong className="text-foreground">Điều kiện áp dụng:</strong>{" "}
                    {activeFormula.condition}
                  </div>
                  <div className="rounded-xl border border-border bg-secondary/20 p-3 text-xs text-muted-foreground flex items-start gap-2">
                    <Lightbulb className="size-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Ví dụ minh họa:</strong>{" "}
                      {activeFormula.workedExample}
                    </div>
                  </div>
                </div>

                {/* Interactive Instant Calculator */}
                {activeFormula.calculator && (
                  <div className="rounded-xl border border-[#16845A]/30 bg-[#16845A]/10 dark:bg-[#16845A]/20 p-4 space-y-3">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-[#16845A] dark:text-[#72CF91] flex items-center gap-1.5">
                      <Calculator className="size-3.5" />
                      Máy tính kiểm chứng & thay số từng bước
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {activeFormula.calculator.inputs.map((inp) => (
                        <div key={inp.symbol} className="space-y-1">
                          <label className="text-[11px] text-muted-foreground block truncate">
                            {inp.label}
                          </label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min={inp.min}
                              step={inp.step ?? 0.1}
                              value={currentCalcInputs[inp.symbol] ?? inp.defaultVal}
                              onChange={(e) =>
                                handleInputChange(inp.symbol, parseFloat(e.target.value), inp.min)
                              }
                              className="w-full rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-mono font-bold tabular-nums text-foreground"
                            />
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                              {inp.unit}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {calcResult && (
                      <div className="mt-2 border-t border-border pt-3 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-foreground font-medium">
                            Kết quả tính toán:
                          </span>
                          <div className="text-lg font-mono font-extrabold tabular-nums text-[#16845A] dark:text-[#72CF91]">
                            {Number.isInteger(calcResult.result)
                              ? calcResult.result
                              : calcResult.result.toFixed(3)}{" "}
                            <span className="text-xs font-normal text-muted-foreground">
                              {calcResult.unit}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs font-mono tabular-nums text-muted-foreground bg-card/60 rounded-lg px-3 py-2 border border-border/60">
                          Thay số: {calcResult.substitutionText}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeFormula.relatedLessonPath && (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/30 px-4 py-3">
                    <span className="text-xs text-muted-foreground">
                      Khám phá trực quan đại lượng trong bài mô phỏng SGK liên quan
                    </span>
                    <Link
                      to="/mo-phong/$"
                      params={{ _splat: activeFormula.relatedLessonPath }}
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
