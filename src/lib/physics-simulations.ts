/**
 * TamGiangPhysics — Core Multi-Domain Physics Simulation Engines
 * Scientific calculations verified against SI units and Vietnamese THPT Physics curriculum.
 */

export type SimulationDomainId = "co-hoc" | "dao-dong-song" | "nhiet-hoc" | "dien-tu" | "quang-hoc";

export type SimulationLifecycleState = "idle" | "running" | "paused" | "completed" | "error";

export interface SimulationParamSpec {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultVal: number;
}

export interface SimulationDomainMeta {
  id: SimulationDomainId;
  title: string;
  shortTitle: string;
  grade: "Lớp 10" | "Lớp 11" | "Lớp 12";
  formula: string;
  description: string;
  defaultDuration: number; // simulated seconds for time-based sims (0 if static/instant)
  predictionQuestion: string;
  predictionUnit: string;
  params: SimulationParamSpec[];
}

export const SIMULATION_DOMAINS: SimulationDomainMeta[] = [
  {
    id: "co-hoc",
    title: "Cơ học — Chuyển động Ném xiên & Bảo toàn Cơ năng",
    shortTitle: "Cơ học (Ném xiên)",
    grade: "Lớp 10",
    formula: "x = (v₀·cosα)·t ; y = h₀ + (v₀·sinα)·t − ½·g·t²",
    description:
      "Khảo sát quỹ đạo parabol của vật ném xiên dưới trọng lực đều (tùy chọn lực cản tuyến tính), theo dõi động năng Wđ, thế năng Wt và tầm bay xa L.",
    defaultDuration: 6.0,
    predictionQuestion: "Dự đoán tầm bay xa L (khi k = 0) trước khi chạy mô phỏng:",
    predictionUnit: "m",
    params: [
      {
        key: "v0",
        label: "Vận tốc ban đầu (v₀)",
        unit: "m/s",
        min: 5,
        max: 35,
        step: 1,
        defaultVal: 18,
      },
      { key: "alpha", label: "Góc ném (α)", unit: "°", min: 10, max: 85, step: 1, defaultVal: 45 },
      {
        key: "h0",
        label: "Độ cao ban đầu (h₀)",
        unit: "m",
        min: 0,
        max: 20,
        step: 1,
        defaultVal: 0,
      },
      {
        key: "g",
        label: "Gia tốc trọng trường (g)",
        unit: "m/s²",
        min: 1.6,
        max: 15,
        step: 0.2,
        defaultVal: 9.8,
      },
      {
        key: "drag",
        label: "Hệ số cản không khí (k/m)",
        unit: "s⁻¹",
        min: 0,
        max: 0.25,
        step: 0.01,
        defaultVal: 0,
      },
    ],
  },
  {
    id: "dao-dong-song",
    title: "Dao động & Sóng — Con lắc Lò xo điều hòa",
    shortTitle: "Dao động (Con lắc lò xo)",
    grade: "Lớp 11",
    formula: "x(t) = A·e^(−γt)·cos(ωt + φ₀) ; ω = √(k/m)",
    description:
      "Mô phỏng dao động điều hòa và tắt dần của con lắc lò xo nằm ngang, quan sát đồ thị x(t), v(t) và chuyển hóa Wđ ↔ Wt.",
    defaultDuration: 10.0,
    predictionQuestion: "Dự đoán chu kỳ dao động riêng T₀ trước khi chạy:",
    predictionUnit: "s",
    params: [
      {
        key: "m",
        label: "Khối lượng vật (m)",
        unit: "kg",
        min: 0.1,
        max: 2.0,
        step: 0.1,
        defaultVal: 0.4,
      },
      {
        key: "k",
        label: "Độ cứng lò xo (k)",
        unit: "N/m",
        min: 10,
        max: 200,
        step: 5,
        defaultVal: 40,
      },
      {
        key: "A",
        label: "Biên độ ban đầu (A)",
        unit: "cm",
        min: 2,
        max: 20,
        step: 1,
        defaultVal: 10,
      },
      {
        key: "damping",
        label: "Hệ số tắt dần (γ)",
        unit: "s⁻¹",
        min: 0,
        max: 0.5,
        step: 0.02,
        defaultVal: 0,
      },
    ],
  },
  {
    id: "nhiet-hoc",
    title: "Nhiệt học & Khí lý tưởng — Phương trình Trạng thái p-V-T",
    shortTitle: "Khí lý tưởng (p-V-T)",
    grade: "Lớp 12",
    formula: "p·V = n·R·T ; v_rms = √(3RT/M)",
    description:
      "Mô phỏng chuyển động hỗn loạn phân tử khí trong xi-lanh pít-tông và đồ thị đẳng nhiệt trên hệ tọa độ p-V (R = 8,314 J/(mol·K)).",
    defaultDuration: 8.0,
    predictionQuestion: "Dự đoán áp suất p (kPa) của lượng khí tại trạng thái đã chọn:",
    predictionUnit: "kPa",
    params: [
      {
        key: "n",
        label: "Số mol khí (n)",
        unit: "mol",
        min: 0.5,
        max: 3.0,
        step: 0.1,
        defaultVal: 1.0,
      },
      {
        key: "T",
        label: "Nhiệt độ tuyệt đối (T)",
        unit: "K",
        min: 200,
        max: 600,
        step: 10,
        defaultVal: 300,
      },
      {
        key: "V",
        label: "Thể tích xi-lanh (V)",
        unit: "lít",
        min: 5,
        max: 50,
        step: 1,
        defaultVal: 25,
      },
    ],
  },
  {
    id: "dien-tu",
    title: "Điện học & Từ trường — Định luật Ohm Toàn mạch & Công suất",
    shortTitle: "Điện học (Toàn mạch)",
    grade: "Lớp 11",
    formula: "I = E / (R_N + r) ; P_N = I²·R_N (Cực đại khi R_N = r)",
    description:
      "Khảo sát dòng điện, hiệu điện thế mạch ngoài và đồ thị công suất tiêu thụ P(R) để kiểm chứng cực đại công suất khi R_N = r.",
    defaultDuration: 6.0,
    predictionQuestion: "Dự đoán cường độ dòng điện I chạy qua mạch chính:",
    predictionUnit: "A",
    params: [
      {
        key: "E",
        label: "Suất điện động nguồn (E)",
        unit: "V",
        min: 3,
        max: 24,
        step: 0.5,
        defaultVal: 12,
      },
      {
        key: "r",
        label: "Điện trở trong (r)",
        unit: "Ω",
        min: 0.5,
        max: 10,
        step: 0.5,
        defaultVal: 2.0,
      },
      {
        key: "R1",
        label: "Điện trở mạch ngoài (R₁)",
        unit: "Ω",
        min: 1,
        max: 30,
        step: 0.5,
        defaultVal: 4.0,
      },
      {
        key: "R2",
        label: "Điện trở nhánh 2 (R₂)",
        unit: "Ω",
        min: 1,
        max: 30,
        step: 0.5,
        defaultVal: 6.0,
      },
      {
        key: "mode",
        label: "Kiểu ghép (0: Nối tiếp, 1: Song song)",
        unit: "",
        min: 0,
        max: 1,
        step: 1,
        defaultVal: 0,
      },
    ],
  },
  {
    id: "quang-hoc",
    title: "Quang học — Đường đi Tia sáng qua Thấu kính Mỏng",
    shortTitle: "Quang học (Thấu kính)",
    grade: "Lớp 11",
    formula: "1/f = 1/d + 1/d' ; k = −d'/d",
    description:
      "Mô phỏng tạo ảnh qua thấu kính hội tụ (f > 0) hoặc phân kỳ (f < 0), vẽ 3 tia đặc biệt và kiểm chứng độ phóng đại đại số k.",
    defaultDuration: 6.0,
    predictionQuestion: "Dự đoán vị trí ảnh d' (cm) theo công thức thấu kính:",
    predictionUnit: "cm",
    params: [
      {
        key: "isDiverging",
        label: "Loại thấu kính (0: Hội tụ, 1: Phân kỳ)",
        unit: "",
        min: 0,
        max: 1,
        step: 1,
        defaultVal: 0,
      },
      {
        key: "fAbs",
        label: "Độ lớn tiêu cự (|f|)",
        unit: "cm",
        min: 10,
        max: 40,
        step: 2,
        defaultVal: 20,
      },
      {
        key: "d",
        label: "Khoảng cách vật (d)",
        unit: "cm",
        min: 8,
        max: 80,
        step: 2,
        defaultVal: 30,
      },
      {
        key: "h",
        label: "Chiều cao vật (AB)",
        unit: "cm",
        min: 2,
        max: 10,
        step: 0.5,
        defaultVal: 4,
      },
    ],
  },
];

