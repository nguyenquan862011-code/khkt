# PROJECT_PROGRESS — TamGiang Physics

Nhật ký trạng thái dự án. Cập nhật lần cuối: **15/11/2026** (đợt rà soát & nâng cấp Giai đoạn 1).

| Mục | Giá trị |
| --- | --- |
| Nhánh làm việc | `arena/fe0b1ee0-khkt` |
| Commit gốc | `50976db` — *refactor: improve simulation viewer and site UI* |
| Stack | TanStack Start (React 19, file routes) · Vite 8 · nitro `node-server` · Tailwind 4 · shadcn/Radix · recharts · zod · vitest 4 + jsdom |
| Lệnh | `npx -y pnpm@9 install --no-lockfile` → `npx vite dev --host 0.0.0.0 --port 3000` · `npx vite build` · `node .output/server/index.mjs` · `npx vitest run` · `npx eslint .` |

> `npm ci` / `npm i` **không dùng được** trong repo này (không có lockfile, npm lỗi). Chỉ dùng pnpm 9 ở trên.

---

## 1. Trạng thái kiểm tra (đo lại sau khi dựng lại `node_modules`)

| Kiểm tra | Kết quả | So với gốc |
| --- | --- | --- |
| `npx vite build` | **exit 0** | không đổi |
| `npx vitest run` | **11 file / 74 test pass** | gốc: 8 file pass, 1 file lỗi (route tree cũ), 52 test |
| `npx eslint .` | **0 lỗi**, 10 cảnh báo | gốc: 0 lỗi (2 file mới có 2 cảnh báo `react-refresh`, 1 cảnh báo cũ `exhaustive-deps`) |
| `npx tsc --noEmit -p .` | **93 lỗi** | **đúng bằng gốc (93)**; trong đó **0 lỗi** thuộc mọi tệp mới/sửa |
| Kiểm thử trình duyệt (chromium headless) | toàn bộ luồng OK (khách → đăng ký → làm bài → lịch sử → đăng xuất → thiết bị mới thấy dữ liệu cũ) | đã thực hiện ở đợt trước |

**Đợt kiểm tra lại (15/11/2026, sau khi dựng lại `node_modules`):** build exit 0 · vitest 11 file / 74 test pass · eslint 0 lỗi / 10 cảnh báo · tsc 93 lỗi (= gốc, không lỗi nào ở tệp mới). Preview đã khởi động lại từ bản build mới và kiểm thử API trực tiếp: đăng ký → xoá tài khoản → `me = null`, tất cả trả `ok: true`; `/api/admin/overview` trả `forbidden` với tài khoản học sinh.

93 lỗi TypeScript còn lại là **nợ kỹ thuật có sẵn** của repo (ở `src/lib/physics-simulations.ts`, `src/routes/mo-phong_.index.tsx`, `src/components/interactive-physics-lab.tsx`, `src/components/wave-interference-experiment.tsx`, `src/test/*`). Không nằm trong phạm vi Giai đoạn 1.

---

## 2. Đã làm trong Giai đoạn 1

### 2.1 Rà soát (Phần A) — phát hiện chính
1. `/api/submissions` không xác thực, CORS `*`, lưu trong RAM, `GET` trả dữ liệu của mọi người → **đã thay bằng API tài khoản có phiên**.
2. Proxy `/api/mo-phong/*` phụ thuộc `vatly.ai`, bỏ CSP/X-Frame-Options, `postMessage` target `*`, không timeout, không cache → **giữ nguyên, còn tồn đọng**.
3. `src/routeTree.gen.ts` cũ làm hỏng test ngay khi clone → **đã sinh lại** (tệp sinh tự động, không sửa tay).
4. Tiến độ học tập chỉ nằm trong `localStorage` (giới hạn 100 câu, không lưu đáp án từng câu) → **đã có đồng bộ máy chủ + lưu chi tiết từng câu**.
5. `README.md`, `roadmap.md` lỗi thời; thiếu `.env.example` → **đã thêm `.env.example`**.
6. Dư thừa: `.site-import/`, 19 tệp CSS trùng lặp, `public/assets/aistudio/`, JSON 30k dòng nằm trong bundle → **chưa dọn**.
7. Phần lớn test chỉ khẳng định chuỗi trong mã nguồn, chưa có test cho proxy → **đã thêm test backend tài khoản + ngân hàng câu hỏi**.
8. Tệp rất lớn: `mo-phong_.index.tsx` 2870 dòng, `interactive-physics-lab.tsx` 1208, `audio-controller.tsx` 1015 → **chưa tách**.
9. `APP_CONFIG.totalLessons` ghi cứng 777, `contactEmail` rỗng, playlist có bản nhạc không tồn tại → **chưa sửa**.

