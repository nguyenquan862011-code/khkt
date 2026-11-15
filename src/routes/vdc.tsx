import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { VDC_PROBLEMS, type VdcDifficulty, type VdcProblem } from "@/data/vdc-problems";
import { getLearningState, markVdcSolved, subscribeLearningState } from "@/lib/learning-store";
import {
  Award,
  Sliders,
  CheckCircle2,
  RotateCcw,
  Calculator,
  Lightbulb,
  Eye,
  EyeOff,
  Minus,
  Plus,
  Send,
  AlertCircle,
} from "lucide-react";

export const Route = createFileRoute("/vdc")({
  head: () => ({
    meta: [
      { title: "Bài toán Vận dụng cao (VDC) & Mô phỏng tương tác | Trường THPT Tam Giang" },
      {
        name: "description",
        content:
          "Trung tâm thử thách bài toán Vật lý Vận dụng cao (VDC) THPT: Tích hợp mô phỏng sơ đồ, kiểm tra đáp số tự giải, gợi ý và phân tích định lượng nhiều giai đoạn.",
      },
    ],
  }),
  component: VdcPage,
});

function clampParam(val: number, min: number, max: number, step: number): number {
  const safe = Number.isFinite(val) ? val : min;
  const clamped = Math.min(max, Math.max(min, safe));
  const decimals = step.toString().includes(".") ? step.toString().split(".")[1]!.length : 0;
  return Number(clamped.toFixed(decimals));
}