export function validateSimulationParams(
  spec: SimulationDomainMeta,
  values: Record<string, number>,
): { valid: boolean; error: string | null } {
  for (const p of spec.params) {
    const v = values[p.key];
    if (typeof v !== "number" || Number.isNaN(v)) {
      return { valid: false, error: `Giá trị của "${p.label}" không hợp lệ.` };
    }
    if (v < p.min || v > p.max) {
      return {
        valid: false,
        error: `"${p.label}" phải nằm trong khoảng [${p.min}; ${p.max}] ${p.unit}.`,
      };
    }
  }
  return { valid: true, error: null };
}

/* ==================== DOMAIN 1: PROJECTILE MOTION ==================== */
export interface ProjectilePoint {
  t: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  v: number;
}

export interface ProjectileSummary {
  flightTime: number;
  range: number;
  maxHeight: number;
  impactSpeed: number;
  idealFlightTime: number;
  idealRange: number;
  idealMaxHeight: number;
  trajectory: ProjectilePoint[];
}

export function computeProjectilePhysics(params: Record<string, number>): ProjectileSummary {
  const v0 = params.v0 ?? 18;
  const alphaRad = ((params.alpha ?? 45) * Math.PI) / 180;
  const h0 = params.h0 ?? 0;
  const g = params.g ?? 9.8;
  const drag = params.drag ?? 0;

  const vx0 = v0 * Math.cos(alphaRad);
  const vy0 = v0 * Math.sin(alphaRad);

  // Analytical ideal (drag = 0)
  const idealFlightTime = (vy0 + Math.sqrt(vy0 * vy0 + 2 * g * h0)) / g;
  const idealRange = vx0 * idealFlightTime;
  const idealMaxHeight = h0 + (vy0 * vy0) / (2 * g);

  // Numerical RK2/Euler integration at dt = 0.02s for trajectory
  const dt = 0.02;
  const trajectory: ProjectilePoint[] = [];
  let t = 0;
  let x = 0;
  let y = h0;
  let vx = vx0;
  let vy = vy0;
  let maxHeight = h0;

  trajectory.push({ t: 0, x, y, vx, vy, v: v0 });

  for (let step = 0; step < 2500; step++) {
    const ax = -drag * vx;
    const ay = -g - drag * vy;
    const nextVx = vx + ax * dt;
    const nextVy = vy + ay * dt;
    const nextX = x + 0.5 * (vx + nextVx) * dt;
    const nextY = y + 0.5 * (vy + nextVy) * dt;
    t += dt;

    if (nextY > maxHeight) maxHeight = nextY;

    if (nextY <= 0 && t > dt) {
      const frac = y / Math.max(1e-6, y - nextY);
      const tHit = t - dt + frac * dt;
      const xHit = x + frac * (nextX - x);
      const vxHit = vx + frac * (nextVx - vx);
      const vyHit = vy + frac * (nextVy - vy);
      trajectory.push({
        t: tHit,
        x: xHit,
        y: 0,
        vx: vxHit,
        vy: vyHit,
        v: Math.hypot(vxHit, vyHit),
      });
      return {
        flightTime: tHit,
        range: xHit,
        maxHeight,
        impactSpeed: Math.hypot(vxHit, vyHit),
        idealFlightTime,
        idealRange,
        idealMaxHeight,
        trajectory,
      };
    }

    x = nextX;
    y = nextY;
    vx = nextVx;
    vy = nextVy;
    if (step % 2 === 0) {
      trajectory.push({ t, x, y, vx, vy, v: Math.hypot(vx, vy) });
    }
  }

  return {
    flightTime: t,
    range: x,
    maxHeight,
    impactSpeed: Math.hypot(vx, vy),
    idealFlightTime,
    idealRange,
    idealMaxHeight,
    trajectory,
  };
}

