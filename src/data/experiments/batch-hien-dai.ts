/**
 * Đợt 1 — Vật lý hiện đại, Vật lý hạt nhân: TN034–TN037.
 */
import type { ExperimentEntry } from "./types";

export const BATCH_HIEN_DAI: ExperimentEntry[] = [
  {
    id: "TN034",
    code: "TN034",
    slug: "hieu-ung-quang-dien",
    title: "Hiệu ứng quang điện – Ngưỡng tần số và động năng electron",
    topic: "vat-ly-hien-dai",
    chapter: "Chương 1 – Lượng tử ánh sáng",
    level: "12",
    kind: "thi-nghiem",
    durationMinutes: 30,
    description:
      "Chiếu ánh sáng nhiều bước sóng lên bản cực, quan sát dòng quang điện và khám phá ngưỡng tần số — thí nghiệm mở ra kỷ nguyên lượng tử.",
    photoIds: ["ce25-hieu-ung-quang-dien", "quang-hoc"],
    intro:
      "Năm 1905, Anh-xtanh giải thích hiện tượng mà lý thuyết sóng cổ điển bó tay: ánh sáng đỏ dù mạnh đến đâu cũng không đẩy được electron ra khỏi kim loại, còn ánh sáng tím yếu cũng đủ sức. Câu trả lời: ánh sáng là các 'gói' năng lượng — photon.",
    objectives: [
      "Quan sát dòng quang điện phụ thuộc tần số ánh sáng",
      "Xác định ngưỡng tần số và công thoát W của kim loại",
      "Kiểm nghiệm phương trình Anh-xtanh E_k = h·f − W",
    ],
    knowledge: [
      "Phương trình quang điện: E_k = h·f − W = h·c/λ − W",
      "Công thoát W: năng lượng tối thiểu để electron thoát khỏi kim loại",
      "Chỉ tần số f > f₀ = W/h mới có quang điện",
      "Độ lớn dòng quang điện phụ thuộc CƯỜNG ĐỘ sáng, còn E_k chỉ phụ thuộc tần số",
    ],
    apparatus: [
      "Buồng quang điện có bản cực và nguồn điện hãm",
      "Bộ lọc quang nhiều màu (λ khác nhau), nguồn sáng có cường độ chỉnh được",
      "Ampe kế nano, vôn kế hãm",
    ],
    procedure: [
      "Chiếu ánh sáng đỏ (λ = 650 nm) lên bản cực — ghi nhận dòng quang điện",
      "Đổi sang xanh lục (530 nm), lam (450 nm), tím (400 nm) — ghi dòng điện",
      "Tăng cường độ ánh sáng đỏ — kiểm tra dòng có tăng nhưng E_k thì không",
      "Tăng điện hãm đến khi dòng về 0 — xác định điện hãm dừng U₀",
      "Tính W từ U₀ và λ; vẽ đồ thị E_k theo 1/λ",
    ],
    sim: { engineId: "photoelectric", params: { lambda: 400, W: 2 } },
    dataRows: {
      columns: ["λ (nm)", "f (×10¹⁴ Hz)", "Có electron?", "U₀ (V)", "E_k = eU₀ (eV)"],
      rows: [
        [650, 4.61, "Không", 0, 0],
        [530, 5.66, "Có", 0.33, 0.33],
        [450, 6.66, "Có", 0.73, 0.73],
        [400, 7.5, "Có", 1.08, 1.08],
      ],
    },
    explanation:
      "Dưới ngưỡng ~590 nm (f₀ ≈ 5,08·10¹⁴ Hz) mới có electron bay ra — bất kể cường độ sáng mạnh thế nào. Đồ thị E_k theo f là đường thẳng hệ số góc h = 4,14·10⁻¹⁵ eV·s, cắt trục tại W = 2,0 eV (kali). Đáng kinh ngạc: hệ số góc này là HẰNG SỐ CỦA TỰ NHIÊN — Planck đã đúng: năng lượng lượng tử hoá.",
    conclusion:
      "Quang điện chỉ xảy ra khi tần số ánh sáng vượt ngưỡng; động năng electron tuân E_k = hf − W — bằng chứng ánh sáng là các photon năng lượng hf.",
    quiz: [
      {
        q: "Tăng cường độ ánh sáng đỏ (dưới ngưỡng) lên gấp 10 lần. Kết quả:",
        options: [
          "Vẫn không có quang điện — chỉ đổi tần số mới đổi được",
          "Có electron ngay",
          "Electron bay ra mạnh gấp 10",
          "Bản cực nóng lên và phát electron",
        ],
        answerIndex: 0,
        explain:
          "Mỗi photon đỏ có năng lượng hf < W; tăng cường độ chỉ tăng SỐ photon, không tăng năng lượng từng photon.",
      },
      {
        q: "Ánh sáng lam (λ = 450 nm) cho electron động năng lớn hơn ánh sáng xanh lục vì:",
        options: [
          "Photon lam có năng lượng lớn hơn (λ ngắn hơn)",
          "Ánh sáng lam mạnh hơn",
          "Electron thích màu lam",
          "Xanh lục bị hấp thụ hết",
        ],
        answerIndex: 0,
        explain: "E = hc/λ; λ ngắn hơn → năng lượng photon lớn hơn → E_k = hf − W lớn hơn.",
      },
    ],
  },
  {
    id: "TN035",
    code: "TN035",
    slug: "hang-so-planck-tu-quang-dien",
    title: "Xác định hằng số Planck từ hiệu ứng quang điện",
    topic: "vat-ly-hien-dai",
    chapter: "Chương 1 – Lượng tử ánh sáng",
    level: "12",
    kind: "mo-phong",
    durationMinutes: 25,
    description:
      "Xử lý số liệu điện hãm dừng ở nhiều bước sóng để dựng đồ thị E_k – f và tính hằng số Planck từ độ dốc.",
    photoIds: ["ce25-hieu-ung-quang-dien", "ce27-quang-pho-vach-hydro-bohr"],
    intro:
      "Bằng vài phép đo điện thế, em có thể xác định một trong những hằng số nền tảng nhất của vật lý hiện đại: hằng số Planck — 'đơn vị nhỏ nhất' của tự nhiên.",
    objectives: [
      "Dựng đồ thị E_k theo tần số từ số liệu quang điện",
      "Tính hằng số Planck từ độ dốc đồ thị",
      "So sánh với giá trị chuẩn 6,626·10⁻³⁴ J·s",
    ],
    knowledge: [
      "E_k = h·f − W → đồ thị E_k – f có độ dốc h",
      "h = 6,626·10⁻³⁴ J·s = 4,136·10⁻¹⁵ eV·s",
      "Điện hãm dừng: E_k = e·U₀",
      "Sai số đo đến từ xác định U₀ và hiệu chuẩn λ",
    ],
    apparatus: ["Số liệu từ TN034 (hoặc mô phỏng tạo số liệu)", "Máy tính dựng đồ thị hồi quy"],
    procedure: [
      "Tổng hợp số liệu (λ, U₀) từ 4–6 phép đo",
      "Quy đổi: f = c/λ, E_k = e·U₀ (eV)",
      "Vẽ đồ thị E_k (eV) theo f (10¹⁴ Hz) — khớp đường thẳng",
      "Tính độ dốc m, quy đổi h = m·e (với m tính eV/(10¹⁴ Hz))",
      "So sánh với h chuẩn, tính sai số %",
    ],
    sim: { engineId: "photoelectric", params: { lambda: 350, W: 2.3 } },
    dataRows: {
      columns: ["λ (nm)", "f (10¹⁴ Hz)", "U₀ (V)", "E_k (eV)", "eU₀ (J)"],
      rows: [
        [400, 7.5, 0.78, 0.78, 1.25e-19],
        [450, 6.66, 0.43, 0.43, 0.69e-19],
        [500, 6.0, 0.17, 0.17, 0.27e-19],
        [550, 5.45, 0.02, 0.02, 0.03e-19],
      ],
    },
    explanation:
      "Hồi quy tuyến tính cho độ dốc m ≈ 0,0414 eV/(10¹⁴ Hz); quy đổi h = m·e ≈ 6,63·10⁻³⁴ J·s — khớp giá trị chuẩn với sai số ~1%. Trục hoành cắt tại f₀ ≈ 5,5·10¹⁴ Hz cho công thoát W ≈ 2,27 eV. Chỉ với vôn kế và bộ lọc màu, em đã 'cân' được một hằng số của vũ trụ.",
    conclusion:
      "Độ dốc đồ thị E_k – f cho trực tiếp hằng số Planck; kết quả thực nghiệm khớp giá trị chuẩn chứng minh tính lượng tử của ánh sáng.",
    quiz: [
      {
        q: "Đơn vị của hằng số Planck trong hệ SI:",
        options: ["J·s", "J/s", "W", "kg·m/s"],
        answerIndex: 0,
        explain: "E = h·f → [h] = [E]/[f] = J/Hz = J·s.",
      },
      {
        q: "Nếu dựng đồ thị E_k – f mà lấy sai bước sóng, kết quả h sẽ:",
        options: [
          "Sai theo sai số λ — cần hiệu chuẩn quang phổ kế",
          "Vẫn chính xác",
          "Luôn lớn hơn chuẩn",
          "Bằng 0",
        ],
        answerIndex: 0,
        explain: "f = c/λ nên sai λ gây sai f, kéo theo sai độ dốc và h.",
      },
    ],
  },
  {
    id: "TN036",
    code: "TN036",
    slug: "chu-ky-ban-ra-phong-xa",
    title: "Chu kỳ bán rã – Quy luật rã hạt nhân",
    topic: "vat-ly-hat-nhan",
    chapter: "Chương 1 – Hạt nhân nguyên tử",
    level: "12",
    kind: "thi-nghiem",
    durationMinutes: 25,
    description:
      "Mô phỏng rã hạt phóng xạ với hàng nghìn hạt, đếm số hạt còn lại theo thời gian để nghiệm N(t) = N₀·2^(−t/T) và xác định chu kỳ bán rã.",
    photoIds: ["ce30-chu-ky-phong-xa-ban-ra", "ce26-rutherford-tan-xa-hat-alpha"],
    intro:
      "Phóng xạ là 'đồng hồ' của tự nhiên: mỗi hạt nhân rã theo xác suất cố định, không thể biết trước hạt nào rã — nhưng quy luật thống kê của cả tập hợp lại chính xác đến kinh ngạc. Thí nghiệm này theo dõi quy luật đó.",
    objectives: [
      "Đếm số hạt còn lại theo thời gian trong mô phỏng rã",
      "Nghiệm quy luật hàm mũ N = N₀·2^(−t/T)",
      "Xác định chu kỳ bán rã từ đồ thị",
    ],
    knowledge: [
      "N(t) = N₀·2^(−t/T) — T là chu kỳ bán rã",
      "Sau mỗi chu kỳ T, số hạt giảm một nửa",
      "Hằng số rã λ = ln2/T; xác suất rã trong Δt: λ·Δt (Δt nhỏ)",
      "Ứng dụng: định tuổi carbon-14, y học hạt nhân, lò phản ứng",
    ],
    apparatus: ["Mô phỏng rã hạt phóng xạ (trình duyệt)", "Bảng tính, máy tính dựng đồ thị"],
    procedure: [
      "Chạy mô phỏng với N₀ = 1000 hạt, T = 5 s — ghi số hạt mỗi 2,5 s",
      "Lặp lại lần mô phỏng thứ hai — so sánh dao động thống kê",
      "Vẽ đồ thị N(t), quy đổi log₂(N₀/N) theo t",
      "Tính T từ đồ thị, so sánh giá trị cài đặt",
      "Thay T = 10 s — kiểm tra quy luật mới",
    ],
    sim: { engineId: "radioactive", params: { N0: 1000, T: 5 } },
    dataRows: {
      columns: ["t (s)", "N lần 1", "N lần 2", "N lý thuyết", "N₀/N"],
      rows: [
        [0, 1000, 1000, 1000, 1],
        [5, 503, 489, 500, 2],
        [10, 251, 262, 250, 4],
        [15, 128, 119, 125, 8],
        [20, 61, 68, 62.5, 16],
      ],
    },
    explanation:
      "Số hạt giảm một nửa sau mỗi chu kỳ 5 s; hai lần mô phỏng dao động nhẹ quanh đường lý thuyết — bản chất thống kê của rã phóng xạ. Đồ thị log₂(N₀/N) – t là đường thẳng hệ số góc 1/T xác nhận quy luật hàm mũ. Với mẫu thật (carbon-14, T = 5730 năm), quy luật này là 'đồng hồ' định tuổi hóa thạch và di tích khảo cổ.",
    conclusion:
      "Số hạt phóng xạ giảm theo hàm mũ N = N₀·2^(−t/T); mỗi hạt rã ngẫu nhiên nhưng tập hợp tuân quy luật xác suất tuyệt đối chính xác.",
    quiz: [
      {
        q: "Mẫu có 12 gam đồng vị phóng xạ, chu kỳ bán rã 10 năm. Sau 30 năm còn:",
        options: ["1,5 gam", "3 gam", "4 gam", "6 gam"],
        answerIndex: 0,
        explain: "3 chu kỳ: 12 → 6 → 3 → 1,5 gam.",
      },
      {
        q: "Không thể biết trước hạt nhân nào sẽ rã tiếp theo vì:",
        options: [
          "Rã phóng xạ là quá trình ngẫu nhiên — chỉ quy luật thống kê là chắc chắn",
          "Máy đo chưa đủ tốt",
          "Hạt nhân quá nhỏ",
          "Nhiệt độ chưa đủ",
        ],
        answerIndex: 0,
        explain:
          "Đây là bản chất lượng tử: xác suất rã là hằng số vật lý, nhưng sự kiện đơn lẻ không đoán trước được.",
      },
    ],
  },
  {
    id: "TN037",
    code: "TN037",
    slug: "phong-xa-alpha-beta-gamma",
    title: "Phóng xạ α, β, γ – Khả năng xuyên thấu qua vật liệu",
    topic: "vat-ly-hat-nhan",
    chapter: "Chương 1 – Hạt nhân nguyên tử",
    level: "12",
    kind: "mo-phong",
    durationMinutes: 20,
    description:
      "Mô phỏng tia α, β, γ qua từ trường và các vật cản (giấy, nhôm, chì) để so sánh bản chất và khả năng xuyên thấu.",
    photoIds: ["ce26-rutherford-tan-xa-hat-alpha", "ce21-thomson-e-tren-m"],
    intro:
      "Ba 'chữ cái Hy Lạp' của phóng xạ mang ba bản chất khác nhau: α là hạt nhân hi-li, β là electron, γ là photon năng lượng siêu cao. 'Bộ ba' này từng là bí ẩn lớn nhất của vật lý đầu thế kỷ 20.",
    objectives: [
      "Phân biệt bản chất tia α, β, γ",
      "So sánh khả năng xuyên thấu qua giấy, nhôm, chì",
      "Quan sát độ lệch trong từ trường để xác định điện tích",
    ],
    knowledge: [
      "α: hạt nhân He-2⁺, nặng, lệch nhẹ trong từ trường, chặn bởi giấy",
      "β: electron năng lượng cao, lệch mạnh ngược chiều α, xuyên giấy, chặn bởi nhôm vài mm",
      "γ: photon, không lệch từ trường, xuyên nhôm, chặn bởi chì vài cm",
      "Ion hoá: α mạnh nhất, γ yếu nhất — nhưng γ nguy hiểm nhất do xuyên sâu",
    ],
    apparatus: ["Mô phỏng buồng tia phóng xạ (trình duyệt)", "Bảng tra tính chất α β γ"],
    procedure: [
      "Chạy mô phỏng với nguồn phát cả ba tia trong từ trường — ghi hướng lệch",
      "Đặt tấm giấy trước nguồn — ghi tia nào bị chặn",
      "Đổi tấm nhôm 3 mm — ghi lại",
      "Đổi tấm chì 2 cm — kiểm tra tia γ bị chặn",
      "Lập bảng tổng hợp tính chất ba tia",
    ],
    sim: { engineId: "radioactive", params: { N0: 800, T: 8 } },
    dataRows: {
      columns: ["Tia", "Bản chất", "Lệch từ trường", "Qua giấy", "Qua nhôm 3 mm", "Qua chì 2 cm"],
      rows: [
        ["α", "Hạt nhân He²⁺", "Nhẹ", "Bị chặn", "Bị chặn", "Bị chặn"],
        ["β", "Electron", "Mạnh, ngược α", "Xuyên", "Bị chặn", "Bị chặn"],
        ["γ", "Photon", "Không lệch", "Xuyên", "Xuyên", "Bị chặn"],
      ],
    },
    explanation:
      "Tia α mang điện tích +2e nhưng khối lượng gấp 7300 electron nên lệch ít; tia β nhẹ hơn nên uốn cong mạnh (ngược chiều do điện tích âm); tia γ trung tính nên đi thẳng. Về xuyên thấu: α bị một tờ giấy giữ lại vì ion hoá mạnh, mất năng lượng nhanh; γ phải qua vài cm chì mới bị chặn đáng kể — lý do áo chì trong phòng X-quang.",
    conclusion:
      "Ba loại phóng xạ khác hẳn về bản chất và khả năng xuyên thấu: α bị giấy chặn, β bị nhôm chặn, γ cần chì dày — cơ sở của bảo vệ bức xạ hạt nhân.",
    quiz: [
      {
        q: "Trong phòng X-quang, bác sĩ mặc áo chì để chặn tia nào?",
        options: ["Tia γ (và X)", "Tia α", "Tia β", "Cả ba bằng nhau"],
        answerIndex: 0,
        explain:
          "Tia X/γ xuyên sâu qua cơ thể; chì dày hấp thụ chúng, bảo vệ người làm việc lâu dài.",
      },
      {
        q: "Tia α bị lệch nhẹ trong từ trường so với tia β vì:",
        options: [
          "Tia α nặng hơn rất nhiều dù cùng mang điện tích",
          "Tia α không mang điện",
          "Tia β nhanh hơn ánh sáng",
          "Tia α bị không khí cản",
        ],
        answerIndex: 0,
        explain:
          "Lực Lorentz bằng nhau về cấp độ nhưng khối lượng α lớn gấp nghìn lần nên gia tốc lệch nhỏ.",
      },
    ],
  },
];