function VdcSchematic({
  problem,
  params,
}: {
  problem: VdcProblem;
  params: Record<string, number>;
}) {
  if (problem.visualKind === "train-vt") {
    const a1 = params["Gia tốc tăng tốc (a₁)"] ?? 0.8;
    const t1 = params["Thời gian tăng tốc (t₁)"] ?? 30;
    const t2 = params["Thời gian chạy đều (t₂)"] ?? 60;
    const a2 = params["Độ lớn gia tốc hãm (|a₂|)"] ?? 1.2;
    const vMax = a1 * t1;
    const t3 = vMax / a2;
    const totalT = Math.max(1, t1 + t2 + t3);
    const x0 = 46;
    const w = 360;
    const x1 = x0 + (t1 / totalT) * w;
    const x2 = x0 + ((t1 + t2) / totalT) * w;
    const x3 = x0 + w;
    const yBase = 132;
    const yPeak = Math.max(30, 122 - Math.min(90, vMax * 1.4));
    return (
      <svg
        viewBox="0 0 440 165"
        className="w-full h-44 rounded-xl bg-[#070E0B] border border-white/10 physics-raw"
      >
        <polygon
          points={`${x0},${yBase} ${x1},${yPeak} ${x2},${yPeak} ${x3},${yBase}`}
          fill="#38A875"
          fillOpacity="0.2"
        />
        <polyline
          points={`${x0},${yBase} ${x1},${yPeak} ${x2},${yPeak} ${x3},${yBase}`}
          fill="none"
          stroke="#C8ED78"
          strokeWidth="2.4"
        />
        <line x1={x0} y1={yBase} x2="420" y2={yBase} stroke="#A5B7A8" strokeWidth="1.2" />
        <line x1={x0} y1="20" x2={x0} y2={yBase} stroke="#A5B7A8" strokeWidth="1.2" />
        <text x="16" y={yPeak + 4} fill="#72CF91" fontSize="10" fontFamily="monospace">
          {vMax.toFixed(0)}
        </text>
        <text x="12" y="20" fill="#A5B7A8" fontSize="10" fontFamily="monospace">
          v(m/s)
        </text>
        <text x={x1 - 8} y="148" fill="#A5B7A8" fontSize="9" fontFamily="monospace">
          t₁={t1}s
        </text>
        <text x={x2 - 14} y="148" fill="#A5B7A8" fontSize="9" fontFamily="monospace">
          +{t2}s
        </text>
        <text x={x3 - 26} y="148" fill="#C8ED78" fontSize="9" fontFamily="monospace">
          T={totalT.toFixed(1)}s
        </text>
      </svg>
    );
  }

  if (problem.visualKind === "incline-spring") {
    const alphaDeg = params["Góc nghiêng (α)"] ?? 30;
    const rad = (alphaDeg * Math.PI) / 180;
    const footX = 230;
    const groundY = 134;
    const len = 145;
    const topX = footX - Math.cos(rad) * len;
    const topY = groundY - Math.sin(rad) * len;
    return (
      <svg
        viewBox="0 0 440 165"
        className="w-full h-44 rounded-xl bg-[#070E0B] border border-white/10 physics-raw"
      >
        <line x1="25" y1={groundY} x2="415" y2={groundY} stroke="#38A875" strokeWidth="1.8" />
        <polygon
          points={`${topX},${topY} ${footX},${groundY} ${topX},${groundY}`}
          fill="#15271E"
          stroke="#72CF91"
          strokeWidth="1.6"
        />
        <rect x={topX + 4} y={topY - 16} width="22" height="16" rx="3" fill="#C8ED78" />
        <polyline
          points="275,124 285,114 295,132 305,114 315,132 325,114 335,124 365,124"
          fill="none"
          stroke="#72CF91"
          strokeWidth="2"
        />
        <rect x="365" y="102" width="10" height="32" fill="#38A875" />
        <text x={topX + 4} y={groundY - 8} fill="#EDF5ED" fontSize="10" fontFamily="monospace">
          α={alphaDeg}°
        </text>
        <text x="278" y="96" fill="#C8ED78" fontSize="10" fontFamily="monospace">
          Lò xo (k={params["Độ cứng lò xo (k)"] ?? 400} N/m)
        </text>
      </svg>
    );
  }

  if (problem.visualKind === "wave-phase") {
    const AB = params["Khoảng cách AB"] ?? 12;
    const lambda = params["Bước sóng (λ)"] ?? 2.0;
    const dPhi = params["Độ lệch pha (Δφ)"] ?? 0.5;
    return (
      <svg
        viewBox="0 0 440 165"
        className="w-full h-44 rounded-xl bg-[#070E0B] border border-white/10 physics-raw"
      >
        <line
          x1="80"
          y1="84"
          x2="360"
          y2="84"
          stroke="#72CF91"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        {[24, 48, 72].map((r) => (
          <g key={r}>
            <circle cx="80" cy="84" r={r} fill="none" stroke="#38A875" strokeOpacity="0.4" />
            <circle cx="360" cy="84" r={r} fill="none" stroke="#C8ED78" strokeOpacity="0.4" />
          </g>
        ))}
        <circle cx="80" cy="84" r="6" fill="#38A875" />
        <circle cx="360" cy="84" r="6" fill="#C8ED78" />
        <text x="72" y="104" fill="#EDF5ED" fontSize="10" fontFamily="monospace">
          A
        </text>
        <text x="354" y="104" fill="#EDF5ED" fontSize="10" fontFamily="monospace">
          B
        </text>
        <text x="155" y="26" fill="#72CF91" fontSize="10" fontFamily="monospace">
          AB = {AB} cm · λ = {lambda} cm · Δφ = {dPhi}π
        </text>
      </svg>
    );
  }

  if (problem.visualKind === "gas-cycle") {
    const p1 = params["Áp suất ban đầu (p₁)"] ?? 100;
    const v1 = params["Thể tích ban đầu (V₁)"] ?? 20;
    return (
      <svg
        viewBox="0 0 440 165"
        className="w-full h-44 rounded-xl bg-[#070E0B] border border-white/10 physics-raw"
      >
        <line x1="70" y1="134" x2="380" y2="134" stroke="#A5B7A8" strokeWidth="1.2" />
        <line x1="70" y1="20" x2="70" y2="134" stroke="#A5B7A8" strokeWidth="1.2" />
        <polygon
          points="145,104 145,42 290,42"
          fill="#38A875"
          fillOpacity="0.28"
          stroke="#C8ED78"
          strokeWidth="2.2"
        />
        <circle cx="145" cy="104" r="4" fill="#EDF5ED" />
        <circle cx="145" cy="42" r="4" fill="#72CF91" />
        <circle cx="290" cy="42" r="4" fill="#C8ED78" />
        <text x="128" y="114" fill="#EDF5ED" fontSize="10" fontFamily="monospace">
          1
        </text>
        <text x="128" y="42" fill="#72CF91" fontSize="10" fontFamily="monospace">
          2
        </text>
        <text x="298" y="46" fill="#C8ED78" fontSize="10" fontFamily="monospace">
          3
        </text>
        <text x="20" y="106" fill="#A5B7A8" fontSize="9" fontFamily="monospace">
          {p1}kPa
        </text>
        <text x="20" y="44" fill="#72CF91" fontSize="9" fontFamily="monospace">
          {p1 * 2}kPa
        </text>
        <text x="132" y="150" fill="#A5B7A8" fontSize="9" fontFamily="monospace">
          V₁={v1}L
        </text>
        <text x="275" y="150" fill="#C8ED78" fontSize="9" fontFamily="monospace">
          V₂={v1 * 2}L
        </text>
      </svg>
    );
  }

  if (problem.visualKind === "projectile-wall") {
    const v0 = params["Vận tốc ném (v₀)"] ?? 20;
    const alpha = params["Góc ném (α)"] ?? 45;
    const hPeak = Math.min(88, 35 + Math.sin((alpha * Math.PI) / 180) * 55);
    return (
      <svg
        viewBox="0 0 440 165"
        className="w-full h-44 rounded-xl bg-[#070E0B] border border-white/10 physics-raw"
      >
        <line x1="36" y1="136" x2="404" y2="136" stroke="#38A875" strokeWidth="1.8" />
        <path
          d={`M 56 136 Q 210 ${136 - hPeak * 1.9} 364 136`}
          fill="none"
          stroke="#C8ED78"
          strokeWidth="2.4"
          strokeDasharray="5 3"
        />
        <circle cx="56" cy="136" r="5" fill="#72CF91" />
        <circle cx="364" cy="136" r="5" fill="#C8ED78" />
        <text x="140" y="28" fill="#72CF91" fontSize="10" fontFamily="monospace">
          v₀ = {v0} m/s · α = {alpha}°
        </text>
      </svg>
    );
  }

  // circuit-pmax
  const E = params["Suất điện động (E)"] ?? 12;
  const r = params["Điện trở trong (r)"] ?? 2;
  return (
    <svg
      viewBox="0 0 440 165"
      className="w-full h-44 rounded-xl bg-[#070E0B] border border-white/10 physics-raw"
    >
      <rect
        x="65"
        y="34"
        width="170"
        height="92"
        rx="8"
        fill="none"
        stroke="#38A875"
        strokeWidth="2"
      />
      <rect
        x="115"
        y="22"
        width="70"
        height="24"
        rx="4"
        fill="#15271E"
        stroke="#C8ED78"
        strokeWidth="1.5"
      />
      <text x="128" y="38" fill="#EDF5ED" fontSize="10" fontFamily="monospace">
        Biến trở R
      </text>
      <text x="78" y="84" fill="#72CF91" fontSize="10" fontFamily="monospace">
        E={E}V, r={r}Ω
      </text>
      {/* Mini P(R) curve */}
      <path d="M 270 124 Q 315 24 405 106" fill="none" stroke="#C8ED78" strokeWidth="2" />
      <circle cx="322" cy="64" r="4" fill="#38A875" />
      <text x="285" y="24" fill="#A5B7A8" fontSize="9" fontFamily="monospace">
        P_max tại R = r
      </text>
    </svg>
  );
}

