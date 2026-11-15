import { useEffect, useRef, useState } from "react";
import { RotateCcw, Lightbulb, Info, Sliders } from "lucide-react";

interface SpectrumColor {
  name: string;
  color: string;
  glow: string;
  baseOffset: number;
}

interface PrismMaterial {
  id: "crown" | "flint" | "quartz";
  label: string;
  nBase: number;
  dispersionScale: number;
}

const PRISM_MATERIALS: PrismMaterial[] = [
  { id: "crown", label: "Thủy tinh Crown", nBase: 1.512, dispersionScale: 1.0 },
  { id: "flint", label: "Thủy tinh Flint", nBase: 1.615, dispersionScale: 1.75 },
  { id: "quartz", label: "Thạch anh", nBase: 1.456, dispersionScale: 0.72 },
];

const SPECTRUM_COLORS: SpectrumColor[] = [
  { name: "Đỏ", color: "#FF3344", glow: "rgba(255, 51, 68, 0.6)", baseOffset: 0.0 },
  { name: "Cam", color: "#FF8822", glow: "rgba(255, 136, 34, 0.6)", baseOffset: 0.004 },
  { name: "Vàng", color: "#FFDD22", glow: "rgba(255, 221, 34, 0.6)", baseOffset: 0.007 },
  { name: "Lục", color: "#33DD66", glow: "rgba(51, 221, 102, 0.6)", baseOffset: 0.012 },
  { name: "Lam", color: "#38A875", glow: "rgba(56, 168, 117, 0.6)", baseOffset: 0.017 },
  { name: "Chàm", color: "#3366FF", glow: "rgba(51, 102, 255, 0.6)", baseOffset: 0.023 },
  { name: "Tím", color: "#AA33FF", glow: "rgba(170, 51, 255, 0.6)", baseOffset: 0.031 },
];

function getRefractiveIndex(material: PrismMaterial, band: SpectrumColor): number {
  return material.nBase + band.baseOffset * material.dispersionScale;
}

function intersectRayWithSegment(
  origin: { x: number; y: number },
  dir: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
): { x: number; y: number; t: number } | null {
  const seg = { x: p2.x - p1.x, y: p2.y - p1.y };
  const denom = dir.x * seg.y - dir.y * seg.x;
  if (Math.abs(denom) < 1e-6) return null;
  const diff = { x: p1.x - origin.x, y: p1.y - origin.y };
  const t = (diff.x * seg.y - diff.y * seg.x) / denom;
  const u = (diff.x * dir.y - diff.y * dir.x) / denom;
  if (t > 1 && u >= 0 && u <= 1) {
    return {
      x: origin.x + dir.x * t,
      y: origin.y + dir.y * t,
      t,
    };
  }
  return null;
}