/* ==================== DOMAIN 2: SPRING OSCILLATOR ==================== */
export interface SpringSample {
  t: number;
  xCm: number;
  vCmS: number;
  keMj: number;
  peMj: number;
  totalMj: number;
}

export interface SpringSummary {
  omega: number;
  period: number;
  frequency: number;
  vMaxCmS: number;
  totalEnergyMj: number;
  samples: SpringSample[];
}

export function computeSpringPhysics(params: Record<string, number>): SpringSummary {
  const m = params.m ?? 0.4;
  const k = params.k ?? 40;
  const A = params.A ?? 10; // cm
  const gamma = params.damping ?? 0;

  const omega0 = Math.sqrt(k / m);
  const omega = Math.sqrt(Math.max(0.01, omega0 * omega0 - gamma * gamma));
  const period = (2 * Math.PI) / omega0;
  const frequency = 1 / period;
  const aM = A * 0.01;
  const totalEnergyMj = 0.5 * k * aM * aM * 1000;
  const vMaxCmS = A * omega0;

  const samples: SpringSample[] = [];
  const duration = 10;
  const dt = 0.05;
  for (let t = 0; t <= duration + 1e-6; t += dt) {
    const env = Math.exp(-gamma * t);
    const xCm = A * env * Math.cos(omega * t);
    const vCmS = -A * env * (gamma * Math.cos(omega * t) + omega * Math.sin(omega * t));
    const xM = xCm * 0.01;
    const vMs = vCmS * 0.01;
    const peMj = 0.5 * k * xM * xM * 1000;
    const keMj = 0.5 * m * vMs * vMs * 1000;
    samples.push({
      t: Number(t.toFixed(2)),
      xCm,
      vCmS,
      keMj,
      peMj,
      totalMj: keMj + peMj,
    });
  }

  return { omega: omega0, period, frequency, vMaxCmS, totalEnergyMj, samples };
}

