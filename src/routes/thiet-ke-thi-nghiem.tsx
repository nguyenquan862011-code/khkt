import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import {
  Compass,
  CheckCircle2,
  Table,
  LineChart,
  Download,
  PlusCircle,
  Trash2,
  Printer,
  ClipboardList,
  Eye,
  EyeOff,
} from "lucide-react";

export const Route = createFileRoute("/thiet-ke-thi-nghiem")({
  head: () => ({
    meta: [
      { title: "Thiết kế Thí nghiệm (Experiment Designer) | Trường THPT Tam Giang" },
      {
        name: "description",
        content:
          "Công cụ tự thiết kế phương án thí nghiệm Vật lý số: Lập giả thuyết khoa học, nhập liệu cảm biến/thủ công, hồi quy tuyến tính, tính sai số dụng cụ Δ_dc và in báo cáo thực hành.",
      },
    ],
  }),
  component: ExperimentDesignerPage,
});

interface ExperimentModel {
  id: string;
  name: string;
  description: string;
  formula: string;
  independentVar: string;
  independentUnit: string;
  dependentVar: string;
  dependentUnit: string;
  computedConstantName: string;
  computedUnit: string;
  standardTrueValue: number;
  defaultInstrumentError: number;
  defaultHypothesis: string;
  idealY: (inputVal: number) => number;
  generateReading: (inputVal: number) => number;
  computeConstant: (inputVal: number, measuredVal: number) => number;
}

