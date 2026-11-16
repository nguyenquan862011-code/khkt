/**
 * 16 engine mô phỏng dùng chung cho thư viện thí nghiệm.
 * Mỗi engine: tính kết quả vật lý thật từ thông số, dựng scene SVG
 * theo thời gian, sinh chuỗi số liệu cho đồ thị.
 */
import type { EngineDef, SceneObject, SimSeries } from "./types";

const INK = "#1d2b24";
const MUTED = "#5c6f66";
const AMBER = "#d97706";
const GREEN = "#16845A";
const RED = "#c0392b";
const BLUE = "#2563eb";

export function fmt(v: number, digits = 2): string {
  if (!Number.isFinite(v)) return "—";
  const rounded = Number(v.toFixed(digits));
  return String(rounded);
}

function arrow(x1: number, y1: number, x2: number, y2: number, color: string): SceneObject[] {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = 7;
  const hx1 = x2 - head * Math.cos(angle - 0.45);
  const hy1 = y2 - head * Math.sin(angle - 0.45);
  const hx2 = x2 - head * Math.cos(angle + 0.45);
  const hy2 = y2 - head * Math.sin(angle + 0.45);
  return [
    { t: "line", x1, y1, x2, y2, stroke: color, width: 1.6 },
    {
      t: "path",
      d: `M ${fmt(x2)} ${fmt(y2)} L ${fmt(hx1)} ${fmt(hy1)} M ${fmt(x2)} ${fmt(y2)} L ${fmt(hx2)} ${fmt(hy2)}`,
      stroke: color,
      width: 1.6,
    },
  ];
}

function seriesOf(
  label: string,
  xLabel: string,
  yLabel: string,
  points: { x: number; y: number }[],
): SimSeries[] {
  return [{ label, points, xLabel, yLabel }];
}