### 2.2 Lỗi đã sửa
- `routeTree.gen.ts` cũ (làm hỏng `npm test`).
- `/api/submissions` trả dữ liệu của mọi người.
- Thanh tiêu đề tràn ngang trên điện thoại (360–390 px): ẩn tên bài nghe + thẻ trạng thái dưới `md`, chuyển nút "Sổ tay" vào menu di động, bọc logo bằng `min-w-0`.
- Dải chủ đề trang chủ tràn 4 px ở 360/390 px (`showcase-topics.tsx` — sửa `-mx-5` → `-mx-4 px-4 sm:-mx-5 sm:px-5`; **sửa xong chưa kiểm lại bằng trình duyệt**).
- `src/test/setup.ts` giả định luôn có `window` → hỏng test chạy ở môi trường Node.

### 2.3 Ngân hàng bài tập mới — `src/data/question-bank/`
- **420 câu / 15 bộ**: 13 bài Lớp 10 (`b01`–`b13`) + 2 bộ gắn thí nghiệm (`e01` chuyển động tròn đều 33 câu, `e02` rơi tự do & ném xiên 8 câu).
- Phân bố mức độ: **127 nhận biết / 103 thông hiểu / 119 vận dụng / 71 vận dụng cao**.
- Trong đó **115 câu viết tay** và **305 câu sinh từ 61 mẫu tham số** (cùng dạng, khác số liệu) — đây là điểm cần biết khi đánh giá độ "đa dạng" của kho.
- **14 câu VDC** có phân tích tư duy + kiến thức cần vận dụng + lỗi sai thường gặp, phủ **8/10 dạng VDC** (đều nằm ở `e01`, `e02`; `b01`–`b13` **chưa** có câu `deep`).
- Thêm bài mới: tạo `lopXX.ts` theo mẫu `lop10b.ts`, khai báo trong `RAW` của `src/data/question-bank/index.ts`; mã bài lấy từ `lesson-catalog.ts`.

### 2.4 Trang luyện tập — `/luyen-tap`
Chọn khối/bài/mức độ/dạng/số câu → làm bài có đếm ngược → chấm tự động → xem đáp án + lời giải → lọc "chỉ câu sai" → làm lại câu sai → đánh dấu câu hỏi → gợi ý ôn tập.
Chấm số chấp nhận `12,5` lẫn `12.5`, `a·10ⁿ`, `a*10^n`, phân số `3/4`, kèm đơn vị; sai số cho phép `max(absTol, |đáp án|·relTol)`. Câu ngắn bỏ qua hoa thường/dấu câu/dấu tiếng Việt. Câu đúng/sai tính điểm 0 / 0,1 / 0,25 / 0,5 / 1.