export function PrismDispersionExperiment() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [angleDeg, setAngleDeg] = useState<number>(48);
  const [materialId, setMaterialId] = useState<PrismMaterial["id"]>("crown");
  const [isBeamOn, setIsBeamOn] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showDeviationCurve, setShowDeviationCurve] = useState<boolean>(false);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  const activeMaterial = PRISM_MATERIALS.find((m) => m.id === materialId) ?? PRISM_MATERIALS[0]!;

  const resetSimulation = () => {
    setAngleDeg(48);
    setMaterialId("crown");
    setIsBeamOn(true);
    setShowLabels(true);
  };

  const calculatePrismPhysics = (n: number, i1Deg: number) => {
    const A = (60 * Math.PI) / 180;
    const i1 = (i1Deg * Math.PI) / 180;

    const sinR1 = Math.sin(i1) / n;
    if (Math.abs(sinR1) > 1) return null;
    const r1 = Math.asin(sinR1);
    const r2 = A - r1;

    const sinI2 = n * Math.sin(r2);
    if (Math.abs(sinI2) > 1) {
      return {
        r1Deg: (r1 * 180) / Math.PI,
        r2Deg: (r2 * 180) / Math.PI,
        i2Deg: null,
        deviationDeg: null,
        r1,
        r2,
        i2: null,
        totalInternalReflection: true,
      };
    }

    const i2 = Math.asin(sinI2);
    const D = i1 + i2 - A;

    return {
      r1Deg: (r1 * 180) / Math.PI,
      r2Deg: (r2 * 180) / Math.PI,
      i2Deg: (i2 * 180) / Math.PI,
      deviationDeg: (D * 180) / Math.PI,
      r1,
      r2,
      i2,
      totalInternalReflection: false,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const render = () => {
      if (!running) return;
      if (!prefersReducedMotion) {
        timeRef.current += 0.025;
      }

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width;
      const height = rect.height;

      if (width === 0 || height === 0) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // 1. Dark Optical Chamber Background
      ctx.fillStyle = "#070E0B";
      ctx.fillRect(0, 0, width, height);

      // Optical grid
      ctx.strokeStyle = "rgba(56, 168, 117, 0.06)";
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Equilateral Prism Geometry
      const cx = width * 0.46;
      const cy = height * 0.52;
      const prismSide = Math.min(width * 0.36, height * 0.64, 178);
      const hPrism = (prismSide * Math.sqrt(3)) / 2;

      const pTop = { x: cx, y: cy - hPrism * 0.62 };
      const pLeft = { x: cx - prismSide / 2, y: cy + hPrism * 0.38 };
      const pRight = { x: cx + prismSide / 2, y: cy + hPrism * 0.38 };

      const f1Vec = { x: pLeft.x - pTop.x, y: pLeft.y - pTop.y };
      const f1Len = Math.hypot(f1Vec.x, f1Vec.y);
      const n1 = { x: -f1Vec.y / f1Len, y: f1Vec.x / f1Len };

      const f2Vec = { x: pRight.x - pTop.x, y: pRight.y - pTop.y };

      const incidentPoint = {
        x: pTop.x + (pLeft.x - pTop.x) * 0.52,
        y: pTop.y + (pLeft.y - pTop.y) * 0.52,
      };

      // Glass Prism Body
      const prismGrad = ctx.createLinearGradient(pTop.x, pTop.y, pRight.x, pRight.y);
      prismGrad.addColorStop(0, "rgba(56, 168, 117, 0.18)");
      prismGrad.addColorStop(0.5, "rgba(200, 237, 120, 0.08)");
      prismGrad.addColorStop(1, "rgba(11, 21, 17, 0.45)");

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pTop.x, pTop.y);
      ctx.lineTo(pLeft.x, pLeft.y);
      ctx.lineTo(pRight.x, pRight.y);
      ctx.closePath();
      ctx.fillStyle = prismGrad;
      ctx.fill();

      ctx.strokeStyle = "rgba(56, 168, 117, 0.65)";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "#38A875";
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();

      if (showLabels) {
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = "rgba(237, 245, 237, 0.25)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(incidentPoint.x - n1.x * 46, incidentPoint.y - n1.y * 46);
        ctx.lineTo(incidentPoint.x + n1.x * 46, incidentPoint.y + n1.y * 46);
        ctx.stroke();
        ctx.restore();
      }

      if (isBeamOn) {
        const i1Rad = (angleDeg * Math.PI) / 180;
        const face1Angle = Math.atan2(f1Vec.y, f1Vec.x);
        const normal1Angle = face1Angle - Math.PI / 2;
        const incidentAngle = normal1Angle + Math.PI - i1Rad;

        const beamLen = Math.max(width * 0.36, 150);
        const sourcePoint = {
          x: incidentPoint.x - Math.cos(incidentAngle) * beamLen,
          y: incidentPoint.y - Math.sin(incidentAngle) * beamLen,
        };

        // Incoming white beam
        ctx.save();
        ctx.shadowColor = "#C8ED78";
        ctx.shadowBlur = 12;
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(sourcePoint.x, sourcePoint.y);
        ctx.lineTo(incidentPoint.x, incidentPoint.y);
        ctx.stroke();

        ctx.strokeStyle = "#C8ED78";
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.restore();

        // Subtle animated pulse dot along incoming beam
        if (!prefersReducedMotion) {
          const pulseT = (timeRef.current * 0.7) % 1;
          const px = sourcePoint.x + (incidentPoint.x - sourcePoint.x) * pulseT;
          const py = sourcePoint.y + (incidentPoint.y - sourcePoint.y) * pulseT;
          ctx.save();
          ctx.fillStyle = "#FFFFFF";
          ctx.shadowColor = "#C8ED78";
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // 4. Exact geometric ray paths inside prism & emergent spectrum
        const face2Angle = Math.atan2(f2Vec.y, f2Vec.x);
        const normal2Angle = face2Angle + Math.PI / 2;

        SPECTRUM_COLORS.forEach((item, index) => {
          const nVal = getRefractiveIndex(activeMaterial, item);
          const phys = calculatePrismPhysics(nVal, angleDeg);
          if (!phys) return;

          const refractedAngle = normal1Angle + phys.r1;
          const refractedDir = {
            x: Math.cos(refractedAngle),
            y: Math.sin(refractedAngle),
          };

          const exitHit =
            intersectRayWithSegment(incidentPoint, refractedDir, pTop, pRight) ??
            intersectRayWithSegment(incidentPoint, refractedDir, pLeft, pRight);

          if (!exitHit) return;

          // Ray path inside prism
          ctx.save();
          ctx.strokeStyle = item.color;
          ctx.lineWidth = 1.6;
          ctx.globalAlpha = 0.85;
          ctx.beginPath();
          ctx.moveTo(incidentPoint.x, incidentPoint.y);
          ctx.lineTo(exitHit.x, exitHit.y);
          ctx.stroke();
          ctx.restore();

          if (phys.totalInternalReflection || phys.i2 === null) {
            // Draw internal reflection downward toward prism base
            const reflectAngle = Math.atan2(refractedDir.y, refractedDir.x) + Math.PI * 0.6;
            const reflEnd = {
              x: exitHit.x + Math.cos(reflectAngle) * (prismSide * 0.45),
              y: exitHit.y + Math.sin(reflectAngle) * (prismSide * 0.45),
            };
            ctx.save();
            ctx.setLineDash([3, 3]);
            ctx.strokeStyle = item.color;
            ctx.globalAlpha = 0.55;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(exitHit.x, exitHit.y);
            ctx.lineTo(reflEnd.x, reflEnd.y);
            ctx.stroke();
            ctx.restore();
            return;
          }

          const emergentAngle = normal2Angle - phys.i2;
          if (showLabels && index === 0) {
            const f2Len = Math.hypot(f2Vec.x, f2Vec.y) || 1;
            const n2 = { x: f2Vec.y / f2Len, y: -f2Vec.x / f2Len };
            ctx.save();
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = "rgba(237, 245, 237, 0.25)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(exitHit.x - n2.x * 38, exitHit.y - n2.y * 38);
            ctx.lineTo(exitHit.x + n2.x * 38, exitHit.y + n2.y * 38);
            ctx.stroke();
            ctx.restore();
          }
          const emergentLen = Math.max(width * 0.46, 170);
          const targetPoint = {
            x: exitHit.x + Math.cos(emergentAngle) * emergentLen,
            y: exitHit.y + Math.sin(emergentAngle) * emergentLen,
          };

          ctx.save();
          ctx.shadowColor = item.color;
          ctx.shadowBlur = 9;
          ctx.strokeStyle = item.color;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(exitHit.x, exitHit.y);
          ctx.lineTo(targetPoint.x, targetPoint.y);
          ctx.stroke();
          ctx.restore();

          if (showLabels && (index === 0 || index === 3 || index === 6)) {
            ctx.save();
            ctx.font = '10px "JetBrains Mono", monospace';
            ctx.fillStyle = item.color;
            const labelX = Math.min(targetPoint.x - 10, width - 92);
            const labelY = Math.max(16, Math.min(targetPoint.y + 4, height - 14));
            ctx.fillText(`${item.name} (${nVal.toFixed(3)})`, labelX, labelY);
            ctx.restore();
          }
        });

        if (showLabels) {
          ctx.save();
          ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = "#EDF5ED";
          ctx.fillText(
            "Tia sáng trắng",
            Math.max(12, sourcePoint.x + 8),
            Math.max(20, sourcePoint.y - 10),
          );

          ctx.fillStyle = "#72CF91";
          ctx.fillText("Lăng kính A = 60°", pTop.x - 50, pTop.y - 12);

          ctx.fillStyle = "#C8ED78";
          ctx.fillText("Quang phổ tán sắc", Math.min(width * 0.67, width - 125), cy - 64);
          ctx.restore();
        }
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [angleDeg, activeMaterial, isBeamOn, showLabels]);

  const redN = getRefractiveIndex(activeMaterial, SPECTRUM_COLORS[0]!);
  const violetN = getRefractiveIndex(activeMaterial, SPECTRUM_COLORS[6]!);
  const redPhys = calculatePrismPhysics(redN, angleDeg);
  const violetPhys = calculatePrismPhysics(violetN, angleDeg);
  const hasTir =
    Boolean(redPhys?.totalInternalReflection) || Boolean(violetPhys?.totalInternalReflection);
  const dispersionAngle =
    redPhys && violetPhys && redPhys.deviationDeg !== null && violetPhys.deviationDeg !== null
      ? Math.abs(violetPhys.deviationDeg - redPhys.deviationDeg).toFixed(2)
      : "TIR";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-lg transition-colors">
      {/* Top Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-mono text-xs font-semibold tracking-wider text-foreground uppercase">
            Mô phỏng: Tán sắc ánh sáng qua lăng kính
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsBeamOn(!isBeamOn)}
            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              isBeamOn
                ? "bg-[#16845A]/15 dark:bg-[#38A875]/20 text-[#16845A] dark:text-[#72CF91] border border-[#16845A]/30 dark:border-[#38A875]/40"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
            title="Bật/Tắt chùm sáng"
          >
            <Lightbulb className="size-3" />
            <span>{isBeamOn ? "Tia sáng BẬT" : "Tia sáng TẮT"}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLabels(!showLabels)}
            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              showLabels
                ? "bg-[#C8ED78]/30 dark:bg-[#C8ED78]/20 text-[#075C40] dark:text-[#C8ED78] border border-[#C8ED78]/60 dark:border-[#C8ED78]/30 font-semibold"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
            title="Bật/Tắt nhãn chú thích"
          >
            <span>Nhãn</span>
          </button>

          <button
            type="button"
            onClick={resetSimulation}
            className="inline-flex items-center justify-center rounded-md bg-muted p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            title="Đặt lại mô phỏng"
            aria-label="Đặt lại mô phỏng"
          >
            <RotateCcw className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <div className="relative mt-3 h-[280px] sm:h-[320px] w-full overflow-hidden rounded-xl border border-black/20 bg-[#070E0B]">
        <canvas ref={canvasRef} className="size-full block" />

        {/* Live Physics Measurement Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 pointer-events-none">
          <div className="rounded-lg border border-white/10 bg-black/75 px-2.5 py-1 backdrop-blur-md">
            <span className="font-mono text-[10px] text-white/60">Góc tới: </span>
            <span className="font-mono text-xs font-semibold tabular-nums text-[#C8ED78]">
              {angleDeg}°
            </span>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/75 px-2.5 py-1 backdrop-blur-md">
            <span className="font-mono text-[10px] text-white/60">
              {hasTir ? "Trạng thái: " : "Góc tán sắc (ΔD): "}
            </span>
            <span className="font-mono text-xs font-semibold tabular-nums text-[#72CF91]">
              {hasTir ? "Phản xạ toàn phần" : `~${dispersionAngle}°`}
            </span>
          </div>
          <div className="hidden sm:block rounded-lg border border-white/10 bg-black/75 px-2.5 py-1 backdrop-blur-md">
            <span className="font-mono text-[10px] text-white/60">{activeMaterial.label}: </span>
            <span className="font-mono text-xs tabular-nums text-white">
              n = {redN.toFixed(3)} – {violetN.toFixed(3)}
            </span>
          </div>
        </div>
      </div>

      {/* Material Selector + Angle Slider */}
      <div className="mt-4 space-y-3 rounded-xl bg-secondary p-3.5 border border-border">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-medium text-foreground">Chất liệu lăng kính:</span>
          <div className="flex flex-wrap items-center gap-1 rounded-lg bg-background/70 p-1 border border-border">
            {PRISM_MATERIALS.map((mat) => (
              <button
                key={mat.id}
                type="button"
                onClick={() => setMaterialId(mat.id)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                  materialId === mat.id
                    ? "bg-[#16845A] dark:bg-[#38A875] text-white dark:text-[#0B1511] font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-border/70">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
            <label
              htmlFor="prism-angle-input"
              className="flex items-center gap-1.5 text-foreground"
            >
              <Sliders className="size-3.5 text-[#16845A] dark:text-[#38A875]" />
              Điều chỉnh góc tới chùm sáng (i₁):
            </label>
            <div className="flex items-center gap-1 tabular-nums">
              <button
                type="button"
                onClick={() => setAngleDeg((v) => Math.max(32, v - 1))}
                aria-label="Giảm góc tới 1 độ"
                className="size-6 rounded border border-border bg-card text-xs font-bold hover:bg-muted"
              >
                −
              </button>
              <input
                id="prism-angle-input"
                type="number"
                min={32}
                max={68}
                step={1}
                value={angleDeg}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!Number.isNaN(v)) setAngleDeg(Math.min(68, Math.max(32, v)));
                }}
                className="w-14 rounded border border-border bg-card px-1.5 py-0.5 text-center font-mono text-xs font-bold text-[#16845A] dark:text-[#72CF91]"
              />
              <button
                type="button"
                onClick={() => setAngleDeg((v) => Math.min(68, v + 1))}
                aria-label="Tăng góc tới 1 độ"
                className="size-6 rounded border border-border bg-card text-xs font-bold hover:bg-muted"
              >
                +
              </button>
              <span className="font-mono text-xs text-muted-foreground">°</span>
            </div>
          </div>

          <input
            type="range"
            min="32"
            max="68"
            step="1"
            value={angleDeg}
            onChange={(e) => setAngleDeg(parseInt(e.target.value, 10))}
            className="w-full accent-[#16845A] dark:accent-[#38A875] cursor-pointer"
            aria-label="Điều chỉnh góc tới chùm sáng i1"
          />

          <div className="flex items-center justify-between text-[11px] text-muted-foreground tabular-nums">
            <span>32° (Góc hẹp)</span>
            <span className="font-mono text-[10px]">sin(i₁) = n · sin(r₁)</span>
            <span>68° (Góc rộng)</span>
          </div>
        </div>

        {/* Full Tabular Optical Angles Readout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-border/70 pt-2.5 text-[11px] font-mono tabular-nums">
          <div className="rounded-lg bg-card border border-border/70 px-2.5 py-1.5">
            <span className="text-muted-foreground block">r₁ (Đỏ / Tím)</span>
            <span className="font-semibold text-foreground">
              {redPhys ? `${redPhys.r1Deg.toFixed(1)}°` : "—"} /{" "}
              {violetPhys ? `${violetPhys.r1Deg.toFixed(1)}°` : "—"}
            </span>
          </div>
          <div className="rounded-lg bg-card border border-border/70 px-2.5 py-1.5">
            <span className="text-muted-foreground block">r₂ (Đỏ / Tím)</span>
            <span className="font-semibold text-foreground">
              {redPhys ? `${redPhys.r2Deg.toFixed(1)}°` : "—"} /{" "}
              {violetPhys ? `${violetPhys.r2Deg.toFixed(1)}°` : "—"}
            </span>
          </div>
          <div className="rounded-lg bg-card border border-border/70 px-2.5 py-1.5">
            <span className="text-muted-foreground block">Góc ló i₂ (Đỏ)</span>
            <span className="font-semibold text-[#FF6677]">
              {redPhys?.i2Deg !== null && redPhys?.i2Deg !== undefined
                ? `${redPhys.i2Deg.toFixed(1)}°`
                : "TIR"}
            </span>
          </div>
          <div className="rounded-lg bg-card border border-border/70 px-2.5 py-1.5">
            <span className="text-muted-foreground block">Góc lệch D (Đỏ / Tím)</span>
            <span className="font-semibold text-[#16845A] dark:text-[#C8ED78]">
              {redPhys?.deviationDeg !== null && redPhys?.deviationDeg !== undefined
                ? `${redPhys.deviationDeg.toFixed(1)}°`
                : "TIR"}{" "}
              /{" "}
              {violetPhys?.deviationDeg !== null && violetPhys?.deviationDeg !== undefined
                ? `${violetPhys.deviationDeg.toFixed(1)}°`
                : "TIR"}
            </span>
          </div>
        </div>
      </div>

      {/* Deviation Curve Toggle + Physics Explanation Dropdown */}
      <div className="mt-3 space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setShowDeviationCurve((v) => !v)}
            className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
          >
            <span>Đồ thị góc lệch D(i₁)</span>
            <span className="text-[11px] text-muted-foreground">
              {showDeviationCurve ? "Ẩn đồ thị" : "Xem đồ thị"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Info className="size-3.5 text-[#16845A] dark:text-[#38A875]" />
              Bản chất tán sắc ánh sáng
            </span>
            <span className="text-[11px] text-muted-foreground">
              {showExplanation ? "Ẩn bớt" : "Xem chi tiết"}
            </span>
          </button>
        </div>

        {showDeviationCurve && (
          <div className="rounded-xl border border-border bg-[#070E0B] p-3">
            <div className="text-[11px] font-mono text-[#72CF91] mb-1">
              Đường cong D(i₁) cho tia Đỏ và Tím ({activeMaterial.label})
            </div>
            <svg viewBox="0 0 360 110" className="w-full h-24 physics-raw">
              <line x1="24" y1="92" x2="345" y2="92" stroke="#2B4033" />
              {[
                { band: SPECTRUM_COLORS[0]!, stroke: "#FF4455" },
                { band: SPECTRUM_COLORS[6]!, stroke: "#AA55FF" },
              ].map(({ band, stroke }) => {
                const n = getRefractiveIndex(activeMaterial, band);
                const pts: string[] = [];
                for (let deg = 32; deg <= 68; deg += 2) {
                  const res = calculatePrismPhysics(n, deg);
                  if (res && res.deviationDeg !== null) {
                    const px = 28 + ((deg - 32) / 36) * 310;
                    const py = 90 - Math.min(72, Math.max(0, (res.deviationDeg - 34) * 2.8));
                    pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
                  }
                }
                return pts.length > 1 ? (
                  <polyline
                    key={band.name}
                    points={pts.join(" ")}
                    fill="none"
                    stroke={stroke}
                    strokeWidth="1.8"
                  />
                ) : null;
              })}
              <line
                x1={28 + ((angleDeg - 32) / 36) * 310}
                y1="14"
                x2={28 + ((angleDeg - 32) / 36) * 310}
                y2="92"
                stroke="#C8ED78"
                strokeDasharray="3 3"
              />
              <text x="28" y="104" fill="#A5B7A8" fontSize="9" fontFamily="monospace">
                i₁=32°
              </text>
              <text x="305" y="104" fill="#A5B7A8" fontSize="9" fontFamily="monospace">
                68°
              </text>
            </svg>
          </div>
        )}

        {showExplanation && (
          <div className="space-y-2 rounded-lg border border-border bg-secondary p-3 text-xs leading-relaxed text-muted-foreground">
            <p>
              • <strong className="text-foreground">Chiết suất phụ thuộc bước sóng:</strong> Với
              cùng một môi trường trong suốt, chiết suất biến thiên tăng dần từ ánh sáng Đỏ (bước
              sóng dài nhất) đến ánh sáng Tím (bước sóng ngắn nhất). Thủy tinh Flint có độ tán sắc
              mạnh hơn Crown nên tách chùm sáng rộng hơn.
            </p>
            <p>
              • <strong className="text-foreground">Góc lệch D:</strong> Theo công thức lăng kính D
              = i₁ + i₂ - A, vì n(tím) &gt; n(đỏ) nên tia Tím bị lệch nhiều nhất về phía đáy lăng
              kính, tạo nên dải màu cầu vồng liên tục.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
