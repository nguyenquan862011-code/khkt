/** Lớp 10 — Rơi tự do, chuyển động ném và Chủ đề 3 (lực và chuyển động). */
import { M, N, NM, S, T, g, q, v, type BankItem } from "./dsl";

const rad = (deg: number) => (deg * Math.PI) / 180;

export const LOP10B: Record<string, BankItem[]> = {
  /* ===== Bài 5 - Sự rơi tự do ===== */
  b08: [
    q(
      1,
      "tn",
      M(
        "Sự rơi tự do là sự rơi",
        [
          "chỉ dưới tác dụng của trọng lực",
          "trong không khí của mọi vật",
          "có vận tốc không đổi",
          "chỉ của các vật nặng",
        ],
        "Rơi tự do: chỉ chịu tác dụng của trọng lực (bỏ qua sức cản).",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Chuyển động rơi tự do là chuyển động",
        [
          "thẳng nhanh dần đều theo phương thẳng đứng",
          "thẳng đều",
          "thẳng chậm dần đều",
          "tròn đều",
        ],
        "Phương thẳng đứng, chiều từ trên xuống, gia tốc g không đổi.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Tại cùng một nơi trên Trái Đất và gần mặt đất, các vật rơi tự do",
        [
          "với cùng một gia tốc g",
          "với gia tốc tỉ lệ khối lượng",
          "với gia tốc tỉ lệ nghịch khối lượng",
          "với vận tốc không đổi",
        ],
        "g không phụ thuộc khối lượng của vật.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Công thức tính vận tốc của vật rơi tự do (không vận tốc đầu) sau thời gian t là",
        ["v = gt", "v = ½gt²", "v = g/t", "v = 2gt"],
        "Rơi tự do là chuyển động nhanh dần đều với gia tốc g; từ v = v₀ + gt với v₀ = 0 suy ra v = gt.",
      ),
    ),
    q(
      2,
      "tn",
      M(
        "Thả hai viên bi sắt có khối lượng khác nhau từ cùng một độ cao (bỏ qua sức cản không khí). Kết luận đúng là",
        [
          "hai viên bi chạm đất cùng lúc",
          "viên nặng chạm đất trước",
          "viên nhẹ chạm đất trước",
          "không so sánh được",
        ],
        "t = √(2h/g) không phụ thuộc khối lượng.",
      ),
    ),
    q(
      2,
      "ds",
      T(
        "Một vật rơi tự do không vận tốc đầu, lấy g = 10 m/s².",
        [
          ["Sau 2 s vật có vận tốc 20 m/s.", true],
          ["Trong 2 s đầu vật rơi được 40 m.", false, "h = ½·10·2² = 20 m."],
          [
            "Quãng đường rơi trong giây thứ hai lớn hơn trong giây thứ nhất.",
            true,
            "15 m so với 5 m.",
          ],
          ["Gia tốc của vật tăng dần trong khi rơi.", false, "g không đổi."],
        ],
        "Rơi tự do không vận tốc đầu là chuyển động nhanh dần đều với a = g: v = gt, h = ½gt²; quãng đường trong giây thứ n bằng hiệu h(n) − h(n−1).",
      ),
    ),
    q(
      2,
      "tte",
      M(
        "Tờ giấy phẳng rơi chậm hơn viên sỏi trong không khí chủ yếu vì",
        [
          "lực cản không khí lên tờ giấy đáng kể so với trọng lượng của nó",
          "tờ giấy nhẹ hơn nên gia tốc trọng trường nhỏ hơn",
          "viên sỏi hút Trái Đất mạnh hơn",
          "tờ giấy không chịu tác dụng của trọng lực",
        ],
        "Vo tròn tờ giấy lại thì nó rơi gần như cùng lúc với viên sỏi.",
      ),
    ),
    g(1, "tt", 5, (r) => {
      const t = r.s(1, 5, 0.5);
      return N(
        `Một vật rơi tự do không vận tốc đầu, lấy g = 10 m/s². Vận tốc của vật sau ${v(t)} s là bao nhiêu m/s?`,
        10 * t,
        "m/s",
        `v = gt = 10·${v(t)} = ${v(10 * t)} m/s.`,
      );
    }),
    g(2, "tt", 5, (r) => {
      const t = r.s(1, 4, 0.5),
        h = 4.9 * t * t;
      return N(
        `Một viên đá được thả rơi tự do từ miệng giếng và chạm mặt nước sau ${v(t)} s. Lấy g = 9,8 m/s². Độ sâu từ miệng giếng đến mặt nước là bao nhiêu mét?`,
        h,
        "m",
        `h = ½gt² = ½·9,8·${v(t)}² = ${v(h, 2)} m.`,
      );
    }),
    g(3, "tt", 5, (r) => {
      const h = r.pick([5, 20, 45, 80, 125, 180]);
      return N(
        `Một vật rơi tự do từ độ cao ${h} m, lấy g = 10 m/s². Vận tốc của vật ngay trước khi chạm đất là bao nhiêu m/s?`,
        Math.sqrt(20 * h),
        "m/s",
        `v = √(2gh) = √(2·10·${h}) = ${v(Math.sqrt(20 * h))} m/s.`,
      );
    }),
    g(3, "tng", 4, (r) => {
      const h = r.s(0.4, 1.2, 0.1),
        t = Math.round(Math.sqrt((2 * h) / 9.8) * 1000) / 1000;
      const gv = (2 * h) / (t * t);
      return N(
        `Trong thí nghiệm đo gia tốc rơi tự do, viên bi thép rơi quãng đường ${v(h)} m giữa hai cổng quang (từ trạng thái nghỉ) hết ${v(t, 3)} s. Giá trị g đo được là bao nhiêu m/s²?`,
        gv,
        "m/s²",
        `g = 2h/t² = 2·${v(h)}/${v(t, 3)}² ≈ ${v(gv, 2)} m/s².`,
        { relTol: 0.01 },
      );
    }),
    g(4, "th", 3, (r) => {
      const T0 = r.i(3, 6),
        h = 5 * T0 * T0,
        last = h - 5 * (T0 - 1) * (T0 - 1);
      return N(
        `Một vật rơi tự do từ độ cao ${h} m, lấy g = 10 m/s². Quãng đường vật rơi được trong giây cuối cùng là bao nhiêu mét?`,
        last,
        "m",
        `Thời gian rơi t = √(2h/g) = ${T0} s. Quãng đường trong ${T0 - 1} s đầu: ${5 * (T0 - 1) * (T0 - 1)} m ⇒ giây cuối: ${h} − ${5 * (T0 - 1) * (T0 - 1)} = ${last} m.`,
      );
    }),
    g(4, "th", 2, (r) => {
      const dt = r.pick([0.5, 1]),
        t = r.i(2, 4);
      const gap = 5 * (t + dt) * (t + dt) - 5 * t * t;
      return N(
        `Hai giọt nước rơi tự do từ cùng một mái nhà, giọt sau rơi muộn hơn giọt trước ${v(dt)} s. Lấy g = 10 m/s². Khi giọt sau đã rơi được ${t} s, khoảng cách giữa hai giọt là bao nhiêu mét?`,
        gap,
        "m",
        `Δh = ½g[(t+Δt)² − t²] = 5·(${v(t + dt)}² − ${t}²) = ${v(gap)} m. Khoảng cách tăng dần theo thời gian.`,
      );
    }),
  ],

  /* ===== Bài 6 - Chuyển động ném ===== */
  b09: [
    q(
      1,
      "tn",
      M(
        "Bỏ qua sức cản không khí, quỹ đạo của vật bị ném ngang là",
        ["một nhánh parabol", "một đường thẳng", "một cung tròn", "một đường hypebol"],
        "Kết hợp chuyển động đều theo phương ngang và rơi tự do theo phương thẳng đứng.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Trong chuyển động ném ngang, thành phần chuyển động theo phương ngang là",
        [
          "chuyển động thẳng đều",
          "chuyển động nhanh dần đều",
          "rơi tự do",
          "chuyển động chậm dần đều",
        ],
        "Theo phương ngang không có lực tác dụng (bỏ qua sức cản).",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Thời gian rơi của vật ném ngang từ độ cao h là",
        ["t = √(2h/g)", "t = 2h/g", "t = √(h/2g)", "t = v₀/g"],
        "Giống thời gian rơi tự do từ cùng độ cao, không phụ thuộc v₀.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Với cùng tốc độ ném v₀ (bỏ qua sức cản), tầm xa của vật ném xiên từ mặt đất lớn nhất khi góc ném bằng",
        ["45°", "30°", "60°", "90°"],
        "L = v₀² sin2α/g lớn nhất khi sin2α = 1.",
      ),
    ),
    q(
      2,
      "tn",
      M(
        "Từ cùng một độ cao, viên bi A được thả rơi tự do, viên bi B được ném ngang cùng lúc. Bỏ qua sức cản không khí thì",
        [
          "hai viên bi chạm đất cùng lúc",
          "A chạm đất trước",
          "B chạm đất trước",
          "tuỳ thuộc tốc độ ném của B",
        ],
        "Chuyển động theo phương thẳng đứng của hai bi giống hệt nhau.",
      ),
    ),
    q(
      2,
      "ds",
      T(
        "Một vật được ném xiên từ mặt đất, bỏ qua sức cản không khí.",
        [
          ["Tại điểm cao nhất, vận tốc của vật bằng 0.", false, "Vẫn còn thành phần ngang v₀cosα."],
          ["Gia tốc của vật luôn bằng g hướng xuống.", true],
          ["Hai góc ném 30° và 60° cho cùng tầm xa.", true, "sin60° = sin120°."],
          ["Thời gian đi lên bằng thời gian đi xuống.", true],
        ],
        "Chuyển động ném xiên đối xứng qua đỉnh quỹ đạo.",
      ),
    ),
    q(
      2,
      "tte",
      M(
        "Máy bay cứu trợ bay ngang muốn thả hàng trúng mục tiêu phải thả",
        [
          "trước khi bay tới phía trên mục tiêu",
          "đúng lúc ở ngay phía trên mục tiêu",
          "sau khi bay qua mục tiêu",
          "lúc nào cũng được",
        ],
        "Gói hàng giữ vận tốc ngang của máy bay nên tiếp tục bay về phía trước trong khi rơi.",
      ),
    ),
    g(1, "tt", 5, (r) => {
      const h = r.pick([5, 20, 45, 80, 125]);
      return N(
        `Một vật được ném ngang từ độ cao ${h} m, lấy g = 10 m/s². Thời gian chuyển động của vật đến khi chạm đất là bao nhiêu giây?`,
        Math.sqrt(h / 5),
        "s",
        `t = √(2h/g) = √(2·${h}/10) = ${v(Math.sqrt(h / 5))} s.`,
      );
    }),
    g(2, "tt", 5, (r) => {
      const h = r.pick([5, 20, 45, 80]),
        v0 = r.i(4, 20),
        t = Math.sqrt(h / 5);
      return N(
        `Một quả bóng được ném ngang với tốc độ ${v0} m/s từ độ cao ${h} m, lấy g = 10 m/s². Tầm xa của quả bóng là bao nhiêu mét?`,
        v0 * t,
        "m",
        `t = √(2h/g) = ${v(t)} s; L = v₀t = ${v0}·${v(t)} = ${v(v0 * t)} m.`,
      );
    }),
    g(3, "tt", 4, (r) => {
      const h = r.pick([20, 45, 80]),
        v0 = r.pick([10, 15, 20, 30, 40]),
        vy = Math.sqrt(20 * h);
      const sp = Math.sqrt(v0 * v0 + vy * vy);
      return N(
        `Một vật được ném ngang với tốc độ ${v0} m/s từ độ cao ${h} m, lấy g = 10 m/s². Tốc độ của vật ngay trước khi chạm đất là bao nhiêu m/s?`,
        sp,
        "m/s",
        `v_y = √(2gh) = ${v(vy)} m/s; v = √(v₀² + v_y²) = √(${v0}² + ${v(vy)}²) ≈ ${v(sp, 2)} m/s.`,
      );
    }),
    g(3, "tt", 4, (r) => {
      const v0 = r.pick([10, 20, 30, 40]),
        al = r.pick([30, 45, 60]);
      const L = (v0 * v0 * Math.sin(rad(2 * al))) / 10;
      return N(
        `Một quả bóng được đá từ mặt đất với tốc độ ${v0} m/s theo phương hợp với phương ngang góc ${al}°. Bỏ qua sức cản, lấy g = 10 m/s². Tầm xa của quả bóng là bao nhiêu mét?`,
        L,
        "m",
        `L = v₀² sin2α/g = ${v0}²·sin${2 * al}°/10 ≈ ${v(L, 2)} m.`,
      );
    }),
    g(3, "tt", 2, (r) => {
      const v0 = r.pick([10, 20, 30]),
        al = r.pick([30, 45, 60]);
      const H = (v0 * v0 * Math.sin(rad(al)) ** 2) / 20;
      return N(
        `Một vật được ném xiên từ mặt đất với tốc độ ${v0} m/s, góc ném ${al}°. Lấy g = 10 m/s². Độ cao cực đại vật đạt được là bao nhiêu mét?`,
        H,
        "m",
        `H = v₀² sin²α/(2g) = ${v0}²·sin²${al}°/20 ≈ ${v(H, 2)} m.`,
      );
    }),
    g(4, "th", 3, (r) => {
      const d = r.pick([10, 15, 20]),
        v0 = r.pick([20, 25]),
        al = 45;
      const vx = v0 * Math.cos(rad(al)),
        t = d / vx,
        y = v0 * Math.sin(rad(al)) * t - 5 * t * t;
      return N(
        `Một cầu thủ sút bóng từ mặt đất với tốc độ ${v0} m/s, góc ${al}° về phía bức tường cách ${d} m. Lấy g = 10 m/s². Bóng chạm tường ở độ cao bao nhiêu mét?`,
        y,
        "m",
        `v_x = v₀cos45° ≈ ${v(vx, 2)} m/s ⇒ t = ${d}/${v(vx, 2)} ≈ ${v(t, 3)} s; y = v₀sin45°·t − ½gt² ≈ ${v(y, 2)} m.`,
      );
    }),
    g(4, "tng", 2, (r) => {
      const h = r.pick([0.8, 1.25, 0.45]),
        L = r.s(0.6, 1.5, 0.1),
        t = Math.sqrt(h / 5);
      return N(
        `Một viên bi lăn khỏi mép bàn cao ${v(h)} m và rơi xuống sàn tại điểm cách chân bàn ${v(L)} m theo phương ngang. Lấy g = 10 m/s². Tốc độ của bi khi rời mép bàn là bao nhiêu m/s?`,
        L / t,
        "m/s",
        `t = √(2h/g) = ${v(t)} s; v₀ = L/t = ${v(L)}/${v(t)} ≈ ${v(L / t, 2)} m/s. Đây là cách đo tốc độ đầu bằng thước, không cần đồng hồ.`,
      );
    }),
  ],

  /* ===== Bài 1 (CĐ3) - Tổng hợp và phân tích lực ===== */
  b10: [
    q(
      1,
      "tn",
      M(
        "Tổng hợp lực là",
        [
          "thay thế các lực tác dụng đồng thời vào vật bằng một lực có tác dụng giống hệt",
          "thay thế một lực bằng hai lực thành phần",
          "cộng độ lớn của các lực",
          "tìm lực lớn nhất trong các lực",
        ],
        "Lực thay thế gọi là hợp lực; phép ngược lại là phân tích lực.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Hai lực đồng quy được tổng hợp theo quy tắc",
        ["hình bình hành", "bàn tay trái", "nắm tay phải", "moment lực"],
        "F⃗ = F⃗₁ + F⃗₂ là đường chéo hình bình hành.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Hai lực cùng phương, cùng chiều có độ lớn F₁ và F₂ thì hợp lực có độ lớn",
        ["F₁ + F₂", "|F₁ − F₂|", "√(F₁² + F₂²)", "F₁·F₂"],
        "Cùng chiều thì cộng độ lớn; ngược chiều thì trừ.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Điều kiện cân bằng của một chất điểm là",
        [
          "hợp lực của các lực tác dụng lên nó bằng 0",
          "các lực tác dụng có độ lớn bằng nhau",
          "chỉ có một lực tác dụng",
          "các lực cùng chiều",
        ],
        "Chất điểm cân bằng khi hợp lực của tất cả các lực tác dụng lên nó bằng không: ΣF⃗ = 0⃗ (khi đó gia tốc bằng 0).",
      ),
    ),
    q(
      2,
      "tn",
      M(
        "Hai lực đồng quy có độ lớn 6 N và 8 N. Hợp lực KHÔNG thể có độ lớn nào sau đây?",
        ["15 N", "2 N", "10 N", "14 N"],
        "|F₁ − F₂| ≤ F ≤ F₁ + F₂ ⇒ 2 N ≤ F ≤ 14 N.",
      ),
    ),
    q(
      2,
      "ds",
      T(
        "Một vật có trọng lượng P nằm yên trên mặt phẳng nghiêng góc α.",
        [
          ["Thành phần của trọng lực song song mặt nghiêng có độ lớn P·sinα.", true],
          ["Thành phần vuông góc mặt nghiêng có độ lớn P·cosα.", true],
          [
            "Góc nghiêng càng lớn thì thành phần ép lên mặt nghiêng càng lớn.",
            false,
            "P·cosα giảm khi α tăng.",
          ],
          ["Phân tích lực phải dựa vào tác dụng cụ thể của lực theo hai phương.", true],
        ],
        "Phân tích trọng lực theo hai phương: P∥ = P·sinα dọc mặt nghiêng (cân bằng với ma sát nghỉ) và P⊥ = P·cosα vuông góc mặt nghiêng (cân bằng với phản lực N).",
      ),
    ),
    g(1, "tt", 4, (r) => {
      const a = r.i(3, 12),
        b = r.i(3, 12);
      return N(
        `Hai lực cùng phương, ngược chiều có độ lớn ${a + b} N và ${a} N. Hợp lực của chúng có độ lớn bao nhiêu niutơn?`,
        b,
        "N",
        `F = |F₁ − F₂| = ${a + b} − ${a} = ${b} N, cùng chiều lực lớn hơn.`,
      );
    }),
    g(2, "tt", 5, (r) => {
      const [a, b, c] = r.pick([
        [3, 4, 5],
        [6, 8, 10],
        [5, 12, 13],
        [9, 12, 15],
        [8, 15, 17],
        [12, 16, 20],
      ] as const);
      return N(
        `Hai lực đồng quy vuông góc với nhau có độ lớn ${a} N và ${b} N. Hợp lực có độ lớn bao nhiêu niutơn?`,
        c,
        "N",
        `F = √(F₁² + F₂²) = √(${a}² + ${b}²) = ${c} N.`,
      );
    }),
    g(3, "tt", 5, (r) => {
      const f = r.i(4, 20),
        al = r.pick([60, 120, 90]);
      const res = 2 * f * Math.cos(rad(al / 2));
      return N(
        `Hai lực đồng quy có cùng độ lớn ${f} N, hợp với nhau góc ${al}°. Hợp lực có độ lớn bao nhiêu niutơn?`,
        res,
        "N",
        `F = 2F₁cos(α/2) = 2·${f}·cos${al / 2}° ≈ ${v(res, 2)} N.`,
      );
    }),
    g(3, "tt", 5, (r) => {
      const m = r.i(2, 20),
        al = r.pick([30, 45, 60]);
      const p = m * 10 * Math.sin(rad(al));
      return N(
        `Một thùng hàng khối lượng ${m} kg đặt trên mặt phẳng nghiêng ${al}° so với phương ngang, lấy g = 10 m/s². Thành phần trọng lực kéo thùng trượt xuống dọc mặt nghiêng có độ lớn bao nhiêu niutơn?`,
        p,
        "N",
        `P∥ = mg·sinα = ${m}·10·sin${al}° ≈ ${v(p, 2)} N.`,
      );
    }),
    g(4, "th", 5, (r) => {
      const m = r.i(2, 12),
        th = r.pick([30, 45, 60]);
      const t = (m * 10) / (2 * Math.cos(rad(th)));
      return N(
        `Một đèn khối lượng ${m} kg được treo bằng hai dây đối xứng, mỗi dây hợp với phương thẳng đứng góc ${th}°. Lấy g = 10 m/s². Lực căng của mỗi dây là bao nhiêu niutơn?`,
        t,
        "N",
        `Cân bằng theo phương thẳng đứng: 2T·cos${th}° = mg ⇒ T = ${m * 10}/(2cos${th}°) ≈ ${v(t, 2)} N. Dây càng căng ngang thì lực căng càng lớn.`,
      );
    }),
    q(
      3,
      "tte",
      M(
        "Khi phơi quần áo, nếu căng dây phơi thật thẳng thì dây rất dễ đứt vì",
        [
          "góc giữa hai nửa dây gần 180° nên lực căng phải rất lớn mới cân bằng được trọng lượng",
          "trọng lượng quần áo tăng lên",
          "dây thẳng thì không chịu lực",
          "lực căng luôn bằng nửa trọng lượng",
        ],
        "T = P/(2cosθ) với θ gần 90° thì cosθ rất nhỏ ⇒ T rất lớn.",
      ),
    ),
    q(
      2,
      "tln",
      S(
        "Phép thay thế một lực bằng hai lực thành phần có tác dụng giống hệt lực đó gọi là gì? (3 chữ)",
        ["phân tích lực"],
        "Phân tích lực là phép làm ngược của tổng hợp lực.",
      ),
    ),
  ],

  /* ===== Bài 2 (CĐ3) - Ba định luật Newton ===== */
  b11: [
    q(
      1,
      "tn",
      M(
        "Theo định luật I Newton, nếu không chịu tác dụng của lực nào hoặc hợp lực bằng 0 thì vật",
        [
          "giữ nguyên trạng thái đứng yên hoặc chuyển động thẳng đều",
          "luôn đứng yên",
          "chuyển động chậm dần rồi dừng lại",
          "chuyển động nhanh dần đều",
        ],
        "Đây là định luật quán tính.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Đại lượng đặc trưng cho mức quán tính của vật là",
        ["khối lượng", "vận tốc", "trọng lượng", "gia tốc"],
        "Khối lượng càng lớn, vật càng khó thay đổi vận tốc.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Biểu thức của định luật II Newton là",
        ["a⃗ = F⃗/m", "a⃗ = m·F⃗", "F⃗ = m/a⃗", "a⃗ = m/F⃗"],
        "Gia tốc cùng hướng với lực, tỉ lệ thuận với lực và tỉ lệ nghịch với khối lượng.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Cặp lực và phản lực trong định luật III Newton",
        [
          "tác dụng vào hai vật khác nhau, cùng giá, ngược chiều, cùng độ lớn",
          "tác dụng vào cùng một vật và cân bằng nhau",
          "cùng chiều, cùng độ lớn",
          "có độ lớn khác nhau tuỳ khối lượng",
        ],
        "Lực và phản lực không cân bằng nhau vì đặt vào hai vật khác nhau.",
      ),
    ),
    q(
      2,
      "tte",
      M(
        "Khi xe buýt đang chạy thì phanh gấp, hành khách bị ngả người về phía trước là do",
        ["quán tính", "lực đẩy của ghế", "trọng lực", "phản lực của sàn xe"],
        "Phần thân trên có xu hướng giữ nguyên vận tốc cũ.",
      ),
    ),
    q(
      2,
      "ds",
      T(
        "Một người đứng trên ván trượt đẩy tay vào tường.",
        [
          ["Tường tác dụng lên người một lực ngược chiều lực đẩy.", true],
          [
            "Lực của tường lên người nhỏ hơn lực người đẩy tường.",
            false,
            "Hai lực luôn bằng nhau về độ lớn.",
          ],
          ["Người chuyển động lùi ra xa tường.", true],
          [
            "Hai lực này triệt tiêu nhau nên người đứng yên.",
            false,
            "Hai lực đặt vào hai vật khác nhau nên không triệt tiêu.",
          ],
        ],
        "Theo định luật III Newton, tay đẩy tường một lực thì tường đẩy lại tay một lực cùng giá, cùng độ lớn, ngược chiều; hai lực này đặt vào hai vật khác nhau nên không cân bằng nhau, và chính lực của tường làm người chuyển động.",
      ),
    ),
    q(
      2,
      "lm",
      M(
        "Dây đai an toàn và túi khí trên ô tô bảo vệ người ngồi trong xe khi va chạm chủ yếu nhờ",
        [
          "kéo dài thời gian giảm vận tốc nên giảm lực tác dụng lên cơ thể",
          "làm tăng khối lượng của người",
          "làm xe dừng nhanh hơn",
          "triệt tiêu quán tính của người",
        ],
        "F = m·Δv/Δt: Δt lớn hơn ⇒ lực nhỏ hơn (Vật lí – An toàn giao thông – Sinh học).",
      ),
    ),
    g(1, "tt", 5, (r) => {
      const m = r.i(2, 20),
        a = r.s(0.5, 4, 0.5);
      return N(
        `Một vật khối lượng ${m} kg chuyển động với gia tốc ${v(a)} m/s². Hợp lực tác dụng lên vật có độ lớn bao nhiêu niutơn?`,
        m * a,
        "N",
        `F = ma = ${m}·${v(a)} = ${v(m * a)} N.`,
      );
    }),
    g(2, "tt", 5, (r) => {
      const m = r.i(2, 10),
        a = r.s(0.5, 3, 0.5),
        f = m * a;
      return N(
        `Một lực ${v(f)} N tác dụng lên vật làm vật thu gia tốc ${v(a)} m/s². Khối lượng của vật là bao nhiêu kilôgam?`,
        m,
        "kg",
        `m = F/a = ${v(f)}/${v(a)} = ${m} kg.`,
      );
    }),
    g(3, "tt", 5, (r) => {
      const m = r.i(8, 20) * 100,
        kmh = r.pick([36, 54, 72]),
        t = r.i(4, 10),
        v0 = kmh / 3.6;
      return N(
        `Một ô tô khối lượng ${m} kg đang chạy ${kmh} km/h thì hãm phanh và dừng lại sau ${t} s (chậm dần đều). Độ lớn lực hãm là bao nhiêu niutơn?`,
        (m * v0) / t,
        "N",
        `a = (0 − ${v(v0)})/${t} = −${v(v0 / t, 2)} m/s²; F = m|a| = ${m}·${v(v0 / t, 2)} ≈ ${v((m * v0) / t, 0)} N.`,
      );
    }),
    g(3, "tt", 5, (r) => {
      const m = r.i(2, 10),
        f = r.i(3, 9) * 4,
        fr = r.i(1, 2) * 4,
        t = r.i(3, 8);
      const a = (f - fr) / m;
      return N(
        `Một vật khối lượng ${m} kg đang đứng yên trên sàn ngang thì chịu lực kéo ${f} N theo phương ngang; lực ma sát là ${fr} N. Vận tốc của vật sau ${t} s là bao nhiêu m/s?`,
        a * t,
        "m/s",
        `a = (F − F_ms)/m = (${f} − ${fr})/${m} = ${v(a)} m/s²; v = at = ${v(a * t, 2)} m/s.`,
      );
    }),
    g(4, "th", 5, (r) => {
      const m1 = r.i(2, 6),
        m2 = r.i(1, 4),
        f = (m1 + m2) * r.i(2, 5);
      const a = f / (m1 + m2);
      return N(
        `Hai vật khối lượng ${m1} kg và ${m2} kg đặt sát nhau trên mặt sàn nhẵn. Lực ${f} N đẩy theo phương ngang vào vật ${m1} kg. Lực mà vật ${m1} kg đẩy vật ${m2} kg có độ lớn bao nhiêu niutơn?`,
        m2 * a,
        "N",
        `Cả hệ: a = F/(m₁+m₂) = ${f}/${m1 + m2} = ${v(a)} m/s². Xét riêng vật ${m2} kg: N = m₂a = ${v(m2 * a)} N (theo định luật III, vật ${m2} kg cũng đẩy lại đúng ${v(m2 * a)} N).`,
      );
    }),
  ],

  /* ===== Bài 3 (CĐ3) - Một số lực trong thực tiễn ===== */
  b12: [
    q(
      1,
      "tn",
      M(
        "Trọng lực là",
        [
          "lực hấp dẫn do Trái Đất tác dụng lên vật",
          "lực đỡ của mặt sàn",
          "lực cản của không khí",
          "lực đàn hồi của dây treo",
        ],
        "P⃗ = m·g⃗, phương thẳng đứng, chiều hướng xuống, đặt tại trọng tâm.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Lực ma sát trượt có độ lớn",
        ["F_mst = μ·N", "F_mst = μ/N", "F_mst = N/μ", "F_mst = μ·m"],
        "Tỉ lệ với áp lực N; μ là hệ số ma sát trượt.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Lực căng dây có phương",
        [
          "trùng với sợi dây, chiều hướng vào phần giữa của dây",
          "vuông góc với sợi dây",
          "thẳng đứng",
          "nằm ngang",
        ],
        "Dây chỉ kéo chứ không đẩy.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Lực đẩy Archimedes tác dụng lên vật nhúng trong chất lỏng có độ lớn",
        [
          "F_A = ρ·g·V (V là thể tích phần chất lỏng bị chiếm chỗ)",
          "F_A = ρ·V/g",
          "F_A = m·g·V",
          "F_A = ρ·g/V",
        ],
        "ρ là khối lượng riêng của chất lỏng.",
      ),
    ),
    q(
      2,
      "tn",
      M(
        "Hệ số ma sát trượt phụ thuộc vào",
        [
          "vật liệu và tình trạng của hai mặt tiếp xúc",
          "diện tích mặt tiếp xúc",
          "tốc độ của vật",
          "khối lượng của vật",
        ],
        "μ không phụ thuộc diện tích tiếp xúc và tốc độ (gần đúng).",
      ),
    ),
    q(
      2,
      "ds",
      T(
        "Một cuốn sách nằm yên trên mặt bàn nằm ngang.",
        [
          ["Trọng lực và phản lực của bàn lên sách cân bằng nhau.", true],
          [
            "Trọng lực và phản lực của bàn là cặp lực – phản lực theo định luật III.",
            false,
            "Chúng cùng đặt vào sách; cặp lực–phản lực của phản lực N là áp lực sách đè lên bàn.",
          ],
          ["Không có lực ma sát nghỉ tác dụng lên sách.", true, "Không có xu hướng trượt."],
          ["Áp lực của sách lên bàn có độ lớn bằng trọng lượng sách.", true],
        ],
        "Phân biệt hai lực cân bằng với cặp lực – phản lực.",
      ),
    ),
    q(
      2,
      "tte",
      M(
        "Lốp xe có các rãnh (gai lốp) nhằm mục đích chính là",
        [
          "tăng ma sát với mặt đường, nhất là khi đường ướt",
          "giảm khối lượng lốp",
          "giảm ma sát để xe chạy nhanh",
          "làm đẹp",
        ],
        "Rãnh thoát nước giúp lốp bám đường.",
      ),
    ),
    g(1, "tt", 5, (r) => {
      const m = r.s(0.5, 12, 0.5);
      return N(
        `Một vật có khối lượng ${v(m)} kg. Lấy g = 9,8 m/s². Trọng lượng của vật là bao nhiêu niutơn?`,
        m * 9.8,
        "N",
        `P = mg = ${v(m)}·9,8 = ${v(m * 9.8)} N.`,
      );
    }),
    g(2, "tt", 5, (r) => {
      const m = r.i(2, 30),
        mu = r.s(0.1, 0.5, 0.05);
      return N(
        `Một thùng gỗ khối lượng ${m} kg trượt trên sàn nằm ngang, hệ số ma sát trượt ${v(mu)}. Lấy g = 10 m/s². Lực ma sát trượt có độ lớn bao nhiêu niutơn?`,
        mu * m * 10,
        "N",
        `N = P = ${m * 10} N; F_mst = μN = ${v(mu)}·${m * 10} = ${v(mu * m * 10)} N.`,
      );
    }),
    g(3, "tt", 5, (r) => {
      const m = r.i(2, 10),
        mu = r.s(0.1, 0.4, 0.1),
        f = Math.round(mu * m * 10) + r.i(2, 10) * 2;
      const a = (f - mu * m * 10) / m;
      return N(
        `Kéo một vật khối lượng ${m} kg trên sàn ngang bằng lực ${f} N theo phương ngang; hệ số ma sát trượt là ${v(mu)}. Lấy g = 10 m/s². Gia tốc của vật là bao nhiêu m/s²?`,
        a,
        "m/s²",
        `F_mst = μmg = ${v(mu * m * 10)} N; a = (F − F_mst)/m = (${f} − ${v(mu * m * 10)})/${m} = ${v(a, 2)} m/s².`,
      );
    }),
    g(3, "tt", 4, (r) => {
      const vol = r.i(2, 9) * 100,
        rho = r.pick([1000, 800, 1030]);
      return N(
        `Một vật có thể tích ${vol} cm³ được nhúng chìm hoàn toàn trong chất lỏng có khối lượng riêng ${rho} kg/m³. Lấy g = 10 m/s². Lực đẩy Archimedes tác dụng lên vật là bao nhiêu niutơn?`,
        rho * 10 * vol * 1e-6,
        "N",
        `V = ${vol} cm³ = ${v(vol * 1e-6)} m³; F_A = ρgV = ${rho}·10·${v(vol * 1e-6)} = ${v(rho * 10 * vol * 1e-6)} N.`,
      );
    }),
    g(3, "tng", 2, (r) => {
      const p = r.s(2, 6, 0.5),
        f = r.s(0.6, 1.8, 0.2);
      return N(
        `Dùng lực kế kéo đều một khối gỗ trọng lượng ${v(p)} N trên mặt bàn nằm ngang, lực kế chỉ ${v(f)} N. Hệ số ma sát trượt giữa gỗ và bàn là bao nhiêu?`,
        f / p,
        "",
        `Kéo đều ⇒ F_k = F_mst = μN = μP ⇒ μ = ${v(f)}/${v(p)} ≈ ${v(f / p, 3)}.`,
      );
    }),
    g(4, "th", 5, (r) => {
      const al = r.pick([30, 45, 60]),
        mu = r.pick([0.1, 0.2, 0.3]);
      const a = 10 * (Math.sin(rad(al)) - mu * Math.cos(rad(al)));
      return N(
        `Một vật trượt xuống mặt phẳng nghiêng góc ${al}° so với phương ngang, hệ số ma sát trượt ${v(mu)}. Lấy g = 10 m/s². Gia tốc của vật là bao nhiêu m/s²?`,
        a,
        "m/s²",
        `N = mg·cosα; a = g(sinα − μcosα) = 10(sin${al}° − ${v(mu)}·cos${al}°) ≈ ${v(a, 2)} m/s² (không phụ thuộc khối lượng).`,
      );
    }),
  ],

  /* ===== Bài 4 (CĐ3) - Moment lực - Cân bằng của vật rắn ===== */
  b13: [
    q(
      1,
      "tn",
      M(
        "Moment của lực đối với một trục quay được tính bằng",
        ["M = F·d (d là cánh tay đòn)", "M = F/d", "M = F + d", "M = F·d²"],
        "Cánh tay đòn d là khoảng cách từ trục quay đến giá của lực.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Đơn vị của moment lực là",
        ["N·m", "N/m", "N", "J/s"],
        "M = F·d nên đơn vị là niutơn mét.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Ngẫu lực là hệ hai lực",
        [
          "song song, ngược chiều, cùng độ lớn, cùng tác dụng vào một vật",
          "cùng chiều, cùng độ lớn",
          "đồng quy và cân bằng",
          "vuông góc với nhau",
        ],
        "Ngẫu lực chỉ làm vật quay; M = F·d với d là khoảng cách giữa hai giá.",
      ),
    ),
    q(
      1,
      "tn",
      M(
        "Lực có giá đi qua trục quay thì",
        [
          "không có tác dụng làm quay vật",
          "làm vật quay nhanh nhất",
          "có moment lớn nhất",
          "làm vật quay ngược chiều kim đồng hồ",
        ],
        "Cánh tay đòn d = 0 ⇒ M = 0.",
      ),
    ),
    q(
      2,
      "tn",
      M(
        "Điều kiện cân bằng tổng quát của một vật rắn là",
        [
          "hợp lực bằng 0 và tổng moment lực đối với một trục bất kì bằng 0",
          "chỉ cần hợp lực bằng 0",
          "chỉ cần tổng moment bằng 0",
          "các lực phải đồng quy",
        ],
        "Cần cả điều kiện về lực và điều kiện về moment.",
      ),
    ),
    q(
      2,
      "tte",
      M(
        "Tay nắm cửa thường được lắp xa bản lề để",
        [
          "tăng cánh tay đòn, mở cửa bằng lực nhỏ hơn",
          "giảm moment lực",
          "cửa nặng hơn",
          "giảm ma sát ở bản lề",
        ],
        "Cùng moment cần thiết, d lớn thì F nhỏ.",
      ),
    ),
    q(
      2,
      "ds",
      T(
        "Một người dùng cờ lê dài 20 cm để vặn đai ốc với lực 50 N vuông góc cán.",
        [
          ["Moment lực là 10 N·m.", true, "M = 50·0,2."],
          ["Nối dài cán cờ lê gấp đôi thì cùng lực đó cho moment gấp đôi.", true],
          [
            "Nếu lực hướng dọc theo cán thì moment vẫn là 10 N·m.",
            false,
            "Khi đó giá của lực qua trục quay nên M = 0.",
          ],
          ["Moment lực đặc trưng cho tác dụng làm quay của lực.", true],
        ],
        "Moment lực M = F·d với d là cánh tay đòn (khoảng cách từ trục quay đến giá của lực), đổi d sang mét trước khi tính.",
      ),
    ),
    g(1, "tt", 5, (r) => {
      const f = r.i(2, 20) * 5,
        d = r.i(1, 8) * 5;
      return N(
        `Một lực ${f} N có cánh tay đòn ${d} cm đối với trục quay. Moment của lực là bao nhiêu N·m?`,
        (f * d) / 100,
        "N·m",
        `M = F·d = ${f}·${v(d / 100)} = ${v((f * d) / 100)} N·m.`,
      );
    }),
    g(2, "tt", 5, (r) => {
      const m1 = r.i(2, 6) * 10,
        d1 = r.pick([1, 1.5, 2]),
        d2 = r.pick([2, 2.5, 3]);
      const m2 = (m1 * d1) / d2;
      return N(
        `Trên bập bênh, một em bé ${m1} kg ngồi cách trục quay ${v(d1)} m. Em bé thứ hai ngồi phía bên kia cách trục ${v(d2)} m thì bập bênh cân bằng. Khối lượng em bé thứ hai là bao nhiêu kilôgam?`,
        m2,
        "kg",
        `Quy tắc moment: m₁g·d₁ = m₂g·d₂ ⇒ m₂ = ${m1}·${v(d1)}/${v(d2)} = ${v(m2, 2)} kg.`,
      );
    }),
    g(3, "tt", 5, (r) => {
      const L = r.pick([1.2, 1.5, 1.8, 2]),
        w = r.i(2, 6) * 100,
        x = r.pick([0.2, 0.3, 0.4]);
      const f = (w * x) / (L - x);
      return N(
        `Dùng xà beng dài ${v(L)} m để bẩy một tảng đá nặng ${w} N. Điểm tựa cách đầu đặt dưới tảng đá ${v(x)} m. Cần tác dụng lực nhỏ nhất bao nhiêu niutơn (vuông góc xà beng, ở đầu kia) để bẩy được đá?`,
        f,
        "N",
        `F·(${v(L)} − ${v(x)}) = ${w}·${v(x)} ⇒ F = ${v(f, 1)} N.`,
      );
    }),
    g(3, "tt", 5, (r) => {
      const f = r.i(2, 10) * 5,
        d = r.i(2, 6) * 5;
      return N(
        `Hai tay tác dụng lên vô lăng một ngẫu lực, mỗi lực ${f} N; đường kính vô lăng ${d * 2} cm. Moment của ngẫu lực là bao nhiêu N·m?`,
        (f * d * 2) / 100,
        "N·m",
        `M = F·d với d = ${v((d * 2) / 100)} m là khoảng cách giữa hai giá: M = ${f}·${v((d * 2) / 100)} = ${v((f * d * 2) / 100)} N·m.`,
      );
    }),
    g(4, "th", 5, (r) => {
      const L = r.pick([2, 3, 4]),
        wb = r.i(1, 4) * 100,
        wl = r.i(2, 6) * 100,
        x = r.pick([0.5, 1]);
      const nb = (wb * (L / 2) + wl * x) / L,
        na = wb + wl - nb;
      return N(
        `Một thanh dầm đồng chất dài ${L} m, trọng lượng ${wb} N, hai đầu A và B tựa lên hai gối đỡ. Treo vật nặng ${wl} N tại điểm cách A ${v(x)} m. Lực mà gối A đỡ thanh là bao nhiêu niutơn?`,
        na,
        "N",
        `Lấy moment đối với A: N_B·${L} = ${wb}·${v(L / 2)} + ${wl}·${v(x)} ⇒ N_B = ${v(nb, 1)} N; N_A = ${wb} + ${wl} − N_B = ${v(na, 1)} N.`,
      );
    }),
    q(
      3,
      "lm",
      M(
        "Cẳng tay người khi nâng tạ hoạt động như một đòn bẩy có điểm tựa ở khuỷu, cơ bắp tay bám gần khuỷu. Cách bố trí này khiến",
        [
          "cơ phải sinh lực lớn hơn nhiều trọng lượng tạ nhưng bàn tay di chuyển được quãng dài",
          "cơ chỉ cần lực nhỏ hơn trọng lượng tạ",
          "moment của lực cơ luôn bằng 0",
          "không cần lực cơ khi giữ tạ",
        ],
        "Cánh tay đòn của lực cơ nhỏ hơn của tạ ⇒ lực cơ lớn (Vật lí – Sinh học).",
      ),
    ),
  ],
};
