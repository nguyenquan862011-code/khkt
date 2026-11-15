import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Orbit, Gauge } from "lucide-react";
import {
  DEFAULT_CIRCULAR_PARAMS,
  computeCircularMotionMetrics,
  computeCircularMotionState,
  degToRad,
  type CircularMotionParams,
} from "@/lib/circular-motion";

export function UniformCircularMotionExperiment() {
  const [params, setParams] = useState<CircularMotionParams>(DEFAULT_CIRCULAR_PARAMS);
  const [simTime, setSimTime] = useState<number>(0);
  const [status, setStatus] = useState<"idle" | "running" | "paused">(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "idle" : "running";
    }
    return "running";
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<{ time: number; lastTs: number }>({ time: 0, lastTs: 0 });
  const paramsRef = useRef<CircularMotionParams>(params);
  paramsRef.current = params;

  const metrics = computeCircularMotionMetrics(params);
  const instant = computeCircularMotionState(params, simTime);

  // Physics time-stepping animation loop (no GIF/video, pure numerical integration)
  useEffect(() => {
    if (status !== "running") {
      animRef.current.lastTs = 0;
      return;
    }

    let rafId = 0;
    const step = (now: number) => {
      if (animRef.current.lastTs === 0) {
        animRef.current.lastTs = now;
      }
      const dt = Math.min(0.05, Math.max(0, (now - animRef.current.lastTs) / 1000));
      animRef.current.lastTs = now;
      animRef.current.time += dt;
      setSimTime(animRef.current.time);
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [status]);

  // Draw live physics canvas whenever state/params update
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    const width = 560;
    const height = 350;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Dark optical lab background
    ctx.fillStyle = "#07110C";
    ctx.fillRect(0, 0, width, height);

    const cx = width * 0.5;
    const cy = height * 0.52;

    // Subtle polar + Cartesian grid
    ctx.strokeStyle = "rgba(56, 168, 117, 0.10)";
    ctx.lineWidth = 1;
    const gridStep = 28;
    for (let x = cx % gridStep; x < width; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = cy % gridStep; y < height; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Reference Axes passing through center O
    ctx.strokeStyle = "rgba(165, 183, 168, 0.28)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(32, cy);
    ctx.lineTo(width - 32, cy);
    ctx.moveTo(cx, 24);
    ctx.lineTo(cx, height - 22);
    ctx.stroke();
    ctx.setLineDash([]);

    // Map radius R (0.5m .. 3.0m) -> pixels (44px .. 124px)
    const rPx = 30 + (params.radius / 3.0) * 92;

    // 2. Trajectory Circle
    ctx.strokeStyle = "rgba(114, 207, 145, 0.42)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.arc(cx, cy, rPx, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Soft glowing motion trail behind particle (last 1.1 rad)
    const currentPhi = instant.angleRad;
    ctx.strokeStyle = "rgba(200, 237, 120, 0.35)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    // Canvas y points down, so standard math +angle goes counter-clockwise: canvasAngle = -mathAngle
    ctx.arc(cx, cy, rPx, -currentPhi, -(currentPhi - 1.05), false);
    ctx.stroke();

    // 3. Initial angle φ₀ reference ray
    const phi0Rad = degToRad(params.initialAngleDeg);
    const initX = cx + rPx * Math.cos(phi0Rad);
    const initY = cy - rPx * Math.sin(phi0Rad);
    ctx.strokeStyle = "rgba(165, 183, 168, 0.30)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(initX, initY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Rotation angle φ sector & arc (measured from +Ox axis counter-clockwise to particle)
    const arcRadius = Math.min(34, rPx * 0.48);
    const wrappedRad = instant.wrappedAngleRad;
    if (wrappedRad > 0.03) {
      ctx.fillStyle = "rgba(56, 168, 117, 0.18)";
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, arcRadius, 0, -wrappedRad, true);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "#72CF91";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(cx, cy, arcRadius, 0, -wrappedRad, true);
      ctx.stroke();
    }

    // Angle φ label
    const labelAngle = wrappedRad * 0.5;
    const phiLabelR = arcRadius + 15;
    ctx.fillStyle = "#72CF91";
    ctx.font = "600 11px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      `φ=${instant.wrappedAngleDeg.toFixed(0)}°`,
      cx + phiLabelR * Math.cos(labelAngle),
      cy - phiLabelR * Math.sin(labelAngle),
    );

    // 5. Particle position (x, y) in canvas coords
    const ux = Math.cos(currentPhi);
    const uy = Math.sin(currentPhi);
    const px = cx + rPx * ux;
    const py = cy - rPx * uy; // flip y for canvas

    // Radius vector segment O -> M
    ctx.strokeStyle = "#E2EFE4";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.stroke();

    // Radius label R at midpoint
    const midRx = (cx + px) * 0.5 - uy * 12;
    const midRy = (cy + py) * 0.5 - ux * 12;
    ctx.fillStyle = "#EDF5ED";
    ctx.font = "600 11px JetBrains Mono, monospace";
    ctx.fillText(`R=${params.radius.toFixed(1)}m`, midRx, midRy);

    // Helper for drawing crisp arrowheads
    const drawArrow = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      color: string,
      label: string,
      labelOffsetScale = 14,
    ) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy);
      if (len < 4) return;
      const angle = Math.atan2(dy, dx);
      const headLen = 9;

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(
        x2 - headLen * Math.cos(angle - Math.PI / 6),
        y2 - headLen * Math.sin(angle - Math.PI / 6),
      );
      ctx.lineTo(
        x2 - headLen * Math.cos(angle + Math.PI / 6),
        y2 - headLen * Math.sin(angle + Math.PI / 6),
      );
      ctx.closePath();
      ctx.fill();

      const lx = x2 + (dx / len) * labelOffsetScale;
      const ly = y2 + (dy / len) * labelOffsetScale;
      ctx.font = "700 12px JetBrains Mono, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, lx, ly);
    };

    // 6. Right-angle perpendicular symbol at M (between r and v)
    // Tangential unit vector in canvas coords: (-uy, -ux) because math tangent is (-sinφ, cosφ) -> canvas (+, -y) = (-sinφ, -cosφ)
    const tvx = -uy;
    const tvy = -ux;
    // Inward unit vector in canvas coords: (-ux, +uy)
    const irx = -ux;
    const iry = uy;
    const sq = 8;
    ctx.strokeStyle = "rgba(200, 237, 120, 0.55)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(px + tvx * sq, py + tvy * sq);
    ctx.lineTo(px + tvx * sq + irx * sq, py + tvy * sq + iry * sq);
    ctx.lineTo(px + irx * sq, py + iry * sq);
    ctx.stroke();

    // 7. Centripetal acceleration vector a_ht (pointing from M toward center O)
    // Scaled proportionally to ω²R, capped cleanly inside radius + safe range
    const aLen = Math.min(rPx * 0.85, Math.max(24, 14 + metrics.centripetalAccel * 3.1));
    const axEnd = px + irx * aLen;
    const ayEnd = py + iry * aLen;
    drawArrow(px, py, axEnd, ayEnd, "#F59E0B", "aht", 15);

    // 8. Tangential velocity vector v (perpendicular to radius, CCW direction)
    const vLen = Math.min(98, Math.max(28, 22 + metrics.linearSpeed * 8.2));
    const vxEnd = px + tvx * vLen;
    const vyEnd = py + tvy * vLen;
    drawArrow(px, py, vxEnd, vyEnd, "#C8ED78", "v", 13);

    // 9. Center point O
    ctx.fillStyle = "#38A875";
    ctx.beginPath();
    ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#EDF5ED";
    ctx.font = "700 12px JetBrains Mono, monospace";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText("O", cx - 7, cy + 6);

    // 10. Moving mass body M (radius reflects mass m smoothly)
    const bodyRadius = 6.5 + Math.sqrt(params.mass) * 2.2;
    ctx.fillStyle = "#16845A";
    ctx.strokeStyle = "#C8ED78";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(px, py, bodyRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Top-left live status badge inside canvas
    ctx.fillStyle = "rgba(11, 21, 17, 0.82)";
    ctx.strokeStyle = "rgba(56, 168, 117, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(12, 12, 206, 26, 7);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#C8ED78";
    ctx.font = "600 11px JetBrains Mono, monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(`t = ${simTime.toFixed(2)} s · m = ${params.mass.toFixed(1)} kg`, 22, 25);

    ctx.restore();
  }, [params, instant, metrics, simTime]);

  const handleReset = () => {
    animRef.current.time = 0;
    animRef.current.lastTs = 0;
    setSimTime(0);
    setParams(DEFAULT_CIRCULAR_PARAMS);
    setStatus("idle");
  };

  return (
    <section
      aria-labelledby="circular-motion-title"
      className="overflow-hidden rounded-[1.5rem] border border-[#2B4033] bg-card shadow-[0_24px_60px_-24px_rgba(22,132,90,0.28)]"
    >
      {/* Frame Header */}
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-secondary/50 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#16845A]/15 text-[#16845A] dark:text-[#72CF91]">
            <Orbit className="size-4" />
          </span>
          <div>
            <h2 id="circular-motion-title" className="text-sm font-bold text-foreground">
              Chuyển động tròn đều (Tương tác thời gian thực)
            </h2>
            <p className="text-[11px] font-mono text-muted-foreground">
              Quỹ đạo tròn · Vectơ v tiếp tuyến · Vectơ aht hướng tâm · Góc quay φ
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-md border border-[#38A875]/35 bg-[#16845A]/15 px-2.5 py-1 font-mono text-[10px] font-semibold text-[#16845A] dark:text-[#C8ED78]">
          <span
            className={`size-1.5 rounded-full ${
              status === "running"
                ? "animate-pulse bg-[#16845A] dark:bg-[#C8ED78]"
                : "bg-muted-foreground"
            }`}
          />
          {status === "running" ? "ĐANG CHẠY" : status === "paused" ? "TẠM DỪNG" : "SẴN SÀNG"}
        </span>
      </header>

      {/* Real-time Physics Canvas Viewport */}
      <div className="relative border-b border-border bg-[#07110C] p-2 sm:p-3">
        <canvas
          ref={canvasRef}
          className="h-[260px] w-full rounded-xl object-contain sm:h-[310px]"
          aria-label="Mô phỏng chuyển động tròn đều với tâm O, bán kính R, vectơ vận tốc tiếp tuyến v và gia tốc hướng tâm aht"
        />

        {/* Vector Legend Strip */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] font-mono text-[#A5B7A8]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4 bg-[#C8ED78]" />
              <span className="text-[#C8ED78] font-semibold">v</span> tiếp tuyến (⊥ R)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4 bg-[#F59E0B]" />
              <span className="text-[#F59E0B] font-semibold">aht</span> hướng vào tâm O
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-4 bg-[#72CF91]" />
              <span>φ = {instant.wrappedAngleDeg.toFixed(0)}°</span>
            </span>
          </div>
          <span className="text-[10px] text-[#72CF91]">v ⊥ aht tại mọi điểm</span>
        </div>
      </div>

      {/* Live Real-time Physics Parameters Readout */}
      <div className="grid grid-cols-2 gap-2.5 border-b border-border bg-secondary/25 px-4 py-3 sm:grid-cols-4 sm:px-5">
        <div className="rounded-xl border border-border bg-card px-3 py-2">
          <div className="text-[10px] font-mono uppercase text-muted-foreground">
            Tốc độ dài (v = ωR)
          </div>
          <div className="mt-0.5 font-mono text-base font-bold tabular-nums text-[#16845A] dark:text-[#C8ED78]">
            {metrics.linearSpeed.toFixed(2)}{" "}
            <span className="text-[11px] font-normal text-muted-foreground">m/s</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card px-3 py-2">
          <div className="text-[10px] font-mono uppercase text-muted-foreground">
            Gia tốc (aht = ω²R)
          </div>
          <div className="mt-0.5 font-mono text-base font-bold tabular-nums text-amber-600 dark:text-amber-400">
            {metrics.centripetalAccel.toFixed(2)}{" "}
            <span className="text-[11px] font-normal text-muted-foreground">m/s²</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card px-3 py-2">
          <div className="text-[10px] font-mono uppercase text-muted-foreground">
            Chu kỳ (T = 2π/ω)
          </div>
          <div className="mt-0.5 font-mono text-base font-bold tabular-nums text-foreground">
            {metrics.period.toFixed(2)}{" "}
            <span className="text-[11px] font-normal text-muted-foreground">s</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card px-3 py-2">
          <div className="text-[10px] font-mono uppercase text-muted-foreground">
            Tần số (f = 1/T)
          </div>
          <div className="mt-0.5 font-mono text-base font-bold tabular-nums text-[#16845A] dark:text-[#72CF91]">
            {metrics.frequency.toFixed(2)}{" "}
            <span className="text-[11px] font-normal text-muted-foreground">Hz</span>
          </div>
        </div>
      </div>

      {/* Controls: BẮT ĐẦU, TẠM DỪNG, ĐẶT LẠI + 4 Parameter Sliders */}
      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setStatus("running")}
              disabled={status === "running"}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#16845A] dark:bg-[#38A875] px-3.5 py-2 text-xs font-bold text-white dark:text-[#0B1511] shadow-xs transition-opacity hover:opacity-90 disabled:opacity-45 whitespace-nowrap shrink-0"
            >
              <Play className="size-3.5 fill-current" />
              <span>BẮT ĐẦU</span>
            </button>

            <button
              type="button"
              onClick={() => setStatus("paused")}
              disabled={status !== "running"}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3.5 py-2 text-xs font-bold text-foreground transition-colors hover:bg-muted disabled:opacity-45 whitespace-nowrap shrink-0"
            >
              <Pause className="size-3.5" />
              <span>TẠM DỪNG</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground transition-colors hover:bg-muted whitespace-nowrap shrink-0"
            >
              <RotateCcw className="size-3.5" />
              <span>ĐẶT LẠI</span>
            </button>
          </div>

          <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground tabular-nums">
            <Gauge className="size-3.5 text-[#16845A] dark:text-[#72CF91]" />
            <span>
              Fht = mω²R ={" "}
              <strong className="text-foreground">{metrics.centripetalForce.toFixed(2)} N</strong>
            </span>
          </div>
        </div>

        {/* 4 Adjustable Parameters */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {/* Bán kính R */}
          <label className="block rounded-xl border border-border bg-secondary/35 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Bán kính quỹ đạo R</span>
              <span className="font-mono font-bold tabular-nums text-[#16845A] dark:text-[#72CF91]">
                {params.radius.toFixed(1)} m
              </span>
            </div>
            <input
              type="range"
              min={0.5}
              max={3.0}
              step={0.1}
              value={params.radius}
              onChange={(e) => setParams((p) => ({ ...p, radius: parseFloat(e.target.value) }))}
              className="mt-2 h-1.5 w-full cursor-pointer accent-[#16845A] dark:accent-[#38A875]"
              aria-label="Điều chỉnh bán kính R"
            />
          </label>

          {/* Tốc độ góc ω */}
          <label className="block rounded-xl border border-border bg-secondary/35 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Tốc độ góc ω</span>
              <span className="font-mono font-bold tabular-nums text-[#16845A] dark:text-[#C8ED78]">
                {params.omega.toFixed(1)} rad/s
              </span>
            </div>
            <input
              type="range"
              min={0.5}
              max={5.0}
              step={0.1}
              value={params.omega}
              onChange={(e) => setParams((p) => ({ ...p, omega: parseFloat(e.target.value) }))}
              className="mt-2 h-1.5 w-full cursor-pointer accent-[#16845A] dark:accent-[#38A875]"
              aria-label="Điều chỉnh tốc độ góc ω"
            />
          </label>

          {/* Khối lượng m */}
          <label className="block rounded-xl border border-border bg-secondary/35 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Khối lượng vật m</span>
              <span className="font-mono font-bold tabular-nums text-[#16845A] dark:text-[#72CF91]">
                {params.mass.toFixed(1)} kg
              </span>
            </div>
            <input
              type="range"
              min={0.2}
              max={5.0}
              step={0.2}
              value={params.mass}
              onChange={(e) => setParams((p) => ({ ...p, mass: parseFloat(e.target.value) }))}
              className="mt-2 h-1.5 w-full cursor-pointer accent-[#16845A] dark:accent-[#38A875]"
              aria-label="Điều chỉnh khối lượng m"
            />
          </label>

          {/* Góc ban đầu φ₀ */}
          <label className="block rounded-xl border border-border bg-secondary/35 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Góc ban đầu φ₀</span>
              <span className="font-mono font-bold tabular-nums text-[#16845A] dark:text-[#72CF91]">
                {params.initialAngleDeg}°
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={330}
              step={15}
              value={params.initialAngleDeg}
              onChange={(e) =>
                setParams((p) => ({ ...p, initialAngleDeg: parseFloat(e.target.value) }))
              }
              className="mt-2 h-1.5 w-full cursor-pointer accent-[#16845A] dark:accent-[#38A875]"
              aria-label="Điều chỉnh góc ban đầu φ"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
