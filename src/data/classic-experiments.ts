export type ClassicCategory =
  "co-hoc" | "song-dao-dong" | "dien-hoc" | "tu-truong" | "quang-hien-dai";

export interface ClassicExperimentParam {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultVal: number;
}

export interface ClassicExperiment {
  id: string;
  code: string;
  title: string;
  category: ClassicCategory;
  categoryName: string;
  scientist: string;
  year: string;
  significance: string;
  description: string;
  hypothesis: string;
  procedure: string[];
  modelParams: ClassicExperimentParam[];
  reflectionQuestion: string;
  reflectionOptions: string[];
  reflectionCorrectIndex: number;
  reflectionExplain: string;
  relatedLessonPath?: string;
  compute: (params: Record<string, number>) => {
    metrics: { label: string; value: string; unit: string }[];
    summary: string;
    lawConfirmed: string;
  };
}

export const CLASSIC_EXPERIMENTS: ClassicExperiment[] = [
  {
    id: "ce01-galilei-roi-tu-do",
    code: "CE01",
    title: "Thí nghiệm Galilei về sự rơi tự do",
    category: "co-hoc",
    categoryName: "Cơ học & Động lực học",
    scientist: "Galileo Galilei",
    year: "1589 (Tháp nghiêng Pisa)",
    significance: "Bác bỏ quan niệm Aristotle: Mọi vật trong chân không đều rơi cùng gia tốc g.",
    description:
      "So sánh chuyển động rơi của hai vật thể có khối lượng khác biệt từ cùng một độ cao h trong trường trọng lực Trái Đất.",
    hypothesis:
      "Nếu loại bỏ lực cản không khí, thời gian rơi chỉ phụ thuộc vào độ cao h và gia tốc trọng trường g, không phụ thuộc khối lượng vật.",
    procedure: [
      "Chọn độ cao thả rơi h và gia tốc trọng trường g tại vị trí khảo sát.",
      "Đặt hệ số cản không khí k = 0 để mô phỏng môi trường chân không.",
      "Quan sát hai quả cầu nặng/nhẹ rơi song song rồi tăng dần k để thấy sai lệch thực tế.",
    ],
    modelParams: [
      { label: "Độ cao ban đầu (h)", unit: "m", min: 5, max: 100, step: 5, defaultVal: 45 },
      {
        label: "Gia tốc trọng trường (g)",
        unit: "m/s²",
        min: 1.6,
        max: 24.8,
        step: 0.2,
        defaultVal: 9.8,
      },
      { label: "Lực cản không khí", unit: "k (cản)", min: 0, max: 0.1, step: 0.01, defaultVal: 0 },
    ],
    reflectionQuestion:
      "Trong buồng chân không hoàn toàn, nếu thả đồng thời một viên bi sắt và một chiếc lông chim từ độ cao 45 m thì vật nào chạm đất trước?",
    reflectionOptions: [
      "Viên bi sắt chạm đất trước vì nặng hơn",
      "Cả hai chạm đất cùng lúc với cùng gia tốc g",
      "Chiếc lông chim không chịu trọng lực nên đứng yên",
    ],
    reflectionCorrectIndex: 1,
    reflectionExplain:
      "Gia tốc rơi tự do a = P/m = mg/m = g không phụ thuộc vào khối lượng m khi lực cản bằng 0.",
    relatedLessonPath:
      "lop-10/co-hoc-phan-1/chu-de-2-mo-ta-chuyen-dong/bai-5-chuyen-dong-roi-tu-do/1-ly-thuyet-chuyen-dong-roi-tu-do",
    compute: (params) => {
      const h = params["Độ cao ban đầu (h)"] ?? 45;
      const g = params["Gia tốc trọng trường (g)"] ?? 9.8;
      const k = params["Lực cản không khí"] ?? 0;
      const tIdeal = Math.sqrt((2 * h) / g);
      const vIdeal = Math.sqrt(2 * g * h);
      const tReal = k > 0 ? tIdeal * (1 + k * 1.5) : tIdeal;
      return {
        metrics: [
          { label: "Thời gian rơi lý tưởng (t)", value: tIdeal.toFixed(2), unit: "s" },
          { label: "Vận tốc chạm đất (v)", value: vIdeal.toFixed(2), unit: "m/s" },
          { label: "Thời gian có lực cản", value: tReal.toFixed(2), unit: "s" },
        ],
        summary: `Ở độ cao ${h}m và g = ${g}m/s², vật chạm đất sau ${tIdeal.toFixed(2)}s với tốc độ ${vIdeal.toFixed(2)}m/s, hoàn toàn không phụ thuộc khối lượng m.`,
        lawConfirmed: "Định luật rơi tự do: s = ½·g·t²; v = g·t",
      };
    },
  },
  {
    id: "ce02-galilei-mat-nghieng",
    code: "CE02",
    title: "Thí nghiệm máng nghiêng Galilei & Quán tính",
    category: "co-hoc",
    categoryName: "Cơ học & Động lực học",
    scientist: "Galileo Galilei",
    year: "1638",
    significance:
      "Phát hiện quy luật quãng đường tỉ lệ với bình phương thời gian và khái niệm quán tính.",
    description:
      "Cho bi lăn xuống mặt phẳng nghiêng góc α để làm chậm quá trình rơi tự do, đo gia tốc dọc mặt dốc.",
    hypothesis:
      "Gia tốc dọc mặt nghiêng tỉ lệ với sinα; khi bỏ qua ma sát vật đạt vận tốc chỉ phụ thuộc độ cao h.",
    procedure: [
      "Điều chỉnh góc nghiêng α và chiều dài dốc d.",
      "Bật hoặc giảm hệ số ma sát μ để so sánh với trường hợp lý tưởng.",
      "Theo dõi vận tốc cuối dốc và thời gian lăn.",
    ],
    modelParams: [
      { label: "Góc nghiêng (α)", unit: "độ", min: 10, max: 60, step: 2, defaultVal: 30 },
      { label: "Chiều dài máng (d)", unit: "m", min: 1, max: 10, step: 0.5, defaultVal: 4 },
      { label: "Hệ số ma sát lăn (μ)", unit: "", min: 0, max: 0.25, step: 0.01, defaultVal: 0.02 },
    ],
    reflectionQuestion:
      "Khi góc nghiêng α tăng lên (với ma sát rất nhỏ), gia tốc trượt dọc dốc thay đổi thế nào?",
    reflectionOptions: [
      "Tăng theo sinα và tiến tới g khi α → 90°",
      "Giảm dần về 0",
      "Không đổi theo góc nghiêng",
    ],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "a = g(sinα - μcosα), tăng dần theo góc nghiêng và bằng g khi thẳng đứng (α = 90°, μ = 0).",
    compute: (params) => {
      const alpha = ((params["Góc nghiêng (α)"] ?? 30) * Math.PI) / 180;
      const d = params["Chiều dài máng (d)"] ?? 4;
      const mu = params["Hệ số ma sát lăn (μ)"] ?? 0.02;
      const a = Math.max(0, 9.8 * (Math.sin(alpha) - mu * Math.cos(alpha)));
      const t = a > 0 ? Math.sqrt((2 * d) / a) : 0;
      const v = a * t;
      return {
        metrics: [
          { label: "Gia tốc dọc máng (a)", value: a.toFixed(2), unit: "m/s²" },
          { label: "Thời gian lăn (t)", value: a > 0 ? t.toFixed(2) : "∞", unit: "s" },
          { label: "Tốc độ cuối máng (v)", value: v.toFixed(2), unit: "m/s" },
        ],
        summary: `Máng nghiêng làm giảm gia tốc hiệu dụng xuống ${a.toFixed(2)} m/s², cho phép đo chính xác quy luật d ∝ t².`,
        lawConfirmed: "Gia tốc trên mặt nghiêng: a = g·(sinα − μ·cosα)",
      };
    },
  },
  {
    id: "ce03-con-lac-don-chu-ky",
    code: "CE03",
    title: "Thí nghiệm con lắc đơn và chu kỳ dao động",
    category: "co-hoc",
    categoryName: "Cơ học & Động lực học",
    scientist: "Galileo Galilei & Huygens",
    year: "1602 – 1656",
    significance: "Phát hiện tính đẳng thời của dao động nhỏ, làm nền tảng cho đồng hồ quả lắc.",
    description:
      "Khảo sát chu kỳ con lắc đơn T theo chiều dài dây l và gia tốc trọng trường g với biên độ góc nhỏ.",
    hypothesis:
      "Với góc lệch nhỏ, chu kỳ T tỉ lệ thuận với √l và nghịch với √g, độc lập với khối lượng quả nặng.",
    procedure: [
      "Thay đổi chiều dài dây treo l từ 0.2 m đến 4.0 m.",
      "Quan sát độ dài dây trên mô hình và sự thay đổi chu kỳ T₀.",
      "Tăng biên độ góc α₀ để kiểm tra sai khác so với công thức gần đúng góc nhỏ.",
    ],
    modelParams: [
      { label: "Chiều dài dây (l)", unit: "m", min: 0.2, max: 4.0, step: 0.1, defaultVal: 1.0 },
      {
        label: "Gia tốc trọng trường (g)",
        unit: "m/s²",
        min: 8.0,
        max: 12.0,
        step: 0.1,
        defaultVal: 9.8,
      },
      { label: "Biên độ góc (α₀)", unit: "độ", min: 2, max: 30, step: 2, defaultVal: 8 },
    ],
    reflectionQuestion:
      "Nếu tăng chiều dài dây treo con lắc đơn lên 4 lần (giữ nguyên g), chu kỳ dao động nhỏ thay đổi thế nào?",
    reflectionOptions: ["Tăng lên 2 lần", "Tăng lên 4 lần", "Giảm đi 2 lần"],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "Vì T = 2π√(l/g) nên T tỉ lệ thuận với √l; l tăng 4 lần thì T tăng √4 = 2 lần.",
    relatedLessonPath:
      "lop-10/co-hoc-phan-1/chu-de-1-gioi-thieu-muc-dich-hoc-tap-mon-vat-ly/bai-3-sai-so-trong-phep-do/2-vd6-do-chu-ki-con-lac-don",
    compute: (params) => {
      const l = params["Chiều dài dây (l)"] ?? 1.0;
      const g = params["Gia tốc trọng trường (g)"] ?? 9.8;
      const a0Deg = params["Biên độ góc (α₀)"] ?? 8;
      const a0Rad = (a0Deg * Math.PI) / 180;
      const tSmall = 2 * Math.PI * Math.sqrt(l / g);
      const tLarge = tSmall * (1 + (1 / 16) * Math.pow(a0Rad, 2));
      const f = 1 / tSmall;
      return {
        metrics: [
          { label: "Chu kỳ góc nhỏ (T₀)", value: tSmall.toFixed(3), unit: "s" },
          { label: "Tần số dao động (f)", value: f.toFixed(3), unit: "Hz" },
          { label: "Chu kỳ hiệu chỉnh góc lớn", value: tLarge.toFixed(3), unit: "s" },
        ],
        summary: `Với dây dài ${l}m, chu kỳ T = ${tSmall.toFixed(2)}s. Chu kỳ tỉ lệ thuận với căn bậc hai của l và không phụ thuộc khối lượng vật nặng.`,
        lawConfirmed: "Công thức con lắc đơn: T = 2π√(l/g)",
      };
    },
  },
  {
    id: "ce04-atwood-dinh-luat-2-newton",
    code: "CE04",
    title: "Máy Atwood kiểm chứng Định luật II Newton",
    category: "co-hoc",
    categoryName: "Cơ học & Động lực học",
    scientist: "George Atwood",
    year: "1784",
    significance:
      "Đo chính xác gia tốc chậm lại của hệ hai vật nối qua ròng rọc để kiểm chứng F = ma.",
    description:
      "Hai vật m₁ và m₂ treo ở hai đầu dây vắt qua ròng rọc nhẹ không ma sát; hiệu trọng lượng (m₁ − m₂)g gây gia tốc cho tổng khối lượng (m₁ + m₂).",
    hypothesis:
      "Gia tốc hệ tỉ lệ thuận với hiệu khối lượng (m₁ − m₂) và tỉ lệ nghịch với tổng khối lượng (m₁ + m₂).",
    procedure: [
      "Chọn khối lượng m₁ > m₂.",
      "Tính hợp lực kéo (m₁ − m₂)g và tổng khối lượng quán tính (m₁ + m₂).",
      "Kiểm tra lực căng dây T luôn nằm giữa m₂g và m₁g.",
    ],
    modelParams: [
      { label: "Khối lượng m₁", unit: "kg", min: 0.5, max: 5.0, step: 0.1, defaultVal: 2.2 },
      { label: "Khối lượng m₂", unit: "kg", min: 0.5, max: 5.0, step: 0.1, defaultVal: 1.8 },
    ],
    reflectionQuestion:
      "Nếu m₁ = m₂ trong máy Atwood lý tưởng, gia tốc và lực căng dây bằng bao nhiêu?",
    reflectionOptions: ["a = 0 và T = m₁g", "a = g và T = 0", "a = g/2 và T = 2m₁g"],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "Khi m₁ = m₂, hai trọng lực cân bằng nhau nên hợp lực bằng 0, gia tốc a = 0 và T = m₁g.",
    relatedLessonPath:
      "lop-10/co-hoc-phan-1/chu-de-3-luc-va-chuyen-dong/bai-2-ba-dinh-luat-newton/1-ly-thuyet-ba-dinh-luat-newton",
    compute: (params) => {
      const m1 = params["Khối lượng m₁"] ?? 2.2;
      const m2 = params["Khối lượng m₂"] ?? 1.8;
      const g = 9.8;
      const a = ((m1 - m2) * g) / (m1 + m2);
      const T = (2 * m1 * m2 * g) / (m1 + m2);
      return {
        metrics: [
          { label: "Gia tốc hệ (a)", value: Math.abs(a).toFixed(2), unit: "m/s²" },
          { label: "Lực căng dây (T)", value: T.toFixed(2), unit: "N" },
          { label: "Hợp lực phát động", value: Math.abs((m1 - m2) * g).toFixed(2), unit: "N" },
        ],
        summary: `Hệ gia tốc chậm chỉ ${Math.abs(a).toFixed(2)} m/s² giúp học sinh đo trực tiếp sự tỉ lệ F = (m₁+m₂)a.`,
        lawConfirmed: "Định luật II Newton cho hệ vật: a = (m₁ − m₂)g / (m₁ + m₂)",
      };
    },
  },
  {
    id: "ce05-dinh-luat-hooke",
    code: "CE05",
    title: "Thí nghiệm kiểm chứng Định luật Hooke",
    category: "co-hoc",
    categoryName: "Cơ học & Động lực học",
    scientist: "Robert Hooke",
    year: "1676 (Ut tensio, sic vis)",
    significance: "Thiết lập mối quan hệ tuyến tính giữa lực đàn hồi và độ biến dạng của vật rắn.",
    description:
      "Treo các quả cân có khối lượng khác nhau vào lò xo có độ cứng k, đo độ dãn Δl để kiểm chứng tỷ lệ F/Δl.",
    hypothesis:
      "Trong giới hạn đàn hồi, độ dãn Δl của lò xo tỉ lệ thuận với trọng lượng P = mg treo vào.",
    procedure: [
      "Chọn độ cứng lò xo k (N/m).",
      "Thay đổi khối lượng tải m và đọc độ dãn Δl trên thước chia milimét.",
      "Tính thế năng đàn hồi Wt = ½kΔl².",
    ],
    modelParams: [
      { label: "Độ cứng lò xo (k)", unit: "N/m", min: 20, max: 200, step: 10, defaultVal: 100 },
      { label: "Khối lượng tải (m)", unit: "kg", min: 0.1, max: 2.0, step: 0.1, defaultVal: 0.5 },
    ],
    reflectionQuestion:
      "Nếu treo gấp đôi khối lượng vào cùng một lò xo (còn trong giới hạn đàn hồi), độ dãn Δl thay đổi thế nào?",
    reflectionOptions: ["Tăng gấp đôi", "Tăng gấp bốn", "Không đổi"],
    reflectionCorrectIndex: 0,
    reflectionExplain: "Theo định luật Hooke Δl = mg/k, độ dãn tỉ lệ bậc nhất với khối lượng m.",
    compute: (params) => {
      const k = params["Độ cứng lò xo (k)"] ?? 100;
      const m = params["Khối lượng tải (m)"] ?? 0.5;
      const g = 9.8;
      const F = m * g;
      const deltaL = (F / k) * 100;
      const energy = 0.5 * k * Math.pow(deltaL / 100, 2);
      return {
        metrics: [
          { label: "Lực đàn hồi (Fđh)", value: F.toFixed(2), unit: "N" },
          { label: "Độ dãn lò xo (Δl)", value: deltaL.toFixed(2), unit: "cm" },
          { label: "Thế năng đàn hồi (Wt)", value: energy.toFixed(3), unit: "J" },
        ],
        summary: `Tải trọng m = ${m}kg gây lực F = ${F.toFixed(2)}N, làm lò xo dãn Δl = ${deltaL.toFixed(2)}cm. Tỉ số F/Δl = ${k} N/m không đổi.`,
        lawConfirmed: "Định luật Hooke: Fđh = k·|Δl|",
      };
    },
  },
  {
    id: "ce06-cavendish-hang-so-hap-dan",
    code: "CE06",
    title: "Cân xoắn Cavendish đo hằng số hấp dẫn G",
    category: "co-hoc",
    categoryName: "Cơ học & Động lực học",
    scientist: "Henry Cavendish",
    year: "1798",
    significance: "Lần đầu tiên đo chính xác hằng số hấp dẫn G và 'cân được Trái Đất'.",
    description:
      "Hai quả cầu nhỏ trên thanh ngang treo bằng sợi mảnh bị hút về hai quả cầu chì lớn khối lượng M, làm góc xoắn θ dịch chuyển.",
    hypothesis:
      "Lực hấp dẫn giữa hai vật tỉ lệ với tích M·m và nghịch với bình phương khoảng cách r².",
    procedure: [
      "Thay đổi khối lượng quả cầu chì lớn M và khoảng cách r.",
      "Tính lực hấp dẫn siêu nhỏ F (cỡ nanoNewton).",
      "Quan sát góc lệch xoắn nhỏ θ được phóng đại bằng tia sáng phản xạ.",
    ],
    modelParams: [
      {
        label: "Khối lượng quả cầu lớn (M)",
        unit: "kg",
        min: 50,
        max: 300,
        step: 10,
        defaultVal: 158,
      },
      { label: "Khoảng cách tâm (r)", unit: "cm", min: 15, max: 40, step: 1, defaultVal: 22 },
    ],
    reflectionQuestion:
      "Nếu giảm khoảng cách giữa hai tâm quả cầu đi một nửa (r' = r/2), lực hấp dẫn thay đổi thế nào?",
    reflectionOptions: ["Tăng 4 lần", "Tăng 2 lần", "Giảm 4 lần"],
    reflectionCorrectIndex: 0,
    reflectionExplain: "Lực hấp dẫn tỉ lệ nghịch với r² nên giảm r đi 2 lần làm F tăng 2² = 4 lần.",
    compute: (params) => {
      const M = params["Khối lượng quả cầu lớn (M)"] ?? 158;
      const rCm = params["Khoảng cách tâm (r)"] ?? 22;
      const r = rCm * 0.01;
      const m = 0.73; // kg small sphere
      const G = 6.674e-11;
      const F = (G * M * m) / (r * r);
      return {
        metrics: [
          { label: "Lực hấp dẫn (F)", value: (F * 1e7).toFixed(2), unit: "×10⁻⁷ N" },
          { label: "Gia tốc tạo ra", value: ((F / m) * 1e7).toFixed(2), unit: "×10⁻⁷ m/s²" },
          { label: "Hằng số đo G", value: "6.674", unit: "×10⁻¹¹ N·m²/kg²" },
        ],
        summary: `Dù lực hấp dẫn chỉ cỡ ${(F * 1e7).toFixed(2)}×10⁻⁷ N, cân xoắn tinh nhạy đã xác định thành công G và khối lượng Trái Đất ≈ 5,97×10²⁴ kg.`,
        lawConfirmed: "Định luật vạn vật hấp dẫn Newton: F = G·M·m / r²",
      };
    },
  },
  {
    id: "ce07-newton-con-lac-va-cham",
    code: "CE07",
    title: "Con lắc Newton — Bảo toàn Động lượng & Cơ năng",
    category: "co-hoc",
    categoryName: "Cơ học & Động lực học",
    scientist: "Edme Mariotte & Isaac Newton",
    year: "1673 – 1687",
    significance:
      "Minh họa hoàn hảo sự bảo toàn đồng thời cả động lượng và động năng trong va chạm đàn hồi.",
    description:
      "Kéo lệch k viên bi giống nhau rồi thả rơi va chạm vào hàng bi còn lại; quan sát đúng k viên bi ở đầu đối diện bật ra với cùng tốc độ.",
    hypothesis:
      "Trong va chạm hoàn toàn đàn hồi giữa các quả cầu bằng nhau, cả ∑p và ∑Wđ đều bảo toàn.",
    procedure: [
      "Chọn số viên bi kéo lệch k (từ 1 đến 3) trong hệ 5 bi.",
      "Điều chỉnh góc kéo ban đầu α₀.",
      "Kiểm tra tổng động lượng chuyển giao và tốc độ va chạm.",
    ],
    modelParams: [
      { label: "Số bi kéo lệch (k)", unit: "bi", min: 1, max: 3, step: 1, defaultVal: 1 },
      { label: "Góc kéo ban đầu (α₀)", unit: "độ", min: 10, max: 45, step: 5, defaultVal: 25 },
    ],
    reflectionQuestion:
      "Tại sao khi thả 2 viên bi cùng lúc, không bao giờ chỉ có 1 viên bi ở đầu kia bật lên cao hơn gấp đôi để bảo toàn năng lượng?",
    reflectionOptions: [
      "Vì điều đó vi phạm định luật bảo toàn động lượng",
      "Vì trọng lực không cho phép",
      "Vì dây treo không chịu được lực",
    ],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "Để bảo toàn đồng thời mv (động lượng) và ½mv² (động năng), số bi bật ra phải đúng bằng số bi va chạm.",
    compute: (params) => {
      const k = params["Số bi kéo lệch (k)"] ?? 1;
      const aDeg = params["Góc kéo ban đầu (α₀)"] ?? 25;
      const aRad = (aDeg * Math.PI) / 180;
      const l = 0.25;
      const mOne = 0.05;
      const h = l * (1 - Math.cos(aRad));
      const v = Math.sqrt(2 * 9.8 * h);
      const pTotal = k * mOne * v;
      const wTotal = k * 0.5 * mOne * v * v;
      return {
        metrics: [
          { label: "Vận tốc va chạm (v)", value: v.toFixed(2), unit: "m/s" },
          { label: "Tổng động lượng (p)", value: (pTotal * 1000).toFixed(1), unit: "g·m/s" },
          { label: "Động năng truyền (Wđ)", value: (wTotal * 1000).toFixed(2), unit: "mJ" },
        ],
        summary: `Thả ${k} viên bi ở góc ${aDeg}° làm đúng ${k} viên bi ở đầu bên kia bật lên cùng độ cao ${(h * 100).toFixed(1)} cm.`,
        lawConfirmed: "Bảo toàn động lượng p = const và cơ năng E = const",
      };
    },
  },
  {
    id: "ce08-joule-nhiet-tuong-duong",
    code: "CE08",
    title: "Thí nghiệm guồng quay Joule & Nguyên lý I Nhiệt động lực học",
    category: "co-hoc",
    categoryName: "Cơ học & Động lực học",
    scientist: "James Prescott Joule",
    year: "1843 – 1845",
    significance: "Chứng minh công cơ học chuyển hóa trực tiếp thành nhiệt năng (1 cal ≈ 4,184 J).",
    description:
      "Quả nặng rơi xuống kéo trục guồng quay khuấy nước trong bình nhiệt lượng kế, làm nhiệt độ nước tăng lên ΔT.",
    hypothesis:
      "Công trọng lực của quả nặng chuyển hoàn toàn thành nội năng của nước: m·g·h = M_nước·c·ΔT.",
    procedure: [
      "Chọn khối lượng quả nặng m và tổng quãng đường rơi H.",
      "Tính công cơ học thực hiện A = m·g·H.",
      "Đo độ tăng nhiệt độ ΔT của 1 lít nước.",
    ],
    modelParams: [
      { label: "Khối lượng quả nặng (m)", unit: "kg", min: 5, max: 50, step: 5, defaultVal: 20 },
      { label: "Tổng quãng đường rơi (H)", unit: "m", min: 5, max: 40, step: 5, defaultVal: 20 },
    ],
    reflectionQuestion: "Thí nghiệm guồng quay nước của Joule chứng minh điều gì?",
    reflectionOptions: [
      "Nhiệt là một dạng năng lượng tương đương với công cơ học",
      "Nước chỉ nóng lên khi đun bằng lửa",
      "Thế năng biến mất hoàn toàn không chuyển hóa",
    ],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "Joule chứng minh định luật bảo toàn năng lượng: công cơ học có thể chuyển hóa định lượng thành nhiệt lượng.",
    compute: (params) => {
      const m = params["Khối lượng quả nặng (m)"] ?? 20;
      const H = params["Tổng quãng đường rơi (H)"] ?? 20;
      const workJ = m * 9.8 * H;
      const dT = workJ / (1.0 * 4184); // 1 kg water
      return {
        metrics: [
          { label: "Công cơ học (A)", value: workJ.toFixed(0), unit: "J" },
          { label: "Nhiệt lượng (Q)", value: (workJ / 4.184).toFixed(0), unit: "cal" },
          { label: "Độ tăng nhiệt 1kg nước", value: dT.toFixed(3), unit: "K" },
        ],
        summary: `Công cơ học ${workJ.toFixed(0)} J làm 1 kg nước tăng thêm ${dT.toFixed(3)} °C — xác nhận cơ năng và nhiệt năng có cùng bản chất năng lượng.`,
        lawConfirmed: "Đương lượng cơ - nhiệt: A = Q (1 cal ≈ 4,184 J)",
      };
    },
  },
  {
    id: "ce09-giao-thoa-khe-young",
    code: "CE09",
    title: "Thí nghiệm giao thoa ánh sáng hai khe Young",
    category: "song-dao-dong",
    categoryName: "Sóng & Dao động",
    scientist: "Thomas Young",
    year: "1801",
    significance: "Bằng chứng quyết định khẳng định bản chất sóng của ánh sáng.",
    description:
      "Chiếu chùm ánh sáng đơn sắc qua hai khe hẹp song song S₁S₂ cách nhau khoảng a, quan sát hệ vân giao thoa trên màn cách D.",
    hypothesis:
      "Hai chùm sáng kết hợp từ khe đôi chồng chất tạo thành các vân sáng cực đại và vân tối cực tiểu cách đều nhau.",
    procedure: [
      "Chọn bước sóng λ (380 nm tím đến 760 nm đỏ).",
      "Điều chỉnh khoảng cách hai khe a và khoảng cách màn D.",
      "Đo khoảng vân i và quan sát sự thay đổi độ rộng hệ vân trên màn.",
    ],
    modelParams: [
      { label: "Bước sóng (λ)", unit: "nm", min: 380, max: 760, step: 10, defaultVal: 632 },
      {
        label: "Khoảng cách 2 khe (a)",
        unit: "mm",
        min: 0.2,
        max: 2.0,
        step: 0.1,
        defaultVal: 1.0,
      },
      {
        label: "Khoảng cách đến màn (D)",
        unit: "m",
        min: 0.5,
        max: 3.0,
        step: 0.1,
        defaultVal: 2.0,
      },
    ],
    reflectionQuestion:
      "Nếu thay ánh sáng đỏ (λ = 650 nm) bằng ánh sáng lam (λ = 450 nm) trong cùng thí nghiệm Young, khoảng vân i thay đổi ra sao?",
    reflectionOptions: [
      "Khoảng vân i giảm đi vì λ giảm",
      "Khoảng vân i tăng lên",
      "Khoảng vân i không đổi",
    ],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "Vì i = λD/a tỉ lệ thuận với bước sóng λ, ánh sáng lam bước sóng ngắn hơn nên các vân xếp khít hơn.",
    relatedLessonPath:
      "lop-11/song/chu-de-3-giao-thoa-song/bai-2-giao-thoa-anh-sang/1-ly-thuyet-giao-thoa-anh-sang",
    compute: (params) => {
      const lambdaNm = params["Bước sóng (λ)"] ?? 632;
      const aMm = params["Khoảng cách 2 khe (a)"] ?? 1.0;
      const D = params["Khoảng cách đến màn (D)"] ?? 2.0;
      const iMm = (lambdaNm * 1e-6 * D) / (aMm * 1e-3);
      const xBright3 = 3 * iMm;
      return {
        metrics: [
          { label: "Khoảng vân (i)", value: iMm.toFixed(2), unit: "mm" },
          { label: "Tọa độ vân sáng bậc 3", value: xBright3.toFixed(2), unit: "mm" },
          { label: "Vị trí vân tối thứ 1", value: (0.5 * iMm).toFixed(2), unit: "mm" },
        ],
        summary: `Với λ = ${lambdaNm}nm, khoảng vân đo được là i = ${iMm.toFixed(2)}mm. Hai chùm sóng kết hợp giao thoa tạo nên các vân sáng xen kẽ vân tối.`,
        lawConfirmed: "Công thức khoảng vân Young: i = (λ·D) / a",
      };
    },
  },
  {
    id: "ce10-song-dung-tren-day",
    code: "CE10",
    title: "Thí nghiệm sóng dừng trên dây",
    category: "song-dao-dong",
    categoryName: "Sóng & Dao động",
    scientist: "Franz Melde",
    year: "1859",
    significance: "Quan sát trực tiếp sự giao thoa giữa sóng tới và sóng phản xạ tạo nút và bụng.",
    description:
      "Tạo dao động trên sợi dây đàn hồi chiều dài L căng giữa hai đầu cố định với số bó sóng k và tốc độ truyền v.",
    hypothesis:
      "Sóng dừng ổn định chỉ hình thành khi chiều dài dây bằng số nguyên lần nửa bước sóng: L = k·λ/2.",
    procedure: [
      "Thiết lập chiều dài dây L và tốc độ truyền sóng v.",
      "Chọn số bó sóng k mong muốn để tìm tần số cộng hưởng tương ứng.",
      "Đếm số bụng sóng (= k) và số nút sóng (= k + 1) trên dây.",
    ],
    modelParams: [
      { label: "Chiều dài dây (L)", unit: "m", min: 0.5, max: 3.0, step: 0.1, defaultVal: 1.2 },
      { label: "Tốc độ truyền sóng (v)", unit: "m/s", min: 10, max: 100, step: 5, defaultVal: 24 },
      { label: "Số bó sóng (k)", unit: "bó", min: 1, max: 6, step: 1, defaultVal: 3 },
    ],
    reflectionQuestion:
      "Trên một sợi dây hai đầu cố định có 4 bụng sóng dừng, số nút sóng (kể cả hai đầu dây) là bao nhiêu?",
    reflectionOptions: ["5 nút", "4 nút", "3 nút"],
    reflectionCorrectIndex: 0,
    reflectionExplain: "Với hai đầu cố định, số nút = số bụng + 1 = 4 + 1 = 5 nút.",
    relatedLessonPath: "lop-11/song/chu-de-4-song-dung/bai-1-song-dung/1-ly-thuyet-song-dung",
    compute: (params) => {
      const L = params["Chiều dài dây (L)"] ?? 1.2;
      const v = params["Tốc độ truyền sóng (v)"] ?? 24;
      const k = params["Số bó sóng (k)"] ?? 3;
      const lambda = (2 * L) / k;
      const f = v / lambda;
      return {
        metrics: [
          { label: "Tần số cộng hưởng (f)", value: f.toFixed(1), unit: "Hz" },
          { label: "Bước sóng (λ)", value: lambda.toFixed(2), unit: "m" },
          { label: "Số nút sóng (k+1)", value: (k + 1).toString(), unit: "nút" },
        ],
        summary: `Trên dây dài ${L}m hình thành ${k} bó sóng (ứng với ${k} bụng và ${k + 1} nút) khi tần số nguồn rung đạt ${f.toFixed(1)}Hz.`,
        lawConfirmed: "Điều kiện sóng dừng 2 đầu cố định: L = k·(λ/2)",
      };
    },
  },
  {
    id: "ce11-foucault-con-lac-trai-dat",
    code: "CE11",
    title: "Con lắc Foucault chứng minh Trái Đất tự quay",
    category: "co-hoc",
    categoryName: "Cơ học & Động lực học",
    scientist: "Léon Foucault",
    year: "1851 (Điện Panthéon, Paris)",
    significance:
      "Bằng chứng cơ học trực quan đầu tiên chứng minh Trái Đất tự quay quanh trục của nó.",
    description:
      "Một con lắc dây rất dài dao động tự do: mặt phẳng dao động giữ nguyên hướng trong không gian quán tính nhưng quay biểu kiến so với sàn nhà theo vĩ độ φ.",
    hypothesis:
      "Tốc độ quay biểu kiến của mặt phẳng dao động tỉ lệ với sin(φ), nhanh nhất ở cực và bằng 0 ở xích đạo.",
    procedure: [
      "Chọn vĩ độ địa lý φ nơi đặt con lắc.",
      "Quan sát tốc độ góc quay biểu kiến Ω = 15°/giờ × sin(φ).",
      "Tính chu kỳ quay trọn một vòng của mặt phẳng dao động.",
    ],
    modelParams: [
      { label: "Vĩ độ địa lý (φ)", unit: "độ", min: 5, max: 90, step: 1, defaultVal: 49 },
      { label: "Chiều dài dây (L)", unit: "m", min: 10, max: 70, step: 5, defaultVal: 67 },
    ],
    reflectionQuestion:
      "Nếu đặt con lắc Foucault ngay tại đường xích đạo (φ = 0°), mặt phẳng dao động có quay so với mặt đất không?",
    reflectionOptions: ["Không quay (Ω = 0)", "Quay trong 24 giờ", "Quay trong 12 giờ"],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "Vì Ω_Foucault = Ω_Trái Đất · sin(φ), tại xích đạo sin(0°) = 0 nên mặt phẳng dao động không quay biểu kiến.",
    compute: (params) => {
      const phiDeg = params["Vĩ độ địa lý (φ)"] ?? 49;
      const L = params["Chiều dài dây (L)"] ?? 67;
      const sinPhi = Math.sin((phiDeg * Math.PI) / 180);
      const degPerHour = 15 * sinPhi;
      const fullTurnHours = degPerHour > 0.01 ? 360 / degPerHour : 9999;
      const swingT = 2 * Math.PI * Math.sqrt(L / 9.8);
      return {
        metrics: [
          { label: "Tốc độ quay mặt phẳng", value: degPerHour.toFixed(2), unit: "°/giờ" },
          { label: "Chu kỳ quay trọn 360°", value: fullTurnHours.toFixed(1), unit: "giờ" },
          { label: "Chu kỳ lắc (T)", value: swingT.toFixed(1), unit: "s" },
        ],
        summary: `Tại vĩ độ ${phiDeg}°, mặt phẳng dao động xoay ${degPerHour.toFixed(2)}° mỗi giờ (mất ${fullTurnHours.toFixed(1)}h cho một vòng).`,
        lawConfirmed: "Tốc độ tiến động Foucault: Ω_p = ω_Đ · sin(φ)",
      };
    },
  },
  {
    id: "ce12-doppler-hieu-ung-song",
    code: "CE12",
    title: "Hiệu ứng Doppler đối với sóng âm chuyển động",
    category: "song-dao-dong",
    categoryName: "Sóng & Dao động",
    scientist: "Christian Doppler",
    year: "1842",
    significance:
      "Giải thích sự dịch tần số khi nguồn và máy thu chuyển động tương đối — ứng dụng từ radar đến vũ trụ học.",
    description:
      "Nguồn phát âm tần số f₀ di chuyển với tốc độ v_s lại gần (+) hoặc ra xa (−) người đứng yên trong không khí (v_âm = 340 m/s).",
    hypothesis:
      "Khi nguồn lại gần, các mặt sóng bị nén lại làm bước sóng giảm và tần số nghe được tăng lên.",
    procedure: [
      "Chọn tần số nguồn f₀ và vận tốc nguồn v_s.",
      "So sánh tần số thu khi nguồn tiến lại gần và khi nguồn lùi ra xa.",
    ],
    modelParams: [
      {
        label: "Tần số nguồn phát (f₀)",
        unit: "Hz",
        min: 200,
        max: 1200,
        step: 50,
        defaultVal: 500,
      },
      { label: "Tốc độ nguồn (v_s)", unit: "m/s", min: 0, max: 120, step: 5, defaultVal: 34 },
    ],
    reflectionQuestion:
      "Khi xe cứu thương đang hú còi chạy lại gần bạn rồi vụt qua ra xa, âm thanh bạn nghe thấy thay đổi thế nào?",
    reflectionOptions: [
      "Cao (tần số lớn hơn) khi lại gần, rồi trầm đột ngột khi đi xa",
      "Trầm khi lại gần, cao khi đi xa",
      "Tần số không thay đổi, chỉ âm lượng đổi",
    ],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "Khi nguồn lại gần f' = f₀·v/(v - v_s) > f₀; khi ra xa f'' = f₀·v/(v + v_s) < f₀.",
    compute: (params) => {
      const f0 = params["Tần số nguồn phát (f₀)"] ?? 500;
      const vs = params["Tốc độ nguồn (v_s)"] ?? 34;
      const vSound = 340;
      const fApproach = (f0 * vSound) / (vSound - vs);
      const fRecede = (f0 * vSound) / (vSound + vs);
      return {
        metrics: [
          { label: "Tần số khi lại gần", value: fApproach.toFixed(1), unit: "Hz" },
          { label: "Tần số khi ra xa", value: fRecede.toFixed(1), unit: "Hz" },
          { label: "Độ lệch tần số (Δf)", value: (fApproach - fRecede).toFixed(1), unit: "Hz" },
        ],
        summary: `Nguồn di chuyển với ${vs} m/s tạo độ nhảy tần số từ ${fApproach.toFixed(1)} Hz xuống ${fRecede.toFixed(1)} Hz khi vượt qua người quan sát.`,
        lawConfirmed: "Công thức Doppler: f' = f₀ · v / (v ∓ v_s)",
      };
    },
  },
  {
    id: "ce13-song-am-cong-huong-kundt",
    code: "CE13",
    title: "Ống Kundt — Đo tốc độ truyền âm trong khí",
    category: "song-dao-dong",
    categoryName: "Sóng & Dao động",
    scientist: "August Kundt",
    year: "1866",
    significance: "Hiện hình trực quan sóng dừng âm học bằng các đụn bụi mịn trong ống thủy tinh.",
    description:
      "Sóng âm tần số f tạo sóng dừng trong cột khí; khoảng cách giữa hai nút sóng liên tiếp d = λ/2 giúp xác định v = λf.",
    hypothesis:
      "Bột mịn tập trung tại các nút sóng (nơi biên độ dao động bằng 0), cách đều nhau một khoảng λ/2.",
    procedure: [
      "Điều chỉnh tần số nguồn âm f và nhiệt độ không khí T(°C).",
      "Đọc khoảng cách giữa hai đụn bột liên tiếp (λ/2) và tốc độ truyền âm thực tế.",
    ],
    modelParams: [
      { label: "Tần số âm (f)", unit: "Hz", min: 400, max: 2000, step: 50, defaultVal: 1000 },
      { label: "Nhiệt độ khí (t°C)", unit: "°C", min: 0, max: 50, step: 5, defaultVal: 25 },
    ],
    reflectionQuestion:
      "Trong ống Kundt, khoảng cách giữa hai đụn bụi tích tụ liên tiếp bằng bao nhiêu lần bước sóng?",
    reflectionOptions: ["λ / 2", "λ", "λ / 4"],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "Hai đụn bụi liên tiếp ứng với hai nút sóng kế tiếp, cách nhau nửa bước sóng λ/2.",
    compute: (params) => {
      const f = params["Tần số âm (f)"] ?? 1000;
      const tC = params["Nhiệt độ khí (t°C)"] ?? 25;
      const vAir = 331.4 + 0.606 * tC;
      const lambda = vAir / f;
      return {
        metrics: [
          { label: "Tốc độ truyền âm (v)", value: vAir.toFixed(1), unit: "m/s" },
          { label: "Bước sóng âm (λ)", value: (lambda * 100).toFixed(1), unit: "cm" },
          { label: "Khoảng cách 2 nút (λ/2)", value: (lambda * 50).toFixed(1), unit: "cm" },
        ],
        summary: `Ở ${tC}°C, tốc độ âm ${vAir.toFixed(1)} m/s tạo khoảng cách giữa các đụn bụi d = ${(lambda * 50).toFixed(1)} cm.`,
        lawConfirmed: "Đo bước sóng âm: λ = 2·d_nút ; v = λ·f",
      };
    },
  },
  {
    id: "ce14-boyle-mariotte-dang-nhiet",
    code: "CE14",
    title: "Thí nghiệm Boyle–Mariotte về quá trình đẳng nhiệt",
    category: "co-hoc",
    categoryName: "Cơ học & Động lực học",
    scientist: "Robert Boyle & Edme Mariotte",
    year: "1662 – 1676",
    significance:
      "Thiết lập định luật cơ bản đầu tiên của chất khí: p·V = const khi nhiệt độ không đổi.",
    description:
      "Nén từ từ một lượng khí lý tưởng trong xi-lanh ở nhiệt độ phòng cố định và ghi nhận áp suất tương ứng theo thể tích.",
    hypothesis: "Khi nhiệt độ T không đổi, áp suất chất khí tỉ lệ nghịch với thể tích.",
    procedure: [
      "Giữ cố định nhiệt độ T.",
      "Thay đổi thể tích xi-lanh V để quan sát áp suất p thay đổi ngược chiều.",
    ],
    modelParams: [
      { label: "Thể tích xi-lanh (V)", unit: "lít", min: 5, max: 40, step: 1, defaultVal: 20 },
      {
        label: "Nhiệt độ giữ ổn định (T)",
        unit: "K",
        min: 250,
        max: 450,
        step: 10,
        defaultVal: 300,
      },
    ],
    reflectionQuestion:
      "Nén đẳng nhiệt một khối khí lý tưởng từ thể tích 20 lít xuống 10 lít thì áp suất khí thay đổi ra sao?",
    reflectionOptions: ["Tăng gấp đôi", "Giảm đi một nửa", "Không đổi"],
    reflectionCorrectIndex: 0,
    reflectionExplain: "Theo định luật Boyle p₁V₁ = p₂V₂, khi V giảm 2 lần thì p tăng 2 lần.",
    relatedLessonPath:
      "lop-12/chat-khi/chu-de-1-chat-khi/bai-2-dinh-luat-boyle/1-ly-thuyet-dinh-luat-boyle",
    compute: (params) => {
      const V = params["Thể tích xi-lanh (V)"] ?? 20;
      const T = params["Nhiệt độ giữ ổn định (T)"] ?? 300;
      const pKPa = (1 * 8.314 * T) / V;
      return {
        metrics: [
          { label: "Áp suất khí (p)", value: pKPa.toFixed(1), unit: "kPa" },
          { label: "Tích p·V", value: (pKPa * V).toFixed(0), unit: "kPa·L" },
          { label: "Áp suất theo atm", value: (pKPa / 101.325).toFixed(2), unit: "atm" },
        ],
        summary: `Tích p·V = ${(pKPa * V).toFixed(0)} kPa·L giữ nguyên không đổi dọc theo đường hypebol đẳng nhiệt.`,
        lawConfirmed: "Định luật Boyle: p·V = const (T = const)",
      };
    },
  },
  {
    id: "ce15-coulomb-can-xoan-tinh-dien",
    code: "CE15",
    title: "Cân xoắn Coulomb — Định luật tương tác tĩnh điện",
    category: "dien-hoc",
    categoryName: "Điện học",
    scientist: "Charles-Augustin de Coulomb",
    year: "1785",
    significance:
      "Xác lập định luật nghịch đảo bình phương cho lực tương tác giữa hai điện tích điểm.",
    description:
      "Đo lực đẩy/hút tĩnh điện giữa hai quả cầu tích điện q₁ và q₂ cách nhau khoảng r trong chân không.",
    hypothesis: "Lực tĩnh điện tỉ lệ thuận với |q₁·q₂| và tỉ lệ nghịch với r².",
    procedure: [
      "Thay đổi độ lớn điện tích q₁, q₂ (μC).",
      "Điều chỉnh khoảng cách r (cm) và theo dõi lực tương tác Coulomb.",
    ],
    modelParams: [
      { label: "Điện tích |q₁|", unit: "μC", min: 1, max: 10, step: 0.5, defaultVal: 4 },
      { label: "Điện tích |q₂|", unit: "μC", min: 1, max: 10, step: 0.5, defaultVal: 3 },
      { label: "Khoảng cách (r)", unit: "cm", min: 5, max: 50, step: 1, defaultVal: 20 },
    ],
    reflectionQuestion:
      "Nếu tăng gấp đôi khoảng cách r giữa hai điện tích điểm và giữ nguyên điện tích thì lực Coulomb thay đổi thế nào?",
    reflectionOptions: ["Giảm đi 4 lần", "Giảm đi 2 lần", "Tăng 4 lần"],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "Vì F = k|q₁q₂|/r², tăng r lên 2 lần làm r² tăng 4 lần nên lực F giảm 4 lần.",
    compute: (params) => {
      const q1 = (params["Điện tích |q₁|"] ?? 4) * 1e-6;
      const q2 = (params["Điện tích |q₂|"] ?? 3) * 1e-6;
      const r = (params["Khoảng cách (r)"] ?? 20) * 1e-2;
      const k = 8.98755e9;
      const F = (k * q1 * q2) / (r * r);
      const E1 = (k * q1) / (r * r);
      return {
        metrics: [
          { label: "Lực tĩnh điện (F)", value: F.toFixed(2), unit: "N" },
          { label: "Cường độ điện trường (E₁)", value: (E1 / 1000).toFixed(1), unit: "kV/m" },
          { label: "Thế năng tương tác", value: (F * r).toFixed(3), unit: "J" },
        ],
        summary: `Hai điện tích cách nhau ${params["Khoảng cách (r)"] ?? 20} cm tương tác lực F = ${F.toFixed(2)} N theo đường nối hai tâm.`,
        lawConfirmed: "Định luật Coulomb: F = k·|q₁·q₂| / r²",
      };
    },
  },
  {
    id: "ce16-dinh-luat-ohm",
    code: "CE16",
    title: "Thí nghiệm kiểm chứng Định luật Ohm",
    category: "dien-hoc",
    categoryName: "Điện học",
    scientist: "Georg Simon Ohm",
    year: "1827",
    significance:
      "Thiết lập định luật cơ bản của dòng điện: Cường độ dòng điện tỉ lệ thuận với hiệu điện thế.",
    description:
      "Đo dòng điện I qua điện trở R khi thay đổi hiệu điện thế U giữa hai đầu đoạn mạch, vẽ đồ thị V-A.",
    hypothesis:
      "Với dây dẫn kim loại ở nhiệt độ ổn định, thương số U/I là hằng số bằng điện trở R.",
    procedure: [
      "Chọn giá trị điện trở R (Ω).",
      "Điều chỉnh hiệu điện thế U đặt vào hai đầu điện trở.",
      "Quan sát cường độ dòng I và công suất tỏa nhiệt P.",
    ],
    modelParams: [
      { label: "Điện trở (R)", unit: "Ω", min: 1, max: 50, step: 1, defaultVal: 10 },
      { label: "Hiệu điện thế (U)", unit: "V", min: 1, max: 24, step: 1, defaultVal: 12 },
    ],
    reflectionQuestion:
      "Nếu tăng gấp đôi hiệu điện thế đặt vào hai đầu một điện trở thuần không đổi, công suất tỏa nhiệt P thay đổi thế nào?",
    reflectionOptions: ["Tăng 4 lần", "Tăng 2 lần", "Giảm 2 lần"],
    reflectionCorrectIndex: 0,
    reflectionExplain: "Vì P = U²/R nên U tăng 2 lần làm công suất tỏa nhiệt tăng 2² = 4 lần.",
    compute: (params) => {
      const R = params["Điện trở (R)"] ?? 10;
      const U = params["Hiệu điện thế (U)"] ?? 12;
      const I = U / R;
      const P = U * I;
      return {
        metrics: [
          { label: "Cường độ dòng điện (I)", value: I.toFixed(2), unit: "A" },
          { label: "Công suất tiêu thụ (P)", value: P.toFixed(2), unit: "W" },
          { label: "Hệ số góc đồ thị (1/R)", value: (1 / R).toFixed(3), unit: "S" },
        ],
        summary: `Với U = ${U}V và R = ${R}Ω, dòng điện đo được là I = ${I.toFixed(2)}A. Đồ thị I(U) là đường thẳng đi qua gốc tọa độ.`,
        lawConfirmed: "Định luật Ohm cho đoạn mạch: I = U / R",
      };
    },
  },
  {
    id: "ce17-oersted-dong-dien-tu-truong",
    code: "CE17",
    title: "Thí nghiệm Oersted — Dòng điện sinh ra từ trường",
    category: "tu-truong",
    categoryName: "Từ trường & Cảm ứng",
    scientist: "Hans Christian Ørsted",
    year: "1820",
    significance:
      "Khám phá mối liên hệ đầu tiên giữa điện học và từ học: dòng điện làm lệch kim nam châm.",
    description:
      "Đặt kim la bàn song song dưới dây dẫn thẳng dài mang dòng điện I; khi đóng khóa K, kim nam châm bị lệch góc θ khỏi hướng Bắc–Nam.",
    hypothesis:
      "Dòng điện thẳng sinh ra từ trường vòng quanh dây B = 2×10⁻⁷·I / r vuông góc với dây dẫn.",
    procedure: [
      "Thay đổi cường độ dòng điện I qua dây dẫn.",
      "Điều chỉnh khoảng cách r từ dây dẫn đến kim la bàn.",
      "Quan sát góc lệch θ khi từ trường dây dẫn tổng hợp với từ trường Trái Đất (~35 μT).",
    ],
    modelParams: [
      { label: "Cường độ dòng điện (I)", unit: "A", min: 0, max: 15, step: 0.5, defaultVal: 5 },
      { label: "Khoảng cách dây–kim (r)", unit: "cm", min: 2, max: 15, step: 0.5, defaultVal: 5 },
    ],
    reflectionQuestion:
      "Nếu đổi chiều dòng điện chạy qua dây dẫn trong thí nghiệm Oersted, kim la bàn sẽ thế nào?",
    reflectionOptions: ["Lệch sang phía ngược lại", "Vẫn lệch cùng chiều cũ", "Không lệch nữa"],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "Theo quy tắc nắm tay phải, đổi chiều dòng điện làm vectơ cảm ứng từ B đổi chiều ngược lại.",
    relatedLessonPath:
      "lop-12/tu-truong/chu-de-1-tu-truong/bai-1-tu-truong-cam-ung-tu/1-ly-thuyet-tu-truong-cam-ung-tu",
    compute: (params) => {
      const I = params["Cường độ dòng điện (I)"] ?? 5;
      const rM = (params["Khoảng cách dây–kim (r)"] ?? 5) * 0.01;
      const bWireMicroT = ((2e-7 * I) / rM) * 1e6;
      const bEarthMicroT = 35;
      const thetaDeg = (Math.atan2(bWireMicroT, bEarthMicroT) * 180) / Math.PI;
      return {
        metrics: [
          { label: "Cảm ứng từ dòng điện (B)", value: bWireMicroT.toFixed(1), unit: "μT" },
          { label: "Góc lệch kim nam châm (θ)", value: thetaDeg.toFixed(1), unit: "°" },
          { label: "Từ trường Trái Đất nền", value: "35.0", unit: "μT" },
        ],
        summary: `Dòng ${I} A tạo từ trường ${bWireMicroT.toFixed(1)} μT làm kim nam châm lệch ${thetaDeg.toFixed(1)}° so với hướng Bắc từ.`,
        lawConfirmed: "Quy tắc Oersted – Biot-Savart: B = 2×10⁻⁷ · I / r",
      };
    },
  },
  {
    id: "ce18-ampere-tuong-tac-hai-dong-dien",
    code: "CE18",
    title: "Thí nghiệm Ampère — Lực từ giữa hai dây dẫn song song",
    category: "tu-truong",
    categoryName: "Từ trường & Cảm ứng",
    scientist: "André-Marie Ampère",
    year: "1820 – 1826",
    significance:
      "Thiết lập công thức lực tương tác từ và là cơ sở lịch sử để định nghĩa đơn vị Ampe (A).",
    description:
      "Hai dây dẫn thẳng dài song song cách nhau khoảng d mang dòng I₁ và I₂: cùng chiều thì hút nhau, ngược chiều thì đẩy nhau.",
    hypothesis:
      "Lực từ trên mỗi mét chiều dài dây tỉ lệ thuận với I₁·I₂ và tỉ lệ nghịch với khoảng cách d.",
    procedure: [
      "Chọn cường độ dòng I₁, I₂ và khoảng cách d giữa hai dây.",
      "Theo dõi lực từ trên 1 m chiều dài dây.",
    ],
    modelParams: [
      { label: "Dòng điện dây 1 (I₁)", unit: "A", min: 1, max: 20, step: 1, defaultVal: 8 },
      { label: "Dòng điện dây 2 (I₂)", unit: "A", min: 1, max: 20, step: 1, defaultVal: 10 },
      { label: "Khoảng cách 2 dây (d)", unit: "cm", min: 2, max: 20, step: 1, defaultVal: 5 },
    ],
    reflectionQuestion:
      "Hai dây dẫn song song mang dòng điện chạy ngược chiều nhau sẽ tương tác với nhau thế nào?",
    reflectionOptions: ["Đẩy nhau", "Hút nhau", "Không tương tác"],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "Hai dòng điện cùng chiều hút nhau, hai dòng điện ngược chiều đẩy nhau theo quy tắc bàn tay trái.",
    compute: (params) => {
      const i1 = params["Dòng điện dây 1 (I₁)"] ?? 8;
      const i2 = params["Dòng điện dây 2 (I₂)"] ?? 10;
      const d = (params["Khoảng cách 2 dây (d)"] ?? 5) * 0.01;
      const fPerM = (2e-7 * i1 * i2) / d;
      return {
        metrics: [
          { label: "Lực từ trên 1m dây", value: (fPerM * 1e3).toFixed(3), unit: "mN/m" },
          {
            label: "Cảm ứng từ B₁ tại dây 2",
            value: (((2e-7 * i1) / d) * 1e6).toFixed(1),
            unit: "μT",
          },
          { label: "Tích I₁·I₂", value: (i1 * i2).toFixed(0), unit: "A²" },
        ],
        summary: `Hai dây cách nhau ${params["Khoảng cách 2 dây (d)"] ?? 5} cm chịu lực tương tác ${(fPerM * 1e3).toFixed(3)} mN trên mỗi mét chiều dài.`,
        lawConfirmed: "Lực Ampère giữa 2 dòng song song: F/L = 2×10⁻⁷ · I₁I₂ / d",
      };
    },
  },
  {
    id: "ce19-cam-ung-faraday",
    code: "CE19",
    title: "Thí nghiệm Cảm ứng điện từ của Faraday",
    category: "tu-truong",
    categoryName: "Từ trường & Cảm ứng",
    scientist: "Michael Faraday",
    year: "1831",
    significance:
      "Phát hiện hiện tượng cảm ứng điện từ: Nền tảng của toàn bộ máy phát điện và văn minh điện khí hóa.",
    description:
      "Dịch chuyển nam châm qua cuộn dây gồm N vòng, biến thiên từ thông ΔΦ tạo ra suất điện động cảm ứng e_c.",
    hypothesis:
      "Suất điện động cảm ứng tỉ lệ thuận với số vòng dây N và tốc độ biến thiên từ thông ΔΦ/Δt.",
    procedure: [
      "Chọn số vòng dây N của ống dây.",
      "Điều chỉnh độ biến thiên từ thông ΔΦ (mWb) và khoảng thời gian Δt (s).",
      "Quan sát góc lệch kim điện kế ứng với suất điện động |e_c|.",
    ],
    modelParams: [
      { label: "Số vòng dây (N)", unit: "vòng", min: 50, max: 1000, step: 50, defaultVal: 200 },
      {
        label: "Độ biến thiên từ thông (ΔΦ)",
        unit: "mWb",
        min: 1,
        max: 20,
        step: 1,
        defaultVal: 5,
      },
      {
        label: "Thời gian biến thiên (Δt)",
        unit: "s",
        min: 0.05,
        max: 0.5,
        step: 0.05,
        defaultVal: 0.1,
      },
    ],
    reflectionQuestion:
      "Nếu giữ thanh nam châm đứng yên hoàn toàn bên trong lòng ống dây kín thì kim điện kế chỉ bao nhiêu?",
    reflectionOptions: ["Chỉ vạch 0 (không có dòng cảm ứng)", "Lệch cực đại", "Dao động liên tục"],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "Khi nam châm đứng yên so với cuộn dây, từ thông không biến thiên (ΔΦ = 0) nên e_c = 0.",
    compute: (params) => {
      const N = params["Số vòng dây (N)"] ?? 200;
      const deltaPhi = (params["Độ biến thiên từ thông (ΔΦ)"] ?? 5) * 1e-3;
      const deltaT = params["Thời gian biến thiên (Δt)"] ?? 0.1;
      const ec = (N * deltaPhi) / deltaT;
      return {
        metrics: [
          { label: "Suất điện động cảm ứng (|e_c|)", value: ec.toFixed(2), unit: "V" },
          {
            label: "Tốc độ biến thiên từ thông",
            value: (deltaPhi / deltaT).toFixed(3),
            unit: "Wb/s",
          },
          { label: "Từ thông tổng cộng (N·ΔΦ)", value: (N * deltaPhi).toFixed(2), unit: "Wb" },
        ],
        summary: `Từ thông biến thiên với tốc độ ${(deltaPhi / deltaT).toFixed(3)} Wb/s qua ${N} vòng dây sinh ra suất điện động cảm ứng e_c = ${ec.toFixed(2)}V.`,
        lawConfirmed: "Định luật Faraday: e_c = −N·(dΦ/dt)",
      };
    },
  },
  {
    id: "ce20-lenz-chieu-dong-cam-ung",
    code: "CE20",
    title: "Định luật Lenz — Chiều dòng điện cảm ứng & Bảo toàn năng lượng",
    category: "tu-truong",
    categoryName: "Từ trường & Cảm ứng",
    scientist: "Heinrich Lenz",
    year: "1834",
    significance:
      "Xác định dấu trừ trong định luật Faraday: dòng cảm ứng sinh ra từ trường chống lại nguyên nhân sinh ra nó.",
    description:
      "Thả nam châm rơi qua ống đồng dày so với ống nhựa: dòng điện xoáy Foucault sinh lực từ hãm làm nam châm rơi chậm hẳn lại trong ống đồng.",
    hypothesis:
      "Dòng điện cảm ứng luôn tạo ra lực hãm chống lại chuyển động tương đối của nam châm.",
    procedure: [
      "Chọn độ dẫn điện tương đối của thành ống (nhựa ≈ 0, nhôm/đồng cao).",
      "So sánh vận tốc rơi ổn định trong ống dẫn điện với rơi tự do.",
    ],
    modelParams: [
      {
        label: "Độ mạnh từ trường nam châm",
        unit: "B (T)",
        min: 0.2,
        max: 1.5,
        step: 0.1,
        defaultVal: 0.8,
      },
      { label: "Hệ số cản dòng xoáy", unit: "γ (s⁻¹)", min: 0, max: 12, step: 1, defaultVal: 6 },
    ],
    reflectionQuestion:
      "Vì sao nam châm rơi qua ống đồng không bị hút dính mà lại rơi chậm đều như qua chất lỏng đặc?",
    reflectionOptions: [
      "Dòng cảm ứng sinh từ trường chống lại sự biến thiên từ thông khi nam châm di chuyển",
      "Đồng có tính sắt từ mạnh hơn sắt",
      "Áp suất không khí trong ống đồng cao hơn",
    ],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "Theo định luật Lenz, dòng xoáy cảm ứng tạo lực từ ngược chiều vận tốc, biến cơ năng thành nhiệt năng trên thành đồng.",
    compute: (params) => {
      const B = params["Độ mạnh từ trường nam châm"] ?? 0.8;
      const gamma = params["Hệ số cản dòng xoáy"] ?? 6;
      const effDrag = Math.max(0.1, gamma * B);
      const vTerminal = 9.8 / effDrag;
      const tTube = 1.5 / Math.min(3.5, vTerminal);
      return {
        metrics: [
          { label: "Vận tốc giới hạn trong ống", value: vTerminal.toFixed(2), unit: "m/s" },
          { label: "Thời gian qua ống 1,5m", value: tTube.toFixed(2), unit: "s" },
          {
            label: "So với rơi chân không (0,55s)",
            value: `${(tTube / 0.55).toFixed(1)}×`,
            unit: "chậm hơn",
          },
        ],
        summary: `Lực hãm Lenz giới hạn vận tốc nam châm còn ${vTerminal.toFixed(2)} m/s, kéo dài thời gian qua ống 1,5m lên ${tTube.toFixed(2)} giây.`,
        lawConfirmed: "Định luật Lenz: Từ trường cảm ứng chống lại nguyên nhân sinh ra nó",
      };
    },
  },
  {
    id: "ce21-thomson-e-tren-m",
    code: "CE21",
    title: "Thí nghiệm J.J. Thomson đo tỉ số e/m của Electron",
    category: "dien-hoc",
    categoryName: "Điện học",
    scientist: "J.J. Thomson",
    year: "1897",
    significance: "Phát hiện hạt cơ bản đầu tiên — Electron — mở ra kỷ nguyên Vật lý hạ nguyên tử.",
    description:
      "Cho chùm tia âm cực đi qua vùng điện trường E và từ trường B vuông góc sao cho lực điện cân bằng lực từ Lorentz (v = E/B).",
    hypothesis:
      "Mọi nguyên tố đều chứa cùng một loại hạt mang điện tích âm có tỉ số e/m ≈ 1,76×10¹¹ C/kg.",
    procedure: [
      "Điều chỉnh cường độ điện trường E (kV/m) và cảm ứng từ B (mT).",
      "Tính vận tốc chọn lọc v = E/B và bán kính quỹ đạo khi ngắt điện trường.",
    ],
    modelParams: [
      { label: "Điện trường (E)", unit: "kV/m", min: 5, max: 50, step: 5, defaultVal: 20 },
      { label: "Từ trường (B)", unit: "mT", min: 0.5, max: 5.0, step: 0.5, defaultVal: 2.0 },
    ],
    reflectionQuestion:
      "Trong bộ chọn vận tốc Thomson, chùm electron truyền thẳng không lệch khi độ lớn lực điện eE bằng lực từ evB. Vận tốc hạt được chọn là?",
    reflectionOptions: ["v = E / B", "v = B / E", "v = E · B"],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "Cân bằng lực eE = evB suy ra v = E / B, không phụ thuộc vào điện tích hay khối lượng.",
    compute: (params) => {
      const E = (params["Điện trường (E)"] ?? 20) * 1000;
      const B = (params["Từ trường (B)"] ?? 2.0) * 1e-3;
      const v = E / B;
      const em = 1.7588e11;
      const R = v / (em * B);
      return {
        metrics: [
          { label: "Vận tốc chọn lọc (v = E/B)", value: (v / 1e6).toFixed(2), unit: "×10⁶ m/s" },
          { label: "Bán kính cong trong B (R)", value: (R * 100).toFixed(2), unit: "cm" },
          { label: "Tỉ số đặc trưng e/m", value: "1.759", unit: "×10¹¹ C/kg" },
        ],
        summary: `Ở E = ${E / 1000} kV/m và B = ${(B * 1000).toFixed(1)} mT, electron bay với tốc độ ${(v / 1e6).toFixed(2)}×10⁶ m/s và uốn cong bán kính ${(R * 100).toFixed(2)} cm.`,
        lawConfirmed: "Tỉ số điện tích riêng electron: e/m = E / (R·B²)",
      };
    },
  },
  {
    id: "ce22-millikan-giot-dau-dien-tich",
    code: "CE22",
    title: "Thí nghiệm giọt dầu Millikan — Lượng tử hóa điện tích",
    category: "dien-hoc",
    categoryName: "Điện học",
    scientist: "Robert A. Millikan & Harvey Fletcher",
    year: "1909",
    significance: "Chứng minh điện tích tồn tại theo từng lượng tử nguyên lần e ≈ 1,602×10⁻¹⁹ C.",
    description:
      "Cân bằng giọt dầu mang điện giữa hai bản tụ điện phẳng bằng cách điều chỉnh hiệu điện thế U sao cho F_điện = P.",
    hypothesis: "Mọi điện tích q đo được trên giọt dầu đều là bội số nguyên q = n·e.",
    procedure: [
      "Chọn khối lượng giọt dầu (theo đơn vị 10⁻¹⁵ kg) và khoảng cách bản tụ d.",
      "Điều chỉnh số electron dư n trên giọt dầu để tính hiệu điện thế cân bằng U.",
    ],
    modelParams: [
      { label: "Số electron dư (n)", unit: "hạt e", min: 1, max: 10, step: 1, defaultVal: 3 },
      {
        label: "Khối lượng giọt dầu",
        unit: "×10⁻¹⁵ kg",
        min: 1,
        max: 8,
        step: 0.5,
        defaultVal: 2.5,
      },
      { label: "Khoảng cách bản tụ (d)", unit: "mm", min: 5, max: 20, step: 1, defaultVal: 10 },
    ],
    reflectionQuestion: "Kết luận cốt lõi của thí nghiệm giọt dầu Millikan là gì?",
    reflectionOptions: [
      "Điện tích không liên tục mà bị lượng tử hóa thành bội số của e = 1,602×10⁻¹⁹ C",
      "Giọt dầu luôn mang điện dương",
      "Điện tích có thể nhận mọi giá trị thực nhỏ tùy ý",
    ],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "Millikan đo hàng nghìn giọt dầu và thấy q luôn chia hết cho giá trị cơ bản e ≈ 1,602×10⁻¹⁹ C.",
    compute: (params) => {
      const n = params["Số electron dư (n)"] ?? 3;
      const m = (params["Khối lượng giọt dầu"] ?? 2.5) * 1e-15;
      const d = (params["Khoảng cách bản tụ (d)"] ?? 10) * 1e-3;
      const e = 1.602e-19;
      const q = n * e;
      const U = (m * 9.8 * d) / q;
      return {
        metrics: [
          { label: "Điện tích giọt dầu (q)", value: (q * 1e19).toFixed(2), unit: "×10⁻¹⁹ C" },
          { label: "Điện áp cân bằng (U)", value: U.toFixed(0), unit: "V" },
          { label: "Trọng lượng giọt (P)", value: (m * 9.8 * 1e14).toFixed(2), unit: "×10⁻¹⁴ N" },
        ],
        summary: `Giọt dầu mang ${n} electron dư đứng lơ lửng chính xác khi điện áp đặt vào bản tụ đạt ${U.toFixed(0)} V.`,
        lawConfirmed: "Lượng tử hóa điện tích: q = n·e ; U = m·g·d / q",
      };
    },
  },
  {
    id: "ce23-wheatstone-cau-do-dien-tro",
    code: "CE23",
    title: "Mạch cầu Wheatstone cân bằng điện trở chính xác",
    category: "dien-hoc",
    categoryName: "Điện học",
    scientist: "Samuel Hunter Christie & Charles Wheatstone",
    year: "1833 – 1843",
    significance:
      "Phương pháp đo điện trở không phụ thuộc sai số sụt áp của nguồn điện — chuẩn mực đo lường điện.",
    description:
      "Bốn điện trở ghép hình cầu; điều chỉnh R₃ cho đến khi điện kế cầu chỉ đúng 0 (U_CD = 0) để suy ra R_x.",
    hypothesis:
      "Khi cầu cân bằng (I_G = 0), tích chéo các điện trở đối diện bằng nhau: R₁·R_x = R₂·R₃.",
    procedure: [
      "Đặt cặp điện trở tỷ lệ R₁, R₂ và biến trở R₃.",
      "Đọc giá trị R_x cần đo và kiểm tra dòng lệch qua điện kế nếu mất cân bằng.",
    ],
    modelParams: [
      { label: "Điện trở R₁", unit: "Ω", min: 10, max: 200, step: 10, defaultVal: 100 },
      { label: "Điện trở R₂", unit: "Ω", min: 10, max: 200, step: 10, defaultVal: 50 },
      { label: "Biến trở chuẩn R₃", unit: "Ω", min: 10, max: 200, step: 5, defaultVal: 60 },
    ],
    reflectionQuestion:
      "Điều kiện để dòng điện qua điện kế chính giữa cầu Wheatstone bằng 0 là gì?",
    reflectionOptions: ["R₁ / R₂ = R₃ / R_x", "R₁ + R₂ = R₃ + R_x", "R₁ · R₂ = R₃ · R_x"],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "Hai điểm C và D đồng thế khi tỷ lệ phân áp hai nhánh bằng nhau: R₁/(R₁+R₃) = R₂/(R₂+R_x), tức R₁·R_x = R₂·R₃.",
    compute: (params) => {
      const r1 = params["Điện trở R₁"] ?? 100;
      const r2 = params["Điện trở R₂"] ?? 50;
      const r3 = params["Biến trở chuẩn R₃"] ?? 60;
      const rx = (r2 * r3) / r1;
      return {
        metrics: [
          { label: "Điện trở cân bằng (R_x)", value: rx.toFixed(1), unit: "Ω" },
          { label: "Tỉ lệ nhánh (R₂/R₁)", value: (r2 / r1).toFixed(2), unit: "" },
          { label: "Điện áp lệch khi cân bằng", value: "0.00", unit: "mV" },
        ],
        summary: `Khi điện kế về 0 tại R₃ = ${r3} Ω, điện trở cần đo được xác định chính xác R_x = ${rx.toFixed(1)} Ω.`,
        lawConfirmed: "Điều kiện cân bằng cầu Wheatstone: R₁·R_x = R₂·R₃",
      };
    },
  },
  {
    id: "ce24-newton-tan-sac-lang-kinh",
    code: "CE24",
    title: "Thí nghiệm Newton về tán sắc ánh sáng qua lăng kính",
    category: "quang-hien-dai",
    categoryName: "Quang học & Vật lý hiện đại",
    scientist: "Isaac Newton",
    year: "1666 – 1672",
    significance:
      "Chứng minh ánh sáng trắng là hỗn hợp của vô số ánh sáng đơn sắc có chiết suất khác nhau.",
    description:
      "Chiếu chùm tia sáng trắng hẹp vào lăng kính góc chiết quang A = 60° ở góc tới i₁; quan sát tia đỏ và tia tím tách nhau góc tán sắc ΔD.",
    hypothesis:
      "Chiết suất thủy tinh tăng từ đỏ đến tím nên tia tím bị lệch về đáy nhiều hơn tia đỏ.",
    procedure: [
      "Điều chỉnh góc tới i₁ từ 35° đến 65°.",
      "So sánh góc lệch tia đỏ D_đỏ, tia tím D_tím và góc mở quang phổ ΔD.",
    ],
    modelParams: [
      { label: "Góc tới (i₁)", unit: "độ", min: 35, max: 65, step: 1, defaultVal: 48 },
      {
        label: "Chiết suất nền (n_đỏ)",
        unit: "",
        min: 1.45,
        max: 1.65,
        step: 0.01,
        defaultVal: 1.51,
      },
    ],
    reflectionQuestion:
      "Khi truyền qua lăng kính từ không khí vào thủy tinh, tia sáng đơn sắc màu nào bị lệch khỏi phương truyền ban đầu nhiều nhất?",
    reflectionOptions: ["Màu tím", "Màu vàng", "Màu đỏ"],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "Vì chiết suất đối với ánh sáng tím là lớn nhất (n_tím > ... > n_đỏ) nên tia tím có góc lệch D lớn nhất.",
    compute: (params) => {
      const i1Deg = params["Góc tới (i₁)"] ?? 48;
      const nRed = params["Chiết suất nền (n_đỏ)"] ?? 1.51;
      const nViolet = nRed + 0.031;
      const A = (60 * Math.PI) / 180;
      const i1 = (i1Deg * Math.PI) / 180;
      const calcD = (n: number) => {
        const r1 = Math.asin(Math.sin(i1) / n);
        const r2 = A - r1;
        const s2 = n * Math.sin(r2);
        if (Math.abs(s2) > 1) return null;
        return ((i1 + Math.asin(s2) - A) * 180) / Math.PI;
      };
      const dR = calcD(nRed);
      const dV = calcD(nViolet);
      return {
        metrics: [
          {
            label: "Góc lệch tia Đỏ (D_đỏ)",
            value: dR ? dR.toFixed(2) : "TIR",
            unit: dR ? "°" : "",
          },
          {
            label: "Góc lệch tia Tím (D_tím)",
            value: dV ? dV.toFixed(2) : "TIR",
            unit: dV ? "°" : "",
          },
          {
            label: "Góc tán sắc (ΔD)",
            value: dR && dV ? Math.abs(dV - dR).toFixed(2) : "TIR",
            unit: dR && dV ? "°" : "",
          },
        ],
        summary:
          dR && dV
            ? `Tia tím lệch ${dV.toFixed(2)}° lớn hơn tia đỏ ${dR.toFixed(2)}°, tách quang phổ rộng ΔD = ${Math.abs(dV - dR).toFixed(2)}°.`
            : "Tia tới bị phản xạ toàn phần tại mặt bên thứ hai của lăng kính.",
        lawConfirmed: "Công thức lăng kính: sin(i₁) = n·sin(r₁); D = i₁ + i₂ − A",
      };
    },
  },
  {
    id: "ce25-hieu-ung-quang-dien",
    code: "CE25",
    title: "Thí nghiệm Hiệu ứng quang điện ngoài",
    category: "quang-hien-dai",
    categoryName: "Quang học & Vật lý hiện đại",
    scientist: "Heinrich Hertz & Albert Einstein",
    year: "1887 – 1905",
    significance:
      "Chứng minh ánh sáng có tính chất hạt (photon), giải Nobel Vật lý 1921 của Einstein.",
    description:
      "Chiếu photon có bước sóng λ vào bề mặt kim loại có công thoát A để bứt electron quang điện, đo hiệu điện thế hãm Uh.",
    hypothesis:
      "Electron chỉ bật ra khi năng lượng photon hf ≥ A (tức bước sóng kích thích λ ≤ λ₀ = hc/A), bất kể cường độ chùm sáng.",
    procedure: [
      "Chọn bước sóng kích thích λ (200 nm tử ngoại đến 600 nm vàng-cam).",
      "Chọn kim loại với công thoát A tương ứng (Cs ≈ 2,1 eV; Na ≈ 2,3 eV; Zn ≈ 4,3 eV).",
      "Quan sát điều kiện bật electron và động năng cực đại Wđ0max.",
    ],
    modelParams: [
      {
        label: "Bước sóng kích thích (λ)",
        unit: "nm",
        min: 200,
        max: 600,
        step: 10,
        defaultVal: 280,
      },
      {
        label: "Công thoát kim loại (A)",
        unit: "eV",
        min: 1.8,
        max: 5.0,
        step: 0.1,
        defaultVal: 2.2,
      },
    ],
    reflectionQuestion:
      "Nếu ánh sáng kích thích có bước sóng lớn hơn giới hạn quang điện λ₀ của kim loại, việc tăng gấp 10 lần cường độ chùm sáng có làm electron bật ra không?",
    reflectionOptions: [
      "Không, vì năng lượng mỗi photon nhỏ hơn công thoát A",
      "Có, vì tổng năng lượng chùm sáng tăng",
      "Có, sau một thời gian tích lũy nhiệt",
    ],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "Theo thuyết lượng tử Einstein, từng photon tương tác với từng electron; khi ε = hc/λ < A thì quang điện không bao giờ xảy ra.",
    compute: (params) => {
      const lambdaNm = params["Bước sóng kích thích (λ)"] ?? 280;
      const AEv = params["Công thoát kim loại (A)"] ?? 2.2;
      const hC = 1240;
      const ePhoton = hC / lambdaNm;
      const lambda0 = hC / AEv;
      const isOccur = ePhoton >= AEv;
      const w0Max = isOccur ? ePhoton - AEv : 0;
      const Uh = isOccur ? w0Max : 0;
      return {
        metrics: [
          { label: "Năng lượng photon (ε)", value: ePhoton.toFixed(2), unit: "eV" },
          { label: "Giới hạn quang điện (λ₀)", value: lambda0.toFixed(1), unit: "nm" },
          { label: "Động năng ban đầu cực đại", value: w0Max.toFixed(2), unit: "eV" },
          { label: "Hiệu điện thế hãm (|Uh|)", value: Uh.toFixed(2), unit: "V" },
        ],
        summary: isOccur
          ? `Do λ (${lambdaNm}nm) ≤ λ₀ (${lambda0.toFixed(1)}nm), hiệu ứng quang điện xảy ra! Electron bứt ra với động năng cực đại ${w0Max.toFixed(2)}eV.`
          : `Do λ (${lambdaNm}nm) > λ₀ (${lambda0.toFixed(1)}nm), năng lượng photon không đủ thắng công thoát A. Không có electron bứt ra.`,
        lawConfirmed: "Phương trình Einstein: ε = h·f = A + Wđ0max",
      };
    },
  },
  {
    id: "ce26-rutherford-tan-xa-hat-alpha",
    code: "CE26",
    title: "Thí nghiệm tán xạ hạt Alpha của Rutherford",
    category: "quang-hien-dai",
    categoryName: "Quang học & Vật lý hiện đại",
    scientist: "Ernest Rutherford, Geiger & Marsden",
    year: "1909 – 1911",
    significance:
      "Phát hiện hạt nhân nguyên tử nhỏ bé mang điện dương — bác bỏ mô hình bánh pudding Thomson.",
    description:
      "Bắn chùm hạt α (He²⁺) năng lượng K vào lá vàng mỏng (Z = 79); đa số xuyên thẳng nhưng một số ít bị bật ngược lại góc lớn hơn 90°.",
    hypothesis:
      "Điện tích dương tập trung ở hạt nhân siêu nhỏ tại tâm; thông số va chạm b càng nhỏ thì góc tán xạ θ càng lớn.",
    procedure: [
      "Điều chỉnh động năng hạt α (MeV) và thông số va chạm b (fm).",
      "Tính góc lệch tán xạ Rutherford θ và khoảng cách tiếp cận gần nhất.",
    ],
    modelParams: [
      {
        label: "Động năng hạt α (K)",
        unit: "MeV",
        min: 2.0,
        max: 10.0,
        step: 0.5,
        defaultVal: 5.5,
      },
      { label: "Thông số va chạm (b)", unit: "fm", min: 5, max: 100, step: 5, defaultVal: 25 },
    ],
    reflectionQuestion:
      "Hiện tượng một tỉ lệ nhỏ hạt α bật ngược trở lại trong thí nghiệm lá vàng Rutherford chứng tỏ điều gì?",
    reflectionOptions: [
      "Nguyên tử chủ yếu rỗng, điện tích dương và hầu hết khối lượng tập trung ở hạt nhân rất nhỏ",
      "Nguyên tử đặc khít hoàn toàn",
      "Hạt α mang điện âm nên bị hút vào electron",
    ],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "Chỉ một hạt nhân nặng, tích điện dương tập trung trong bán kính cỡ fm mới tạo ra lực đẩy Coulomb đủ mạnh làm bật ngược hạt α.",
    compute: (params) => {
      const K = params["Động năng hạt α (K)"] ?? 5.5;
      const b = params["Thông số va chạm (b)"] ?? 25;
      // r_min head-on for Au (Z=79, z=2): D = 2*79*1.44 MeV*fm / K
      const D = (2 * 79 * 1.44) / K;
      const thetaRad = 2 * Math.atan(D / (2 * b));
      const thetaDeg = (thetaRad * 180) / Math.PI;
      return {
        metrics: [
          { label: "Góc tán xạ Rutherford (θ)", value: thetaDeg.toFixed(1), unit: "°" },
          { label: "Khoảng tiếp cận đối đầu", value: D.toFixed(1), unit: "fm" },
          { label: "Tỉ lệ lệch (b / D)", value: (b / D).toFixed(2), unit: "" },
        ],
        summary: `Ở thông số va chạm b = ${b} fm, hạt α bị đẩy lệch một góc θ = ${thetaDeg.toFixed(1)}° bởi hạt nhân Vàng (Z = 79).`,
        lawConfirmed: "Công thức tán xạ Rutherford: tan(θ/2) = (zZe²) / (8πε₀·K·b)",
      };
    },
  },
  {
    id: "ce27-quang-pho-vach-hydro-bohr",
    code: "CE27",
    title: "Quang phổ vạch Hydro & Tiên đề Bohr",
    category: "quang-hien-dai",
    categoryName: "Quang học & Vật lý hiện đại",
    scientist: "Niels Bohr & Johann Balmer",
    year: "1913",
    significance:
      "Lượng tử hóa quỹ đạo dừng của electron trong nguyên tử — giải thích chính xác các vạch quang phổ H.",
    description:
      "Khi electron chuyển từ mức năng lượng cao n_cao về mức thấp n_thấp (n_thấp = 2 là dãy Balmer nhìn thấy), nguyên tử phát photon có bước sóng λ xác định.",
    hypothesis: "Năng lượng các trạng thái dừng trong Hydro tuân theo E_n = −13,6 / n² (eV).",
    procedure: [
      "Chọn mức năng lượng ban đầu n_cao (3 đến 6) và mức cuối n_thấp (1: Lyman, 2: Balmer, 3: Paschen).",
      "Đọc bước sóng phát xạ λ và vùng quang phổ tương ứng.",
    ],
    modelParams: [
      { label: "Mức năng lượng cao (n_cao)", unit: "", min: 2, max: 6, step: 1, defaultVal: 3 },
      { label: "Mức năng lượng thấp (n_thấp)", unit: "", min: 1, max: 3, step: 1, defaultVal: 2 },
    ],
    reflectionQuestion:
      "Vạch Đỏ (H_α) nổi tiếng trong quang phổ phát xạ nhìn thấy của nguyên tử Hydro ứng với sự chuyển mức nào?",
    reflectionOptions: ["Từ n = 3 về n = 2", "Từ n = 2 về n = 1", "Từ n = 4 về n = 3"],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "Chuyển từ n = 3 về n = 2 phát photon năng lượng ΔE = 1,89 eV ứng với bước sóng λ ≈ 656 nm (vạch Đỏ H_α).",
    compute: (params) => {
      const nLow = Math.min(
        params["Mức năng lượng thấp (n_thấp)"] ?? 2,
        (params["Mức năng lượng cao (n_cao)"] ?? 3) - 1,
      );
      const nHigh = Math.max(nLow + 1, params["Mức năng lượng cao (n_cao)"] ?? 3);
      const eHigh = -13.6 / (nHigh * nHigh);
      const eLow = -13.6 / (nLow * nLow);
      const deltaE = eHigh - eLow;
      const lambdaNm = 1240 / deltaE;
      const band =
        lambdaNm < 380
          ? "Tử ngoại (Lyman)"
          : lambdaNm <= 760
            ? "Ánh sáng nhìn thấy (Balmer)"
            : "Hồng ngoại (Paschen)";
      return {
        metrics: [
          { label: "Năng lượng photon (ΔE)", value: deltaE.toFixed(2), unit: "eV" },
          { label: "Bước sóng phát xạ (λ)", value: lambdaNm.toFixed(1), unit: "nm" },
          {
            label: "Vùng quang phổ",
            value: band.split(" ")[0]!,
            unit: band.includes("Lyman") ? "UV" : band.includes("Balmer") ? "Visible" : "IR",
          },
        ],
        summary: `Chuyển quỹ đạo n = ${nHigh} → n = ${nLow} giải phóng photon ${deltaE.toFixed(2)} eV có bước sóng ${lambdaNm.toFixed(1)} nm (${band}).`,
        lawConfirmed: "Tiên đề Bohr: ε = E_cao − E_thấp = hc / λ",
      };
    },
  },
  {
    id: "ce28-malus-phan-cuc-anh-sang",
    code: "CE28",
    title: "Định luật Malus về phân cực ánh sáng",
    category: "quang-hien-dai",
    categoryName: "Quang học & Vật lý hiện đại",
    scientist: "Étienne-Louis Malus",
    year: "1809",
    significance:
      "Chứng minh sóng ánh sáng là sóng ngang thông qua cặp kính lọc phân cực xoay góc θ.",
    description:
      "Ánh sáng phân cực phẳng cường độ I₀ đi qua kính phân tích có trục truyền hợp góc θ với phương phân cực bị suy giảm theo I = I₀·cos²θ.",
    hypothesis:
      "Khi hai kính phân cực vuông góc (θ = 90°), cường độ sáng truyền qua triệt tiêu hoàn toàn.",
    procedure: [
      "Điều chỉnh góc hợp giữa hai trục phân cực θ từ 0° đến 90°.",
      "Đo tỉ lệ cường độ ánh sáng truyền qua I/I₀.",
    ],
    modelParams: [
      {
        label: "Góc giữa hai trục phân cực (θ)",
        unit: "độ",
        min: 0,
        max: 90,
        step: 5,
        defaultVal: 45,
      },
      {
        label: "Cường độ ban đầu (I₀)",
        unit: "W/m²",
        min: 10,
        max: 100,
        step: 10,
        defaultVal: 100,
      },
    ],
    reflectionQuestion:
      "Nếu đặt hai tấm kính phân cực sao cho trục truyền hợp với nhau góc 60°, cường độ sáng sau tấm thứ hai bằng bao nhiêu phần trăm cường độ phân cực đầu I₀?",
    reflectionOptions: ["25%", "50%", "75%"],
    reflectionCorrectIndex: 0,
    reflectionExplain: "cos²(60°) = (0,5)² = 0,25 = 25%.",
    compute: (params) => {
      const theta = ((params["Góc giữa hai trục phân cực (θ)"] ?? 45) * Math.PI) / 180;
      const i0 = params["Cường độ ban đầu (I₀)"] ?? 100;
      const ratio = Math.cos(theta) ** 2;
      const iOut = i0 * ratio;
      return {
        metrics: [
          { label: "Cường độ ló ra (I)", value: iOut.toFixed(1), unit: "W/m²" },
          { label: "Tỉ lệ truyền qua (cos²θ)", value: (ratio * 100).toFixed(1), unit: "%" },
          { label: "Cường độ bị hấp thụ", value: (i0 - iOut).toFixed(1), unit: "W/m²" },
        ],
        summary: `Tại góc θ = ${params["Góc giữa hai trục phân cực (θ)"] ?? 45}°, tấm phân tích cho ${(ratio * 100).toFixed(1)}% năng lượng ánh sáng phân cực đi qua.`,
        lawConfirmed: "Định luật Malus: I = I₀ · cos²θ",
      };
    },
  },
  {
    id: "ce29-hieu-ung-hall-ban-dan",
    code: "CE29",
    title: "Hiệu ứng Hall — Xác định mật độ và dấu hạt tải điện",
    category: "tu-truong",
    categoryName: "Từ trường & Cảm ứng",
    scientist: "Edwin Hall",
    year: "1879",
    significance:
      "Chứng minh dòng điện trong kim loại do hạt âm (electron) mang, nền tảng cảm biến từ trường hiện đại.",
    description:
      "Dòng điện I chạy qua bản mỏng bề dày d đặt trong từ trường vuông góc B sinh ra hiệu điện thế ngang U_H = I·B / (n·q·d).",
    hypothesis: "Lực từ Lorentz dạt hạt tải sang một mép bản, tạo điện trường cân bằng ngang.",
    procedure: [
      "Thay đổi dòng điện I (A) và cảm ứng từ B (T).",
      "Theo dõi điện áp Hall U_H xuất hiện vuông góc với cả dòng điện và từ trường.",
    ],
    modelParams: [
      { label: "Cảm ứng từ (B)", unit: "T", min: 0.1, max: 2.0, step: 0.1, defaultVal: 0.8 },
      { label: "Dòng điện (I)", unit: "A", min: 1, max: 20, step: 1, defaultVal: 5 },
      { label: "Bề dày bản (d)", unit: "mm", min: 0.2, max: 2.0, step: 0.2, defaultVal: 0.5 },
    ],
    reflectionQuestion: "Điện áp Hall U_H tỉ lệ với các đại lượng nào sau đây?",
    reflectionOptions: [
      "Tỉ lệ thuận với B và I, nghịch với bề dày d",
      "Tỉ lệ thuận với d và nghịch với B",
      "Không phụ thuộc B",
    ],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "U_H = I·B / (n·e·d), tăng khi tăng dòng I hoặc từ trường B và lớn hơn khi bản dẫn càng mỏng.",
    compute: (params) => {
      const B = params["Cảm ứng từ (B)"] ?? 0.8;
      const I = params["Dòng điện (I)"] ?? 5;
      const d = (params["Bề dày bản (d)"] ?? 0.5) * 1e-3;
      // Semiconductor wafer n ~ 5e21 m^-3 for clear mV scale
      const n = 5e21;
      const e = 1.602e-19;
      const uHallMv = ((I * B) / (n * e * d)) * 1000;
      return {
        metrics: [
          { label: "Hiệu điện thế Hall (U_H)", value: uHallMv.toFixed(2), unit: "mV" },
          {
            label: "Hệ số Hall (R_H)",
            value: ((1 / (n * e)) * 1e4).toFixed(2),
            unit: "×10⁻⁴ m³/C",
          },
          { label: "Độ nhạy từ (U_H/B)", value: (uHallMv / B).toFixed(2), unit: "mV/T" },
        ],
        summary: `Đặt bản mỏng dày ${params["Bề dày bản (d)"] ?? 0.5} mm trong từ trường ${B} T tạo ra điện áp Hall U_H = ${uHallMv.toFixed(2)} mV.`,
        lawConfirmed: "Điện áp Hall: U_H = (I·B) / (n·q·d)",
      };
    },
  },
  {
    id: "ce30-chu-ky-phong-xa-ban-ra",
    code: "CE30",
    title: "Định luật phân rã phóng xạ & Chu kỳ bán rã",
    category: "quang-hien-dai",
    categoryName: "Quang học & Vật lý hiện đại",
    scientist: "Ernest Rutherford & Frederick Soddy",
    year: "1902",
    significance:
      "Xác lập quy luật phân rã hàm mũ của hạt nhân nguyên tử — nền tảng định tuổi Carbon-14 và y học hạt nhân.",
    description:
      "Số hạt nhân phóng xạ còn lại sau thời gian t giảm theo quy luật N(t) = N₀·2^(−t/T), hoàn toàn độc lập với nhiệt độ hay áp suất ngoài.",
    hypothesis:
      "Cứ sau mỗi chu kỳ bán rã T, một nửa số hạt nhân còn lại bị phân rã thành hạt nhân con.",
    procedure: [
      "Chọn số chu kỳ bán rã đã trôi qua (t / T).",
      "Theo dõi phần trăm hạt nhân mẹ còn lại và phần trăm đã phân rã.",
    ],
    modelParams: [
      {
        label: "Thời gian trôi qua (t/T)",
        unit: "chu kỳ T",
        min: 0,
        max: 6,
        step: 0.25,
        defaultVal: 2.0,
      },
      { label: "Số hạt nhân đầu (N₀)", unit: "×10²⁰ hạt", min: 1, max: 10, step: 1, defaultVal: 8 },
    ],
    reflectionQuestion:
      "Sau 3 chu kỳ bán rã (t = 3T), phần trăm số hạt nhân phóng xạ ban đầu còn lại chưa phân rã là bao nhiêu?",
    reflectionOptions: ["12,5%", "25%", "33,3%"],
    reflectionCorrectIndex: 0,
    reflectionExplain: "N / N₀ = 2⁻³ = 1/8 = 12,5%.",
    compute: (params) => {
      const k = params["Thời gian trôi qua (t/T)"] ?? 2.0;
      const n0 = params["Số hạt nhân đầu (N₀)"] ?? 8;
      const fracRemain = Math.pow(0.5, k);
      const nRemain = n0 * fracRemain;
      const nDecayed = n0 - nRemain;
      return {
        metrics: [
          { label: "Hạt nhân còn lại N(t)", value: nRemain.toFixed(3), unit: "×10²⁰ hạt" },
          { label: "Tỉ lệ còn lại", value: (fracRemain * 100).toFixed(1), unit: "%" },
          { label: "Đã phân rã (ΔN)", value: nDecayed.toFixed(3), unit: "×10²⁰ hạt" },
        ],
        summary: `Sau ${k} chu kỳ bán rã, chỉ còn ${(fracRemain * 100).toFixed(1)}% hạt nhân mẹ (${nRemain.toFixed(2)}×10²⁰ hạt) chưa phân rã.`,
        lawConfirmed: "Định luật phóng xạ: N(t) = N₀ · 2^(−t/T)",
      };
    },
  },
];

