# Báo cáo xử lý bản quyền — Bước 0 & 1

**Ngày:** 2026-11-16
**Nhánh:** `arena/79059a3c-khkt`
**Lý do:** hệ thống trước đây proxy + rebrand nội dung của vatly.ai, và lưu bản sao giao diện của họ trong Git.

## Đã xoá khỏi repository (commit mới, giữ lịch sử)

| Đường dẫn | Nội dung | Dung lượng |
|---|---|---|
| `.site-import/pages/**` (84 file) | Bản sao HTML/CSS/ảnh 21 trang của vatly.ai | ~24 MB |
| `.site-import/capture.json`, `captured.css`, `clone.marked.html` | Bản sao trang chủ | ~1,4 MB |
| `.site-import/reference.png` | Ảnh chụp trang nguồn | 1,1 MB |
| `.site-import/observations/evidence/*.png` (8 file) | Ảnh chụp giao diện site nguồn | ~7 MB |
| `public/assets/aistudio/VatLy.ai___*.html` | HTML trang chủ đã lưu | 270 KB |
| `public/assets/aistudio/image_b029e073.png` | Ảnh không tham chiếu | 44 KB |

**Chặn tái phát:** các đường dẫn trên đã được thêm vào `.gitignore`.

## Đã gỡ khỏi mã nguồn

- `src/server.ts`: xoá toàn bộ khối proxy `/api/mo-phong/*` + logic rebrand (xoá thương hiệu nguồn, thay logo/slogan/footer/hotline, strip analytics) — **193 dòng**.
- `src/components/simulation-viewer.tsx`: gỡ `<iframe>` (117 dòng), gỡ toàn bộ state watchdog/loading/retry không còn dùng, mặc định dùng mô phỏng cục bộ.
- Nút "Mở ngoài" giờ hiển thị rõ **“Nguồn: vatly.ai”** thay vì icon trần — không còn mập mờ nguồn gốc.

## Đã thêm

- `src/routes/nguon-ban-quyen.tsx` — trang **Nguồn & Bản quyền** công khai: liệt kê phần nào của trường, nhạc nền CC BY 4.0 của Sascha Ende, cam kết không lưu nội dung bên thứ ba, email tiếp nhận yêu cầu bản quyền.
- Link tới trang này trong footer.

## Giữ nguyên (hợp pháp)

- 5 tệp MP3 (`public/assets/aistudio/*.mp3`): nhạc của **Sascha Ende**, giấy phép **CC BY 4.0**. Đã kiểm tra ID3 và đối chiếu `src/lib/config.ts` — ghi công đầy đủ (tác giả, tên bài, giấy phép, link nguồn ende.app).

## Lưu ý

Bản sao cũ **vẫn còn trong lịch sử Git** (commit `50976db`, `caad934`, `2087f32`).
Nếu nhà trường yêu cầu xoá triệt để, cần `git filter-repo` + force-push + báo GitHub purge cache — việc này đổi toàn bộ commit hash.