/* ==================== DOMAIN 3: IDEAL GAS P-V-T ==================== */
export interface GasSummary {
  pressureKPa: number;
  pressureAtm: number;
  internalEnergyJ: number;
  vRmsHelium: number;
  vRmsNitrogen: number;
  isothermCurve: { vL: number; pKPa: number }[];
}

export function computeIdealGasPhysics(params: Record<string, number>): GasSummary {
  const R = 8.314;
  const n = params.n ?? 1.0;
  const T = params.T ?? 300;
  const vL = params.V ?? 25;
  const vM3 = vL * 1e-3;
  const pPa = (n * R * T) / vM3;
  const pressureKPa = pPa / 1000;
  const pressureAtm = pPa / 101325;
  // Monoatomic gas U = 3/2 nRT
  const internalEnergyJ = 1.5 * n * R * T;
  const vRmsHelium = Math.sqrt((3 * R * T) / 0.004);
  const vRmsNitrogen = Math.sqrt((3 * R * T) / 0.028);

  const isothermCurve: { vL: number; pKPa: number }[] = [];
  for (let vol = 5; vol <= 50; vol += 2.5) {
    isothermCurve.push({
      vL: vol,
      pKPa: (n * R * T) / (vol * 1e-3) / 1000,
    });
  }

  return {
    pressureKPa,
    pressureAtm,
    internalEnergyJ,
    vRmsHelium,
    vRmsNitrogen,
    isothermCurve,
  };
}

