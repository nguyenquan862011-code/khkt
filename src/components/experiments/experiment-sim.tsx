/**
 * UI mô phỏng tương tác dùng chung cho trang chi tiết thí nghiệm:
 * thanh thông số → kết quả tính thật → scene SVG hoạt ảnh
 * (chạy / tạm dừng / đặt lại) + đồ thị chuỗi số liệu.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BarChart3, Pause, Play, RotateCcw } from "lucide-react";
import type { EngineDef, SimSeries } from "@/data/experiments/types";
import { fmt } from "@/data/experiments/engines";

interface ExperimentSimProps {
  engine: EngineDef;
  initialParams: Record<string, number>;
}

function MiniChart({ series }: { series: SimSeries[] }) {
  const s = series[0];
  if (!s || s.points.length < 2) return null;
  const xs = s.points.map((p) => p.x);
  const ys = s.points.map((p) => p.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys, 0);
  const yMax = Math.max(...ys);
  const w = 320;
  const h = 140;
  const pad = 28;
  const sx = (x: number) => pad + ((x - xMin) / Math.max(xMax - xMin, 1e-9)) * (w - pad * 2);
  const sy = (y: number) => h - pad - ((y - yMin) / Math.max(yMax - yMin, 1e-9)) * (h - pad * 2);
  const d = s.points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${fmt(sx(p.x))} ${fmt(sy(p.y))}`)
    .join(" ");
  return (
    <figure className="rounded-xl border border-[#2c4438] bg-[#0d2118] p-3">
      <figcaption className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-[#d7e7dc]">
        <BarChart3 className="size-3.5 text-[#5ec98d]" /> Đồ thị: {s.label}
      </figcaption>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label={`Đồ thị ${s.label}`}>
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#3c5a4a" strokeWidth={1} />
        <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="#3c5a4a" strokeWidth={1} />
        <path d={d} fill="none" stroke="#5ec98d" strokeWidth={2} />
        <text x={w - pad} y={h - 8} textAnchor="end" fontSize={9} fill="#9db8a8">
          {s.xLabel}
        </text>
        <text x={4} y={14} fontSize={9} fill="#9db8a8">
          {s.yLabel}
        </text>
      </svg>
    </figure>
  );
}

export function ExperimentSim({ engine, initialParams }: ExperimentSimProps) {
  const [params, setParams] = useState<Record<string, number>>(() => {
    const p: Record<string, number> = {};
    for (const def of engine.params) p[def.key] = initialParams[def.key] ?? def.default;
    return p;
  });
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);
  const rafRef = useRef<number | undefined>(undefined);
  const lastRef = useRef<number>(0);

  const duration = useMemo(() => engine.duration(params), [engine, params]);
  const outputs = useMemo(() => engine.compute(params), [engine, params]);
  const series = useMemo(() => (engine.series ? engine.series(params) : []), [engine, params]);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
      return;
    }
    lastRef.current = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - lastRef.current) / 1000, 0.1);
      lastRef.current = now;
      setT((prev) => (prev + dt > duration ? 0 : prev + dt));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, duration]);

  const updateParam = useCallback((key: string, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
    setT(0);
  }, []);

  const objects = engine.render(params, t);

  return (
    <div className="space-y-4">
      {/* Điều chỉnh thông số */}
      <div className="rounded-2xl border border-[#2c4438] bg-[#0d2118] p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-[#d7e7dc]">Điều chỉnh thông số</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#16845A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#126b48]"
            >
              {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              {playing ? "Tạm dừng" : "Chạy"}
            </button>
            <button
              type="button"
              onClick={() => {
                setT(0);
                setPlaying(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#2c4438] px-3 py-1.5 text-xs font-semibold text-[#d7e7dc] hover:bg-[#153325]"
            >
              <RotateCcw className="size-3.5" /> Đặt lại
            </button>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {engine.params.map((def) => (
            <label key={def.key} className="block text-xs text-[#9db8a8]">
              <span className="mb-1 flex items-baseline justify-between gap-2">
                <span>{def.label}</span>
                <span className="font-mono text-[#5ec98d]">
                  {fmt(params[def.key] ?? def.default, def.step < 1 ? 2 : 0)} {def.unit}
                </span>
              </span>
              <input
                type="range"
                min={def.min}
                max={def.max}
                step={def.step}
                value={params[def.key] ?? def.default}
                onChange={(e) => updateParam(def.key, Number(e.target.value))}
                className="w-full accent-[#16845A]"
              />
              <span className="flex justify-between text-[10px] text-[#5c7263]">
                <span>
                  {def.min} {def.unit}
                </span>
                <span>
                  {def.max} {def.unit}
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Scene */}
        <div className="rounded-2xl border border-[#2c4438] bg-[#0d2118] p-3">
          <svg viewBox="0 0 380 250" className="w-full" role="img" aria-label="Mô phỏng thí nghiệm">
            {objects.map((o, i) => {
              if (o.t === "circle")
                return (
                  <circle
                    key={i}
                    cx={o.cx}
                    cy={o.cy}
                    r={o.r}
                    fill={o.fill ?? "none"}
                    stroke={o.stroke}
                    strokeWidth={o.width}
                    opacity={o.opacity}
                  />
                );
              if (o.t === "rect")
                return (
                  <rect
                    key={i}
                    x={o.x}
                    y={o.y}
                    width={o.w}
                    height={o.h}
                    fill={o.fill ?? "none"}
                    stroke={o.stroke}
                    strokeWidth={o.width}
                    rx={o.rx}
                    opacity={o.opacity}
                  />
                );
              if (o.t === "line")
                return (
                  <line
                    key={i}
                    x1={o.x1}
                    y1={o.y1}
                    x2={o.x2}
                    y2={o.y2}
                    stroke={o.stroke ?? "#1d2b24"}
                    strokeWidth={o.width}
                    strokeDasharray={o.dash}
                    opacity={o.opacity}
                  />
                );
              if (o.t === "text")
                return (
                  <text
                    key={i}
                    x={o.x}
                    y={o.y}
                    fontSize={o.size ?? 11}
                    fill={o.fill ?? "#1d2b24"}
                    textAnchor={o.anchor}
                  >
                    {o.text}
                  </text>
                );
              return (
                <path
                  key={i}
                  d={o.d}
                  fill={o.fill ?? "none"}
                  stroke={o.stroke ?? "#1d2b24"}
                  strokeWidth={o.width}
                  opacity={o.opacity}
                />
              );
            })}
          </svg>
        </div>

        {/* Kết quả + đồ thị */}
        <div className="space-y-3">
          <div className="rounded-2xl border border-[#2c4438] bg-[#0d2118] p-4">
            <h3 className="mb-2 text-sm font-bold text-[#d7e7dc]">Kết quả tính toán</h3>
            <ul className="space-y-1.5">
              {outputs.map((o) => (
                <li key={o.label} className="flex items-baseline justify-between gap-2 text-xs">
                  <span className="text-[#9db8a8]">{o.label}</span>
                  <span className="font-mono font-semibold text-[#5ec98d]">
                    {typeof o.value === "number" ? fmt(o.value, 3) : o.value} {o.unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {series.length > 0 && <MiniChart series={series} />}
        </div>
      </div>
    </div>
  );
}
