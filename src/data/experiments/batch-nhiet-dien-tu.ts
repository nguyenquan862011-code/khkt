/**
 * Đợt 1 — Nhiệt học, Điện học, Từ học: TN015–TN024.
 */
import type { ExperimentEntry } from "./types";

export const BATCH_NHIET_DIEN_TU: ExperimentEntry[] = [
  {
    id: "TN015",
    code: "TN015",
    slug: "nhiet-ke-chat-long-thang-do",
    title: "Nhiệt kế chất lỏng – Nguyên lý và thang đo nhiệt độ",
    topic: "nhiet-hoc",
    chapter: "Chương 1 – Sự nở vì nhiệt của chất rắn, chất lỏng",
    level: "10",
    kind: "thi-nghiem",
    durationMinutes: 20,
    description:
      "Chế tạo nhiệt kế ống nghiệm đơn giản, hiệu chuẩn thang đo và so sánh với nhiệt kế thuỷ ngân về độ nhạy.",
    photoIds: ["nhiet-hoc", "ce08-joule-nhiet-tuong-duong"],
    intro:
      "Chiếc nhiệt kế đầu tiên do Pharenhít chế tạo năm 1714 đã biến 'nóng lạnh' từ cảm giác chủ quan thành đại lượng đo được. Tự chế một nhiệt kế giúp em hiểu thấu đáo nguyên lý giãn nở và thang đo.",
    objectives: [
      "Chế tạo nhiệt kế ống nghiệm dựa trên giãn nở của chất lỏng",
      "Hiệu chuẩn hai điểm (nước đá – nước sôi) và chia độ",
      "So sánh độ nhạy của nhiệt kế tự chế với nhiệt kế chuẩn",
    ],
    knowledge: [
      "Chất lỏng nở đều khi nóng: V = V₀(1 + β·ΔT)",
      "Độ nhạy nhiệt kế phụ thuộc tiết diện ống (ống càng mảnh, vạch càng xa)",
      "Hai điểm chuẩn: 0 °C (nước đá) và 100 °C (nước sôi, 1 atm)",
      "Nhiệt kế thuỷ ngân dùng dải −39 → 357 °C; cồn dùng −114 → 78 °C",
    ],
    apparatus: [
      "Bóng ống nghiệm chứa cồn nhuộm màu, ống thuỷ tinh mảnh",
      "Nước đá, nồi đun nước sôi, nhiệt kế chuẩn",
      "Thước vạch mm, bút đánh dấu",
      "Giá đỡ, cốc to",
    ],
    procedure: [
      "Nhúng ống nghiệm cồn vào hỗn hợp nước đá 5 phút, đánh dấu mức cột cồn = 0 °C",
      "Nhúng vào nước sôi, chờ ổn định, đánh dấu mức = 100 °C",
      "Chia đều khoảng cách thành 100 vạch, mỗi vạch 1 °C",
      "Đo nước ấm ở nhiều nhiệt độ, so sánh chỉ số với nhiệt kế chuẩn",
      "Tính sai số và độ nhạy (khoảng cách vạch trên mỗi °C)",
    ],
    sim: { engineId: "thermal", params: { L0: 1, alpha: 2.3, dT: 100 } },
    dataRows: {
      columns: [
        "Môi trường",
        "Nhiệt kế chuẩn (°C)",
        "Nhiệt kế tự chế (°C)",
        "Sai số (°C)",
        "Ghi chú",
      ],
      rows: [
        ["Nước đá", 0, 0, 0, "Điểm chuẩn dưới"],
        ["Nước nguội", 22, 21, -1, ""],
        ["Nước ấm", 45, 44, -1, ""],
        ["Nước nóng", 78, 77, -1, ""],
        ["Nước sôi", 100, 100, 0, "Điểm chuẩn trên"],
      ],
    },
    explanation:
      "Nhiệt kế tự chế cho chỉ số gần đúng với nhiệt kế chuẩn, sai số ~1 °C do cột cồn giãn nở không hoàn toàn tuyến tính và ống nghiệm có dung tích lớn làm độ nhạy kém. Ống càng mảnh, cùng ΔT làm mức cột cồn di chuyển càng xa — đó là lý do nhiệt kế y tế có bầu chứa to nhưng ống rất mảnh.",
    conclusion:
      "Nhiệt kế chất lỏng hoạt động nhờ giãn nở vì nhiệt; hiệu chuẩn hai điểm cho phép chia độ thang đo; độ nhạy tăng khi tiết diện ống nhỏ.",
    quiz: [
      {
        q: "Vì sao ống nhiệt kế y tế rất mảnh?",
        options: [
          "Để mức cột cồn/thuỷ ngân di chuyển xa trên mỗi độ C — dễ đọc",
          "Để tiết kiệm thuỷ tinh",
          "Để nhiệt kế nhẹ",
          "Để đo nhanh hơn",
        ],
        answerIndex: 0,
        explain: "Tiết diện nhỏ làm cùng thể tích giãn nở tạo độ dịch chuyển lớn — tăng độ nhạy.",
      },
      {
        q: "Nhiệt kế tự chế chỉ vào 0 °C khi nhúng vào nước đá. Khi đo ở nơi áp suất thấp (đỉnh núi), điểm 100 °C thực tế sẽ:",
        options: ["Thấp hơn 100 °C", "Cao hơn 100 °C", "Vẫn đúng 100 °C", "Không đo được"],
        answerIndex: 0,
        explain:
          "Nước sôi ở nhiệt độ thấp hơn khi áp suất thấp; nhiệt kế hiệu chuẩn ở mực nước biển sẽ chỉ sai ở đỉnh núi.",
      },
    ],
  },
  {
    id: "TN016",
    code: "TN016",
    slug: "no-dai-kim-loai-he-so-gian-no",
    title: "Nở dài kim loại – Xác định hệ số giãn nở",
    topic: "nhiet-hoc",
    chapter: "Chương 1 – Sự nở vì nhiệt của chất rắn, chất lỏng",
    level: "10",
    kind: "thi-nghiem",
    durationMinutes: 30,
    description:
      "Đo độ dài thanh kim loại ở nhiều nhiệt độ để xác định hệ số giãn nở α và so sánh giữa thép, đồng, nhôm.",
    photoIds: ["nhiet-hoc", "ce08-joule-nhiet-tuong-duong"],
    intro:
      "Khe hở trên cầu thép, đường ray xe lửa có 'răng' — đều là chỗ trống dành cho kim loại nở ra khi hè đến. Nếu thiếu chúng, những công trình khổng lồ sẽ tự phá vỡ. Thí nghiệm đo trực tiếp hệ số giãn nở của kim loại.",
    objectives: [
      "Đo độ dài thanh kim loại theo nhiệt độ",
      "Xác định hệ số giãn nở dài α",
      "So sánh α của nhôm, đồng, thép và giải thích ứng dụng",
    ],
    knowledge: [
      "ΔL = L₀·α·ΔT",
      "α_nhôm ≈ 2,3·10⁻⁵; α_đồng ≈ 1,7·10⁻⁵; α_thép ≈ 1,2·10⁻⁵ (1/°C)",
      "Nở thể tích chất rắn: β ≈ 3α",
      "Ứng dụng: khe co giãn, nhiệt kế lưỡng kim, bù nhiệt trong đồng hồ",
    ],
    apparatus: [
      "Thanh nhôm, đồng, thép dài ~1 m với bầu đun hơi nước",
      "Đồng hồ so (đo dịch chuyển 0,01 mm) hoặc cảm biến",
      "Nhiệt kế kẹp, thước mét",
      "Nồi hơi nước, giá đỡ",
    ],
    procedure: [
      "Cố định thanh nhôm, đo chiều dài L₀ ở nhiệt độ phòng",
      "Cho hơi nước chạy qua bao thanh, đo nhiệt độ T và dịch chuyển ΔL qua đồng hồ so",
      "Lặp lại 4 lần, mỗi lần tăng thời gian đun (tăng dần nhiệt độ)",
      "Thay thanh bằng đồng rồi thép, lặp lại quy trình",
      "Vẽ đồ thị ΔL theo ΔT, tính α từ hệ số góc",
    ],
    sim: { engineId: "thermal", params: { L0: 1, alpha: 2.3, dT: 150 } },
    dataRows: {
      columns: ["Kim loại", "ΔT (°C)", "ΔL đo (mm)", "α đo (10⁻⁵/°C)", "α chuẩn (10⁻⁵/°C)"],
      rows: [
        ["Nhôm", 85, 1.95, 2.29, 2.3],
        ["Nhôm", 92, 2.12, 2.3, 2.3],
        ["Đồng", 88, 1.49, 1.7, 1.7],
        ["Thép", 90, 1.08, 1.2, 1.2],
      ],
    },
    explanation:
      "Đồ thị ΔL – ΔT là đường thẳng qua gốc, hệ số góc cho α với sai số dưới 2%. Nhôm giãn nhiều nhất, thép ít nhất — đúng thứ tự bảng tra. Đây là lý do thanh lưỡng kim (nhôm + thép uốn cong khi nóng) được dùng trong cầu chì nhiệt và công tắc nhiệt.",
    conclusion:
      "Độ giãn dài tỉ lệ thuận chênh lệch nhiệt độ: ΔL = L₀αΔT; mỗi chất liệu có α đặc trưng — dữ liệu then chốt trong kỹ thuật xây dựng và cơ khí chính xác.",
    quiz: [
      {
        q: "Thanh nhôm dài 2 m, ΔT = 50 °C. Độ giãn dài xấp xỉ:",
        options: ["2,3 mm", "1,15 mm", "4,6 mm", "0,23 mm"],
        answerIndex: 0,
        explain: "ΔL = 2·2,3·10⁻⁵·50 = 0,0023 m = 2,3 mm.",
      },
      {
        q: "Khe co giãn trên cầu thép có tác dụng:",
        options: [
          "Chừa chỗ cho thanh thép nở ra khi nóng, tránh ứng suất phá huỷ",
          "Trang trí",
          "Giảm trọng lượng cầu",
          "Để thoát nước mưa",
        ],
        answerIndex: 0,
        explain:
          "Không có khe, thép nở bị nén sinh ứng suất lớn, có thể làm cong vênh hoặc nứt cầu.",
      },
    ],
  },
  {
    id: "TN017",
    code: "TN017",
    slug: "di-thuong-cua-nuoc",
    title: "Dị thường của nước – Vì sao băng nổi?",
    topic: "nhiet-hoc",
    chapter: "Chương 1 – Sự nở vì nhiệt",
    level: "11",
    kind: "thi-nghiem",
    durationMinutes: 25,
    description:
      "Làm lạnh nước từ 10 °C xuống 0 °C, đo khối lượng riêng để thấy nước co lại đến 4 °C rồi giãn ra — hiện tượng dị thường cứu sống sinh vật hồ mùa đông.",
    photoIds: ["nhiet-hoc", "water-interference"],
    intro:
      "Nếu nước đóng băng từ đáy hồ lên, mọi sinh vật dưới hồ sẽ bị nghiền nát mỗi mùa đông. May thay, nước có một 'tính cách kỳ dị': nặng nhất ở 4 °C, khiến băng nổi lên trên. Thí nghiệm này truy tìm điểm dị thường đó.",
    objectives: [
      "Đo sự thay đổi khối lượng riêng của nước theo nhiệt độ",
      "Xác định nhiệt độ nước có khối lượng riêng cực đại (~4 °C)",
      "Giải thích hệ quả sinh thái của hiện tượng dị thường",
    ],
    knowledge: [
      "Nước từ 0 → 4 °C: nở khi lạnh (khối lượng riêng tăng khi nguội tới 4 °C)",
      "Khối lượng riêng cực đại tại ~4 °C: 1000 kg/m³",
      "Băng (0 °C) có d ≈ 917 kg/m³ — nhẹ hơn nước nên nổi",
      "Hồ đông: lớp 4 °C chìm xuống đáy, băng tạo lớp cách nhiệt trên mặt",
    ],
    apparatus: [
      "Bình chia độ 100 mL, cân chính xác 0,01 g",
      "Nước cất, tủ lạnh, nhiệt kế 0,1 °C",
      "Cốc cách nhiệt, muối (tạo môi trường lạnh −10 °C)",
    ],
    procedure: [
      "Lấy mẫu nước 10,0 °C, cân 100 mL, tính khối lượng riêng",
      "Làm nguội từng bước 8, 6, 5, 4, 3, 2, 1 °C — mỗi mức cân lại",
      "Vẽ đồ thị d(T) của nước",
      "So sánh khối lượng riêng nước 4 °C và 2 °C",
      "Đặt viên đá nổi trên cốc nước 4 °C — quan sát và giải thích",
    ],
    sim: { engineId: "thermal", params: { L0: 1, alpha: -0.5, dT: 60 } },
    dataRows: {
      columns: ["T (°C)", "Khối lượng 100 mL (g)", "d (kg/m³)", "So với 4 °C", "Ghi chú"],
      rows: [
        [10, 99.97, 999.7, "−0,03%", ""],
        [8, 99.99, 999.9, "−0,01%", ""],
        [6, 100.0, 1000.0, "0%", "Gần cực đại"],
        [4, 100.0, 1000.0, "0%", "Cực đại"],
        [2, 99.99, 999.9, "−0,01%", "Bắt đầu 'dị thường'"],
        [1, 99.98, 999.8, "−0,02%", "Giãn ra khi lạnh thêm"],
      ],
    },
    explanation:
      "Từ 10 về 4 °C, nước co lại bình thường; nhưng dưới 4 °C, các phân tử nước liên kết thành cấu trúc tinh thể mở rộng (tiền thân của băng) làm thể tích tăng trở lại — khối lượng riêng giảm. Lớp nước 4 °C chìm xuống đáy hồ, lớp lạnh hơn nổi lên và đóng băng trên mặt: lớp băng cách nhiệt bảo vệ sinh vật dưới hồ suốt mùa đông.",
    conclusion:
      "Nước có khối lượng riêng cực đại tại ~4 °C và giãn ra khi lạnh tiếp xuống 0 °C — hiện tượng dị thường quyết định mùa đông ôn hoà của các hồ, sông ở xứ lạnh.",
    quiz: [
      {
        q: "Lớp nước nào chìm xuống đáy hồ khi hồ bắt đầu đông?",
        options: ["Lớp 4 °C", "Lớp 0 °C", "Lớp 10 °C", "Lớp băng"],
        answerIndex: 0,
        explain: "4 °C là nhiệt độ nước nặng nhất nên chìm xuống, tạo lớp nước lỏng dưới đáy.",
      },
      {
        q: "Nếu băng chìm xuống nước, mùa đông sinh vật hồ sẽ:",
        options: [
          "Bị băng lấp đầy từ đáy lên — khó sống sót",
          "Vẫn bình thường",
          "Sống tốt hơn",
          "Bơi lên bờ",
        ],
        answerIndex: 0,
        explain:
          "Băng nổi là lớp cách nhiệt; nếu băng chìm, hồ sẽ đông đặc dần từ đáy, phá hủy môi trường sống.",
      },
    ],
  },
  {
    id: "TN018",
    code: "TN018",
    slug: "ap-suat-khi-va-nhiet-do",
    title: "Áp suất khí và nhiệt độ – Định luật Sác-lơ",
    topic: "nhiet-hoc",
    chapter: "Chương 3 – Khí",
    level: "10",
    kind: "thi-nghiem",
    durationMinutes: 25,
    description:
      "Đo áp suất khí trong bình kín ở nhiều nhiệt độ để kiểm nghiệm p tỉ lệ thuận nhiệt độ tuyệt đối (Sác-lơ) và giải thích vì sao lốp xe nổ ngày hè.",
    photoIds: ["nhiet-hoc", "ce14-boyle-mariotte-dang-nhiet"],
    intro:
      "Chiếc lốp xe căng cứng buổi sáng có thể 'xì' hay nổ khi chạy giữa trưa nắng — đó là định luật Sác-lơ hiện hình. Thí nghiệm theo dõi áp suất khí khi đun nóng trong bình kín.",
    objectives: [
      "Đo áp suất khí theo nhiệt độ ở thể tích không đổi",
      "Kiểm nghiệm p/T = const (nhiệt độ Kelvin)",
      "Ứng dụng giải thích hiện tượng thực tế với lốp xe, hộp kín",
    ],
    knowledge: [
      "Định luật Sác-lơ: p = p₀·T/T₀ (T tính bằng K), thể tích không đổi",
      "T(K) = t(°C) + 273",
      "Khí lý tưởng: pV = nRT",
      "An toàn: lốp xe chỉ được bơm đúng áp suất khuyến nghị",
    ],
    apparatus: [
      "Bình khí kín gắn cảm biến áp suất",
      "Nồi nước nóng, nhiệt kế, nước đá",
      "Máy tính ghi dữ liệu (hoặc đọc tay)",
    ],
    procedure: [
      "Đặt bình khí ở nhiệt độ phòng, ghi p₀ và T₀",
      "Nhúng bình vào nước 40 °C, chờ cân bằng, ghi p, T",
      "Lặp lại ở 60, 80 °C và 10 °C (nước đá)",
      "Quy đổi nhiệt độ sang Kelvin, vẽ đồ thị p theo T(K)",
      "Kiểm tra tỉ số p/T có hằng số không",
    ],
    sim: { engineId: "gas-law", params: { n: 1, T: 300, V: 22.4 } },
    dataRows: {
      columns: ["t (°C)", "T (K)", "p đo (atm)", "p/T (×10⁻³)", "Ghi chú"],
      rows: [
        [10, 283, 0.945, 3.34, "Nước đá"],
        [25, 298, 1.0, 3.36, "Phòng"],
        [40, 313, 1.051, 3.36, ""],
        [60, 333, 1.118, 3.36, ""],
        [80, 353, 1.185, 3.36, "Nước nóng"],
      ],
    },
    explanation:
      "Đồ thị p – T(K) là đường thẳng qua gốc toạ độ, tỉ số p/T hằng số ≈ 3,36·10⁻³ atm/K — đúng định luật Sác-lơ. Áp suất lốp xe tăng ~3% cho mỗi 10 °C tăng nhiệt độ; lốp bơm căng ngày hè chạy đường dài có thể vượt áp suất thiết kế — nguyên nhân nổ lốp.",
    conclusion:
      "Ở thể tích không đổi, áp suất khí tỉ lệ thuận nhiệt độ tuyệt đối; đây là cơ sở an toàn khi sử dụng bình kín, lốp xe trong điều kiện nhiệt độ cao.",
    quiz: [
      {
        q: "Bình khí kín ban đầu ở 27 °C, đun lên 127 °C (thể tích không đổi). Áp suất:",
        options: ["Tăng 1,33 lần", "Tăng 4,7 lần", "Không đổi", "Giảm một nửa"],
        answerIndex: 0,
        explain: "T₁ = 300 K, T₂ = 400 K → p₂ = p₁·400/300 ≈ 1,33 p₁.",
      },
      {
        q: "Vì sao không nên bơm lốp xe quá căng?",
        options: [
          "Khi nắng nóng, áp suất tăng thêm có thể vượt giới hạn chịu đựng",
          "Để xe đi êm hơn",
          "Vì lốp căng tiết kiệm cao su",
          "Để bánh xe to hơn",
        ],
        answerIndex: 0,
        explain:
          "p tăng theo nhiệt độ; lốp quá căng không còn 'chừa' dư địa áp suất khi nhiệt độ tăng.",
      },
    ],
  },
  {
    id: "TN019",
    code: "TN019",
    slug: "dinh-luat-ohm-mach-don-gian",
    title: "Định luật Ôm – Quan hệ giữa U, I, R",
    topic: "dien-hoc",
    chapter: "Chương 2 – Dòng điện trong kim loại",
    level: "10",
    kind: "thi-nghiem",
    durationMinutes: 25,
    description:
      "Đo hiệu điện thế và cường độ dòng điện qua điện trở để kiểm nghiệm I = U/R và xác định điện trở từ độ dốc đồ thị.",
    photoIds: ["dien-tu", "ce16-dinh-luat-ohm"],
    intro:
      "Định luật Ôm là 'định luật vạn năng' của mọi mạch điện: từ sợi tóc trong bóng đèn đến vi mạch trong điện thoại. Thí nghiệm này dựng đồ thị U–I để 'nhìn thấy' định luật.",
    objectives: [
      "Đo U và I qua điện trở cố định",
      "Kiểm nghiệm I tỉ lệ thuận U (định luật Ôm)",
      "Xác định R từ độ dốc đồ thị U–I",
    ],
    knowledge: [
      "I = U/R (U — hiệu điện thế, R — điện trở)",
      "Đồ thị U–I là đường thẳng qua gốc, độ dốc = R",
      "Điện trở dây dẫn: R = ρ·l/S",
      "Đơn vị: 1 Ω = 1 V/A",
    ],
    apparatus: [
      "Nguồn điện 0–12 V, ampe kế, vôn kế",
      "Điện trở 5 Ω, 10 Ω, 20 Ω, biến trở",
      "Mạch điện, dây nối, cầu dao",
    ],
    procedure: [
      "Mắc mạch: nguồn – ampe kế – điện trở 10 Ω – cầu dao",
      "Chỉnh điện áp 2 V, đọc I; tăng dần 4, 6, 8, 10 V — ghi I mỗi mức",
      "Lặp lại với điện trở 5 Ω và 20 Ω",
      "Vẽ đồ thị U–I cho ba điện trở",
      "Tính R từ độ dốc, so sánh với giá trị danh định",
    ],
    sim: { engineId: "ohm-circuit", params: { U: 12, R: 10 } },
    dataRows: {
      columns: ["U (V)", "I với 5 Ω (A)", "I với 10 Ω (A)", "I với 20 Ω (A)", "Ghi chú"],
      rows: [
        [2, 0.4, 0.2, 0.1, ""],
        [4, 0.8, 0.4, 0.2, ""],
        [6, 1.2, 0.6, 0.3, "Tỉ lệ thuận"],
        [8, 1.6, 0.8, 0.4, ""],
        [10, 2.0, 1.0, 0.5, ""],
      ],
    },
    explanation:
      "Ba đồ thị U–I đều là đường thẳng qua gốc; độ dốc lần lượt 5,0; 10,1; 19,8 Ω — khớp giá trị danh định trong sai số 1%. Điện trở càng lớn, dòng điện càng nhỏ ở cùng hiệu điện thế — trực quan hoá mối nghịch đảo I ∝ 1/R.",
    conclusion:
      "Dòng điện qua kim loại tỉ lệ thuận hiệu điện thế và tỉ lệ nghịch điện trở: I = U/R; R xác định từ độ dốc đồ thị U–I.",
    quiz: [
      {
        q: "Điện trở 12 Ω mắc vào nguồn 6 V. Cường độ dòng điện:",
        options: ["0,5 A", "2 A", "72 A", "18 A"],
        answerIndex: 0,
        explain: "I = U/R = 6/12 = 0,5 A.",
      },
      {
        q: "Khi U tăng gấp đôi qua cùng điện trở, I sẽ:",
        options: ["Tăng gấp đôi", "Không đổi", "Giảm một nửa", "Tăng gấp 4"],
        answerIndex: 0,
        explain: "I = U/R nên tỉ lệ thuận với U.",
      },
    ],
  },
  {
    id: "TN020",
    code: "TN020",
    slug: "cong-suat-joule-dien-nang",
    title: "Công suất Joule – Điện năng chuyển thành nhiệt",
    topic: "dien-hoc",
    chapter: "Chương 2 – Dòng điện trong kim loại",
    level: "10",
    kind: "thi-nghiem",
    durationMinutes: 25,
    description:
      "Đo nhiệt độ nước nóng lên bởi điện trở đun để xác định hệ số chuyển đổi điện năng → nhiệt năng (4,2 J/calo) và công suất Joule.",
    photoIds: ["dien-tu", "ce08-joule-nhiet-tuong-duong"],
    intro:
      "Joule mất hàng năm trời quay tay quấn dây điện trong nước để chứng minh điện năng hoá nhiệt năng. Thí nghiệm hiện đại tái hiện hành trình đó với cảm biến nhiệt độ và nguồn điện ổn định.",
    objectives: [
      "Đo công suất điện tiêu thụ P = U·I",
      "Xác định nhiệt lượng nước nhận: Q = c·m·ΔT",
      "Kiểm nghiệm mối liên hệ W = Q (hệ số 4,2 J/calo)",
    ],
    knowledge: [
      "Công suất Joule: P = U·I = I²R = U²/R",
      "Nhiệt lượng: Q = c·m·ΔT (c_nước = 4200 J/kg·K)",
      "Điện năng: W = U·I·t",
      "Hệ số chuyển đổi: 1 calo = 4,2 J",
    ],
    apparatus: [
      "Điện trở đun 500 W trong bình cách nhiệt",
      "Nhiệt kế 0,1 °C, cân, đồng hồ đo điện",
      "Nguồn điện ổn định, vôn kế, ampe kế",
    ],
    procedure: [
      "Cân 0,50 kg nước vào bình cách nhiệt, ghi nhiệt độ đầu T₀",
      "Mắc điện trở đun, ghi U, I, bật trong 5 phút",
      "Tắt, khuấy đều, ghi nhiệt độ cuối T",
      "Tính W = UIt và Q = cmΔT, so sánh",
      "Lặp lại với thời gian đun 10 phút",
    ],
    sim: { engineId: "ohm-circuit", params: { U: 220, R: 96.8 } },
    dataRows: {
      columns: ["Lần", "t (s)", "W = UIt (J)", "ΔT (°C)", "Q = cmΔT (J)", "W/Q"],
      rows: [
        [1, 300, 150000, 7.0, 14700, 1.02],
        [2, 600, 300000, 14.2, 29820, 1.01],
      ],
    },
    explanation:
      "Tỉ số W/Q ≈ 1,01 — gần bằng 1 trong sai số đo nhiệt (hao hụt ra môi trường ~5–10% nhưng bù bởi nhiệt dung dụng cụ). Kết quả xác nhận điện năng chuyển hoá hoàn toàn thành nhiệt năng trong điện trở — định luật Joule-Lenz, cơ sở của ấm đun, bàn là, lò sưởi điện.",
    conclusion:
      "Điện năng tiêu thụ W = UIt chuyển thành nhiệt Q = cmΔT với hiệu suất ~95–100%; công suất nhiệt P = U²/R là thông số thiết kế của mọi thiết bị đun nóng.",
    quiz: [
      {
        q: "Ấm điện 1000 W đun sôi nước lâu hơn ấm 2000 W vì:",
        options: [
          "Công suất nhỏ hơn → mỗi giây truyền ít nhiệt hơn",
          "Ấm 1000 W nặng hơn",
          "Nước sôi ở nhiệt độ thấp hơn",
          "Điện trở lớn hơn nên nóng hơn",
        ],
        answerIndex: 0,
        explain:
          "Q = P·t; cùng lượng nhiệt cần, t = Q/P — công suất nhỏ gấp đôi thì thời gian gấp đôi.",
      },
      {
        q: "Một điện trở R, tăng U gấp đôi. Công suất Joule:",
        options: ["Tăng gấp 4", "Tăng gấp 2", "Không đổi", "Giảm 4 lần"],
        answerIndex: 0,
        explain: "P = U²/R nên tỉ lệ với U².",
      },
    ],
  },
  {
    id: "TN021",
    code: "TN021",
    slug: "mach-phan-nhanh-phan-dong",
    title: "Mắc mắc song song – Phân dòng trong mạch",
    topic: "dien-hoc",
    chapter: "Chương 3 – Mắc điện",
    level: "11",
    kind: "thi-nghiem",
    durationMinutes: 25,
    description:
      "Mắc hai điện trở song song, đo dòng qua từng nhánh để kiểm nghiệm quy tắc phân dòng và công thức điện trở tương đương.",
    photoIds: ["dien-tu", "ce37-kirchhoff-mach-phan-nhanh"],
    intro:
      "Mạng điện gia đình là một hệ song song khổng lồ: mọi thiết bị nhận cùng điện áp 220 V nhưng dòng điện chia theo công suất. Thí nghiệm này mô phỏng thu nhỏ mạng điện đó.",
    objectives: [
      "Đo dòng điện qua từng nhánh trong mạch song song",
      "Kiểm nghiệm I = I₁ + I₂ và U₁ = U₂ = U",
      "Xác định điện trở tương đương 1/R = 1/R₁ + 1/R₂",
    ],
    knowledge: [
      "Mắc song song: U₁ = U₂ = U; I = I₁ + I₂",
      "Điện trở tương đương: 1/R = 1/R₁ + 1/R₂",
      "Phân dòng: I₁/I₂ = R₂/R₁",
      "Mạng gia đình: thiết bị mắc song song để dùng độc lập",
    ],
    apparatus: [
      "Nguồn 12 V, ampe kế, vôn kế",
      "Điện trở 10 Ω, 20 Ω, biến trở, cầu dao",
      "Bảng mắc điện, dây nối",
    ],
    procedure: [
      "Mắc R₁ = 10 Ω song song R₂ = 20 Ω vào nguồn 12 V",
      "Đo U qua mỗi nhánh và I từng nhánh, I tổng",
      "Thay R₂ = 10 Ω, lặp lại phép đo",
      "Tính R tương đương từ I tổng, so sánh công thức",
      "Kiểm tra quy tắc phân dòng I₁/I₂ = R₂/R₁",
    ],
    sim: { engineId: "ohm-circuit", params: { U: 12, R: 6.7 } },
    dataRows: {
      columns: ["R₁ (Ω)", "R₂ (Ω)", "I₁ (A)", "I₂ (A)", "I (A)", "R tương đương (Ω)"],
      rows: [
        [10, 20, 1.2, 0.6, 1.8, 6.7],
        [10, 10, 1.2, 1.2, 2.4, 5.0],
        [20, 20, 0.6, 0.6, 1.2, 10.0],
      ],
    },
    explanation:
      "Tổng dòng I = I₁ + I₂ khớp định luật Kiếc-hốp về dòng điện; điện trở tương đương luôn nhỏ hơn điện trở nhánh nhỏ nhất. Nhánh điện trở nhỏ nhận dòng lớn hơn — giải thích vì sao dây dẫn mảnh (R lớn) trong ổ cắm chia tải kém an toàn khi cắm nhiều thiết bị công suất lớn.",
    conclusion:
      "Mạch mắc song song: điện áp các nhánh bằng nhau, dòng điện chia tỉ lệ nghịch điện trở; R tương đương nhỏ hơn mọi R nhánh — nguyên tắc tổ chức mạng điện gia đình.",
    quiz: [
      {
        q: "Hai điện trở 6 Ω và 3 Ω mắc song song. Điện trở tương đương:",
        options: ["2 Ω", "4,5 Ω", "9 Ω", "1,5 Ω"],
        answerIndex: 0,
        explain: "1/R = 1/6 + 1/3 = 1/2 → R = 2 Ω.",
      },
      {
        q: "Vì sao thiết bị gia đình mắc song song chứ không mắc nối tiếp?",
        options: [
          "Để mỗi thiết bị nhận đủ 220 V và hoạt động độc lập",
          "Để tiết kiệm dây",
          "Để dòng điện nhỏ hơn",
          "Để điện áp tăng gấp đôi",
        ],
        answerIndex: 0,
        explain:
          "Song song đảm bảo điện áp danh định cho từng thiết bị; tắt một thiết bị không ảnh hưởng thiết bị khác.",
      },
    ],
  },
  {
    id: "TN022",
    code: "TN022",
    slug: "tu-dien-xa-rc",
    title: "Tụ điện RC – Quá trình nạp và xả",
    topic: "dien-hoc",
    chapter: "Chương 3 – Mắc điện",
    level: "12",
    kind: "thi-nghiem",
    durationMinutes: 30,
    description:
      "Theo dõi điện áp trên tụ khi nạp và xả qua điện trở, xác định hằng số thời gian τ = RC và đồ thị U(t) = U₀·e^(−t/RC).",
    photoIds: ["ce36-tu-dien-phong-nap-rc", "dien-tu"],
    intro:
      "Nhấp nháy đèn báo, bộ lọc âm thanh, bộ nhớ máy tính — đều dựa trên cách tụ điện 'từ từ' nạp và xả. Đường cong mũ e trong thí nghiệm này là 'chữ ký' của mọi hệ có quán tính điện.",
    objectives: [
      "Đo điện áp tụ theo thời gian khi nạp và xả",
      "Xác định hằng số thời gian τ = RC",
      "Kiểm nghiệm hàm mũ U(t) = U₀·e^(−t/τ)",
    ],
    knowledge: [
      "Xả: U(t) = U₀·e^(−t/RC); sau τ, U = 0,37 U₀",
      "Nạp: U(t) = U₀(1 − e^(−t/RC))",
      "Hằng số thời gian τ = RC (s) với R (Ω), C (F)",
      "Sau 5τ, quá trình coi như hoàn tất (>99%)",
    ],
    apparatus: [
      "Tụ điện 470 µF, 1000 µF; điện trở 1 kΩ, 4,7 kΩ",
      "Nguồn 12 V, khóa chuyển nạp/xả",
      "Vôn kế số ghi liên tục (hoặc cảm biến + máy tính)",
      "Đồng hồ bấm giờ",
    ],
    procedure: [
      "Nạp tụ 1000 µF qua điện trở 4,7 kΩ đến 12 V",
      "Chuyển sang xả, ghi U mỗi 5 s trong 2 phút",
      "Vẽ đồ thị ln(U) theo t — kiểm tra tính thẳng",
      "Thay R = 1 kΩ, lặp lại, so sánh τ",
      "Tính τ từ đồ thị, so sánh với RC lý thuyết",
    ],
    sim: { engineId: "capacitor", params: { U0: 12, R: 4.7, C: 1000 } },
    dataRows: {
      columns: ["t (s)", "U với 4,7 kΩ (V)", "U với 1 kΩ (V)", "U lý thuyết (V)", "Ghi chú"],
      rows: [
        [0, 12.0, 12.0, 12.0, "Bắt đầu xả"],
        [5, 7.7, 2.9, 7.7, "τ = 4,7 s"],
        [10, 4.9, 0.7, 4.9, ""],
        [20, 2.0, 0.05, 2.0, ""],
        [30, 0.8, 0, 0.8, "Gần xả hết"],
      ],
    },
    explanation:
      "Đồ thị ln(U) – t là đường thẳng với hệ số góc −1/RC, xác nhận quy luật hàm mũ. Với R = 4,7 kΩ, τ = 4,7 s — sau 5τ ≈ 24 s tụ xả gần hết; với R = 1 kΩ, τ rút xuống 1 s. Đây là nguyên lý hẹn giờ điện, bộ lọc tần số và đếm xung trong kỹ thuật số.",
    conclusion:
      "Quá trình nạp/xả tụ điện qua điện trở tuân theo hàm mũ với hằng số thời gian τ = RC; điều chỉnh R và C cho phép thiết kế thời gian trễ theo ý muốn.",
    quiz: [
      {
        q: "Tụ 1000 µF xả qua 4,7 kΩ. Sau 4,7 s, điện áp còn khoảng:",
        options: ["37% U₀", "50% U₀", "10% U₀", "0% U₀"],
        answerIndex: 0,
        explain: "Sau đúng một hằng số thời gian τ = RC, U = U₀/e ≈ 0,37 U₀.",
      },
      {
        q: "Muốn đèn LED tắt chậm hơn sau khi ngắt công tắc, nên:",
        options: ["Tăng R hoặc tăng C", "Giảm R", "Giảm C", "Tăng điện áp nguồn"],
        answerIndex: 0,
        explain: "τ = RC — tăng R hoặc C làm τ dài hơn, tụ xả chậm hơn.",
      },
    ],
  },
  {
    id: "TN023",
    code: "TN023",
    slug: "cam-ung-faraday-dong-dien",
    title: "Cảm ứng Faraday – Dòng điện sinh ra từ từ thông biến đổi",
    topic: "tu-hoc",
    chapter: "Chương 1 – Cảm ứng điện từ",
    level: "11",
    kind: "thi-nghiem",
    durationMinutes: 25,
    description:
      "Di chuyển nam châm qua cuộn dây, quan sát dòng điện cảm ứng và kiểm nghiệm ε = −N·ΔΦ/Δt qua số vòng dây và tốc độ di chuyển.",
    photoIds: ["ce19-cam-ung-faraday", "dien-tu"],
    intro:
      "Năm 1831, Faraday phát hiện: chỉ cần đưa nam châm lại gần cuộn dây, kim la bàn bên cạnh dây lệch đi — dòng điện đã sinh ra từ... từ. Phát hiện đó cấp điện cho cả thế giới hiện đại.",
    objectives: [
      "Quan sát dòng điện cảm ứng khi từ thông qua cuộn dây biến đổi",
      "Thấy vai trò của tốc độ di chuyển nam châm và số vòng dây",
      "Kiểm nghiệm định luật Faraday ε = −N·ΔΦ/Δt",
    ],
    knowledge: [
      "Định luật Faraday: ε = −N·ΔΦ/Δt",
      "Dấu âm thể hiện định luật Lenz (dòng cảm ứng chống lại nguyên nhân sinh ra nó)",
      "Từ thông Φ = B·S·cosα",
      "Ứng dụng: máy phát điện, sạc không dây, loa, micro",
    ],
    apparatus: [
      "Cuộn dây 300 và 600 vòng, nam châm vạch mạnh",
      "Galvanô (kim chỉ dòng điện hai chiều)",
      "Ống nghiệm, dây nối",
      "Máy quay video (ghi độ lệch kim)",
    ],
    procedure: [
      "Mắc cuộn 300 vòng với galvanô, nhét nam châm vào nhanh — ghi độ lệch kim",
      "Nhét chậm — so sánh độ lệch",
      "Rút nam châm ra — ghi chiều kim lệch",
      "Thay cuộn 600 vòng, lặp lại động tác nhét nhanh",
      "Tổng hợp: ε phụ thuộc tốc độ và số vòng thế nào",
    ],
    sim: { engineId: "em-induction", params: { v: 1.5, N: 300, B: 0.3 } },
    dataRows: {
      columns: ["Số vòng N", "Tốc độ di chuyển", "Độ lệch kim", "ε tương đối", "Ghi chú"],
      rows: [
        [300, "Nhanh", "Lớn", "1,0", "Chuẩn so sánh"],
        [300, "Chậm", "Nhỏ", "≈0,4", "Δt lớn"],
        [600, "Nhanh", "Rất lớn", "≈2,0", "Gấp đôi N"],
        [300, "Nhét vào", "Lệch phải", "+ε", "ΔΦ > 0"],
        [300, "Rút ra", "Lệch trái", "−ε", "ΔΦ < 0"],
      ],
    },
    explanation:
      "Độ lệch kim tỉ lệ thuận tốc độ thay đổi từ thông: di chuyển nhanh (Δt nhỏ) sinh điện động cảm ứng lớn. Gấp đôi số vòng dây làm ε gấp đôi. Chiều kim đảo khi đổi chiều di chuyển nam châm — thể hiện định luật Lenz: dòng cảm ứng luôn cố giữ nguyên từ thông, chống lại sự thay đổi sinh ra nó.",
    conclusion:
      "Điện động cảm ứng tỉ lệ thuận tốc độ biến thiên từ thông và số vòng dây: ε = −N·ΔΦ/Δt — nguyên lý hoạt động của máy phát điện và sạc không dây.",
    quiz: [
      {
        q: "Giữ nam châm bất động trong cuộn dây. Dòng cảm ứng:",
        options: [
          "Bằng 0 vì từ thông không đổi",
          "Vẫn có nhưng yếu",
          "Tăng dần",
          "Đảo chiều liên tục",
        ],
        answerIndex: 0,
        explain: "ε = −N·ΔΦ/Δt; ΔΦ = 0 → ε = 0 — cần từ thông PHẢI biến đổi.",
      },
      {
        q: "Muốn tăng điện động cảm ứng, có thể:",
        options: [
          "Tăng số vòng dây hoặc di chuyển nam châm nhanh hơn",
          "Giảm số vòng dây",
          "Dùng nam châm yếu hơn",
          "Dừng nam châm lại",
        ],
        answerIndex: 0,
        explain: "ε ∝ N và ε ∝ ΔΦ/Δt — cả hai cách đều tăng ε.",
      },
    ],
  },
  {
    id: "TN024",
    code: "TN024",
    slug: "dinh-luat-lenz-chieu-dong-cam-ung",
    title: "Định luật Lenz – Chiều dòng cảm ứng và sự chống lại",
    topic: "tu-hoc",
    chapter: "Chương 1 – Cảm ứng điện từ",
    level: "11",
    kind: "mo-phong",
    durationMinutes: 20,
    description:
      "Mô phỏng dòng điện cảm ứng trong cuộn dây khi đưa nam châm vào/ra để xác nhận: dòng cảm ứng luôn sinh từ trường chống lại sự thay đổi từ thông.",
    photoIds: ["ce20-lenz-chieu-dong-cam-ung", "dien-tu"],
    intro:
      "Lenz tìm ra 'phép lịch sự' của tự nhiên: dòng cảm ứng không bao giờ 'vô ơn' — nó luôn phản kháng lại nguyên nhân sinh ra mình. Chính 'sự phản kháng' ấy là cơ sở của phanh tái sinh trên ô tô điện.",
    objectives: [
      "Xác định chiều dòng cảm ứng theo quy tắc nắm tay phải",
      "Thấy lực từ luôn cản chuyển động của nam châm",
      "Giải thích phanh từ và phanh tái sinh",
    ],
    knowledge: [
      "Định luật Lenz: dòng cảm ứng có chiều sinh từ trường chống sự biến thiên từ thông",
      "Quy tắc nắm tay phải: ngón cái theo chiều từ thông tăng, ngón cong = chiều dòng cảm ứng",
      "Lực từ luôn CẢN chuyển động gây ra dòng cảm ứng",
      "Bảo toàn năng lượng: công cơ học → điện năng → nhiệt",
    ],
    apparatus: [
      "Mô phỏng tương tác cuộn dây + nam châm (trình duyệt)",
      "Nam châm vạch, cuộn dây, galvanô (thí nghiệm thật đối chứng)",
    ],
    procedure: [
      "Đẩy cực Bắc nam châm vào cuộn — ghi chiều dòng cảm ứng trong mô phỏng",
      "Dừng nam châm giữa cuộn — kiểm tra dòng bằng 0",
      "Rút nam châm ra — ghi chiều dòng (đảo lại)",
      "Đẩy nhanh hơn — so sánh độ lớn dòng",
      "Đảo cực nam châm, lặp lại toàn bộ",
    ],
    sim: { engineId: "em-induction", params: { v: 2, N: 400, B: 0.4 } },
    dataRows: {
      columns: ["Thao tác", "Từ thông qua cuộn", "Dòng cảm ứng", "Lực từ lên nam châm", "Ghi chú"],
      rows: [
        ["Đẩy cực Bắc vào", "Tăng", "Ngược chiều kim đồng hồ", "Cản — đẩy ra", "Chống tăng Φ"],
        ["Giữ yên", "Không đổi", "0", "0", ""],
        ["Rút cực Bắc ra", "Giảm", "Thuận kim đồng hồ", "Cản — kéo vào", "Chống giảm Φ"],
        ["Đẩy cực Nam vào", "Tăng (ngược)", "Đảo chiều so với dòng 1", "Cản — đẩy ra", ""],
      ],
    },
    explanation:
      "Mọi trường hợp đều tuân quy tắc: dòng cảm ứng sinh từ trường bù đắp sự thay đổi từ thông — khi nam châm vào, từ trong cuộn đẩy ngược; khi ra, từ trong cuộn hút lại. Lực từ luôn cản chuyển động: muốn tạo điện thì phải tiêu tốn công cơ học — minh chứng cho định luật bảo toàn năng lượng.",
    conclusion:
      "Dòng cảm ứng luôn có chiều chống lại nguyên nhân sinh ra nó (định luật Lenz); đây là cơ sở của phanh từ, phanh tái sinh và nguyên lý hoạt động máy phát điện.",
    quiz: [
      {
        q: "Khi thả nam châm rơi qua ống đồng đặc, nam châm rơi chậm hơn vì:",
        options: [
          "Dòng cảm ứng trong ống sinh lực từ cản chuyển động",
          "Không khí trong ống đặc hơn",
          "Nam châm mất từ tính",
          "Trọng lực yếu đi",
        ],
        answerIndex: 0,
        explain: "Dòng Fu-cô trong ống sinh từ trường cản — minh hoạ trực tiếp định luật Lenz.",
      },
      {
        q: "Định luật Lenz là hệ quả của nguyên tắc nào?",
        options: [
          "Bảo toàn năng lượng",
          "Bảo toàn điện tích",
          "Bảo toàn động lượng",
          "Bảo toàn khối lượng",
        ],
        answerIndex: 0,
        explain:
          "Nếu dòng cảm ứng hỗ trợ nguyên nhân, năng lượng sẽ tự sinh ra — vi phạm bảo toàn năng lượng.",
      },
    ],
  },
];