// Additional 12 authentic experiments to complete the 30-experiment catalog cleanly
export const EXTRA_CLASSIC_EXPERIMENTS: ClassicExperiment[] = [
  {
    id: "ce31-archimedes-luc-day-noi",
    code: "CE31",
    title: "Lực đẩy Ác-si-mét & Sự nổi của vật trong chất lỏng",
    category: "co-hoc",
    categoryName: "Cơ học & Động lực học",
    scientist: "Archimedes xứ Syracuse",
    year: "~246 TCN",
    significance: "Định luật thủy tĩnh học nền tảng về lực đẩy chất lưu và thiết kế tàu thủy.",
    description:
      "Nhúng vật thể tích V vào chất lỏng khối lượng riêng D; lực đẩy hướng thẳng đứng lên trên bằng trọng lượng phần chất lỏng bị chiếm chỗ.",
    hypothesis: "F_A = D_lỏng · g · V_chìm.",
    procedure: [
      "Thay đổi thể tích phần chìm (lít).",
      "Chọn khối lượng riêng chất lỏng (nước 1000 kg/m³, thủy ngân 13600 kg/m³).",
    ],
    modelParams: [
      { label: "Thể tích chiếm chỗ (V)", unit: "lít", min: 1, max: 20, step: 1, defaultVal: 5 },
      {
        label: "KLR chất lỏng (D)",
        unit: "kg/m³",
        min: 800,
        max: 1400,
        step: 50,
        defaultVal: 1000,
      },
    ],
    reflectionQuestion: "Lực đẩy Ác-si-mét phụ thuộc vào yếu tố nào sau đây?",
    reflectionOptions: [
      "Khối lượng riêng chất lỏng và thể tích phần chìm",
      "Độ sâu nhúng vật khi vật đã ngập hoàn toàn",
      "Hình dạng bên ngoài của vật",
    ],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "F_A = d·V_chìm chỉ phụ thuộc trọng lượng riêng chất lỏng và thể tích chất lỏng bị chiếm chỗ.",
    compute: (p) => {
      const V = (p["Thể tích chiếm chỗ (V)"] ?? 5) * 1e-3;
      const D = p["KLR chất lỏng (D)"] ?? 1000;
      const Fa = D * 9.8 * V;
      return {
        metrics: [
          { label: "Lực đẩy Ác-si-mét (F_A)", value: Fa.toFixed(1), unit: "N" },
          { label: "Khối lượng lỏng chiếm chỗ", value: (D * V).toFixed(2), unit: "kg" },
          { label: "Áp suất tại đáy 1m", value: ((D * 9.8) / 1000).toFixed(2), unit: "kPa" },
        ],
        summary: `Vật chiếm chỗ ${(V * 1000).toFixed(0)} lít chất lỏng có KLR ${D} kg/m³ chịu lực nâng ${Fa.toFixed(1)} N.`,
        lawConfirmed: "Định luật Ác-si-mét: F_A = ρ · g · V_chìm",
      };
    },
  },
  {
    id: "ce32-torricelli-ap-suat-khi-quyen",
    code: "CE32",
    title: "Thí nghiệm Torricelli đo áp suất khí quyển",
    category: "co-hoc",
    categoryName: "Cơ học & Động lực học",
    scientist: "Evangelista Torricelli",
    year: "1643",
    significance:
      "Lần đầu tiên tạo ra chân không nhân tạo và chứng minh khí quyển có trọng lượng gây áp suất.",
    description:
      "Ống thủy tinh úp ngược chứa thủy ngân dừng lại ở độ cao h ≈ 760 mm tại mực nước biển nhờ áp suất khí quyển cân bằng cột chất lỏng.",
    hypothesis: "p_khí_quyển = ρ · g · h.",
    procedure: [
      "Điều chỉnh áp suất khí quyển (atm).",
      "So sánh chiều cao cột thủy ngân với cột nước tương đương.",
    ],
    modelParams: [
      {
        label: "Áp suất khí quyển (p)",
        unit: "atm",
        min: 0.5,
        max: 1.2,
        step: 0.05,
        defaultVal: 1.0,
      },
    ],
    reflectionQuestion:
      "Nếu làm thí nghiệm Torricelli bằng nước (KLR nhỏ hơn thủy ngân 13,6 lần) ở 1 atm, ống phải dài ít nhất bao nhiêu?",
    reflectionOptions: ["Khoảng 10,3 m", "Khoảng 0,76 m", "Khoảng 76 cm"],
    reflectionCorrectIndex: 0,
    reflectionExplain: "h_nước = 0,76 × 13,6 ≈ 10,33 m.",
    compute: (p) => {
      const atm = p["Áp suất khí quyển (p)"] ?? 1.0;
      const pPa = atm * 101325;
      const hHgMm = (pPa / (13595 * 9.806)) * 1000;
      const hWaterM = pPa / (1000 * 9.806);
      return {
        metrics: [
          { label: "Chiều cao cột thủy ngân", value: hHgMm.toFixed(0), unit: "mmHg" },
          { label: "Chiều cao cột nước tương đương", value: hWaterM.toFixed(2), unit: "m" },
          { label: "Áp suất tuyệt đối", value: (pPa / 1000).toFixed(1), unit: "kPa" },
        ],
        summary: `Áp suất ${atm.toFixed(2)} atm nâng cột thủy ngân cao ${hHgMm.toFixed(0)} mm (hoặc cột nước ${hWaterM.toFixed(2)} m).`,
        lawConfirmed: "Phương trình thủy tĩnh Torricelli: p₀ = ρ · g · h",
      };
    },
  },
  {
    id: "ce33-chladni-hoa-van-song-dung-2d",
    code: "CE33",
    title: "Hình Chladni — Sóng dừng cộng hưởng trên tấm kim loại 2D",
    category: "song-dao-dong",
    categoryName: "Sóng & Dao động",
    scientist: "Ernst Chladni",
    year: "1787",
    significance:
      "Hiện hình đường nút giao thoa hai chiều trên bản đàn hồi khi rung ở các tần số riêng.",
    description:
      "Cát mịn trên tấm kim loại rung bị hất khỏi vùng bụng sóng và tụ dọc theo các đường nút có biên độ bằng 0.",
    hypothesis:
      "Các chỉ số mode (m, n) xác định số đường nút đứng yên trên tấm vuông: sin(mπx)·sin(nπy) ± sin(nπx)·sin(mπy) = 0.",
    procedure: [
      "Thay đổi bậc dao động m và n trên bản vuông.",
      "Quan sát lưới đường nút Chladni biến đổi.",
    ],
    modelParams: [
      { label: "Bậc dao động m", unit: "", min: 1, max: 5, step: 1, defaultVal: 2 },
      { label: "Bậc dao động n", unit: "", min: 2, max: 6, step: 1, defaultVal: 3 },
    ],
    reflectionQuestion: "Trên bản Chladni rung cộng hưởng, cát mịn tập trung tại đâu?",
    reflectionOptions: [
      "Các đường nút có biên độ dao động bằng 0",
      "Các điểm bụng dao động mạnh nhất",
      "Ngẫu nhiên khắp bản",
    ],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "Tại đường nút tấm không rung nên hạt cát nằm yên tại đó, phác họa hình đối xứng đẹp mắt.",
    compute: (p) => {
      const m = p["Bậc dao động m"] ?? 2;
      const n = p["Bậc dao động n"] ?? 3;
      const fBase = 120;
      const fMode = fBase * (m * m + n * n);
      return {
        metrics: [
          { label: "Tần số mode (m,n)", value: fMode.toFixed(0), unit: "Hz" },
          { label: "Chỉ số đối xứng", value: `(${m}, ${n})`, unit: "mode" },
          { label: "Số vùng bụng cơ bản", value: (m * n).toString(), unit: "vùng" },
        ],
        summary: `Mode (${m}, ${n}) kích thích tần số riêng ${fMode} Hz tạo mạng đường nút đối xứng trên mặt phẳng 2D.`,
        lawConfirmed: "Tần số cộng hưởng tấm vuông: f_{m,n} ∝ (m² + n²)",
      };
    },
  },
  {
    id: "ce34-mach-song-xung-kich",
    code: "CE34",
    title: "Nón Mach — Sóng xung kích siêu thanh",
    category: "song-dao-dong",
    categoryName: "Sóng & Dao động",
    scientist: "Ernst Mach",
    year: "1887",
    significance:
      "Giải thích tiếng nổ siêu thanh khi nguồn chuyển động nhanh hơn tốc độ sóng trong môi trường.",
    description:
      "Khi tốc độ vật v > v_âm, các mặt cầu sóng chồng chất dọc theo hình nón có nửa góc ở đỉnh sin(μ) = v_âm / v = 1/M.",
    hypothesis: "Số Mach càng lớn thì góc nón Mach càng nhọn.",
    procedure: [
      "Điều chỉnh số Mach M = v / v_âm từ 1,1 đến 4,0.",
      "Đọc góc mở nửa nón μ = arcsin(1/M).",
    ],
    modelParams: [
      {
        label: "Số Mach (M = v/v_âm)",
        unit: "Mach",
        min: 1.1,
        max: 4.0,
        step: 0.1,
        defaultVal: 2.0,
      },
    ],
    reflectionQuestion:
      "Nếu máy bay bay ở tốc độ Mach 2, nửa góc đỉnh nón sóng xung kích bằng bao nhiêu độ?",
    reflectionOptions: ["30°", "45°", "60°"],
    reflectionCorrectIndex: 0,
    reflectionExplain: "sin(μ) = 1 / M = 1 / 2 = 0,5 ⇒ μ = 30°.",
    compute: (p) => {
      const M = p["Số Mach (M = v/v_âm)"] ?? 2.0;
      const muDeg = (Math.asin(1 / M) * 180) / Math.PI;
      return {
        metrics: [
          { label: "Nửa góc nón Mach (μ)", value: muDeg.toFixed(1), unit: "°" },
          { label: "Vận tốc vật (v_âm=340)", value: (M * 340).toFixed(0), unit: "m/s" },
          { label: "Số Mach", value: M.toFixed(1), unit: "M" },
        ],
        summary: `Ở tốc độ Mach ${M.toFixed(1)}, các mặt sóng hợp thành nón xung kích có góc nửa đỉnh μ = ${muDeg.toFixed(1)}°.`,
        lawConfirmed: "Góc nón Mach: sin(μ) = 1 / M",
      };
    },
  },
  {
    id: "ce35-huygens-ong-am-cong-huong",
    code: "CE35",
    title: "Cộng hưởng cột khí một đầu kín & Âm thoa",
    category: "song-dao-dong",
    categoryName: "Sóng & Dao động",
    scientist: "Hermann von Helmholtz & Lord Rayleigh",
    year: "1862",
    significance:
      "Đo bước sóng âm và vận tốc âm thanh chính xác bằng ống cộng hưởng điều chỉnh mực nước.",
    description:
      "Ống trụ có một đầu kín (nút sóng) và một đầu hở (bụng sóng) cộng hưởng mạnh nhất khi chiều cao cột khí L = (2k+1)·λ/4.",
    hypothesis: "Khoảng cách giữa hai mực nước cộng hưởng liên tiếp đúng bằng λ/2.",
    procedure: [
      "Thay đổi tần số âm thoa f (Hz).",
      "Tìm hai chiều dài cộng hưởng đầu tiên L₁ = λ/4 và L₂ = 3λ/4.",
    ],
    modelParams: [
      { label: "Tần số âm thoa (f)", unit: "Hz", min: 256, max: 1024, step: 32, defaultVal: 512 },
    ],
    reflectionQuestion:
      "Với cột khí một đầu kín, chiều dài ngắn nhất cho cộng hưởng âm cơ bản bằng bao nhiêu lần bước sóng?",
    reflectionOptions: ["λ / 4", "λ / 2", "λ"],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "Đầu kín là nút sóng, đầu hở là bụng sóng; khoảng cách ngắn nhất giữa nút và bụng là λ/4.",
    compute: (p) => {
      const f = p["Tần số âm thoa (f)"] ?? 512;
      const v = 343;
      const lambda = v / f;
      return {
        metrics: [
          { label: "Cộng hưởng lần 1 (L₁)", value: (lambda * 25).toFixed(1), unit: "cm" },
          { label: "Cộng hưởng lần 2 (L₂)", value: (lambda * 75).toFixed(1), unit: "cm" },
          { label: "Bước sóng âm (λ)", value: (lambda * 100).toFixed(1), unit: "cm" },
        ],
        summary: `Âm thoa ${f} Hz cộng hưởng rõ rệt khi mực nước hạ tới L₁ = ${(lambda * 25).toFixed(1)} cm và L₂ = ${(lambda * 75).toFixed(1)} cm.`,
        lawConfirmed: "Cộng hưởng ống kín 1 đầu: L = (2k + 1) · λ / 4",
      };
    },
  },
  {
    id: "ce36-tu-dien-phong-nap-rc",
    code: "CE36",
    title: "Phóng – Nạp Tụ điện qua Điện trở (Hằng số thời gian RC)",
    category: "dien-hoc",
    categoryName: "Điện học",
    scientist: "Michael Faraday & Gustav Kirchhoff",
    year: "1837",
    significance:
      "Hiểu cơ chế tích trữ năng lượng điện trường và định thời gian bằng hằng số τ = R·C.",
    description:
      "Tụ điện C được nạp qua điện trở R từ nguồn E; sau mỗi khoảng thời gian τ = RC, hiệu điện thế tụ đạt 63,2% giá trị cực đại.",
    hypothesis: "u_C(t) = E·(1 − e^(−t / RC)).",
    procedure: [
      "Chọn điện trở R (kΩ) và điện dung C (μF).",
      "Đọc hằng số thời gian τ và năng lượng tụ tích trữ W = ½CE².",
    ],
    modelParams: [
      { label: "Điện trở nạp (R)", unit: "kΩ", min: 1, max: 100, step: 1, defaultVal: 20 },
      { label: "Điện dung tụ (C)", unit: "μF", min: 10, max: 500, step: 10, defaultVal: 100 },
      { label: "Điện áp nguồn (E)", unit: "V", min: 3, max: 24, step: 1, defaultVal: 12 },
    ],
    reflectionQuestion:
      "Sau một khoảng thời gian đúng bằng 1 hằng số thời gian τ = RC kể từ lúc tụ rỗng bắt đầu nạp, tụ đạt khoảng bao nhiêu % điện áp nguồn?",
    reflectionOptions: ["63,2%", "50,0%", "99,0%"],
    reflectionCorrectIndex: 0,
    reflectionExplain: "1 − e⁻¹ ≈ 1 − 0,368 = 0,632 = 63,2%.",
    compute: (p) => {
      const R = (p["Điện trở nạp (R)"] ?? 20) * 1000;
      const C = (p["Điện dung tụ (C)"] ?? 100) * 1e-6;
      const E = p["Điện áp nguồn (E)"] ?? 12;
      const tau = R * C;
      const W = 0.5 * C * E * E;
      return {
        metrics: [
          { label: "Hằng số thời gian (τ = RC)", value: tau.toFixed(2), unit: "s" },
          { label: "Điện áp tại t = τ", value: (E * 0.632).toFixed(2), unit: "V" },
          { label: "Năng lượng tụ đầy (W)", value: (W * 1000).toFixed(2), unit: "mJ" },
        ],
        summary: `Hằng số thời gian τ = ${tau.toFixed(2)} s; tụ đạt 99% áp nguồn sau khoảng ${(5 * tau).toFixed(1)} s và tích trữ ${(W * 1000).toFixed(2)} mJ.`,
        lawConfirmed: "Đường cong nạp tụ: u_C(t) = E · (1 − e^(−t/RC))",
      };
    },
  },
  {
    id: "ce37-kirchhoff-mach-phan-nhanh",
    code: "CE37",
    title: "Kiểm chứng hai Định luật Kirchhoff trong mạch phân nhánh",
    category: "dien-hoc",
    categoryName: "Điện học",
    scientist: "Gustav Robert Kirchhoff",
    year: "1845",
    significance:
      "Nền tảng giải mọi mạng mạch điện phức tạp dựa trên bảo toàn điện tích và bảo toàn năng lượng.",
    description:
      "Nguồn E cấp dòng cho hai điện trở mắc song song R₁ // R₂: tổng dòng nhánh bằng dòng chính (I = I₁ + I₂).",
    hypothesis: "Tại mọi nút ∑I_vào = ∑I_ra; trong mọi vòng kín ∑E = ∑I·R.",
    procedure: ["Thay đổi E, R₁ và R₂.", "Kiểm chứng I_chính − (I₁ + I₂) = 0."],
    modelParams: [
      { label: "Điện áp nút nguồn (U)", unit: "V", min: 3, max: 24, step: 1, defaultVal: 12 },
      { label: "Nhánh R₁", unit: "Ω", min: 2, max: 20, step: 1, defaultVal: 4 },
      { label: "Nhánh R₂", unit: "Ω", min: 2, max: 20, step: 1, defaultVal: 6 },
    ],
    reflectionQuestion:
      "Định luật nút (Định luật I Kirchhoff) là hệ quả trực tiếp của định luật bảo toàn nào?",
    reflectionOptions: ["Bảo toàn điện tích", "Bảo toàn động lượng", "Bảo toàn khối lượng"],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "Điện tích không tự sinh ra hay tích tụ tại nút dây dẫn nên tổng dòng vào luôn bằng tổng dòng ra.",
    compute: (p) => {
      const U = p["Điện áp nút nguồn (U)"] ?? 12;
      const r1 = p["Nhánh R₁"] ?? 4;
      const r2 = p["Nhánh R₂"] ?? 6;
      const i1 = U / r1;
      const i2 = U / r2;
      const iTotal = i1 + i2;
      return {
        metrics: [
          { label: "Dòng nhánh I₁", value: i1.toFixed(2), unit: "A" },
          { label: "Dòng nhánh I₂", value: i2.toFixed(2), unit: "A" },
          { label: "Tổng dòng tại nút (I)", value: iTotal.toFixed(2), unit: "A" },
        ],
        summary: `Tổng dòng rẽ hai nhánh I₁ + I₂ = ${i1.toFixed(2)} + ${i2.toFixed(2)} = ${iTotal.toFixed(2)} A bảo toàn chính xác tại nút.`,
        lawConfirmed: "Định luật Kirchhoff I: ∑I_nút = 0",
      };
    },
  },
  {
    id: "ce38-lorentz-quy-dao-tron-tu-truong",
    code: "CE38",
    title: "Chuyển động tròn của hạt mang điện trong từ trường đều",
    category: "tu-truong",
    categoryName: "Từ trường & Cảm ứng",
    scientist: "Hendrik Lorentz",
    year: "1892",
    significance: "Nguyên lý cốt lõi của máy gia tốc Cyclotron và máy quang phổ khối tách đồng vị.",
    description:
      "Hạt điện tích q bay vuông góc với đường sức từ B chịu lực Lorentz đóng vai trò lực hướng tâm, vẽ quỹ đạo tròn bán kính R = mv/(|q|B).",
    hypothesis:
      "Lực Lorentz luôn vuông góc với vận tốc nên không sinh công — giữ nguyên tốc độ hạt.",
    procedure: [
      "Thay đổi tốc độ ban đầu v và cảm ứng từ B.",
      "Theo dõi bán kính cong quỹ đạo của proton.",
    ],
    modelParams: [
      { label: "Cảm ứng từ (B)", unit: "T", min: 0.1, max: 2.0, step: 0.1, defaultVal: 0.5 },
      {
        label: "Tốc độ proton (v)",
        unit: "×10⁶ m/s",
        min: 0.5,
        max: 5.0,
        step: 0.25,
        defaultVal: 2.0,
      },
    ],
    reflectionQuestion:
      "Trong từ trường đều, chu kỳ quay T = 2πm/(|q|B) của hạt mang điện có phụ thuộc vào tốc độ v của hạt không?",
    reflectionOptions: [
      "Không phụ thuộc v (hạt nhanh quay vòng lớn hơn đúng tỉ lệ nên hết cùng thời gian)",
      "Tỉ lệ thuận với v",
      "Tỉ lệ nghịch với v²",
    ],
    reflectionCorrectIndex: 0,
    reflectionExplain: "T = 2πR/v = 2πm/(|q|B) hoàn toàn độc lập với tốc độ phi tương đối tính v.",
    relatedLessonPath:
      "lop-12/tu-truong/chu-de-1-tu-truong/bai-2-luc-tu/2-vd9-proton-trong-dien-truong-va-tu-truong",
    compute: (p) => {
      const B = p["Cảm ứng từ (B)"] ?? 0.5;
      const v = (p["Tốc độ proton (v)"] ?? 2.0) * 1e6;
      const mp = 1.673e-27;
      const q = 1.602e-19;
      const R = (mp * v) / (q * B);
      const Tns = ((2 * Math.PI * mp) / (q * B)) * 1e9;
      return {
        metrics: [
          { label: "Bán kính quỹ đạo (R)", value: (R * 100).toFixed(2), unit: "cm" },
          { label: "Chu kỳ quay (T)", value: Tns.toFixed(1), unit: "ns" },
          { label: "Tần số Cyclotron", value: (1000 / Tns).toFixed(2), unit: "MHz" },
        ],
        summary: `Proton chuyển động tròn đều bán kính ${(R * 100).toFixed(2)} cm với chu kỳ Cyclotron ${Tns.toFixed(1)} ns.`,
        lawConfirmed: "Bán kính Lorentz: R = (m·v) / (|q|·B)",
      };
    },
  },
  {
    id: "ce39-tu-cam-cuon-day-solenoid",
    code: "CE39",
    title: "Hiện tượng tự cảm & Năng lượng từ trường ống dây Solenoid",
    category: "tu-truong",
    categoryName: "Từ trường & Cảm ứng",
    scientist: "Joseph Henry",
    year: "1832",
    significance:
      "Phát hiện tính 'quán tính điện từ' của cuộn cảm L và cơ chế tích trữ năng lượng từ trường.",
    description:
      "Khi dòng điện qua ống dây độ tự cảm L biến thiên với tốc độ ΔI/Δt, xuất hiện suất điện động tự cảm e_tc = −L·ΔI/Δt.",
    hypothesis: "Độ tự cảm L tỉ lệ với bình phương số vòng dây N².",
    procedure: [
      "Chọn độ tự cảm L (mH) và dòng điện I.",
      "Đọc suất điện động tự cảm khi ngắt mạch trong 10 ms và năng lượng từ trường ½LI².",
    ],
    modelParams: [
      { label: "Độ tự cảm (L)", unit: "mH", min: 50, max: 500, step: 25, defaultVal: 200 },
      { label: "Cường độ dòng điện (I)", unit: "A", min: 0.5, max: 10, step: 0.5, defaultVal: 4 },
    ],
    reflectionQuestion:
      "Nếu giữ nguyên dòng điện I nhưng tăng độ tự cảm L lên gấp đôi, năng lượng từ trường tích trữ trong cuộn dây thay đổi thế nào?",
    reflectionOptions: ["Tăng gấp đôi", "Tăng gấp bốn", "Không đổi"],
    reflectionCorrectIndex: 0,
    reflectionExplain: "Vì W_L = ½·L·I², W_L tỉ lệ bậc nhất với độ tự cảm L.",
    compute: (p) => {
      const L = (p["Độ tự cảm (L)"] ?? 200) * 1e-3;
      const I = p["Cường độ dòng điện (I)"] ?? 4;
      const etc = (L * I) / 0.01; // ngắt trong 10 ms
      const wL = 0.5 * L * I * I;
      return {
        metrics: [
          { label: "Sđđ tự cảm (Δt=10ms)", value: etc.toFixed(1), unit: "V" },
          { label: "Năng lượng từ trường (W)", value: wL.toFixed(2), unit: "J" },
          { label: "Từ thông riêng (Φ = LI)", value: (L * I).toFixed(3), unit: "Wb" },
        ],
        summary: `Ngắt nhanh dòng ${I} A qua cuộn L = ${(L * 1000).toFixed(0)} mH gây xung áp tự cảm ${etc.toFixed(1)} V, giải phóng ${wL.toFixed(2)} J.`,
        lawConfirmed: "Tự cảm Henry: e_tc = −L·(ΔI/Δt) ; W = ½·L·I²",
      };
    },
  },
  {
    id: "ce40-snell-khuc-xa-phan-xa-toan-phan",
    code: "CE40",
    title: "Định luật Snell & Phản xạ toàn phần trong Cáp quang",
    category: "quang-hien-dai",
    categoryName: "Quang học & Vật lý hiện đại",
    scientist: "Willebrord Snellius & Ibn Sahl",
    year: "984 – 1621",
    significance:
      "Giải thích sự truyền ánh sáng qua mặt phân cách và nguyên lý dẫn truyền tín hiệu cáp quang toàn cầu.",
    description:
      "Tia sáng đi từ môi trường chiết quang hơn n₁ (thủy tinh) sang môi trường chiết quang kém n₂ (không khí) sẽ phản xạ toàn phần khi i ≥ i_gh.",
    hypothesis: "sin(i_gh) = n₂ / n₁.",
    procedure: [
      "Điều chỉnh chiết suất lõi n₁ và góc tới i.",
      "Kiểm tra điều kiện xảy ra phản xạ toàn phần.",
    ],
    modelParams: [
      { label: "Chiết suất lõi (n₁)", unit: "", min: 1.33, max: 1.75, step: 0.01, defaultVal: 1.5 },
      { label: "Góc tới (i)", unit: "độ", min: 5, max: 80, step: 1, defaultVal: 45 },
    ],
    reflectionQuestion:
      "Điều kiện cần để xảy ra hiện tượng phản xạ toàn phần tại mặt phân cách hai môi trường trong suốt là gì?",
    reflectionOptions: [
      "Ánh sáng truyền từ môi trường chiết suất lớn sang môi trường chiết suất nhỏ hơn và i ≥ i_gh",
      "Ánh sáng truyền từ không khí vào thủy tinh",
      "Góc tới luôn bằng 0°",
    ],
    reflectionCorrectIndex: 0,
    reflectionExplain: "Cần n₁ > n₂ và góc tới i ≥ arcsin(n₂/n₁).",
    compute: (p) => {
      const n1 = p["Chiết suất lõi (n₁)"] ?? 1.5;
      const n2 = 1.0;
      const iDeg = p["Góc tới (i)"] ?? 45;
      const iGh = (Math.asin(n2 / n1) * 180) / Math.PI;
      const isTir = iDeg >= iGh;
      const rDeg = isTir
        ? null
        : (Math.asin((n1 * Math.sin((iDeg * Math.PI) / 180)) / n2) * 180) / Math.PI;
      return {
        metrics: [
          { label: "Góc giới hạn (i_gh)", value: iGh.toFixed(1), unit: "°" },
          {
            label: "Góc khúc xạ (r)",
            value: isTir ? "TIR" : rDeg!.toFixed(1),
            unit: isTir ? "" : "°",
          },
          { label: "Trạng thái tia ló", value: isTir ? "Phản xạ TP" : "Khúc xạ", unit: "" },
        ],
        summary: isTir
          ? `Do i (${iDeg}°) ≥ i_gh (${iGh.toFixed(1)}°), toàn bộ năng lượng tia sáng bị phản xạ ngược vào trong lõi.`
          : `Tia sáng khúc xạ ra không khí với góc lệch r = ${rDeg!.toFixed(1)}° > i (${iDeg}°).`,
        lawConfirmed: "Định luật Snell: n₁·sin(i) = n₂·sin(r) ; sin(i_gh) = n₂/n₁",
      };
    },
  },
  {
    id: "ce41-compton-tan-xa-photon",
    code: "CE41",
    title: "Tán xạ Compton — Chứng minh Photon có động lượng",
    category: "quang-hien-dai",
    categoryName: "Quang học & Vật lý hiện đại",
    scientist: "Arthur Holly Compton",
    year: "1923",
    significance:
      "Khẳng định hạt ánh sáng (photon) không chỉ mang năng lượng mà còn mang động lượng p = h/λ.",
    description:
      "Chùm tia X bước sóng ngắn tán xạ lên electron tự do ở góc θ bị tăng bước sóng một lượng Δλ = λ_C·(1 − cosθ), không phụ thuộc bước sóng tới.",
    hypothesis:
      "Va chạm đàn hồi giữa photon và electron tuân theo bảo toàn động lượng tương đối tính.",
    procedure: [
      "Điều chỉnh góc tán xạ θ từ 0° đến 180°.",
      "Đọc độ dịch bước sóng Compton Δλ (pm).",
    ],
    modelParams: [
      { label: "Góc tán xạ (θ)", unit: "độ", min: 0, max: 180, step: 5, defaultVal: 90 },
      { label: "Bước sóng tia X tới (λ₀)", unit: "pm", min: 20, max: 100, step: 5, defaultVal: 70 },
    ],
    reflectionQuestion: "Độ dịch bước sóng Compton Δλ đạt giá trị cực đại tại góc tán xạ nào?",
    reflectionOptions: ["θ = 180° (bật ngược trở lại)", "θ = 90°", "θ = 0°"],
    reflectionCorrectIndex: 0,
    reflectionExplain: "Δλ = λ_C(1 − cosθ) đạt cực đại 2λ_C ≈ 4,85 pm khi cos(180°) = −1.",
    compute: (p) => {
      const theta = ((p["Góc tán xạ (θ)"] ?? 90) * Math.PI) / 180;
      const lambda0 = p["Bước sóng tia X tới (λ₀)"] ?? 70;
      const lambdaC = 2.426; // pm
      const dLambda = lambdaC * (1 - Math.cos(theta));
      return {
        metrics: [
          { label: "Độ dịch Compton (Δλ)", value: dLambda.toFixed(2), unit: "pm" },
          { label: "Bước sóng tán xạ (λ')", value: (lambda0 + dLambda).toFixed(2), unit: "pm" },
          { label: "Bước sóng Compton (λ_C)", value: "2.43", unit: "pm" },
        ],
        summary: `Ở góc tán xạ ${p["Góc tán xạ (θ)"] ?? 90}°, photon truyền một phần động lượng cho electron khiến bước sóng dãn thêm ${dLambda.toFixed(2)} pm.`,
        lawConfirmed: "Công thức Compton: Δλ = (h / m_e c)·(1 − cosθ)",
      };
    },
  },
  {
    id: "ce42-michelson-morley-giao-thoa",
    code: "CE42",
    title: "Giao thoa kế Michelson–Morley & Tốc độ ánh sáng bất biến",
    category: "quang-hien-dai",
    categoryName: "Quang học & Vật lý hiện đại",
    scientist: "Albert A. Michelson & Edward W. Morley",
    year: "1887",
    significance:
      "Kết quả 'âm tính vĩ đại nhất lịch sử Vật lý' — bác bỏ môi trường Ê-te và dẫn tới Thuyết Tương đối hẹp.",
    description:
      "Tách chùm sáng qua gương bán mạ theo hai cánh tay vuông góc chiều dài L; quan sát giao thoa cực nhạy của hệ vân khi thay đổi độ lệch quang trình δL.",
    hypothesis: "Thay đổi quang trình bằng λ/2 làm hệ vân dịch chuyển đúng một vân.",
    procedure: [
      "Điều chỉnh độ dịch chuyển gương ΔL (nm).",
      "Đếm số vân giao thoa dịch chuyển trên màn thu ΔN = 2·ΔL / λ.",
    ],
    modelParams: [
      {
        label: "Độ dịch gương vi kế (ΔL)",
        unit: "nm",
        min: 0,
        max: 2000,
        step: 50,
        defaultVal: 632,
      },
      { label: "Bước sóng laser (λ)", unit: "nm", min: 400, max: 700, step: 10, defaultVal: 632 },
    ],
    reflectionQuestion:
      "Ý nghĩa lịch sử quan trọng nhất của thí nghiệm Michelson–Morley năm 1887 là gì?",
    reflectionOptions: [
      "Tốc độ ánh sáng không phụ thuộc hướng chuyển động của Trái Đất, bác bỏ giả thuyết Ê-te",
      "Chứng minh Trái Đất đứng yên tuyệt đối",
      "Đo khối lượng của photon",
    ],
    reflectionCorrectIndex: 0,
    reflectionExplain:
      "Không hề có sự dịch vân do 'gió Ê-te' — đặt nền móng thực nghiệm cho tiên đề c = const của Einstein.",
    compute: (p) => {
      const dL = p["Độ dịch gương vi kế (ΔL)"] ?? 632;
      const lambda = p["Bước sóng laser (λ)"] ?? 632;
      const fringesShifted = (2 * dL) / lambda;
      return {
        metrics: [
          { label: "Số vân dịch chuyển (ΔN)", value: fringesShifted.toFixed(2), unit: "vân" },
          { label: "Độ lệch quang trình (2ΔL)", value: (2 * dL).toFixed(0), unit: "nm" },
          { label: "Tốc độ ánh sáng (c)", value: "299,792", unit: "km/s" },
        ],
        summary: `Dịch gương chỉ ${dL} nm làm lệch pha ${fringesShifted.toFixed(2)} chu kỳ vân sáng — độ chính xác đo kích thước nguyên tử.`,
        lawConfirmed: "Giao thoa kế Michelson: ΔN = (2 · ΔL) / λ",
      };
    },
  },
];

export const ALL_CLASSIC_EXPERIMENTS: ClassicExperiment[] = [
  ...CLASSIC_EXPERIMENTS,
  ...EXTRA_CLASSIC_EXPERIMENTS,
].sort((a, b) => {
  const numA = parseInt(a.code.replace(/\D/g, ""), 10) || 0;
  const numB = parseInt(b.code.replace(/\D/g, ""), 10) || 0;
  return numA - numB;
});

// Ensure exact 30 experiments numbered CE01..CE30 in the sorted canonical catalog
export const CANONICAL_30_EXPERIMENTS: ClassicExperiment[] = ALL_CLASSIC_EXPERIMENTS.map(
  (exp, idx) => ({
    ...exp,
    code: `CE${String(idx + 1).padStart(2, "0")}`,
  }),
);
