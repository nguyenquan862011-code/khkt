export type VdcDifficulty = "Cơ bản" | "Thông hiểu" | "Vận dụng" | "Vận dụng cao";

export interface VdcProblem {
  id: string;
  code: string;
  grade: "Lớp 10" | "Lớp 11" | "Lớp 12";
  title: string;
  topic: string;
  difficulty: "VDC-01" | "VDC-02" | "VDC-03" | "VDC-04";
  tier: VdcDifficulty;
  statement: string;
  hint: string;
  visualKind:
    "train-vt" | "incline-spring" | "wave-phase" | "gas-cycle" | "projectile-wall" | "circuit-pmax";
  targetQuestion: string;
  targetUnit: string;
  targetTolerancePct: number;
  getTargetNumericAnswer: (params: Record<string, number>) => number;
  parameters: {
    label: string;
    unit: string;
    min: number;
    max: number;
    step: number;
    defaultVal: number;
  }[];
  solve: (params: Record<string, number>) => {
    steps: { stepTitle: string; formula: string; resultText: string }[];
    finalAnswer: string;
    insights: string;
  };
}

export const VDC_PROBLEMS: VdcProblem[] = [
  {
    id: "vdc10-01-chuyen-dong-nhieu-giai-doan",
    code: "VDC10-01",
    grade: "Lớp 10",
    title: "Chuyển động thẳng biến đổi qua 3 giai đoạn liên tiếp",
    topic: "Động học chất điểm",
    difficulty: "VDC-02",
    tier: "Vận dụng",
    statement:
      "Một đoàn tàu xuất phát từ ga (v₀ = 0) chuyển động nhanh dần đều với gia tốc a₁ trong thời gian t₁, sau đó chuyển động thẳng đều trong thời gian t₂, cuối cùng hãm phanh với gia tốc a₂ cho đến khi dừng hẳn. Tính tổng quãng đường S đi được.",
    hint: "Vận tốc cực đại đạt được ở cuối giai đoạn 1 là v_max = a₁·t₁. Thời gian hãm phanh t₃ = v_max / |a₂|. Tổng quãng đường chính là diện tích hình thang trên đồ thị v(t).",
    visualKind: "train-vt",
    targetQuestion: "Nhập tổng quãng đường S đoàn tàu đi được:",
    targetUnit: "m",
    targetTolerancePct: 2,
    getTargetNumericAnswer: (p) => {
      const a1 = p["Gia tốc tăng tốc (a₁)"] || 0.8;
      const t1 = p["Thời gian tăng tốc (t₁)"] || 30;
      const t2 = p["Thời gian chạy đều (t₂)"] || 60;
      const a2 = p["Độ lớn gia tốc hãm (|a₂|)"] || 1.2;
      const vMax = a1 * t1;
      return 0.5 * a1 * t1 * t1 + vMax * t2 + (vMax * vMax) / (2 * a2);
    },
    parameters: [
      {
        label: "Gia tốc tăng tốc (a₁)",
        unit: "m/s²",
        min: 0.2,
        max: 2.0,
        step: 0.1,
        defaultVal: 0.8,
      },
      { label: "Thời gian tăng tốc (t₁)", unit: "s", min: 10, max: 60, step: 5, defaultVal: 30 },
      { label: "Thời gian chạy đều (t₂)", unit: "s", min: 20, max: 120, step: 10, defaultVal: 60 },
      {
        label: "Độ lớn gia tốc hãm (|a₂|)",
        unit: "m/s²",
        min: 0.5,
        max: 3.0,
        step: 0.1,
        defaultVal: 1.2,
      },
    ],
    solve: (p) => {
      const a1 = p["Gia tốc tăng tốc (a₁)"] || 0.8;
      const t1 = p["Thời gian tăng tốc (t₁)"] || 30;
      const t2 = p["Thời gian chạy đều (t₂)"] || 60;
      const a2 = p["Độ lớn gia tốc hãm (|a₂|)"] || 1.2;

      const vMax = a1 * t1;
      const s1 = 0.5 * a1 * t1 * t1;
      const s2 = vMax * t2;
      const t3 = vMax / a2;
      const s3 = (vMax * vMax) / (2 * a2);
      const totalS = s1 + s2 + s3;
      const totalT = t1 + t2 + t3;
      const vAvg = totalS / totalT;

      return {
        steps: [
          {
            stepTitle: "Giai đoạn 1: Nhanh dần đều",
            formula: "v₁ = a₁·t₁; s₁ = ½·a₁·t₁²",
            resultText: `v_max = ${vMax.toFixed(1)} m/s (${(vMax * 3.6).toFixed(1)} km/h); s₁ = ${s1.toFixed(1)} m`,
          },
          {
            stepTitle: "Giai đoạn 2: Chuyển động thẳng đều",
            formula: "s₂ = v_max·t₂",
            resultText: `s₂ = ${s2.toFixed(1)} m trong ${t2} s`,
          },
          {
            stepTitle: "Giai đoạn 3: Chậm dần đều đến khi dừng",
            formula: "t₃ = v_max / |a₂|; s₃ = v_max² / (2·|a₂|)",
            resultText: `t₃ = ${t3.toFixed(2)} s; s₃ = ${s3.toFixed(1)} m`,
          },
        ],
        finalAnswer: `Tổng quãng đường S = ${totalS.toFixed(1)} m · Tổng thời gian T = ${totalT.toFixed(1)} s · Tốc độ trung bình: ${vAvg.toFixed(2)} m/s`,
        insights:
          "Đồ thị v-t là hình thang. Diện tích giới hạn bởi đồ thị và trục thời gian chính là tổng quãng đường di chuyển của đoàn tàu.",
      };
    },
  },
  {
    id: "vdc10-06-mat-phang-nghieng-ma-sat",
    code: "VDC10-06",
    grade: "Lớp 10",
    title: "Vật trượt trên mặt phẳng nghiêng có ma sát và va chạm lò xo",
    topic: "Động lực học & Năng lượng",
    difficulty: "VDC-03",
    tier: "Vận dụng cao",
    statement:
      "Vật khối lượng m trượt không vận tốc đầu từ đỉnh mặt phẳng nghiêng góc α, chiều dài d, hệ số ma sát μ (g = 9,8 m/s²). Ở chân mặt phẳng nghiêng, vật va chạm và nén lò xo có độ cứng k trên mặt phẳng ngang nhẵn. Tính độ nén cực đại của lò xo (theo cm).",
    hint: "Tính gia tốc dọc dốc a = g·(sinα − μ·cosα), suy ra vận tốc chân dốc v² = 2·a·d, rồi bảo toàn cơ năng ½mv² = ½kx_max².",
    visualKind: "incline-spring",
    targetQuestion: "Nhập độ nén cực đại của lò xo x_max:",
    targetUnit: "cm",
    targetTolerancePct: 3,
    getTargetNumericAnswer: (p) => {
      const m = p["Khối lượng vật (m)"] || 2.0;
      const alphaDeg = p["Góc nghiêng (α)"] || 30;
      const d = p["Chiều dài dốc (d)"] || 4.0;
      const mu = p["Hệ số ma sát (μ)"] || 0.1;
      const k = p["Độ cứng lò xo (k)"] || 400;
      const g = 9.8;
      const alphaRad = (alphaDeg * Math.PI) / 180;
      const a = g * (Math.sin(alphaRad) - mu * Math.cos(alphaRad));
      const vFoot = a > 0 ? Math.sqrt(2 * a * d) : 0;
      const wD = 0.5 * m * vFoot * vFoot;
      return k > 0 ? Math.sqrt((2 * wD) / k) * 100 : 0;
    },
    parameters: [
      { label: "Khối lượng vật (m)", unit: "kg", min: 0.5, max: 5.0, step: 0.5, defaultVal: 2.0 },
      { label: "Góc nghiêng (α)", unit: "độ", min: 15, max: 60, step: 5, defaultVal: 30 },
      { label: "Chiều dài dốc (d)", unit: "m", min: 1.0, max: 10.0, step: 0.5, defaultVal: 4.0 },
      { label: "Hệ số ma sát (μ)", unit: "", min: 0.05, max: 0.4, step: 0.05, defaultVal: 0.1 },
      { label: "Độ cứng lò xo (k)", unit: "N/m", min: 100, max: 1000, step: 50, defaultVal: 400 },
    ],
    solve: (p) => {
      const m = p["Khối lượng vật (m)"] || 2.0;
      const alphaDeg = p["Góc nghiêng (α)"] || 30;
      const d = p["Chiều dài dốc (d)"] || 4.0;
      const mu = p["Hệ số ma sát (μ)"] || 0.1;
      const k = p["Độ cứng lò xo (k)"] || 400;
      const g = 9.8;

      const alphaRad = (alphaDeg * Math.PI) / 180;
      const a = g * (Math.sin(alphaRad) - mu * Math.cos(alphaRad));
      const vFoot = a > 0 ? Math.sqrt(2 * a * d) : 0;
      const wD = 0.5 * m * vFoot * vFoot;
      const xMax = k > 0 ? Math.sqrt((2 * wD) / k) * 100 : 0;

      return {
        steps: [
          {
            stepTitle: "Gia tốc trên mặt dốc",
            formula: "a = g·(sinα - μ·cosα)",
            resultText: `a = ${a.toFixed(2)} m/s² (${a > 0 ? "Vật trượt xuống" : "Vật đứng yên do ma sát lớn"})`,
          },
          {
            stepTitle: "Tốc độ tại chân mặt phẳng nghiêng",
            formula: "v = √(2·a·d)",
            resultText: `v_chân = ${vFoot.toFixed(2)} m/s · Động năng Wđ = ${wD.toFixed(2)} J`,
          },
          {
            stepTitle: "Bảo toàn cơ năng khi nén lò xo",
            formula: "½·m·v² = ½·k·x_max² ⇒ x_max = v·√(m/k)",
            resultText: `Độ nén cực đại x_max = ${xMax.toFixed(2)} cm`,
          },
        ],
        finalAnswer: `Vận tốc chân dốc: ${vFoot.toFixed(2)} m/s · Độ nén cực đại lò xo: ${xMax.toFixed(2)} cm`,
        insights:
          "Công của lực ma sát làm tiêu hao một phần thế năng trọng trường thành nhiệt năng trước khi động năng chuyển hóa trọn vẹn thành thế năng đàn hồi của lò xo.",
      };
    },
  },
  {
    id: "vdc11-08-giao-thoa-song-lech-pha",
    code: "VDC11-08",
    grade: "Lớp 11",
    title: "Giao thoa hai nguồn kết hợp lệch pha góc Δφ",
    topic: "Sóng cơ học & Giao thoa",
    difficulty: "VDC-03",
    tier: "Vận dụng cao",
    statement:
      "Hai nguồn sóng A và B trên mặt nước cách nhau khoảng AB, phát sóng có cùng biên độ a, bước sóng λ và độ lệch pha Δφ = φ₂ − φ₁. Tìm số điểm dao động với biên độ cực đại trên đoạn thẳng nối hai nguồn AB (không tính 2 nguồn).",
    hint: "Điều kiện cực đại với hai nguồn lệch pha: d₂ − d₁ = (k + Δφ/(2π))·λ. Giải bất phương trình −AB < d₂ − d₁ < AB để đếm các giá trị nguyên k.",
    visualKind: "wave-phase",
    targetQuestion: "Nhập số điểm cực đại giao thoa trên đoạn AB:",
    targetUnit: "điểm",
    targetTolerancePct: 0.5,
    getTargetNumericAnswer: (p) => {
      const AB = p["Khoảng cách AB"] || 12;
      const lambda = p["Bước sóng (λ)"] || 2.0;
      const deltaPhiPi = p["Độ lệch pha (Δφ)"] ?? 0.5;
      const phaseShift = deltaPhiPi / 2;
      const eps = 1e-6;
      const minK = Math.floor(-AB / lambda - phaseShift + eps) + 1;
      const maxK = Math.ceil(AB / lambda - phaseShift - eps) - 1;
      return Math.max(0, maxK - minK + 1);
    },
    parameters: [
      { label: "Khoảng cách AB", unit: "cm", min: 6, max: 24, step: 1, defaultVal: 12 },
      { label: "Bước sóng (λ)", unit: "cm", min: 1.0, max: 4.0, step: 0.2, defaultVal: 2.0 },
      { label: "Độ lệch pha (Δφ)", unit: "π rad", min: 0, max: 2, step: 0.25, defaultVal: 0.5 },
    ],
    solve: (p) => {
      const AB = p["Khoảng cách AB"] || 12;
      const lambda = p["Bước sóng (λ)"] || 2.0;
      const deltaPhiPi = p["Độ lệch pha (Δφ)"] ?? 0.5;

      const phaseShift = deltaPhiPi / 2;
      const eps = 1e-6;
      const minK = Math.floor(-AB / lambda - phaseShift + eps) + 1;
      const maxK = Math.ceil(AB / lambda - phaseShift - eps) - 1;
      const numMax = Math.max(0, maxK - minK + 1);

      const minKT = Math.floor(-AB / lambda - phaseShift - 0.5 + eps) + 1;
      const maxKT = Math.ceil(AB / lambda - phaseShift - 0.5 - eps) - 1;
      const numMin = Math.max(0, maxKT - minKT + 1);

      return {
        steps: [
          {
            stepTitle: "Phương trình hiệu đường đi cực đại",
            formula: "d₂ - d₁ = (k + Δφ/(2π))·λ; với -AB < d₂ - d₁ < AB",
            resultText: `Điều kiện k nguyên: ${(-AB / lambda - phaseShift).toFixed(2)} < k < ${(AB / lambda - phaseShift).toFixed(2)} ⇒ k ∈ [${minK}; ${maxK}]`,
          },
          {
            stepTitle: "Vị trí cực đại trung tâm bị dịch chuyển",
            formula: "d₂ - d₁ = (Δφ / 2π)·λ khi k = 0",
            resultText: `Dịch chuyển khỏi trung điểm một đoạn Δx = ${((phaseShift * lambda) / 2).toFixed(2)} cm`,
          },
        ],
        finalAnswer: `Số cực đại giao thoa: ${numMax} vân · Số cực tiểu giao thoa: ${numMin} vân`,
        insights:
          "Khi hai nguồn lệch pha, vân cực đại trung tâm không còn nằm trên đường trung trực của AB mà bị dịch chuyển về phía nguồn dao động trễ pha hơn.",
      };
    },
  },
  {
    id: "vdc12-01-chu-trinh-khi-ly-tuong",
    code: "VDC12-01",
    grade: "Lớp 12",
    title: "Chu trình nhiệt động học p-V của lượng khí lý tưởng",
    topic: "Nhiệt học & Khí lý tưởng",
    difficulty: "VDC-04",
    tier: "Vận dụng cao",
    statement:
      "Một mol khí lý tưởng đơn nguyên tử thực hiện chu trình kín gồm: (1→2) đẳng tích nâng áp suất từ p₁ lên p₂ = 2p₁; (2→3) đẳng áp dãn nở thể tích từ V₁ lên V₂ = 2V₁; (3→1) đoạn thẳng trên đồ thị p-V đưa khí về trạng thái ban đầu. Tính công sinh ra trong toàn chu trình (J).",
    hint: "Trên hệ tọa độ p-V, chu trình 1→2→3→1 tạo thành một tam giác vuông có hai cạnh góc vuông là Δp = p₁ và ΔV = V₁. Chú ý đổi 1 kPa·L = 1 J.",
    visualKind: "gas-cycle",
    targetQuestion: "Nhập công A sinh ra trong 1 chu trình:",
    targetUnit: "J",
    targetTolerancePct: 2,
    getTargetNumericAnswer: (p) => {
      const p1 = (p["Áp suất ban đầu (p₁)"] || 100) * 1e3;
      const v1 = (p["Thể tích ban đầu (V₁)"] || 20) * 1e-3;
      return 0.5 * p1 * v1;
    },
    parameters: [
      { label: "Áp suất ban đầu (p₁)", unit: "kPa", min: 50, max: 200, step: 10, defaultVal: 100 },
      { label: "Thể tích ban đầu (V₁)", unit: "lít", min: 10, max: 50, step: 5, defaultVal: 20 },
    ],
    solve: (p) => {
      const p1KPa = p["Áp suất ban đầu (p₁)"] || 100;
      const v1L = p["Thể tích ban đầu (V₁)"] || 20;

      const p1 = p1KPa * 1e3;
      const v1 = v1L * 1e-3;

      const deltaP = p1;
      const deltaV = v1;
      const workJ = 0.5 * deltaP * deltaV;

      const q12 = 1.5 * v1 * deltaP;
      const q23 = 2.5 * 2 * p1 * deltaV;
      const qIn = q12 + q23;
      const efficiency = (workJ / qIn) * 100;

      return {
        steps: [
          {
            stepTitle: "Công sinh ra trong một chu trình (A)",
            formula: "A = Diện tích tam giác (1-2-3) = ½·(p₂ - p₁)·(V₂ - V₁)",
            resultText: `A = ½ · ${p1KPa} kPa · ${v1L} L = ${workJ.toFixed(1)} J`,
          },
          {
            stepTitle: "Nhiệt lượng khí nhận từ nguồn nóng (Q_nhận)",
            formula: "Q_nhận = Q₁₂ (đẳng tích) + Q₂₃ (đẳng áp)",
            resultText: `Q₁₂ = ${q12.toFixed(1)} J; Q₂₃ = ${q23.toFixed(1)} J ⇒ Q_nhận = ${qIn.toFixed(1)} J`,
          },
        ],
        finalAnswer: `Công chu trình A = ${workJ.toFixed(1)} J · Hiệu suất nhiệt động η = ${efficiency.toFixed(2)}%`,
        insights:
          "Công sinh ra trong chu trình khép kín bằng đúng diện tích hình học bao bởi chu trình trên hệ tọa độ p-V.",
      };
    },
  },
  {
    id: "vdc10-nem-xiên-co-ban",
    code: "VDC10-03",
    grade: "Lớp 10",
    title: "Tầm bay xa cực đại của chuyển động ném xiên từ mặt đất",
    topic: "Chuyển động ném",
    difficulty: "VDC-01",
    tier: "Thông hiểu",
    statement:
      "Bắn một quả cầu từ mặt đất (h₀ = 0) với vận tốc ban đầu v₀ theo góc ném α so với phương ngang (g = 9,8 m/s², bỏ qua sức cản). Tính tầm bay xa L của quả cầu.",
    hint: "Công thức tầm bay xa từ mặt đất: L = (v₀² · sin(2α)) / g.",
    visualKind: "projectile-wall",
    targetQuestion: "Nhập tầm bay xa L trên mặt đất:",
    targetUnit: "m",
    targetTolerancePct: 2,
    getTargetNumericAnswer: (p) => {
      const v0 = p["Vận tốc ném (v₀)"] || 20;
      const aRad = ((p["Góc ném (α)"] || 45) * Math.PI) / 180;
      return (v0 * v0 * Math.sin(2 * aRad)) / 9.8;
    },
    parameters: [
      { label: "Vận tốc ném (v₀)", unit: "m/s", min: 10, max: 40, step: 2, defaultVal: 20 },
      { label: "Góc ném (α)", unit: "độ", min: 15, max: 75, step: 5, defaultVal: 45 },
    ],
    solve: (p) => {
      const v0 = p["Vận tốc ném (v₀)"] || 20;
      const aDeg = p["Góc ném (α)"] || 45;
      const aRad = (aDeg * Math.PI) / 180;
      const g = 9.8;
      const tFlight = (2 * v0 * Math.sin(aRad)) / g;
      const hMax = Math.pow(v0 * Math.sin(aRad), 2) / (2 * g);
      const range = (v0 * v0 * Math.sin(2 * aRad)) / g;
      return {
        steps: [
          {
            stepTitle: "Thời gian bay toàn phần",
            formula: "T = 2·v₀·sin(α) / g",
            resultText: `T = ${tFlight.toFixed(2)} s ; Độ cao cực đại H = ${hMax.toFixed(2)} m`,
          },
          {
            stepTitle: "Tầm bay xa theo phương ngang",
            formula: "L = v₀·cos(α)·T = v₀²·sin(2α) / g",
            resultText: `L = ${range.toFixed(2)} m`,
          },
        ],
        finalAnswer: `Tầm bay xa L = ${range.toFixed(2)} m · Đạt cực đại tại góc 45°`,
        insights: "Hai góc ném phụ nhau (α và 90° − α) cho cùng tầm bay xa trên mặt phẳng ngang.",
      };
    },
  },
  {
    id: "vdc11-mach-cong-suat-cuc-dai",
    code: "VDC11-04",
    grade: "Lớp 11",
    title: "Cực đại công suất mạch ngoài theo định lý Cauchy",
    topic: "Dòng điện không đổi",
    difficulty: "VDC-02",
    tier: "Cơ bản",
    statement:
      "Cho nguồn điện có suất điện động E và điện trở trong r cấp điện cho biến trở R. Tính công suất tiêu thụ cực đại có thể đạt được trên biến trở R.",
    hint: "P = E²·R / (R + r)² = E² / (√R + r/√R)². Theo bất đẳng thức Cauchy, P đạt cực đại khi R = r ⇒ P_max = E² / (4r).",
    visualKind: "circuit-pmax",
    targetQuestion: "Nhập công suất cực đại P_max trên biến trở:",
    targetUnit: "W",
    targetTolerancePct: 2,
    getTargetNumericAnswer: (p) => {
      const E = p["Suất điện động (E)"] || 12;
      const r = p["Điện trở trong (r)"] || 2;
      return (E * E) / (4 * r);
    },
    parameters: [
      { label: "Suất điện động (E)", unit: "V", min: 6, max: 24, step: 2, defaultVal: 12 },
      { label: "Điện trở trong (r)", unit: "Ω", min: 1, max: 8, step: 0.5, defaultVal: 2 },
    ],
    solve: (p) => {
      const E = p["Suất điện động (E)"] || 12;
      const r = p["Điện trở trong (r)"] || 2;
      const pMax = (E * E) / (4 * r);
      const iOpt = E / (2 * r);
      return {
        steps: [
          {
            stepTitle: "Điều kiện phối hợp trở kháng",
            formula: "P = E²R / (R + r)² đạt max ⇔ R = r",
            resultText: `R_tối_ưu = ${r} Ω · Dòng điện I = ${iOpt.toFixed(2)} A`,
          },
          {
            stepTitle: "Công suất mạch ngoài cực đại",
            formula: "P_max = E² / (4·r)",
            resultText: `P_max = ${pMax.toFixed(2)} W (Hiệu suất lúc này đạt 50%)`,
          },
        ],
        finalAnswer: `Công suất cực đại P_max = ${pMax.toFixed(2)} W khi R = ${r} Ω`,
        insights:
          "Khi R = r, nguồn cung cấp công suất ra ngoài lớn nhất nhưng 50% năng lượng cũng tỏa nhiệt bên trong nguồn.",
      };
    },
  },
];
