/**
 * Bài tập gắn với thí nghiệm / mô phỏng đang có trên website (Giai đoạn 1: cơ học lớp 10).
 * Mỗi câu khai thác đúng thông số mà mô phỏng cho phép thay đổi; các câu vận dụng cao có
 * phân tích hướng tư duy, kiến thức cần dùng và lỗi sai thường gặp.
 */
import { M, N, T, deep, exp, g, q, v, type BankItem } from "./dsl";

export const EXPERIMENT_BANK: Record<string, BankItem[]> = {
  /* ===== Mô phỏng Chuyển động tròn đều (trang chủ) ===== */
  e01: [
    exp(
      "circular-motion",
      q(
        1,
        "tn",
        M(
          "Trong chuyển động tròn đều, vectơ vận tốc của chất điểm",
          [
            "có độ lớn không đổi, phương tiếp tuyến với quỹ đạo và luôn đổi hướng",
            "không đổi cả hướng lẫn độ lớn",
            "luôn hướng vào tâm quỹ đạo",
            "có độ lớn thay đổi đều theo thời gian",
          ],
          "Tốc độ không đổi nhưng hướng vận tốc thay đổi liên tục nên chuyển động tròn đều vẫn có gia tốc.",
        ),
      ),
    ),
    exp(
      "circular-motion",
      q(
        1,
        "tn",
        M(
          "Gia tốc hướng tâm trong chuyển động tròn đều có biểu thức",
          ["a_ht = v²/r = ω²r", "a_ht = v/r", "a_ht = ω/r", "a_ht = v·r"],
          "a_ht luôn hướng vào tâm, đặc trưng cho sự đổi hướng của vận tốc.",
        ),
      ),
    ),
    exp(
      "circular-motion",
      q(
        1,
        "tn",
        M(
          "Hệ thức liên hệ giữa tốc độ dài và tốc độ góc là",
          ["v = ω·r", "v = ω/r", "ω = v·r", "v = ω·r²"],
          "Cùng tốc độ góc, điểm càng xa tâm có tốc độ dài càng lớn.",
        ),
      ),
    ),
    exp(
      "circular-motion",
      q(
        2,
        "ds",
        T(
          "Trong mô phỏng chuyển động tròn đều, giữ nguyên bán kính r và tăng tốc độ góc ω lên gấp đôi.",
          [
            ["Chu kì giảm còn một nửa.", true, "T = 2π/ω."],
            ["Tốc độ dài tăng gấp đôi.", true],
            ["Gia tốc hướng tâm tăng gấp đôi.", false, "a = ω²r tăng gấp 4."],
            ["Tần số tăng gấp đôi.", true],
          ],
          "T = 2π/ω; f = 1/T; v = ωr; a_ht = ω²r.",
        ),
      ),
    ),
    exp(
      "circular-motion",
      g(1, "tt", 5, (r) => {
        const T0 = r.pick([0.5, 2, 4, 5, 8, 10]);
        return N(
          `Trong mô phỏng, chất điểm quay đều một vòng hết ${v(T0)} s. Tốc độ góc của chất điểm là bao nhiêu rad/s?`,
          (2 * Math.PI) / T0,
          "rad/s",
          `ω = 2π/T = 2π/${v(T0)} ≈ ${v((2 * Math.PI) / T0, 3)} rad/s.`,
        );
      }),
    ),
    exp(
      "circular-motion",
      g(2, "tt", 5, (r) => {
        const om = r.s(0.5, 4, 0.5),
          R = r.s(0.5, 3, 0.5);
        return N(
          `Đặt tốc độ góc ω = ${v(om)} rad/s và bán kính quỹ đạo r = ${v(R)} m. Tốc độ dài của chất điểm là bao nhiêu m/s?`,
          om * R,
          "m/s",
          `v = ωr = ${v(om)}·${v(R)} = ${v(om * R)} m/s.`,
        );
      }),
    ),
    exp(
      "circular-motion",
      g(2, "tt", 4, (r) => {
        const om = r.s(1, 5, 0.5),
          R = r.s(0.5, 2, 0.5);
        return N(
          `Chất điểm chuyển động tròn đều với ω = ${v(om)} rad/s trên quỹ đạo bán kính ${v(R)} m. Gia tốc hướng tâm là bao nhiêu m/s²?`,
          om * om * R,
          "m/s²",
          `a_ht = ω²r = ${v(om)}²·${v(R)} = ${v(om * om * R)} m/s².`,
        );
      }),
    ),
    exp(
      "circular-motion",
      g(3, "tte", 5, (r) => {
        const kmh = r.pick([36, 54, 72]),
          R = r.pick([50, 80, 100, 125]),
          sp = kmh / 3.6,
          m = r.i(8, 15) * 100;
        return N(
          `Một ô tô khối lượng ${m} kg đi qua khúc cua tròn nằm ngang bán kính ${R} m với tốc độ không đổi ${kmh} km/h. Lực ma sát nghỉ đóng vai trò lực hướng tâm có độ lớn bao nhiêu niutơn?`,
          (m * sp * sp) / R,
          "N",
          `v = ${v(sp)} m/s; F_ht = mv²/r = ${m}·${v(sp)}²/${R} = ${v((m * sp * sp) / R, 0)} N.`,
        );
      }),
    ),
    exp(
      "circular-motion",
      g(3, "bs", 4, (r) => {
        const R = r.pick([0.2, 0.25, 0.4, 0.5]),
          n = 10,
          T0 = r.s(0.8, 2, 0.2);
        const ts = [0, 1, 2].map((k) => Math.round((n * T0 + (k - 1) * 0.1) * 10) / 10);
        const Tm = ts.reduce((s, x) => s + x, 0) / 3 / n;
        return N(
          `Một nhóm đo thời gian ${n} vòng quay của vật chuyển động tròn đều bán kính ${v(R)} m, ba lần đo ghi ở bảng. Tốc độ dài của vật là bao nhiêu m/s?`,
          (2 * Math.PI * R) / Tm,
          "m/s",
          `Thời gian trung bình ${n} vòng: ${v(Tm * n, 2)} s ⇒ T = ${v(Tm, 3)} s; v = 2πr/T ≈ ${v((2 * Math.PI * R) / Tm, 3)} m/s.`,
          {
            figure: {
              type: "table",
              caption: `Thời gian ${n} vòng`,
              headers: ["Lần đo", "1", "2", "3"],
              rows: [["t (s)", ...ts.map((x) => v(x))]],
            },
          },
        );
      }),
    ),
    exp(
      "circular-motion",
      deep(
        g(4, "th", 2, (r) => {
          const mu = r.pick([0.4, 0.5, 0.6, 0.8]),
            R = r.pick([20, 45, 80, 125]);
          const vm = Math.sqrt(mu * 10 * R);
          return N(
            `Một khúc cua tròn nằm ngang bán kính ${R} m, hệ số ma sát nghỉ giữa lốp và mặt đường là ${v(mu)}. Lấy g = 10 m/s². Tốc độ lớn nhất để xe không bị trượt khỏi cua là bao nhiêu km/h?`,
            vm * 3.6,
            "km/h",
            `Bước 1: lực hướng tâm do ma sát nghỉ cung cấp, F_ht = mv²/r ≤ μmg. Bước 2: v_max = √(μgr) = √(${v(mu)}·10·${R}) ≈ ${v(vm, 2)} m/s. Bước 3: đổi đơn vị ≈ ${v(vm * 3.6, 1)} km/h. Khối lượng xe bị triệt tiêu.`,
          );
        }),
        {
          type: "nhieu-buoc",
          thinking:
            "Xác định lực nào đóng vai trò lực hướng tâm (ma sát nghỉ), viết điều kiện giới hạn F_msn ≤ μN rồi mới thay số.",
          knowledge:
            "Lực hướng tâm F = mv²/r; ma sát nghỉ cực đại μN; N = mg trên mặt ngang; đổi m/s ↔ km/h.",
          pitfall:
            "Coi 'lực hướng tâm' là một lực mới cộng thêm vào; quên đổi đơn vị; cho rằng xe nặng hơn thì cua được nhanh hơn.",
        },
      ),
    ),
    exp(
      "circular-motion",
      deep(
        g(4, "th", 2, (r) => {
          const a = r.pick([2, 4.5, 8, 12.5]),
            R = r.pick([0.5, 2]);
          const om = Math.sqrt(a / R);
          return N(
            `Trong mô phỏng, đồng hồ gia tốc hiển thị a_ht = ${v(a)} m/s² khi bán kính quỹ đạo là ${v(R)} m. Hỏi chu kì quay đã được cài đặt là bao nhiêu giây?`,
            (2 * Math.PI) / om,
            "s",
            `Bài toán ngược: từ a_ht = ω²r ⇒ ω = √(a/r) = √(${v(a)}/${v(R)}) = ${v(om)} rad/s ⇒ T = 2π/ω ≈ ${v((2 * Math.PI) / om, 3)} s.`,
          );
        }),
        {
          type: "nguoc",
          thinking:
            "Đại lượng đề cho (a_ht, r) là kết quả; cần đi ngược về thông số cài đặt (ω rồi T).",
          knowledge: "a_ht = ω²r; T = 2π/ω.",
          pitfall: "Dùng a = v²/r nhưng quên đổi tiếp từ v sang T; lấy T = 2π·ω.",
        },
      ),
    ),
    exp(
      "circular-motion",
      deep(
        q(
          4,
          "th",
          M(
            "Một bạn giải: 'Vật chuyển động tròn đều có tốc độ không đổi nên gia tốc bằng 0, do đó hợp lực tác dụng lên vật bằng 0.' Nhận xét nào chỉ ra đúng lỗi sai?",
            [
              "Tốc độ không đổi nhưng hướng vận tốc đổi liên tục nên có gia tốc hướng tâm; hợp lực khác 0 và hướng vào tâm",
              "Lời giải đúng vì gia tốc chỉ phụ thuộc độ lớn vận tốc",
              "Sai vì hợp lực phải hướng theo tiếp tuyến quỹ đạo",
              "Sai vì trong chuyển động tròn đều tốc độ luôn tăng",
            ],
            "Gia tốc đo sự biến thiên của vectơ vận tốc. Hướng thay đổi ⇒ a_ht = v²/r ≠ 0 ⇒ F_ht = m·a_ht hướng vào tâm.",
          ),
        ),
        {
          type: "sua-loi",
          thinking:
            "Tách bạch 'tốc độ' (độ lớn) với 'vận tốc' (vectơ); kiểm tra từng mắt xích suy luận của lời giải.",
          knowledge: "Định nghĩa gia tốc a⃗ = Δv⃗/Δt; định luật II Newton.",
          pitfall: "Đồng nhất tốc độ không đổi với vận tốc không đổi.",
        },
      ),
    ),
    exp(
      "circular-motion",
      deep(
        q(
          4,
          "tng",
          M(
            "Cần kiểm chứng a_ht tỉ lệ với ω² bằng mô phỏng chuyển động tròn đều. Phương án nào hợp lí nhất?",
            [
              "Giữ nguyên r, thay đổi ω nhiều giá trị, ghi a_ht rồi vẽ đồ thị a_ht theo ω² và kiểm tra có là đường thẳng qua gốc toạ độ",
              "Thay đổi đồng thời r và ω rồi so sánh a_ht",
              "Giữ nguyên ω, thay đổi r rồi vẽ đồ thị a_ht theo ω²",
              "Chỉ đo một cặp giá trị (ω, a_ht) rồi thay vào công thức",
            ],
            "Nguyên tắc kiểm soát biến: chỉ đổi ω, giữ r. Tuyến tính hoá: nếu a_ht = r·ω² thì đồ thị a_ht–ω² là đường thẳng qua gốc với hệ số góc bằng r.",
          ),
        ),
        {
          type: "thiet-ke",
          thinking:
            "Xác định biến độc lập (ω), biến phụ thuộc (a_ht), biến cần giữ cố định (r) và cách xử lí số liệu để lộ ra quan hệ tỉ lệ.",
          knowledge: "a_ht = ω²r; phương pháp tuyến tính hoá đồ thị; kiểm soát biến.",
          pitfall: "Thay đổi nhiều thông số cùng lúc; kết luận quy luật từ một phép đo duy nhất.",
        },
      ),
    ),
  ],

  /* ===== Phòng Lab «Cơ học — ném xiên» và Thiết kế thí nghiệm «đo g bằng rơi tự do» ===== */
  e02: [
    exp(
      "free-fall-g",
      deep(
        g(4, "bs", 2, (r) => {
          const gv = r.pick([9.6, 9.8, 10]);
          const hs = [0.2, 0.4, 0.6, 0.8];
          const t2 = hs.map((h) => Math.round(((2 * h) / gv) * 1000) / 1000);
          const slope = (hs[3]! - hs[0]!) / (t2[3]! - t2[0]!);
          return N(
            "Trong thí nghiệm đo g ở trang Thiết kế thí nghiệm, nhóm học sinh thả vật từ các độ cao h và ghi bình phương thời gian rơi t² như bảng. Từ độ dốc của đồ thị h theo t², hãy tính g (m/s²).",
            2 * slope,
            "m/s²",
            `h = ½g·t² ⇒ đồ thị h–t² là đường thẳng qua gốc có độ dốc k = ½g. Lấy hai điểm đầu và cuối: k = (${v(hs[3]!)} − ${v(hs[0]!)})/(${v(t2[3]!, 3)} − ${v(t2[0]!, 3)}) ≈ ${v(slope, 3)} m/s² ⇒ g = 2k ≈ ${v(2 * slope, 2)} m/s².`,
            {
              relTol: 0.03,
              figure: {
                type: "table",
                caption: "Số liệu rơi tự do",
                headers: ["h (m)", ...hs.map((h) => v(h))],
                rows: [["t² (s²)", ...t2.map((x) => v(x, 3))]],
              },
            },
          );
        }),
        {
          type: "so-lieu",
          thinking:
            "Không tính g từ từng cặp số rồi lấy trung bình mà tuyến tính hoá h theo t², dùng độ dốc để giảm ảnh hưởng sai số từng điểm.",
          knowledge: "h = ½gt²; ý nghĩa độ dốc của đồ thị tuyến tính.",
          pitfall: "Lấy độ dốc làm g (quên hệ số ½); vẽ h theo t rồi coi là đường thẳng.",
        },
      ),
    ),
    exp(
      "free-fall-g",
      deep(
        q(
          4,
          "tng",
          M(
            "Khi đo g bằng cách bấm đồng hồ thủ công thời gian rơi từ độ cao 1 m (t ≈ 0,45 s), kết quả thường sai lệch lớn. Nguyên nhân chính và cách cải thiện hợp lí nhất là",
            [
              "Thời gian phản xạ của người (~0,1–0,2 s) so sánh được với t; nên dùng cổng quang điện và tăng độ cao rơi",
              "Thước đo độ cao sai 1 mm; nên dùng thước chính xác hơn",
              "Khối lượng vật quá nhỏ; nên dùng vật nặng hơn nhiều",
              "Gia tốc g thay đổi trong lúc rơi; nên đo ở nơi khác",
            ],
            "δg = δh + 2δt. Với Δt ≈ 0,1 s thì δt ≈ 22% ⇒ δg ≈ 44%, lớn hơn rất nhiều so với sai số đo độ cao (0,1%). Cần giảm Δt (cổng quang) và tăng t (tăng h).",
          ),
        ),
        {
          type: "sai-so",
          thinking:
            "So sánh đóng góp của từng nguồn sai số vào sai số tỉ đối của g; đại lượng có số mũ 2 và sai số tỉ đối lớn nhất quyết định.",
          knowledge: "g = 2h/t²; δg = δh + 2δt; phân biệt sai số hệ thống/ngẫu nhiên.",
          pitfall:
            "Chỉ chú ý độ chính xác của thước mà bỏ qua sai số thời gian; cho rằng vật nặng rơi nhanh hơn.",
        },
      ),
    ),
    exp(
      "co-hoc",
      deep(
        g(4, "th", 2, (r) => {
          const L = r.pick([40, 90, 160]),
            al = 45;
          const v0 = Math.sqrt((L * 10) / Math.sin((2 * al * Math.PI) / 180));
          return N(
            `Trong Phòng Lab cơ học (ném xiên, g = 10 m/s², bỏ qua sức cản), một học sinh muốn vật rơi đúng mục tiêu cách điểm ném ${L} m trên mặt đất với góc ném ${al}°. Phải đặt tốc độ ban đầu bao nhiêu m/s?`,
            v0,
            "m/s",
            `Bài toán ngược: L = v₀² sin2α/g ⇒ v₀ = √(Lg/sin2α) = √(${L}·10/sin90°) = ${v(v0, 2)} m/s.`,
          );
        }),
        {
          type: "nguoc",
          thinking:
            "Tầm xa là kết quả mong muốn; biến đổi công thức tầm xa để tìm thông số đầu vào v₀.",
          knowledge: "L = v₀² sin2α/g; giá trị lượng giác của góc đặc biệt.",
          pitfall: "Dùng sinα thay cho sin2α; quên khai căn.",
        },
      ),
    ),
    exp(
      "co-hoc",
      deep(
        q(
          4,
          "tte",
          M(
            "Một cầu thủ sút phạt từ mặt sân với cùng tốc độ ban đầu. Bỏ qua sức cản, muốn bóng bay tới cùng một vị trí trên sân trong thời gian ngắn nhất để thủ môn khó phản ứng, cầu thủ nên chọn",
            [
              "góc nhỏ hơn trong hai góc ném phụ nhau (ví dụ 30° thay vì 60°)",
              "góc lớn hơn trong hai góc ném phụ nhau",
              "đúng 45° trong mọi trường hợp",
              "góc 90°",
            ],
            "Hai góc α và 90° − α cho cùng tầm xa. Thời gian bay t = 2v₀sinα/g nhỏ hơn với góc nhỏ hơn, bóng bay thấp và nhanh tới đích hơn.",
          ),
        ),
        {
          type: "thuc-tien",
          thinking:
            "Nhận ra có hai nghiệm góc cho cùng tầm xa rồi so sánh thêm một đại lượng khác (thời gian bay) để ra quyết định.",
          knowledge: "L = v₀² sin2α/g; t = 2v₀ sinα/g.",
          pitfall: "Cho rằng 45° luôn là lựa chọn tốt nhất dù mục tiêu ở gần hơn tầm xa cực đại.",
        },
      ),
    ),
    exp(
      "co-hoc",
      deep(
        g(4, "dt", 2, (r) => {
          const vy0 = r.pick([10, 20, 30]),
            vx = r.pick([5, 10, 15]);
          const pts: [number, number][] = [
            [0, vy0],
            [vy0 / 10, 0],
            [vy0 / 5, -vy0],
          ];
          return N(
            `Đồ thị thành phần vận tốc thẳng đứng v_y theo thời gian của một vật ném xiên như hình; thành phần ngang không đổi v_x = ${vx} m/s. Tầm xa của vật là bao nhiêu mét?`,
            vx * (vy0 / 5),
            "m",
            `Đồ thị cắt trục t tại ${v(vy0 / 10)} s (đỉnh quỹ đạo) ⇒ thời gian bay ${v(vy0 / 5)} s (đối xứng). L = v_x·t = ${vx}·${v(vy0 / 5)} = ${v(vx * (vy0 / 5))} m. Độ dốc đồ thị bằng −g = −10 m/s².`,
            {
              figure: {
                type: "graph",
                title: "Đồ thị v_y – t",
                xLabel: "t (s)",
                yLabel: "v_y (m/s)",
                series: [{ points: pts }],
              },
            },
          );
        }),
        {
          type: "do-thi",
          thinking:
            "Đọc ý nghĩa điểm cắt trục thời gian (v_y = 0 ⇒ đỉnh) và tính đối xứng để suy ra thời gian bay; kết hợp chuyển động đều theo phương ngang.",
          knowledge: "Phân tích chuyển động ném thành hai thành phần độc lập; v_y = v₀y − gt.",
          pitfall:
            "Lấy thời điểm v_y = 0 làm thời gian bay toàn bộ; dùng diện tích dưới đồ thị v_y làm tầm xa.",
        },
      ),
    ),
    exp(
      "co-hoc",
      deep(
        q(
          4,
          "th",
          M(
            "Một vật được ném xiên từ mặt đất. Tại điểm cao nhất của quỹ đạo, tỉ số giữa động năng và cơ năng ban đầu của vật bằng (bỏ qua sức cản, mốc thế năng tại mặt đất, góc ném α)",
            ["cos²α", "sin²α", "1", "0"],
            "Ở đỉnh chỉ còn v_x = v₀cosα nên W_đ = ½m(v₀cosα)². Cơ năng bảo toàn W = ½mv₀² ⇒ tỉ số = cos²α. Kết hợp động học (chuyển động ném) với năng lượng.",
          ),
        ),
        {
          type: "lien-chuong",
          thinking:
            "Dùng kết quả động học (vận tốc ở đỉnh chỉ còn thành phần ngang) rồi chuyển sang ngôn ngữ năng lượng.",
          knowledge: "Chuyển động ném; động năng; bảo toàn cơ năng.",
          pitfall: "Cho rằng ở đỉnh vận tốc bằng 0 nên động năng bằng 0.",
        },
      ),
    ),
  ],
};

/** Nhóm bài tập theo thí nghiệm (không thuộc cây 46 bài học). */
export const EXPERIMENT_SETS = [
  {
    code: "e01",
    key: "thi-nghiem/chuyen-dong-tron-deu",
    grade: "Lớp 10",
    name: "Thí nghiệm: Chuyển động tròn đều",
    experiment: "circular-motion",
    href: "/",
  },
  {
    code: "e02",
    key: "thi-nghiem/roi-tu-do-va-nem-xien",
    grade: "Lớp 10",
    name: "Thí nghiệm: Rơi tự do & ném xiên (VDC)",
    experiment: "co-hoc",
    href: "/mo-phong",
  },
] as const;