export const ENGINES: Record<string, EngineDef> = {
  // 1. Rơi tự do — h = h0 − ½gt²
  freefall: {
    id: "freefall",
    params: [
      {
        key: "h0",
        label: "Chiều cao thả h₀",
        unit: "m",
        min: 0.5,
        max: 20,
        step: 0.5,
        default: 10,
      },
      {
        key: "g",
        label: "Gia tốc trọng trường g",
        unit: "m/s²",
        min: 1.6,
        max: 24,
        step: 0.1,
        default: 9.8,
      },
    ],
    compute: (p) => {
      const h0 = p["h0"] ?? 10;
      const g = p["g"] ?? 9.8;
      const t = Math.sqrt((2 * h0) / g);
      return [
        { label: "Thời gian rơi t", value: t, unit: "s" },
        { label: "Vận tốc chạm đất v", value: g * t, unit: "m/s" },
        { label: "Động năng cuối (m=1kg)", value: 0.5 * g * t * (g * t), unit: "J" },
      ];
    },
    series: (p) => {
      const h0 = p["h0"] ?? 10;
      const g = p["g"] ?? 9.8;
      const tEnd = Math.sqrt((2 * h0) / g);
      const points = [];
      for (let i = 0; i <= 40; i += 1) {
        const t = (tEnd * i) / 40;
        points.push({ x: t, y: h0 - 0.5 * g * t * t });
      }
      return seriesOf("h(t)", "t (s)", "h (m)", points);
    },
    render: (p, t): SceneObject[] => {
      const h0 = p["h0"] ?? 10;
      const g = p["g"] ?? 9.8;
      const tEnd = Math.sqrt((2 * h0) / g);
      const tc = Math.min(t, tEnd);
      const h = h0 - 0.5 * g * tc * tc;
      const scale = 170 / Math.max(h0, 1);
      const groundY = 210;
      const ballY = groundY - h * scale;
      const out: SceneObject[] = [
        { t: "line", x1: 60, y1: groundY, x2: 320, y2: groundY, stroke: INK, width: 2 },
        {
          t: "line",
          x1: 120,
          y1: groundY - h0 * scale,
          x2: 120,
          y2: groundY,
          stroke: MUTED,
          width: 1,
          dash: "4 4",
        },
        { t: "circle", cx: 120, cy: ballY, r: 9, fill: AMBER, stroke: INK, width: 1 },
        { t: "text", x: 140, y: 26, text: `h = ${fmt(h)} m`, size: 12, fill: INK },
        { t: "text", x: 140, y: 44, text: `v = ${fmt(g * tc)} m/s`, size: 12, fill: BLUE },
        {
          t: "text",
          x: 60,
          y: 232,
          text: `t = ${fmt(tc)} s / ${fmt(tEnd)} s`,
          size: 11,
          fill: MUTED,
        },
      ];
      return out;
    },
    duration: (p) =>
      Math.min(8, Math.max(2, Math.sqrt((2 * (p["h0"] ?? 10)) / (p["g"] ?? 9.8)) * 2)),
  },

  // 2. Ném xiên — quỹ đạo parabol
  projectile: {
    id: "projectile",
    params: [
      { key: "v0", label: "Vận tốc đầu v₀", unit: "m/s", min: 5, max: 60, step: 1, default: 25 },
      { key: "theta", label: "Góc ném θ", unit: "°", min: 10, max: 80, step: 1, default: 45 },
      {
        key: "g",
        label: "Gia tốc trọng trường g",
        unit: "m/s²",
        min: 1.6,
        max: 24,
        step: 0.1,
        default: 9.8,
      },
    ],
    compute: (p) => {
      const v0 = p["v0"] ?? 25;
      const th = ((p["theta"] ?? 45) * Math.PI) / 180;
      const g = p["g"] ?? 9.8;
      const T = (2 * v0 * Math.sin(th)) / g;
      return [
        { label: "Tầm bay xa", value: (v0 * v0 * Math.sin(2 * th)) / g, unit: "m" },
        { label: "Độ cao cực đại", value: (v0 * v0 * Math.sin(th) ** 2) / (2 * g), unit: "m" },
        { label: "Thời gian bay", value: T, unit: "s" },
      ];
    },
    series: (p) => {
      const v0 = p["v0"] ?? 25;
      const th = ((p["theta"] ?? 45) * Math.PI) / 180;
      const g = p["g"] ?? 9.8;
      const R = (v0 * v0 * Math.sin(2 * th)) / g;
      const points = [];
      for (let i = 0; i <= 40; i += 1) {
        const x = (R * i) / 40;
        points.push({ x, y: x * Math.tan(th) - (g * x * x) / (2 * v0 * v0 * Math.cos(th) ** 2) });
      }
      return seriesOf("y(x)", "x (m)", "y (m)", points);
    },
    render: (p, t): SceneObject[] => {
      const v0 = p["v0"] ?? 25;
      const th = ((p["theta"] ?? 45) * Math.PI) / 180;
      const g = p["g"] ?? 9.8;
      const T = (2 * v0 * Math.sin(th)) / g;
      const tc = Math.min(t, T);
      const x = v0 * Math.cos(th) * tc;
      const y = v0 * Math.sin(th) * tc - 0.5 * g * tc * tc;
      const R = (v0 * v0 * Math.sin(2 * th)) / g;
      const sx = 300 / Math.max(R, 1);
      const sy = 160 / Math.max((v0 * v0 * Math.sin(th) ** 2) / (2 * g), 1);
      const s = Math.min(sx, sy);
      const out: SceneObject[] = [
        { t: "line", x1: 40, y1: 210, x2: 340, y2: 210, stroke: INK, width: 2 },
        { t: "circle", cx: 40 + x * s, cy: 210 - y * s, r: 7, fill: AMBER, stroke: INK, width: 1 },
        { t: "text", x: 60, y: 26, text: `x = ${fmt(x)} m · y = ${fmt(y)} m`, size: 12, fill: INK },
        {
          t: "text",
          x: 60,
          y: 232,
          text: `R = ${fmt(R)} m · H = ${fmt((v0 * v0 * Math.sin(th) ** 2) / (2 * g))} m`,
          size: 11,
          fill: MUTED,
        },
      ];
      const pts: string[] = [];
      for (let i = 0; i <= 30; i += 1) {
        const px = (R * i) / 30;
        const py = px * Math.tan(th) - (g * px * px) / (2 * v0 * v0 * Math.cos(th) ** 2);
        pts.push(`${fmt(40 + px * s)},${fmt(210 - py * s)}`);
      }
      out.push({ t: "path", d: `M ${pts.join(" L ")}`, stroke: MUTED, width: 1, opacity: 0.6 });
      return out;
    },
    duration: () => 8,
  },

  // 3. Con lắc đơn — T = 2π√(L/g)
  pendulum: {
    id: "pendulum",
    params: [
      { key: "L", label: "Chiều dài dây L", unit: "m", min: 0.2, max: 4, step: 0.1, default: 1 },
      {
        key: "g",
        label: "Gia tốc trọng trường g",
        unit: "m/s²",
        min: 1.6,
        max: 24,
        step: 0.1,
        default: 9.8,
      },
      { key: "theta0", label: "Biên độ góc θ₀", unit: "°", min: 5, max: 40, step: 1, default: 15 },
    ],
    compute: (p) => {
      const L = p["L"] ?? 1;
      const g = p["g"] ?? 9.8;
      const T = 2 * Math.PI * Math.sqrt(L / g);
      return [
        { label: "Chu kỳ T", value: T, unit: "s" },
        { label: "Tần số f", value: 1 / T, unit: "Hz" },
        {
          label: "Chu kỳ trên Sao Hỏa (g=3.7)",
          value: 2 * Math.PI * Math.sqrt(L / 3.7),
          unit: "s",
        },
      ];
    },
    series: (p) => {
      const L = p["L"] ?? 1;
      const g = p["g"] ?? 9.8;
      const th0 = ((p["theta0"] ?? 15) * Math.PI) / 180;
      const om = Math.sqrt(g / L);
      const points = [];
      for (let i = 0; i <= 60; i += 1) {
        const t = (i / 60) * 4 * Math.PI;
        points.push({ x: t, y: (th0 * Math.cos(om * t) * 180) / Math.PI });
      }
      return seriesOf("θ(t)", "t (s)", "θ (°)", points);
    },
    render: (p, t): SceneObject[] => {
      const L = p["L"] ?? 1;
      const g = p["g"] ?? 9.8;
      const th0 = ((p["theta0"] ?? 15) * Math.PI) / 180;
      const th = th0 * Math.cos(Math.sqrt(g / L) * t);
      const px = 190 + 140 * Math.sin(th);
      const py = 40 + 140 * Math.cos(th);
      const out: SceneObject[] = [
        { t: "line", x1: 160, y1: 40, x2: 220, y2: 40, stroke: INK, width: 3 },
        { t: "line", x1: 190, y1: 40, x2: px, y2: py, stroke: INK, width: 1.6 },
        { t: "circle", cx: px, cy: py, r: 11, fill: AMBER, stroke: INK, width: 1 },
        {
          t: "text",
          x: 40,
          y: 26,
          text: `θ = ${fmt((th * 180) / Math.PI, 1)}°`,
          size: 12,
          fill: INK,
        },
        {
          t: "text",
          x: 40,
          y: 232,
          text: `T = ${fmt(2 * Math.PI * Math.sqrt(L / g))} s · L = ${fmt(L)} m`,
          size: 11,
          fill: MUTED,
        },
      ];
      return out;
    },
    duration: (p) =>
      Math.min(10, Math.max(3, 2 * Math.PI * Math.sqrt((p["L"] ?? 1) / (p["g"] ?? 9.8)) * 1.5)),
  },

  // 4. Lò xo — T = 2π√(m/k)
  spring: {
    id: "spring",
    params: [
      { key: "m", label: "Khối lượng m", unit: "kg", min: 0.2, max: 5, step: 0.1, default: 1 },
      { key: "k", label: "Độ cứng k", unit: "N/m", min: 1, max: 100, step: 1, default: 20 },
      { key: "A", label: "Biên độ A", unit: "m", min: 0.05, max: 0.5, step: 0.01, default: 0.2 },
    ],
    compute: (p) => {
      const m = p["m"] ?? 1;
      const k = p["k"] ?? 20;
      const A = p["A"] ?? 0.2;
      const T = 2 * Math.PI * Math.sqrt(m / k);
      return [
        { label: "Chu kỳ T", value: T, unit: "s" },
        { label: "Tần số f", value: 1 / T, unit: "Hz" },
        { label: "Năng lượng dao động E", value: 0.5 * k * A * A, unit: "J" },
      ];
    },
    series: (p) => {
      const m = p["m"] ?? 1;
      const k = p["k"] ?? 20;
      const A = p["A"] ?? 0.2;
      const om = Math.sqrt(k / m);
      const points = [];
      for (let i = 0; i <= 60; i += 1) {
        const t = (i / 60) * 4 * Math.PI;
        points.push({ x: t, y: A * Math.cos(om * t) });
      }
      return seriesOf("x(t)", "t (s)", "x (m)", points);
    },
    render: (p, t): SceneObject[] => {
      const m = p["m"] ?? 1;
      const k = p["k"] ?? 20;
      const A = p["A"] ?? 0.2;
      const x = A * Math.cos(Math.sqrt(k / m) * t);
      const coils = 8;
      const baseX = 60;
      const px = 220 + x * 120;
      const d: string[] = [`M ${baseX} 110`];
      for (let i = 1; i <= coils; i += 1) {
        const cx = baseX + ((px - 24 - baseX) * i) / coils;
        d.push(`L ${fmt(cx)} ${i % 2 === 0 ? 110 : 92}`);
      }
      d.push(`L ${fmt(px - 24)} 110`);
      const out: SceneObject[] = [
        { t: "rect", x: 20, y: 70, w: 16, h: 80, fill: "#2c3a33", rx: 3 },
        { t: "path", d: d.join(" "), stroke: MUTED, width: 2 },
        { t: "rect", x: px - 24, y: 82, w: 48, h: 56, fill: AMBER, stroke: INK, width: 1, rx: 4 },
        { t: "text", x: 40, y: 26, text: `x = ${fmt(x, 3)} m`, size: 12, fill: INK },
        {
          t: "text",
          x: 40,
          y: 232,
          text: `m = ${fmt(m)} kg · k = ${fmt(k)} N/m · T = ${fmt(2 * Math.PI * Math.sqrt(m / k))} s`,
          size: 11,
          fill: MUTED,
        },
      ];
      return out;
    },
    duration: (p) =>
      Math.min(10, Math.max(3, 2 * Math.PI * Math.sqrt((p["m"] ?? 1) / (p["k"] ?? 20)) * 2)),
  },

  // 5. Mặt nghiêng — a = g(sinθ − μcosθ)
  inclined: {
    id: "inclined",
    params: [
      { key: "theta", label: "Góc nghiêng θ", unit: "°", min: 5, max: 60, step: 1, default: 30 },
      { key: "mu", label: "Hệ số ma sát μ", unit: "", min: 0, max: 0.8, step: 0.01, default: 0.2 },
      { key: "m", label: "Khối lượng m", unit: "kg", min: 0.5, max: 10, step: 0.1, default: 2 },
    ],
    compute: (p) => {
      const th = ((p["theta"] ?? 30) * Math.PI) / 180;
      const mu = p["mu"] ?? 0.2;
      const g = 9.8;
      const a = g * (Math.sin(th) - mu * Math.cos(th));
      return [
        { label: "Gia tốc a", value: a, unit: "m/s²" },
        { label: "Lực ma sát", value: mu * (p["m"] ?? 2) * g * Math.cos(th), unit: "N" },
        {
          label: "Thành phần trọng lực song song",
          value: (p["m"] ?? 2) * g * Math.sin(th),
          unit: "N",
        },
      ];
    },
    render: (p, t): SceneObject[] => {
      const th = ((p["theta"] ?? 30) * Math.PI) / 180;
      const mu = p["mu"] ?? 0.2;
      const g = 9.8;
      const a = g * (Math.sin(th) - mu * Math.cos(th));
      const s = Math.min(0.5 * a * t * t, 1.2);
      const lx = 40 + s * 180 * Math.cos(th);
      const ly = 200 - s * 180 * Math.sin(th);
      const out: SceneObject[] = [
        { t: "line", x1: 40, y1: 200, x2: 300, y2: 200, stroke: INK, width: 2 },
        {
          t: "path",
          d: `M 40 200 L 300 200 L 300 ${fmt(200 - 260 * Math.tan(th))} Z`,
          fill: "#e3ece6",
          stroke: MUTED,
          width: 1,
        },
        {
          t: "rect",
          x: lx - 18,
          y: ly - 30,
          w: 36,
          h: 26,
          fill: AMBER,
          stroke: INK,
          width: 1,
          rx: 3,
        },
        {
          t: "text",
          x: 40,
          y: 26,
          text: `a = ${fmt(a)} m/s²`,
          size: 12,
          fill: a >= 0 ? GREEN : RED,
        },
        {
          t: "text",
          x: 40,
          y: 232,
          text: `θ = ${fmt(p["theta"] ?? 30, 0)}° · μ = ${fmt(mu)}`,
          size: 11,
          fill: MUTED,
        },
      ];
      return out;
    },
    duration: () => 6,
  },

  // 6. Chuyển động tròn đều — a = v²/r
  circular: {
    id: "circular",
    params: [
      { key: "v", label: "Vận tốc v", unit: "m/s", min: 2, max: 30, step: 0.5, default: 10 },
      { key: "r", label: "Bán kính r", unit: "m", min: 1, max: 10, step: 0.1, default: 4 },
      { key: "m", label: "Khối lượng m", unit: "kg", min: 0.5, max: 10, step: 0.1, default: 2 },
    ],
    compute: (p) => {
      const v = p["v"] ?? 10;
      const r = p["r"] ?? 4;
      const m = p["m"] ?? 2;
      return [
        { label: "Gia tốc hướng tâm", value: (v * v) / r, unit: "m/s²" },
        { label: "Lực hướng tâm", value: (m * v * v) / r, unit: "N" },
        { label: "Chu kỳ quay", value: (2 * Math.PI * r) / v, unit: "s" },
      ];
    },
    render: (p, t): SceneObject[] => {
      const v = p["v"] ?? 10;
      const r = p["r"] ?? 4;
      const om = v / r;
      const ang = om * t;
      const cx = 190;
      const cy = 130;
      const R = 85;
      const bx = cx + R * Math.cos(ang);
      const by = cy + R * Math.sin(ang);
      const out: SceneObject[] = [
        { t: "circle", cx, cy, r: R, fill: "none", stroke: MUTED, width: 1, opacity: 0.5 },
        { t: "circle", cx, cy, r: 3, fill: INK },
        { t: "circle", cx: bx, cy: by, r: 9, fill: AMBER, stroke: INK, width: 1 },
        ...arrow(bx, by, cx, cy, RED),
        { t: "text", x: 40, y: 26, text: `a = ${fmt((v * v) / r)} m/s²`, size: 12, fill: INK },
        {
          t: "text",
          x: 40,
          y: 232,
          text: `v = ${fmt(v)} m/s · r = ${fmt(r)} m · T = ${fmt((2 * Math.PI * r) / v)} s`,
          size: 11,
          fill: MUTED,
        },
      ];
      return out;
    },
    duration: (p) =>
      Math.min(10, Math.max(3, ((2 * Math.PI * (p["r"] ?? 4)) / (p["v"] ?? 10)) * 2)),
  },

  // 7. Sóng cơ — v = λf
  wave: {
    id: "wave",
    params: [
      { key: "A", label: "Biên độ A", unit: "m", min: 0.05, max: 1, step: 0.05, default: 0.4 },
      { key: "lambda", label: "Bước sóng λ", unit: "m", min: 0.1, max: 4, step: 0.05, default: 1 },
      { key: "f", label: "Tần số f", unit: "Hz", min: 0.2, max: 5, step: 0.1, default: 1.5 },
    ],
    compute: (p) => {
      const lam = p["lambda"] ?? 1;
      const f = p["f"] ?? 1.5;
      return [
        { label: "Vận tốc truyền sóng v", value: lam * f, unit: "m/s" },
        { label: "Chu kỳ T", value: 1 / f, unit: "s" },
        { label: "Năng lượng ∝ A²", value: (p["A"] ?? 0.4) ** 2, unit: "m²" },
      ];
    },
    series: (p) => {
      const A = p["A"] ?? 0.4;
      const lam = p["lambda"] ?? 1;
      const f = p["f"] ?? 1.5;
      const points = [];
      for (let i = 0; i <= 80; i += 1) {
        const x = (i / 80) * 4;
        points.push({ x, y: A * Math.sin((2 * Math.PI * (x / lam - f * 0.25)) as number) });
      }
      return seriesOf("y(x, t₀)", "x (m)", "y (m)", points);
    },
    render: (p, t): SceneObject[] => {
      const A = p["A"] ?? 0.4;
      const lam = p["lambda"] ?? 1;
      const f = p["f"] ?? 1.5;
      const pts: string[] = [];
      for (let i = 0; i <= 60; i += 1) {
        const x = (i / 60) * 4;
        const y = A * Math.sin(2 * Math.PI * (x / lam - f * t));
        pts.push(`${fmt(50 + x * 70)},${fmt(130 - y * 60)}`);
      }
      const out: SceneObject[] = [
        { t: "line", x1: 50, y1: 130, x2: 330, y2: 130, stroke: MUTED, width: 1, dash: "3 3" },
        { t: "path", d: `M ${pts.join(" L ")}`, stroke: BLUE, width: 2 },
        { t: "text", x: 40, y: 26, text: `v = λf = ${fmt(lam * f)} m/s`, size: 12, fill: INK },
        {
          t: "text",
          x: 40,
          y: 232,
          text: `λ = ${fmt(lam)} m · f = ${fmt(f)} Hz · A = ${fmt(A)} m`,
          size: 11,
          fill: MUTED,
        },
      ];
      return out;
    },
    duration: (p) => Math.min(10, Math.max(3, 2 / (p["f"] ?? 1.5))),
  },

  // 8. Mạch điện Ôm — I = U/R
  "ohm-circuit": {
    id: "ohm-circuit",
    params: [
      { key: "U", label: "Điện áp U", unit: "V", min: 1, max: 24, step: 0.5, default: 12 },
      { key: "R", label: "Điện trở R", unit: "Ω", min: 1, max: 50, step: 0.5, default: 10 },
    ],
    compute: (p) => {
      const U = p["U"] ?? 12;
      const R = p["R"] ?? 10;
      return [
        { label: "Cường độ dòng điện I", value: U / R, unit: "A" },
        { label: "Công suất tiêu thụ P", value: (U * U) / R, unit: "W" },
        { label: "Điện năng trong 10 s", value: ((U * U) / R) * 10, unit: "J" },
      ];
    },
    render: (p, t): SceneObject[] => {
      const U = p["U"] ?? 12;
      const R = p["R"] ?? 10;
      const I = U / R;
      const out: SceneObject[] = [
        { t: "rect", x: 60, y: 60, w: 240, h: 120, fill: "none", stroke: INK, width: 2, rx: 8 },
        { t: "rect", x: 150, y: 46, w: 60, h: 28, fill: "#2c3a33", rx: 4 },
        {
          t: "text",
          x: 180,
          y: 65,
          text: `R = ${fmt(R)} Ω`,
          size: 11,
          fill: "#fff",
          anchor: "middle",
        },
        { t: "rect", x: 46, y: 105, w: 28, h: 30, fill: AMBER, rx: 3 },
        { t: "text", x: 60, y: 125, text: `${fmt(U, 1)}V`, size: 10, fill: INK, anchor: "middle" },
        { t: "text", x: 130, y: 26, text: `I = U/R = ${fmt(I)} A`, size: 12, fill: INK },
        { t: "text", x: 130, y: 226, text: `P = UI = ${fmt(U * I)} W`, size: 11, fill: MUTED },
      ];
      for (let i = 0; i < 5; i += 1) {
        const prog = (((t * I * 2 + i / 5) % 1) + 1) % 1;
        const seg = Math.floor(prog * 4);
        const frac = prog * 4 - seg;
        let cx = 60;
        let cy = 60;
        if (seg === 0) {
          cx = 60 + frac * 240;
          cy = 60;
        } else if (seg === 1) {
          cx = 300;
          cy = 60 + frac * 120;
        } else if (seg === 2) {
          cx = 300 - frac * 240;
          cy = 180;
        } else {
          cx = 60;
          cy = 180 - frac * 120;
        }
        out.push({ t: "circle", cx, cy, r: 5, fill: BLUE });
      }
      return out;
    },
    duration: () => 6,
  },

  // 9. Thấu kính hội tụ — 1/v = 1/f − 1/u
  lens: {
    id: "lens",
    params: [
      { key: "f", label: "Tiêu cự f", unit: "cm", min: 5, max: 30, step: 0.5, default: 12 },
      { key: "a", label: "Khoảng cách vật u", unit: "cm", min: 8, max: 50, step: 0.5, default: 20 },
    ],
    compute: (p) => {
      const f = p["f"] ?? 12;
      const u = p["a"] ?? 20;
      const v = 1 / (1 / f - 1 / u);
      return [
        { label: "Khoảng cách ảnh v", value: v, unit: "cm" },
        { label: "Độ phóng đại k = v/u", value: v / u, unit: "" },
        {
          label: "Loại ảnh",
          value: v > 0 ? 1 : 0,
          unit: v > 0 ? "ảnh thật, ngược" : "ảnh ảo, cùng chiều",
        },
      ];
    },
    series: (p) => {
      const f = p["f"] ?? 12;
      const points = [];
      for (let u = 8; u <= 50; u += 1) {
        const v = 1 / (1 / f - 1 / u);
        if (Number.isFinite(v) && Math.abs(v) < 200) points.push({ x: u, y: v });
      }
      return seriesOf("v(u)", "u (cm)", "v (cm)", points);
    },
    render: (p): SceneObject[] => {
      const f = p["f"] ?? 12;
      const u = p["a"] ?? 20;
      const v = 1 / (1 / f - 1 / u);
      const axisY = 130;
      const lensX = 190;
      const scale = 3;
      const objX = lensX - u * scale * 0.6;
      const imgX = lensX + v * scale * 0.6;
      const out: SceneObject[] = [
        { t: "line", x1: 30, y1: axisY, x2: 350, y2: axisY, stroke: MUTED, width: 1, dash: "4 4" },
        {
          t: "path",
          d: `M ${lensX} ${axisY - 70} Q ${lensX + 18} ${axisY} ${lensX} ${axisY + 70} Q ${lensX - 18} ${axisY} ${lensX} ${axisY - 70}`,
          fill: "#bcd6c7",
          stroke: INK,
          width: 1.5,
        },
        ...arrow(objX, axisY, objX, axisY - 55, GREEN),
        { t: "text", x: objX, y: axisY + 24, text: "Vật", size: 11, fill: GREEN, anchor: "middle" },
        {
          t: "text",
          x: 130,
          y: 26,
          text: `u = ${fmt(u)} cm · f = ${fmt(f)} cm`,
          size: 12,
          fill: INK,
        },
        {
          t: "text",
          x: 130,
          y: 232,
          text: `v = ${fmt(v)} cm · k = ${fmt(v / u)}`,
          size: 11,
          fill: MUTED,
        },
      ];
      if (Number.isFinite(v) && Math.abs(imgX) < 330 && Math.abs(v) > 0.1) {
        const imgH = (v / u) * 55;
        out.push(...arrow(imgX, axisY, imgX, axisY + imgH, RED));
        out.push({
          t: "text",
          x: imgX,
          y: axisY + imgH + (imgH > 0 ? 16 : -10),
          text: "Ảnh",
          size: 11,
          fill: RED,
          anchor: "middle",
        });
      }
      return out;
    },
    duration: () => 8,
  },

  // 10. Nở dài vì nhiệt — ΔL = L₀·α·ΔT
  thermal: {
    id: "thermal",
    params: [
      {
        key: "L0",
        label: "Chiều dài ban đầu L₀",
        unit: "m",
        min: 0.2,
        max: 2,
        step: 0.1,
        default: 1,
      },
      {
        key: "alpha",
        label: "Hệ số giãn nở α",
        unit: "×10⁻⁵ /°C",
        min: 0.5,
        max: 3,
        step: 0.1,
        default: 2.3,
      },
      {
        key: "dT",
        label: "Chênh lệch nhiệt độ ΔT",
        unit: "°C",
        min: 5,
        max: 300,
        step: 5,
        default: 100,
      },
    ],
    compute: (p) => {
      const L0 = p["L0"] ?? 1;
      const alpha = (p["alpha"] ?? 2.3) * 1e-5;
      const dT = p["dT"] ?? 100;
      return [
        { label: "Độ dài giãn thêm ΔL", value: L0 * alpha * dT, unit: "m" },
        { label: "Độ dài cuối", value: L0 * (1 + alpha * dT), unit: "m" },
        { label: "Mức giãn tương đối", value: alpha * dT, unit: "" },
      ];
    },
    render: (p, t): SceneObject[] => {
      const L0 = p["L0"] ?? 1;
      const alpha = (p["alpha"] ?? 2.3) * 1e-5;
      const dT = (p["dT"] ?? 100) * Math.min(t / 3, 1);
      const dL = L0 * alpha * dT;
      const w = 120 + dL * 6000;
      const out: SceneObject[] = [
        { t: "rect", x: 60, y: 90, w: 120, h: 26, fill: "#c9d6cf", stroke: MUTED, width: 1, rx: 3 },
        { t: "text", x: 120, y: 84, text: "Ban đầu", size: 10, fill: MUTED, anchor: "middle" },
        { t: "rect", x: 60, y: 150, w, h: 26, fill: AMBER, stroke: INK, width: 1, rx: 3 },
        { t: "text", x: 60, y: 144, text: `ΔT = ${fmt(dT, 0)} °C`, size: 10, fill: INK },
        { t: "text", x: 40, y: 26, text: `ΔL = L₀·α·ΔT = ${fmt(dL, 5)} m`, size: 12, fill: INK },
        {
          t: "text",
          x: 40,
          y: 232,
          text: `L₀ = ${fmt(L0)} m · α = ${fmt(alpha * 1e5, 1)}×10⁻⁵ /°C`,
          size: 11,
          fill: MUTED,
        },
      ];
      return out;
    },
    duration: () => 5,
  },

  // 11. Ác-si-mét — F_day = d·g·V
  buoyancy: {
    id: "buoyancy",
    params: [
      { key: "V", label: "Thể tích vật V", unit: "dm³", min: 0.2, max: 5, step: 0.1, default: 1 },
      {
        key: "dVat",
        label: "Khối lượng riêng vật",
        unit: "kg/m³",
        min: 100,
        max: 11000,
        step: 50,
        default: 2700,
      },
      {
        key: "dChat",
        label: "Khối lượng riêng chất lỏng",
        unit: "kg/m³",
        min: 500,
        max: 1500,
        step: 10,
        default: 1000,
      },
    ],
    compute: (p) => {
      const V = (p["V"] ?? 1) * 1e-3;
      const dVat = p["dVat"] ?? 2700;
      const dChat = p["dChat"] ?? 1000;
      const G = dVat * V * 9.8;
      const Fday = dChat * V * 9.8;
      return [
        { label: "Trọng lượng G", value: G, unit: "N" },
        { label: "Lực đẩy nổi F", value: Fday, unit: "N" },
        { label: "Kết quả", value: Fday >= G ? 1 : 0, unit: Fday >= G ? "Vật nổi" : "Vật chìm" },
      ];
    },
    render: (p): SceneObject[] => {
      const V = (p["V"] ?? 1) * 1e-3;
      const dVat = p["dVat"] ?? 2700;
      const dChat = p["dChat"] ?? 1000;
      const G = dVat * V * 9.8;
      const Fday = dChat * V * 9.8;
      const floating = Fday >= G;
      const level = floating ? 150 : 172;
      const size = 26 + V * 220;
      const out: SceneObject[] = [
        {
          t: "rect",
          x: 70,
          y: 120,
          w: 220,
          h: 100,
          fill: "#bcd6e8",
          stroke: INK,
          width: 1.5,
          rx: 4,
        },
        { t: "text", x: 76, y: 114, text: `d = ${fmt(dChat)} kg/m³`, size: 10, fill: BLUE },
        {
          t: "rect",
          x: 180 - size / 2,
          y: level - size / 2,
          w: size,
          h: size,
          fill: floating ? AMBER : "#8a6d3b",
          stroke: INK,
          width: 1,
          rx: 3,
        },
        ...arrow(180, level - size / 2 - 4, 180, level - size / 2 - 34, GREEN),
        {
          t: "text",
          x: 190,
          y: level - size / 2 - 26,
          text: `F = ${fmt(Fday)} N`,
          size: 11,
          fill: GREEN,
        },
        ...arrow(180, level + size / 2 + 4, 180, level + size / 2 + 34, RED),
        {
          t: "text",
          x: 190,
          y: level + size / 2 + 42,
          text: `G = ${fmt(G)} N`,
          size: 11,
          fill: RED,
        },
        {
          t: "text",
          x: 40,
          y: 26,
          text: floating ? "F ≥ G → vật nổi" : "F < G → vật chìm",
          size: 13,
          fill: floating ? GREEN : RED,
        },
        {
          t: "text",
          x: 40,
          y: 232,
          text: `V = ${fmt(p["V"] ?? 1)} dm³ · d_vật = ${fmt(dVat)} kg/m³`,
          size: 11,
          fill: MUTED,
        },
      ];
      return out;
    },
    duration: () => 8,
  },

  // 12. Khí lý tưởng — pV = nRT
  "gas-law": {
    id: "gas-law",
    params: [
      { key: "n", label: "Số mol khí n", unit: "mol", min: 0.5, max: 5, step: 0.1, default: 1 },
      { key: "T", label: "Nhiệt độ T", unit: "K", min: 200, max: 600, step: 5, default: 300 },
      { key: "V", label: "Thể tích V", unit: "L", min: 5, max: 50, step: 0.5, default: 22.4 },
    ],
    compute: (p) => {
      const n = p["n"] ?? 1;
      const T = p["T"] ?? 300;
      const V = (p["V"] ?? 22.4) * 1e-3;
      const press = (n * 8.314 * T) / V;
      return [
        { label: "Áp suất khí p", value: press, unit: "Pa" },
        { label: "p (atm)", value: press / 101325, unit: "atm" },
        { label: "Năng lượng động học trung bình ∝ T", value: T, unit: "K" },
      ];
    },
    series: (p) => {
      const n = p["n"] ?? 1;
      const T = p["T"] ?? 300;
      const points = [];
      for (let V = 5; V <= 50; V += 1) {
        points.push({ x: V, y: (n * 8.314 * T) / (V * 1e-3) / 101325 });
      }
      return seriesOf("p(V) đẳng nhiệt", "V (L)", "p (atm)", points);
    },
    render: (p, t): SceneObject[] => {
      const T = p["T"] ?? 300;
      const V = p["V"] ?? 22.4;
      const pistonX = 80 + ((V - 5) / 45) * 200;
      const out: SceneObject[] = [
        { t: "rect", x: 60, y: 80, w: 260, h: 110, fill: "none", stroke: INK, width: 2, rx: 4 },
        { t: "rect", x: pistonX, y: 80, w: 14, h: 110, fill: "#2c3a33" },
        { t: "text", x: 40, y: 26, text: `pV = nRT · T = ${fmt(T, 0)} K`, size: 12, fill: INK },
        {
          t: "text",
          x: 40,
          y: 232,
          text: `V = ${fmt(V)} L · p = ${fmt(((p["n"] ?? 1) * 8.314 * T) / (V * 1e-3) / 101325, 2)} atm`,
          size: 11,
          fill: MUTED,
        },
      ];
      for (let i = 0; i < 14; i += 1) {
        const seed = i * 97.3;
        const speed = 0.6 + (T / 600) * 1.2;
        const px = 66 + ((Math.sin(seed + t * speed) + 1) / 2) * (pistonX - 76);
        const py = 90 + ((Math.cos(seed * 1.7 + t * speed * 1.3) + 1) / 2) * 90;
        out.push({ t: "circle", cx: px, cy: py, r: 4, fill: AMBER, opacity: 0.85 });
      }
      return out;
    },
    duration: () => 8,
  },

  // 13. Tụ điện RC — U(t) = U₀·e^(−t/RC)
  capacitor: {
    id: "capacitor",
    params: [
      { key: "U0", label: "Điện áp nạp U₀", unit: "V", min: 1, max: 24, step: 0.5, default: 12 },
      { key: "R", label: "Điện trở R", unit: "kΩ", min: 0.5, max: 100, step: 0.5, default: 10 },
      { key: "C", label: "Điện dung C", unit: "µF", min: 1, max: 1000, step: 5, default: 100 },
    ],
    compute: (p) => {
      const R = (p["R"] ?? 10) * 1e3;
      const C = (p["C"] ?? 100) * 1e-6;
      const tau = R * C;
      return [
        { label: "Hằng số thời gian τ = RC", value: tau, unit: "s" },
        { label: "U sau 1τ", value: (p["U0"] ?? 12) * Math.exp(-1), unit: "V" },
        { label: "U sau 5τ (gần xả hết)", value: (p["U0"] ?? 12) * Math.exp(-5), unit: "V" },
      ];
    },
    series: (p) => {
      const U0 = p["U0"] ?? 12;
      const tau = (p["R"] ?? 10) * 1e3 * (p["C"] ?? 100) * 1e-6 || 1;
      const points = [];
      for (let i = 0; i <= 60; i += 1) {
        const t = (i / 60) * 5 * tau;
        points.push({ x: t, y: U0 * Math.exp(-t / tau) });
      }
      return seriesOf("U(t)", "t (s)", "U (V)", points);
    },
    render: (p, t): SceneObject[] => {
      const U0 = p["U0"] ?? 12;
      const tau = (p["R"] ?? 10) * 1e3 * (p["C"] ?? 100) * 1e-6 || 1;
      const U = U0 * Math.exp(-Math.min(t, 5 * tau) / tau);
      const barH = (U / Math.max(U0, 1)) * 110;
      const out: SceneObject[] = [
        { t: "rect", x: 60, y: 70, w: 16, h: 110, fill: "#e3ece6", stroke: INK, width: 1 },
        { t: "rect", x: 60, y: 180 - barH, w: 16, h: barH, fill: BLUE },
        { t: "rect", x: 110, y: 60, w: 10, h: 130, fill: "#2c3a33" },
        { t: "rect", x: 150, y: 60, w: 10, h: 130, fill: "#2c3a33" },
        { t: "text", x: 40, y: 26, text: `U(t) = ${fmt(U)} V`, size: 12, fill: INK },
        { t: "text", x: 40, y: 232, text: `τ = RC = ${fmt(tau)} s`, size: 11, fill: MUTED },
      ];
      const pts: string[] = [];
      for (let i = 0; i <= 30; i += 1) {
        const tt = (i / 30) * 5 * tau;
        pts.push(
          `${fmt(190 + (tt / (5 * tau)) * 140)},${fmt(190 - ((U0 * Math.exp(-tt / tau)) / Math.max(U0, 1)) * 110)}`,
        );
      }
      out.push({ t: "path", d: `M ${pts.join(" L ")}`, stroke: GREEN, width: 2 });
      out.push({
        t: "line",
        x1: 190,
        y1: 80,
        x2: 330,
        y2: 80,
        stroke: MUTED,
        width: 1,
        dash: "3 3",
      });
      out.push({ t: "line", x1: 190, y1: 190, x2: 330, y2: 190, stroke: INK, width: 1.2 });
      return out;
    },
    duration: (p) => Math.min(12, Math.max(4, (p["R"] ?? 10) * 1e3 * (p["C"] ?? 100) * 1e-6 * 6)),
  },

  // 14. Cảm ứng điện từ — ε = N·B·L·v
  "em-induction": {
    id: "em-induction",
    params: [
      {
        key: "v",
        label: "Vận tốc nam châm v",
        unit: "m/s",
        min: 0.2,
        max: 5,
        step: 0.1,
        default: 1.5,
      },
      {
        key: "N",
        label: "Số vòng dây N",
        unit: "vòng",
        min: 50,
        max: 1000,
        step: 10,
        default: 300,
      },
      { key: "B", label: "Cảm ứng từ B", unit: "T", min: 0.05, max: 1, step: 0.01, default: 0.3 },
    ],
    compute: (p) => {
      const v = p["v"] ?? 1.5;
      const N = p["N"] ?? 300;
      const B = p["B"] ?? 0.3;
      const eps = N * B * 0.5 * v;
      return [
        { label: "Điện động cảm ứng ε", value: eps, unit: "V" },
        { label: "Độ lớn từ thông thay đổi ∝ v", value: B * 0.5 * v, unit: "Wb/s" },
        { label: "ε nếu tăng gấp đôi N", value: 2 * eps, unit: "V" },
      ];
    },
    series: (p) => {
      const N = p["N"] ?? 300;
      const B = p["B"] ?? 0.3;
      const points = [];
      for (let v = 0.2; v <= 5; v += 0.2) {
        points.push({ x: v, y: N * B * 0.5 * v });
      }
      return seriesOf("ε(v)", "v (m/s)", "ε (V)", points);
    },
    render: (p, t): SceneObject[] => {
      const v = p["v"] ?? 1.5;
      const phase = (t * v * 0.5) % 1;
      const magnetX = 40 + phase * 260;
      const out: SceneObject[] = [
        { t: "rect", x: 120, y: 70, w: 14, h: 110, fill: "#8a6d3b" },
        { t: "rect", x: 150, y: 70, w: 14, h: 110, fill: "#8a6d3b" },
        { t: "rect", x: 180, y: 70, w: 14, h: 110, fill: "#8a6d3b" },
        {
          t: "rect",
          x: magnetX,
          y: 100,
          w: 54,
          h: 30,
          fill: "#b03030",
          stroke: INK,
          width: 1,
          rx: 3,
        },
        {
          t: "text",
          x: magnetX + 27,
          y: 120,
          text: "N  S",
          size: 11,
          fill: "#fff",
          anchor: "middle",
        },
        { t: "rect", x: 250, y: 80, w: 70, h: 90, fill: "none", stroke: INK, width: 1.5, rx: 6 },
        { t: "text", x: 285, y: 128, text: "Vôn kế", size: 11, fill: INK, anchor: "middle" },
        {
          t: "text",
          x: 40,
          y: 26,
          text: `ε = N·B·L·v = ${fmt((p["N"] ?? 300) * (p["B"] ?? 0.3) * 0.5 * v)} V`,
          size: 12,
          fill: INK,
        },
        {
          t: "text",
          x: 40,
          y: 232,
          text: `N = ${fmt(p["N"] ?? 300, 0)} · B = ${fmt(p["B"] ?? 0.3)} T · v = ${fmt(v)} m/s`,
          size: 11,
          fill: MUTED,
        },
      ];
      return out;
    },
    duration: () => 8,
  },

  // 15. Phóng xạ — N(t) = N₀·2^(−t/T)
  radioactive: {
    id: "radioactive",
    params: [
      {
        key: "N0",
        label: "Số hạt ban đầu N₀",
        unit: "hạt",
        min: 100,
        max: 2000,
        step: 50,
        default: 1000,
      },
      { key: "T", label: "Chu kỳ bán rã T", unit: "s", min: 1, max: 20, step: 0.5, default: 5 },
    ],
    compute: (p) => {
      const N0 = p["N0"] ?? 1000;
      const T = p["T"] ?? 5;
      return [
        { label: "Số hạt còn lại sau 1 chu kỳ", value: N0 * 0.5, unit: "hạt" },
        { label: "Số hạt còn lại sau 3 chu kỳ", value: N0 * 0.125, unit: "hạt" },
        { label: "Số hạt đã rã sau 10 s", value: N0 * (1 - 2 ** (-10 / T)), unit: "hạt" },
      ];
    },
    series: (p) => {
      const N0 = p["N0"] ?? 1000;
      const T = p["T"] ?? 5;
      const points = [];
      for (let i = 0; i <= 60; i += 1) {
        const t = (i / 60) * 4 * T;
        points.push({ x: t, y: N0 * 2 ** (-t / T) });
      }
      return seriesOf("N(t)", "t (s)", "N (hạt)", points);
    },
    render: (p, t): SceneObject[] => {
      const N0 = p["N0"] ?? 1000;
      const T = p["T"] ?? 5;
      const remain = N0 * 2 ** (-t / T);
      const alive = Math.round((remain / N0) * 60);
      const out: SceneObject[] = [
        { t: "rect", x: 40, y: 50, w: 200, h: 160, fill: "none", stroke: INK, width: 1.5, rx: 8 },
        {
          t: "text",
          x: 40,
          y: 26,
          text: `Còn lại ${fmt(remain, 0)} / ${fmt(N0, 0)} hạt`,
          size: 12,
          fill: INK,
        },
        { t: "text", x: 40, y: 232, text: `Bán rã T = ${fmt(T)} s`, size: 11, fill: MUTED },
      ];
      for (let i = 0; i < 60; i += 1) {
        const gx = 55 + (i % 12) * 15.5;
        const gy = 68 + Math.floor(i / 12) * 28;
        out.push({
          t: "circle",
          cx: gx,
          cy: gy,
          r: 5,
          fill: i < alive ? GREEN : "#cfd8d3",
          opacity: i < alive ? 0.9 : 0.5,
        });
      }
      return out;
    },
    duration: (p) => Math.min(12, Math.max(4, (p["T"] ?? 5) * 2)),
  },

  // 16. Hiệu ứng quang điện — E_k = hf − W
  photoelectric: {
    id: "photoelectric",
    params: [
      {
        key: "lambda",
        label: "Bước sóng ánh sáng λ",
        unit: "nm",
        min: 200,
        max: 700,
        step: 10,
        default: 400,
      },
      { key: "W", label: "Công thoát W", unit: "eV", min: 1, max: 6, step: 0.1, default: 2 },
    ],
    compute: (p) => {
      const lam = Math.max(p["lambda"] ?? 400, 1);
      const W = p["W"] ?? 2;
      const Eph = (4.136e-15 * 3e8) / (lam * 1e-9);
      return [
        { label: "Năng lượng photon hν", value: Eph, unit: "eV" },
        { label: "Động năng electron lớn nhất", value: Math.max(Eph - W, 0), unit: "eV" },
        {
          label: "Kết quả",
          value: Eph > W ? 1 : 0,
          unit: Eph > W ? "Có electron bay ra" : "Không phát ra electron",
        },
      ];
    },
    series: (p) => {
      const W = p["W"] ?? 2;
      const points = [];
      for (let lam = 200; lam <= 700; lam += 10) {
        const Eph = (4.136e-15 * 3e8) / (lam * 1e-9);
        points.push({ x: lam, y: Math.max(Eph - W, 0) });
      }
      return seriesOf("E_k(λ)", "λ (nm)", "E_k (eV)", points);
    },
    render: (p, t): SceneObject[] => {
      const lam = Math.max(p["lambda"] ?? 400, 1);
      const W = p["W"] ?? 2;
      const Eph = (4.136e-15 * 3e8) / (lam * 1e-9);
      const emit = Eph > W;
      const out: SceneObject[] = [
        { t: "rect", x: 60, y: 80, w: 60, h: 80, fill: "#2c3a33", stroke: INK, width: 1, rx: 4 },
        { t: "text", x: 90, y: 125, text: "NK", size: 12, fill: INK, anchor: "middle" },
        ...arrow(140, 120, 200, 120, emit ? AMBER : "#666"),
        {
          t: "text",
          x: 155,
          y: 108,
          text: `hν = ${fmt(Eph, 2)} eV`,
          size: 11,
          fill: emit ? AMBER : "#888",
        },
        {
          t: "text",
          x: 200,
          y: 215,
          text: `λ = ${fmt(lam, 0)} nm · W = ${fmt(W)} eV`,
          size: 12,
          fill: INK,
          anchor: "middle",
        },
      ];
      if (emit) {
        const drift = ((t * 40) % 40) + 8;
        out.push(...arrow(215, 120, 320, 95, GREEN));
        out.push({ t: "text", x: 265, y: 84, text: "e⁻ bay ra", size: 11, fill: GREEN });
        out.push({
          t: "text",
          x: 240,
          y: 150,
          text: `E_k = ${fmt(Eph - W, 2)} eV`,
          size: 11,
          fill: GREEN,
        });
        out.push({ t: "circle", cx: 215 + drift, cy: 120 - drift * 0.6, r: 4, fill: BLUE });
      } else {
        out.push({
          t: "text",
          x: 230,
          y: 124,
          text: "Không phát ra electron",
          size: 11,
          fill: RED,
        });
      }
      return out;
    },
    duration: () => 8,
  },
};

export function getEngine(id: string): EngineDef | undefined {
  return ENGINES[id];
}
