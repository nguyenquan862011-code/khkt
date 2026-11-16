/**
 * Đợt 1 — Cơ học: TN001–TN014.
 * Mỗi bài gồm đủ 14 phần chuẩn (xem types.ts).
 */
import type { ExperimentEntry } from "./types";

export const BATCH_CO_HOC: ExperimentEntry[] = [
  {
    id: "TN001",
    code: "TN001",
    slug: "roi-tu-do-anh-huong-do-cao",
    title: "Rơi tự do – Ảnh hưởng của chiều cao đến thời gian rơi",
    topic: "co-hoc",
    chapter: "Chương 1 – Động học chất điểm",
    level: "10",
    kind: "thi-nghiem",
    durationMinutes: 20,
    description:
      "Thả vật từ các độ cao khác nhau, đo thời gian rơi để rút ra quan hệ h = ½gt² và thấy rằng thời gian rơi không phụ thuộc khối lượng vật.",
    photoIds: ["co-hoc", "ce01-galilei-roi-tu-do"],
    intro:
      "Từ thời Galilê, câu hỏi 'vật nặng có rơi nhanh hơn vật nhẹ không?' đã làm thay đổi tư duy vật lý. Thí nghiệm thả rơi tự do giúp em thấy trực tiếp: trong điều kiện bỏ qua sức cản không khí, mọi vật đều rơi với cùng một gia tốc g, và thời gian rơi chỉ phụ thuộc vào độ cao thả.",
    objectives: [
      "Đo thời gian rơi của vật thả từ nhiều độ cao khác nhau",
      "Kiểm nghiệm công thức h = ½gt²",
      "Rút ra kết luận: thời gian rơi không phụ thuộc khối lượng vật",
    ],
    knowledge: [
      "Gia tốc rơi tự do g ≈ 9,8 m/s² (tại Trái Đất)",
      "Vận tốc sau thời gian t: v = g·t",
      "Độ cao rơi: h = ½·g·t² → t = √(2h/g)",
      "Bỏ qua sức cản không khí: mọi vật rơi cùng gia tốc",
    ],
    apparatus: [
      "Bộ thiết bị thả rơi có cảm biến thời gian (hoặc smartphone dùng app đo thời gian rơi)",
      "Thước đo độ cao (vạch chia mm)",
      "Quả cầu thép nhiều khối lượng (10 g, 20 g, 50 g)",
      "Sổ tay ghi số liệu",
    ],
    procedure: [
      "Cố định cảm biến thời gian trên giá, đo và ghi độ cao thả h₁ = 1,0 m",
      "Thả quả cầu 20 g từ h₁, ghi thời gian rơi t₁; lặp lại 3 lần lấy giá trị trung bình",
      "Tăng dần độ cao: 1,5 m; 2,0 m; 2,5 m; 3,0 m — mỗi độ cao đo 3 lần",
      "Thay quả cầu 10 g rồi 50 g ở cùng độ cao 2,0 m, so sánh thời gian rơi",
      "Vẽ đồ thị h theo t², kiểm tra tính thẳng của đồ thị",
    ],
    sim: { engineId: "freefall", params: { h0: 10, g: 9.8 } },
    dataRows: {
      columns: ["Lần đo", "h (m)", "t đo (s)", "t tính (s)", "Sai số (%)"],
      rows: [
        [1, 1.0, 0.45, 0.45, 0],
        [2, 1.5, 0.55, 0.55, 0],
        [3, 2.0, 0.64, 0.64, 0],
        [4, 2.5, 0.71, 0.71, 0],
        [5, 3.0, 0.78, 0.78, 0],
      ],
    },
    explanation:
      "Đồ thị h – t² là một đường thẳng qua gốc toạ độ, khẳng định h tỉ lệ thuận với t², đúng công thức h = ½gt². Hệ số góc của đồ thị cho ½g ≈ 4,9, suy ra g ≈ 9,8 m/s². Khi thay quả cầu 10 g, 20 g, 50 g ở cùng độ cao, thời gian rơi xấp xỉ bằng nhau — chứng tỏ gia tốc rơi tự do không phụ thuộc khối lượng, đúng như Galilê đã chứng minh ở tháp nghiêng Pisa.",
    conclusion:
      "Thời gian rơi tự do chỉ phụ thuộc độ cao thả theo t = √(2h/g) và độc lập với khối lượng vật; gia tốc rơi tự do tại nơi thí nghiệm xấp xỉ 9,8 m/s².",
    quiz: [
      {
        q: "Để đo gia tốc rơi tự do chính xác hơn, nên làm gì?",
        options: [
          "Dùng vật nặng hơn để rơi nhanh hơn",
          "Tăng độ cao thả và đo thời gian nhiều lần",
          "Thả vật ở nơi có gió mạnh",
          "Giảm độ cao để dễ đo",
        ],
        answerIndex: 1,
        explain:
          "Tăng độ cao làm thời gian rơi dài hơn, sai số đo tương đối nhỏ hơn; đo nhiều lần lấy trung bình giảm sai số ngẫu nhiên.",
      },
      {
        q: "Hai viên bi sắt và nhôm cùng khối lượng thả từ cùng độ cao, không khí cản được bỏ qua. Viên nào chạm đất trước?",
        options: ["Viên sắt", "Viên nhôm", "Cùng lúc", "Tùy màu sắc viên bi"],
        answerIndex: 2,
        explain:
          "Trong chân không (hoặc bỏ qua sức cản), mọi vật rơi với cùng gia tốc g nên chạm đất cùng lúc.",
      },
    ],
  },
  {
    id: "TN002",
    code: "TN002",
    slug: "nem-xien-quy-dao-parabol",
    title: "Ném xiên – Quỹ đạo parabol của vật ném",
    topic: "co-hoc",
    chapter: "Chương 1 – Động học chất điểm",
    level: "10",
    kind: "thi-nghiem",
    durationMinutes: 25,
    description:
      "Ném vật theo góc xiên, ghi lại quỹ đạo để xác nhận đường parabol và tìm góc ném cho tầm bay xa nhất.",
    photoIds: ["co-hoc", "ce02-galilei-mat-nghieng"],
    intro:
      "Bất kỳ cú sút bóng nào, đường bay của giọt nước từ vòi phun hay viên đạn pháo đều là chuyển động ném xiên: tổ hợp của chuyển động thẳng đều theo phương ngang và chuyển động rơi tự do theo phương thẳng đứng. Thí nghiệm này dựng lại quỹ đạo parabol kinh điển.",
    objectives: [
      "Phân tích chuyển động ném xiên thành hai thành phần độc lập",
      "Kiểm tra quỹ đạo là đường parabol",
      "Tìm góc ném tối ưu cho tầm bay xa nhất (ở cùng vận tốc đầu)",
    ],
    knowledge: [
      "Thành phần ngang: x = v₀·cosθ·t (thẳng đều)",
      "Thành phần dọc: y = v₀·sinθ·t − ½gt² (rơi tự do)",
      "Tầm bay: R = v₀²·sin(2θ)/g — cực đại khi θ = 45°",
      "Độ cao cực đại: H = v₀²·sin²θ/(2g)",
    ],
    apparatus: [
      "Bệ phóng lò xo có thước đo góc (0°–80°)",
      "Quả bóng nhỏ (bi thép hoặc bóng bàn)",
      "Thước đo tầm bay dài 5 m, giấy than ghi điểm rơi",
      "Máy quay tốc độ cao (điện thoại) để trích quỹ đạo",
    ],
    procedure: [
      "Đặt bệ phóng trên sàn phẳng, chỉnh góc ném θ = 30°, nén lò xo đến vạch cố định",
      "Bắn 3 lần, đánh dấu điểm rơi, đo tầm bay R trung bình",
      "Lặp lại với θ = 35°, 40°, 45°, 50°, 55°, 60° (giữ nguyên v₀)",
      "Quay video một lần bắn, trích các khung hình dựng quỹ đạo (x, y)",
      "Vẽ đồ thị R(θ) và quỹ đạo y(x), so sánh với đường parabol lý thuyết",
    ],
    sim: { engineId: "projectile", params: { v0: 25, theta: 45, g: 9.8 } },
    dataRows: {
      columns: ["θ (°)", "R đo (m)", "R tính (m)", "H tính (m)", "Ghi chú"],
      rows: [
        [30, 3.1, 3.18, 0.46, "Góc nhỏ"],
        [35, 3.4, 3.44, 0.61, ""],
        [40, 3.55, 3.59, 0.76, ""],
        [45, 3.63, 3.63, 0.9, "R cực đại"],
        [50, 3.55, 3.59, 1.02, "Đối xứng 40°"],
        [55, 3.4, 3.44, 1.13, ""],
        [60, 3.1, 3.18, 1.22, "Cao nhưng ngắn"],
      ],
    },
    explanation:
      "Quỹ đạo trích từ video là đường parabol khớp với phương trình y = x·tanθ − gx²/(2v₀²cos²θ). Đồ thị R(θ) đạt cực đại tại θ = 45° và đối xứng quanh góc này (30° và 60° cho cùng tầm bay). Góc ném lớn cho độ cao cao hơn nhưng tầm bay ngắn lại do thành phần ngang v₀cosθ giảm.",
    conclusion:
      "Chuyển động ném xiên là tổ hợp thẳng đều ngang và rơi tự do dọc; quỹ đạo là parabol, tầm bay cực đại khi góc ném bằng 45° (khi bỏ qua sức cản không khí).",
    quiz: [
      {
        q: "Vì sao góc 45° cho tầm bay xa nhất?",
        options: [
          "Vì sin(2·45°) = 1 đạt cực đại trong công thức R = v₀²sin(2θ)/g",
          "Vì cos(45°) lớn nhất",
          "Vì vật bay cao nhất ở góc này",
          "Vì trọng lực yếu nhất theo hướng này",
        ],
        answerIndex: 0,
        explain: "R tỉ lệ thuận sin(2θ); sin(2θ) đạt cực đại 1 khi 2θ = 90°, tức θ = 45°.",
      },
      {
        q: "Khi ném bóng đá phạt góc, cầu thủ thường sút góc thấp hơn 45°. Vì sao?",
        options: [
          "Vì không khí cản làm tầm bay lý thuyết 45° không còn tối ưu",
          "Vì sút thấp mạnh hơn",
          "Vì luật bóng đá cấm sút cao",
          "Vì trọng lực đổi hướng",
        ],
        answerIndex: 0,
        explain:
          "Sức cản không khí làm quỹ đạo lệch so với parabol lý thuyết; góc tối ưu thực tế thường thấp hơn 45° và phụ thuộc tốc độ ban đầu.",
      },
    ],
  },
  {
    id: "TN003",
    code: "TN003",
    slug: "con-lac-don-chu-ky",
    title: "Con lắc đơn – Chu kỳ phụ thuộc chiều dài dây",
    topic: "co-hoc",
    chapter: "Chương 3 – Dao động cơ",
    level: "10",
    kind: "thi-nghiem",
    durationMinutes: 20,
    description:
      "Thay đổi chiều dài dây con lắc, đo chu kỳ để kiểm nghiệm T = 2π√(L/g) và thấy biên độ không ảnh hưởng chu kỳ.",
    photoIds: ["ce03-con-lac-don-chu-ky", "co-hoc"],
    intro:
      "Con lắc đơn là mô hình dao động điều hoà kinh điển: từ chiếc đèn chùm nhà thờ đến đồng hồ quả lắc. Thí nghiệm này giúp em tìm ra quy luật phụ thuộc của chu kỳ vào chiều dài dây và gia tốc trọng trường.",
    objectives: [
      "Đo chu kỳ con lắc theo nhiều chiều dài dây",
      "Kiểm nghiệm công thức T = 2π√(L/g)",
      "Chứng minh chu kỳ không phụ thuộc biên độ (góc nhỏ) và khối lượng vật nặng",
    ],
    knowledge: [
      "Chu kỳ: T = 2π√(L/g) — với góc lệch nhỏ (< 10°)",
      "Tần số: f = 1/T",
      "Chu kỳ độc lập với biên độ và khối lượng vật nặng",
      "Đồng hồ quả lắc cần nhiệt độ ổn định vì L thay đổi khi nở vì nhiệt",
    ],
    apparatus: [
      "Dây dù dài 1 m, quả lắc kim loại có móc",
      "Giá đỡ có thước chia mm",
      "Đồng hồ bấm giờ (hoặc app đếm chu kỳ 20 lần lắc)",
      "Góc kế, cân đồng hồ",
    ],
    procedure: [
      "Buộc dây dài L = 20 cm vào giá, treo quả lắc, kéo lệch góc 5° rồi thả",
      "Đếm 20 chu kỳ hoàn chỉnh, tính chu kỳ trung bình T",
      "Lặp lại với L = 40, 60, 80, 100 cm",
      "Ở L = 60 cm, lặp thí nghiệm với biên độ 5° và 10°, so sánh chu kỳ",
      "Thay quả lắc nặng hơn ở cùng L, kiểm tra chu kỳ có đổi không",
    ],
    sim: { engineId: "pendulum", params: { L: 1, g: 9.8, theta0: 15 } },
    dataRows: {
      columns: ["L (cm)", "T đo 20 lần (s)", "T đo (s)", "T tính (s)", "Sai số (%)"],
      rows: [
        [20, 18.0, 0.9, 0.9, 0],
        [40, 25.4, 1.27, 1.27, 0],
        [60, 31.2, 1.56, 1.55, 0.6],
        [80, 35.9, 1.8, 1.8, 0],
        [100, 40.1, 2.01, 2.01, 0],
      ],
    },
    explanation:
      "Đồ thị T² theo L là đường thẳng qua gốc toạ độ với hệ số góc 4π²/g ≈ 4,03 s²/m, xác nhận T = 2π√(L/g). Khi tăng biên độ từ 5° lên 10°, chu kỳ thay đổi không đáng kể — đúng đặc trưng dao động điều hoà ở góc nhỏ. Thay khối lượng quả lắc cũng không đổi chu kỳ.",
    conclusion:
      "Chu kỳ con lắc đơn chỉ phụ thuộc chiều dài dây và gia tốc trọng trường theo T = 2π√(L/g), không phụ thuộc biên độ (góc nhỏ) và khối lượng vật nặng.",
    quiz: [
      {
        q: "Một con lắc chu kỳ 2 s trên Trái Đất. Khi mang lên Mặt Trăng (g ≈ 1,6 m/s²), chu kỳ sẽ:",
        options: ["Giảm", "Tăng", "Không đổi", "Bằng 0"],
        answerIndex: 1,
        explain:
          "T tỉ lệ nghịch √g; g nhỏ hơn nên chu kỳ dài hơn: T_trăng = T_đất·√(9,8/1,6) ≈ 4,95 s.",
      },
      {
        q: "Vì sao đồng hồ quả lắc bị sai giờ khi nhiệt độ phòng đổi?",
        options: [
          "Vì dây kim loại nở/dãn làm L thay đổi nên chu kỳ đổi",
          "Vì quả lắc nặng hơn khi nóng",
          "Vì không khí loãng ra",
          "Vì pin yếu",
        ],
        answerIndex: 0,
        explain:
          "L tăng khi nóng → T tăng → đồng hồ chạy chậm; đây là lý do cần bù nhiệt trong đồng hồ lắc chính xác.",
      },
    ],
  },
  {
    id: "TN004",
    code: "TN004",
    slug: "dao-dong-lo-xo-mass-spring",
    title: "Dao động của khối gắn lò xo – Chu kỳ và năng lượng",
    topic: "co-hoc",
    chapter: "Chương 3 – Dao động cơ",
    level: "10",
    kind: "thi-nghiem",
    durationMinutes: 25,
    description:
      "Cho khối lượng dao động trên lò xo nằm ngang, đo chu kỳ theo khối lượng và độ cứng lò xo, quan sát chuyển hoá năng lượng thế – động.",
    photoIds: ["ce05-dinh-luat-hooke", "co-hoc"],
    intro:
      "Mô hình khối – lò xo là trái tim của mọi lý thuyết dao động: từ hệ thống giảm xóc ô tô đến phân tử trong tinh thể. Qua thí nghiệm, em sẽ thấy chu kỳ phụ thuộc thế nào vào khối lượng và độ cứng lò xo.",
    objectives: [
      "Xác định chu kỳ dao động của hệ khối – lò xo",
      "Kiểm nghiệm T = 2π√(m/k)",
      "Quan sát chuyển hoá giữa thế năng đàn hồi và động năng",
    ],
    knowledge: [
      "Định luật Hooke: F = −k·x",
      "Chu kỳ: T = 2π√(m/k), tần số f = 1/T",
      "Năng lượng dao động: E = ½kA² (bảo toàn khi bỏ qua ma sát)",
      "Thế năng: U = ½kx²; động năng: K = E − U",
    ],
    apparatus: [
      "Lò xo thép có hằng số k đã biết (hoặc đo bằng quả cân)",
      "Khối trượt 200 g – 500 g trên thanh trượt ít ma sát",
      "Cảm biến vị trí (hoặc video + thước chia)",
      "Giá đỡ, quả cân tiêu chuẩn",
    ],
    procedure: [
      "Treo lò xo thẳng đứng, gắn khối 200 g, kéo xuống 5 cm rồi thả",
      "Đo thời gian 10 dao động hoàn chỉnh, tính chu kỳ T",
      "Thay khối 300 g, 400 g, 500 g — mỗi lần đo chu kỳ",
      "Dùng lò xo thứ hai (mềm hơn) với cùng khối 300 g, so sánh chu kỳ",
      "Quan sát vị trí khối theo thời gian, xác định biên độ và vận tốc cực đại",
    ],
    sim: { engineId: "spring", params: { m: 1, k: 20, A: 0.2 } },
    dataRows: {
      columns: ["m (kg)", "k (N/m)", "T đo (s)", "T tính (s)", "Ghi chú"],
      rows: [
        [0.2, 20, 0.63, 0.63, "Khối nhẹ"],
        [0.3, 20, 0.77, 0.77, ""],
        [0.4, 20, 0.89, 0.89, ""],
        [0.5, 20, 0.99, 0.99, ""],
        [0.3, 10, 1.09, 1.09, "Lò xo mềm hơn"],
      ],
    },
    explanation:
      "Đồ thị T² theo m là đường thẳng qua gốc với hệ số góc 4π²/k, xác nhận T = 2π√(m/k). Khi dùng lò xo mềm hơn (k nhỏ), chu kỳ dài hơn ở cùng khối lượng. Trong một chu kỳ, động năng cực đại tại vị trí cân bằng, thế năng cực đại tại biên độ — tổng năng lượng ½kA² bảo toàn khi bỏ qua ma sát.",
    conclusion:
      "Chu kỳ dao động của hệ khối – lò xo là T = 2π√(m/k): tỉ lệ thuận căn bậc hai khối lượng, tỉ lệ nghịch căn bậc hai độ cứng lò xo; năng lượng dao động E = ½kA².",
    quiz: [
      {
        q: "Nếu tăng khối lượng gấp 4 lần, chu kỳ dao động thay đổi thế nào?",
        options: ["Gấp 2 lần", "Gấp 4 lần", "Giảm một nửa", "Không đổi"],
        answerIndex: 0,
        explain: "T = 2π√(m/k); m gấp 4 → √(4m) = 2√m nên chu kỳ gấp đôi.",
      },
      {
        q: "Tại vị trí cân bằng của dao động, đại lượng nào đạt cực đại?",
        options: ["Thế năng đàn hồi", "Động năng", "Gia tốc", "Lực đàn hồi"],
        answerIndex: 1,
        explain:
          "Tại cân bằng x = 0 nên thế năng ½kx² = 0, toàn bộ năng lượng là động năng — vận tốc cực đại.",
      },
    ],
  },
  {
    id: "TN005",
    code: "TN005",
    slug: "vat-tren-mat-ngheng-ma-sat",
    title: "Vật trượt trên mặt nghiêng – Vai trò của ma sát",
    topic: "co-hoc",
    chapter: "Chương 2 – Động lực học chất điểm",
    level: "10",
    kind: "thi-nghiem",
    durationMinutes: 25,
    description:
      "Đo gia tốc vật trượt trên mặt nghiêng với nhiều góc nghiêng và vật lót khác nhau để xác định hệ số ma sát và điều kiện trượt.",
    photoIds: ["ce02-galilei-mat-nghieng", "co-hoc"],
    intro:
      "Mặt nghiêng là 'phòng thí nghiệm của Galilê': nhờ nó mà ông làm chậm chuyển động rơi tự do để đo được bằng đồng hồ nước. Thí nghiệm này khám phá cách góc nghiêng và ma sát cùng nhau quyết định chuyển động của vật.",
    objectives: [
      "Xác định gia tốc vật trượt trên mặt nghiêng",
      "Đo hệ số ma sát giữa vật và mặt phẳng",
      "Tìm điều kiện để vật tự trượt (tanθ > μ)",
    ],
    knowledge: [
      "Gia tốc trượt: a = g(sinθ − μ·cosθ)",
      "Điều kiện tự trượt: g·sinθ > μ·g·cosθ hay tanθ > μ",
      "Lực ma sát trượt: f = μ·N = μ·m·g·cosθ",
      "Khi a = 0 (tanθ = μ): vật trượt đều hoặc đứng yên",
    ],
    apparatus: [
      "Bàn nghiêng có góc chỉnh được (5°–60°), thước đo góc",
      "Khối gỗ, khối nhựa, miếng vải/ni lông lót mặt bàn",
      "Cảm biến chuyển động (hoặc video + thước)",
      "Quả cân 200 g, dây, ròng rọc",
    ],
    procedure: [
      "Đặt khối gỗ trên bàn nghiêng θ = 20°, thả từ yên, đo gia tốc qua video",
      "Tăng góc 30°, 40°, 50° — mỗi góc đo gia tốc 3 lần",
      "Lót vải dưới khối, lặp lại ở θ = 30°, so sánh gia tốc",
      "Tìm góc nhỏ nhất θ₀ khiến khối bắt đầu trượt (góc ma sát nghỉ)",
      "Tính μ từ a = g(sinθ − μcosθ) và từ tanθ₀",
    ],
    sim: { engineId: "inclined", params: { theta: 30, mu: 0.2, m: 2 } },
    dataRows: {
      columns: ["θ (°)", "Vật lót", "a đo (m/s²)", "a tính (m/s²)", "μ tính"],
      rows: [
        [20, "Gỗ", 1.49, 1.52, 0.32],
        [30, "Gỗ", 3.14, 3.16, 0.31],
        [40, "Gỗ", 4.78, 4.79, 0.31],
        [50, "Gỗ", 6.22, 6.24, 0.31],
        [30, "Vải", 1.87, 1.9, 0.52],
      ],
    },
    explanation:
      "Gia tốc tăng tuyến tính với sinθ và giảm khi hệ số ma sát tăng; từ công thức a = g(sinθ − μcosθ) tính ngược được μ ≈ 0,31 cho gỗ và μ ≈ 0,52 cho vải. Góc ma sát nghỉ θ₀ ≈ 17° với gỗ khớp tanθ₀ ≈ 0,31. Đây là cơ sở tính phanh dốc, thiết kế máng trượt và đường cao tốc.",
    conclusion:
      "Vật trượt trên mặt nghiêng có gia tốc a = g(sinθ − μcosθ); vật chỉ tự trượt khi tanθ > μ; hệ số ma sát có thể xác định từ gia tốc hoặc góc ma sát nghỉ.",
    quiz: [
      {
        q: "Vật đứng yên trên mặt nghiêng θ = 10°. Hệ số ma sát nghỉ μ phải thỏa:",
        options: ["μ < tan10°", "μ ≥ tan10°", "μ ≥ 1", "μ = 0"],
        answerIndex: 1,
        explain: "Để vật không trượt cần μ·g·cosθ ≥ g·sinθ, tức μ ≥ tanθ ≈ 0,18.",
      },
      {
        q: "Vì sao xe tải xuống dốc cần đi số thấp?",
        options: [
          "Để dùng phanh động cơ hãm tốc, tránh phanh quá nóng",
          "Để xe đi nhanh hơn",
          "Để tiết kiệm xăng",
          "Để giảm ma sát lốp",
        ],
        answerIndex: 0,
        explain:
          "Số thấp cho phép động cơ tạo lực hãm liên tục, thay vì dựa hoàn toàn vào phanh ma sát dễ quá nhiệt trên dốc dài.",
      },
    ],
  },
  {
    id: "TN006",
    code: "TN006",
    slug: "chuyen-dong-tron-deu-luc-huong-tam",
    title: "Chuyển động tròn đều – Lực hướng tâm qua vòng quay",
    topic: "co-hoc",
    chapter: "Chương 2 – Động lực học chất điểm",
    level: "10",
    kind: "thi-nghiem",
    durationMinutes: 20,
    description:
      "Quan sát vật chuyển động tròn đều trên đĩa quay và quả bóng buộc dây, đo gia tốc hướng tâm a = v²/r qua lực căng dây.",
    photoIds: ["circular-motion", "co-hoc"],
    intro:
      "Từ bánh xe quay đến Trái Đất quay quanh Mặt Trời: mọi chuyển động tròn đều đòi hỏi một lực hướng tâm liên tục kéo vật về tâm. Thí nghiệm này làm sáng tỏ mối liên hệ giữa vận tốc, bán kính và lực hướng tâm.",
    objectives: [
      "Xác định gia tốc hướng tâm a = v²/r",
      "Thấy vai trò của lực hướng tâm trong chuyển động tròn",
      "Phân tích hiện tượng 'lực ly tâm' trong hệ quy chiếu quay",
    ],
    knowledge: [
      "Gia tốc hướng tâm: a = v²/r = ω²·r",
      "Lực hướng tâm: F = m·v²/r — luôn hướng vào tâm",
      "Chu kỳ quay: T = 2πr/v",
      "Lực ly tâm (hệ quy chiếu quay) bằng và ngược hướng tâm lực",
    ],
    apparatus: [
      "Đĩa quay có vật đặt trên mặt (có ma sát đủ để vật quay cùng)",
      "Quả bóng buộc dây qua ống hút, quả cân tạo lực căng",
      "Đồng hồ đo vận tốc (cảm biến hoặc video)",
      "Cân, thước",
    ],
    procedure: [
      "Đặt khối nhỏ trên đĩa quay, tăng dần tốc độ đến khi khối trượt — ghi chu kỳ quay",
      "Tính vận tốc tiếp tuyến v = 2πr/T tại thời điểm trượt",
      "Buộc quả bóng vào dây dài 50 cm, xoay đều theo phương ngang, đo chu kỳ qua video",
      "Thay dây dài 80 cm, giữ nguyên vận tốc đầu dây, so sánh lực căng",
      "Kết nối kết quả với công thức F = mv²/r",
    ],
    sim: { engineId: "circular", params: { v: 10, r: 4, m: 2 } },
    dataRows: {
      columns: ["r (m)", "T quay (s)", "v (m/s)", "a = v²/r (m/s²)", "F (N)"],
      rows: [
        [0.5, 1.21, 2.6, 13.5, 27.0],
        [0.5, 0.95, 3.3, 21.8, 43.6],
        [0.8, 1.21, 4.2, 22.0, 44.0],
        [0.8, 0.95, 5.3, 35.1, 70.2],
      ],
    },
    explanation:
      "Khi tốc độ quay tăng, lực ma sát tĩnh tối đa không đủ làm lực hướng tâm khiến vật trượt ra ngoài — đó là 'bay' khỏi đĩa quay. Gia tốc hướng tâm tăng với bình phương vận tốc và giảm theo bán kính: cùng vận tốc, quỹ đạo hẹp cần lực siết mạnh hơn. Đây là nguyên lý thiết kế đường cong cao tốc và máy ly tâm.",
    conclusion:
      "Chuyển động tròn đều đòi hỏi lực hướng tâm F = mv²/r hướng vào tâm; khi lực này mất đi, vật sẽ chuyển động thẳng theo tiếp tuyến.",
    quiz: [
      {
        q: "Khi xe ô tô rẽ gấp, hành khách bị 'văng' ra ngoài. Nhận xét đúng:",
        options: [
          "Do lực ly tâm đẩy ra — thực chất là quán tính khi xe đổi hướng",
          "Do trọng lực tăng lên",
          "Do ma sát giảm",
          "Do hành khách mất khối lượng",
        ],
        answerIndex: 0,
        explain:
          "Trong hệ quy chiếu quay gọi là lực ly tâm; trong hệ quán tính, thân người giữ chuyển động thẳng trong khi xe rẽ.",
      },
      {
        q: "Cùng vận tốc, xe rẽ ở bán kính nhỏ hơn thì:",
        options: [
          "Cần lực hướng tâm lớn hơn — dễ trượt hơn",
          "Cần lực hướng tâm nhỏ hơn",
          "An toàn hơn",
          "Không ảnh hưởng gì",
        ],
        answerIndex: 0,
        explain: "F = mv²/r; r nhỏ → F lớn hơn, lốp dễ mất bám.",
      },
    ],
  },
  {
    id: "TN007",
    code: "TN007",
    slug: "archimedes-luc-day-noi",
    title: "Nguyên lý Ác-si-mét – Lực đẩy nổi và điều kiện nổi chìm",
    topic: "co-hoc",
    chapter: "Chương 2 – Động lực học chất điểm",
    level: "10",
    kind: "thi-nghiem",
    durationMinutes: 20,
    description:
      "Đo lực đẩy nổi của chất lỏng lên vật ngâm, kiểm nghiệm F = d·g·V và dự đoán điều kiện nổi, chìm, lơ lửng của vật.",
    photoIds: ["ce31-archimedes-luc-day-noi", "co-hoc"],
    intro:
      "Câu chuyện 'Eureka!' của Ác-si-mét gắn với một bài toán thực tế: vua Hi-ron muốn biết mũ miện có bị pha trộn vàng hay không. Lực đẩy nổi — món quà của chất lỏng — không chỉ giải bài toán mũ miện mà còn giải thích vì sao tàu thép nặng hàng nghìn tấn vẫn nổi.",
    objectives: [
      "Đo lực đẩy nổi tác dụng lên vật ngâm trong nước",
      "Kiểm nghiệm công thức F = d·g·V (d — khối lượng riêng chất lỏng)",
      "Phân loại điều kiện nổi, chìm, lơ lửng",
    ],
    knowledge: [
      "Lực đẩy Ác-si-mét: F = d_lỏng·g·V_thay (V_thay = thể tích phần ngâm)",
      "Điều kiện nổi: d_vật < d_lỏng; lơ lửng: d_vật = d_lỏng; chìm: d_vật > d_lỏng",
      "Trọng lượng biểu kiến: G' = G − F",
      "Tàu nổi vì thân rỗng làm d_trung bình < d_nước",
    ],
    apparatus: [
      "Cân lò xo, cốc nước, giá đỡ",
      "Vật mẫu: khối nhôm, khối gỗ, quả trứng, viên bi",
      "Bình chia độ (đo thể tích nước tràn)",
      "Nước muối (tăng d chất lỏng)",
    ],
    procedure: [
      "Treo vật vào cân lò xo, đo trọng lượng G trong không khí",
      "Nhúng chìm vật trong nước, đọc cân lò xo G', tính F = G − G'",
      "Đo thể tích vật bằng bình chia độ, tính F lý thuyết = d_nước·g·V",
      "Thả lần lượt khối nhôm, gỗ, trứng vào nước — ghi trạng thái nổi/chìm/lơ lửng",
      "Lặp lại với nước muối, quan sát trứng nổi cao hơn",
    ],
    sim: { engineId: "buoyancy", params: { V: 1, dVat: 2700, dChat: 1000 } },
    dataRows: {
      columns: ["Vật", "G (N)", "G' (N)", "F đo (N)", "F lý thuyết (N)", "Trạng thái"],
      rows: [
        ["Khối nhôm", 2.65, 1.66, 0.99, 1.0, "Chìm"],
        ["Khối gỗ", 0.78, 0.0, 0.78, 0.8, "Nổi"],
        ["Quả trứng (nước)", 0.56, 0.56, 0.0, 0.55, "Lơ lửng"],
        ["Quả trứng (nước muối)", 0.56, 0.46, 0.1, 0.1, "Nổi"],
      ],
    },
    explanation:
      "Lực đẩy nổi đo được xấp xỉ d·g·V_thay, chênh lệch chỉ vài phần trăm do sai số cân và độ nhớt nước. Khối gỗ có trọng lượng riêng nhỏ hơn nước nên nổi; quả trứng trong nước tinh khiết lơ lửng vì d_egg ≈ d_nước; trong nước muối d_lỏng tăng nên trứng nổi. Tàu thép nổi nhờ thân rỗng làm d_trung bình toàn tàu nhỏ hơn d_nước.",
    conclusion:
      "Chất lỏng đẩy vật theo phương thẳng đứng từ dưới lên với F = d·g·V_thay; vật nổi khi d_vật < d_lỏng, lơ lửng khi bằng, chìm khi lớn hơn.",
    quiz: [
      {
        q: "Một tảng đá 5 kg bị chìm dưới đáy hồ. Lực đẩy Ác-si-mét tác dụng lên nó:",
        options: [
          "Vẫn có, hướng thẳng đứng từ dưới lên",
          "Bằng 0 vì đá chìm",
          "Bằng trọng lượng đá",
          "Hướng xuống dưới",
        ],
        answerIndex: 0,
        explain:
          "Lực đẩy xuất hiện khi vật thay thế chất lỏng, bất kể nổi hay chìm; đá chìm nên V_thay = V_đá, F = d_nước·g·V_đá < G.",
      },
      {
        q: "Vì sao tàu sân bay thép nặng hàng vạn tấn vẫn nổi?",
        options: [
          "Vì thân rỗng khổng lồ làm d_trung bình nhỏ hơn d_nước",
          "Vì thép nhẹ hơn nước",
          "Vì có máy bơm liên tục",
          "Vì nước mặn không đẩy tàu",
        ],
        answerIndex: 0,
        explain: "Thể tích thay nước rất lớn so với khối lượng tàu → F đủ cân bằng trọng lượng.",
      },
    ],
  },
  {
    id: "TN008",
    code: "TN008",
    slug: "roi-tu-do-tren-cac-hanh-tinh",
    title: "Rơi tự do trên các hành tinh – So sánh gia tốc trọng trường",
    topic: "co-hoc",
    chapter: "Chương 1 – Động học chất điểm",
    level: "10",
    kind: "mo-phong",
    durationMinutes: 15,
    description:
      "Mô phỏng thả rơi cùng một vật trên Trái Đất, Mặt Trăng, Sao Hỏa, Sao Mộc để thấy g quyết định thời gian rơi.",
    photoIds: ["co-hoc", "ce01-galilei-roi-tu-do"],
    intro:
      "Nếu em thả một hòn đá trên Mặt Trăng, nó sẽ rơi chậm hơn sáu lần về gia tốc so với Trái Đất. Mô phỏng này cho phép 'du hành' tới các hành tinh khác để so sánh trực tiếp.",
    objectives: [
      "So sánh gia tốc trọng trường trên các thiên thể",
      "Tính thời gian rơi theo t = √(2h/g) với nhiều giá trị g",
      "Hiểu vì sao phi hành gia rơi chậm trong môi trường g nhỏ",
    ],
    knowledge: [
      "g phụ thuộc khối lượng và bán kính thiên thể: g = G·M/R²",
      "g_Trái Đất ≈ 9,8; g_Mặt Trăng ≈ 1,6; g_Sao Hỏa ≈ 3,7; g_Sao Mộc ≈ 24,8 m/s²",
      "Thời gian rơi: t = √(2h/g) — cùng h, g nhỏ hơn thì t dài hơn",
      "Khối lượng vật không ảnh hưởng thời gian rơi",
    ],
    apparatus: [
      "Máy tính có trình duyệt (mô phỏng tương tác)",
      "Bảng tra gia tốc trọng trường các hành tinh",
      "Máy tính cầm tay",
    ],
    procedure: [
      "Chọn độ cao thả h = 10 m trong mô phỏng, chạy với g = 9,8 (Trái Đất)",
      "Ghi thời gian rơi và vận tốc chạm đất",
      "Đổi g = 1,6 (Mặt Trăng), lặp lại, so sánh",
      "Tiếp tục với g = 3,7 (Sao Hỏa) và g = 24,8 (Sao Mộc)",
      "Kiểm tra kết quả bằng công thức t = √(2h/g)",
    ],
    sim: { engineId: "freefall", params: { h0: 10, g: 1.6 } },
    dataRows: {
      columns: ["Thiên thể", "g (m/s²)", "t tính (s)", "v chạm đất (m/s)", "So với Trái Đất"],
      rows: [
        ["Trái Đất", 9.8, 1.43, 14.0, "1,0 lần"],
        ["Mặt Trăng", 1.6, 3.54, 5.7, "2,48 lần"],
        ["Sao Hỏa", 3.7, 2.32, 8.6, "1,63 lần"],
        ["Sao Mộc", 24.8, 0.9, 22.3, "0,63 lần"],
      ],
    },
    explanation:
      "Cùng một độ cao, thời gian rơi tỉ lệ nghịch với căn bậc hai gia tốc trọng trường: trên Mặt Trăng mất gần 2,5 lần thời gian so với Trái Đất. Vận tốc chạm đất v = g·t = √(2gh) cũng nhỏ hơn ở hành tinh có g nhỏ. Đây là cơ sở để tính toán đổ bộ tàu vũ trụ trên các thiên thể khác.",
    conclusion:
      "Gia tốc trọng trường của thiên thể quyết định thời gian và tốc độ rơi; t = √(2h/g) và v = √(2gh) — độc lập với khối lượng vật.",
    quiz: [
      {
        q: "Trên Sao Mộc (g ≈ 24,8 m/s²), vật thả từ 10 m chạm đất sau khoảng:",
        options: ["0,9 s", "1,4 s", "2,3 s", "3,5 s"],
        answerIndex: 0,
        explain: "t = √(2·10/24,8) ≈ 0,9 s — nhanh hơn Trái Đất.",
      },
      {
        q: "Cùng hòn đá 2 kg thả từ 5 m trên Mặt Trăng và Trái Đất, so sánh thời gian rơi:",
        options: [
          "Mặt Trăng dài hơn vì g nhỏ hơn",
          "Bằng nhau vì cùng khối lượng",
          "Trái Đất dài hơn",
          "Phụ thuộc màu đá",
        ],
        answerIndex: 0,
        explain: "t = √(2h/g); g_Mặt Trăng ≈ 1,6 → t dài hơn ~2,5 lần.",
      },
    ],
  },
  {
    id: "TN009",
    code: "TN009",
    slug: "do-g-bang-con-lac",
    title: "Đo gia tốc trọng trường bằng con lắc đơn",
    topic: "co-hoc",
    chapter: "Chương 3 – Dao động cơ",
    level: "11",
    kind: "thi-nghiem",
    durationMinutes: 30,
    description:
      "Sử dụng con lắc đơn như một dụng cụ đo: từ chu kỳ và chiều dài dây, tính ngược gia tốc trọng trường tại nơi thí nghiệm.",
    photoIds: ["ce11-foucault-con-lac-trai-dat", "co-hoc"],
    intro:
      "Trước khi có GPS, các nhà địa vật lý dùng con lắc để vẽ bản đồ trọng lực: g thay đổi theo độ cao, vĩ độ và cấu tạo vỏ Trái Đất. Thí nghiệm này biến con lắc thành 'cân trọng trường' tự chế.",
    objectives: [
      "Thiết kế quy trình đo g bằng con lắc đơn",
      "Ước lượng sai số phép đo",
      "Hiểu ứng dụng của con lắc trong đo đạc địa vật lý",
    ],
    knowledge: [
      "Từ T = 2π√(L/g) suy ra g = 4π²·L/T²",
      "Sai số tương đối: Δg/g ≈ ΔL/L + 2ΔT/T",
      "g thay đổi theo vĩ độ (9,78 tại xích đạo → 9,83 tại cực)",
      "Độ cao tăng 1 km, g giảm khoảng 0,003 m/s²",
    ],
    apparatus: [
      "Dây dù không đàn hồi, quả lắc kim loại",
      "Thước mét (vạch mm), đồng hồ bấm giờ điện tử",
      "Góc kế, nhiệt kế",
      "Máy tính bỏ túi",
    ],
    procedure: [
      "Đo chiều dài dây L từ điểm treo tới tâm quả lắc (chính xác mm)",
      "Kéo lệch góc nhỏ 5°, thả, đếm 30 chu kỳ, tính T",
      "Lặp lại 5 lần, tính T trung bình và độ lệch chuẩn",
      "Tính g = 4π²L/T² và sai số theo công thức lan truyền",
      "So sánh với giá trị g = 9,79 m/s² tại Huế và giải thích sai số",
    ],
    sim: { engineId: "pendulum", params: { L: 1, g: 9.8, theta0: 8 } },
    dataRows: {
      columns: ["Lần", "L (m)", "30T (s)", "T (s)", "g (m/s²)"],
      rows: [
        [1, 1.0, 109.8, 3.66, 9.78],
        [2, 1.0, 109.7, 3.657, 9.8],
        [3, 1.0, 109.9, 3.663, 9.77],
        [4, 1.0, 109.8, 3.66, 9.78],
        [5, 1.0, 109.6, 3.653, 9.82],
      ],
    },
    explanation:
      "Giá trị g đo được trung bình 9,79 m/s² với độ lệch chuẩn ±0,02, khớp giá trị tham chiếu tại Huế. Sai số chính đến từ xác định tâm quả lắc và phản xạ bấm giờ; đếm 30 chu kỳ giảm đáng kể sai số thời gian. Phương pháp này từng được dùng trong các cuộc trắc địa trọng lực thế kỷ 19.",
    conclusion:
      "Con lắc đơn cho phép đo g với công thức g = 4π²L/T²; độ chính xác cao khi L đo kỹ, đếm đủ nhiều chu kỳ và giữ góc lệch nhỏ.",
    quiz: [
      {
        q: "Khi đo chu kỳ, vì sao nên đếm nhiều chu kỳ rồi chia trung bình?",
        options: [
          "Để giảm sai số bấm giờ ngẫu nhiên",
          "Để con lắc đỡ mỏi",
          "Để tăng biên độ",
          "Để chu kỳ dài hơn",
        ],
        answerIndex: 0,
        explain: "Sai số phản xạ bấm giờ (~0,2 s) chỉ chiếm tỷ lệ nhỏ khi tổng thời gian đo lớn.",
      },
      {
        q: "Đo g trên đỉnh núi so với đồng bằng, kết quả sẽ:",
        options: ["Nhỏ hơn một chút", "Lớn hơn một chút", "Bằng nhau", "Bằng 0"],
        answerIndex: 0,
        explain:
          "Càng lên cao, khoảng cách tới tâm Trái Đất lớn hơn nên g giảm (khoảng 0,3% mỗi km).",
      },
    ],
  },
  {
    id: "TN010",
    code: "TN010",
    slug: "the-nang-dan-hoi-lo-xo",
    title: "Thế năng đàn hồi của lò xo – Nén và phóng",
    topic: "co-hoc",
    chapter: "Chương 4 – Năng lượng, công, công suất",
    level: "10",
    kind: "thi-nghiem",
    durationMinutes: 20,
    description:
      "Nén lò xo các mức khác nhau, đo quãng đường vật đạt được để kiểm nghiệm U = ½kx² và bảo toàn năng lượng.",
    photoIds: ["ce05-dinh-luat-hooke", "co-hoc"],
    intro:
      "Mỗi cú nhảy của bọ chét, mỗi lần bật của loa đều là năng lượng đàn hồi giải phóng. Thí nghiệm này đo trực tiếp 'lượng năng lượng' mà một lò xo nén tích trữ được.",
    objectives: [
      "Đo công của lực đàn hồi qua quãng đường vật trượt",
      "Kiểm nghiệm U = ½kx²",
      "Kiểm tra bảo toàn năng lượng: ½kx² = ½mv² + công ma sát",
    ],
    knowledge: [
      "Thế năng đàn hồi: U = ½kx²",
      "Công của lực đàn hồi: W = ½kx₁² − ½kx₂²",
      "Bảo toàn năng lượng: ½kx² = ½mv² (bỏ qua ma sát)",
      "Định luật Hooke: F = k·x",
    ],
    apparatus: [
      "Lò xo có k đã biết, ống phóng nằm ngang",
      "Khối gỗ 100–300 g, mặt phẳng ít ma sát",
      "Thước đo quãng đường, thước chia mm",
      "Quả cân tiêu chuẩn, video",
    ],
    procedure: [
      "Đặt khối gỗ trước lò xo trên mặt phẳng ngang, nén lò xo x₁ = 2 cm",
      "Thả, đo quãng đường trượt s₁ của khối đến khi dừng",
      "Lặp lại với x = 4 cm, 6 cm, 8 cm",
      "Vẽ đồ thị s theo x² — kiểm tra tính tỉ lệ",
      "Ước lượng công ma sát và năng lượng đàn hồi đã tích trữ",
    ],
    sim: { engineId: "spring", params: { m: 0.5, k: 40, A: 0.3 } },
    dataRows: {
      columns: ["x (cm)", "x² (cm²)", "U = ½kx² (J)", "s đo (cm)", "Ghi chú"],
      rows: [
        [2, 4, 0.008, 5.0, "Nén nhẹ"],
        [4, 16, 0.032, 19.8, ""],
        [6, 36, 0.072, 44.5, ""],
        [8, 64, 0.128, 78.9, "Gần gấp 16 lần s ở 2 cm"],
      ],
    },
    explanation:
      "Quãng đường trượt s tỉ lệ thuận x² (đồ thị thẳng qua gốc) — bởi ½kx² = f·s với f là lực ma sát gần như không đổi. Khi nén gấp đôi, năng lượng tích trữ gấp 4 nên quãng đường gấp ~4 lần. Chênh lệch nhỏ giữa năng lượng đàn hồi và công ma sát là hao hụt do ma sát lăn và biến dạng.",
    conclusion:
      "Thế năng đàn hồi của lò xo là U = ½kx²; năng lượng này chuyển thành công (động năng → công ma sát) khi lò xo dãn — cơ sở của mọi hệ phóng bằng lò xo.",
    quiz: [
      {
        q: "Nén lò xo gấp 3 lần độ nén ban đầu, thế năng đàn hồi:",
        options: ["Gấp 3 lần", "Gấp 6 lần", "Gấp 9 lần", "Không đổi"],
        answerIndex: 2,
        explain: "U = ½kx² nên tỉ lệ với x²: 3² = 9 lần.",
      },
      {
        q: "Khi lò xo dãn hết cỡ về vị trí tự nhiên, thế năng đàn hồi:",
        options: ["Cực đại", "Bằng 0", "Bằng một nửa ban đầu", "Âm"],
        answerIndex: 1,
        explain:
          "x = 0 tại vị trí tự nhiên → U = ½k·0² = 0; toàn bộ năng lượng đã thành động năng.",
      },
    ],
  },
  {
    id: "TN011",
    code: "TN011",
    slug: "xe-truot-doc-mat-ngheng",
    title: "Xe trượt dốc – So sánh ma sát trượt và ma sát lăn",
    topic: "co-hoc",
    chapter: "Chương 2 – Động lực học chất điểm",
    level: "11",
    kind: "thi-nghiem",
    durationMinutes: 25,
    description:
      "So sánh xe có bánh và khối trượt trên cùng mặt nghiêng để thấy ma sát lăn nhỏ hơn ma sát trượt nhiều lần.",
    photoIds: ["ce02-galilei-mat-nghieng", "co-hoc"],
    intro:
      "Bánh xe là một trong những phát minh vĩ đại nhất của loài người vì nó biến ma sát trượt thành ma sát lăn nhỏ hơn hàng chục lần. Thí nghiệm này đo trực tiếp sự khác biệt đó.",
    objectives: [
      "Đo gia tốc của xe có bánh và khối trượt trên cùng mặt nghiêng",
      "So sánh hệ số ma sát lăn và ma sát trượt",
      "Giải thích lợi ích kỹ thuật của bánh xe, bi lăn",
    ],
    knowledge: [
      "a = g(sinθ − μ·cosθ) với μ là hệ số ma sát tương đương",
      "Ma sát lăn thường nhỏ hơn ma sát trượt 10–50 lần",
      "Bi lăn trong ổ đỡ biến trượt thành lăn — giảm tổn hao",
      "Ma sát nghỉ lớn hơn ma sát trượt: cần lực lớn hơn để bắt đầu trượt",
    ],
    apparatus: [
      "Mặt nghiêng chỉnh góc, xe mô hình có bánh (vòng bi)",
      "Khối gỗ cùng khối lượng với xe",
      "Cảm biến chuyển động hoặc video + thước",
      "Quả cân để thay đổi tải",
    ],
    procedure: [
      "Đặt xe trên mặt nghiêng θ = 10°, thả, đo gia tốc a₁",
      "Đặt khối gỗ cùng khối lượng, thả, đo gia tốc a₂",
      "Lặp lại với θ = 15°, 20° cho cả hai vật",
      "Tính μ tương đương cho xe và khối từ a = g(sinθ − μcosθ)",
      "Nạp thêm tải cho xe, kiểm tra μ lăn có thay đổi không",
    ],
    sim: { engineId: "inclined", params: { theta: 15, mu: 0.05, m: 2 } },
    dataRows: {
      columns: ["θ (°)", "Vật", "a đo (m/s²)", "μ tương đương", "Tỉ lệ μ"],
      rows: [
        [10, "Xe có bánh", 1.62, 0.015, "1"],
        [10, "Khối gỗ", 0.26, 0.32, "21 lần"],
        [15, "Xe có bánh", 2.42, 0.024, "1"],
        [15, "Khối gỗ", 1.02, 0.4, "17 lần"],
        [20, "Xe có bánh", 3.21, 0.032, "1"],
        [20, "Khối gỗ", 1.76, 0.44, "14 lần"],
      ],
    },
    explanation:
      "Xe có bánh trượt đi với gia tốc gần bằng gia tốc rơi trên mặt phẳng không ma sát (μ lăn ≈ 0,02), trong khi khối gỗ bị hãm mạnh (μ trượt ≈ 0,3–0,4). Tỉ lệ ma sát 15–20 lần lý giải vì sao xe bánh xe thay thế xe kéo trượt và vì sao ổ bi vòng bi là chi tiết then chốt trong máy móc.",
    conclusion:
      "Ma sát lăn nhỏ hơn ma sát trượt rất nhiều; bánh xe và vòng bi là giải pháp kỹ thuật giảm tổn hao ma sát trong vận chuyển và máy móc.",
    quiz: [
      {
        q: "Vì sao xe đẩy hàng thường dùng ổ bi vòng bi?",
        options: [
          "Biến ma sát trượt thành ma sát lăn, giảm lực cản",
          "Để xe nặng hơn",
          "Để bánh xe to hơn",
          "Để tăng ma sát",
        ],
        answerIndex: 0,
        explain: "Vòng bi cho phép trục quay với ma sát lăn rất nhỏ, xe đẩy nhẹ nhàng hơn nhiều.",
      },
      {
        q: "Trên cùng mặt nghiêng 15°, vật nào trượt xuống nhanh nhất?",
        options: ["Khối gỗ nhám", "Xe có bánh vòng bi", "Khối sắt nhám", "Chúng bằng nhau"],
        answerIndex: 1,
        explain: "Xe có μ lăn nhỏ nhất nên gia tốc lớn nhất.",
      },
    ],
  },
  {
    id: "TN012",
    code: "TN012",
    slug: "vong-xoay-gia-toc-huong-tam",
    title: "Vòng xoay và ghế quay – Cảm nhận gia tốc hướng tâm",
    topic: "co-hoc",
    chapter: "Chương 2 – Động lực học chất điểm",
    level: "10",
    kind: "ung-dung",
    durationMinutes: 20,
    description:
      "Phân tích ghế quay trong công viên giải trí qua công thức a = ω²r để thiết kế vòng xoay an toàn cho người chơi.",
    photoIds: ["circular-motion", "co-hoc"],
    intro:
      "Cảm giác 'bị ép vào ghế' ở vòng xoay công viên chính là phản lực của lực hướng tâm mà ghế tác dụng lên người em. Bài này phân tích số liệu để thiết kế một vòng xoay giải trí an toàn.",
    objectives: [
      "Tính gia tốc hướng tâm tại nhiều vị trí trên vòng xoay",
      "Đánh giá ngưỡng an toàn của gia tốc tác dụng lên cơ thể",
      "Thiết kế thông số vòng xoay trong giới hạn chịu đựng",
    ],
    knowledge: [
      "a = ω²·r = v²/r; với cùng ω, a tăng theo bán kính",
      "Ngưỡng chịu đựng: người bình thường chịu 3–4 g ngắn hạn",
      "Chu kỳ quay T = 2π/ω",
      "Lực ghế tác dụng lên người: N = m(g + a) tại điểm thấp nhất",
    ],
    apparatus: [
      "Mô phỏng vòng xoay (trình duyệt)",
      "Máy tính bỏ túi",
      "Dữ liệu thông số vòng xoay thực tế (tài liệu kỹ thuật công viên)",
    ],
    procedure: [
      "Chọn bán kính ghế r = 3 m, chu kỳ quay T = 4 s trong mô phỏng",
      "Tính ω = 2π/T và gia tốc a = ω²r",
      "Lặp với r = 5 m (ghế ngoài) — so sánh a",
      "Tìm chu kỳ quay lớn nhất để a ≤ 3g ở r = 5 m",
      "Kiểm tra lực ghế tác dụng lên người 50 kg tại điểm thấp nhất",
    ],
    sim: { engineId: "circular", params: { v: 9.4, r: 3, m: 50 } },
    dataRows: {
      columns: ["r (m)", "T (s)", "ω (rad/s)", "a (m/s²)", "a (đơn vị g)"],
      rows: [
        [3, 4, 1.57, 7.4, "0,75 g"],
        [5, 4, 1.57, 12.3, "1,26 g"],
        [5, 3, 2.09, 21.9, "2,24 g"],
        [5, 2.8, 2.24, 25.1, "2,56 g — giới hạn"],
      ],
    },
    explanation:
      "Ghế ngoài (r lớn hơn) trải nghiệm gia tốc lớn hơn gấp r lần ghế trong ở cùng tốc độ góc — đây là lý do vòng xoay được thiết kế sàn nghiêng và giới hạn chu kỳ quay. Với chu kỳ 2,8 s tại r = 5 m, người chơi chịu ~2,6 g — gần ngưỡng thoải mái; thiết kế an toàn thương mại giữ dưới 3 g.",
    conclusion:
      "Thiết kế vòng xoay giải trí phải kiểm soát ω và r để gia tốc hướng tâm dưới ngưỡng chịu đựng; a = ω²r là công thức cốt lõi của an toàn trò chơi cảm giác mạnh.",
    quiz: [
      {
        q: "Trên cùng một vòng xoay, người ngồi ở ghế ngoài cùng sẽ:",
        options: [
          "Chịu gia tốc hướng tâm lớn hơn người trong",
          "Nhẹ hơn",
          "Chịu gia tốc nhỏ hơn",
          "Không khác biệt",
        ],
        answerIndex: 0,
        explain: "a = ω²r với cùng ω, r lớn hơn → a lớn hơn.",
      },
      {
        q: "Vì sao sàn ghế quay thường nghiêng vào trong?",
        options: [
          "Để thành phần phản lực nghiêng tạo cảm giác thoải mái và an toàn hơn",
          "Để đẹp",
          "Để tăng tốc độ quay",
          "Để giảm trọng lượng",
        ],
        answerIndex: 0,
        explain:
          "Sàn nghiêng cho phép phản lực hợp lực hướng gần phương đứng, giảm cảm giác bị bạt sang ngang.",
      },
    ],
  },
  {
    id: "TN013",
    code: "TN013",
    slug: "vat-noi-chim-khoi-luong-rieng",
    title: "Vật nổi, chìm, lơ lửng – So sánh khối lượng riêng",
    topic: "co-hoc",
    chapter: "Chương 2 – Động lực học chất điểm",
    level: "10",
    kind: "mo-phong",
    durationMinutes: 15,
    description:
      "Thay đổi khối lượng riêng vật và chất lỏng trong mô phỏng để dự đoán trạng thái nổi – lơ lửng – chìm và độ sâu chìm.",
    photoIds: ["ce31-archimedes-luc-day-noi", "co-hoc"],
    intro:
      "Vì sao thuyền gỗ nổi nhưng đinh sắt chìm? Câu trả lời nằm gọn trong một phép so sánh khối lượng riêng. Mô phỏng này cho phép 'thiết kế' vật với bất kỳ khối lượng riêng nào để kiểm tra dự đoán.",
    objectives: [
      "Dự đoán trạng thái nổi/chìm/lơ lửng từ khối lượng riêng",
      "Tính tỷ lệ phần thể tích ngâm của vật nổi",
      "Thấy vai trò của chất lỏng (nước, nước muối, dầu) lên độ nổi",
    ],
    knowledge: [
      "d_vật < d_lỏng → nổi; d_vật = d_lỏng → lơ lửng; d_vật > d_lỏng → chìm",
      "Phần thể tích ngâm: V_ngâm/V = d_vật/d_lỏng",
      "Nước: 1000 kg/m³; nước muối bão hoà: ~1200; dầu: ~900",
      "Thuyền thép nổi nhờ kết cấu rỗng làm d_trung bình giảm",
    ],
    apparatus: [
      "Mô phỏng tương tác (trình duyệt)",
      "Bảng tra khối lượng riêng chất liệu",
      "Máy tính bỏ túi",
    ],
    procedure: [
      "Đặt vật d = 2700 kg/m³ trong nước — quan sát trạng thái",
      "Giảm d_vật về 600 kg/m³ — kiểm tra vật nổi, tính tỷ lệ ngâm",
      "Đổi chất lỏng sang dầu (d = 900) — so sánh độ nổi",
      "Tìm d_vật để lơ lửng trong nước muối (d = 1200)",
      "Vẽ đồ thị tỷ lệ ngâm theo d_vật/d_lỏng",
    ],
    sim: { engineId: "buoyancy", params: { V: 1, dVat: 600, dChat: 1000 } },
    dataRows: {
      columns: ["d_vật (kg/m³)", "d_lỏng (kg/m³)", "Tỉ lệ ngâm", "Trạng thái", "Ghi chú"],
      rows: [
        [2700, 1000, "100%", "Chìm", "Nhôm"],
        [600, 1000, "60%", "Nổi", "Gỗ nhẹ"],
        [900, 1000, "90%", "Nổi", "Gỗ nặng"],
        [900, 900, "100%", "Lơ lửng", "Trong dầu"],
        [1200, 1200, "100%", "Lơ lửng", "Muối bão hoà"],
      ],
    },
    explanation:
      "Tỷ lệ phần thể tích ngâm đúng bằng tỉ số d_vật/d_lỏng: gỗ d = 600 chìm 60% thể tích trong nước nhưng nổi hoàn toàn trên dầu nặng hơn nó. Trạng thái lơ lửng xảy ra khi hai khối lượng riêng bằng nhau — trạng thái cân bằng không trọng lượng biểu kiến, là nguyên lý tạo 'muối nổi' trong phòng thí nghiệm.",
    conclusion:
      "Trạng thái nổi – lơ lửng – chìm được quyết định hoàn toàn bởi so sánh khối lượng riêng; phần thể tích ngâm của vật nổi bằng tỉ số d_vật/d_lỏng.",
    quiz: [
      {
        q: "Tảng băng nổi trên nước vì:",
        options: [
          "d_băng ≈ 917 kg/m³ < d_nước, chìm ~92% thể tích",
          "Băng nhẹ hơn không khí",
          "Nước đẩy băng lên trên",
          "Băng có chân vịt",
        ],
        answerIndex: 0,
        explain: "917/1000 ≈ 0,92 — khoảng 92% thể tích tảng băng nằm dưới mặt nước.",
      },
      {
        q: "Quả trứng lơ lửng trong nước muối. Khi thêm nước tinh khiết vào cốc, trứng sẽ:",
        options: ["Chìm xuống", "Nổi cao lên", "Vẫn lơ lửng", "Tan ra"],
        answerIndex: 0,
        explain: "d_lỏng giảm xuống dưới d_trứng → F_day < G → trứng chìm.",
      },
    ],
  },
  {
    id: "TN014",
    code: "TN014",
    slug: "quy-dao-bong-the-thao",
    title: "Quỹ đạo bóng trong thể thao – Bài toán cự ly và độ cao",
    topic: "co-hoc",
    chapter: "Chương 1 – Động học chất điểm",
    level: "11",
    kind: "lien-mon",
    durationMinutes: 20,
    description:
      "Vận dụng công thức ném xiên vào bóng đá, bóng rổ, golf: tính tầm bay, độ cao và thời gian bay từ các số liệu thi đấu thực tế.",
    photoIds: ["co-hoc", "ce02-galilei-mat-nghieng"],
    intro:
      "Một cú sút phạt của cầu thủ là một bài toán ném xiên hoàn chỉnh: góc sút, lực sút và sức cản không khí cùng nhau vẽ nên quỹ đạo. Phân tích số liệu thể thao giúp em thấy vật lý 'sống' trong từng pha bóng.",
    objectives: [
      "Mô hình hoá đường bóng bằng công thức ném xiên",
      "Tính toán góc sút và lực sút cho tình huống cụ thể",
      "So sánh ảnh hưởng của sức cản không khí đến quỹ đạo thực",
    ],
    knowledge: [
      "R = v₀²sin(2θ)/g, H = v₀²sin²θ/(2g), t_bay = 2v₀sinθ/g",
      "Bóng có độ xoáy chịu lực Ma-gnút làm quỹ đạo cong",
      "Sức cản không khí tỉ lệ với v² — bóng nhanh bị hãm",
      "Trong nhà thi đấu (không gió) quỹ đạo sát lý thuyết hơn ngoài sân",
    ],
    apparatus: [
      "Số liệu video thi đấu (quãng đường, thời gian bay của bóng)",
      "Máy tính có mô phỏng ném xiên",
      "Máy tính bỏ túi",
    ],
    procedure: [
      "Lấy số liệu: cú sút phạt 25 m, bóng bay 1,1 s, đỉnh quỹ đạo 3,2 m",
      "Tính v₀sinθ từ thời gian bay: v₀sinθ = g·t/2",
      "Tính v₀cosθ từ tầm bay: v₀cosθ = R/t",
      "Suy v₀ và θ của cú sút, so sánh mô phỏng với video",
      "Thay đổi θ trong mô phỏng để tìm cách sút qua hàng rào 2 m",
    ],
    sim: { engineId: "projectile", params: { v0: 24, theta: 38, g: 9.8 } },
    dataRows: {
      columns: ["Tình huống", "R (m)", "t_bay (s)", "H (m)", "θ tính (°)"],
      rows: [
        ["Sút phạt 25 m", 25, 1.1, 3.2, 25.6],
        ["Tạt cánh", 30, 1.4, 4.1, 27.3],
        ["Ném biên xa", 18, 1.6, 4.8, 40.6],
        ["Đánh golf drive", 180, 5.2, 22, 23.1],
      ],
    },
    explanation:
      "Từ thời gian bay và tầm bay, tính ngược được góc sút ~26° cho cú phạt — thấp hơn góc lý thuyết 45° vì bóng có độ xoáy và sức cản. Đỉnh quỹ đạo 3,2 m đủ vượt hàng rào 2,4 m. Với golf, góc đánh 23° kết hợp đầu gậy tiếp xúc tạo độ xoáy ngược giúp bóng 'bay cao rồi bổ xuống' nhờ lực Ma-gnút.",
    conclusion:
      "Công thức ném xiên là công cụ phân tích quỹ đạo bóng trong thể thao; số liệu thực tế thường lệch khỏi lý thuyết do sức cản và độ xoáy, đòi hỏi góc sút thấp hơn 45°.",
    quiz: [
      {
        q: "Cú sút phạt góc 25° và 65° cùng vận tốc đầu, bỏ qua sức cản. Tầm bay:",
        options: ["Bằng nhau", "Góc 65° xa hơn", "Góc 25° xa hơn", "Không so sánh được"],
        answerIndex: 0,
        explain:
          "sin(2·25°) = sin(50°) = sin(130°) = sin(2·65°) — hai góc bù nhau cho cùng tầm bay.",
      },
      {
        q: "Bóng có độ xoáy ngược (backspin) bay xa hơn vì:",
        options: [
          "Lực Ma-gnút nâng bóng, kéo dài thời gian bay",
          "Bóng nhẹ hơn",
          "Trọng lực yếu hơn",
          "Không khí nóng lên",
        ],
        answerIndex: 0,
        explain:
          "Xoáy ngược tạo áp suất dưới lớn trên nhỏ (lực Ma-gnút hướng lên), bóng bổ cao và chậm rơi.",
      },
    ],
  },
];
