/**
 * Đợt 1 — STEM và Liên môn: TN038–TN046.
 */
import type { ExperimentEntry } from "./types";

export const BATCH_STEM_LIEN_MON: ExperimentEntry[] = [
  {
    id: "TN038",
    code: "TN038",
    slug: "may-phat-dien-mini-stem",
    title: "Máy phát điện mini – Dự án STEM từ cuộn dây và nam châm",
    topic: "stem",
    chapter: "Dự án STEM – Ứng dụng cảm ứng điện từ",
    level: "11",
    kind: "stem",
    durationMinutes: 45,
    description:
      "Chế tạo máy phát điện mini từ cuộn dây, nam châm và bánh xe; đo điện áp sinh ra theo tốc độ quay để tối ưu thiết kế.",
    photoIds: ["ce19-cam-ung-faraday", "circular-motion"],
    intro:
      "Từ đèn đạp xe đến turbine gió: mọi máy phát điện đều lặp lại ý tưởng của Faraday. Dự án này đưa nguyên lý đó vào một sản phẩm nhỏ gọn do chính tay em chế tạo.",
    objectives: [
      "Chế tạo máy phát điện xoay chiều đơn giản",
      "Đo điện áp đầu ra theo tốc độ quay và số vòng dây",
      "Tối ưu thiết kế để phát sáng đèn LED",
    ],
    knowledge: [
      "ε = N·B·S·ω·sin(ωt) — điện áp xoay chiều từ cảm ứng",
      "Công suất phụ thuộc ε²/R tải",
      "Hiệu suất máy phát: tỉ số điện năng ra / công cơ học vào",
      "Thiết kế rotor/stator quyết định từ thông qua cuộn dây",
    ],
    apparatus: [
      "Cuộn dây đồng 200–600 vòng, nam châm vạch mạnh",
      "Bánh xe/giá quay, trục, dây curoa",
      "Đèn LED, vôn kế, dây nối",
      "Máy khoan tay hoặc mô tơ quay đều",
    ],
    procedure: [
      "Gắn nam châm vào bánh xe, đặt cuộn dây sát cạnh (khe hở 2–3 mm)",
      "Quay bánh bằng tay, đo điện áp xoay chiều đầu ra",
      "Đo với 200, 400, 600 vòng dây ở cùng tốc độ quay",
      "Đổi tốc độ quay chậm/nhanh, ghi điện áp",
      "Nối đèn LED, tìm tốc độ quay tối thiểu để đèn sáng",
    ],
    sim: { engineId: "em-induction", params: { v: 3, N: 400, B: 0.5 } },
    dataRows: {
      columns: ["Số vòng N", "Tốc độ quay", "U đo (V)", "U so với N=200", "LED"],
      rows: [
        [200, "Chậm", 1.2, "1,0×", "Chập chờn"],
        [400, "Chậm", 2.3, "1,9×", "Sáng yếu"],
        [600, "Chậm", 3.5, "2,9×", "Sáng"],
        [400, "Nhanh", 4.1, "3,4×", "Sáng rõ"],
        [600, "Nhanh", 6.0, "5,0×", "Rất sáng"],
      ],
    },
    explanation:
      "Điện áp đầu ra tỉ lệ gần tuyến tính với số vòng dây và tốc độ quay — đúng ε = N·ΔΦ/Δt. Máy phát cho điện áp xoay chiều (biến thiên theo góc quay); LED chỉ sáng ở nửa chu kỳ nên thêm một diode chỉnh lưu sẽ sáng ổn định. Hiệu suất máy mini đạt ~40–60% — phần còn lại mất vào ma sát và nhiệt cuộn dây.",
    conclusion:
      "Máy phát điện mini hoạt động đúng nguyên lý Faraday: ε = N·ΔΦ/Δt; tối ưu bằng cách tăng N, tăng tốc độ quay và giảm khe hở từ.",
    quiz: [
      {
        q: "Muốn đèn LED sáng mạnh hơn từ máy phát mini, nên:",
        options: [
          "Quay nhanh hơn và/hoặc thêm vòng dây",
          "Giảm số vòng dây",
          "Dùng nam châm yếu hơn",
          "Tăng khe hở",
        ],
        answerIndex: 0,
        explain: "ε tăng khi N tăng và khi ΔΦ/Δt tăng (quay nhanh hơn).",
      },
      {
        q: "Điện áp đầu ra máy phát mini là điện áp:",
        options: [
          "Xoay chiều — vì từ thông biến thiên tuần hoàn",
          "Một chiều ổn định",
          "Không đổi",
          "Tỉ lệ thuận nhiệt độ",
        ],
        answerIndex: 0,
        explain:
          "Mỗi nửa vòng quay, chiều từ thông thay đổi — ε đổi chiều, cần chỉnh lưu nếu tải dùng điện một chiều.",
      },
    ],
  },
  {
    id: "TN039",
    code: "TN039",
    slug: "tau-titanic-thiet-ke-than-rong",
    title: "Bài toán Titanic – Thiết kế thân tàu nổi và tải trọng",
    topic: "stem",
    chapter: "Dự án STEM – Áp dụng nguyên lý Ác-si-mét",
    level: "10",
    kind: "stem",
    durationMinutes: 45,
    description:
      "Thiết kế mô hình tàu nhôm có thân rỗng, thử tải tối đa trên nước và so sánh với mô hình đặc — bài toán kỹ thuật sau thảm hoạ Titanic.",
    photoIds: ["ce31-archimedes-luc-day-noi", "water-interference"],
    intro:
      "Titanic chìm không phải vì thép kém chất lượng, mà vì thiết kế khoang kín bị nước tràn qua. Bài toán 'làm sao cho khối kim loại nổi và chở được nhiều nhất' vẫn là bài tập vỡ lòng của kỹ thuật đóng tàu.",
    objectives: [
      "Thiết kế thân tàu rỗng tối đa hoá tải trọng",
      "Đo tải trọng tối đa trước khi chìm",
      "Kiểm nghiệm điều kiện nổi: F_day ≥ G_total",
    ],
    knowledge: [
      "F_day = d_nước·g·V_thay — thể tích thay nước quyết định tải",
      "Tải tối đa: m_max = d_nước·V_thân − m_thân",
      "Khoang kín bịt kín tăng an toàn (thể tích thay vẫn lớn khi một khoang vào nước)",
      "Ổn định tàu: tâm trọng lực thấp, đáy rộng",
    ],
    apparatus: [
      "Tấm nhôm mỏng (dựng thân tàu), keo, kéo",
      "Chậu nước lớn, quả cân nhỏ (đồng xu, bi sắt)",
      "Thước, cân",
    ],
    procedure: [
      "Dựng mô hình tàu thân đặc (khối nhôm đặc 100 g) — thả nước, kiểm tra nổi",
      "Dựng mô hình thân rỗng cùng khối lượng — đo thể tích thay nước",
      "Tải dần đồng xu lên thân rỗng đến khi chìm — đếm tải trọng tối đa",
      "Thay đổi thiết kế (đáy rộng hơn, vách cao hơn) — so sánh tải",
      "Thử 'va chạm': đục một lỗ khoang — quan sát chìm nhanh thế nào",
    ],
    sim: { engineId: "buoyancy", params: { V: 4, dVat: 270, dChat: 1000 } },
    dataRows: {
      columns: ["Thiết kế", "m_thân (g)", "V_thay (cm³)", "Tải tối đa (g)", "Đánh giá"],
      rows: [
        ["Khối đặc", 100, 37, 0, "Chìm ngay"],
        ["Thân rỗng cơ bản", 100, 420, 320, "Nổi, tải thấp"],
        ["Thân rộng, vách cao", 110, 620, 510, "Tốt"],
        ["Có khoang kín", 125, 640, 515, "An toàn khi thủng 1 khoang"],
      ],
    },
    explanation:
      "Khối nhôm đặc (d = 2700) chìm vì d > d_nước; cùng khối lượng nhưng thân rỗng thay thế tới 420 cm³ nước → F_day = 4,2 N đủ nâng thân + 320 g tải. Thiết kế khoang kín giữ được tải khi một khoang bị thủng — đúng bài học Titanic: 16 khoang kín nhưng thiếu nắp ngăn, nước tràn liên hoàn.",
    conclusion:
      "Tải trọng tàu phụ thuộc thể tích thay nước của thân rỗng; thiết kế khoang kín và hình dạng thân quyết định cả tải lẫn an toàn — cốt lõi của kỹ thuật đóng tàu.",
    quiz: [
      {
        q: "Hai mô hình tàu cùng khối lượng, mô hình nào chở được nhiều hơn?",
        options: [
          "Mô hình thân rỗng to, thay nhiều nước hơn",
          "Mô hình đặc",
          "Bằng nhau",
          "Mô hình màu sẫm",
        ],
        answerIndex: 0,
        explain: "Tải tối đa = d_nước·V_thay − m_thân; V_thay càng lớn, tải càng lớn.",
      },
      {
        q: "Bài học từ Titanic về thiết kế khoang kín:",
        options: [
          "Khoang phải có nắp ngăn kín nước — nếu không nước tràn liên hoàn",
          "Khoang càng nhiều càng tốt bất chấp thiết kế",
          "Thân đặc an toàn hơn",
          "Tàu không cần khoang",
        ],
        answerIndex: 0,
        explain:
          "Các khoang không có nắp ngăn trên đỉnh khiến nước tràn từ khoang này sang khoang khác — thiết kế hoàn thiện sau Titanic.",
      },
    ],
  },
  {
    id: "TN040",
    code: "TN040",
    slug: "den-led-dien-nang-hieu-suat",
    title: "Đèn LED và hiệu suất điện năng – So sánh bóng sợi đốt",
    topic: "stem",
    chapter: "Dự án STEM – Năng lượng và hiệu suất",
    level: "10",
    kind: "stem",
    durationMinutes: 40,
    description:
      "Đo công suất tiêu thụ và độ sáng của đèn LED so với bóng sợi đốt, tính hiệu suất quang và lợi ích tiết kiệm điện.",
    photoIds: ["dien-tu", "ce08-joule-nhiet-tuong-duong"],
    intro:
      "Bóng sợi đốt biến 95% điện năng thành nhiệt — chỉ 5% thành ánh sáng. LED đảo ngược con số đó. Thí nghiệm đo trực tiếp 'khoảng cách công nghệ' vài chục năm này.",
    objectives: [
      "Đo công suất tiêu thụ của LED và bóng sợi đốt cùng độ sáng",
      "Tính hiệu suất quang: quang thông / điện năng",
      "Ước tính lợi ích kinh tế và môi trường khi thay đèn",
    ],
    knowledge: [
      "Công suất: P = U·I",
      "Hiệu suất quang: η = Φ/P (lm/W) — LED: 80–150 lm/W; sợi đốt: 10–17 lm/W",
      "Nhiệt độ vỏ đèn phản ánh phần điện năng mất thành nhiệt",
      "Tuổi thọ LED ~25.000–50.000 giờ vs sợi đốt ~1.000 giờ",
    ],
    apparatus: [
      "Đèn LED 5 W, bóng sợi đốt 40 W cùng quang thông (~400 lm)",
      "Đồng hồ đo điện (hoặc U, I rời), cảm biến ánh sáng (điện thoại)",
      "Nhiệt kế hồng ngoại (hoặc cảm nhận tay), thước",
    ],
    procedure: [
      "Nối đèn LED vào nguồn, đo U, I — tính P_LED",
      "Lặp lại với bóng sợi đốt — tính P_sợi",
      "Đo độ sáng cảm biến điện thoại ở cùng khoảng cách",
      "Đo nhiệt độ vỏ hai đèn sau 5 phút chiếu",
      "Tính điện năng tiết kiệm cho 4 giờ chiếu/ngày trong 1 năm",
    ],
    sim: { engineId: "ohm-circuit", params: { U: 220, R: 1210 } },
    dataRows: {
      columns: ["Đèn", "P (W)", "Độ sáng (đơn vị tương đối)", "Nhiệt vỏ (°C)", "Tuổi thọ (giờ)"],
      rows: [
        ["LED 5 W", 5, 100, 42, 30000],
        ["Sợi đốt 40 W", 40, 95, 220, 1000],
        ["Sợi đốt 60 W", 60, 150, 240, 1000],
      ],
    },
    explanation:
      "LED tạo cùng độ sáng với 1/8 công suất và vỏ chỉ ấm 42 °C so với 220 °C của bóng sợi đốt — 90% điện năng của sợi đốt thành nhiệt vô ích. Thay 10 bóng 40 W bằng LED 5 W tiết kiệm ~500 kWh/năm (~1,2 triệu đồng) và giảm ~250 kg CO₂ — bài toán STEM có sức nặng kinh tế và môi trường thực sự.",
    conclusion:
      "LED có hiệu suất quang gấp 6–10 lần bóng sợi đốt; lựa chọn chiếu sáng LED là giải pháp tiết kiệm năng lượng đơn giản và hiệu quả nhất cho hộ gia đình.",
    quiz: [
      {
        q: "Vì sao bóng sợi đốt nóng hơn LED nhiều?",
        options: [
          "Phần lớn điện năng chuyển thành nhiệt, chỉ ~5% thành ánh sáng",
          "Vì LED làm lạnh",
          "Vì sợi đốt dài hơn",
          "Vì điện áp cao hơn",
        ],
        answerIndex: 0,
        explain: "Hiệu suất quang thấp: điện năng chủ yếu thành nhiệt bức xạ hồng ngoại.",
      },
      {
        q: "Thay bóng 40 W bằng LED 5 W cùng độ sáng, tiết kiệm điện:",
        options: ["~87,5%", "~50%", "~25%", "0%"],
        answerIndex: 0,
        explain: "(40 − 5)/40 = 87,5% điện năng cho cùng chức năng chiếu sáng.",
      },
    ],
  },
  {
    id: "TN041",
    code: "TN041",
    slug: "echo-am-thung-lung",
    title: "Tiếng vọng trong thung lũng – Tốc độ âm và đo khoảng cách",
    topic: "lien-mon",
    chapter: "Liên môn Vật lý – Địa lý: Âm học",
    level: "10",
    kind: "lien-mon",
    durationMinutes: 25,
    description:
      "Dùng tiếng vọng để đo tốc độ âm ngoài trời, tính khoảng cách vách núi và giải thích địa hình tạo vọng.",
    photoIds: ["ce35-huygens-ong-am-cong-huong", "ce13-song-am-cong-huong-kundt"],
    intro:
      "Hét về phía vách núi và nghe chính giọng mình trả lời — 'tiếng vọng' là thước đo khoảng cách tự nhiên mà thợ săn, thủy thủ đã dùng từ ngàn năm trước khi có ra-đa.",
    objectives: [
      "Đo thời gian vọng để tính khoảng cách phản xạ",
      "Xác định tốc độ âm qua số liệu vọng",
      "Giải thích địa hình nào tạo tiếng vọng rõ",
    ],
    knowledge: [
      "s = v·t/2 (t là thời gian đi-về của âm)",
      "v_âm trong không khí 20 °C ≈ 340 m/s; tăng ~0,6 m/s mỗi °C",
      "Vọng rõ khi bề mặt phản xạ cứng, rộng và đủ xa (>17 m)",
      "Eco (âm dội) khác tiếng vang (reverberation) trong phòng",
    ],
    apparatus: [
      "Đồng hồ bấm giờ (điện thoại), loa phát tiếng nổ/pin",
      "Máy đo khoảng cách (Google Maps đo đạc hoặc laser)",
      "Nhiệt kế",
    ],
    procedure: [
      "Đứng trước vách tường/thung lũng, phát tiếng nổ ngắn",
      "Đo thời gian t giữa tiếng phát và tiếng vọng nghe được",
      "Lặp lại 5 lần, tính t trung bình",
      "Đo khoảng cách thật đến vách (bản đồ) — so sánh s = vt/2",
      "Tính tốc độ âm thực nghiệm, so với 340 m/s ở nhiệt độ đo",
    ],
    sim: { engineId: "wave", params: { A: 0.7, lambda: 2.5, f: 1.5 } },
    dataRows: {
      columns: ["Lần", "t đo (s)", "s tính (m)", "s bản đồ (m)", "v tính (m/s)"],
      rows: [
        [1, 1.76, 300, 302, 343],
        [2, 1.75, 298, 302, 345],
        [3, 1.78, 303, 302, 339],
        [4, 1.76, 300, 302, 343],
        [5, 1.77, 301, 302, 341],
      ],
    },
    explanation:
      "Thời gian vọng 1,76 s cho quãng đường đi-về ~600 m, tức vách cách 300 m — khớp bản đồ với sai số <1%. Tốc độ âm tính được 342 m/s, khớp công thức v = 331 + 0,6·t(°C) ở 18 °C. Vách đá dốc và khuất gió tạo vọng rõ nhất; địa hình rừng rậm làm âm tán xạ, vọng yếu.",
    conclusion:
      "Tiếng vọng cho phép đo khoảng cách bằng s = vt/2 và xác định tốc độ âm; địa hình phản xạ cứng, rộng là điều kiện tạo tiếng vọng rõ.",
    quiz: [
      {
        q: "Nghe tiếng vọng sau 2 giây. Vật phản xạ cách bao xa? (v = 340 m/s)",
        options: ["340 m", "680 m", "170 m", "1360 m"],
        answerIndex: 0,
        explain: "s = 340·2/2 = 340 m — âm đi-về 680 m.",
      },
      {
        q: "Đêm lạnh (10 °C) so với trưa nóng (35 °C), tốc độ âm:",
        options: ["Chậm hơn vào đêm (~0,6 m/s mỗi độ)", "Nhanh hơn vào đêm", "Không đổi", "Bằng 0"],
        answerIndex: 0,
        explain: "v = 331 + 0,6·t — nhiệt độ thấp, âm chậm hơn.",
      },
    ],
  },
  {
    id: "TN042",
    code: "TN042",
    slug: "nhip-tim-dao-dong-sinh-hoc",
    title: "Nhịp tim và dao động sinh học – Vật lý của cơ thể người",
    topic: "lien-mon",
    chapter: "Liên môn Vật lý – Sinh học: Cơ thể người",
    level: "10",
    kind: "lien-mon",
    durationMinutes: 25,
    description:
      "Đo nhịp tim ở nhiều trạng thái, phân tích như một hệ dao động – tần số riêng, và liên hệ với công suất cơ thể trong hoạt động.",
    photoIds: ["co-hoc", "dien-tu"],
    intro:
      "Trái tim là một máy bơm dao động 100.000 lần mỗi ngày. Nhịp tim thay đổi theo hoạt động như một hệ thống điều khiển tự động — nơi vật lý, sinh học và y học gặp nhau.",
    objectives: [
      "Đo nhịp tim ở nghỉ ngơi và sau vận động",
      "Tính công suất tim và lưu lượng máu",
      "Liên hệ tần số tim với mức tiêu thụ năng lượng",
    ],
    knowledge: [
      "Nhịp tim nghỉ: 60–80 lần/phút; khi vận động: 120–180",
      "Lưu lượng tim = nhịp × thể tích tống máu (~70 ml/lần)",
      "Công suất tim: P = Δp·Q (Δp ~ 100 mmHg, Q lưu lượng)",
      "Mức tiêu thụ năng lượng tỉ lệ với nhịp tim (MET)",
    ],
    apparatus: [
      "Đồng hồ đếm nhịp (điện thoại/cảm biến)",
      "Đồng hồ bấm giờ, máy tính bỏ túi",
      "Thang bộ hoặc chỗ tập tại chỗ",
    ],
    procedure: [
      "Ngồi yên 5 phút, đếm nhịp tim 60 s — ghi HR_rest",
      "Leo cầu thang 3 tầng trong 2 phút — đếm nhịp ngay khi lên",
      "Nghỉ 5 phút — đếm nhịp phục hồi",
      "Tính lưu lượng tim ở hai trạng thái",
      "Vẽ đồ thị nhịp tim theo thời gian phục hồi",
    ],
    sim: { engineId: "spring", params: { m: 0.2, k: 18, A: 0.25 } },
    dataRows: {
      columns: ["Trạng thái", "Nhịp (lần/phút)", "Lưu lượng (L/phút)", "Công suất tim (W)", "MET"],
      rows: [
        ["Nghỉ", 72, 5.0, 1.2, 1.0],
        ["Ngay sau vận động", 150, 12.5, 2.5, 6.5],
        ["Phục hồi 2 phút", 95, 7.0, 1.6, 2.0],
        ["Phục hồi 5 phút", 78, 5.5, 1.3, 1.2],
      ],
    },
    explanation:
      "Tim hoạt động như một hệ dao động điều khiển: nhịp tăng nhanh khi nhu cầu oxy tăng, phục hồi theo hàm mũ với hằng số ~1–2 phút — chỉ số phục hồi phản ánh sức khoẻ tim mạch. Công suất tim ~1,2 W khi nghỉ nhưng tăng gấp đôi khi chạy — 'máy bơm' kỳ diệu hoạt động cả đời không ngừng.",
    conclusion:
      "Nhịp tim là thông số dao động sinh học quan trọng; lưu lượng và công suất tim tăng theo cường độ vận động, phục hồi nhanh ở người khoẻ mạnh.",
    quiz: [
      {
        q: "Tim bơm ~70 ml/lần, 72 lần/phút. Lưu lượng xấp xỉ:",
        options: ["5 L/phút", "0,5 L/phút", "50 L/phút", "72 L/phút"],
        answerIndex: 0,
        explain: "70 ml × 72 = 5040 ml ≈ 5 L/phút.",
      },
      {
        q: "Sau khi chạy, nhịp tim phục hồi nhanh cho thấy:",
        options: ["Sức khoẻ tim mạch tốt", "Tim yếu", "Huyết áp thấp", "Nhiệt độ cao"],
        answerIndex: 0,
        explain:
          "Thời gian phục hồi ngắn là chỉ số đánh giá thể lực tim mạch trong y học thể thao.",
      },
    ],
  },
  {
    id: "TN043",
    code: "TN043",
    slug: "ap-suat-khi-quyen-do-cao",
    title: "Áp suất khí quyển theo độ cao – Bài toán núi và bay",
    topic: "lien-mon",
    chapter: "Liên môn Vật lý – Địa lý: Khí quyển",
    level: "11",
    kind: "lien-mon",
    durationMinutes: 25,
    description:
      "Mô phỏng áp suất giảm theo độ cao, tính hiệu ứng lên cơ thể người và thiết bị khi leo núi hoặc bay.",
    photoIds: ["ce32-torricelli-ap-suat-khi-quyen", "nhiet-hoc"],
    intro:
      "Trên đỉnh Fansipan, không khí loãng khiến hơi nước trong ấm sôi ở ~87 °C — trứng không chín! Áp suất khí quyển giảm theo độ cao là 'nhân vật chính' của mọi câu chuyện leo núi và hàng không.",
    objectives: [
      "Tính áp suất khí quyển theo độ cao",
      "Giải thích hiện tượng sôi ở nhiệt độ thấp trên núi",
      "Liên hệ với say độ cao và áp suất khoang máy bay",
    ],
    knowledge: [
      "p(h) ≈ p₀·e^(−Mgh/RT) — giảm ~12% mỗi 1000 m gần mặt đất",
      "Nước sôi khi áp suất hơi bàng hoà = áp suất ngoài — trên núi, nhiệt độ sôi thấp",
      "Say độ cao: thiếu oxy khi p_O₂ giảm dưới ~0,15 atm",
      "Khoang máy bay được nén giữ ~0,75 atm (tương đương 2.400 m)",
    ],
    apparatus: [
      "Mô phỏng khí quyển (trình duyệt)",
      "Bảng tra áp suất theo độ cao",
      "Máy tính bỏ túi",
    ],
    procedure: [
      "Tính p ở 0, 1000, 3000, 5500 m bằng công thức mũ",
      "Tính nhiệt độ sôi nước tại mỗi độ cao",
      "Xác định độ cao bắt đầu có nguy cơ say độ cao",
      "So sánh áp suất khoang máy bay với áp suất thật ở độ cao bay",
      "Vẽ đồ thị p(h) và t_sôi(h)",
    ],
    sim: { engineId: "gas-law", params: { n: 1, T: 288, V: 22.4 } },
    dataRows: {
      columns: ["Độ cao (m)", "p (atm)", "p/p₀ (%)", "Nước sôi (°C)", "Ghi chú"],
      rows: [
        [0, 1.0, 100, 100, "Mực nước biển"],
        [1000, 0.89, 89, 97, "Huế – Đà Lạt"],
        [3000, 0.7, 70, 91, "Sa Pa"],
        [5500, 0.5, 50, 83, "Đỉnh Fansipan leo"],
        [8849, 0.33, 33, 70, "Everest"],
      ],
    },
    explanation:
      "Áp suất giảm gần hàm mũ với độ cao: ở Everest chỉ còn 1/3 áp suất mặt biển, nước sôi ở ~70 °C — không đủ nấu chín thức ăn. Say độ cao bắt đầu khi p_O₂ dưới ngưỡng; phi cơ giữ khoang ở 0,75 atm để cân bằng an toàn và sự thoải mái của hành khách.",
    conclusion:
      "Áp suất khí quyển giảm theo độ cao làm nhiệt độ sôi nước thấp đi và lượng oxy loãng dần — yếu tố quyết định kỹ thuật leo núi, nấu ăn trên cao và thiết kế khoang máy bay.",
    quiz: [
      {
        q: "Trên đỉnh núi cao, cơm lâu chín vì:",
        options: [
          "Nước sôi ở nhiệt độ thấp hơn — không đủ nhiệt nấu chín",
          "Gạo cứng hơn",
          "Không khí lạnh",
          "Áp suất cao hơn",
        ],
        answerIndex: 0,
        explain: "Nhiệt độ sôi giảm theo áp suất ngoài; cần nồi áp suất để tăng nhiệt độ sôi.",
      },
      {
        q: "Nồi áp suất nấu nhanh hơn vì:",
        options: [
          "Tăng áp suất trong nồi → nước sôi trên 100 °C",
          "Giảm áp suất",
          "Dùng điện mạnh hơn",
          "Nắp nồi dày giữ nhiệt",
        ],
        answerIndex: 0,
        explain: "Áp suất ~1,5 atm làm nước sôi ~110–120 °C, thức ăn chín nhanh hơn.",
      },
    ],
  },
  {
    id: "TN044",
    code: "TN044",
    slug: "nhay-du-can-bang-luc",
    title: "Nhảy dù – Cân bằng lực và vận tốc cực hạn",
    topic: "lien-mon",
    chapter: "Liên môn Vật lý – Thể thao: Sức cản không khí",
    level: "11",
    kind: "lien-mon",
    durationMinutes: 20,
    description:
      "Phân tích quá trình rơi của người nhảy dù: từ rơi tăng tốc, cân bằng trọng lực – sức cản, đến bật dù giảm tốc an toàn.",
    photoIds: ["co-hoc", "ce01-galilei-roi-tu-do"],
    intro:
      "120 km/h trong tư thế tự do — rồi bung dù, êm như lá rơi. Nhảy dù là bài toán động lực học hoàn chỉnh: trọng lực, sức cản không khí và lực nâng của dù cùng nhau vẽ nên chuyển động.",
    objectives: [
      "Phân tích lực tác dụng lên người nhảy dù theo từng giai đoạn",
      "Giải thích vận tốc cực hạn (terminal velocity)",
      "Tính năng lượng cần tiêu tán khi bung dù",
    ],
    knowledge: [
      "Sức cản không khí: F = k·v² (ở tốc độ cao)",
      "Vận tốc cực hạn: v_t = √(mg/k) khi F_cản = G",
      "Giai đoạn bật dù: giảm tốc ~3–5 g trong vài giây",
      "Năng lượng động năng tiêu tán: ½mv² — chuyển thành nhiệt và âm",
    ],
    apparatus: [
      "Mô phỏng rơi có sức cản (trình duyệt)",
      "Máy tính bỏ túi, bảng số liệu nhảy dù thực tế",
    ],
    procedure: [
      "Phân tích lực trong giai đoạn rơi tự do ban đầu (G > F_cản)",
      "Xác định vận tốc cực hạn từ số liệu: 55 m/s (tư thế tự do)",
      "Tính năng lượng động năng ở v_t với người 70 kg",
      "Phân tích giai đoạn bung dù: F_nâng > G làm giảm tốc",
      "Tính vận tốc chạm đất an toàn (~5 m/s) và năng lượng khi đó",
    ],
    sim: { engineId: "freefall", params: { h0: 15, g: 9.8 } },
    dataRows: {
      columns: ["Giai đoạn", "Lực chủ đạo", "a (m/s²)", "v (m/s)", "Ghi chú"],
      rows: [
        ["Bắt đầu rơi", "G > F_cản", "≈ −9,8", "0 → 55", "Tăng tốc"],
        ["Tự do ổn định", "G = F_cản", "0", "55", "Vận tốc cực hạn"],
        ["Bung dù", "F_nâng > G", "+30 (lên)", "55 → 5", "Giảm tốc mạnh"],
        ["Tiếp đất", "F_nâng ≈ G", "≈0", "5", "An toàn"],
      ],
    },
    explanation:
      "Sức cản tăng theo v² nên cuối cùng cân bằng trọng lực ở v_t ≈ 55 m/s — rơi 'yên vị' không tăng tốc nữa. Khi bung dù, diện tích phản lực tăng gấp ~10 lần, lực nâng vượt trọng lực, người nhảy dù giảm tốc trong 3–5 giây (trải nghiệm 3–5 g). Năng lượng ½·70·55² ≈ 106 kJ phải tiêu tán — phần lớn thành nhiệt không khí và sóng xung kích.",
    conclusion:
      "Chuyển động nhảy dù là minh hoạ đầy đủ của mô hình rơi có sức cản: cân bằng trọng lực – sức cản cho vận tốc cực hạn; dù là thiết bị thay đổi hệ số cản để kiểm soát tốc độ.",
    quiz: [
      {
        q: "Vận tốc cực hạn đạt khi:",
        options: [
          "Sức cản không khí bằng trọng lực — hợp lực bằng 0",
          "Gia tốc bằng 9,8",
          "Người nhảy chạm đất",
          "Dù được bung",
        ],
        answerIndex: 0,
        explain: "F_cản = G → a = 0 → vận tốc không đổi — đó là vận tốc cực hạn.",
      },
      {
        q: "Vì sao người nhảy dù 'nằm ngửa' khi rơi tự do?",
        options: [
          "Tăng diện tích cản → giảm vận tốc cực hạn",
          "Để dễ thở",
          "Để quan sát",
          "Thói quen",
        ],
        answerIndex: 0,
        explain: "Diện tích cản lớn làm v_t = √(mg/k) nhỏ hơn — rơi chậm và an toàn hơn.",
      },
    ],
  },
  {
    id: "TN045",
    code: "TN045",
    slug: "bong-da-quy-dao-phat-goc",
    title: "Bóng đá – Quỹ đạo phạt góc và kỹ thuật sút xoáy",
    topic: "lien-mon",
    chapter: "Liên môn Vật lý – Thể thao: Động học",
    level: "10",
    kind: "lien-mon",
    durationMinutes: 20,
    description:
      "Phân tích quỹ đạo đường chuyền dài và cú sút phạt trong bóng đá bằng mô hình ném xiên, kèm ảnh hưởng của độ xoáy.",
    photoIds: ["co-hoc", "circular-motion"],
    intro:
      "Đường chuyền dài 40 m bổ xuống vừa tầm đồng đội là một 'đường parabol' được tính toán trong tích tắc bởi cầu thủ. Bài này 'giải mã' đường bóng ấy bằng công thức vật lý.",
    objectives: [
      "Mô hình hoá đường chuyền dài bằng công thức ném xiên",
      "Tính góc và lực sút cho tình huống cụ thể",
      "Hiểu ảnh hưởng của độ xoáy đến quỹ đạo bóng",
    ],
    knowledge: [
      "R = v₀²sin(2θ)/g, t_bay = 2v₀sinθ/g, H = v₀²sin²θ/(2g)",
      "Lực Ma-gnút: F = k·(ω × v) — bóng xoáy bay cong",
      "Sức cản không khí làm tầm bay thực ngắn hơn lý thuyết 10–20%",
      "Bóng tiêu chuẩn FIFA: chu vi 68–70 cm, 410–450 g",
    ],
    apparatus: [
      "Video quỹ đạo bóng (điện thoại, 60 fps)",
      "Mô phỏng ném xiên (trình duyệt)",
      "Máy tính bỏ túi",
    ],
    procedure: [
      "Xác định từ video: tầm bay R = 38 m, thời gian bay t = 2,2 s",
      "Tính thành phần vận tốc: v₀ₓ = R/t, v₀ᵧ = g·t/2",
      "Tính v₀ và góc chuyền θ",
      "So sánh với mô phỏng, điều chỉnh để khớp video",
      "Phân tích cú sút xoáy: so sánh quỹ đạo thực với parabol lý thuyết",
    ],
    sim: { engineId: "projectile", params: { v0: 20, theta: 34, g: 9.8 } },
    dataRows: {
      columns: ["Tình huống", "R (m)", "t (s)", "v₀ (m/s)", "θ (°)", "H (m)"],
      rows: [
        ["Chuyền dài bổ xuống", 38, 2.2, 21.5, 29.7, 6.1],
        ["Tạt cánh", 28, 1.8, 18.3, 28.9, 4.4],
        ["Sút phạt hàng rào", 22, 1.5, 17.6, 33.2, 4.6],
        ["Đá phạt góc", 32, 2.4, 16.8, 44.8, 6.8],
      ],
    },
    explanation:
      "Chuyền dài 38 m với bóng bay 2,2 s cần v₀ ≈ 21,5 m/s ở góc ~30° — góc thấp hơn 45° để bóng không bay quá cao cho đồng đội kịp đón. Đá phạt góc gần 45° để tận dụng tầm bay tối đa. Bóng có độ xoáy bay cong theo lực Ma-gnút — 'quả chuối' kinh điển là minh chứng đẹp nhất của vật lý trong bóng đá.",
    conclusion:
      "Quỹ đạo bóng đá tuân mô hình ném xiên với điều chỉnh sức cản và độ xoáy; cầu thủ giỏi là người 'tính toán' v₀ và θ một cách bản năng.",
    quiz: [
      {
        q: "Chuyền dài bổ xuống cho tiền đạo, góc chuyền nên:",
        options: [
          "Khoảng 25–35° — đủ cao qua hậu vệ nhưng không quá cao",
          "Chính xác 45°",
          "80° — bóng bổ cao nhất",
          "5° — bóng đi sát đất",
        ],
        answerIndex: 0,
        explain: "Góc ~30° cho tầm bay xa mà bóng vẫn 'bổ' vừa đủ để vượt hàng thủ.",
      },
      {
        q: "Cú sút 'quả chuối' cong vì:",
        options: [
          "Lực Ma-gnút do bóng xoáy — chênh lệch áp suất hai bên bóng",
          "Gió thổi",
          "Cỏ sân cong",
          "Trọng lực đổi hướng",
        ],
        answerIndex: 0,
        explain:
          "Bóng xoáy kéo không khí cùng chiều một bên, tạo áp suất lệch — lực vuông góc với vận tốc làm quỹ đạo cong.",
      },
    ],
  },
  {
    id: "TN046",
    code: "TN046",
    slug: "pin-mat-troi-quang-dien",
    title: "Pin mặt trời – Từ photon đến dòng điện",
    topic: "lien-mon",
    chapter: "Liên môn Vật lý – Công nghệ: Năng lượng sạch",
    level: "11",
    kind: "lien-mon",
    durationMinutes: 30,
    description:
      "Đo điện áp và dòng điện của pin mặt trời theo cường độ chiếu sáng, tính hiệu suất và liên hệ với hiệu ứng quang điện.",
    photoIds: ["ce25-hieu-ung-quang-dien", "quang-hoc"],
    intro:
      "Mỗi giây, Mặt Trời đổ xuống Trái Đất nhiều năng lượng hơn cả nhu cầu năm của nhân loại. Pin mặt trời là 'cầu nối' biến photon thành dòng điện — ứng dụng lớn nhất của vật lý hiện đại trong đời sống.",
    objectives: [
      "Đo đặc tính U–I của pin mặt trời theo cường độ sáng",
      "Tính hiệu suất chuyển đổi quang – điện",
      "Liên hệ nguyên lý pin mặt trời với hiệu ứng quang điện",
    ],
    knowledge: [
      "Pin quang điện: photon tạo cặp electron-lỗ trống ở tiếp giáp p-n",
      "Điện áp hở mạch ~0,5–0,6 V/pin silicon; dòng tỉ lệ cường độ sáng",
      "Hiệu suất pin thương mại: 15–22%; kỷ lục phòng lab >47%",
      "Công suất: P = U·I; hiệu suất = P_điện/P_quang",
    ],
    apparatus: [
      "Pin mặt trời nhỏ (5 V, 1 W), đèn bàn có bóng LED/compact",
      "Vôn kế, ampe kế, biến trở tải",
      "Thước đo khoảng cách (đổi cường độ sáng)",
    ],
    procedure: [
      "Chiếu đèn cách pin 30 cm — đo U hở mạch và I ngắn mạch",
      "Nối biến trở, quét tải, ghi đặc tính U–I",
      "Đổi khoảng cách 20, 40, 60 cm — lặp lại phép đo",
      "Tính công suất cực đại P_max theo từng cường độ",
      "Ước tính hiệu suất từ cường độ chiếu thực tế",
    ],
    sim: { engineId: "ohm-circuit", params: { U: 4.8, R: 12 } },
    dataRows: {
      columns: [
        "Khoảng cách (cm)",
        "U hở mạch (V)",
        "I ngắn mạch (A)",
        "P_max (W)",
        "So với 30 cm",
      ],
      rows: [
        [20, 5.2, 0.24, 0.92, "160%"],
        [30, 5.0, 0.18, 0.68, "100%"],
        [40, 4.8, 0.13, 0.46, "68%"],
        [60, 4.6, 0.08, 0.27, "40%"],
      ],
    },
    explanation:
      "Điện áp hở mạch gần như không đổi (~5 V) nhưng dòng điện tỉ lệ cường độ chiếu sáng — đúng đặc tính pin quang điện: photon đủ năng lượng tạo cặp electron-lỗ trống, số cặp tỉ lệ số photon tới. Pin silicon cần photon năng lượng ≥ 1,1 eV (λ ≤ 1100 nm) — phần quang phổ nhìn thấy và hồng ngoại gần là 'nguồn nguyên liệu'.",
    conclusion:
      "Pin mặt trời chuyển trực tiếp quang năng thành điện năng; công suất đầu ra tỉ lệ cường độ chiếu sáng, hiệu suất phụ thuộc chất liệu và bước sóng — trụ cột của năng lượng tái tạo.",
    quiz: [
      {
        q: "Che nửa pin mặt trời khi đang nối mạch. Dòng điện:",
        options: [
          "Giảm gần một nửa — dòng tỉ lệ diện tích được chiếu sáng",
          "Không đổi",
          "Tăng gấp đôi",
          "Về 0 hoàn toàn",
        ],
        answerIndex: 0,
        explain:
          "Nửa pin còn lại vẫn tạo điện; dòng tổng giảm tỷ lệ với phần bị che (trong chuỗi có thể phức tạp hơn do điểm nóng).",
      },
      {
        q: "Vì sao pin silicon không phát điện từ ánh sáng hồng ngoại xa?",
        options: [
          "Photon năng lượng thấp hơn khoảng cấm 1,1 eV — không tạo được cặp electron-lỗ trống",
          "Vì hồng ngoại không có photon",
          "Vì pin lạnh",
          "Vì hồng ngoại bị kính hấp thụ hết",
        ],
        answerIndex: 0,
        explain: "Cần hf ≥ Eg = 1,1 eV; hồng ngoại xa (λ > 1100 nm) có photon yếu hơn ngưỡng này.",
      },
    ],
  },
];