### 2.5 Tài khoản & nhật ký — `/tai-khoan`, `src/backend/`
- Backend tự chứa trong node server, dùng `node:sqlite` (không dùng Supabase; `AGENTS.md` cấm tự thêm migration).
- Đăng ký, đăng nhập, đăng xuất, quên/đặt lại mật khẩu (mã khôi phục 1 lần **hoặc** email), xác minh email, đổi mật khẩu (huỷ mọi phiên cũ), hồ sơ + 6 ảnh đại diện mẫu, tải dữ liệu (JSON), xoá tài khoản, bảng tổng quan, lịch sử làm bài có chi tiết từng câu, nhật ký hoạt động.
- API trả `{ ok: true, … }` hoặc `{ ok: false, error: { code, message } }`; phiên bằng cookie `tg_session` (HttpOnly, 30 ngày); method không phải GET phải cùng origin (khác → 403); chưa đăng nhập → 401; có giới hạn tần suất theo IP.
- Đồng bộ tiến độ: khách không gọi server; đã đăng nhập thì đẩy trạng thái lên sau 1,5 s, gộp khi server trả 409, ghi vào hộp thư chưa gửi (tối đa 200).
- `GET /api/admin/overview` cho giáo viên/quản trị viên (`TAMGIANG_ADMIN_EMAILS`) — **có API, chưa có giao diện**.

### 2.6 Ảnh & liên kết thí nghiệm
- Thêm nút phóng to (lightbox, đóng bằng Esc) cho mọi ảnh thí nghiệm.
- Trang chủ hiện ảnh thực tế của mô phỏng chuyển động tròn đều + nút "Bài tập liên quan".
- **Không thêm được ảnh mới**: sandbox không tải được tệp từ Wikimedia; danh mục Commons "Atwood's machine" chỉ có sơ đồ/tranh khắc lịch sử, không có ảnh chụp thật. CE04 (máy Atwood) tiếp tục dùng ảnh dự phòng.

---

## 3. Tệp chính đã thêm / sửa

| Nhóm | Tệp |
| --- | --- |
| Backend tài khoản | `src/backend/{security,db,mailer,auth,store,api}.ts`, `src/server.ts` |
| Ngân hàng câu hỏi | `src/data/question-bank/{types,dsl,lesson-catalog,lop10a,lop10b,experiments,links,index}.ts` |
| Chấm điểm | `src/lib/practice/grading.ts` |
| Client tài khoản | `src/lib/account/{client,sync}.ts`, `src/components/account-button.tsx`, `src/components/account/{ui,auth-forms,dashboard,history,profile}.tsx` |
| Giao diện luyện tập | `src/routes/luyen-tap.tsx`, `src/components/practice/{question-figure,experiment-practice-link}.tsx` |
| Trang tài khoản | `src/routes/tai-khoan.tsx` |
| Tiến độ học tập | `src/lib/learning-store.ts` (lưu câu đã lưu, gộp/trạng thái máy chủ) |
| Giao diện cũ đã sửa | `src/components/{site-header,simulation-viewer,experiment-photo,interactive-physics-lab,audio-controller,showcase-topics}.tsx`, `src/routes/index.tsx` |
| Test | `src/test/{account-backend,question-bank}.test.ts`, `src/test/setup.ts`, `src/test/physics-ecosystem-upgrade.test.ts` |
| Tài liệu | `docs/TIEN-DO-NANG-CAP.md` (bảng rà soát chi tiết), `.env.example` |

---

## 4. Việc còn tồn đọng (không mở rộng thêm trong đợt này)

