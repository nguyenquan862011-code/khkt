import { useEffect, useMemo, useRef, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  LineChart,
  Table,
  GitCompare,
  HelpCircle,
} from "lucide-react";
import {
  SIMULATION_DOMAINS,
  type SimulationDomainId,
  type SimulationLifecycleState,
  validateSimulationParams,
  computeProjectilePhysics,
  computeSpringPhysics,
  computeIdealGasPhysics,
  computeCircuitPhysics,
  computeThinLensPhysics,
} from "@/lib/physics-simulations";
import { markLabCompleted } from "@/lib/learning-store";
import { ExperimentPhoto } from "@/components/experiment-photo";
import { ExperimentPracticeLink } from "@/components/practice/experiment-practice-link";

interface InteractivePhysicsLabProps {
  initialDomain?: SimulationDomainId;
  compact?: boolean;
}

interface SnapshotRun {
  label: string;
  metrics: { label: string; value: string; unit: string }[];
}

export function InteractivePhysicsLab({
  initialDomain = "co-hoc",
  compact = false,
}: InteractivePhysicsLabProps) {
  const [domainId, setDomainId] = useState<SimulationDomainId>(initialDomain);
  const [paramStore, setParamStore] = useState<Record<SimulationDomainId, Record<string, number>>>(
    () => {
      const init = {} as Record<SimulationDomainId, Record<string, number>>;
      for (const spec of SIMULATION_DOMAINS) {
        const map: Record<string, number> = {};
        for (const p of spec.params) {
          map[p.key] = p.defaultVal;
        }
        init[spec.id] = map;
      }
      return init;
    },
  );

  const [lifecycle, setLifecycle] = useState<SimulationLifecycleState>("idle");
  const [simTime, setSimTime] = useState<number>(0);
  const [predictionInput, setPredictionInput] = useState<string>("");
  const [predictionChecked, setPredictionChecked] = useState<boolean>(false);
  const [runA, setRunA] = useState<SnapshotRun | null>(null);
  const [runB, setRunB] = useState<SnapshotRun | null>(null);
  const [labMarkedDone, setLabMarkedDone] = useState<boolean>(false);

  const rafRef = useRef<number>(0);
  const lastTsRef = useRef<number>(0);

  const activeSpec = useMemo(
    () => SIMULATION_DOMAINS.find((d) => d.id === domainId) ?? SIMULATION_DOMAINS[0]!,
    [domainId],
  );

  const activeParams = paramStore[domainId];
  const validation = useMemo(
    () => validateSimulationParams(activeSpec, activeParams),
    [activeSpec, activeParams],
  );

  // Sync external initialDomain changes (e.g. lesson navigation)
  useEffect(() => {
    setDomainId(initialDomain);
    setLifecycle("idle");
    setSimTime(0);
    setPredictionChecked(false);
    setLabMarkedDone(false);
  }, [initialDomain]);

  // Animation loop with prefers-reduced-motion awareness
  useEffect(() => {
    if (lifecycle !== "running") {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const maxDur =
      domainId === "co-hoc"
        ? computeProjectilePhysics(activeParams).flightTime
        : activeSpec.defaultDuration;

    if (prefersReducedMotion) {
      setSimTime(maxDur);
      setLifecycle("completed");
      markLabCompleted(domainId);
      setLabMarkedDone(true);
      return;
    }

    lastTsRef.current = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - lastTsRef.current) / 1000);
      lastTsRef.current = now;
      setSimTime((prev) => {
        const next = prev + dt;
        if (next >= maxDur) {
          setLifecycle("completed");
          markLabCompleted(domainId);
          setLabMarkedDone(true);
          return maxDur;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [lifecycle, domainId, activeSpec.defaultDuration, activeParams]);

  // Compute domain physics data
  const projectileData = useMemo(
    () => (domainId === "co-hoc" ? computeProjectilePhysics(activeParams) : null),
    [domainId, activeParams],
  );
  const springData = useMemo(
    () => (domainId === "dao-dong-song" ? computeSpringPhysics(activeParams) : null),
    [domainId, activeParams],
  );
  const gasData = useMemo(
    () => (domainId === "nhiet-hoc" ? computeIdealGasPhysics(activeParams) : null),
    [domainId, activeParams],
  );
  const circuitData = useMemo(
    () => (domainId === "dien-tu" ? computeCircuitPhysics(activeParams) : null),
    [domainId, activeParams],
  );
  const lensData = useMemo(
    () => (domainId === "quang-hoc" ? computeThinLensPhysics(activeParams) : null),
    [domainId, activeParams],
  );

  const summaryMetrics = useMemo(() => {
    if (domainId === "co-hoc" && projectileData) {
      return [
        { label: "Tầm bay xa (L)", value: projectileData.range.toFixed(2), unit: "m" },
        { label: "Độ cao cực đại (H)", value: projectileData.maxHeight.toFixed(2), unit: "m" },
        { label: "Thời gian bay (T)", value: projectileData.flightTime.toFixed(2), unit: "s" },
        { label: "Vận tốc chạm đất", value: projectileData.impactSpeed.toFixed(2), unit: "m/s" },
      ];
    }
    if (domainId === "dao-dong-song" && springData) {
      return [
        { label: "Tần số góc (ω₀)", value: springData.omega.toFixed(2), unit: "rad/s" },
        { label: "Chu kỳ (T₀)", value: springData.period.toFixed(3), unit: "s" },
        { label: "Vận tốc cực đại", value: springData.vMaxCmS.toFixed(1), unit: "cm/s" },
        { label: "Cơ năng (W)", value: springData.totalEnergyMj.toFixed(1), unit: "mJ" },
      ];
    }
    if (domainId === "nhiet-hoc" && gasData) {
      return [
        { label: "Áp suất (p)", value: gasData.pressureKPa.toFixed(1), unit: "kPa" },
        { label: "Áp suất (atm)", value: gasData.pressureAtm.toFixed(2), unit: "atm" },
        { label: "Nội năng (U)", value: gasData.internalEnergyJ.toFixed(0), unit: "J" },
        { label: "v_rms (N₂)", value: gasData.vRmsNitrogen.toFixed(0), unit: "m/s" },
      ];
    }
    if (domainId === "dien-tu" && circuitData) {
      return [
        { label: "Điện trở ngoài (R_N)", value: circuitData.rExt.toFixed(2), unit: "Ω" },
        { label: "Dòng mạch chính (I)", value: circuitData.iTotal.toFixed(2), unit: "A" },
        { label: "Công suất ngoài (P)", value: circuitData.pExt.toFixed(2), unit: "W" },
        { label: "Hiệu suất nguồn (H)", value: circuitData.efficiencyPct.toFixed(1), unit: "%" },
      ];
    }
    if (domainId === "quang-hoc" && lensData) {
      return [
        { label: "Tiêu cự (f)", value: lensData.f.toFixed(0), unit: "cm" },
        {
          label: "Vị trí ảnh (d')",
          value: lensData.dPrime !== null ? lensData.dPrime.toFixed(1) : "∞",
          unit: lensData.dPrime !== null ? "cm" : "",
        },
        {
          label: "Độ phóng đại (k)",
          value: lensData.magnification !== null ? lensData.magnification.toFixed(2) : "∞",
          unit: "lần",
        },
        {
          label: "Chiều cao ảnh (A'B')",
          value: lensData.hImage !== null ? Math.abs(lensData.hImage).toFixed(1) : "∞",
          unit: lensData.hImage !== null ? "cm" : "",
        },
      ];
    }
    return [];
  }, [domainId, projectileData, springData, gasData, circuitData, lensData]);

  const theoreticalPredictionAnswer = useMemo(() => {
    if (domainId === "co-hoc" && projectileData) return projectileData.idealRange;
    if (domainId === "dao-dong-song" && springData) return springData.period;
    if (domainId === "nhiet-hoc" && gasData) return gasData.pressureKPa;
    if (domainId === "dien-tu" && circuitData) return circuitData.iTotal;
    if (domainId === "quang-hoc" && lensData) return lensData.dPrime ?? 0;
    return 0;
  }, [domainId, projectileData, springData, gasData, circuitData, lensData]);

  const handleParamChange = (key: string, nextVal: number) => {
    setParamStore((prev) => ({
      ...prev,
      [domainId]: {
        ...prev[domainId],
        [key]: nextVal,
      },
    }));
    if (!Number.isFinite(nextVal)) {
      setLifecycle("error");
      return;
    }
    const updated = { ...activeParams, [key]: nextVal };
    const check = validateSimulationParams(activeSpec, updated);
    if (!check.valid) {
      setLifecycle("error");
    } else if (lifecycle === "error") {
      setLifecycle("idle");
    }
  };

  const handleStartOrToggle = () => {
    if (!validation.valid) {
      setLifecycle("error");
      return;
    }
    if (lifecycle === "running") {
      setLifecycle("paused");
    } else if (lifecycle === "completed" || lifecycle === "idle") {
      setSimTime(0);
      setLifecycle("running");
    } else if (lifecycle === "paused") {
      setLifecycle("running");
    }
  };

  const handleReset = () => {
    const defaults: Record<string, number> = {};
    for (const p of activeSpec.params) {
      defaults[p.key] = p.defaultVal;
    }
    setParamStore((prev) => ({ ...prev, [domainId]: defaults }));
    setLifecycle("idle");
    setSimTime(0);
    setPredictionChecked(false);
    setPredictionInput("");
  };

  const handleCaptureRun = (slot: "A" | "B") => {
    const snap: SnapshotRun = {
      label: `Lần ${slot}`,
      metrics: summaryMetrics.map((m) => ({ ...m })),
    };
    if (slot === "A") setRunA(snap);
    else setRunB(snap);
  };

  const maxTime =
    domainId === "co-hoc" && projectileData
      ? Math.max(0.5, projectileData.flightTime)
      : activeSpec.defaultDuration;

  const statusText =
    lifecycle === "running"
      ? "Đang chạy"
      : lifecycle === "paused"
        ? "Tạm dừng"
        : lifecycle === "completed"
          ? "Hoàn thành"
          : lifecycle === "error"
            ? "Lỗi thông số"
            : "Sẵn sàng";

  const parsedPred = parseFloat(predictionInput.replace(",", "."));
  const predDiffPct =
    predictionChecked && !Number.isNaN(parsedPred) && Math.abs(theoreticalPredictionAnswer) > 1e-6
      ? (Math.abs(parsedPred - theoreticalPredictionAnswer) /
          Math.abs(theoreticalPredictionAnswer)) *
        100
      : null;

  return (
    <div className="rounded-2xl border border-border bg-card text-foreground shadow-sm overflow-hidden">
      {/* Domain Tabs + State Label */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/40 px-4 py-3 sm:px-5">
        <div
          className="flex flex-wrap items-center gap-1.5"
          role="tablist"
          aria-label="Chọn lĩnh vực mô phỏng"
        >
          {SIMULATION_DOMAINS.map((dom) => {
            const active = dom.id === domainId;
            return (
              <button
                key={dom.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setDomainId(dom.id);
                  setLifecycle("idle");
                  setSimTime(0);
                  setPredictionChecked(false);
                  setPredictionInput("");
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? "bg-[#16845A] dark:bg-[#38A875] text-white dark:text-[#0B1511] font-semibold"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {dom.shortTitle}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-muted-foreground">{activeSpec.grade}</span>
          <span aria-hidden="true">·</span>
          <span
            className={`font-semibold ${
              lifecycle === "error"
                ? "text-destructive"
                : lifecycle === "running" || lifecycle === "completed"
                  ? "text-[#16845A] dark:text-[#72CF91]"
                  : "text-foreground"
            }`}
          >
            Trạng thái: {statusText}
          </span>
          {labMarkedDone && (
            <span className="inline-flex items-center gap-1 text-[#16845A] dark:text-[#C8ED78]">
              <CheckCircle2 className="size-3.5" /> Đã lưu tiến độ
            </span>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${compact ? "p-4" : "p-5 sm:p-6"}`}>
        {/* Left/Top Stage: Visual SVG + Playback + Data Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-balance">{activeSpec.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {activeSpec.description}
            </p>
            <p className="font-mono text-xs text-[#16845A] dark:text-[#72CF91] pt-0.5">
              {activeSpec.formula}
            </p>
          </div>

          {!validation.valid && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-xs text-destructive"
            >
              <AlertTriangle className="size-4 shrink-0" />
              <span>{validation.error}</span>
            </div>
          )}

          {/* Live SVG Physics Canvas */}
          <div className="rounded-xl border border-border bg-[#070E0B] p-3 overflow-hidden">
            {domainId === "co-hoc" && projectileData && (
              <ProjectileSvg summary={projectileData} simTime={simTime} />
            )}
            {domainId === "dao-dong-song" && springData && (
              <SpringSvg summary={springData} simTime={simTime} A={activeParams.A ?? 10} />
            )}
            {domainId === "nhiet-hoc" && gasData && (
              <IdealGasSvg
                summary={gasData}
                T={activeParams.T ?? 300}
                V={activeParams.V ?? 25}
                simTime={simTime}
              />
            )}
            {domainId === "dien-tu" && circuitData && (
              <CircuitSvg summary={circuitData} params={activeParams} />
            )}
            {domainId === "quang-hoc" && lensData && (
              <ThinLensSvg summary={lensData} hObj={activeParams.h ?? 4} />
            )}
          </div>

          {/* Playback Controls & Time Scrubber */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-secondary/40 px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleStartOrToggle}
                disabled={!validation.valid}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#16845A] dark:bg-[#38A875] px-3.5 py-1.5 text-xs font-semibold text-white dark:text-[#0B1511] hover:opacity-90 disabled:opacity-40 whitespace-nowrap shrink-0"
              >
                {lifecycle === "running" ? (
                  <>
                    <Pause className="size-3.5" /> Tạm dừng
                  </>
                ) : (
                  <>
                    <Play className="size-3.5" />{" "}
                    {lifecycle === "paused" ? "Tiếp tục" : "Chạy mô phỏng"}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted whitespace-nowrap shrink-0"
              >
                <RotateCcw className="size-3.5" /> Đặt lại
              </button>
            </div>

            <div className="flex flex-1 items-center gap-2 min-w-[160px]">
              <label
                htmlFor={`scrubber-${domainId}`}
                className="font-mono text-[11px] text-muted-foreground whitespace-nowrap"
              >
                t = {simTime.toFixed(2)}s
              </label>
              <input
                id={`scrubber-${domainId}`}
                type="range"
                min={0}
                max={maxTime}
                step={0.02}
                value={Math.min(simTime, maxTime)}
                onChange={(e) => {
                  setLifecycle("paused");
                  setSimTime(parseFloat(e.target.value));
                }}
                className="w-full accent-[#16845A] dark:accent-[#38A875] cursor-pointer"
                aria-label="Thanh tua thời gian mô phỏng"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleCaptureRun("A")}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-medium hover:bg-muted whitespace-nowrap shrink-0"
                title="Lưu kết quả hiện tại vào Lần A để đối chiếu"
              >
                <Bookmark className="size-3 text-[#16845A] dark:text-[#72CF91]" /> Lưu A
              </button>
              <button
                type="button"
                onClick={() => handleCaptureRun("B")}
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-medium hover:bg-muted whitespace-nowrap shrink-0"
                title="Lưu kết quả hiện tại vào Lần B để đối chiếu"
              >
                <GitCompare className="size-3 text-[#16845A] dark:text-[#C8ED78]" /> Lưu B
              </button>
            </div>
          </div>

          {/* Real-Time Summary Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 tabular-nums">
            {summaryMetrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-border bg-secondary/30 p-3">
                <div className="text-[11px] text-muted-foreground truncate">{m.label}</div>
                <div className="mt-0.5 font-mono text-base font-bold text-[#16845A] dark:text-[#72CF91]">
                  {m.value}{" "}
                  <span className="text-[11px] font-normal text-muted-foreground">{m.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* A vs B Comparison Panel */}
          {(runA || runB) && (
            <div className="rounded-xl border border-border bg-secondary/20 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="inline-flex items-center gap-1.5">
                  <Table className="size-3.5 text-[#16845A] dark:text-[#72CF91]" />
                  Bảng đối chiếu Lần A vs Lần B
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setRunA(null);
                    setRunB(null);
                  }}
                  className="text-[11px] text-muted-foreground hover:text-foreground hover:underline"
                >
                  Xóa đối chiếu
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left tabular-nums">
                  <thead className="border-b border-border text-muted-foreground font-mono">
                    <tr>
                      <th className="py-1.5 pr-3">Đại lượng</th>
                      <th className="py-1.5 px-3">Lần A</th>
                      <th className="py-1.5 px-3">Lần B</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {summaryMetrics.map((metric, idx) => (
                      <tr key={metric.label}>
                        <td className="py-1.5 pr-3 text-muted-foreground">{metric.label}</td>
                        <td className="py-1.5 px-3 font-mono font-semibold">
                          {runA?.metrics[idx]
                            ? `${runA.metrics[idx].value} ${runA.metrics[idx].unit}`
                            : "—"}
                        </td>
                        <td className="py-1.5 px-3 font-mono font-semibold text-[#16845A] dark:text-[#C8ED78]">
                          {runB?.metrics[idx]
                            ? `${runB.metrics[idx].value} ${runB.metrics[idx].unit}`
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Deck: Controls + Prediction Mode + Analytical Chart */}
        <div className="lg:col-span-5 space-y-4">
          {/* Parameters with Slider + Numeric Input + Stepper */}
          <div className="rounded-xl border border-border bg-secondary/35 p-4 space-y-3.5">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Thông số điều khiển thực nghiệm
            </h4>

            <div className="space-y-3">
              {activeSpec.params.map((p) => {
                const val = activeParams[p.key] ?? p.defaultVal;
                const clampStep = (delta: number) => {
                  const next = Number(Math.min(p.max, Math.max(p.min, val + delta)).toFixed(3));
                  handleParamChange(p.key, next);
                };
                return (
                  <div key={p.key} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <label
                        htmlFor={`param-${domainId}-${p.key}`}
                        className="font-medium text-foreground"
                      >
                        {p.label}
                      </label>
                      <div className="flex items-center gap-1 tabular-nums">
                        <button
                          type="button"
                          onClick={() => clampStep(-p.step)}
                          aria-label={`Giảm ${p.label}`}
                          className="size-6 rounded border border-border bg-card text-xs font-bold hover:bg-muted"
                        >
                          −
                        </button>
                        <input
                          id={`param-${domainId}-${p.key}`}
                          type="number"
                          min={p.min}
                          max={p.max}
                          step={p.step}
                          value={Number.isNaN(val) ? "" : val}
                          onChange={(e) => handleParamChange(p.key, parseFloat(e.target.value))}
                          className="w-16 rounded border border-border bg-card px-1.5 py-0.5 text-center font-mono text-xs font-semibold text-foreground"
                        />
                        <button
                          type="button"
                          onClick={() => clampStep(p.step)}
                          aria-label={`Tăng ${p.label}`}
                          className="size-6 rounded border border-border bg-card text-xs font-bold hover:bg-muted"
                        >
                          +
                        </button>
                        {p.unit && (
                          <span className="font-mono text-[11px] text-muted-foreground min-w-[30px]">
                            {p.unit}
                          </span>
                        )}
                      </div>
                    </div>

                    <input
                      type="range"
                      min={p.min}
                      max={p.max}
                      step={p.step}
                      value={
                        Number.isNaN(val) ? p.defaultVal : Math.min(p.max, Math.max(p.min, val))
                      }
                      onChange={(e) => handleParamChange(p.key, parseFloat(e.target.value))}
                      className="w-full accent-[#16845A] dark:accent-[#38A875] cursor-pointer h-1.5"
                      aria-label={p.label}
                    />
                    <div className="flex justify-between font-mono text-[10px] text-muted-foreground tabular-nums">
                      <span>
                        {p.min} {p.unit}
                      </span>
                      <span>
                        {p.max} {p.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prediction Mode */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2.5">
            <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[#16845A] dark:text-[#72CF91]">
              <span className="flex items-center gap-1.5">
                <HelpCircle className="size-3.5" />
                <span>Dự đoán trước khi chạy mô phỏng</span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Bước kiểm chứng
              </span>
            </div>
            <p className="text-[11px] font-medium text-[#16845A] dark:text-[#C8ED78]">
              Đừng vội xem đáp án. Hãy dự đoán kết quả trước khi thay đổi thông số và chạy thử.
            </p>
            <p className="text-xs text-muted-foreground">{activeSpec.predictionQuestion}</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                inputMode="decimal"
                value={predictionInput}
                onChange={(e) => {
                  setPredictionInput(e.target.value);
                  setPredictionChecked(false);
                }}
                placeholder={`Nhập dự đoán (${activeSpec.predictionUnit})`}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-mono tabular-nums text-foreground outline-none focus:border-[#16845A]"
                aria-label="Giá trị dự đoán của bạn"
              />
              <span className="font-mono text-xs text-muted-foreground">
                {activeSpec.predictionUnit}
              </span>
              <button
                type="button"
                onClick={() => setPredictionChecked(true)}
                className="rounded-lg bg-[#16845A] dark:bg-[#38A875] px-3 py-1.5 text-xs font-semibold text-white dark:text-[#0B1511] hover:opacity-90 whitespace-nowrap shrink-0"
              >
                Kiểm tra
              </button>
            </div>
            {predictionChecked && (
              <div className="rounded-lg border border-border bg-secondary/40 p-2.5 text-xs tabular-nums">
                {Number.isNaN(parsedPred) ? (
                  <span className="text-destructive">Vui lòng nhập một số hợp lệ.</span>
                ) : (
                  <div className="space-y-1">
                    <div className="font-semibold text-foreground">
                      Giá trị lý thuyết:{" "}
                      <span className="font-mono text-[#16845A] dark:text-[#C8ED78]">
                        {theoreticalPredictionAnswer.toFixed(2)} {activeSpec.predictionUnit}
                      </span>
                    </div>
                    <div className="text-muted-foreground">
                      {predDiffPct !== null && predDiffPct <= 5
                        ? `Rất chính xác! Sai lệch chỉ ${predDiffPct.toFixed(1)}%.`
                        : `Sai lệch hiện tại: ${(predDiffPct ?? 0).toFixed(1)}% — hãy thử chạy mô phỏng để đối chiếu.`}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Live Secondary Analytical Chart */}
          <div className="rounded-xl border border-border bg-[#070E0B] p-3.5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#72CF91]">
              <span className="inline-flex items-center gap-1.5">
                <LineChart className="size-3.5" />
                {domainId === "co-hoc"
                  ? "Đồ thị vận tốc v(t)"
                  : domainId === "dao-dong-song"
                    ? "Đồ thị li độ x(t) & Cơ năng"
                    : domainId === "nhiet-hoc"
                      ? "Đường đẳng nhiệt p(V)"
                      : domainId === "dien-tu"
                        ? "Công suất P theo R_N (Đạt max tại R=r)"
                        : "Biểu thức tọa độ ảnh 1/d' = 1/f − 1/d"}
              </span>
            </div>
            <SecondaryAnalyticalChart
              domainId={domainId}
              projectileData={projectileData}
              springData={springData}
              gasData={gasData}
              circuitData={circuitData}
              lensData={lensData}
              simTime={simTime}
              params={activeParams}
            />
          </div>

          {/* Verified Real-World Experiment Reference Photo */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <span>Ảnh thí nghiệm thực tế đối chiếu</span>
              <span>{activeSpec.shortTitle}</span>
            </div>
            <ExperimentPhoto photoId={domainId} compact />
            <ExperimentPracticeLink experimentId={domainId} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== DOMAIN SVG VIEWPORTS ==================== */

function ProjectileSvg({
  summary,
  simTime,
}: {
  summary: ReturnType<typeof computeProjectilePhysics>;
  simTime: number;
}) {
  const maxX = Math.max(10, summary.range * 1.12);
  const maxY = Math.max(5, summary.maxHeight * 1.2);
  const mapX = (x: number) => 36 + (x / maxX) * 390;
  const mapY = (y: number) => 170 - (y / maxY) * 140;

  const fullPath = summary.trajectory
    .map((pt) => `${mapX(pt.x).toFixed(1)},${mapY(pt.y).toFixed(1)}`)
    .join(" ");

  const activePoint =
    summary.trajectory.find((pt) => pt.t >= simTime) ??
    summary.trajectory[summary.trajectory.length - 1] ??
    summary.trajectory[0]!;

  return (
    <svg viewBox="0 0 460 195" className="w-full h-52 physics-raw">
      <line
        x1="36"
        y1="170"
        x2="440"
        y2="170"
        stroke="#38A875"
        strokeOpacity="0.55"
        strokeWidth="1.5"
      />
      <line x1="36" y1="20" x2="36" y2="170" stroke="#2B4033" strokeWidth="1" />
      <polyline
        points={fullPath}
        fill="none"
        stroke="#38A875"
        strokeWidth="2"
        strokeDasharray="4 3"
      />
      {activePoint && (
        <>
          <circle
            cx={mapX(activePoint.x)}
            cy={mapY(activePoint.y)}
            r="7"
            fill="#C8ED78"
            stroke="#070E0B"
            strokeWidth="2"
          />
          <line
            x1={mapX(activePoint.x)}
            y1={mapY(activePoint.y)}
            x2={mapX(activePoint.x) + activePoint.vx * 1.6}
            y2={mapY(activePoint.y) - activePoint.vy * 1.6}
            stroke="#72CF91"
            strokeWidth="2"
          />
          <text x="48" y="28" fill="#C8ED78" fontSize="10" fontFamily="monospace">
            t = {activePoint.t.toFixed(2)}s · x = {activePoint.x.toFixed(1)}m · y ={" "}
            {activePoint.y.toFixed(1)}m
          </text>
        </>
      )}
      <text x="360" y="186" fill="#A5B7A8" fontSize="10" fontFamily="monospace">
        L = {summary.range.toFixed(1)} m
      </text>
    </svg>
  );
}

function SpringSvg({
  summary,
  simTime,
  A,
}: {
  summary: ReturnType<typeof computeSpringPhysics>;
  simTime: number;
  A: number;
}) {
  const sample = summary.samples.find((s) => s.t >= simTime) ?? summary.samples[0]!;
  const eqX = 250;
  const scalePx = 110 / Math.max(10, A);
  const blockX = eqX + sample.xCm * scalePx;

  const coils = 10;
  const startX = 40;
  const stepX = (blockX - 18 - startX) / coils;
  const pts = Array.from({ length: coils + 1 }, (_, i) => {
    const x = startX + i * stepX;
    const y = i === 0 || i === coils ? 95 : i % 2 === 0 ? 78 : 112;
    return `${x.toFixed(1)},${y}`;
  }).join(" ");

  const keRatio = summary.totalEnergyMj > 0 ? sample.keMj / summary.totalEnergyMj : 0;
  const peRatio = summary.totalEnergyMj > 0 ? sample.peMj / summary.totalEnergyMj : 0;

  return (
    <svg viewBox="0 0 460 195" className="w-full h-52 physics-raw">
      <line x1="40" y1="45" x2="40" y2="140" stroke="#72CF91" strokeWidth="3" />
      <line x1="40" y1="125" x2="430" y2="125" stroke="#2B4033" strokeWidth="1.5" />
      <line
        x1={eqX}
        y1="55"
        x2={eqX}
        y2="132"
        stroke="#A5B7A8"
        strokeOpacity="0.35"
        strokeDasharray="3 3"
      />
      <polyline
        points={pts}
        fill="none"
        stroke="#C8ED78"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <rect
        x={blockX - 18}
        y="75"
        width="36"
        height="36"
        rx="5"
        fill="#38A875"
        stroke="#C8ED78"
        strokeWidth="1.5"
      />
      <text x="48" y="28" fill="#C8ED78" fontSize="10" fontFamily="monospace">
        x = {sample.xCm.toFixed(2)} cm · v = {sample.vCmS.toFixed(1)} cm/s
      </text>
      {/* Energy bars */}
      <text x="50" y="156" fill="#A5B7A8" fontSize="9" fontFamily="monospace">
        Động năng Wđ: {sample.keMj.toFixed(1)} mJ
      </text>
      <rect x="190" y="148" width={Math.max(2, keRatio * 200)} height="9" rx="2" fill="#72CF91" />
      <text x="50" y="176" fill="#A5B7A8" fontSize="9" fontFamily="monospace">
        Thế năng Wt: {sample.peMj.toFixed(1)} mJ
      </text>
      <rect x="190" y="168" width={Math.max(2, peRatio * 200)} height="9" rx="2" fill="#C8ED78" />
    </svg>
  );
}

function IdealGasSvg({
  summary,
  T,
  V,
  simTime,
}: {
  summary: ReturnType<typeof computeIdealGasPhysics>;
  T: number;
  V: number;
  simTime: number;
}) {
  const pistonX = 90 + (V / 50) * 280;
  const speedScale = Math.sqrt(T / 300);
  const particles = Array.from({ length: 16 }, (_, i) => {
    const px = 56 + ((i * 53 + simTime * 70 * speedScale) % Math.max(40, pistonX - 70));
    const py = 52 + ((i * 37 + simTime * 55 * speedScale) % 92);
    return { x: px, y: py };
  });

  return (
    <svg viewBox="0 0 460 195" className="w-full h-52 physics-raw">
      <rect
        x="44"
        y="42"
        width="350"
        height="114"
        rx="6"
        fill="#0B1511"
        stroke="#38A875"
        strokeWidth="2"
      />
      {particles.map((p, idx) => (
        <circle key={idx} cx={p.x} cy={p.y} r="4" fill={T > 420 ? "#F59E0B" : "#C8ED78"} />
      ))}
      <rect x={pistonX} y="44" width="14" height="110" fill="#72CF91" />
      <line x1={pistonX + 14} y1="99" x2="430" y2="99" stroke="#A5B7A8" strokeWidth="5" />
      <text x="46" y="28" fill="#C8ED78" fontSize="10" fontFamily="monospace">
        T = {T} K · V = {V} lít · p = {summary.pressureKPa.toFixed(1)} kPa
      </text>
    </svg>
  );
}

function CircuitSvg({
  summary,
  params,
}: {
  summary: ReturnType<typeof computeCircuitPhysics>;
  params: Record<string, number>;
}) {
  const isParallel = (params.mode ?? 0) >= 0.5;
  return (
    <svg viewBox="0 0 460 195" className="w-full h-52 physics-raw">
      <rect
        x="70"
        y="38"
        width="320"
        height="115"
        rx="8"
        fill="none"
        stroke="#38A875"
        strokeWidth="2"
      />
      {/* Source */}
      <circle cx="70" cy="95" r="20" fill="#0E1E16" stroke="#C8ED78" strokeWidth="2" />
      <text x="53" y="99" fill="#C8ED78" fontSize="10" fontFamily="monospace">
        {params.E ?? 12}V
      </text>
      <text x="52" y="130" fill="#A5B7A8" fontSize="9" fontFamily="monospace">
        r={params.r ?? 2}Ω
      </text>
      {isParallel ? (
        <>
          <line x1="160" y1="38" x2="160" y2="90" stroke="#38A875" strokeWidth="1.5" />
          <line x1="300" y1="38" x2="300" y2="90" stroke="#38A875" strokeWidth="1.5" />
          <line x1="160" y1="90" x2="300" y2="90" stroke="#38A875" strokeWidth="1.5" />
          <rect x="195" y="26" width="70" height="24" rx="4" fill="#15271E" stroke="#72CF91" />
          <text x="206" y="42" fill="#FFFFFF" fontSize="10" fontFamily="monospace">
            R₁={params.R1 ?? 4}Ω
          </text>
          <rect x="195" y="78" width="70" height="24" rx="4" fill="#15271E" stroke="#C8ED78" />
          <text x="206" y="94" fill="#FFFFFF" fontSize="10" fontFamily="monospace">
            R₂={params.R2 ?? 6}Ω
          </text>
        </>
      ) : (
        <>
          <rect x="130" y="26" width="75" height="24" rx="4" fill="#15271E" stroke="#72CF91" />
          <text x="142" y="42" fill="#FFFFFF" fontSize="10" fontFamily="monospace">
            R₁={params.R1 ?? 4}Ω
          </text>
          <rect x="255" y="26" width="75" height="24" rx="4" fill="#15271E" stroke="#C8ED78" />
          <text x="267" y="42" fill="#FFFFFF" fontSize="10" fontFamily="monospace">
            R₂={params.R2 ?? 6}Ω
          </text>
        </>
      )}
      <text x="155" y="176" fill="#C8ED78" fontSize="10" fontFamily="monospace">
        I = {summary.iTotal.toFixed(2)} A · U_N = {summary.uOut.toFixed(2)} V · P_N ={" "}
        {summary.pExt.toFixed(1)} W
      </text>
    </svg>
  );
}

function ThinLensSvg({
  summary,
  hObj,
}: {
  summary: ReturnType<typeof computeThinLensPhysics>;
  hObj: number;
}) {
  const ox = 230;
  const oy = 100;
  const scaleX = 2.2;
  const scaleY = 6.5;

  const objX = ox - summary.d * scaleX;
  const objTopY = oy - hObj * scaleY;
  const fPx = summary.f * scaleX;

  const imgX = summary.dPrime !== null ? ox + summary.dPrime * scaleX : ox + 160;
  const imgTopY = summary.hImage !== null ? oy - summary.hImage * scaleY : oy;
  const clampedImgX = Math.max(20, Math.min(440, imgX));
  const clampedImgTopY = Math.max(15, Math.min(185, imgTopY));

  return (
    <svg viewBox="0 0 460 195" className="w-full h-52 physics-raw">
      {/* Optical axis */}
      <line
        x1="16"
        y1={oy}
        x2="444"
        y2={oy}
        stroke="#A5B7A8"
        strokeOpacity="0.4"
        strokeDasharray="4 4"
      />
      {/* Thin lens */}
      <line x1={ox} y1="22" x2={ox} y2="178" stroke="#72CF91" strokeWidth="2.5" />
      {/* Focus dots */}
      <circle cx={ox - Math.abs(fPx)} cy={oy} r="3" fill="#C8ED78" />
      <circle cx={ox + Math.abs(fPx)} cy={oy} r="3" fill="#C8ED78" />
      <text
        x={ox - Math.abs(fPx) - 4}
        y={oy + 14}
        fill="#C8ED78"
        fontSize="9"
        fontFamily="monospace"
      >
        {summary.f > 0 ? "F" : "F'"}
      </text>
      <text
        x={ox + Math.abs(fPx) - 4}
        y={oy + 14}
        fill="#C8ED78"
        fontSize="9"
        fontFamily="monospace"
      >
        {summary.f > 0 ? "F'" : "F"}
      </text>

      {/* Object AB */}
      <line x1={objX} y1={oy} x2={objX} y2={objTopY} stroke="#FFFFFF" strokeWidth="2.5" />
      <text x={objX - 10} y={objTopY - 6} fill="#FFFFFF" fontSize="9" fontFamily="monospace">
        AB
      </text>

      {/* Ray 1: Parallel then through F' */}
      <line x1={objX} y1={objTopY} x2={ox} y2={objTopY} stroke="#F59E0B" strokeWidth="1.5" />
      {/* Ray 2: Straight through O */}
      <line
        x1={objX}
        y1={objTopY}
        x2={clampedImgX}
        y2={clampedImgTopY}
        stroke="#38A875"
        strokeWidth="1.5"
      />
      {!summary.isAtFocus && (
        <>
          <line
            x1={ox}
            y1={objTopY}
            x2={clampedImgX}
            y2={clampedImgTopY}
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeDasharray={summary.dPrime && summary.dPrime < 0 ? "3 3" : undefined}
          />
          <line
            x1={clampedImgX}
            y1={oy}
            x2={clampedImgX}
            y2={clampedImgTopY}
            stroke="#C8ED78"
            strokeWidth="2.5"
            strokeDasharray={summary.dPrime && summary.dPrime < 0 ? "4 2" : undefined}
          />
          <text
            x={clampedImgX + 4}
            y={clampedImgTopY}
            fill="#C8ED78"
            fontSize="9"
            fontFamily="monospace"
          >
            A&apos;B&apos;
          </text>
        </>
      )}
      <text x="18" y="20" fill="#72CF91" fontSize="10" fontFamily="monospace">
        {summary.natureText}
      </text>
    </svg>
  );
}

/* ==================== SECONDARY ANALYTICAL CHART ==================== */

function SecondaryAnalyticalChart({
  domainId,
  projectileData,
  springData,
  gasData,
  circuitData,
  lensData,
}: {
  domainId: SimulationDomainId;
  projectileData: ReturnType<typeof computeProjectilePhysics> | null;
  springData: ReturnType<typeof computeSpringPhysics> | null;
  gasData: ReturnType<typeof computeIdealGasPhysics> | null;
  circuitData: ReturnType<typeof computeCircuitPhysics> | null;
  lensData: ReturnType<typeof computeThinLensPhysics> | null;
  simTime: number;
  params: Record<string, number>;
}) {
  if (domainId === "co-hoc" && projectileData) {
    const pts = projectileData.trajectory;
    const maxT = Math.max(0.5, projectileData.flightTime);
    const maxV = Math.max(...pts.map((p) => p.v), 10);
    const poly = pts
      .map((p) => `${(24 + (p.t / maxT) * 280).toFixed(1)},${(95 - (p.v / maxV) * 75).toFixed(1)}`)
      .join(" ");
    return (
      <svg viewBox="0 0 320 110" className="w-full h-28 physics-raw">
        <line x1="24" y1="95" x2="306" y2="95" stroke="#2B4033" />
        <polyline points={poly} fill="none" stroke="#C8ED78" strokeWidth="2" />
        <text x="26" y="16" fill="#A5B7A8" fontSize="9" fontFamily="monospace">
          v_max = {maxV.toFixed(1)} m/s
        </text>
      </svg>
    );
  }

  if (domainId === "dao-dong-song" && springData) {
    const maxA = Math.max(5, ...springData.samples.map((s) => Math.abs(s.xCm)));
    const poly = springData.samples
      .filter((_, idx) => idx % 2 === 0)
      .map((s) => `${(20 + (s.t / 10) * 285).toFixed(1)},${(55 - (s.xCm / maxA) * 40).toFixed(1)}`)
      .join(" ");
    return (
      <svg viewBox="0 0 320 110" className="w-full h-28 physics-raw">
        <line x1="20" y1="55" x2="305" y2="55" stroke="#2B4033" />
        <polyline points={poly} fill="none" stroke="#72CF91" strokeWidth="1.8" />
        <text x="22" y="15" fill="#A5B7A8" fontSize="9" fontFamily="monospace">
          Chu kỳ T₀ = {springData.period.toFixed(2)}s · Tần số f = {springData.frequency.toFixed(2)}{" "}
          Hz
        </text>
      </svg>
    );
  }

  if (domainId === "nhiet-hoc" && gasData) {
    const maxP = Math.max(50, ...gasData.isothermCurve.map((c) => c.pKPa));
    const poly = gasData.isothermCurve
      .map(
        (c) =>
          `${(24 + ((c.vL - 5) / 45) * 280).toFixed(1)},${(96 - (c.pKPa / maxP) * 76).toFixed(1)}`,
      )
      .join(" ");
    return (
      <svg viewBox="0 0 320 110" className="w-full h-28 physics-raw">
        <line x1="24" y1="96" x2="306" y2="96" stroke="#2B4033" />
        <polyline points={poly} fill="none" stroke="#C8ED78" strokeWidth="2" />
        <text x="30" y="16" fill="#A5B7A8" fontSize="9" fontFamily="monospace">
          Isotherm: p·V = const · v_rms(He) = {gasData.vRmsHelium.toFixed(0)} m/s
        </text>
      </svg>
    );
  }

  if (domainId === "dien-tu" && circuitData) {
    const maxP = Math.max(1, circuitData.pMaxPossible);
    const poly = circuitData.powerCurve
      .map(
        (c) => `${(24 + (c.rVal / 30) * 280).toFixed(1)},${(96 - (c.pVal / maxP) * 74).toFixed(1)}`,
      )
      .join(" ");
    const curX = 24 + (Math.min(30, circuitData.rExt) / 30) * 280;
    const curY = 96 - (circuitData.pExt / maxP) * 74;
    return (
      <svg viewBox="0 0 320 110" className="w-full h-28 physics-raw">
        <line x1="24" y1="96" x2="306" y2="96" stroke="#2B4033" />
        <polyline points={poly} fill="none" stroke="#38A875" strokeWidth="2" />
        <circle cx={curX} cy={curY} r="4.5" fill="#C8ED78" />
        <text x="28" y="16" fill="#A5B7A8" fontSize="9" fontFamily="monospace">
          P_max = {circuitData.pMaxPossible.toFixed(2)} W · Hiện tại: {circuitData.pExt.toFixed(2)}{" "}
          W
        </text>
      </svg>
    );
  }

  return (
    <div className="py-5 px-2 font-mono text-xs text-[#C8ED78] tabular-nums">
      {lensData ? (
        <div className="space-y-1">
          <div>
            1/f = 1/({lensData.f}) = {(1 / lensData.f).toFixed(4)} cm⁻¹
          </div>
          <div>
            1/d + 1/d&apos; = 1/({lensData.d}) + 1/(
            {lensData.dPrime !== null ? lensData.dPrime.toFixed(1) : "∞"})
          </div>
          <div className="text-[#72CF91]">{lensData.natureText}</div>
        </div>
      ) : null}
    </div>
  );
}
