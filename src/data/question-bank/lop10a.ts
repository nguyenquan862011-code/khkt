/** Lớp 10 — Chủ đề 1 (mở đầu) và Chủ đề 2 (mô tả chuyển động). */
import { M, N, NM, S, T, g, q, v, type BankItem } from "./dsl";

export const LOP10A: Record<string, BankItem[]> = {
  /* ===== Bài 1 - Làm quen với môn Vật lý ===== */
  b01: [
    q(
      1,
      "tn",
      M(
        "Đối tượng nghiên cứu chủ yếu của Vật lí là",
        [
          "các dạng vận động của vật chất và năng lượng",
          "cấu tạo và sự biến đổi của các chất hoá học",
          "sự phát triển của các loài sinh vật",
          "các quy luật của xã hội loài người",
        ],
        "Vật lí nghiên cứu các dạng vận động của vật chất (cơ, nhiệt, điện, từ, quang, hạt nhân…) và năng lượng.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Ai được xem là người mở đầu cho phương pháp thực nghiệm trong Vật lí?",
        ["Galilei", "Aristotle", "Newton", "Einstein"],
        "Galilei dùng thí nghiệm (mặt phẳng nghiêng, vật rơi) để kiểm chứng giả thuyết, mở đầu phương pháp thực nghiệm.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Cuộc cách mạng công nghiệp lần thứ nhất (cuối thế kỉ XVIII) gắn với thành tựu vật lí nào?",
        ["Động cơ hơi nước", "Máy phát điện xoay chiều", "Máy tính điện tử", "Trí tuệ nhân tạo"],
        "Động cơ hơi nước (nhiệt động lực học) thay thế sức cơ bắp, khởi đầu cách mạng công nghiệp lần 1.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Cuộc cách mạng công nghiệp lần thứ hai gắn với việc sử dụng rộng rãi",
        ["năng lượng điện", "động cơ hơi nước", "Internet vạn vật", "robot tự học"],
        "Hiện tượng cảm ứng điện từ (Faraday) dẫn tới máy phát điện, động cơ điện và sản xuất dây chuyền.",
      ),
    ),
    q(
      1,
      "tln",
      S(
        "Phương pháp nghiên cứu vật lí dùng thí nghiệm để phát hiện kết quả mới hoặc kiểm chứng giả thuyết gọi là phương pháp gì? (viết 2 chữ)",
        ["thực nghiệm", "phương pháp thực nghiệm"],
        "Phương pháp thực nghiệm: dùng thí nghiệm để phát hiện hoặc kiểm chứng. Phương pháp lí thuyết: dùng mô hình, suy luận toán học để dự đoán.",
      ),
    ),
    q(
      1,
      "ds",
      T(
        "Xét các phát biểu về vai trò của Vật lí:",
        [
          ["Vật lí là cơ sở của nhiều ngành khoa học tự nhiên và công nghệ.", true],
          [
            "Mọi thiết bị dùng thành tựu vật lí đều không gây ảnh hưởng xấu đến môi trường.",
            false,
            "Sử dụng sai cách vẫn gây ô nhiễm, ví dụ khí thải động cơ nhiệt.",
          ],
          ["Định vị GPS là ứng dụng của Vật lí trong thông tin liên lạc.", true],
          [
            "Vật lí chỉ nghiên cứu các vật có kích thước lớn như hành tinh.",
            false,
            "Vật lí nghiên cứu từ hạt vi mô đến vũ trụ.",
          ],
        ],
        "Vật lí có vai trò nền tảng nhưng việc ứng dụng cần gắn với trách nhiệm bảo vệ môi trường.",
      ),
    ),
    q(
      2,
      "tn",
      M(
        "Thứ tự đúng các bước của phương pháp thực nghiệm là",
        [
          "Xác định vấn đề → quan sát, thu thập thông tin → đưa ra dự đoán → thí nghiệm kiểm tra → kết luận",
          "Thí nghiệm kiểm tra → kết luận → đưa ra dự đoán → xác định vấn đề",
          "Đưa ra dự đoán → kết luận → thí nghiệm kiểm tra → quan sát",
          "Kết luận → quan sát → xác định vấn đề → thí nghiệm kiểm tra",
        ],
        "Tiến trình tìm hiểu thế giới tự nhiên: đặt vấn đề, quan sát, giả thuyết, kiểm tra bằng thí nghiệm rồi mới kết luận.",
      ),
    ),
    q(
      2,
      "tn",
      M(
        "Khi nghiên cứu chuyển động của ô tô trên quãng đường dài, coi ô tô là chất điểm là đang sử dụng",
        [
          "mô hình lí thuyết",
          "mô hình vật chất thu nhỏ",
          "phương pháp thực nghiệm",
          "phép đo trực tiếp",
        ],
        "Chất điểm, tia sáng, khí lí tưởng… là các mô hình lí thuyết lược bỏ yếu tố không quan trọng.",
      ),
    ),
    q(
      2,
      "tte",
      M(
        "Việc dự báo thời tiết bằng siêu máy tính dựa trên các phương trình khí động lực học là ví dụ của",
        [
          "phương pháp lí thuyết kết hợp mô hình toán học",
          "phương pháp thực nghiệm thuần tuý",
          "quan sát bằng mắt thường",
          "suy luận không cần dữ liệu",
        ],
        "Mô hình toán học (phương pháp lí thuyết) được nạp dữ liệu đo thực tế để dự đoán.",
      ),
    ),
    q(
      2,
      "lm",
      M(
        "Máy chụp cộng hưởng từ (MRI) trong bệnh viện là ví dụ về mối liên hệ giữa Vật lí và",
        ["Y học", "Địa lí", "Lịch sử", "Văn học"],
        "MRI ứng dụng từ trường mạnh và sóng vô tuyến — vật lí phục vụ chẩn đoán hình ảnh y học.",
      ),
    ),
    q(
      2,
      "ds",
      T(
        "Bạn An đưa ra giả thuyết: 'Vật nặng luôn rơi nhanh hơn vật nhẹ'.",
        [
          ["Giả thuyết cần được kiểm tra bằng thí nghiệm trước khi kết luận.", true],
          [
            "Thả viên bi sắt và viên bi nhựa cùng kích thước từ cùng độ cao là một thí nghiệm kiểm tra phù hợp.",
            true,
          ],
          [
            "Nếu hai viên bi chạm đất gần như đồng thời thì giả thuyết được khẳng định.",
            false,
            "Kết quả đó bác bỏ giả thuyết.",
          ],
          ["Trong ống chân không, lông chim và viên bi rơi nhanh như nhau.", true],
        ],
        "Thí nghiệm của Galilei và ống Newton cho thấy khi bỏ qua sức cản, mọi vật rơi như nhau.",
      ),
    ),
    g(1, "tt", 6, (r) => {
      const [p, f, name] = r.pick([
        ["k", 1e3, "kilo"],
        ["M", 1e6, "mêga"],
        ["m", 1e-3, "mili"],
        ["c", 1e-2, "xenti"],
        ["µ", 1e-6, "micrô"],
        ["n", 1e-9, "nanô"],
      ] as const);
      const x = r.i(2, 90);
      return N(
        `Tiền tố ${name} (${p}) ứng với hệ số ${v(f)}. Đổi ${x} ${p}m ra mét.`,
        x * f,
        "m",
        `${x} ${p}m = ${x}·${v(f)} m = ${v(x * f)} m.`,
      );
    }),
    g(3, "tng", 5, (r) => {
      const n = r.i(4, 8),
        t = r.s(1.2, 2.4, 0.1);
      return N(
        `Để kiểm tra dự đoán "chu kì con lắc không phụ thuộc khối lượng", một nhóm đo thời gian ${n * 5} dao động của con lắc được ${v(n * 5 * t)} s. Chu kì dao động là bao nhiêu giây?`,
        t,
        "s",
        `Đo nhiều dao động rồi chia để giảm sai số: T = ${v(n * 5 * t)}/${n * 5} = ${v(t)} s.`,
      );
    }),
    q(
      3,
      "tng",
      M(
        "Muốn kiểm tra giả thuyết 'chu kì con lắc đơn phụ thuộc chiều dài dây', cách bố trí thí nghiệm hợp lí là",
        [
          "chỉ thay đổi chiều dài dây, giữ nguyên khối lượng vật và biên độ góc nhỏ",
          "thay đổi đồng thời chiều dài dây và khối lượng vật",
          "giữ nguyên chiều dài dây, thay đổi khối lượng vật",
          "thay đổi vị trí làm thí nghiệm trong mỗi lần đo",
        ],
        "Nguyên tắc kiểm soát biến: mỗi lần chỉ thay đổi một đại lượng cần khảo sát.",
      ),
    ),
    q(
      4,
      "th",
      M(
        "Một nhóm đo chu kì con lắc với 5 chiều dài khác nhau và thấy T² tỉ lệ thuận với l. Kết luận nào được rút ra đúng phương pháp khoa học?",
        [
          "Số liệu ủng hộ mô hình T = 2π√(l/g) trong phạm vi đã đo",
          "Mô hình đúng tuyệt đối với mọi biên độ",
          "Chu kì không phụ thuộc gia tốc trọng trường",
          "Không cần lặp lại phép đo vì đã có 5 điểm",
        ],
        "Kết luận thực nghiệm chỉ có giá trị trong phạm vi và điều kiện đã khảo sát (biên độ nhỏ).",
      ),
    ),
  ],

  /* ===== Bài 2 - An toàn trong thực hành Vật lý ===== */
  b02: [
    q(
      1,
      "tn",
      M(
        "Kí hiệu 'DC' hoặc dấu '–' trên thiết bị điện có nghĩa là",
        ["dòng điện một chiều", "dòng điện xoay chiều", "cực dương", "nối đất"],
        "DC (direct current): một chiều; AC hoặc dấu '~': xoay chiều.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Kí hiệu 'AC' hoặc dấu '~' trên thiết bị điện có nghĩa là",
        ["dòng điện xoay chiều", "dòng điện một chiều", "đầu vào", "đầu ra"],
        "AC (alternating current) là dòng điện xoay chiều.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Biển cảnh báo hình tam giác viền đen, nền vàng có hình tia sét cho biết",
        ["nguy hiểm về điện", "chất dễ cháy", "chất phóng xạ", "nhiệt độ cao"],
        "Tia sét trong tam giác vàng: cảnh báo điện áp nguy hiểm.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Khi phát hiện người bị điện giật, việc cần làm đầu tiên là",
        [
          "ngắt nguồn điện hoặc dùng vật cách điện tách người khỏi nguồn",
          "dùng tay kéo ngay nạn nhân ra",
          "tạt nước vào nạn nhân",
          "chạy đi tìm thầy cô mà không ngắt điện",
        ],
        "Phải cách li nạn nhân khỏi nguồn điện một cách an toàn trước khi sơ cứu.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Trước khi cắm phích của thiết bị thí nghiệm vào ổ điện cần",
        [
          "kiểm tra hiệu điện thế định mức của thiết bị phù hợp với nguồn",
          "bật sẵn công tắc ở mức lớn nhất",
          "làm ướt tay để tiếp xúc tốt",
          "tháo vỏ bảo vệ thiết bị",
        ],
        "Dùng sai hiệu điện thế định mức có thể làm cháy thiết bị và gây nguy hiểm.",
      ),
    ),
    q(
      1,
      "ds",
      T(
        "Quy tắc an toàn trong phòng thực hành:",
        [
          ["Chỉ tiến hành thí nghiệm khi được giáo viên cho phép.", true],
          [
            "Có thể nhìn trực tiếp vào tia laser nếu chỉ trong vài giây.",
            false,
            "Tia laser có thể gây tổn thương võng mạc.",
          ],
          ["Phải bố trí dây điện gọn gàng, không để vướng lối đi.", true],
          ["Được dùng tay ướt để bật tắt thiết bị điện áp thấp.", false],
        ],
        "An toàn điện, nhiệt, quang và hoá chất là yêu cầu bắt buộc.",
      ),
    ),
    q(
      2,
      "tn",
      M(
        "Khi dùng ampe kế đo cường độ dòng điện mà chưa biết cỡ giá trị, nên",
        [
          "chọn thang đo lớn nhất rồi giảm dần",
          "chọn thang đo nhỏ nhất rồi tăng dần",
          "mắc ampe kế song song với nguồn",
          "bỏ qua việc chọn thang đo",
        ],
        "Chọn thang lớn trước để tránh dòng vượt giới hạn đo làm hỏng dụng cụ.",
      ),
    ),
    q(
      2,
      "tn",
      M(
        "Ampe kế phải được mắc như thế nào với đoạn mạch cần đo dòng điện?",
        [
          "Nối tiếp, dòng điện đi vào chốt dương",
          "Song song, dòng điện đi vào chốt âm",
          "Song song với nguồn điện",
          "Nối tiếp, dòng điện đi vào chốt âm",
        ],
        "Ampe kế mắc nối tiếp; vôn kế mắc song song; chốt (+) nối về phía cực dương của nguồn.",
      ),
    ),
    q(
      2,
      "tte",
      M(
        "Vì sao không được đun nóng trực tiếp nhiệt kế thuỷ ngân trên ngọn lửa đèn cồn?",
        [
          "Chất lỏng dãn nở vượt giới hạn đo làm vỡ nhiệt kế, thuỷ ngân độc thoát ra",
          "Vì thuỷ ngân sẽ đông đặc lại",
          "Vì ngọn lửa làm nhiệt kế chỉ sai nhưng không nguy hiểm",
          "Vì thuỷ tinh dẫn điện khi nóng",
        ],
        "Nhiệt độ ngọn lửa cao hơn nhiều giới hạn đo; thuỷ ngân là chất độc.",
      ),
    ),
    q(
      2,
      "lm",
      M(
        "Chì thường được dùng làm tấm che khi chụp X-quang vì",
        [
          "chì hấp thụ mạnh tia X, giảm liều chiếu lên cơ thể",
          "chì phát ra tia X",
          "chì nhẹ và rẻ",
          "chì làm ảnh rõ hơn",
        ],
        "Nguyên tắc an toàn bức xạ (Vật lí – Y học): che chắn, giữ khoảng cách, giảm thời gian.",
      ),
    ),
    q(
      2,
      "ds",
      T(
        "Một bạn dùng đồng hồ đo điện đa năng để đo hiệu điện thế của ổ điện 220 V.",
        [
          ["Phải vặn núm xoay về thang đo điện áp xoay chiều (ACV).", true],
          ["Chọn thang 250 V (hoặc lớn hơn gần nhất) là phù hợp.", true],
          [
            "Có thể để núm xoay ở thang đo điện trở (Ω).",
            false,
            "Đo điện áp khi để thang Ω sẽ làm hỏng đồng hồ.",
          ],
          ["Cầm tay vào phần kim loại của que đo cho chắc.", false],
        ],
        "Chọn đúng chức năng, đúng thang đo và chỉ cầm vào phần cách điện.",
      ),
    ),
    g(2, "tt", 5, (r) => {
      const u = r.pick([110, 220]),
        p = r.pick([440, 660, 880, 1100, 1320, 2200]);
      return N(
        `Một ấm điện ghi ${u} V – ${p} W hoạt động đúng định mức. Cường độ dòng điện qua ấm là bao nhiêu ampe? (dùng để chọn cầu chì/aptomat phù hợp)`,
        p / u,
        "A",
        `I = P/U = ${p}/${u} = ${v(p / u)} A. Thiết bị bảo vệ phải có dòng định mức lớn hơn giá trị này một chút.`,
      );
    }),
    g(3, "tt", 5, (r) => {
      const imax = r.pick([10, 16, 20]),
        n = r.i(2, 4),
        p = r.pick([800, 1000, 1200, 1500]);
      const total = n * p,
        i = total / 220;
      return M(
        `Ổ cắm kéo dài chịu được dòng tối đa ${imax} A ở 220 V. Cắm đồng thời ${n} thiết bị, mỗi thiết bị ${p} W. Nhận xét nào đúng?`,
        i > imax
          ? [
              `Quá tải vì dòng tổng ≈ ${v(i, 1)} A > ${imax} A`,
              `An toàn vì dòng tổng ≈ ${v(i / n, 1)} A`,
              "An toàn vì các thiết bị mắc song song",
              `Quá tải vì công suất mỗi thiết bị lớn hơn ${imax} W`,
            ]
          : [
              `An toàn vì dòng tổng ≈ ${v(i, 1)} A < ${imax} A`,
              `Quá tải vì dòng tổng ≈ ${v(i * n, 1)} A`,
              "Quá tải vì các thiết bị mắc song song",
              "Không xác định được nếu chưa biết điện trở dây",
            ],
        `Công suất tổng ${total} W ⇒ I = P/U = ${total}/220 ≈ ${v(i, 1)} A, so sánh với ${imax} A.`,
      );
    }),
    q(
      3,
      "tng",
      M(
        "Khi làm thí nghiệm với đèn cồn, thao tác nào đúng?",
        [
          "Tắt đèn bằng cách đậy nắp, không thổi",
          "Châm lửa bằng cách nghiêng đèn này vào đèn khác",
          "Rót thêm cồn khi đèn đang cháy",
          "Để đèn sát mép bàn cho dễ lấy",
        ],
        "Đậy nắp để ngắt nguồn oxi; các thao tác còn lại dễ gây cháy lan.",
      ),
    ),
    q(
      4,
      "th",
      M(
        "Dòng điện qua cơ thể người từ khoảng 10 mA trở lên đã nguy hiểm. Nếu điện trở cơ thể khi tay ướt giảm còn 1 000 Ω thì hiệu điện thế tiếp xúc nhỏ nhất gây nguy hiểm là",
        ["10 V", "220 V", "1 V", "100 V"],
        "U = I·R = 0,010·1000 = 10 V. Tay ướt làm điện trở giảm mạnh nên điện áp thấp cũng nguy hiểm.",
      ),
    ),
  ],

  /* ===== Bài 3 - Sai số trong phép đo ===== */
  b03: [
    q(
      1,
      "tn",
      M(
        "Phép đo trực tiếp là phép đo",
        [
          "đọc kết quả ngay trên dụng cụ đo",
          "tính kết quả qua công thức liên hệ với các đại lượng đo được",
          "luôn không có sai số",
          "chỉ thực hiện một lần",
        ],
        "Đo trực tiếp: so sánh với dụng cụ đo. Đo gián tiếp: tính qua công thức.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Sai số hệ thống là sai số",
        [
          "có tính quy luật, lặp lại ở mọi lần đo (do dụng cụ, do điểm 0 lệch…)",
          "xuất hiện ngẫu nhiên, không rõ nguyên nhân",
          "do đọc nhầm số liệu",
          "chỉ có ở phép đo gián tiếp",
        ],
        "Sai số hệ thống làm kết quả luôn lệch về một phía; sai số ngẫu nhiên thay đổi thất thường.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Sai số tỉ đối của phép đo được tính bằng",
        ["δA = (ΔA/Ā)·100%", "δA = Ā·ΔA", "δA = Ā − ΔA", "δA = (Ā/ΔA)·100%"],
        "Sai số tỉ đối là tỉ số giữa sai số tuyệt đối và giá trị trung bình, tính theo %.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Sai số dụng cụ thường được lấy bằng",
        [
          "nửa hoặc một độ chia nhỏ nhất của dụng cụ",
          "hai lần độ chia nhỏ nhất",
          "giới hạn đo của dụng cụ",
          "giá trị trung bình các lần đo",
        ],
        "ΔA_dc thường lấy bằng nửa hoặc một ĐCNN (hoặc theo nhà sản xuất).",
      ),
    ),
    q(
      2,
      "tn",
      M(
        "Sai số tuyệt đối của một tổng hai đại lượng A = B + C là",
        ["ΔA = ΔB + ΔC", "ΔA = ΔB − ΔC", "ΔA = ΔB·ΔC", "ΔA = ΔB/ΔC"],
        "Sai số tuyệt đối của tổng hay hiệu bằng TỔNG các sai số tuyệt đối.",
      ),
    ),
    q(
      2,
      "tn",
      M(
        "Sai số tỉ đối của thương A = B/C là",
        ["δA = δB + δC", "δA = δB − δC", "δA = δB·δC", "δA = δB/δC"],
        "Sai số tỉ đối của tích hay thương bằng TỔNG các sai số tỉ đối.",
      ),
    ),
    q(
      2,
      "ds",
      T(
        "Về sai số trong phép đo:",
        [
          ["Đo nhiều lần rồi lấy trung bình giúp giảm ảnh hưởng của sai số ngẫu nhiên.", true],
          ["Hiệu chỉnh điểm 0 của cân giúp giảm sai số hệ thống.", true],
          [
            "Sai số tỉ đối càng lớn thì phép đo càng chính xác.",
            false,
            "Sai số tỉ đối càng nhỏ, phép đo càng chính xác.",
          ],
          ["Kết quả đo được viết dạng A = Ā ± ΔA.", true],
        ],
        "ΔA = ΔA_tb + ΔA_dc; δA = ΔA/Ā.",
      ),
    ),
    g(1, "tt", 5, (r) => {
      const a = r.s(2, 9, 0.5),
        d = r.pick([0.1, 0.2, 0.05]);
      return N(
        `Kết quả đo chiều dài là l = ${v(a * 10)} ± ${v(d)} (cm). Sai số tỉ đối của phép đo là bao nhiêu phần trăm?`,
        (d / (a * 10)) * 100,
        "%",
        `δl = Δl/l·100% = ${v(d)}/${v(a * 10)}·100% ≈ ${v((d / (a * 10)) * 100, 2)}%.`,
        { absTol: 0.01 },
      );
    }),
    g(2, "bs", 5, (r) => {
      const base = r.s(2, 6, 0.01);
      const xs = [0, 1, 2, 3, 4].map(() => Math.round((base + r.i(-4, 4) * 0.01) * 100) / 100);
      const mean = xs.reduce((s, x) => s + x, 0) / 5;
      return N(
        "Đo đường kính viên bi 5 lần được kết quả như bảng. Giá trị trung bình của đường kính là bao nhiêu mm?",
        mean,
        "mm",
        `d̄ = (${xs.map((x) => v(x)).join(" + ")})/5 = ${v(mean, 3)} mm.`,
        {
          relTol: 0.002,
          figure: {
            type: "table",
            caption: "Kết quả đo đường kính viên bi",
            headers: ["Lần đo", "1", "2", "3", "4", "5"],
            rows: [["d (mm)", ...xs.map((x) => v(x))]],
          },
        },
      );
    }),
    g(3, "bs", 5, (r) => {
      const base = r.s(0.4, 0.9, 0.01);
      const ts = [0, 1, 2, 3].map(() => Math.round((base + r.i(-3, 3) * 0.01) * 100) / 100);
      const mean = ts.reduce((s, x) => s + x, 0) / 4;
      const dev = ts.reduce((s, x) => s + Math.abs(x - mean), 0) / 4;
      return N(
        "Đo thời gian rơi của một vật 4 lần được bảng số liệu. Tính sai số tuyệt đối trung bình (sai số ngẫu nhiên) của phép đo theo giây.",
        dev,
        "s",
        `t̄ = ${v(mean, 4)} s; Δt_tb = trung bình các |t̄ − tᵢ| = ${v(dev, 4)} s.`,
        {
          relTol: 0.03,
          absTol: 0.0006,
          figure: {
            type: "table",
            caption: "Thời gian rơi",
            headers: ["Lần đo", "1", "2", "3", "4"],
            rows: [["t (s)", ...ts.map((x) => v(x))]],
          },
        },
      );
    }),
    g(3, "tt", 4, (r) => {
      const s = r.i(20, 80) / 10,
        ds = 0.01,
        t = r.s(1.5, 4, 0.1),
        dt = r.pick([0.01, 0.02]);
      const dv = (ds / s + dt / t) * 100;
      return N(
        `Đo quãng đường s = ${v(s)} ± ${v(ds)} (m) và thời gian t = ${v(t)} ± ${v(dt)} (s) để tính tốc độ v = s/t. Sai số tỉ đối của v là bao nhiêu phần trăm?`,
        dv,
        "%",
        `δv = δs + δt = ${v(ds)}/${v(s)} + ${v(dt)}/${v(t)} ≈ ${v(dv, 2)}%.`,
        { relTol: 0.03 },
      );
    }),
    g(4, "tng", 3, (r) => {
      const l = r.s(0.5, 1.2, 0.1),
        dl = 0.001,
        T0 = 2 * Math.PI * Math.sqrt(l / 9.8),
        T = Math.round(T0 * 100) / 100,
        dT = 0.01;
      const dg = (dl / l + (2 * dT) / T) * 100;
      return N(
        `Xác định g bằng con lắc đơn theo g = 4π²l/T² với l = ${v(l, 3)} ± ${v(dl)} (m), T = ${v(T)} ± ${v(dT)} (s). Bỏ qua sai số của π, sai số tỉ đối của g là bao nhiêu phần trăm?`,
        dg,
        "%",
        `δg = δl + 2δT = ${v(dl)}/${v(l)} + 2·${v(dT)}/${v(T)} ≈ ${v(dg, 2)}%. (Số mũ 2 của T làm sai số tỉ đối nhân đôi.)`,
        { relTol: 0.03 },
      );
    }),
    q(
      4,
      "tng",
      M(
        "Để giảm sai số tỉ đối khi đo chu kì con lắc bằng đồng hồ bấm giây, cách hiệu quả nhất là",
        [
          "đo thời gian của nhiều dao động (ví dụ 20 dao động) rồi chia cho số dao động",
          "đo thời gian của đúng 1 dao động nhiều lần",
          "tăng khối lượng quả nặng",
          "dùng dây treo ngắn hơn",
        ],
        "Sai số bấm giây (≈ 0,2 s) không đổi; đo khoảng thời gian dài làm sai số tỉ đối nhỏ đi.",
      ),
    ),
    q(
      3,
      "tte",
      M(
        "Một cân bếp khi chưa đặt vật đã chỉ 5 g. Nếu không chỉnh lại, mọi kết quả cân sẽ mắc loại sai số nào và lệch thế nào?",
        [
          "Sai số hệ thống, lớn hơn giá trị thật 5 g",
          "Sai số ngẫu nhiên, khi lớn khi nhỏ",
          "Sai số hệ thống, nhỏ hơn giá trị thật 5 g",
          "Không có sai số",
        ],
        "Lệch điểm 0 gây sai số hệ thống: mọi lần đo đều dư 5 g.",
      ),
    ),
  ],

  /* ===== Bài 1 (CĐ2) - Độ dịch chuyển - Quãng đường đi được ===== */
  b04: [
    q(
      1,
      "tn",
      M(
        "Độ dịch chuyển là",
        [
          "một vectơ nối vị trí đầu với vị trí cuối của vật",
          "độ dài quỹ đạo vật đi được",
          "một đại lượng vô hướng luôn dương",
          "tốc độ trung bình của vật",
        ],
        "Độ dịch chuyển d⃗ có gốc ở vị trí đầu, ngọn ở vị trí cuối; quãng đường là độ dài quỹ đạo.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Độ lớn độ dịch chuyển bằng quãng đường đi được khi vật",
        [
          "chuyển động thẳng và không đổi chiều",
          "chuyển động tròn",
          "chuyển động thẳng có đổi chiều",
          "quay lại vị trí ban đầu",
        ],
        "Chỉ khi chuyển động thẳng theo một chiều thì d = s.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Một vật chuyển động rồi trở về đúng vị trí xuất phát. Độ dịch chuyển của vật",
        ["bằng 0", "bằng quãng đường", "bằng hai lần quãng đường", "luôn âm"],
        "Vị trí đầu trùng vị trí cuối ⇒ d = 0 dù quãng đường khác 0.",
      ),
    ),
    q(
      1,
      "tln",
      S(
        "Đại lượng nào cho biết độ dài quỹ đạo mà vật đã đi, không phụ thuộc hướng? (2–3 chữ)",
        ["quãng đường", "quãng đường đi được"],
        "Quãng đường đi được là đại lượng vô hướng, không âm.",
      ),
    ),
    q(
      2,
      "ds",
      T(
        "Một người đi bộ từ nhà đến siêu thị cách 400 m rồi quay lại hiệu sách cách nhà 150 m (nhà, hiệu sách, siêu thị thẳng hàng theo thứ tự đó).",
        [
          ["Quãng đường đã đi là 650 m.", true, "400 + 250 = 650 m."],
          ["Độ lớn độ dịch chuyển là 150 m.", true],
          [
            "Độ dịch chuyển ngược hướng với hướng từ nhà đến siêu thị.",
            false,
            "Vị trí cuối vẫn nằm phía siêu thị nên d⃗ cùng hướng.",
          ],
          ["Quãng đường luôn lớn hơn hoặc bằng độ lớn độ dịch chuyển.", true],
        ],
        "s = 400 + (400 − 150) = 650 m; d = 150 m.",
      ),
    ),
    q(
      2,
      "tte",
      M(
        "Đồng hồ công-tơ-mét trên xe máy cho biết",
        ["quãng đường xe đã đi", "độ dịch chuyển của xe", "vận tốc trung bình", "gia tốc của xe"],
        "Công-tơ-mét cộng dồn độ dài đường đi, không quan tâm hướng.",
      ),
    ),
    g(1, "tt", 5, (r) => {
      const a = r.i(3, 9) * 100,
        b = r.i(1, a / 100 - 1) * 100;
      return N(
        `Một bạn đi thẳng ${a} m về phía đông rồi quay lại đi ${b} m về phía tây. Quãng đường bạn đã đi là bao nhiêu mét?`,
        a + b,
        "m",
        `s = ${a} + ${b} = ${a + b} m.`,
      );
    }),
    g(2, "tt", 5, (r) => {
      const a = r.i(3, 9) * 100,
        b = r.i(1, a / 100 - 1) * 100;
      return N(
        `Một bạn đi thẳng ${a} m về phía đông rồi quay lại đi ${b} m về phía tây. Độ lớn độ dịch chuyển của bạn là bao nhiêu mét?`,
        a - b,
        "m",
        `Chọn chiều dương hướng đông: d = ${a} − ${b} = ${a - b} m (hướng đông).`,
      );
    }),
    g(3, "tt", 5, (r) => {
      const [a, b, c] = r.pick([
        [3, 4, 5],
        [6, 8, 10],
        [5, 12, 13],
        [9, 12, 15],
        [8, 15, 17],
      ] as const);
      return N(
        `Một ca nô đi ${a} km về hướng bắc rồi rẽ đi ${b} km về hướng đông. Độ lớn độ dịch chuyển tổng hợp là bao nhiêu km?`,
        c,
        "km",
        `Hai độ dịch chuyển vuông góc: d = √(${a}² + ${b}²) = ${c} km.`,
      );
    }),
    g(3, "tt", 4, (r) => {
      const R = r.i(2, 9) * 10,
        n = r.pick([0.5, 1.5, 2.5]);
      return N(
        `Một vận động viên chạy ${v(n)} vòng quanh sân hình tròn bán kính ${R} m. Độ lớn độ dịch chuyển của vận động viên là bao nhiêu mét?`,
        2 * R,
        "m",
        `Sau ${v(n)} vòng, vận động viên ở vị trí đối diện qua tâm ⇒ d = 2R = ${2 * R} m (quãng đường là ${v(n)}·2πR ≈ ${v(n * 2 * Math.PI * R, 0)} m).`,
      );
    }),
    g(4, "th", 5, (r) => {
      const a = r.i(2, 6),
        b = r.i(2, 6),
        c = r.i(1, a - 1 > 0 ? a - 1 : 1);
      const dx = b,
        dy = a - c,
        d = Math.sqrt(dx * dx + dy * dy);
      return N(
        `Một robot đi ${a} m về hướng bắc, ${b} m về hướng đông rồi ${c} m về hướng nam. Độ lớn độ dịch chuyển của robot là bao nhiêu mét?`,
        d,
        "m",
        `Theo trục bắc–nam: ${a} − ${c} = ${dy} m; theo trục đông: ${b} m. d = √(${dy}² + ${b}²) ≈ ${v(d, 2)} m; quãng đường là ${a + b + c} m.`,
      );
    }),
    q(
      4,
      "th",
      M(
        "Hai người cùng xuất phát từ A đến B: người thứ nhất đi đường thẳng AB dài 3 km, người thứ hai đi đường vòng dài 5 km. So sánh nào đúng?",
        [
          "Hai người có cùng độ dịch chuyển, quãng đường khác nhau",
          "Người thứ hai có độ dịch chuyển lớn hơn",
          "Hai người có cùng quãng đường",
          "Người thứ nhất có độ dịch chuyển nhỏ hơn",
        ],
        "Độ dịch chuyển chỉ phụ thuộc vị trí đầu và cuối: cả hai đều là vectơ AB.",
      ),
    ),
  ],

  /* ===== Bài 2 (CĐ2) - Tốc độ và vận tốc ===== */
  b05: [
    q(
      1,
      "tn",
      M(
        "Tốc độ trung bình được tính bằng",
        [
          "quãng đường đi được chia cho thời gian đi",
          "độ dịch chuyển chia cho thời gian",
          "thời gian chia cho quãng đường",
          "tích của quãng đường và thời gian",
        ],
        "v_tb = s/t; vận tốc trung bình v⃗ = d⃗/t.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Vận tốc trung bình là đại lượng",
        [
          "vectơ, bằng độ dịch chuyển chia cho thời gian",
          "vô hướng, bằng quãng đường chia cho thời gian",
          "vô hướng, luôn dương",
          "vectơ, bằng quãng đường nhân thời gian",
        ],
        "Vận tốc có hướng của độ dịch chuyển.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Số chỉ của tốc kế trên xe máy tại một thời điểm cho biết",
        [
          "tốc độ tức thời",
          "tốc độ trung bình cả hành trình",
          "vận tốc trung bình",
          "quãng đường đã đi",
        ],
        "Tốc kế đo tốc độ tại thời điểm đang xét.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Đổi 72 km/h ra m/s được",
        ["20 m/s", "7,2 m/s", "259,2 m/s", "36 m/s"],
        "72 km/h = 72/3,6 = 20 m/s.",
      ),
    ),
    q(
      2,
      "tn",
      M(
        "Công thức cộng vận tốc là",
        ["v⃗₁₃ = v⃗₁₂ + v⃗₂₃", "v⃗₁₃ = v⃗₁₂ − v⃗₂₃", "v₁₃ = v₁₂·v₂₃", "v⃗₁₂ = v⃗₁₃ + v⃗₂₃"],
        "Vận tốc tuyệt đối bằng tổng vectơ vận tốc tương đối và vận tốc kéo theo.",
      ),
    ),
    q(
      2,
      "ds",
      T(
        "Một người bơi một vòng hồ dài 50 m rồi quay về vị trí xuất phát hết 100 s.",
        [
          ["Tốc độ trung bình là 1 m/s.", true, "s = 100 m."],
          ["Vận tốc trung bình bằng 0.", true, "Độ dịch chuyển bằng 0."],
          ["Tốc độ trung bình luôn bằng độ lớn vận tốc trung bình.", false],
          ["Quãng đường bơi là 50 m.", false, "Đi và về là 100 m."],
        ],
        "Tốc độ dùng quãng đường, vận tốc dùng độ dịch chuyển.",
      ),
    ),
    g(1, "tt", 5, (r) => {
      const t = r.i(2, 9) * 10,
        sp = r.i(2, 12);
      return N(
        `Một người chạy được ${t * sp} m trong ${t} s. Tốc độ trung bình của người đó là bao nhiêu m/s?`,
        sp,
        "m/s",
        `v = s/t = ${t * sp}/${t} = ${sp} m/s.`,
      );
    }),
    g(1, "tt", 3, (r) => {
      const k = r.pick([18, 36, 54, 90, 108, 126]);
      return N(
        `Đổi tốc độ ${k} km/h ra m/s.`,
        k / 3.6,
        "m/s",
        `${k} km/h = ${k}/3,6 = ${v(k / 3.6)} m/s.`,
      );
    }),
    g(2, "tt", 4, (r) => {
      const vb = r.i(12, 24),
        vn = r.i(2, 6);
      return N(
        `Một ca nô có tốc độ ${vb} km/h so với nước, chạy xuôi dòng sông có nước chảy ${vn} km/h. Tốc độ của ca nô so với bờ là bao nhiêu km/h?`,
        vb + vn,
        "km/h",
        `Xuôi dòng hai vận tốc cùng chiều: v = ${vb} + ${vn} = ${vb + vn} km/h.`,
      );
    }),
    g(3, "tt", 4, (r) => {
      const v1 = r.pick([30, 40, 45, 60]),
        v2 = r.pick([20, 36, 50, 90].filter((x) => x !== v1));
      const avg = (2 * v1 * v2) / (v1 + v2);
      return N(
        `Một xe đi nửa quãng đường đầu với tốc độ ${v1} km/h và nửa quãng đường sau với tốc độ ${v2} km/h. Tốc độ trung bình trên cả quãng đường là bao nhiêu km/h?`,
        avg,
        "km/h",
        `v_tb = s/(s/(2v₁) + s/(2v₂)) = 2v₁v₂/(v₁+v₂) = 2·${v1}·${v2}/${v1 + v2} ≈ ${v(avg, 2)} km/h (không phải trung bình cộng).`,
      );
    }),
    g(3, "tt", 4, (r) => {
      const vb = r.i(4, 9),
        vn = r.i(1, 3),
        L = r.i(6, 20) * 10;
      const t = L / vb;
      return N(
        `Một người bơi với tốc độ ${v(vb / 2)} m/s so với nước, luôn hướng mũi vuông góc với bờ sông rộng ${L} m; nước chảy ${v(vn / 2)} m/s. Khi sang tới bờ bên kia, người đó bị trôi xuôi dòng bao nhiêu mét?`,
        (vn / 2) * (L / (vb / 2)),
        "m",
        `Thời gian sang sông t = ${L}/${v(vb / 2)} = ${v(t * 2, 2)} s. Độ trôi = v_nước·t = ${v(vn / 2)}·${v(t * 2, 2)} ≈ ${v((vn / 2) * t * 2, 2)} m.`,
      );
    }),
    g(4, "th", 5, (r) => {
      const vb = r.pick([5, 10, 13, 15]),
        vn = r.pick([3, 4, 5, 6, 12].filter((x) => x < vb));
      const res = Math.sqrt(vb * vb - vn * vn);
      return N(
        `Một ca nô có tốc độ ${vb} m/s so với nước muốn đi theo đường vuông góc với bờ sông, nước chảy ${vn} m/s. Tốc độ của ca nô so với bờ là bao nhiêu m/s?`,
        res,
        "m/s",
        `Để quỹ đạo vuông góc bờ, vận tốc so với bờ là cạnh góc vuông: v = √(${vb}² − ${vn}²) ≈ ${v(res, 2)} m/s.`,
      );
    }),
    g(2, "bs", 4, (r) => {
      const sp = r.i(8, 15) / 2,
        rows = [1, 2, 3, 4].map((k) => [k * 10, round1(sp * k * 10)]);
      return N(
        "Bảng ghi vị trí của một xe đồ chơi chuyển động thẳng theo thời gian. Tốc độ trung bình của xe trong 40 s đầu là bao nhiêu cm/s?",
        sp,
        "cm/s",
        `v = s/t = ${v(rows[3]![1]!)}/40 = ${v(sp)} cm/s.`,
        {
          figure: {
            type: "table",
            headers: ["t (s)", "0", "10", "20", "30", "40"],
            rows: [["s (cm)", 0, ...rows.map((x) => v(x[1]!))]],
          },
        },
      );
    }),
    q(
      3,
      "tte",
      M(
        "Camera 'bắn tốc độ' đo thời gian xe đi qua hai vạch cách nhau 10 m là 0,4 s. Đường giới hạn 80 km/h. Kết luận nào đúng?",
        [
          "Xe chạy 90 km/h, vượt quá tốc độ",
          "Xe chạy 25 km/h, không vi phạm",
          "Xe chạy 72 km/h, không vi phạm",
          "Xe chạy 144 km/h, vượt quá tốc độ",
        ],
        "v = 10/0,4 = 25 m/s = 90 km/h > 80 km/h.",
      ),
    ),
  ],

  /* ===== Bài 3 (CĐ2) - Chuyển động thẳng đều, đồ thị d–t ===== */
  b06: [
    q(
      1,
      "tn",
      M(
        "Trong chuyển động thẳng đều theo một chiều, đồ thị độ dịch chuyển – thời gian là",
        [
          "đường thẳng xiên góc",
          "đường parabol",
          "đường thẳng song song trục thời gian",
          "đường tròn",
        ],
        "d = v·t là hàm bậc nhất của t.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Độ dốc (hệ số góc) của đồ thị độ dịch chuyển – thời gian cho biết",
        ["vận tốc của vật", "gia tốc của vật", "quãng đường của vật", "khối lượng của vật"],
        "v = Δd/Δt chính là độ dốc của đồ thị d–t.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Đồ thị d–t là đường thẳng song song với trục thời gian cho biết vật",
        ["đứng yên", "chuyển động thẳng đều", "chuyển động nhanh dần", "chuyển động chậm dần"],
        "Độ dịch chuyển không đổi theo thời gian ⇒ vật đứng yên.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Phương trình chuyển động thẳng đều có dạng",
        ["x = x₀ + v·t", "x = x₀ + v·t²", "x = v/t", "x = x₀·v·t"],
        "Toạ độ là hàm bậc nhất của thời gian.",
      ),
    ),
    q(
      2,
      "tn",
      M(
        "Trên đồ thị d–t, đoạn thẳng dốc xuống (độ dốc âm) cho biết vật",
        [
          "chuyển động ngược chiều dương",
          "chuyển động chậm dần",
          "đứng yên",
          "có vận tốc tăng dần",
        ],
        "Độ dốc âm ⇒ vận tốc âm ⇒ vật đi ngược chiều dương.",
      ),
    ),
    q(
      2,
      "ds",
      T(
        "Hai xe A và B chuyển động thẳng đều có đồ thị d–t là hai đường thẳng cắt nhau tại điểm (t = 2 h; d = 80 km).",
        [
          ["Hai xe gặp nhau sau 2 h.", true],
          ["Vị trí gặp nhau cách gốc toạ độ 80 km.", true],
          [
            "Tại điểm cắt, hai xe có cùng vận tốc.",
            false,
            "Cùng vị trí chứ không cùng vận tốc; vận tốc là độ dốc.",
          ],
          ["Đường dốc hơn ứng với xe có tốc độ lớn hơn.", true],
        ],
        "Giao điểm đồ thị d–t là thời điểm và vị trí gặp nhau.",
      ),
    ),
    g(1, "tt", 5, (r) => {
      const sp = r.i(3, 15),
        t = r.i(4, 20);
      return N(
        `Một vật chuyển động thẳng đều với tốc độ ${sp} m/s. Trong ${t} s vật đi được quãng đường bao nhiêu mét?`,
        sp * t,
        "m",
        `s = v·t = ${sp}·${t} = ${sp * t} m.`,
      );
    }),
    g(2, "dt", 5, (r) => {
      const sp = r.i(2, 9),
        T0 = r.pick([4, 5, 6, 8]);
      const pts: [number, number][] = [0, 1, 2, 3, 4].map((k) => [(k * T0) / 4, (sp * k * T0) / 4]);
      return N(
        "Đồ thị độ dịch chuyển – thời gian của một xe như hình. Tốc độ của xe là bao nhiêu m/s?",
        sp,
        "m/s",
        `Độ dốc: v = Δd/Δt = ${sp * T0}/${T0} = ${sp} m/s.`,
        {
          figure: {
            type: "graph",
            title: "Đồ thị d–t",
            xLabel: "t (s)",
            yLabel: "d (m)",
            series: [{ points: pts }],
          },
        },
      );
    }),
    g(3, "dt", 5, (r) => {
      const v1 = r.i(3, 8),
        t1 = r.i(2, 4),
        rest = r.i(1, 3),
        v2 = r.i(2, 6),
        t3 = r.i(1, 3);
      const d1 = v1 * t1,
        d2 = d1 - v2 * t3;
      const pts: [number, number][] = [
        [0, 0],
        [t1, d1],
        [t1 + rest, d1],
        [t1 + rest + t3, d2],
      ];
      const total = d1 + v2 * t3;
      return N(
        "Đồ thị d–t của một người đi bộ gồm 3 giai đoạn như hình. Tổng quãng đường người đó đi được là bao nhiêu mét?",
        total,
        "m",
        `Giai đoạn 1 đi ${d1} m, giai đoạn 2 đứng yên, giai đoạn 3 quay lại ${v2 * t3} m ⇒ s = ${d1} + ${v2 * t3} = ${total} m (độ dịch chuyển chỉ còn ${d2} m).`,
        {
          figure: {
            type: "graph",
            title: "Đồ thị d–t",
            xLabel: "t (s)",
            yLabel: "d (m)",
            series: [{ points: pts }],
          },
        },
      );
    }),
    g(3, "tt", 5, (r) => {
      const v1 = r.i(10, 16) * 5,
        v2 = r.i(5, 9) * 5,
        tt = r.i(1, 4);
      const L = (v1 + v2) * tt;
      return N(
        `Hai xe xuất phát cùng lúc từ hai điểm A và B cách nhau ${L} km, chuyển động thẳng đều ngược chiều nhau với tốc độ ${v1} km/h và ${v2} km/h. Sau bao nhiêu giờ hai xe gặp nhau?`,
        tt,
        "h",
        `Chọn gốc tại A: x₁ = ${v1}t; x₂ = ${L} − ${v2}t. Gặp nhau khi x₁ = x₂ ⇒ t = ${L}/(${v1}+${v2}) = ${tt} h.`,
      );
    }),
    g(4, "th", 5, (r) => {
      const v2 = r.i(8, 12) * 5,
        dv = r.i(2, 4) * 5,
        v1 = v2 + dv,
        head = r.i(1, 3) * dv;
      const t = head / dv;
      return N(
        `Xe A chạy với tốc độ ${v1} km/h đuổi theo xe B chạy cùng chiều với tốc độ ${v2} km/h. Lúc đầu xe B ở phía trước xe A ${head} km. Vị trí hai xe gặp nhau cách điểm xuất phát của xe A bao nhiêu km?`,
        v1 * t,
        "km",
        `x_A = ${v1}t; x_B = ${head} + ${v2}t ⇒ t = ${head}/(${v1}−${v2}) = ${v(t)} h; x = ${v1}·${v(t)} = ${v(v1 * t)} km.`,
      );
    }),
    q(
      2,
      "tte",
      M(
        "Thang cuốn ở siêu thị đưa khách đi lên với tốc độ không đổi theo đường thẳng. Chuyển động của khách đứng yên trên thang so với mặt đất là",
        ["chuyển động thẳng đều", "chuyển động nhanh dần đều", "chuyển động tròn đều", "rơi tự do"],
        "Quỹ đạo thẳng, tốc độ không đổi ⇒ thẳng đều.",
      ),
    ),
  ],

  /* ===== Bài 4 (CĐ2) - Chuyển động biến đổi - Gia tốc ===== */
  b07: [
    q(
      1,
      "tn",
      M(
        "Gia tốc là đại lượng đặc trưng cho",
        [
          "sự thay đổi nhanh hay chậm của vận tốc",
          "sự nhanh hay chậm của chuyển động",
          "quãng đường vật đi được",
          "hướng của độ dịch chuyển",
        ],
        "Gia tốc a⃗ = Δv⃗/Δt đo độ biến thiên của vận tốc (cả độ lớn và hướng) trong một đơn vị thời gian, đơn vị m/s².",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Đơn vị của gia tốc trong hệ SI là",
        ["m/s²", "m/s", "m·s", "N·s"],
        "a = Δv/Δt có đơn vị (m/s)/s = m/s².",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Trong chuyển động thẳng nhanh dần đều, vectơ gia tốc",
        [
          "cùng chiều với vectơ vận tốc",
          "ngược chiều với vectơ vận tốc",
          "vuông góc với vectơ vận tốc",
          "bằng 0",
        ],
        "Nhanh dần: a⃗ cùng chiều v⃗ (a·v > 0); chậm dần: ngược chiều.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Công thức liên hệ giữa vận tốc, gia tốc và độ dịch chuyển trong chuyển động thẳng biến đổi đều là",
        ["v² − v₀² = 2ad", "v − v₀ = 2ad", "v² + v₀² = 2ad", "v² − v₀² = ad²"],
        "Khử t từ v = v₀ + at và d = v₀t + ½at².",
      ),
    ),
    q(
      2,
      "tn",
      M(
        "Trên đồ thị vận tốc – thời gian, diện tích hình giới hạn bởi đồ thị và trục thời gian cho biết",
        ["độ dịch chuyển của vật", "gia tốc của vật", "vận tốc trung bình", "lực tác dụng lên vật"],
        "Diện tích dưới đồ thị v–t bằng độ dịch chuyển; độ dốc bằng gia tốc.",
      ),
    ),
    q(
      2,
      "ds",
      T(
        "Một ô tô đang chạy 20 m/s thì hãm phanh, chuyển động chậm dần đều và dừng sau 5 s.",
        [
          ["Gia tốc của xe có độ lớn 4 m/s².", true],
          ["Gia tốc cùng chiều chuyển động.", false, "Chậm dần nên a⃗ ngược chiều v⃗."],
          ["Quãng đường hãm phanh là 50 m.", true, "s = v₀²/(2|a|) = 400/8 = 50 m."],
          ["Đồ thị v–t là đường thẳng dốc xuống.", true],
        ],
        "a = (v − v₀)/t = (0 − 20)/5 = −4 m/s² (a ngược dấu với v nên chậm dần); quãng đường hãm s = v₀t + ½at² = 20·5 − ½·4·25 = 50 m.",
      ),
    ),
    g(1, "tt", 5, (r) => {
      const a = r.s(0.5, 4, 0.5),
        t = r.i(4, 12);
      return N(
        `Một xe bắt đầu chuyển động nhanh dần đều từ trạng thái nghỉ với gia tốc ${v(a)} m/s². Vận tốc của xe sau ${t} s là bao nhiêu m/s?`,
        a * t,
        "m/s",
        `v = v₀ + at = 0 + ${v(a)}·${t} = ${v(a * t)} m/s.`,
      );
    }),
    g(2, "tt", 5, (r) => {
      const v0 = r.i(2, 10),
        a = r.s(0.5, 3, 0.5),
        t = r.i(4, 10);
      const d = v0 * t + 0.5 * a * t * t;
      return N(
        `Một xe đang chạy ${v0} m/s thì tăng tốc đều với gia tốc ${v(a)} m/s² trong ${t} s. Quãng đường xe đi được trong thời gian đó là bao nhiêu mét?`,
        d,
        "m",
        `d = v₀t + ½at² = ${v0}·${t} + ½·${v(a)}·${t}² = ${v(d)} m.`,
      );
    }),
    g(2, "dt", 4, (r) => {
      const v0 = r.i(0, 4) * 2,
        a = r.i(1, 4),
        T0 = r.pick([4, 5, 8]);
      const pts: [number, number][] = [
        [0, v0],
        [T0, v0 + a * T0],
      ];
      return N(
        "Đồ thị vận tốc – thời gian của một vật như hình. Gia tốc của vật là bao nhiêu m/s²?",
        a,
        "m/s²",
        `a = Δv/Δt = (${v0 + a * T0} − ${v0})/${T0} = ${a} m/s².`,
        {
          figure: {
            type: "graph",
            title: "Đồ thị v–t",
            xLabel: "t (s)",
            yLabel: "v (m/s)",
            series: [{ points: pts }],
          },
        },
      );
    }),
    g(3, "dt", 4, (r) => {
      const vm = r.i(4, 12),
        t1 = r.i(2, 5),
        t2 = r.i(3, 8),
        t3 = r.i(2, 4);
      const d = 0.5 * vm * t1 + vm * t2 + 0.5 * vm * t3;
      const pts: [number, number][] = [
        [0, 0],
        [t1, vm],
        [t1 + t2, vm],
        [t1 + t2 + t3, 0],
      ];
      return N(
        "Đồ thị v–t của một thang máy gồm 3 giai đoạn như hình. Độ dịch chuyển của thang máy trong cả quá trình là bao nhiêu mét?",
        d,
        "m",
        `Diện tích hình thang: d = ½·${vm}·${t1} + ${vm}·${t2} + ½·${vm}·${t3} = ${v(d)} m.`,
        {
          figure: {
            type: "graph",
            title: "Đồ thị v–t",
            xLabel: "t (s)",
            yLabel: "v (m/s)",
            series: [{ points: pts }],
          },
        },
      );
    }),
    g(3, "tte", 5, (r) => {
      const kmh = r.pick([36, 54, 72, 90]),
        a = r.i(4, 8),
        v0 = kmh / 3.6;
      const d = (v0 * v0) / (2 * a);
      return N(
        `Một ô tô đang chạy ${kmh} km/h thì tài xế hãm phanh, xe chậm dần đều với gia tốc có độ lớn ${a} m/s². Quãng đường hãm phanh đến khi dừng là bao nhiêu mét?`,
        d,
        "m",
        `v₀ = ${v(v0)} m/s; 0 − v₀² = 2ad ⇒ d = v₀²/(2|a|) = ${v(v0)}²/(2·${a}) ≈ ${v(d, 2)} m. Tốc độ tăng gấp đôi thì quãng đường hãm tăng gấp bốn.`,
      );
    }),
    g(4, "th", 3, (r) => {
      const a = r.s(1, 3, 0.5),
        vb = r.i(8, 15);
      const t = (2 * vb) / a;
      return N(
        `Một xe máy đứng yên bắt đầu tăng tốc đều với gia tốc ${v(a)} m/s² đúng lúc một xe đạp điện chạy thẳng đều ${vb} m/s vượt qua. Sau bao nhiêu giây xe máy đuổi kịp xe đạp điện?`,
        t,
        "s",
        `½at² = v·t ⇒ t = 2v/a = 2·${vb}/${v(a)} = ${v(t, 2)} s (khi đó xe máy có vận tốc gấp đôi xe đạp điện).`,
      );
    }),
    g(4, "th", 2, (r) => {
      const a = r.i(1, 4),
        n = r.i(3, 6);
      const d = a * (n - 0.5);
      return N(
        `Một vật bắt đầu chuyển động nhanh dần đều từ nghỉ với gia tốc ${a} m/s². Quãng đường vật đi được trong giây thứ ${n} là bao nhiêu mét?`,
        d,
        "m",
        `Δs = s(${n}) − s(${n - 1}) = ½·${a}·(${n}² − ${n - 1}²) = ${v(d)} m.`,
      );
    }),
  ],
};

function round1(x: number): number {
  return Math.round(x * 10) / 10;
}