| Việc | Trạng thái / lý do | Gợi ý tiếp theo |
| --- | --- | --- |
| Ngân hàng câu hỏi Lớp 11 (7 bài) và Lớp 12 (26 bài) | Chưa làm — 33 bài nằm trong `PENDING_LESSONS` | Giai đoạn 2: Lớp 11 Sóng → Lớp 12 Chất khí, Nhiệt → Từ trường |
| Đạt chuẩn 10/10/10/5 mỗi bài | Hiện 23–33 câu/bài; `b01` (24), `b02` (23), `b03` (23), `b06` (24), `b07` (28) dưới 30 câu; thiếu chủ yếu ở mức thông hiểu | Bổ sung câu mức 2 (và mức 1 cho `b02`) |
| VDC cho `b01`–`b13` | 0 câu `deep`; 14 câu `deep` chỉ nằm ở `e01`/`e02` | Gắn `deep(...)` cho câu mức 4 sẵn có, rồi bổ sung dạng còn thiếu |
| Bài tập cho 42 thí nghiệm kinh điển + 4 lĩnh vực Lab còn lại | Chưa làm | Thêm vào `experiments.ts` + `links.ts` |
| Ảnh thực tế mới / bộ 4 ảnh / ảnh CE04 | Sandbox không tải được Wikimedia; Commons chỉ có sơ đồ & tranh khắc | Chụp ảnh bộ thí nghiệm của trường hoặc tải ảnh CC thủ công |
| Nội dung bài học (lý thuyết, ví dụ) | Nội dung nằm ở `vatly.ai`, không nằm trong repo | Cần quyết định: tự lưu nội dung hay tiếp tục phụ thuộc nguồn ngoài |
| Proxy `/api/mo-phong/*` | Còn rủi ro: `postMessage` target `*`, bỏ CSP/X-Frame-Options, không timeout/cache, `decodeURIComponent` có thể ném lỗi | Thêm timeout + allowlist origin + kiểm tra `decodeURIComponent` |
| Giao diện cho `GET /api/admin/overview` | Có API, chưa có UI | Trang `/tai-khoan` hoặc trang riêng cho giáo viên |
| Dọn bloat | `.site-import/`, 19 CSS trùng lặp, `public/assets/aistudio/`, JSON 30k dòng trong bundle | Xoá khi không còn dùng |
| Tách tệp lớn | `mo-phong_.index.tsx` 2870 dòng, `interactive-physics-lab.tsx` 1208, `audio-controller.tsx` 1015 | Tách dần theo component |
| Script `typecheck` + CI | Chưa có; `tsc` còn 93 lỗi gốc | Thêm `npm run typecheck` sau khi xử lý nợ TS |
| `README.md`, `roadmap.md`, tên package `tanstack_start_ts` | Còn lỗi thời | Viết lại README |

---

## 5. Quyết định đã chốt (không mở lại nếu không có yêu cầu mới)

1. **Phân giai đoạn**: Giai đoạn 1 = Lớp 10 (`b01`–`b13`) + bộ bài gắn thí nghiệm; Lớp 11–12 để các giai đoạn sau (`PENDING_LESSONS`).
2. **Không có Supabase**: backend tự chứa trong node server, dùng `node:sqlite` (Node 22, đang thử nghiệm). Không RLS tầng DB; cách ly bằng `user_id NOT NULL` + khoá ngoại cascade + tầng truy vấn lọc theo `userId` của phiên.
3. **Google/email cần khoá**: không có khoá thì nút Google ẩn, đặt lại mật khẩu dùng mã khôi phục một lần.
4. **Máy chủ cần đĩa bền**: dữ liệu ở `data/tamgiang-accounts.sqlite` (WAL, sao lưu hằng ngày, giữ 7 bản). Nền tảng serverless không có đĩa sẽ mất dữ liệu.
5. **Không thêm ảnh giả**: giữ ảnh dự phòng cho CE04 thay vì dùng tranh khắc/sơ đồ làm ảnh thực tế.
6. **Ngưỡng kiểm thử hạ xuống** cho Giai đoạn 1: ≥ 20 câu mỗi bài Lớp 10, ≥ 1 câu mỗi mức, đề bài ≥ 8 ký tự, lời giải > 10 ký tự.

---

## 6. Ghi chú vận hành

