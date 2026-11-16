/**
 * Đợt 1 — Quang học, Dao động và Sóng: TN025–TN033.
 */
import type { ExperimentEntry } from "./types";

export const BATCH_QUANG_SONG: ExperimentEntry[] = [
  {
    id: "TN025",
    code: "TN025",
    slug: "anh-qua-thau-kinh-hoi-tu",
    title: "Ảnh qua thấu kính hội tụ – Công thức thấu kính",
    topic: "quang-hoc",
    chapter: "Chương 1 – Sự hội tụ của thấu kính",
    level: "11",
    kind: "thi-nghiem",
    durationMinutes: 25,
    description:
      "Đặt vật ở nhiều khoảng cách so với thấu kính hội tụ, đo vị trí ảnh để nghiệm công thức 1/v − 1/u = 1/f và xác định tiêu cự.",
    photoIds: ["ce24-newton-tan-sac-lang-kinh", "quang-hoc"],
    intro:
      "Máy ảnh, mắt người, kính hiển vi — tất cả đều là 'bài toán thấu kính': vật nằm đâu, ảnh hiện ở đâu, to hay nhỏ. Thí nghiệm này tự tay dựng quang cụ để trả lời từng câu hỏi đó.",
    objectives: [
      "Đo vị trí ảnh qua thấu kính hội tụ ở nhiều vị trí vật",
      "Nghiệm công thức thấu kính 1/v − 1/u = 1/f",
      "Xác định tiêu cự thấu kính từ đồ thị",
    ],
    knowledge: [
      "Công thức thấu kính: 1/f = 1/v − 1/u (quy ước dấu: u < 0, ảnh thật v > 0)",
      "Độ phóng đại: k = v/u",
      "Ảnh thật: v > 0, ngược chiều — hứng được trên màn ảnh",
      "Vật ngoài tiêu điểm (u > f) cho ảnh thật; vật trong tiêu điểm cho ảnh ảo",
    ],
    apparatus: [
      "Thấu kính hội tụ, bàn quang học (thước có vạch mm)",
      "Nguồn sáng có khe chữ F, màn hứng ảnh",
      "Nến (nguồn sáng thay thế), thước",
    ],
    procedure: [
      "Đặt thấu kính giữa nguồn sáng chữ F và màn hứng",
      "Di chuyển màn đến khi ảnh sắc nét nhất — ghi u và v",
      "Lặp lại với u = 15, 20, 25, 30, 40 cm",
      "Vẽ đồ thị 1/v theo 1/u — giao trục cho 1/f",
      "Tính f, so sánh với giá trị ghi trên thấu kính",
    ],
    sim: { engineId: "lens", params: { f: 12, a: 20 } },
    dataRows: {
      columns: ["u (cm)", "v đo (cm)", "1/u (1/cm)", "1/v (1/cm)", "f tính (cm)"],
      rows: [
        [15, 60, 0.067, 0.017, 12.0],
        [20, 30, 0.05, 0.033, 12.0],
        [25, 23.1, 0.04, 0.043, 12.0],
        [30, 20, 0.033, 0.05, 12.0],
        [40, 17.1, 0.025, 0.058, 12.1],
      ],
    },
    explanation:
      "Đồ thị 1/v – 1/u là đường thẳng với hệ số góc −1, cắt trục tại 1/f ≈ 0,083 cm⁻¹, cho f ≈ 12 cm khớp giá trị danh định. Khi u = 2f = 24 cm, v ≈ 24 cm — ảnh thật bằng vật, trường hợp đặc biệt dùng trong máy photocopy quang học.",
    conclusion:
      "Ảnh qua thấu kính hội tụ tuân công thức 1/f = 1/v − 1/u; vị trí và độ lớn ảnh hoàn toàn do khoảng cách vật và tiêu cự quyết định.",
    quiz: [
      {
        q: "Vật đặt ngoài tiêu điểm thấu kính hội tụ, ảnh thu được:",
        options: ["Ảnh thật, ngược chiều", "Ảnh ảo, cùng chiều", "Không có ảnh", "Ảnh mờ dần"],
        answerIndex: 0,
        explain: "u > f cho v > 0 — ảnh thật, ngược chiều, hứng được trên màn ảnh.",
      },
      {
        q: "Muốn dùng thấu kính hội tụ làm kính lúp, đặt vật:",
        options: [
          "Trong tiêu điểm (u < f) để có ảnh ảo, cùng chiều, phóng đại",
          "Xa hơn 2f",
          "Đúng 2f",
          "Đúng f",
        ],
        answerIndex: 0,
        explain:
          "Khi u < f, ảnh ảo cùng chiều và lớn hơn vật — mắt nhìn qua kính thấy vật phóng đại.",
      },
    ],
  },
  {
    id: "TN026",
    code: "TN026",
    slug: "anh-that-anh-ao-phan-biet",
    title: "Ảnh thật và ảnh ảo – Phân biệt qua màn hứng",
    topic: "quang-hoc",
    chapter: "Chương 1 – Sự hội tụ của thấu kính",
    level: "10",
    kind: "thi-nghiem",
    durationMinutes: 20,
    description:
      "So sánh ảnh thật (hứng được trên màn) và ảnh ảo (chỉ nhìn thấy qua kính) từ gương cầu lõm và thấu kính.",
    photoIds: ["quang-hoc", "ce28-malus-phan-cuc-anh-sang"],
    intro:
      "'Ảnh ảo trong gương' không phải là ảnh mờ ảo theo nghĩa đen — nó là ảnh hoàn toàn có thật về mặt quang học, chỉ thiếu một khả năng: hứng lên màn. Thí nghiệm này làm rõ ranh giới giữa hai loại ảnh.",
    objectives: [
      "Phân biệt ảnh thật và ảnh ảo bằng thực nghiệm",
      "Xác định điều kiện sinh ảnh thật/ảo qua gương cầu và thấu kính",
      "Vẽ tia sáng minh hoạ vị trí ảnh",
    ],
    knowledge: [
      "Ảnh thật: các tia hội tụ thật sự — hứng được trên màn, ngược chiều vật",
      "Ảnh ảo: các tia phân kỳ, mắt tưởng chúng từ một điểm — không hứng được, cùng chiều",
      "Gương cầu lõm: vật ngoài trọng tâm → ảnh thật; vật trong trọng tâm → ảnh ảo",
      "Thấu kính hội tụ: u > f → ảnh thật; u < f → ảnh ảo",
    ],
    apparatus: [
      "Gương cầu lõm, thấu kính hội tụ",
      "Nến, màn hứng, bàn quang học",
      "Giấy trắng, thước",
    ],
    procedure: [
      "Đặt nến xa gương cầu lõm hơn 2f, đưa màn hứng tìm ảnh sắc nét",
      "Đưa nến vào trong trọng tâm — kiểm tra màn còn hứng được ảnh không",
      "Nhìn qua gương ở vị trí này — ghi lại đặc điểm ảnh ảo",
      "Lặp lại phân biệt với thấu kính hội tụ",
      "Vẽ sơ đồ tia sáng cho cả hai trường hợp",
    ],
    sim: { engineId: "lens", params: { f: 10, a: 25 } },
    dataRows: {
      columns: ["Dụng cụ", "Vị trí vật", "Loại ảnh", "Chiều", "Hứng trên màn"],
      rows: [
        ["Gương cầu lõm", "Ngoài C (u > 2f)", "Thật", "Ngược", "Được"],
        ["Gương cầu lõm", "Trong F", "Ảo", "Cùng", "Không"],
        ["Thấu kính hội tụ", "u = 1,5f", "Thật", "Ngược", "Được"],
        ["Thấu kính hội tụ", "u = 0,5f", "Ảo", "Cùng", "Không"],
      ],
    },
    explanation:
      "Màn hứng chỉ bắt được ảnh khi các tia sáng hội tụ thật tại một điểm phía trước màn — đó là ảnh thật. Ảnh ảo hình thành bởi đường kéo dài của tia phân kỳ phía sau gương/kính: mắt người tự hội tụ chúng trên võng mạc nên ta vẫn 'thấy' ảnh, nhưng không có nơi nào để hứng nó.",
    conclusion:
      "Ảnh thật hứng được trên màn và ngược chiều; ảnh ảo chỉ nhìn được qua dụng cụ quang học và cùng chiều — ranh giới do vị trí vật so với tiêu điểm quyết định.",
    quiz: [
      {
        q: "Ảnh ảo trong gương phẳng có đặc điểm:",
        options: [
          "Cùng chiều, bằng vật, không hứng được trên màn",
          "Ngược chiều, nhỏ hơn",
          "Hứng được trên màn",
          "Không nhìn được",
        ],
        answerIndex: 0,
        explain: "Ảnh ảo gương phẳng: cùng chiều, bằng vật, nằm sau gương — không hứng được.",
      },
      {
        q: "Vì sao ảnh thật ngược chiều vật?",
        options: [
          "Do các tia sáng từ đỉnh vật hội tụ tại điểm dưới trục chính (và ngược lại)",
          "Do thấu kính lật ngược không gian",
          "Do mắt nhìn ngược",
          "Do màn hứng lật",
        ],
        answerIndex: 0,
        explain:
          "Tia từ đỉnh vật đi qua quang tâm giữ hướng, gặp trục ở phía bên kia — ảnh bị đảo ngược.",
      },
    ],
  },
  {
    id: "TN027",
    code: "TN027",
    slug: "kinh-lup-do-phong-dai",
    title: "Kính lúp – Độ phóng đại của thấu kính",
    topic: "quang-hoc",
    chapter: "Chương 1 – Sự hội tụ của thấu kính",
    level: "10",
    kind: "ung-dung",
    durationMinutes: 20,
    description:
      "Dùng kính lúp quan sát chữ viết ở nhiều khoảng cách, đo độ phóng đại và chọn vị trí làm việc tối ưu.",
    photoIds: ["quang-hoc", "ce24-newton-tan-sac-lang-kinh"],
    intro:
      "Kính lúp của thám tử, kính soi kim hoàn, kính hiển vi đơn giản — đều là thấu kính hội tụ dùng đúng 'điểm ngọt': vật nằm trong tiêu điểm. Thí nghiệm tìm điểm ngọt đó.",
    objectives: [
      "Xác định điều kiện dùng kính lúp (u < f)",
      "Đo độ phóng đại ở nhiều khoảng cách vật",
      "Tối ưu khoảng cách quan sát cho ảnh rõ nhất",
    ],
    knowledge: [
      "Kính lúp: ảnh ảo, cùng chiều, phóng đại khi u < f",
      "Độ phóng đại k = v/u; với u nhỏ hơn f nhiều, k lớn",
      "Khoảng nhìn rõ: 25 cm — chuẩn đo lúp",
      "Độ phóng đại góc của lúp: M = 25/f + 1 (f tính cm)",
    ],
    apparatus: [
      "Kính lúp f = 10 cm, thước mm",
      "Trang sách có chữ nhỏ, giấy kẻ ô mm",
      "Máy tính bỏ túi",
    ],
    procedure: [
      "Đặt kính lúp cách trang giấy 5 cm — quan sát chữ, ghi cảm nhận độ lớn",
      "Tăng khoảng cách 8 cm, rồi 9,5 cm (gần f) — ghi lại",
      "Đưa qua f (12 cm) — mô tả những gì thấy",
      "Đo chiều cao ảnh ảo qua kính so với ô mm nền",
      "Tính k đo và so sánh k = v/u lý thuyết",
    ],
    sim: { engineId: "lens", params: { f: 10, a: 8 } },
    dataRows: {
      columns: ["u (cm)", "So với f", "Loại ảnh", "k đo", "k tính", "Đánh giá"],
      rows: [
        [5, "0,5f", "Ảo, phóng đại", 2.0, 2.0, "Rõ, rộng"],
        [8, "0,8f", "Ảo, phóng đại", 5.0, 5.0, "Rất rõ"],
        [9.5, "0,95f", "Ảo, phóng đại rất lớn", 20, 20, "Rìa méo"],
        [12, "> f", "Thật (mắt tự hứng)", "—", "—", "Mờ, lộn ngược"],
      ],
    },
    explanation:
      "Ảnh ảo rõ nhất khi u vào khoảng 0,7–0,9 f: phóng đại 4–10 lần, còn đủ nét. Đưa vật qua tiêu điểm làm ảnh biến thành thật và ngược chiều — 'kính lúp' hết tác dụng. Độ phóng đại lý thuyết k = v/u khớp số đo: cùng một lúp, em có thể chọn mức phóng đại bằng cách chỉnh khoảng cách.",
    conclusion:
      "Kính lúp hoạt động khi vật nằm trong tiêu điểm, cho ảnh ảo phóng đại; khoảng cách vật gần tiêu điểm cho phóng đại lớn nhưng méo nhiều hơn.",
    quiz: [
      {
        q: "Khi nhìn qua kính lúp, em thấy vật lộn ngược. Nguyên nhân:",
        options: [
          "Em đã đưa vật ra ngoài tiêu điểm — ảnh thật, ngược chiều",
          "Kính lúp hỏng",
          "Mắt em nhìn ngược",
          "Ánh sáng yếu",
        ],
        answerIndex: 0,
        explain: "u > f → ảnh thật ngược chiều; mắt tự hứng ảnh này trên võng mạc.",
      },
      {
        q: "Cùng một kính lúp, muốn phóng đại chữ viết lớn hơn, nên:",
        options: [
          "Đưa kính lại gần chữ hơn (u nhỏ hơn, vẫn < f)",
          "Nhích kính ra xa chữ",
          "Đội kính lên đầu",
          "Xoay kính",
        ],
        answerIndex: 0,
        explain: "u càng nhỏ (trong f), ảnh ảo càng to; nhưng quá gần sẽ bị tối và méo.",
      },
    ],
  },
  {
    id: "TN028",
    code: "TN028",
    slug: "quan-he-v-lambda-f",
    title: "Quan hệ v = λf – Vận tốc, bước sóng, tần số",
    topic: "dao-dong-song",
    chapter: "Chương 1 – Sóng cơ",
    level: "10",
    kind: "thi-nghiem",
    durationMinutes: 20,
    description:
      "Trên mô phỏng sóng mặt nước, thay đổi bước sóng và tần số để kiểm nghiệm v = λf và thấy vận tốc truyền sóng do môi trường quyết định.",
    photoIds: ["ripple-diffraction", "standing-wave"],
    intro:
      "Từ tiếng chuông nhà thờ đến sóng radio: mọi loại sóng đều tuân một quy tắc cổ điển v = λf. Sóng mặt nước trong thí nghiệm là mô hình trực quan nhất để đo ba đại lượng này.",
    objectives: [
      "Đo bước sóng và tần số trên sóng mặt nước",
      "Kiểm nghiệm v = λf",
      "Thấy vận tốc truyền sóng là đặc trưng của môi trường",
    ],
    knowledge: [
      "v = λ·f = λ/T",
      "Bước sóng λ: khoảng cách hai đỉnh liên tiếp",
      "Tần số f: số dao động mỗi giây (Hz)",
      "Cùng một môi trường, v không đổi — đổi f thì λ đổi theo",
    ],
    apparatus: [
      "Mô phỏng sóng mặt nước (trình duyệt)",
      "Bồn sóng thật (nếu có) với motor rung tần số chỉnh được",
      "Thước, đồng hồ bấm giờ",
    ],
    procedure: [
      "Chạy mô phỏng với λ = 1 m, f = 1,5 Hz — đo vận tốc sóng quan sát được",
      "Giữ f, tăng λ lên 2 m — so sánh vận tốc",
      "Giữ λ, tăng f lên 3 Hz — so sánh vận tốc",
      "Tính v = λf cho từng tổ hợp, kiểm tra tính nhất quán",
      "So sánh với tốc độ sóng thực trên mặt nước (~0,23 m/s với λ nhỏ)",
    ],
    sim: { engineId: "wave", params: { A: 0.4, lambda: 1, f: 1.5 } },
    dataRows: {
      columns: ["λ (m)", "f (Hz)", "T (s)", "v = λf (m/s)", "Ghi chú"],
      rows: [
        [1.0, 1.5, 0.67, 1.5, "Chuẩn"],
        [2.0, 1.5, 0.67, 3.0, "λ gấp đôi"],
        [1.0, 3.0, 0.33, 3.0, "f gấp đôi"],
        [0.5, 3.0, 0.33, 1.5, "Về lại v ban đầu"],
      ],
    },
    explanation:
      "Trong cùng môi trường, mọi tổ hợp (λ, f) cho cùng một vận tốc — vận tốc là 'bản sắc' của môi trường, còn λ và f là hai mặt của một đồng xu: f gấp đôi thì λ giảm một nửa để v giữ nguyên. Đây là lý do âm trầm (f nhỏ) trong không khí có bước sóng dài hàng mét, còn âm cao chỉ vài cm.",
    conclusion:
      "Vận tốc sóng bằng tích bước sóng và tần số: v = λf; trong cùng môi trường v không đổi nên λ và f tỉ lệ nghịch lẫn nhau.",
    quiz: [
      {
        q: "Sóng âm tần số 340 Hz lan trong không khí (v = 340 m/s). Bước sóng:",
        options: ["1 m", "0,5 m", "2 m", "340 m"],
        answerIndex: 0,
        explain: "λ = v/f = 340/340 = 1 m.",
      },
      {
        q: "Khi sóng đi từ không khí vào nước, tần số f:",
        options: ["Không đổi — do nguồn quyết định", "Tăng lên", "Giảm xuống", "Bằng 0"],
        answerIndex: 0,
        explain:
          "Tần số là đặc trưng của nguồn dao động; khi đổi môi trường, v đổi nên λ đổi theo.",
      },
    ],
  },
  {
    id: "TN029",
    code: "TN029",
    slug: "song-dung-tren-day",
    title: "Sóng đứng trên dây – Nút, bụng và tần số riêng",
    topic: "dao-dong-song",
    chapter: "Chương 2 – Sóng cơ",
    level: "11",
    kind: "thi-nghiem",
    durationMinutes: 25,
    description:
      "Tạo sóng đứng trên dây đàn guitar, quan sát nút – bụng và đo tần số riêng theo chiều dài dây và lực căng.",
    photoIds: ["standing-wave", "ce10-song-dung-tren-day"],
    intro:
      "Âm thanh của đàn guitar, violin, đàn bầu đều sinh ra từ sóng đứng trên dây: những nút đứng yên và bụng rung mạnh tạo nên 'bản đồ' dao động mà mắt có thể thấy được.",
    objectives: [
      "Quan sát nút và bụng của sóng đứng trên dây",
      "Đo tần số riêng theo chiều dài dây và lực căng",
      "Giải thích cơ chế tạo âm của đàn dây",
    ],
    knowledge: [
      "Sóng đứng: hai sóng truyền ngược chiều giao thoa, nút/bụng cố định",
      "Dây hai đầu cố: fₙ = n·v/(2L), n = 1, 2, 3…",
      "v = √(F/μ) với F lực căng, μ khối lượng dây trên đơn vị dài",
      "Âm cơ bản n = 1; bội âm n = 2, 3 tạo âm sắc",
    ],
    apparatus: [
      "Dây đàn guitar/đàn tranh, ròng rọc, quả cân tạo lực căng",
      "Motor rung tần số chỉnh được (hoặc máy rung điện thoại)",
      "Máy quay chậm, thước",
    ],
    procedure: [
      "Căng dây dài 64 cm với F = 30 N, rung ở tần số thấp nhất tạo sóng đứng — ghi f₁",
      "Tăng tần số tìm dạng sóng 2 bụng, 3 bụng — ghi f₂, f₃",
      "Rút ngắn dây còn 32 cm — so sánh f₁ mới",
      "Tăng lực căng gấp 4 lần — so sánh f₁",
      "Kiểm tra tỉ số f₁:f₂:f₃ = 1:2:3",
    ],
    sim: { engineId: "wave", params: { A: 0.6, lambda: 2, f: 2 } },
    dataRows: {
      columns: ["L (cm)", "F (N)", "Dạng sóng", "f đo (Hz)", "f tính (Hz)"],
      rows: [
        [64, 30, "1 bụng", 48, 47],
        [64, 30, "2 bụng", 96, 94],
        [64, 30, "3 bụng", 144, 141],
        [32, 30, "1 bụng", 96, 94],
        [64, 120, "1 bụng", 96, 94],
      ],
    },
    explanation:
      "Tần số riêng tăng tỉ lệ nghịch chiều dài dây (rút nửa → f gấp đôi) và tỉ lệ thuận căn bậc hai lực căng (F gấp 4 → f gấp đôi) — đúng f = (n/2L)·√(F/μ). Khi gảy dây, nhiều bội âm cùng phát sinh; tỉ lệ cường độ chúng tạo 'âm sắc' riêng của từng cây đàn.",
    conclusion:
      "Sóng đứng trên dây hai đầu cố có tần số riêng fₙ = n·v/(2L) với v = √(F/μ); điều chỉnh L và F là cách lên dây đàn.",
    quiz: [
      {
        q: "Khi lên dây đàn guitar, siết dây căng hơn thì âm phát ra:",
        options: ["Cao hơn (f lớn hơn)", "Thấp hơn", "Không đổi", "Im lặng"],
        answerIndex: 0,
        explain: "F tăng → v = √(F/μ) tăng → f = v/(2L) tăng — âm cao lên.",
      },
      {
        q: "Điểm nút của sóng đứng là nơi:",
        options: [
          "Biên độ bằng 0 — luôn đứng yên",
          "Biên độ cực đại",
          "Sóng dừng truyền",
          "Nhiệt độ cao nhất",
        ],
        answerIndex: 0,
        explain: "Hai sóng ngược chiều triệt tiêu nhau hoàn toàn tại nút.",
      },
    ],
  },
  {
    id: "TN030",
    code: "TN030",
    slug: "hieu-ung-doppler-song",
    title: "Hiệu ứng Doppler – Vì sao còi xe đổi âm sắc?",
    topic: "dao-dong-song",
    chapter: "Chương 2 – Sóng cơ",
    level: "11",
    kind: "mo-phong",
    durationMinutes: 20,
    description:
      "Mô phỏng nguồn âm di chuyển tới và đi khỏi người nghe để đo tần số biểu kiến và nghiệm công thức Doppler.",
    photoIds: ["ce12-doppler-hieu-ung-song", "ripple-diffraction"],
    intro:
      "Tiếng còi xe cứu thương cao vút khi lao tới rồi trầm hẳn khi đi xa — đó là hiệu ứng Doppler, 'chiếc đồng hồ' giúp thiên văn xác định tốc độ thiên hà xa xôi.",
    objectives: [
      "Quan sát thay đổi tần số nghe được khi nguồn âm di chuyển",
      "Nghiệm công thức Doppler cho trường hợp nguồn động, người nghe yên",
      "Ứng dụng đo tốc độ qua sóng (radar, thiên văn)",
    ],
    knowledge: [
      "Nguồn tới: f' = f·v/(v − vₛ); nguồn đi: f' = f·v/(v + vₛ)",
      "v = 340 m/s (âm trong không khí 20 °C)",
      "Ánh sáng cũng có Doppler: quang phổ thiên hà dịch chuyển đỏ khi xa dần",
      "Radar cảnh sát: đo tần số phản xạ để tính tốc độ xe",
    ],
    apparatus: [
      "Mô phỏng Doppler (trình duyệt)",
      "App đo tần số trên điện thoại (đối chứng với còi xe thật ngoài đường)",
    ],
    procedure: [
      "Chạy mô phỏng: nguồn f = 400 Hz, vₛ = 0 — ghi f' nghe được",
      "Tăng vₛ = 30 m/s (nguồn tới) — ghi f'",
      "Đảo chiều nguồn (đi khỏi) — ghi f'",
      "So sánh với công thức Doppler",
      "Tăng vₛ = 60 m/s — đánh giá độ lớn hiệu ứng",
    ],
    sim: { engineId: "wave", params: { A: 0.5, lambda: 1.2, f: 2.5 } },
    dataRows: {
      columns: ["Tình huống", "vₛ (m/s)", "f nguồn (Hz)", "f' tính (Hz)", "Cảm nhận"],
      rows: [
        ["Yên", 0, 400, 400, "Không đổi"],
        ["Tới", 30, 400, 438, "Cao hơn"],
        ["Đi", 30, 400, 368, "Thấp hơn"],
        ["Tới nhanh", 60, 400, 480, "Cao rõ rệt"],
        ["Đi nhanh", 60, 400, 344, "Thấp rõ rệt"],
      ],
    },
    explanation:
      "Khi nguồn lao tới, các đỉnh sóng bị 'dồn' lại — bước sóng ngắn đi, tần số nghe được tăng; khi đi xa, đỉnh sóng trải ra — tần số giảm. Công thức Doppler tính được 438 Hz cho còi 400 Hz ở 30 m/s — chênh lệch ~38 Hz đủ nghe rõ như sự 'xuống giọng' của còi xe.",
    conclusion:
      "Tần số nghe được thay đổi khi nguồn và người nghe chuyển động tương đối: f' = f·v/(v ∓ vₛ) — cơ sở của radar đo tốc độ và đo tốc độ thiên thể.",
    quiz: [
      {
        q: "Xe cứu thương lao tới người đứng yên. Tiếng còi nghe được:",
        options: ["Cao hơn tần số thật", "Thấp hơn", "Không đổi", "Im đi"],
        answerIndex: 0,
        explain: "Nguồn tới làm bước sóng ngắn lại → f' > f.",
      },
      {
        q: "Thiên hà đang xa Trái Đất, quang phổ của nó:",
        options: [
          "Dịch chuyển đỏ (Doppler sóng ánh sáng)",
          "Dịch chuyển tím",
          "Không đổi",
          "Mất hẳn",
        ],
        answerIndex: 0,
        explain:
          "Nguồn xa dần → tần số giảm → bước sóng dài ra, dịch về phía đỏ — bằng chứng vũ trụ giãn nở.",
      },
    ],
  },
  {
    id: "TN031",
    code: "TN031",
    slug: "giao-thoa-song-mat-nuoc",
    title: "Giao thoa sóng mặt nước – Giao thoa tăng và triệt tiêu",
    topic: "dao-dong-song",
    chapter: "Chương 2 – Sóng cơ",
    level: "11",
    kind: "thi-nghiem",
    durationMinutes: 25,
    description:
      "Tạo hai nguồn sóng mặt nước đồng pha, quan sát các vân giao thoa tăng cường và triệt tiêu, đo khoảng cách vân.",
    photoIds: ["water-interference", "ce09-giao-thoa-khe-young"],
    intro:
      "Hai hòn đá thả xuống mặt hồ tạo nên bức tranh giao thoa: những đường sóng dựng đứng là nơi sóng cộng hưởng, và những vùng phẳng lặng là nơi chúng triệt tiêu nhau. Đây chính là 'chìa khoá' mở ra bản chất sóng của ánh sáng.",
    objectives: [
      "Quan sát vân giao thoa trên sóng mặt nước",
      "Xác định đường giao thoa tăng cường và triệt tiêu",
      "Liên hệ với thí nghiệm khe Young của ánh sáng",
    ],
    knowledge: [
      "Điều kiện tăng cường: hiệu đường truyền Δr = kλ",
      "Điều kiện triệt tiêu: Δr = (k + ½)λ",
      "Khoảng cách vân: d = λ·D/d (với khe Young)",
      "Giao thoa là bằng chứng sóng của ánh sáng",
    ],
    apparatus: [
      "Bồn sóng hai nguồn rung đồng pha",
      "Mô phỏng giao thoa sóng (trình duyệt)",
      "Thước đo khoảng cách vân",
    ],
    procedure: [
      "Chạy mô phỏng với hai nguồn đồng pha, λ cố định",
      "Xác định và đánh dấu các đường giao thoa tăng cường",
      "Đo khoảng cách giữa hai vân liên tiếp",
      "Đổi λ (tăng gấp đôi) — đo lại khoảng cách vân",
      "Lệch pha hai nguồn nửa chu kỳ — quan sát vân đổi chỗ",
    ],
    sim: { engineId: "wave", params: { A: 0.5, lambda: 1, f: 1.2 } },
    dataRows: {
      columns: ["λ (m)", "Dạng vân", "Khoảng vân đo (cm)", "Δr tại vân", "Ghi chú"],
      rows: [
        [1.0, "Tăng cường", 12.0, "0, λ, 2λ…", "Vân sáng"],
        [1.0, "Triệt tiêu", 12.0, "λ/2, 3λ/2…", "Vùng lặng"],
        [2.0, "Tăng cường", 24.0, "0, λ, 2λ…", "Vân thưa gấp đôi"],
      ],
    },
    explanation:
      "Tại các đường tăng cường, hai sóng tới cùng pha (Δr = kλ) nên biên độ cộng dồn gấp đôi; tại đường triệt tiêu, chúng ngược pha (Δr = (k+½)λ) triệt tiêu hoàn toàn. Khoảng vân tỉ lệ thuận bước sóng — λ gấp đôi làm vân thưa gấp đôi. Thí nghiệm khe Young tái hiện đúng hiện tượng này với ánh sáng.",
    conclusion:
      "Hai nguồn sóng đồng pha tạo mô hình giao thoa cố định với vân tăng cường tại Δr = kλ và vân triệt tiêu tại Δr = (k+½)λ — bằng chứng nền tảng về bản chất sóng.",
    quiz: [
      {
        q: "Tại điểm mà hiệu đường truyền từ hai nguồn bằng 1,5λ, hiện tượng xảy ra:",
        options: ["Triệt tiêu", "Tăng cường", "Không giao thoa", "Sóng đứng"],
        answerIndex: 0,
        explain: "1,5λ = (1 + ½)λ — đúng điều kiện triệt tiêu.",
      },
      {
        q: "Vân giao thoa thưa hơn khi:",
        options: ["Bước sóng dài hơn", "Bước sóng ngắn hơn", "Biên độ nhỏ hơn", "Tần số cao hơn"],
        answerIndex: 0,
        explain: "Khoảng vân tỉ lệ thuận λ.",
      },
    ],
  },
  {
    id: "TN032",
    code: "TN032",
    slug: "con-lac-va-truong-tinh-cao",
    title: "Con lắc và gia tốc trọng trường theo độ cao",
    topic: "dao-dong-song",
    chapter: "Chương 3 – Dao động",
    level: "11",
    kind: "mo-phong",
    durationMinutes: 15,
    description:
      "Mô phỏng con lắc ở nhiều độ cao so với mực nước biển để thấy chu kỳ tăng khi g giảm theo độ cao.",
    photoIds: ["ce11-foucault-con-lac-trai-dat", "co-hoc"],
    intro:
      "Nếu mang cùng một chiếc đồng hồ lắc lên đỉnh Fansipan, nó sẽ chạy chậm đi vài phần nghìn mỗi ngày. Mô phỏng này biến con lắc thành 'thước đo độ cao' qua chu kỳ.",
    objectives: [
      "Tính chu kỳ con lắc theo gia tốc trọng trường tại nhiều độ cao",
      "Thấy hệ quả của g giảm theo độ cao",
      "Giải thích vì sao đồng hồ lắc cần hiệu chỉnh khi đổi nơi",
    ],
    knowledge: [
      "g(h) ≈ g₀(1 − 2h/R) với R ≈ 6371 km (xấp xỉ gần mặt đất)",
      "T = 2π√(L/g) — g giảm nên T tăng",
      "Mỗi km lên cao, g giảm ~0,003 m/s²",
      "Đồng hồ lắc chính xác cần bù áp suất và nhiệt độ",
    ],
    apparatus: ["Mô phỏng con lắc (trình duyệt)", "Bảng tra g theo độ cao", "Máy tính bỏ túi"],
    procedure: [
      "Chạy mô phỏng với L = 1 m tại g = 9,806 (mực nước biển) — ghi T",
      "Đặt độ cao 1000 m (g ≈ 9,777) — ghi T",
      "Đặt độ cao 3000 m (g ≈ 9,720) — ghi T",
      "Tính sai số chu kỳ so với mực nước biển",
      "Ước tính đồng hồ lắc chạy chậm bao nhiêu phút/năm ở độ cao 1000 m",
    ],
    sim: { engineId: "pendulum", params: { L: 1, g: 9.777, theta0: 10 } },
    dataRows: {
      columns: ["Độ cao (m)", "g (m/s²)", "T (s)", "ΔT so với 0 m", "Sai số ngày (s)"],
      rows: [
        [0, 9.806, 2.0064, "0 s", 0],
        [1000, 9.777, 2.0093, "+0,0029 s", 251],
        [3000, 9.72, 2.0152, "+0,0088 s", 760],
      ],
    },
    explanation:
      "Chu kỳ con lắc tăng khi lên cao do g yếu đi: ở 1000 m, đồng hồ lắc chậm khoảng 251 s/năm (~4 phút) — đủ lớn để phải hiệu chỉnh trong đồng hồ đo đạc chính xác. Đây cũng là một trong những cách cổ điển đo độ cao núi bằng khí áp và con lắc.",
    conclusion:
      "Gia tốc trọng trường giảm theo độ cao làm chu kỳ con lắc dài thêm; con lắc có thể dùng ước lượng độ cao qua sai số chu kỳ.",
    quiz: [
      {
        q: "Mang đồng hồ lắc từ đồng bằng lên đỉnh núi, đồng hồ sẽ:",
        options: ["Chạy chậm lại", "Chạy nhanh lên", "Không đổi", "Dừng hẳn"],
        answerIndex: 0,
        explain: "g giảm → T tăng → mỗi dao động mất nhiều thời gian hơn.",
      },
      {
        q: "Gia tốc trọng trường thay đổi theo độ cao vì:",
        options: [
          "Khoảng cách tới tâm Trái Đất tăng, lực hấp dẫn yếu dần",
          "Không khí loãng hơn",
          "Trái Đất quay nhanh hơn",
          "Nhiệt độ giảm",
        ],
        answerIndex: 0,
        explain: "F = G·M·m/r² với r = R + h; h tăng → F và g giảm.",
      },
    ],
  },
  {
    id: "TN033",
    code: "TN033",
    slug: "chu-ky-con-lac-va-chieu-dai",
    title: "Chu kỳ con lắc và chiều dài dây – Bài tập định lượng",
    topic: "dao-dong-song",
    chapter: "Chương 3 – Dao động",
    level: "10",
    kind: "mo-phong",
    durationMinutes: 15,
    description:
      "Bài tập mô phỏng: tính chiều dài dây con lắc để có chu kỳ đúng 1 giây (con lắc giây) và khảo sát sai số.",
    photoIds: ["ce03-con-lac-don-chu-ky", "co-hoc"],
    intro:
      "'Con lắc giây' với chu kỳ đúng 2 giây từng là chuẩn đo thời gian của thế giới. Bài tập này giúp em tự tính chiều dài dây của nó và hiểu vì sao đồng hồ lắc cổ điển có cần trục quay tinh xảo.",
    objectives: [
      "Tính chiều dài dây từ chu kỳ yêu cầu",
      "Khảo sát độ nhạy của chu kỳ theo chiều dài",
      "Thiết kế con lắc giây tiêu chuẩn",
    ],
    knowledge: [
      "Từ T = 2π√(L/g): L = g·T²/(4π²)",
      "Con lắc giây: T = 2 s → L ≈ 0,994 m (g = 9,81)",
      "ΔL/L ≈ 2·ΔT/T — sai số chu kỳ khuếch đại gấp đôi vào chiều dài",
      "Nhiệt độ thay đổi 10 °C làm L thép đổi ~0,012% → sai ~7 s/ngày",
    ],
    apparatus: ["Mô phỏng con lắc (trình duyệt)", "Máy tính bỏ túi"],
    procedure: [
      "Tính L cần cho T = 2 s với g = 9,81 m/s²",
      "Kiểm tra trong mô phỏng: đặt L tính được, đo T thực tế",
      "Thay đổi L ± 2% — đo T, đánh giá độ nhạy",
      "Lặp lại với T = 1 s (nửa con lắc giây)",
      "Vẽ đồ thị T² theo L cho dải ±10%",
    ],
    sim: { engineId: "pendulum", params: { L: 0.994, g: 9.81, theta0: 6 } },
    dataRows: {
      columns: ["T mục tiêu (s)", "L tính (m)", "T mô phỏng (s)", "L sai +2% → T", "Ghi chú"],
      rows: [
        [2.0, 0.994, 2.0, 2.02, "Con lắc giây"],
        [1.0, 0.248, 1.0, 1.01, "Nửa con lắc giây"],
        [1.5, 0.559, 1.5, 1.515, ""],
      ],
    },
    explanation:
      "L = gT²/(4π²) cho L ≈ 0,994 m với T = 2 s — khớp chiều dài con lắc giây lịch sử. Sai lệch 2% chiều dài làm chu kỳ sai 1%: đây là lý do đồng hồ lắc chính xác dùng ống thuỷ tinh giãn nở thấp và máng thủy ngân bù nhiệt.",
    conclusion:
      "Chiều dài con lắc giây xấp xỉ 0,994 m; chu kỳ nhạy với chiều dài (ΔT/T ≈ ½ΔL/L) nên chế tạo đồng hồ lắc đòi hỏi gia công chính xác và bù nhiệt.",
    quiz: [
      {
        q: "Con lắc có T = 2 s trên Trái Đất. Chiều dài dây xấp xỉ:",
        options: ["0,99 m", "2 m", "3,9 m", "0,5 m"],
        answerIndex: 0,
        explain: "L = 9,81·4/(4π²) ≈ 0,994 m.",
      },
      {
        q: "Chiều dài dây tăng 4% (g không đổi). Chu kỳ:",
        options: ["Tăng 2%", "Tăng 4%", "Tăng 8%", "Không đổi"],
        answerIndex: 0,
        explain: "T ∝ √L → ΔT/T ≈ ½·ΔL/L = 2%.",
      },
    ],
  },
];