function VdcPage() {
  const [selectedProbId, setSelectedProbId] = useState<string>(VDC_PROBLEMS[0]!.id);
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<"all" | VdcDifficulty>("all");
  const [paramVals, setParamVals] = useState<Record<string, Record<string, number>>>({});
  const [solvedIds, setSolvedIds] = useState<string[]>(() => getLearningState().solvedVdcIds);

  // Per-attempt interactive state (resets on switch problem or changing parameters)
  const [userAnswer, setUserAnswer] = useState("");
  const [answerFeedback, setAnswerFeedback] = useState<{
    correct: boolean;
    message: string;
  } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    return subscribeLearningState((state) => {
      setSolvedIds(state.solvedVdcIds);
    });
  }, []);

  const filteredProblems = useMemo(() => {
    return VDC_PROBLEMS.filter((p) => {
      const gradeOk = gradeFilter === "all" || p.grade === gradeFilter;
      const tierOk = tierFilter === "all" || p.tier === tierFilter;
      return gradeOk && tierOk;
    });
  }, [gradeFilter, tierFilter]);

  const displayedProblem = useMemo(() => {
    return (
      filteredProblems.find((p) => p.id === selectedProbId) ||
      filteredProblems[0] ||
      VDC_PROBLEMS[0]!
    );
  }, [filteredProblems, selectedProbId]);

  const displayedParams = useMemo(() => {
    const stored = paramVals[displayedProblem.id];
    if (stored) return stored;
    const defaults: Record<string, number> = {};
    displayedProblem.parameters.forEach((param) => {
      defaults[param.label] = param.defaultVal;
    });
    return defaults;
  }, [displayedProblem, paramVals]);

  const displayedSolution = useMemo(() => {
    return displayedProblem.solve(displayedParams);
  }, [displayedProblem, displayedParams]);

  const clearAttemptState = () => {
    setUserAnswer("");
    setAnswerFeedback(null);
    setShowHint(false);
    setShowSolution(false);
  };

  const handleSelectProblem = (id: string) => {
    setSelectedProbId(id);
    clearAttemptState();
  };

  const handleDisplayedParamChange = (
    label: string,
    val: number,
    min: number,
    max: number,
    step: number,
  ) => {
    const clamped = clampParam(val, min, max, step);
    setParamVals((prev) => ({
      ...prev,
      [displayedProblem.id]: {
        ...displayedParams,
        [label]: clamped,
      },
    }));
    clearAttemptState();
  };

  const handleResetProblem = () => {
    const defaults: Record<string, number> = {};
    displayedProblem.parameters.forEach((param) => {
      defaults[param.label] = param.defaultVal;
    });
    setParamVals((prev) => ({
      ...prev,
      [displayedProblem.id]: defaults,
    }));
    clearAttemptState();
  };

  const handleCheckAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    const numeric = parseFloat(userAnswer.replace(",", "."));
    if (!Number.isFinite(numeric)) {
      setAnswerFeedback({
        correct: false,
        message: "Vui lòng nhập một giá trị số hợp lệ trước khi kiểm tra.",
      });
      return;
    }

    const expected = displayedProblem.getTargetNumericAnswer(displayedParams);
    const tol =
      expected === 0
        ? 0.05
        : Math.max(0.05, Math.abs(expected) * (displayedProblem.targetTolerancePct / 100));
    const isCorrect = Math.abs(numeric - expected) <= tol;

    if (isCorrect) {
      markVdcSolved(displayedProblem.id);
      setAnswerFeedback({
        correct: true,
        message: `Chính xác! Đáp số chuẩn là ${expected.toFixed(2)} ${displayedProblem.targetUnit} (đã ghi nhận tiến độ).`,
      });
    } else {
      setAnswerFeedback({
        correct: false,
        message: `Chưa chính xác (sai số cho phép ±${displayedProblem.targetTolerancePct}%). Hãy thử xem gợi ý hoặc kiểm tra lại đơn vị.`,
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader currentPath="/vdc" />

      <main className="flex-1 pb-16">
        {/* Hero */}
        <section className="border-b border-border bg-[#091A13] dark:bg-[#06120D] text-[#EDF5ED] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <p className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#72CF91]">
                <Award className="size-3.5 text-[#C8ED78]" />
                <span>
                  Thử thách VDC · Đã giải {solvedIds.length}/{VDC_PROBLEMS.length}
                </span>
              </p>
              <span className="rounded-md bg-[#0F2942] border border-[#38BDF8]/30 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#93C5FD]">
                TamGiang Physics · Tư duy bản chất
              </span>
            </div>
            <h1 className="text-balance text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Khi Công Thức Không Còn Đủ, Tư Duy Sẽ Dẫn Đường
            </h1>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-[#EDF5ED]/85 leading-relaxed">
              Một bài toán khó là cơ hội nhìn sâu hơn vào bản chất. Không chỉ tìm đáp án — hãy chứng
              minh vì sao đáp án đúng bằng cách thay đổi dữ kiện, phân tích điều kiện vật lý và kiểm
              chứng từng bước lập luận.
            </p>

            <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {["all", "Lớp 10", "Lớp 11", "Lớp 12"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGradeFilter(g)}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      gradeFilter === g
                        ? "bg-[#16845A] text-white shadow-sm"
                        : "bg-white/5 text-[#EDF5ED]/75 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {g === "all" ? "Tất cả khối lớp" : g}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {(["all", "Cơ bản", "Thông hiểu", "Vận dụng", "Vận dụng cao"] as const).map(
                  (tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setTierFilter(tier)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        tierFilter === tier
                          ? "bg-[#38A875] text-[#06120D] font-semibold"
                          : "bg-white/5 text-[#EDF5ED]/75 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {tier === "all" ? "Mọi mức độ" : tier}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar list */}
            <div className="lg:col-span-4 space-y-2">
              <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground px-1 mb-2">
                Danh sách bài toán ({filteredProblems.length})
              </h2>
              <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
                {filteredProblems.length === 0 ? (
                  <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
                    Không có bài toán nào khớp bộ lọc hiện tại.
                  </div>
                ) : (
                  filteredProblems.map((prob) => {
                    const isSelected = prob.id === displayedProblem.id;
                    const isSolved = solvedIds.includes(prob.id);
                    return (
                      <button
                        key={prob.id}
                        type="button"
                        onClick={() => handleSelectProblem(prob.id)}
                        className={`w-full text-left rounded-xl p-3.5 transition-all border ${
                          isSelected
                            ? "border-[#16845A] dark:border-[#38A875] bg-[#16845A]/10 dark:bg-[#16845A]/20 shadow-sm"
                            : "border-border bg-card hover:border-[#16845A]/40"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-bold text-[#16845A] dark:text-[#72CF91]">
                            {prob.code}
                          </span>
                          <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                            {isSolved && (
                              <CheckCircle2
                                className="size-3.5 text-emerald-500"
                                aria-label="Đã giải"
                              />
                            )}
                            <span>
                              {prob.grade} · {prob.tier}
                            </span>
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold mt-1 text-foreground">{prob.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {prob.statement}
                        </p>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Active Problem Stage */}
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#16845A] dark:text-[#72CF91]">
                        {displayedProblem.code}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        · {displayedProblem.grade} · {displayedProblem.tier} ·{" "}
                        {displayedProblem.topic}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetProblem}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors whitespace-nowrap shrink-0"
                    >
                      <RotateCcw className="size-3.5" />
                      <span>Đặt lại dữ kiện</span>
                    </button>
                  </div>
                  <h2 className="text-xl font-bold mt-2 text-foreground">
                    {displayedProblem.title}
                  </h2>
                  <div className="mt-3 rounded-xl border border-border bg-secondary/40 p-4 text-xs sm:text-sm text-foreground leading-relaxed">
                    <strong>Đề bài:</strong> {displayedProblem.statement}
                  </div>
                </div>

                {/* Parametric SVG Schematic */}
                <VdcSchematic problem={displayedProblem} params={displayedParams} />

                {/* Parameters Tuner */}
                <div className="rounded-xl border border-border bg-secondary/50 p-4 space-y-4">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Sliders className="size-3.5 text-[#16845A] dark:text-[#38A875]" />
                    Biến số dữ kiện đầu vào
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {displayedProblem.parameters.map((p) => {
                      const val = displayedParams[p.label] ?? p.defaultVal;
                      return (
                        <div
                          key={p.label}
                          className="rounded-lg border border-border/70 bg-card/60 p-3 space-y-2"
                        >
                          <div className="flex justify-between text-xs gap-2">
                            <span className="font-medium text-foreground">{p.label}</span>
                            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                              [{p.min} – {p.max}] {p.unit}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              aria-label={`Giảm ${p.label}`}
                              onClick={() =>
                                handleDisplayedParamChange(
                                  p.label,
                                  val - p.step,
                                  p.min,
                                  p.max,
                                  p.step,
                                )
                              }
                              className="p-1 rounded-md border border-border bg-background hover:bg-secondary text-foreground"
                            >
                              <Minus className="size-3" />
                            </button>
                            <input
                              type="range"
                              min={p.min}
                              max={p.max}
                              step={p.step}
                              value={val}
                              onChange={(e) =>
                                handleDisplayedParamChange(
                                  p.label,
                                  parseFloat(e.target.value),
                                  p.min,
                                  p.max,
                                  p.step,
                                )
                              }
                              className="flex-1 accent-[#16845A] dark:accent-[#38A875] cursor-pointer h-1.5 bg-border rounded-lg"
                              aria-label={p.label}
                            />
                            <button
                              type="button"
                              aria-label={`Tăng ${p.label}`}
                              onClick={() =>
                                handleDisplayedParamChange(
                                  p.label,
                                  val + p.step,
                                  p.min,
                                  p.max,
                                  p.step,
                                )
                              }
                              className="p-1 rounded-md border border-border bg-background hover:bg-secondary text-foreground"
                            >
                              <Plus className="size-3" />
                            </button>
                            <input
                              type="number"
                              min={p.min}
                              max={p.max}
                              step={p.step}
                              value={val}
                              onChange={(e) =>
                                handleDisplayedParamChange(
                                  p.label,
                                  parseFloat(e.target.value),
                                  p.min,
                                  p.max,
                                  p.step,
                                )
                              }
                              className="w-20 rounded-md border border-border bg-background px-2 py-1 text-right text-xs font-mono font-bold tabular-nums text-[#16845A] dark:text-[#72CF91]"
                              aria-label={`Giá trị số ${p.label}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Self-Solve & Check Answer Section */}
                <form
                  onSubmit={handleCheckAnswer}
                  className="rounded-xl border border-[#16845A]/30 bg-[#16845A]/10 dark:bg-[#16845A]/15 p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-mono text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <Calculator className="size-3.5 text-[#16845A] dark:text-[#72CF91]" />
                      Tự giải & Kiểm tra đáp án
                    </h4>
                    <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
                      Sai số chấp nhận ±{displayedProblem.targetTolerancePct}%
                    </span>
                  </div>

                  <p className="text-xs font-medium text-foreground">
                    {displayedProblem.targetQuestion}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder={`Nhập giá trị (${displayedProblem.targetUnit})...`}
                        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-mono font-bold tabular-nums text-foreground focus:border-[#16845A] focus:outline-none"
                        aria-label="Đáp án tự giải"
                      />
                      <span className="font-mono text-xs font-semibold text-muted-foreground whitespace-nowrap shrink-0">
                        {displayedProblem.targetUnit}
                      </span>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#16845A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#38A875] transition-colors whitespace-nowrap shrink-0"
                    >
                      <Send className="size-3.5" />
                      <span>Kiểm tra đáp án</span>
                    </button>
                  </div>

                  {answerFeedback && (
                    <div
                      className={`rounded-lg border px-3 py-2 text-xs flex items-start gap-2 ${
                        answerFeedback.correct
                          ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : "border-amber-500/40 bg-amber-500/15 text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      {answerFeedback.correct ? (
                        <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="size-4 shrink-0 mt-0.5" />
                      )}
                      <span>{answerFeedback.message}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowHint((v) => !v)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors whitespace-nowrap shrink-0"
                    >
                      <Lightbulb className="size-3.5 text-amber-500" />
                      <span>{showHint ? "Ẩn gợi ý" : "Xem gợi ý"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSolution((v) => !v)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors whitespace-nowrap shrink-0"
                    >
                      {showSolution ? (
                        <EyeOff className="size-3.5" />
                      ) : (
                        <Eye className="size-3.5 text-[#16845A] dark:text-[#72CF91]" />
                      )}
                      <span>{showSolution ? "Ẩn lời giải chi tiết" : "Xem lời giải chi tiết"}</span>
                    </button>
                  </div>

                  {showHint && (
                    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-foreground leading-relaxed">
                      <strong>Gợi ý phương pháp:</strong> {displayedProblem.hint}
                    </div>
                  )}
                </form>

                {/* Step by Step Breakdown (Collapsed by default) */}
                {showSolution && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-mono text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                        <Calculator className="size-3.5 text-[#16845A] dark:text-[#38A875]" />
                        Phân tích hiện tượng & Các bước thiết lập
                      </h4>

                      <div className="space-y-2.5">
                        {displayedSolution.steps.map((st, idx) => (
                          <div
                            key={st.stepTitle}
                            className="rounded-xl border border-border bg-card p-3.5 text-xs space-y-1"
                          >
                            <div className="flex items-center gap-2 font-semibold text-foreground">
                              <span className="size-5 rounded-md bg-[#16845A]/20 text-[#16845A] dark:text-[#72CF91] flex items-center justify-center font-mono text-[11px] tabular-nums">
                                {idx + 1}
                              </span>
                              <span>{st.stepTitle}</span>
                            </div>
                            <p className="font-mono text-muted-foreground pl-7">{st.formula}</p>
                            <p className="font-semibold tabular-nums text-[#16845A] dark:text-[#72CF91] pl-7">
                              ➔ {st.resultText}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Final Verdict */}
                    <div className="rounded-xl border border-[#16845A]/40 bg-[#16845A]/10 dark:bg-[#16845A]/20 p-4 space-y-2">
                      <div className="flex items-center gap-2 text-[#16845A] dark:text-[#72CF91] font-semibold text-xs uppercase tracking-wider">
                        <CheckCircle2 className="size-4" />
                        <span>Đáp số định lượng & Nhận xét sư phạm</span>
                      </div>
                      <p className="text-sm font-bold tabular-nums text-foreground">
                        {displayedSolution.finalAnswer}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {displayedSolution.insights}
                      </p>
                    </div>
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