- `node_modules` có thể biến mất giữa các phiên (snapshot không lưu) → chạy `npx -y pnpm@9 install --no-lockfile` trước khi build/test.
- Dữ liệu tài khoản nằm ngoài Git (`.gitignore`: `/data/`, `.env`, `.env.*`, `!.env.example`).
- Biến môi trường tuỳ chọn xem `.env.example`: `TAMGIANG_DB_FILE`, `TAMGIANG_DATA_DIR`, `TAMGIANG_PUBLIC_URL`, `TAMGIANG_ADMIN_EMAILS`, `RESEND_API_KEY`, `TAMGIANG_MAIL_FROM`, `TAMGIANG_DEV_MAIL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
- `src/routeTree.gen.ts` là tệp sinh tự động — không sửa tay, chạy `npx vite build` để sinh lại.

## 7. Chuẩn bị xuất bản (đợt 15/11/2026)

| Việc | Đã làm |
| --- | --- |
| Tên dự án | `package.json` → `"name": "tamgianglap"`; thêm `"engines": { "node": "22.x" }` (cần Node ≥ 22.5 cho `node:sqlite`) |
| Build cho Vercel | `vite.config.ts` đọc `NITRO_PRESET` (mặc định `node-server`); thêm script `build:vercel` = `NITRO_PRESET=vercel vite build` |
| Kiểm thử bản build Vercel | `NITRO_PRESET=vercel npx vite build` → exit 0, sinh `.vercel/output/` đúng chuẩn Build Output API v3 (`config.json` framework `nitro`, thư mục `functions/__server.func`, `static/`) |
| `.gitignore` | thêm `.vercel` |
| Bản self-host | `npx vite build` vẫn ra `.output/server/index.mjs`; preview cổng 3000 chạy bình thường |

**Giới hạn khi chạy trên Vercel (serverless):** hệ thống tài khoản dùng SQLite trên đĩa. Trên Vercel, đĩa của hàm là **tạm thời và không dùng chung giữa các instance** ⇒ phiên đăng nhập có thể không nhất quán và dữ liệu mất khi instance bị thu hồi. Máy chủ đã xử lý an toàn: nếu không mở được CSDL thì API trả `503 accounts_unavailable` và website vẫn chạy ở chế độ khách (luyện tập + tiến độ trong `localStorage`). Muốn đủ tính năng tài khoản trên web, cần một máy chủ có đĩa bền (self-host node server) làm backend và trỏ `TAMGIANG_API_BASE_URL` tới đó — hiện chưa triển khai.

### 8. Hướng dẫn tự xuất bản (do bạn thực hiện — sandbox không ra ngoài được tới vercel.com)

**Cách 1 — Vercel (nhanh, giáo trình + luyện tập; tài khoản chỉ chạy chế độ khách)**

| Trường trong Vercel | Giá trị |
| --- | --- |
| Framework Preset | `Other` |
| Install Command | `npx -y pnpm@9 install --no-lockfile` (`npm install` sẽ lỗi vì repo không có lockfile) |
| Build Command | `npm run build:vercel` |
| Output Directory | `.vercel/output` |
| Node.js Version | `22.x` (cần ≥ 22.5 cho `node:sqlite`) |
| Project Name | `tamgianglap` → URL `https://tamgianglap.vercel.app` |

Biến môi trường nên đặt: `TAMGIANG_DATA_DIR=/tmp` (để SQLite mở được trong hàm serverless) — nhưng dữ liệu vẫn là tạm thời, nên **không nên dùng tính năng đăng ký/đăng nhập trên bản Vercel**. Đặt `TAMGIANG_ADMIN_EMAILS` nếu cần vai trò giáo viên.

**Cách 2 — Máy chủ có đĩa bền (khuyến nghị nếu cần đủ tính năng tài khoản)**
Dùng một VPS / Railway / Render / Fly.io có đĩa bền:

```bash
npx -y pnpm@9 install --no-lockfile
npx vite build                       # tạo .output/server/index.mjs
PORT=3000 HOST=0.0.0.0 \
TAMGIANG_DATA_DIR=/var/lib/tamgiang \
TAMGIANG_PUBLIC_URL=https://tamgianglap.<domain-cua-ban> \
node .output/server/index.mjs
```

Ghi `TAMGIANG_DATA_DIR` vào thư mục đĩa bền (kèm sao lưu hằng ngày — `runDailyBackup` tự tạo bản sao trong `<data>/backups`, giữ 7 bản). Khi đó đăng ký/đăng nhập, lịch sử làm bài và đồng bộ tiến độ đều hoạt động đầy đủ.

**Cách 3 — Tên miền riêng**: sau khi deploy, vào Vercel → Project → Settings → Domains, thêm `tamgianglap.vn` (hoặc tên miền của trường) và trỏ CNAME về `cname.vercel-dns.com`.
