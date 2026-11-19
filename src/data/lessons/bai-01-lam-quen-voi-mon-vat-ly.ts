import type { LessonContent } from "./types";

/**
 * Bài 1 — Làm quen với môn Vật lý (Vật lý 10, Chủ đề 1).
 *
 * Nội dung do Trường THPT Tam Giang biên soạn theo khung chương trình GDPT
 * môn Vật lý của Bộ GD&ĐT. KHÔNG sao chép từ nguồn bên ngoài.
 *
 * ⚠ TRẠNG THÁI: draft — AI soạn, chưa có giáo viên bộ môn duyệt.
 * Cần giáo viên Vật lý rà soát trước khi dùng chính thức cho học sinh.
 */
export const bai01LamQuenVoiMonVatLy: LessonContent = {
  lessonSlug: "bai-1-lam-quen-voi-mon-vat-ly",
  title: "Bài 1 — Làm quen với môn Vật lý",
  objectives: [
    "Nêu được đối tượng nghiên cứu của Vật lý và mối liên hệ với các ngành khoa học khác.",
    "Phân biệt được các lĩnh vực chính của Vật lý trong chương trình phổ thông.",
    "Trình bày được vai trò của Vật lý trong đời sống, kỹ thuật và y học.",
    "Nhận biết được phương pháp nghiên cứu khoa học ở mức khái quát.",
  ],
  blocks: [
    {
      type: "text",
      value:
        "Vật lý là môn khoa học nghiên cứu về **thế giới tự nhiên** ở mức cơ bản nhất: vật chất cấu tạo ra sao, các vật tương tác với nhau như thế nào, và những quy luật nào chi phối sự vận động của chúng. Khác với việc học thuộc lòng, học Vật lý là học cách **đặt câu hỏi, quan sát và kiểm chứng**.",
    },
    {
      type: "callout",
      tone: "tip",
      title: "Cách học",
      value:
        "Đừng vội ghi nhớ công thức. Hãy bắt đầu bằng câu hỏi “hiện tượng này diễn ra thế nào?” — sau đó mới tìm quy luật, và cuối cùng mới dùng công thức để mô tả quy luật đó.",
    },
    {
      type: "text",
      value:
        "Vật lý gắn với hầu hết các ngành khoa học khác. Cùng nghiên cứu một đối tượng nhưng mỗi ngành có cách tiếp cận riêng — đó là lý do Vật lý thường được gọi là nền tảng của khoa học tự nhiên.",
    },
    {
      type: "table",
      headers: ["Ngành", "Đối tượng quan tâm", "Ví dụ câu hỏi"],
      rows: [
        [
          "Cơ học",
          "Chuyển động và lực",
          "Vì sao xe phanh gấp thì người ngồi trên lao về phía trước?",
        ],
        ["Nhiệt học", "Nhiệt độ, sự truyền nhiệt", "Vì sao cán kim loại nóng nhanh hơn cán gỗ?"],
        ["Điện học", "Điện tích, dòng điện", "Vì sao dây tóc bóng đèn sáng lên khi có dòng điện?"],
        ["Quang học", "Ánh sáng và thị giác", "Vì sao cầu vồng xuất hiện sau cơn mưa?"],
        ["Âm học", "Sóng âm", "Vì sao sấm nghe thấy chậm hơn so với chớp?"],
      ],
      caption: "Các lĩnh vực chính của Vật lý phổ thông",
    },
    {
      type: "text",
      value:
        "Một đặc điểm quan trọng: **Vật lý dùng đại lượng, không dùng cảm tính**. Thay vì nói “xe chạy rất nhanh”, ta nói xe có tốc độ 60 km/h. Cách mô tả đó giúp đo lường, so sánh và dự đoán được.",
    },
    {
      type: "formula",
      expression: "v = s / t",
      legend:
        "v: tốc độ (m/s) · s: quãng đường đi được (m) · t: thời gian đi hết quãng đường đó (s). Đây là công thức mở đầu cho toàn bộ chương động học — ví dụ về cách Vật lý biến quan sát thành đại lượng đo được.",
    },
    {
      type: "list",
      items: [
        "**Quan sát** hiện tượng trong tự nhiên hoặc trong phòng thí nghiệm.",
        "**Đặt giả thuyết** — một dự đoán có thể kiểm tra được.",
        "**Tiến hành đo đạc**, thu thập số liệu trung thực.",
        "**Phân tích** số liệu và rút ra quy luật.",
        "**Kiểm chứng** bằng thí nghiệm lặp lại hoặc so với lý thuyết.",
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "Sai sót là bình thường",
      value:
        "Mọi kết quả đo đều có sai số. Ghi nhận sai số trung thực là một phần của khoa học, không phải điều cần che giấu. Bài 3 của chủ đề này sẽ đi sâu vào cách tính và biểu diễn sai số.",
    },
  ],
  examples: [
    {
      id: "vd1",
      title: "VD1. Vật lý có mặt trong những lĩnh vực nào?",
      prompt:
        "Kể tên ba lĩnh vực trong đời sống có ứng dụng Vật lý và nêu rõ nguyên lý Vật lý đứng sau mỗi ứng dụng.",
      steps: [
        {
          label: "Bước 1 — Xác định yêu cầu",
          detail:
            "Đề bài cần ba lĩnh vực, mỗi lĩnh vực phải chỉ ra nguyên lý Vật lý cụ thể (không chỉ gọi tên thiết bị).",
        },
        {
          label: "Bước 2 — Chọn lĩnh vực quen thuộc",
          detail:
            "Ưu tiên lĩnh vực học sinh tiếp xúc hằng ngày để dễ hình dung: y tế, giao thông, thông tin liên lạc.",
        },
        {
          label: "Bước 3 — Nêu nguyên lý",
          detail:
            "Y tế → tia X dựa trên tính chất xuyên qua vật chất của bức xạ điện từ. Giao thông → phanh xe dựa trên lực ma sát. Thông tin → truyền tín hiệu dựa trên sóng điện từ.",
        },
      ],
      answer:
        "Ba lĩnh vực tiêu biểu: (1) Y tế — máy chụp X-quang dùng bức xạ điện từ xuyên qua mô mềm; (2) Giao thông — hệ thống phanh dùng lực ma sát để giảm động năng của xe; (3) Thông tin liên lạc — điện thoại dùng sóng điện từ để truyền tín hiệu.",
    },
    {
      id: "vd2",
      title: "VD2. Đối tượng nghiên cứu của từng phân ngành",
      prompt:
        "Cho ba hiện tượng: (a) miếng sắt bị hút vào nam châm, (b) kim la bàn quay khi đặt gần dây dẫn có dòng điện, (c) đèn LED sáng khi mắc vào pin. Hiện tượng nào thuộc điện học, hiện tượng nào thuộc từ học?",
      steps: [
        {
          label: "Bước 1 — Nhận diện dấu hiệu",
          detail:
            "Điện học liên quan đến điện tích và dòng điện; từ học liên quan đến nam châm và tương tác từ.",
        },
        {
          label: "Bước 2 — Phân loại",
          detail:
            "(a) nam châm hút sắt → tương tác từ → **từ học**. (b) dòng điện làm kim la bàn lệch → điện tạo ra từ trường → **liên hệ điện–từ**. (c) dòng điện chạy qua LED → **điện học**.",
        },
        {
          label: "Bước 3 — Rút ra nhận xét",
          detail:
            "Ba hiện tượng cho thấy điện và từ không tách rời — đây là lý do chương trình gộp thành phần “Điện từ học”.",
        },
      ],
      answer:
        "(a) thuộc từ học (tương tác nam châm – sắt). (b) thuộc điện từ học (dòng điện sinh từ trường). (c) thuộc điện học (dòng điện qua linh kiện).",
    },
  ],
  exercises: [
    {
      id: "bt1",
      prompt: "Đối tượng nghiên cứu chính của môn Vật lý là gì?",
      options: [
        "Các phản ứng hoá học giữa các chất",
        "Vật chất, năng lượng và các quy luật vận động của thế giới tự nhiên",
        "Sự phát triển của các loài sinh vật",
        "Cấu trúc của ngôn ngữ và ý nghĩa từ ngữ",
      ],
      correctIndex: 1,
      explanation:
        "Vật lý nghiên cứu vật chất, năng lượng và các quy luật chi phối sự vận động của chúng. Phản ứng hoá học thuộc Hoá học, sự phát triển loài thuộc Sinh học, ngôn ngữ thuộc Ngữ văn.",
    },
    {
      id: "bt2",
      prompt:
        "Một học sinh nói: “Xe tải chạy nhanh hơn xe đạp vì xe tải to hơn.” Cách phát biểu này cần sửa thế nào để đúng tinh thần Vật lý?",
      options: [
        "Không cần sửa, vì xe tải thật sự to hơn",
        "Nên thay bằng số đo cụ thể: so sánh tốc độ (km/h) của hai xe trong cùng khoảng thời gian",
        "Nên nói xe tải nặng hơn nên nhanh hơn",
        "Nên nói xe đạp chậm hơn vì bánh nhỏ hơn",
      ],
      correctIndex: 1,
      explanation:
        "Vật lý mô tả bằng đại lượng đo được. “Nhanh hơn” phải được biểu diễn bằng tốc độ với đơn vị cụ thể, không dựa vào kích thước hay khối lượng của vật.",
    },
    {
      id: "bt3",
      prompt: "Trong phương pháp nghiên cứu Vật lý, bước nào ngay sau khi đặt giả thuyết?",
      options: [
        "Công bố kết quả cho báo chí",
        "Tiến hành thí nghiệm và thu thập số liệu để kiểm tra giả thuyết",
        "Thay đổi giả thuyết cho phù hợp với kết quả mong muốn",
        "Bỏ qua nếu giả thuyết khó kiểm tra",
      ],
      correctIndex: 1,
      explanation:
        "Sau khi đặt giả thuyết, phải thiết kế thí nghiệm và thu số liệu trung thực để kiểm tra. Không được sửa giả thuyết cho vừa kết quả — đó là vi phạm nguyên tắc khoa học.",
    },
  ],
  reflection: {
    question:
      "Nếu một hiện tượng quan sát được mâu thuẫn với công thức bạn đã học, bạn nên tin vào đâu?",
    options: [
      "Tin vào công thức, vì công thức đã được chứng minh",
      "Tin vào quan sát, vì công thức có thể bị áp dụng sai điều kiện",
      "Bỏ qua hiện tượng đó",
      "Tin vào cả hai và không cần giải thích",
    ],
    correctIndex: 1,
    explanation:
      "Công thức chỉ đúng trong những điều kiện xác định. Khi quan sát mâu thuẫn với lý thuyết, cần kiểm tra lại điều kiện áp dụng — đây chính là cách Vật lý tiến bộ: thực nghiệm có quyền phủ định lý thuyết, không phải ngược lại.",
  },
  relatedExperimentId: "CE01",
  relatedSimulationDomain: "co-hoc",
  review: {
    status: "draft",
    note: "AI soạn theo khung GDPT. Cần giáo viên Vật lý của trường rà soát nội dung, thuật ngữ và đáp án trước khi dùng chính thức.",
    updatedAt: "2026-11-16",
  },
};
