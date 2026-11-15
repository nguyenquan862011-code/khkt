import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Waves,
  Ruler,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Camera,
  BookOpen,
  ExternalLink,
  Sliders,
} from "lucide-react";
import {
  analyzeInterferencePoint,
  calculateWaveSpeedCmS,
  countInterferenceExtrema,
  type WavePoint,
} from "@/lib/wave-experiment";
import { getExperimentPhoto, PHOTO_FALLBACK_TEXT } from "@/data/experiment-photos";

function dist(p1: WavePoint, p2: WavePoint): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function formatNum(val: number, decimals = 1): string {
  return val.toFixed(decimals).replace(".", ",");
}

function clampPoint(p: WavePoint): WavePoint {
  return {
    x: Math.min(23.2, Math.max(0.8, p.x)),
    y: Math.min(17.2, Math.max(0.8, p.y)),
  };
}

const PREDICTION_OPTIONS = [
  {
    id: "fewer-wider",
    label: "Số cực đại giảm đi và các vân giao thoa thưa ra",
    isCorrect: true,
  },
  {
    id: "more-denser",
    label: "Số cực đại tăng lên và các vân giao thoa dày đặc hơn",
    isCorrect: false,
  },
  {
    id: "unchanged",
    label: "Hình ảnh giao thoa hoàn toàn không thay đổi",
    isCorrect: false,
  },
] as const;

const QUICK_CHECKS = [
  {
    id: "qc-1",
    question: "Với hai nguồn kết hợp cùng pha, điểm M nằm trên vân cực đại khi hiệu đường đi bằng:",
    options: ["d₂ − d₁ = kλ (k ∈ Z)", "d₂ − d₁ = (k + 0,5)λ", "d₂ + d₁ = kλ"],
    correctIndex: 0,
    explain:
      "Hai sóng truyền tới M cùng pha nhau khi hiệu đường đi bằng một số nguyên lần bước sóng: d₂ − d₁ = kλ.",
  },
  {
    id: "qc-2",
    question: "Nếu biên độ mỗi nguồn là a = 1,5 cm thì biên độ cực đại tại bụng giao thoa bằng:",
    options: ["1,5 cm", "3,0 cm (A_max = 2a)", "0 cm"],
    correctIndex: 1,
    explain:
      "Theo nguyên lý chồng chất sóng, tại các điểm dao động cực đại, hai sóng tăng cường hoàn toàn tạo biên độ A_max = a₁ + a₂ = 2a = 3,0 cm.",
  },
];