const DESIGNER_MODELS: ExperimentModel[] = [
  {
    id: "free-fall-g",
    name: "Xác định gia tốc rơi tự do (g) từ độ cao và thời gian rơi",
    description:
      "Thả rơi vật từ các độ cao h khác nhau trong môi trường không lực cản, dùng cổng quang điện đo thời gian t rơi tương ứng.",
    formula: "g = 2·h / t²",
    independentVar: "Độ cao rơi (h)",
    independentUnit: "m",
    dependentVar: "Thời gian rơi (t)",
    dependentUnit: "s",
    computedConstantName: "Gia tốc trọng trường (g)",
    computedUnit: "m/s²",
    standardTrueValue: 9.81,
    defaultInstrumentError: 0.05,
    defaultHypothesis:
      "Khi độ cao h tăng, thời gian rơi t tăng theo quy luật t = √(2h/g) sao cho tỉ số 2h/t² xấp xỉ không đổi quanh 9,81 m/s².",
    idealY: (h) => Math.sqrt((2 * h) / 9.81),
    generateReading: (h) => {
      const idealT = Math.sqrt((2 * h) / 9.81);
      const noise = (Math.random() - 0.5) * 0.02;
      return Math.max(0.05, idealT + noise);
    },
    computeConstant: (h, t) => (2 * h) / Math.max(1e-6, t * t),
  },
  {
    id: "pendulum-g",
    name: "Xác định gia tốc trọng trường (g) bằng con lắc đơn",
    description:
      "Đo chu kỳ dao động T của con lắc đơn với các chiều dài dây l khác nhau ở góc lệch nhỏ.",
    formula: "g = 4π²·l / T²",
    independentVar: "Chiều dài dây (l)",
    independentUnit: "m",
    dependentVar: "Chu kỳ dao động (T)",
    dependentUnit: "s",
    computedConstantName: "Gia tốc trọng trường (g)",
    computedUnit: "m/s²",
    standardTrueValue: 9.81,
    defaultInstrumentError: 0.05,
    defaultHypothesis:
      "Chu kỳ dao động T tỉ lệ với căn bậc hai của chiều dài dây l, tỉ số 4π²·l/T² hội tụ về giá trị g địa phương.",
    idealY: (l) => 2 * Math.PI * Math.sqrt(l / 9.81),
    generateReading: (l) => {
      const idealT = 2 * Math.PI * Math.sqrt(l / 9.81);
      const noise = (Math.random() - 0.5) * 0.015;
      return Math.max(0.05, idealT + noise);
    },
    computeConstant: (l, T) => (4 * Math.PI * Math.PI * l) / Math.max(1e-6, T * T),
  },
  {
    id: "hooke-k",
    name: "Khảo sát định luật Hooke và xác định độ cứng lò xo (k)",
    description:
      "Treo các tải trọng F khác nhau vào lò xo thẳng đứng, dùng thước đo độ dãn Δl tương ứng.",
    formula: "k = F / Δl",
    independentVar: "Lực tác dụng (F)",
    independentUnit: "N",
    dependentVar: "Độ dãn lò xo (Δl)",
    dependentUnit: "m",
    computedConstantName: "Độ cứng lò xo (k)",
    computedUnit: "N/m",
    standardTrueValue: 80.0,
    defaultInstrumentError: 0.5,
    defaultHypothesis:
      "Độ dãn Δl phụ thuộc tuyến tính vào lực kéo F theo đường thẳng đi qua gốc tọa độ với hệ số góc 1/k.",
    idealY: (f) => f / 80.0,
    generateReading: (f) => {
      const idealDeltaL = f / 80.0;
      const noise = (Math.random() - 0.5) * 0.001;
      return Math.max(0.002, idealDeltaL + noise);
    },
    computeConstant: (f, dl) => f / Math.max(1e-6, dl),
  },
  {
    id: "ohm-r",
    name: "Khảo sát định luật Ohm và đo điện trở chưa biết (R_x)",
    description:
      "Thay đổi điện áp U cấp vào hai đầu dây dẫn và dùng ampe kế đo cường độ dòng điện I qua mạch.",
    formula: "R_x = U / I",
    independentVar: "Hiệu điện thế (U)",
    independentUnit: "V",
    dependentVar: "Cường độ dòng điện (I)",
    dependentUnit: "A",
    computedConstantName: "Điện trở dây dẫn (R)",
    computedUnit: "Ω",
    standardTrueValue: 15.0,
    defaultInstrumentError: 0.1,
    defaultHypothesis:
      "Cường độ dòng điện I tỉ lệ thuận với hiệu điện thế U đặt vào hai đầu dây dẫn khi nhiệt độ không đổi.",
    idealY: (u) => u / 15.0,
    generateReading: (u) => {
      const idealI = u / 15.0;
      const noise = (Math.random() - 0.5) * 0.01;
      return Math.max(0.005, idealI + noise);
    },
    computeConstant: (u, I) => u / Math.max(1e-6, I),
  },
];

interface MeasurementRow {
  trial: number;
  inputVal: number;
  measuredVal: number;
  calculatedConstant: number;
}

function computeLinearRegression(points: { x: number; y: number }[]) {
  if (points.length < 2) return null;
  const n = points.length;
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const meanX = sumX / n;
  const meanY = sumY / n;

  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (const p of points) {
    const dx = p.x - meanX;
    const dy = p.y - meanY;
    sxx += dx * dx;
    sxy += dx * dy;
    syy += dy * dy;
  }
  if (sxx === 0) return null;
  const slope = sxy / sxx;
  const intercept = meanY - slope * meanX;
  const rSquared = syy === 0 ? 1 : (sxy * sxy) / (sxx * syy);
  return { slope, intercept, rSquared };
}

