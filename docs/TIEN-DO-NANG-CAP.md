# Tiến độ rà soát & nâng cấp TamGiang Physics

Tệp này ghi lại kết quả rà soát và những gì **đã làm / chưa làm**, để các đợt sau tiếp tục mà không tạo trùng lặp.
Cập nhật lần cuối: 15/11/2026 (Giai đoạn 1).

## 1. Kết quả rà soát hiện trạng

| Hạng mục | Hiện trạng thực tế | Phân loại |
| --- | --- | --- |
| Bài học | 46 bài / 777 mục (52 lý thuyết, 318 ví dụ, 406 bài tập) trong `src/data/curriculum.json`. Nội dung từng mục **không nằm trong repo** mà được tải qua proxy `/api/mo-phong/*` từ `vatly.ai`. | Chưa xác minh được từng bài (phụ thuộc nguồn ngoài) |
| Bài thiếu ví dụ | Lớp 10 Bài 2 (An toàn thực hành), Lớp 11 Bài 1 (Sóng điện từ), Lớp 12 Bài 2 (Cấu tạo chất), Lớp 12 Bài 3 (Sự chuyển thể) không có mục ví dụ nào. | Còn sơ sài |
| Bài ít bài tập | Lớp 10 Bài 1, Bài 2; Lớp 12 Bài 2 chỉ có 1 mục bài tập. | Còn sơ sài |
| Phạm vi chương trình | Lớp 10 chỉ có Cơ học phần 1 (3 chủ đề), Lớp 11 chỉ có Sóng (7 bài), Lớp 12 có Chất khí, Nhiệt học, Từ trường. Thiếu: năng lượng–động lượng, dao động, điện trường, dòng điện, hạt nhân… | Chưa có |
| Thí nghiệm | 42 thí nghiệm kinh điển (CE01–CE42), 5 lĩnh vực Phòng Lab tương tác, mô phỏng chuyển động tròn đều, 4 mô hình Thiết kế thí nghiệm. Đều chạy được. | Đã hoàn chỉnh — giữ nguyên |
| Thành phần mồ côi | `wave-interference-experiment.tsx`, `prism-dispersion-experiment.tsx` có mã nhưng không trang nào dùng. | Chưa xác minh — chưa gắn vào trang |
| Ảnh thực tế | 54 ảnh (Wikimedia Commons, có tác giả/giấy phép), mỗi thí nghiệm 1 ảnh. CE04 (máy Atwood) chưa có ảnh. Chưa thí nghiệm nào có bộ 4 ảnh (dụng cụ – bố trí – quá trình – kết quả). | Còn thiếu |
| Bài tập nội bộ | Trước nâng cấp chỉ có 6 bài VDC (`src/data/vdc-problems.ts`); bài tập của bài học nằm ở nguồn ngoài. | Còn thiếu |
| Tài khoản | Trước nâng cấp không có. `/api/submissions` cũ lưu trong RAM, không xác thực, ai cũng đọc được. | Bị lỗi → đã thay |
| Tìm kiếm / yêu thích / sổ tay | Đã có và hoạt động (localStorage). | Đã hoàn chỉnh — giữ nguyên |

## 2. Đã làm ở Giai đoạn 1

### Lỗi đã sửa
- `src/routeTree.gen.ts` cũ trỏ tới route không tồn tại làm `npm test` hỏng ngay khi clone → đã sinh lại.
- `/api/submissions` không xác thực, CORS `*`, lộ bài của mọi người → thay bằng API tài khoản có phiên đăng nhập.
- Thanh tiêu đề tràn ngang trên điện thoại (nút menu bị đẩy khỏi màn hình ở 360–390 px) → đã thu gọn.
- Dải chủ đề trang chủ tràn 4 px trên điện thoại → đã sửa.
- `src/test/setup.ts` giả định luôn có `window` làm hỏng mọi test chạy môi trường Node → đã sửa.

### Ngân hàng bài tập (`src/data/question-bank/`)
- 13 bài Lớp 10 (`b01`–`b13`) + 2 bộ gắn thí nghiệm (`e01` chuyển động tròn đều, `e02` rơi tự do & ném xiên).
- 420 câu: 127 nhận biết, 103 thông hiểu, 119 vận dụng, 71 vận dụng cao.
  Trong đó 115 câu viết tay và 305 câu sinh từ 61 mẫu tham số (cùng dạng, khác số liệu — mỗi mẫu 2–5 biến thể).
- 14 câu VDC có đủ: dạng VDC, phân tích tư duy, kiến thức cần vận dụng, lỗi sai thường gặp (8/10 dạng: nhiều bước, ngược, đồ thị, số liệu, sai số, sửa lỗi, thiết kế, thực tiễn, liên chương).
- Cách thêm bài mới: tạo tệp `lopXX.ts` theo mẫu `lop10b.ts`, thêm vào `RAW` trong `index.ts`. Mã bài lấy từ `lesson-catalog.ts`.