export function WaveInterferenceExperiment() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeDraggingRef = useRef<"s1" | "s2" | null>(null);

  const [activeTab, setActiveTab] = useState<"sim" | "photo" | "guide">("sim");
  const [sources, setSources] = useState<{ s1: WavePoint; s2: WavePoint }>({
    s1: { x: 9, y: 9 },
    s2: { x: 15, y: 9 },
  });
  const [wavelength, setWavelength] = useState<number>(1.6);
  const [frequency, setFrequency] = useState<number>(2.0);
  const [amplitude, setAmplitude] = useState<number>(1.0);
  const [phaseDiffPi, setPhaseDiffPi] = useState<number>(0);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [showRuler, setShowRuler] = useState<boolean>(true);
  const [simStatus, setSimStatus] = useState<"idle" | "running" | "paused">(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "idle" : "running";
    }
    return "running";
  });

  // Hover or click-pinned probe point M
  const [probe, setProbe] = useState<WavePoint | null>({ x: 12, y: 5.5 });
  const [isProbePinned, setIsProbePinned] = useState<boolean>(true);

  // Required interactive prediction state
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [quickAnswers, setQuickAnswers] = useState<Record<string, number>>({});

  const animStateRef = useRef<{ time: number; last: number }>({ time: 0, last: 0 });
  const liveParamsRef = useRef({ frequency, amplitude, speedMultiplier });
  liveParamsRef.current = { frequency, amplitude, speedMultiplier };

  const sourceDist = dist(sources.s1, sources.s2);
  const waveSpeedCmS = calculateWaveSpeedCmS(wavelength, frequency);
  const { maximaCount, minimaCount, maximaOffsets } = countInterferenceExtrema(
    sourceDist,
    wavelength,
    phaseDiffPi,
  );

  // Midpoint & unit direction along S1 -> S2
  const midX = (sources.s1.x + sources.s2.x) / 2;
  const midY = (sources.s1.y + sources.s2.y) / 2;
  const dirX = sourceDist > 0 ? (sources.s2.x - sources.s1.x) / sourceDist : 1;
  const dirY = sourceDist > 0 ? (sources.s2.y - sources.s1.y) / sourceDist : 0;

  const probeInfo = probe
    ? analyzeInterferencePoint(probe, sources.s1, sources.s2, wavelength, phaseDiffPi)
    : null;

  const realPhoto = getExperimentPhoto("water-interference");

  // Precomputed spatial phase buffer
  const offscreenBufferRef = useRef<{
    a: Float32Array;
    b: Float32Array;
    offscreen: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    imgData: ImageData;
  } | null>(null);

  useEffect(() => {
    let buf = offscreenBufferRef.current;
    if (!buf) {
      const off = document.createElement("canvas");
      off.width = 200;
      off.height = 150;
      const ctx = off.getContext("2d");
      if (!ctx) return;
      buf = {
        a: new Float32Array(30000),
        b: new Float32Array(30000),
        offscreen: off,
        ctx,
        imgData: ctx.createImageData(200, 150),
      };
      offscreenBufferRef.current = buf;
    }

    const { a, b } = buf;
    const k = (2 * Math.PI) / wavelength;
    const dPhi = phaseDiffPi * Math.PI;
    const { s1, s2 } = sources;

    for (let e = 0; e < 150; e += 1) {
      const py = ((e + 0.5) / 150) * 18;
      for (let t = 0; t < 200; t += 1) {
        const px = ((t + 0.5) / 200) * 24;
        const d1 = Math.hypot(px - s1.x, py - s1.y);
        const d2 = Math.hypot(px - s2.x, py - s2.y);
        const idx = 200 * e + t;
        a[idx] = (Math.cos(k * d1) + Math.cos(k * d2 - dPhi)) / 2;
        b[idx] = (Math.sin(k * d1) + Math.sin(k * d2 - dPhi)) / 2;
      }
    }
  }, [sources, wavelength, phaseDiffPi]);

  // Main animation render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Scientific Ocean-Navy -> Deep Teal -> Luminous Wave Crest Palette
    const palette = new Uint8ClampedArray(768);
    for (let i = 0; i < 256; i++) {
      const t = i / 255;
      let r: number, g: number, b: number;
      if (t < 0.5) {
        const f = t * 2;
        r = 10 + (18 - 10) * f;
        g = 24 + (74 - 24) * f;
        b = 46 + (98 - 46) * f;
      } else {
        const f = (t - 0.5) * 2;
        r = 18 + (135 - 18) * f;
        g = 74 + (235 - 74) * f;
        b = 98 + (248 - 98) * f;
      }
      palette[3 * i] = r;
      palette[3 * i + 1] = g;
      palette[3 * i + 2] = b;
    }

    let animId = 0;

    const renderFrame = () => {
      const buf = offscreenBufferRef.current;
      if (!buf) return;
      const { a, b, offscreen, ctx: offCtx, imgData } = buf;
      const curTime = animStateRef.current.time;
      const { frequency: freq, amplitude: ampVal } = liveParamsRef.current;

      // Visual oscillation angular velocity proportional to frequency f (clamped nicely for 60fps legibility)
      const omega = 2 * Math.PI * (0.35 + freq * 0.35);
      const cosW = Math.cos(omega * curTime);
      const sinW = Math.sin(omega * curTime);
      const ampGain = 0.5 + (ampVal / 2.0) * 0.65;

      const data = imgData.data;
      for (let i = 0; i < 30000; i++) {
        const raw = (a[i] * cosW + b[i] * sinW) * ampGain;
        const amp = (Math.max(-1, Math.min(1, raw)) + 1) * 127.5;
        const colorIdx = Math.max(0, Math.min(255, amp | 0));
        const pOffset = colorIdx * 3;
        const dOffset = i * 4;
        data[dOffset] = palette[pOffset];
        data[dOffset + 1] = palette[pOffset + 1];
        data[dOffset + 2] = palette[pOffset + 2];
        data[dOffset + 3] = 255;
      }

      offCtx.putImageData(imgData, 0, 0);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
    };

    const tick = (now: number) => {
      if (animStateRef.current.last) {
        const delta = Math.min(now - animStateRef.current.last, 64) / 1000;
        animStateRef.current.time += delta * liveParamsRef.current.speedMultiplier;
      }
      animStateRef.current.last = now;
      renderFrame();
      if (simStatus === "running") {
        animId = requestAnimationFrame(tick);
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      renderFrame();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    if (simStatus === "running") {
      animStateRef.current.last = 0;
      animId = requestAnimationFrame(tick);
    } else {
      renderFrame();
    }

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [simStatus, activeTab, frequency, amplitude, wavelength, phaseDiffPi, sources]);

  const getGridCoords = useCallback((e: React.PointerEvent<SVGSVGElement>): WavePoint => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 24,
      y: ((e.clientY - rect.top) / rect.height) * 18,
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const pt = getGridCoords(e);
    if (activeDraggingRef.current) {
      setSources((prev) => ({
        ...prev,
        [activeDraggingRef.current!]: clampPoint(pt),
      }));
    } else if (!isProbePinned) {
      setProbe(pt);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!activeDraggingRef.current) {
      setProbe(clampPoint(getGridCoords(e)));
      setIsProbePinned(true);
    }
  };

  const handlePointerUp = () => {
    activeDraggingRef.current = null;
  };

  const handleSourceKeyDown = (sourceKey: "s1" | "s2", e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 1.0 : 0.2;
    const deltaMap: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const delta = deltaMap[e.key];
    if (!delta) return;
    e.preventDefault();
    setSources((prev) => {
      const cur = prev[sourceKey];
      return {
        ...prev,
        [sourceKey]: clampPoint({ x: cur.x + delta[0], y: cur.y + delta[1] }),
      };
    });
  };

  const handlePlayPause = () => {
    setSimStatus((cur) => (cur === "running" ? "paused" : "running"));
  };

  const handleReset = () => {
    setSources({ s1: { x: 9, y: 9 }, s2: { x: 15, y: 9 } });
    setWavelength(1.6);
    setFrequency(2.0);
    setAmplitude(1.0);
    setPhaseDiffPi(0);
    setSpeedMultiplier(1.0);
    setProbe({ x: 12, y: 5.5 });
    setIsProbePinned(true);
    animStateRef.current.time = 0;
    setSimStatus("idle");
  };

  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDist = parseFloat(e.target.value);
    const half = newDist / 2;
    setSources({
      s1: clampPoint({ x: midX - half * dirX, y: midY - half * dirY }),
      s2: clampPoint({ x: midX + half * dirX, y: midY + half * dirY }),
    });
  };

  const predictionChoiceObj = PREDICTION_OPTIONS.find((o) => o.id === selectedPrediction);

  return (
    <div className="relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card text-foreground shadow-xl">
      {/* Header Bar + Navy/Blue Scientific Badge */}
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-[#0F2942] px-4 py-3 text-white sm:px-5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#0284C7]/25 text-[#38BDF8]">
            <Waves className="size-4" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-xs sm:text-sm font-bold tracking-tight uppercase">
              Giao thoa sóng nước – Chồng chất hai nguồn
            </h2>
            <p className="font-mono text-[10px] text-[#7DD3FC] tabular-nums">
              v = {formatNum(waveSpeedCmS, 1)} cm/s · N_cđ = {maximaCount} · N_ct = {minimaCount}
            </p>
          </div>
        </div>

        {/* Navigation Tabs within Wave Lab */}
        <div className="flex items-center gap-1" role="tablist" aria-label="Chế độ thí nghiệm sóng">
          {[
            { id: "sim" as const, label: "Mô phỏng", icon: Sliders },
            { id: "photo" as const, label: "Ảnh & Dự đoán", icon: Camera },
            { id: "guide" as const, label: "4 Bước & Công thức", icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? "bg-[#38BDF8] text-[#082F49] font-semibold"
                    : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                }`}
              >
                <Icon className="size-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* TAB 1: INTERACTIVE SIMULATION & MEASUREMENT */}
      {activeTab === "sim" && (
        <>
          {/* Viewport */}
          <div className="relative aspect-[4/3] border-b border-border bg-[#0A182E]">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={`Mô phỏng giao thoa sóng nước: S1S2 = ${formatNum(sourceDist)} cm, bước sóng ${formatNum(wavelength)} cm, tần số ${formatNum(frequency)} Hz`}
              className="absolute inset-0 size-full"
            />

            <svg
              viewBox="0 0 24 18"
              className="absolute inset-0 size-full cursor-crosshair select-none physics-raw"
              onPointerMove={handlePointerMove}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
            >
              {/* Ruler / Distance Measurement Tool Layer */}
              {showRuler && (
                <g className="pointer-events-none">
                  {/* S1-S2 distance caliper line */}
                  <line
                    x1={sources.s1.x}
                    y1={sources.s1.y}
                    x2={sources.s2.x}
                    y2={sources.s2.y}
                    stroke="#38BDF8"
                    strokeWidth="0.09"
                    strokeDasharray="0.28 0.18"
                  />
                  {/* S1S2 distance badge */}
                  <rect
                    x={midX - 1.5}
                    y={midY + 0.35}
                    width="3.0"
                    height="0.95"
                    rx="0.2"
                    fill="#082F49"
                    fillOpacity="0.86"
                    stroke="#38BDF8"
                    strokeWidth="0.05"
                  />
                  <text
                    x={midX}
                    y={midY + 1.0}
                    textAnchor="middle"
                    fill="#E0F2FE"
                    fontSize="0.58"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {formatNum(sourceDist)} cm
                  </text>
                </g>
              )}

              {/* Maxima points along S1-S2 */}
              {maximaOffsets.map((offset, idx) => (
                <circle
                  key={idx}
                  cx={midX + dirX * offset}
                  cy={midY + dirY * offset}
                  r="0.18"
                  fill="#082F49"
                  stroke="#C8ED78"
                  strokeWidth="0.08"
                />
              ))}

              {/* Probe Point M and Distance Measurement Overlay */}
              {probe && probeInfo && (
                <g className="pointer-events-none">
                  <line
                    x1={sources.s1.x}
                    y1={sources.s1.y}
                    x2={probe.x}
                    y2={probe.y}
                    stroke="#FBBF24"
                    strokeWidth="0.08"
                    strokeDasharray="0.26 0.18"
                  />
                  <line
                    x1={sources.s2.x}
                    y1={sources.s2.y}
                    x2={probe.x}
                    y2={probe.y}
                    stroke="#38BDF8"
                    strokeWidth="0.08"
                    strokeDasharray="0.26 0.18"
                  />
                  {showRuler && (
                    <>
                      <text
                        x={(sources.s1.x + probe.x) / 2 - 0.5}
                        y={(sources.s1.y + probe.y) / 2 - 0.25}
                        fill="#FDE68A"
                        fontSize="0.55"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        d₁={formatNum(probeInfo.d1)}
                      </text>
                      <text
                        x={(sources.s2.x + probe.x) / 2 + 0.3}
                        y={(sources.s2.y + probe.y) / 2 - 0.25}
                        fill="#BAE6FD"
                        fontSize="0.55"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        d₂={formatNum(probeInfo.d2)}
                      </text>
                    </>
                  )}
                  <circle
                    cx={probe.x}
                    cy={probe.y}
                    r="0.45"
                    fill={
                      probeInfo.verdict === "max"
                        ? "#C8ED78"
                        : probeInfo.verdict === "min"
                          ? "#0F2942"
                          : "#FFFFFF"
                    }
                    stroke="#082F49"
                    strokeWidth="0.12"
                  />
                  <text
                    x={probe.x + 0.55}
                    y={probe.y - 0.45}
                    fill="#FFFFFF"
                    fontSize="0.8"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    M
                  </text>
                </g>
              )}

              {/* Draggable Source S1 */}
              <g
                role="button"
                tabIndex={0}
                aria-label="Nguồn S₁ — kéo hoặc dùng phím mũi tên"
                className="cursor-grab touch-none outline-none active:cursor-grabbing"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  activeDraggingRef.current = "s1";
                  e.currentTarget.ownerSVGElement?.setPointerCapture(e.pointerId);
                }}
                onKeyDown={(e) => handleSourceKeyDown("s1", e)}
              >
                <circle
                  cx={sources.s1.x}
                  cy={sources.s1.y}
                  r="0.68"
                  fill="#38BDF8"
                  fillOpacity="0.28"
                />
                <circle
                  cx={sources.s1.x}
                  cy={sources.s1.y}
                  r="0.42"
                  fill="#082F49"
                  stroke="#38BDF8"
                  strokeWidth="0.12"
                />
                <text
                  x={sources.s1.x}
                  y={sources.s1.y - 0.72}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="0.8"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  S₁
                </text>
              </g>

              {/* Draggable Source S2 */}
              <g
                role="button"
                tabIndex={0}
                aria-label="Nguồn S₂ — kéo hoặc dùng phím mũi tên"
                className="cursor-grab touch-none outline-none active:cursor-grabbing"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  activeDraggingRef.current = "s2";
                  e.currentTarget.ownerSVGElement?.setPointerCapture(e.pointerId);
                }}
                onKeyDown={(e) => handleSourceKeyDown("s2", e)}
              >
                <circle
                  cx={sources.s2.x}
                  cy={sources.s2.y}
                  r="0.68"
                  fill="#C8ED78"
                  fillOpacity="0.28"
                />
                <circle
                  cx={sources.s2.x}
                  cy={sources.s2.y}
                  r="0.42"
                  fill="#082F49"
                  stroke="#C8ED78"
                  strokeWidth="0.12"
                />
                <text
                  x={sources.s2.x}
                  y={sources.s2.y - 0.72}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="0.8"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  S₂
                </text>
              </g>
            </svg>
          </div>

          {/* Playback + Distance Ruler Bar + Probe Info */}
          <div className="border-b border-border bg-secondary/45 px-4 py-3 space-y-2 sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePlayPause}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#0F2942] dark:bg-[#0284C7] px-3 text-xs font-semibold text-white hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
                >
                  {simStatus === "running" ? (
                    <>
                      <Pause className="size-3.5" />
                      <span>Tạm dừng</span>
                    </>
                  ) : (
                    <>
                      <Play className="size-3.5" />
                      <span>{simStatus === "paused" ? "Tiếp tục" : "Bắt đầu"}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-card px-2.5 text-xs font-medium text-foreground hover:bg-muted transition-colors whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Đặt lại</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowRuler((r) => !r)}
                  className={`inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    showRuler
                      ? "border-[#0284C7]/50 bg-[#0284C7]/15 text-[#0369A1] dark:text-[#38BDF8]"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                  title="Bật/tắt công cụ thước đo khoảng cách trên mặt nước"
                >
                  <Ruler className="size-3.5" />
                  <span>Đo khoảng cách</span>
                </button>
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px] tabular-nums">
                <span className="text-muted-foreground">Tốc độ:</span>
                {[0.5, 1, 1.5].map((sp) => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => setSpeedMultiplier(sp)}
                    className={`rounded px-1.5 py-0.5 text-[11px] font-semibold transition-colors ${
                      speedMultiplier === sp
                        ? "bg-[#16845A] text-white"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {sp}x
                  </button>
                ))}
              </div>
            </div>

            {/* Live Point M Measurement Readout */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs tabular-nums">
              {probeInfo ? (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-mono text-[11px] text-foreground">
                    M(d₁={formatNum(probeInfo.d1, 2)} cm, d₂={formatNum(probeInfo.d2, 2)} cm) ·
                    |d₂−d₁|={formatNum(Math.abs(probeInfo.diff), 2)} cm
                  </span>
                  <span className="font-semibold">
                    {probeInfo.verdict === "max" ? (
                      <span className="text-[#16845A] dark:text-[#72CF91]">
                        Cực đại bậc {Math.abs(probeInfo.order)} (A ≈{" "}
                        {formatNum(2 * amplitude * probeInfo.amplitudeFactor, 2)} cm)
                      </span>
                    ) : probeInfo.verdict === "min" ? (
                      <span className="text-[#0284C7] dark:text-[#38BDF8]">
                        Cực tiểu đứng yên (A ≈ 0)
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        Biên độ A_M = {formatNum(2 * amplitude * probeInfo.amplitudeFactor, 2)} cm
                      </span>
                    )}
                  </span>
                </div>
              ) : (
                <span className="text-muted-foreground">
                  Chạm hoặc click lên mặt nước để ghim điểm M và đo hiệu đường đi d₂ − d₁.
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsProbePinned((p) => !p)}
                className="text-[11px] font-medium text-[#0284C7] dark:text-[#38BDF8] hover:underline whitespace-nowrap shrink-0"
              >
                {isProbePinned ? "Theo con trỏ chuột" : "Đang quét tự do"}
              </button>
            </div>
          </div>

          {/* 5 Interactive Physics Sliders (S1S2, Lambda, Frequency f, Amplitude a, Phase Δφ) */}
          <div className="grid grid-cols-1 gap-3.5 p-4 sm:grid-cols-2 lg:grid-cols-3 sm:px-5 tabular-nums text-xs">
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="wave-dist" className="font-medium">
                  Khoảng cách S₁S₂
                </label>
                <span className="font-mono font-semibold text-[#0284C7] dark:text-[#38BDF8]">
                  {formatNum(sourceDist)} cm
                </span>
              </div>
              <input
                id="wave-dist"
                type="range"
                min="4.0"
                max="9.0"
                step="0.2"
                value={Math.min(9.0, Math.max(4.0, sourceDist))}
                onChange={handleDistanceChange}
                className="mt-1.5 h-1.5 w-full cursor-pointer accent-[#0284C7]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="wave-lambda" className="font-medium">
                  Bước sóng λ
                </label>
                <span className="font-mono font-semibold text-[#16845A] dark:text-[#72CF91]">
                  {formatNum(wavelength)} cm
                </span>
              </div>
              <input
                id="wave-lambda"
                type="range"
                min="1.0"
                max="3.5"
                step="0.1"
                value={wavelength}
                onChange={(e) => setWavelength(parseFloat(e.target.value))}
                className="mt-1.5 h-1.5 w-full cursor-pointer accent-[#16845A]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="wave-freq" className="font-medium">
                  Tần số f (Hz)
                </label>
                <span className="font-mono font-semibold text-[#0284C7] dark:text-[#38BDF8]">
                  {formatNum(frequency)} Hz
                </span>
              </div>
              <input
                id="wave-freq"
                type="range"
                min="0.5"
                max="4.0"
                step="0.5"
                value={frequency}
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="mt-1.5 h-1.5 w-full cursor-pointer accent-[#0284C7]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="wave-amp" className="font-medium">
                  Biên độ nguồn a
                </label>
                <span className="font-mono font-semibold text-[#16845A] dark:text-[#72CF91]">
                  {formatNum(amplitude)} cm
                </span>
              </div>
              <input
                id="wave-amp"
                type="range"
                min="0.5"
                max="2.0"
                step="0.25"
                value={amplitude}
                onChange={(e) => setAmplitude(parseFloat(e.target.value))}
                className="mt-1.5 h-1.5 w-full cursor-pointer accent-[#16845A]"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between">
                <label htmlFor="wave-phase" className="font-medium">
                  Độ lệch pha Δφ hai nguồn
                </label>
                <span className="font-mono font-semibold text-[#0284C7] dark:text-[#38BDF8]">
                  {phaseDiffPi === 0
                    ? "0 (Cùng pha)"
                    : phaseDiffPi === 1
                      ? "π (Ngược pha)"
                      : `${phaseDiffPi.toFixed(2)}π rad`}
                </span>
              </div>
              <input
                id="wave-phase"
                type="range"
                min="0"
                max="2"
                step="0.25"
                value={phaseDiffPi}
                onChange={(e) => setPhaseDiffPi(parseFloat(e.target.value))}
                className="mt-1.5 h-1.5 w-full cursor-pointer accent-[#0284C7]"
              />
            </div>
          </div>

          {/* Amplitude Profile A(x) along segment S1-S2 */}
          <div className="border-t border-border bg-[#0A182E] px-4 py-2.5 sm:px-5">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#7DD3FC] mb-1">
              <span>Biên độ tổng hợp A(x) trên đoạn S₁S₂</span>
              <span className="text-[#BAE6FD]">A_max = 2a = {formatNum(2 * amplitude, 1)} cm</span>
            </div>
            <svg viewBox="0 0 440 64" className="w-full h-14 physics-raw">
              <line x1="16" y1="54" x2="424" y2="54" stroke="#1E3A5F" strokeWidth="1" />
              {(() => {
                const pts: string[] = [];
                const dPhi = phaseDiffPi * Math.PI;
                for (let i = 0; i <= 120; i++) {
                  const frac = i / 120;
                  const dDiff = (2 * frac - 1) * sourceDist;
                  const factor = Math.abs(Math.cos((Math.PI * dDiff) / wavelength - dPhi / 2));
                  const scaledHeight = factor * (amplitude / 2.0) * 44;
                  const px = 16 + frac * 408;
                  const py = 54 - scaledHeight;
                  pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
                }
                return (
                  <polyline points={pts.join(" ")} fill="none" stroke="#38BDF8" strokeWidth="1.8" />
                );
              })()}
            </svg>
          </div>
        </>
      )}

      {/* TAB 2: REAL LAB PHOTOGRAPH + MANDATORY INTERACTIVE PREDICTION */}
      {activeTab === "photo" && (
        <div className="p-4 sm:p-5 space-y-5">
          {/* Real Laboratory Photo with Wikimedia Commons Citation */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#0369A1] dark:text-[#38BDF8]">
                Ảnh thí nghiệm thực tế trong phòng Lab
              </h3>
              <span className="text-[11px] text-muted-foreground">Bể sóng (Ripple Tank)</span>
            </div>

            {realPhoto ? (
              <figure className="overflow-hidden rounded-2xl border border-border bg-secondary/35">
                <img
                  src={realPhoto.src}
                  alt={realPhoto.title}
                  className="w-full h-56 sm:h-64 object-cover"
                  loading="lazy"
                />
                <figcaption className="p-3 space-y-1 text-xs">
                  <p className="font-semibold text-foreground">{realPhoto.title}</p>
                  <p className="text-muted-foreground leading-relaxed">{realPhoto.caption}</p>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] font-mono text-muted-foreground">
                    <span>
                      Tác giả: {realPhoto.author} · Giấy phép: {realPhoto.license}
                    </span>
                    <a
                      href={realPhoto.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#0284C7] dark:text-[#38BDF8] hover:underline"
                    >
                      <span>{realPhoto.sourceName}</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                </figcaption>
              </figure>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                {PHOTO_FALLBACK_TEXT}
              </div>
            )}
          </div>

          {/* Interactive Prediction Question (Locked explanation until answered) */}
          <div className="rounded-2xl border border-[#0284C7]/35 bg-[#0284C7]/10 p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0369A1] dark:text-[#38BDF8]">
              <HelpCircle className="size-4 shrink-0" />
              <span>Câu hỏi dự đoán bắt buộc trước khi xem giải thích</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed">
              Nếu tăng bước sóng nhưng giữ nguyên khoảng cách giữa hai nguồn, hình ảnh giao thoa sẽ
              thay đổi như thế nào?
            </p>

            <div className="grid grid-cols-1 gap-2">
              {PREDICTION_OPTIONS.map((opt, idx) => {
                const isSelected = selectedPrediction === opt.id;
                let style = "border-border bg-card text-foreground hover:border-[#0284C7]/60";
                if (selectedPrediction) {
                  if (opt.isCorrect) {
                    style =
                      "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold";
                  } else if (isSelected) {
                    style = "border-red-500 bg-red-500/15 text-red-700 dark:text-red-300";
                  }
                }
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedPrediction(opt.id)}
                    className={`rounded-xl border px-3.5 py-2.5 text-left text-xs transition-colors ${style}`}
                  >
                    {String.fromCharCode(65 + idx)}. {opt.label}
                  </button>
                );
              })}
            </div>

            {!selectedPrediction ? (
              <p className="text-[11px] text-muted-foreground italic">
                Hãy chọn một dự đoán để mở khóa phần phân tích và kiểm chứng trực tiếp trên mô
                phỏng.
              </p>
            ) : (
              <div className="rounded-xl border border-border bg-card p-3.5 space-y-2.5 text-xs">
                <div className="flex items-center gap-1.5 font-bold">
                  {predictionChoiceObj?.isCorrect ? (
                    <>
                      <CheckCircle2 className="size-4 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-300">
                        Dự đoán chính xác!
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="size-4 text-amber-500" />
                      <span className="text-amber-600 dark:text-amber-300">
                        Chưa đúng — hãy đối chiếu công thức ngay bên dưới:
                      </span>
                    </>
                  )}
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Vì các cực đại trên đoạn S₁S₂ cách đều nhau một khoảng{" "}
                  <strong className="font-mono text-foreground">λ / 2</strong>, nên khi bước sóng λ
                  tăng mà S₁S₂ không đổi, khoảng cách giữa các đường vân tăng lên (vân thưa ra) và
                  số cực đại{" "}
                  <strong className="font-mono text-foreground">N_cđ = 2·⌊S₁S₂ / λ⌋ + 1</strong>{" "}
                  giảm xuống.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setWavelength(2.8);
                    setActiveTab("sim");
                    setSimStatus("running");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F2942] dark:bg-[#0284C7] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                >
                  <Sliders className="size-3.5" />
                  <span>Kiểm chứng ngay trên mô phỏng (λ = 2,8 cm)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: 4-STEP SCIENTIFIC GUIDE, FORMULAS & QUICK CHECK */}
      {activeTab === "guide" && (
        <div className="p-4 sm:p-5 space-y-4 max-h-[540px] overflow-y-auto text-xs">
          <div className="rounded-xl border border-border bg-secondary/35 p-3.5 space-y-1.5">
            <h3 className="font-bold text-foreground uppercase tracking-wider text-[11px] text-[#0369A1] dark:text-[#38BDF8]">
              Mục tiêu & Kiến thức nền tảng
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Mục tiêu:</strong> Quan sát sự chồng chất của hai
              sóng kết hợp trên mặt nước, xác định vị trí cực đại – cực tiểu bằng hiệu đường đi (d₂
              − d₁) và kiểm chứng vai trò của bước sóng λ, tần số f, biên độ a.
            </p>
            <p className="font-mono text-[11px] text-[#16845A] dark:text-[#72CF91] pt-1">
              v = λ·f · Cực đại (cùng pha): d₂ − d₁ = kλ · Cực tiểu: d₂ − d₁ = (k + 0,5)λ · A_max =
              2a
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              {
                step: "Bước 1 – Quan sát",
                text: "Khởi động thí nghiệm, quan sát các dải gợn sóng nhấp nhô cực đại xen kẽ các đường đứng yên cực tiểu.",
              },
              {
                step: "Bước 2 – Đặt câu hỏi",
                text: "Vì sao có những điểm luôn đứng yên dù cả hai nguồn sóng đều truyền năng lượng tới đó?",
              },
              {
                step: "Bước 3 – Dự đoán & Kiểm chứng",
                text: "Trả lời câu hỏi dự đoán ở mục Ảnh & Dự đoán, sau đó tăng λ hoặc thay đổi f, S₁S₂ để kiểm chứng trực tiếp.",
              },
              {
                step: "Bước 4 – Phân tích & Vận dụng",
                text: "Dùng công cụ Đo khoảng cách tại điểm M để nghiệm lại d₂ − d₁ = kλ, giải thích ứng dụng trong ăng-ten phát sóng và tiêu âm.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-border bg-card p-3 space-y-1"
              >
                <span className="font-mono text-[11px] font-bold text-[#0369A1] dark:text-[#38BDF8]">
                  {item.step}
                </span>
                <p className="text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Quick Knowledge Check */}
          <div className="space-y-3 pt-1">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-foreground">
              Kiểm tra nhanh bản chất giao thoa
            </h4>
            {QUICK_CHECKS.map((qc) => {
              const chosen = quickAnswers[qc.id];
              const answered = chosen !== undefined;
              return (
                <div key={qc.id} className="rounded-xl border border-border bg-card p-3 space-y-2">
                  <p className="font-semibold text-foreground">{qc.question}</p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {qc.options.map((opt, i) => {
                      let st = "border-border bg-secondary/40 text-foreground hover:bg-secondary";
                      if (answered) {
                        if (i === qc.correctIndex) {
                          st =
                            "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold";
                        } else if (i === chosen) {
                          st = "border-red-500 bg-red-500/15 text-red-700 dark:text-red-300";
                        }
                      }
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setQuickAnswers((p) => ({ ...p, [qc.id]: i }))}
                          className={`rounded-lg border px-2.5 py-1.5 text-left transition-colors ${st}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {answered && (
                    <p className="text-[11px] text-muted-foreground rounded-lg bg-secondary/40 p-2">
                      {qc.explain}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