/* ==================== DOMAIN 4: OHM CIRCUIT & MAX POWER ==================== */
export interface CircuitSummary {
  rExt: number;
  iTotal: number;
  iBranch1: number;
  iBranch2: number;
  uOut: number;
  pExt: number;
  pSource: number;
  efficiencyPct: number;
  pMaxPossible: number;
  powerCurve: { rVal: number; pVal: number }[];
}

export function computeCircuitPhysics(params: Record<string, number>): CircuitSummary {
  const E = params.E ?? 12;
  const r = params.r ?? 2;
  const R1 = params.R1 ?? 4;
  const R2 = params.R2 ?? 6;
  const isParallel = (params.mode ?? 0) >= 0.5;

  const rExt = isParallel ? (R1 * R2) / (R1 + R2) : R1 + R2;
  const iTotal = E / (rExt + r);
  const uOut = iTotal * rExt;
  const iBranch1 = isParallel ? uOut / R1 : iTotal;
  const iBranch2 = isParallel ? uOut / R2 : iTotal;
  const pExt = iTotal * iTotal * rExt;
  const pSource = E * iTotal;
  const efficiencyPct = (uOut / E) * 100;
  const pMaxPossible = (E * E) / (4 * r);

  const powerCurve: { rVal: number; pVal: number }[] = [];
  for (let rv = 0.5; rv <= 30; rv += 1.0) {
    const curI = E / (rv + r);
    powerCurve.push({ rVal: rv, pVal: curI * curI * rv });
  }

  return {
    rExt,
    iTotal,
    iBranch1,
    iBranch2,
    uOut,
    pExt,
    pSource,
    efficiencyPct,
    pMaxPossible,
    powerCurve,
  };
}

/* ==================== DOMAIN 5: THIN LENS OPTICS ==================== */
export interface LensSummary {
  f: number;
  d: number;
  dPrime: number | null;
  magnification: number | null;
  hImage: number | null;
  isAtFocus: boolean;
  natureText: string;
}

export function computeThinLensPhysics(params: Record<string, number>): LensSummary {
  const isDiverging = (params.isDiverging ?? 0) >= 0.5;
  const fAbs = params.fAbs ?? 20;
  const f = isDiverging ? -fAbs : fAbs;
  const d = params.d ?? 30;
  const h = params.h ?? 4;

  if (Math.abs(d - f) < 1e-6) {
    return {
      f,
      d,
      dPrime: null,
      magnification: null,
      hImage: null,
      isAtFocus: true,
      natureText: "Vật đặt tại tiêu điểm F — chùm tia ló song song (ảnh ở vô cực).",
    };
  }

  const dPrime = (d * f) / (d - f);
  const magnification = -dPrime / d;
  const hImage = magnification * h;
  const isReal = dPrime > 0;
  const isUpright = magnification > 0;
  const sizeWord =
    Math.abs(magnification) > 1.01
      ? "lớn hơn vật"
      : Math.abs(magnification) < 0.99
        ? "nhỏ hơn vật"
        : "bằng vật";

  return {
    f,
    d,
    dPrime,
    magnification,
    hImage,
    isAtFocus: false,
    natureText: `${isReal ? "Ảnh thật" : "Ảnh ảo"}, ${isUpright ? "cùng chiều" : "ngược chiều"}, ${sizeWord} (|k| = ${Math.abs(magnification).toFixed(2)}).`,
  };
}