### Luyện tập (`/luyen-tap`)
Chọn khối, bài, mức độ, dạng, số câu → làm bài → chấm tự động → đáp án + lời giải → xem lại câu sai → làm lại câu sai → đánh dấu câu hỏi → gợi ý ôn lại. Chấm số chấp nhận dấu phẩy/chấm, `a·10^n`, phân số, kèm đơn vị, sai số làm tròn 2%.

### Tài khoản & nhật ký (`/tai-khoan`, `src/backend/`)
Đăng ký, đăng nhập, đăng xuất, quên/đặt lại mật khẩu (mã khôi phục hoặc email), hồ sơ, đổi mật khẩu, tải dữ liệu, xoá tài khoản, bảng tổng quan, lịch sử làm bài có chi tiết từng câu, đồng bộ tiến độ giữa thiết bị. Xem mục 4 về các giới hạn.

Ngoài giao diện người học, API có sẵn `GET /api/admin/overview` (chỉ giáo viên hoặc quản trị viên, danh sách email trong `TAMGIANG_ADMIN_EMAILS`): thống kê người dùng, số lượt làm bài, điểm trung bình. **Chưa có giao diện** cho endpoint này — xem mục 3.

### Ảnh
- Thêm nút phóng to (lightbox, đóng bằng Esc/chạm) cho mọi ảnh thí nghiệm.
- Đặt ảnh thực tế + nút bài tập cạnh mô phỏng chuyển động tròn đều ở trang chủ.
- **Không thêm được ảnh mới nào** (xem mục 3).

## 3. Chưa làm — việc cho các giai đoạn sau

| Việc | Lý do chưa làm | Gợi ý tiếp theo |
| --- | --- | --- |
| Ảnh thực tế mới, bộ 4 ảnh cho từng thí nghiệm, ảnh CE04 | Môi trường làm việc không tải được tệp từ Wikimedia; danh mục Commons «Atwood's machine» chỉ có sơ đồ/tranh khắc, không có ảnh chụp thật. | Chụp ảnh bộ thí nghiệm của trường hoặc tải thủ công ảnh có giấy phép CC, thêm vào `experiment-photos.ts`. |
| Ngân hàng bài tập Lớp 11 (7 bài) và Lớp 12 (26 bài) | Khối lượng lớn; ưu tiên làm đủ chất lượng cho Lớp 10 trước. | Giai đoạn 2: Lớp 11 Sóng. Giai đoạn 3: Lớp 12 Chất khí + Nhiệt. Giai đoạn 4: Lớp 12 Từ trường. |
| Đạt 10/10/10/5 cho Lớp 10 | Hiện mỗi bài 23–33 câu; thiếu chủ yếu ở mức thông hiểu (4–10 câu) và b01–b03 thiếu VDC. | Bổ sung câu viết tay mức 2 và 4. |
| VDC đủ 10 dạng cho từng bài | Mới có cho 2 bộ thí nghiệm; b01–b13 có câu mức 4 nhưng chưa gắn phân tích tư duy/lỗi sai. | Gắn `deep(...)` cho câu mức 4 hiện có, thêm dạng còn thiếu. |
| Bài tập cho 42 thí nghiệm kinh điển và 4 lĩnh vực Lab còn lại | Chưa làm. | Thêm vào `experiments.ts` + `links.ts`. |
| Bổ sung nội dung bài học (lý thuyết, ví dụ) | Nội dung nằm ở `vatly.ai`, không sửa được từ repo. | Cần quyết định: tự lưu nội dung bài học trong repo hay tiếp tục phụ thuộc nguồn ngoài. |
| Các chương còn thiếu của chương trình 2018 | Chưa có dữ liệu. | Sau khi quyết định nguồn nội dung. |
| Bài làm trong trang bài học lưu chi tiết từng câu | Trang nguồn chỉ gửi điểm tổng. | — |
| Ảnh đại diện tự tải lên | API đã nhận, giao diện mới có 6 mẫu sẵn. | — |

## 4. Giới hạn cần biết của hệ thống tài khoản
- Dữ liệu lưu bằng SQLite trong thư mục `data/` của máy chủ → **máy chủ phải có ổ đĩa bền vững**. Nền tảng serverless/không có đĩa sẽ mất dữ liệu sau mỗi lần triển khai.
- Phân quyền theo người dùng được ép ở tầng truy vấn của máy chủ (mọi truy vấn kèm `user_id` của phiên) và khoá ngoại; SQLite không có RLS như Postgres.
- Đăng nhập Google và email xác minh/đặt lại **chỉ hoạt động khi cấu hình khoá** trong `.env` (xem `.env.example`). Chưa cấu hình ⇒ nút Google ẩn, đặt lại mật khẩu dùng mã khôi phục.
- `node:sqlite` còn ở trạng thái thử nghiệm trong Node 22 (có cảnh báo khi khởi động).