function ExperimentDesignerPage() {
  const [selectedModelId, setSelectedModelId] = useState<string>(DESIGNER_MODELS[0]!.id);
  const [inputValue, setInputValue] = useState<number>(1.0);
  const [entryMode, setEntryMode] = useState<"sensor" | "manual">("sensor");
  const [manualReading, setManualReading] = useState<string>("0.45");
  const [instrumentError, setInstrumentError] = useState<number>(
    DESIGNER_MODELS[0]!.defaultInstrumentError,
  );
  const [goalNote, setGoalNote] = useState<string>(
    "Kiểm chứng mối quan hệ giữa biến độc lập và đại lượng đo, xác định hằng số thực nghiệm kèm sai số toàn phần.",
  );
  const [hypothesisNote, setHypothesisNote] = useState<string>(
    DESIGNER_MODELS[0]!.defaultHypothesis,
  );
  const [showTheoreticalOverlay, setShowTheoreticalOverlay] = useState<boolean>(true);
  const [hoveredTrial, setHoveredTrial] = useState<MeasurementRow | null>(null);
  const [trials, setTrials] = useState<MeasurementRow[]>([]);

  const activeModel = useMemo(() => {
    return DESIGNER_MODELS.find((m) => m.id === selectedModelId) || DESIGNER_MODELS[0]!;
  }, [selectedModelId]);

  const handleSelectModel = (model: ExperimentModel) => {
    setSelectedModelId(model.id);
    setTrials([]);
    setHoveredTrial(null);
    setInstrumentError(model.defaultInstrumentError);
    setHypothesisNote(model.defaultHypothesis);
    setManualReading(model.idealY(inputValue).toFixed(3));
  };

  const handleAddModelTrial = () => {
    const safeInput = Math.max(0.05, Number.isFinite(inputValue) ? inputValue : 0.1);
    const parsedManual = parseFloat(manualReading.replace(",", "."));
    const reading =
      entryMode === "manual" && Number.isFinite(parsedManual) && parsedManual > 0
        ? parsedManual
        : activeModel.generateReading(safeInput);
    const calculated = activeModel.computeConstant(safeInput, reading);

    const newRow: MeasurementRow = {
      trial: trials.length + 1,
      inputVal: safeInput,
      measuredVal: reading,
      calculatedConstant: calculated,
    };
    setTrials((prev) => [...prev, newRow]);
  };

  const handleClearTrials = () => {
    setTrials([]);
    setHoveredTrial(null);
  };

  const handleExportCsv = () => {
    if (trials.length === 0) return;
    const header = [
      "Lan do",
      `${activeModel.independentVar} (${activeModel.independentUnit})`,
      `${activeModel.dependentVar} (${activeModel.dependentUnit})`,
      `${activeModel.computedConstantName} (${activeModel.computedUnit})`,
    ].join(",");
    const rows = trials.map((t) =>
      [
        t.trial,
        t.inputVal.toFixed(3),
        t.measuredVal.toFixed(4),
        t.calculatedConstant.toFixed(3),
      ].join(","),
    );
    const csvContent = "\uFEFF" + [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tamgiang-${activeModel.id}-so-lieu.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    if (trials.length === 0) return null;
    const values = trials.map((t) => t.calculatedConstant);
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
    const absErrors = values.map((v) => Math.abs(v - avg));
    const meanAbsError = absErrors.reduce((sum, e) => sum + e, 0) / values.length;
    const safeInstErr = Math.max(0, Number.isFinite(instrumentError) ? instrumentError : 0);
    const totalError = meanAbsError + safeInstErr;
    const relativeError = (totalError / avg) * 100;
    const deviationFromStandard =
      Math.abs((avg - activeModel.standardTrueValue) / activeModel.standardTrueValue) * 100;

    return {
      average: avg,
      meanAbsError,
      instrumentError: safeInstErr,
      totalError,
      relativeError,
      deviationFromStandard,
    };
  }, [trials, activeModel, instrumentError]);

  const regression = useMemo(() => {
    return computeLinearRegression(trials.map((t) => ({ x: t.inputVal, y: t.measuredVal })));
  }, [trials]);

  const chartBounds = useMemo(() => {
    if (trials.length === 0) return null;
    const xs = trials.map((t) => t.inputVal);
    const ys = trials.map((t) => t.measuredVal);
    const idealYs = showTheoreticalOverlay ? xs.map((x) => activeModel.idealY(x)) : [];
    const allY = [...ys, ...idealYs];
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);
    return {
      minX: minX === maxX ? minX - 1 : minX,
      maxX: minX === maxX ? maxX + 1 : maxX,
      minY: minY === maxY ? minY - 0.5 : minY,
      maxY: minY === maxY ? maxY + 0.5 : maxY,
    };
  }, [trials, showTheoreticalOverlay, activeModel]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader currentPath="/thiet-ke-thi-nghiem" />

      <main className="flex-1 pb-16">
        {/* Hero */}
        <section className="no-print border-b border-border bg-[#091A13] dark:bg-[#06120D] text-[#EDF5ED] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#72CF91] mb-3">
              <Compass className="size-3.5 text-[#C8ED78]" />
              <span>Thiết kế Lab · Nhà khoa học bắt đầu bằng một câu hỏi</span>
            </p>
            <h1 className="text-balance text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Biến Ý Tưởng Thành Một Thí Nghiệm Có Thể Kiểm Chứng
            </h1>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-[#EDF5ED]/85 leading-relaxed">
              Từ một câu hỏi ban đầu, hãy lập kế hoạch thực nghiệm khoa học, đặt giả thuyết, ghi
              nhận số liệu đo đạc, vẽ đồ thị hồi quy tuyến tính và xuất báo cáo kèm sai số dụng cụ
              Δ_dc.
            </p>
          </div>
        </section>

        {/* Studio Body */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          {/* Print Header (visible mainly when printing) */}
          <div className="hidden print:block border-b border-border pb-3 mb-4">
            <h1 className="text-xl font-bold">BÁO CÁO THỰC HÀNH VẬT LÝ — TRƯỜNG THPT TAM GIANG</h1>
            <p className="text-xs">Mô hình: {activeModel.name}</p>
            <p className="text-xs">Mục tiêu: {goalNote}</p>
            <p className="text-xs">Giả thuyết: {hypothesisNote}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Controls: Planner + Select Model & Inputs */}
            <div className="no-print lg:col-span-4 space-y-4">
              {/* Scientific Method Planner Card */}
              <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
                <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <ClipboardList className="size-3.5 text-[#16845A] dark:text-[#72CF91]" />
                  Kế hoạch thực nghiệm khoa học
                </h3>

                <div className="space-y-2 text-xs">
                  <label className="block space-y-1">
                    <span className="font-semibold text-foreground">Mục tiêu thí nghiệm</span>
                    <input
                      type="text"
                      value={goalNote}
                      onChange={(e) => setGoalNote(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="font-semibold text-foreground">Giả thuyết dự đoán</span>
                    <textarea
                      rows={2}
                      value={hypothesisNote}
                      onChange={(e) => setHypothesisNote(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="rounded-lg bg-secondary/40 p-2 border border-border">
                      <span className="text-muted-foreground block">Biến độc lập</span>
                      <strong className="text-foreground">{activeModel.independentVar}</strong>
                    </div>
                    <div className="rounded-lg bg-secondary/40 p-2 border border-border">
                      <span className="text-muted-foreground block">Biến phụ thuộc</span>
                      <strong className="text-foreground">{activeModel.dependentVar}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
                <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  1. Chọn mô hình thực nghiệm
                </h3>

                <div className="space-y-2">
                  {DESIGNER_MODELS.map((m) => {
                    const isSelected = m.id === activeModel.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectModel(m)}
                        className={`w-full text-left rounded-xl p-3 text-xs transition-all border ${
                          isSelected
                            ? "border-[#16845A] dark:border-[#38A875] bg-[#16845A]/10 text-foreground font-semibold"
                            : "border-border bg-card hover:bg-secondary/40 text-muted-foreground"
                        }`}
                      >
                        <p className="font-semibold text-foreground">{m.name}</p>
                        <p className="font-mono text-[11px] text-[#16845A] dark:text-[#72CF91] mt-1">
                          {m.formula}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Input & Instrument Error adjuster */}
                <div className="border-t border-border pt-4 space-y-3">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    2. Thiết lập biến & sai số dụng cụ
                  </h4>

                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEntryMode("sensor")}
                      className={`flex-1 rounded-lg px-2.5 py-1.5 text-xs font-medium border transition-colors ${
                        entryMode === "sensor"
                          ? "border-[#16845A] bg-[#16845A]/15 text-[#16845A] dark:text-[#72CF91] font-semibold"
                          : "border-border bg-secondary/40 text-muted-foreground"
                      }`}
                    >
                      Cảm biến số
                    </button>
                    <button
                      type="button"
                      onClick={() => setEntryMode("manual")}
                      className={`flex-1 rounded-lg px-2.5 py-1.5 text-xs font-medium border transition-colors ${
                        entryMode === "manual"
                          ? "border-[#16845A] bg-[#16845A]/15 text-[#16845A] dark:text-[#72CF91] font-semibold"
                          : "border-border bg-secondary/40 text-muted-foreground"
                      }`}
                    >
                      Nhập tay
                    </button>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-medium text-foreground block">
                      {activeModel.independentVar} ({activeModel.independentUnit})
                    </span>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="100"
                      value={inputValue}
                      onChange={(e) => setInputValue(parseFloat(e.target.value) || 0.1)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono font-bold tabular-nums text-foreground"
                    />
                  </div>

                  {entryMode === "manual" && (
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-foreground block">
                        Giá trị đo thực tế: {activeModel.dependentVar} ({activeModel.dependentUnit})
                      </span>
                      <input
                        type="number"
                        step="0.001"
                        min="0.001"
                        value={manualReading}
                        onChange={(e) => setManualReading(e.target.value)}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono font-bold tabular-nums text-foreground"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-xs font-medium text-foreground block">
                      Sai số dụng cụ Δ_dc ({activeModel.computedUnit})
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={instrumentError}
                      onChange={(e) =>
                        setInstrumentError(Math.max(0, parseFloat(e.target.value) || 0))
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono font-bold tabular-nums text-foreground"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddModelTrial}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#16845A] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#38A875] transition-colors shadow-sm"
                  >
                    <PlusCircle className="size-4" />
                    <span>
                      {entryMode === "manual"
                        ? "Thêm giá trị đo thủ công"
                        : "Ghi nhận 1 lần đo cảm biến"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Data Table, Plot & Analysis */}
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      Bảng Số Liệu Thực Nghiệm
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      Công thức suy luận: {activeModel.formula}
                    </p>
                  </div>

                  {trials.length > 0 && (
                    <div className="no-print flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        <Printer className="size-3.5 text-[#16845A] dark:text-[#72CF91]" />
                        <span>In báo cáo</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleExportCsv}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        <Download className="size-3.5 text-[#16845A] dark:text-[#72CF91]" />
                        <span>Xuất CSV</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleClearTrials}
                        className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:underline px-2 py-1"
                      >
                        <Trash2 className="size-3.5" /> Xóa tất cả
                      </button>
                    </div>
                  )}
                </div>

                {/* Data Table */}
                {trials.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                    <Table className="mx-auto size-8 text-muted-foreground/40 mb-2" />
                    Chưa có lần đo nào. Hãy thay đổi giá trị biến độc lập và nhấn &ldquo;Ghi nhận 1
                    lần đo&rdquo; ít nhất 3–5 điểm để tính hồi quy và sai số.
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left tabular-nums">
                        <thead className="border-b border-border text-muted-foreground font-mono">
                          <tr>
                            <th className="py-2 px-3">Lần đo #</th>
                            <th className="py-2 px-3">
                              {activeModel.independentVar} ({activeModel.independentUnit})
                            </th>
                            <th className="py-2 px-3">
                              {activeModel.dependentVar} ({activeModel.dependentUnit})
                            </th>
                            <th className="py-2 px-3">
                              {activeModel.computedConstantName} ({activeModel.computedUnit})
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {trials.map((t) => (
                            <tr key={t.trial} className="hover:bg-secondary/30">
                              <td className="py-2 px-3 font-mono font-bold text-[#16845A] dark:text-[#72CF91]">
                                #{t.trial}
                              </td>
                              <td className="py-2 px-3 font-mono">{t.inputVal.toFixed(2)}</td>
                              <td className="py-2 px-3 font-mono">{t.measuredVal.toFixed(3)}</td>
                              <td className="py-2 px-3 font-mono font-semibold">
                                {t.calculatedConstant.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Experimental Data Chart with Regression & Theoretical Overlay */}
                    {chartBounds && (
                      <div className="rounded-xl border border-border bg-[#070E0B] p-4 space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#72CF91]">
                          <span className="inline-flex items-center gap-1.5">
                            <LineChart className="size-3.5" />
                            Đồ thị {activeModel.dependentVar} theo {activeModel.independentVar}
                          </span>
                          <div className="no-print flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setShowTheoreticalOverlay((v) => !v)}
                              className="inline-flex items-center gap-1 rounded border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] text-[#EDF5ED] hover:bg-white/10"
                            >
                              {showTheoreticalOverlay ? (
                                <EyeOff className="size-3" />
                              ) : (
                                <Eye className="size-3" />
                              )}
                              <span>Đường lý thuyết</span>
                            </button>
                            <span className="text-[#A5B7A8]">N = {trials.length}</span>
                          </div>
                        </div>

                        <svg viewBox="0 0 460 160" className="w-full h-40">
                          <line
                            x1="42"
                            y1="130"
                            x2="440"
                            y2="130"
                            stroke="#2B4033"
                            strokeWidth="1"
                          />
                          <line x1="42" y1="15" x2="42" y2="130" stroke="#2B4033" strokeWidth="1" />
                          {(() => {
                            const sorted = [...trials].sort((a, b) => a.inputVal - b.inputVal);
                            const mapX = (x: number) =>
                              58 +
                              ((x - chartBounds.minX) / (chartBounds.maxX - chartBounds.minX)) *
                                365;
                            const mapY = (y: number) =>
                              120 -
                              ((y - chartBounds.minY) / (chartBounds.maxY - chartBounds.minY)) * 95;

                            const theoreticalPts = Array.from({ length: 16 }, (_, idx) => {
                              const x =
                                chartBounds.minX +
                                ((chartBounds.maxX - chartBounds.minX) * idx) / 15;
                              return `${mapX(x).toFixed(1)},${mapY(activeModel.idealY(x)).toFixed(1)}`;
                            }).join(" ");

                            return (
                              <>
                                {showTheoreticalOverlay && (
                                  <polyline
                                    points={theoreticalPts}
                                    fill="none"
                                    stroke="#38BDF8"
                                    strokeWidth="1.5"
                                    strokeDasharray="5 3"
                                  />
                                )}
                                {regression && (
                                  <line
                                    x1={mapX(chartBounds.minX)}
                                    y1={mapY(
                                      regression.slope * chartBounds.minX + regression.intercept,
                                    )}
                                    x2={mapX(chartBounds.maxX)}
                                    y2={mapY(
                                      regression.slope * chartBounds.maxX + regression.intercept,
                                    )}
                                    stroke="#38A875"
                                    strokeWidth="2"
                                  />
                                )}
                                {sorted.map((p) => (
                                  <circle
                                    key={p.trial}
                                    cx={mapX(p.inputVal)}
                                    cy={mapY(p.measuredVal)}
                                    r={hoveredTrial?.trial === p.trial ? "6.5" : "4.5"}
                                    fill="#C8ED78"
                                    stroke="#070E0B"
                                    strokeWidth="1.5"
                                    className="cursor-pointer"
                                    onMouseEnter={() => setHoveredTrial(p)}
                                    onMouseLeave={() => setHoveredTrial(null)}
                                  />
                                ))}
                              </>
                            );
                          })()}
                          <text x="45" y="148" fill="#A5B7A8" fontSize="9" fontFamily="monospace">
                            {chartBounds.minX.toFixed(1)} {activeModel.independentUnit}
                          </text>
                          <text x="392" y="148" fill="#A5B7A8" fontSize="9" fontFamily="monospace">
                            {chartBounds.maxX.toFixed(1)} {activeModel.independentUnit}
                          </text>
                        </svg>

                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#A5B7A8]">
                          {regression ? (
                            <span className="text-[#72CF91]">
                              Hồi quy: y = {regression.slope.toFixed(3)}x{" "}
                              {regression.intercept >= 0 ? "+" : "−"}{" "}
                              {Math.abs(regression.intercept).toFixed(3)} · R² ={" "}
                              {regression.rSquared.toFixed(4)}
                            </span>
                          ) : (
                            <span>
                              Cần ít nhất 2 điểm có biến x khác nhau để hồi quy tuyến tính.
                            </span>
                          )}
                          {hoveredTrial && (
                            <span className="text-[#C8ED78]">
                              Điểm #{hoveredTrial.trial}: x={hoveredTrial.inputVal.toFixed(2)}, y=
                              {hoveredTrial.measuredVal.toFixed(3)}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Error Analysis Card */}
                {stats && (
                  <div className="rounded-xl border border-[#16845A]/30 bg-[#16845A]/10 dark:bg-[#16845A]/20 p-5 space-y-3">
                    <div className="flex items-center gap-2 text-[#16845A] dark:text-[#72CF91] font-semibold text-xs uppercase tracking-wider">
                      <CheckCircle2 className="size-4" />
                      <span>Xử lý sai số toàn phần Δ = Δ̄ + Δ_dc (N = {trials.length} lần)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs tabular-nums">
                      <div className="rounded-lg bg-card border border-border p-3">
                        <span className="text-muted-foreground block text-[11px]">
                          Giá trị trung bình
                        </span>
                        <span className="font-mono text-lg font-bold text-foreground">
                          {stats.average.toFixed(2)}{" "}
                          <span className="text-xs font-normal">{activeModel.computedUnit}</span>
                        </span>
                      </div>

                      <div className="rounded-lg bg-card border border-border p-3">
                        <span className="text-muted-foreground block text-[11px]">
                          Sai số ngẫu nhiên (Δ̄)
                        </span>
                        <span className="font-mono text-lg font-bold text-foreground">
                          ±{stats.meanAbsError.toFixed(3)}
                        </span>
                      </div>

                      <div className="rounded-lg bg-card border border-border p-3">
                        <span className="text-muted-foreground block text-[11px]">
                          Sai số tổng (Δ̄ + Δ_dc)
                        </span>
                        <span className="font-mono text-lg font-bold text-[#16845A] dark:text-[#72CF91]">
                          ±{stats.totalError.toFixed(3)}
                        </span>
                      </div>

                      <div className="rounded-lg bg-card border border-border p-3">
                        <span className="text-muted-foreground block text-[11px]">
                          Sai số tỉ đối (δ%)
                        </span>
                        <span className="font-mono text-lg font-bold text-[#16845A] dark:text-[#72CF91]">
                          {stats.relativeError.toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-foreground font-mono pt-1 tabular-nums">
                      Kết quả báo cáo thực nghiệm:{" "}
                      <strong>
                        X = ({stats.average.toFixed(2)} ± {stats.totalError.toFixed(2)}){" "}
                        {activeModel.computedUnit} (độ lệch so với giá trị chuẩn{" "}
                        {activeModel.standardTrueValue}: {stats.deviationFromStandard.toFixed(2)}%)
                      </strong>
                    </p>
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
