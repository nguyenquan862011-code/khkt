export type FormulaDomain =
  | "Cơ học"
  | "Dao động"
  | "Sóng"
  | "Nhiệt học"
  | "Chất khí"
  | "Điện học"
  | "Từ trường"
  | "Quang học";

export const FORMULA_DOMAINS: FormulaDomain[] = [
  "Cơ học",
  "Dao động",
  "Sóng",
  "Nhiệt học",
  "Chất khí",
  "Điện học",
  "Từ trường",
  "Quang học",
];

export interface PhysicsFormula {
  id: string;
  name: string;
  grade: "Lớp 10" | "Lớp 11" | "Lớp 12";
  domain: FormulaDomain;
  topic: string;
  expression: string;
  dimension: string;
  meaning: string;
  variables: { symbol: string; name: string; unit: string }[];
  condition: string;
  workedExample: string;
  relatedLessonPath?: string;
  calculator?: {
    inputs: {
      symbol: string;
      label: string;
      unit: string;
      defaultVal: number;
      min?: number;
      step?: number;
    }[];
    calcFormula: (vals: Record<string, number>) => {
      result: number;
      unit: string;
      substitutionText: string;
    };
  };
}

export const FORMULA_DATABASE: PhysicsFormula[] = [
  {
    id: "f10-chuyen-dong-thang-bien-doi",
    name: "Công thức vận tốc chuyển động thẳng biến đổi đều",
    grade: "Lớp 10",
    domain: "Cơ học",
    topic: "Động học",
    expression: "v = v₀ + a·t",
    dimension: "[L·T⁻¹] = [L·T⁻¹] + [L·T⁻²]·[T]",
    meaning:
      "Xác định vận tốc của chất điểm tại thời điểm t khi chuyển động với gia tốc a không đổi.",
    variables: [
      { symbol: "v", name: "Vận tốc tức thời", unit: "m/s" },
      { symbol: "v₀", name: "Vận tốc ban đầu", unit: "m/s" },
      { symbol: "a", name: "Gia tốc", unit: "m/s²" },
      { symbol: "t", name: "Thời gian chuyển động", unit: "s" },
    ],
    condition: "Gia tốc a = const dọc theo quỹ đạo thẳng.",
    workedExample:
      "Xe đang chạy v₀ = 5 m/s tăng tốc đều a = 2 m/s² trong t = 4 s ⇒ v = 5 + 2·4 = 13 m/s.",
    relatedLessonPath:
      "lop-10/co-hoc-phan-1/chu-de-2-mo-ta-chuyen-dong/bai-4-chuyen-dong-bien-doi/1-ly-thuyet-chuyen-dong-bien-doi",
    calculator: {
      inputs: [
        { symbol: "v0", label: "Vận tốc ban đầu (v₀)", unit: "m/s", defaultVal: 5 },
        { symbol: "a", label: "Gia tốc (a)", unit: "m/s²", defaultVal: 2 },
        { symbol: "t", label: "Thời gian (t)", unit: "s", defaultVal: 4, min: 0 },
      ],
      calcFormula: (vals) => {
        const v0 = vals.v0 ?? 0;
        const a = vals.a ?? 0;
        const t = Math.max(0, vals.t ?? 0);
        const res = v0 + a * t;
        return {
          result: res,
          unit: "m/s",
          substitutionText: `v = ${v0} + (${a})·(${t}) = ${res.toFixed(2)} m/s`,
        };
      },
    },
  },
  {
    id: "f10-dinh-luat-2-newton",
    name: "Định luật II Newton",
    grade: "Lớp 10",
    domain: "Cơ học",
    topic: "Động lực học",
    expression: "F = m·a",
    dimension: "[N] = [M]·[L·T⁻²]",
    meaning:
      "Gia tốc của một vật tỉ lệ thuận với hợp lực tác dụng và tỉ lệ nghịch với khối lượng của vật.",
    variables: [
      { symbol: "F", name: "Hợp lực tác dụng", unit: "N (kg·m/s²)" },
      { symbol: "m", name: "Khối lượng vật", unit: "kg" },
      { symbol: "a", name: "Gia tốc thu được", unit: "m/s²" },
    ],
    condition: "Hệ quy chiếu quán tính; vận tốc vật rất nhỏ so với tốc độ ánh sáng (v ≪ c).",
    workedExample: "Vật m = 3,5 kg chịu gia tốc a = 4,0 m/s² ⇒ Hợp lực F = 3,5 × 4,0 = 14 N.",
    relatedLessonPath:
      "lop-10/co-hoc-phan-1/chu-de-3-luc-va-chuyen-dong/bai-2-ba-dinh-luat-newton/1-ly-thuyet-ba-dinh-luat-newton",
    calculator: {
      inputs: [
        { symbol: "m", label: "Khối lượng vật (m)", unit: "kg", defaultVal: 3.5, min: 0.01 },
        { symbol: "a", label: "Gia tốc (a)", unit: "m/s²", defaultVal: 4.0 },
      ],
      calcFormula: (vals) => {
        const m = Math.max(0.01, vals.m ?? 1);
        const a = vals.a ?? 0;
        const res = m * a;
        return {
          result: res,
          unit: "N",
          substitutionText: `F = ${m} · (${a}) = ${res.toFixed(2)} N`,
        };
      },
    },
  },
  {
    id: "f10-dong-nang",
    name: "Động năng của chất điểm",
    grade: "Lớp 10",
    domain: "Cơ học",
    topic: "Năng lượng",
    expression: "Wđ = ½·m·v²",
    dimension: "[J] = [M]·[L²·T⁻²]",
    meaning: "Năng lượng vật có được do đang chuyển động, luôn mang giá trị không âm.",
    variables: [
      { symbol: "Wđ", name: "Động năng", unit: "J (Joule)" },
      { symbol: "m", name: "Khối lượng", unit: "kg" },
      { symbol: "v", name: "Tốc độ của vật", unit: "m/s" },
    ],
    condition: "Vật chuyển động tịnh tiến trong hệ quy chiếu xác định.",
    workedExample: "Vật m = 2 kg chuyển động tốc độ v = 10 m/s ⇒ Wđ = 0,5 × 2 × 10² = 100 J.",
    calculator: {
      inputs: [
        { symbol: "m", label: "Khối lượng (m)", unit: "kg", defaultVal: 2, min: 0 },
        { symbol: "v", label: "Vận tốc (v)", unit: "m/s", defaultVal: 10 },
      ],
      calcFormula: (vals) => {
        const m = Math.max(0, vals.m ?? 0);
        const v = vals.v ?? 0;
        const res = 0.5 * m * v * v;
        return {
          result: res,
          unit: "J",
          substitutionText: `Wđ = ½ · ${m} · (${v})² = ${res.toFixed(2)} J`,
        };
      },
    },
  },
  {
    id: "f11-chu-ky-con-lac-lo-xo",
    name: "Chu kỳ dao động của con lắc lò xo",
    grade: "Lớp 11",
    domain: "Dao động",
    topic: "Dao động điều hòa",
    expression: "T = 2π·√(m / k)",
    dimension: "[T] = √([M] / [M·T⁻²]) = [T]",
    meaning: "Chu kỳ dao động điều hòa riêng của con lắc lò xo không ma sát.",
    variables: [
      { symbol: "T", name: "Chu kỳ dao động", unit: "s" },
      { symbol: "m", name: "Khối lượng quả nặng", unit: "kg" },
      { symbol: "k", name: "Độ cứng của lò xo", unit: "N/m" },
    ],
    condition: "Lò xo nhẹ tuân theo định luật Hooke, bỏ qua ma sát.",
    workedExample: "Vật m = 0,4 kg gắn lò xo k = 100 N/m ⇒ T = 2π√(0,4/100) ≈ 0,40 s.",
    calculator: {
      inputs: [
        { symbol: "m", label: "Khối lượng (m)", unit: "kg", defaultVal: 0.4, min: 0.01 },
        { symbol: "k", label: "Độ cứng (k)", unit: "N/m", defaultVal: 100, min: 0.1 },
      ],
      calcFormula: (vals) => {
        const m = Math.max(0.01, vals.m ?? 0.4);
        const k = Math.max(0.1, vals.k ?? 100);
        const res = 2 * Math.PI * Math.sqrt(m / k);
        return {
          result: res,
          unit: "s",
          substitutionText: `T = 2π·√(${m} / ${k}) = ${res.toFixed(3)} s`,
        };
      },
    },
  },
  {
    id: "f11-buoc-song-co",
    name: "Công thức bước sóng cơ học",
    grade: "Lớp 11",
    domain: "Sóng",
    topic: "Sóng cơ học",
    expression: "λ = v / f = v·T",
    dimension: "[L] = [L·T⁻¹] / [T⁻¹]",
    meaning: "Quãng đường sóng truyền đi được trong một chu kỳ dao động.",
    variables: [
      { symbol: "λ", name: "Bước sóng", unit: "m" },
      { symbol: "v", name: "Tốc độ truyền sóng", unit: "m/s" },
      { symbol: "f", name: "Tần số sóng", unit: "Hz" },
    ],
    condition: "Môi trường truyền sóng đồng tính, đẳng hướng.",
    workedExample: "Sóng âm truyền trong không khí v = 340 m/s, f = 680 Hz ⇒ λ = 340/680 = 0,5 m.",
    relatedLessonPath: "lop-11/song/chu-de-1-song-co/bai-1-mo-ta-song/1-ly-thuyet-mo-ta-song",
    calculator: {
      inputs: [
        { symbol: "v", label: "Tốc độ sóng (v)", unit: "m/s", defaultVal: 340, min: 0.01 },
        { symbol: "f", label: "Tần số (f)", unit: "Hz", defaultVal: 680, min: 0.01 },
      ],
      calcFormula: (vals) => {
        const v = Math.max(0.01, vals.v ?? 340);
        const f = Math.max(0.01, vals.f ?? 680);
        const res = v / f;
        return {
          result: res,
          unit: "m",
          substitutionText: `λ = ${v} / ${f} = ${res.toFixed(3)} m`,
        };
      },
    },
  },
  {
    id: "f11-giao-thoa-young",
    name: "Khoảng vân giao thoa khe Young",
    grade: "Lớp 11",
    domain: "Quang học",
    topic: "Giao thoa ánh sáng",
    expression: "i = (λ·D) / a",
    dimension: "[mm] = ([μm]·[m]) / [mm]",
    meaning: "Khoảng cách giữa hai vân sáng (hoặc hai vân tối) liên tiếp trên màn quan sát.",
    variables: [
      { symbol: "i", name: "Khoảng vân", unit: "mm" },
      { symbol: "λ", name: "Bước sóng ánh sáng", unit: "μm (10⁻⁶ m)" },
      { symbol: "D", name: "Khoảng cách khe–màn", unit: "m" },
      { symbol: "a", name: "Khoảng cách 2 khe", unit: "mm" },
    ],
    condition: "Hai nguồn ánh sáng kết hợp; D ≫ a.",
    workedExample: "λ = 0,6 μm, D = 2 m, a = 1,2 mm ⇒ i = (0,6 × 2) / 1,2 = 1,0 mm.",
    relatedLessonPath:
      "lop-11/song/chu-de-3-giao-thoa-song/bai-2-giao-thoa-anh-sang/1-ly-thuyet-giao-thoa-anh-sang",
    calculator: {
      inputs: [
        {
          symbol: "lambdaUm",
          label: "Bước sóng (λ)",
          unit: "μm",
          defaultVal: 0.6,
          min: 0.1,
          step: 0.05,
        },
        { symbol: "D", label: "Khoảng cách màn (D)", unit: "m", defaultVal: 2.0, min: 0.1 },
        { symbol: "a", label: "Khoảng cách 2 khe (a)", unit: "mm", defaultVal: 1.2, min: 0.1 },
      ],
      calcFormula: (vals) => {
        const l = vals.lambdaUm ?? 0.6;
        const D = vals.D ?? 2.0;
        const a = Math.max(0.05, vals.a ?? 1.2);
        const res = (l * D) / a;
        return {
          result: res,
          unit: "mm",
          substitutionText: `i = (${l} · ${D}) / ${a} = ${res.toFixed(3)} mm`,
        };
      },
    },
  },
  {
    id: "f11-dinh-luat-ohm",
    name: "Định luật Ohm cho toàn mạch",
    grade: "Lớp 11",
    domain: "Điện học",
    topic: "Dòng điện không đổi",
    expression: "I = E / (R_N + r)",
    dimension: "[A] = [V] / [Ω]",
    meaning:
      "Cường độ dòng điện chạy trong mạch kín tỉ lệ thuận với suất điện động và tỉ lệ nghịch với điện trở toàn phần.",
    variables: [
      { symbol: "I", name: "Cường độ dòng điện", unit: "A" },
      { symbol: "E", name: "Suất điện động của nguồn", unit: "V" },
      { symbol: "R_N", name: "Điện trở mạch ngoài", unit: "Ω" },
      { symbol: "r", name: "Điện trở trong của nguồn", unit: "Ω" },
    ],
    condition: "Dòng điện không đổi, nguồn điện tuyến tính.",
    workedExample: "E = 12 V, R_N = 4 Ω, r = 1 Ω ⇒ I = 12 / (4 + 1) = 2,4 A.",
    calculator: {
      inputs: [
        { symbol: "E", label: "Suất điện động (E)", unit: "V", defaultVal: 12, min: 0 },
        { symbol: "RN", label: "Điện trở ngoài (R_N)", unit: "Ω", defaultVal: 4, min: 0 },
        { symbol: "r", label: "Điện trở trong (r)", unit: "Ω", defaultVal: 1, min: 0.01 },
      ],
      calcFormula: (vals) => {
        const E = vals.E ?? 0;
        const RN = Math.max(0, vals.RN ?? 0);
        const r = Math.max(0.01, vals.r ?? 1);
        const res = E / (RN + r);
        return {
          result: res,
          unit: "A",
          substitutionText: `I = ${E} / (${RN} + ${r}) = ${res.toFixed(2)} A`,
        };
      },
    },
  },
  {
    id: "f12-nhiet-luong-rieng",
    name: "Nhiệt lượng thu vào / tỏa ra (Q = m·c·ΔT)",
    grade: "Lớp 12",
    domain: "Nhiệt học",
    topic: "Vật lý nhiệt",
    expression: "Q = m·c·ΔT",
    dimension: "[J] = [M]·[L²·T⁻²·Θ⁻¹]·[Θ]",
    meaning:
      "Nhiệt lượng cần thiết để làm khối lượng m chất có nhiệt dung riêng c tăng thêm ΔT độ.",
    variables: [
      { symbol: "Q", name: "Nhiệt lượng", unit: "J" },
      { symbol: "m", name: "Khối lượng vật", unit: "kg" },
      { symbol: "c", name: "Nhiệt dung riêng", unit: "J/(kg·K)" },
      { symbol: "ΔT", name: "Độ biến thiên nhiệt độ", unit: "K hoặc °C" },
    ],
    condition: "Không xảy ra quá trình chuyển thể trong khoảng ΔT.",
    workedExample:
      "Đun 2 kg nước (c = 4180 J/kg·K) tăng thêm 50°C cần Q = 2 × 4180 × 50 = 418 000 J.",
    relatedLessonPath:
      "lop-12/nhiet-hoc/chu-de-1-nhiet-hoc/bai-1-thang-nhiet-do-nhiet-ke/1-ly-thuyet-thang-nhiet-do-nhiet-ke",
    calculator: {
      inputs: [
        { symbol: "m", label: "Khối lượng (m)", unit: "kg", defaultVal: 2, min: 0.01 },
        { symbol: "c", label: "Nhiệt dung riêng (c)", unit: "J/(kg·K)", defaultVal: 4180, min: 1 },
        { symbol: "dT", label: "Độ tăng nhiệt (ΔT)", unit: "K", defaultVal: 50 },
      ],
      calcFormula: (vals) => {
        const m = Math.max(0, vals.m ?? 2);
        const c = Math.max(0, vals.c ?? 4180);
        const dT = vals.dT ?? 50;
        const res = m * c * dT;
        return {
          result: res,
          unit: "J",
          substitutionText: `Q = ${m} · ${c} · ${dT} = ${res.toFixed(0)} J`,
        };
      },
    },
  },
  {
    id: "f12-phuong-trinh-khi-ly-tuong",
    name: "Phương trình trạng thái khí lý tưởng (Clapeyron - Mendeleev)",
    grade: "Lớp 12",
    domain: "Chất khí",
    topic: "Chất khí",
    expression: "p·V = n·R·T",
    dimension: "[Pa]·[m³] = [mol]·[J/(mol·K)]·[K]",
    meaning:
      "Mối liên hệ giữa áp suất, thể tích và nhiệt độ tuyệt đối của một khối lượng khí xác định.",
    variables: [
      { symbol: "p", name: "Áp suất", unit: "Pa (N/m²)" },
      { symbol: "V", name: "Thể tích", unit: "m³" },
      { symbol: "n", name: "Số mol khí", unit: "mol" },
      { symbol: "R", name: "Hằng số khí lý tưởng", unit: "8.314 J/(mol·K)" },
      { symbol: "T", name: "Nhiệt độ tuyệt đối", unit: "K" },
    ],
    condition: "Khí ở áp suất không quá cao và nhiệt độ không quá thấp.",
    workedExample:
      "1 mol khí ở T = 300 K trong bình V = 0,025 m³ có áp suất p = (1·8,314·300)/0,025 = 99 768 Pa.",
    relatedLessonPath:
      "lop-12/chat-khi/chu-de-1-chat-khi/bai-1-thuyet-dong-hoc-phan-tu-khi-ly-tuong/1-ly-thuyet-thuyet-dong-hoc-phan-tu-khi-ly-tuong",
    calculator: {
      inputs: [
        { symbol: "n", label: "Số mol (n)", unit: "mol", defaultVal: 1.0, min: 0.01 },
        { symbol: "T", label: "Nhiệt độ tuyệt đối (T)", unit: "K", defaultVal: 300, min: 1 },
        {
          symbol: "V",
          label: "Thể tích (V)",
          unit: "m³",
          defaultVal: 0.025,
          min: 0.001,
          step: 0.005,
        },
      ],
      calcFormula: (vals) => {
        const n = Math.max(0.01, vals.n ?? 1);
        const T = Math.max(1, vals.T ?? 300);
        const V = Math.max(0.001, vals.V ?? 0.025);
        const res = (n * 8.314 * T) / V;
        return {
          result: res,
          unit: "Pa",
          substitutionText: `p = (${n} · 8,314 · ${T}) / ${V} = ${res.toFixed(1)} Pa`,
        };
      },
    },
  },
  {
    id: "f12-luc-tu-ampere",
    name: "Lực từ tác dụng lên đoạn dây mang dòng điện",
    grade: "Lớp 12",
    domain: "Từ trường",
    topic: "Từ trường",
    expression: "F = B·I·L·sin(α)",
    dimension: "[N] = [T]·[A]·[m]",
    meaning:
      "Độ lớn lực từ tác dụng lên đoạn dây dẫn thẳng dài L mang dòng điện I đặt trong từ trường đều B hợp góc α.",
    variables: [
      { symbol: "F", name: "Lực từ", unit: "N" },
      { symbol: "B", name: "Cảm ứng từ", unit: "T (Tesla)" },
      { symbol: "I", name: "Cường độ dòng điện", unit: "A" },
      { symbol: "L", name: "Chiều dài dây trong từ trường", unit: "m" },
      { symbol: "α", name: "Góc giữa dòng điện và đường sức từ", unit: "độ" },
    ],
    condition: "Đoạn dây thẳng đặt trong từ trường đều.",
    workedExample:
      "B = 0,4 T, I = 5 A, L = 0,5 m đặt vuông góc (α = 90°) ⇒ F = 0,4 × 5 × 0,5 × 1 = 1,0 N.",
    relatedLessonPath: "lop-12/tu-truong/chu-de-1-tu-truong/bai-2-luc-tu/1-ly-thuyet-luc-tu",
    calculator: {
      inputs: [
        { symbol: "B", label: "Cảm ứng từ (B)", unit: "T", defaultVal: 0.4, min: 0 },
        { symbol: "I", label: "Cường độ dòng (I)", unit: "A", defaultVal: 5, min: 0 },
        { symbol: "L", label: "Chiều dài dây (L)", unit: "m", defaultVal: 0.5, min: 0 },
        { symbol: "alphaDeg", label: "Góc hợp (α)", unit: "°", defaultVal: 90, min: 0 },
      ],
      calcFormula: (vals) => {
        const B = vals.B ?? 0.4;
        const I = vals.I ?? 5;
        const L = vals.L ?? 0.5;
        const alphaDeg = vals.alphaDeg ?? 90;
        const res = B * I * L * Math.sin((alphaDeg * Math.PI) / 180);
        return {
          result: res,
          unit: "N",
          substitutionText: `F = ${B} · ${I} · ${L} · sin(${alphaDeg}°) = ${res.toFixed(3)} N`,
        };
      },
    },
  },
];
