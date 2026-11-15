import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { APP_CONFIG } from "@/lib/config";
import { getLearningState, subscribeLearningState, toggleFavoriteItem } from "@/lib/learning-store";
import {
  Search,
  BookOpen,
  Sparkles,
  ExternalLink,
  ChevronRight,
  FolderOpen,
  GraduationCap,
  ShieldCheck,
  Eye,
  CheckCircle2,
  Info,
  Star,
  Calculator,
  Compass,
} from "lucide-react";

export const Route = createFileRoute("/tai-lieu")({
  head: () => ({
    meta: [
      { title: "Kho tài liệu Vật lý THPT | Trường THPT Tam Giang" },
      {
        name: "description",
        content:
          "Thư viện tài liệu Vật lý THPT Trường THPT Tam Giang: Kho tài liệu Google Drive tổng hợp kiến thức, lý thuyết và công thức Vật lí THPT phục vụ quá trình học tập và ôn luyện.",
      },
      { property: "og:title", content: "Kho tài liệu Vật lý THPT | Trường THPT Tam Giang" },
      {
        property: "og:description",
        content:
          "Thư viện tài liệu Vật lý THPT Trường THPT Tam Giang: Kho tài liệu Google Drive tổng hợp kiến thức, lý thuyết và công thức Vật lí THPT phục vụ quá trình học tập và ôn luyện.",
      },
    ],
  }),
  component: TaiLieuPage,
});

interface DriveCategory {
  id: string;
  name: string;
  code: string;
  description: string;
  topics: string[];
  status: "active" | "updating";
  grade: "10" | "11" | "12" | "all";
  gradeLabel: string;
  driveFolderUrl: string;
}

const DRIVE_CATEGORIES: DriveCategory[] = [
  {
    id: "cat-cong-thuc",
    name: "CÔNG THỨC VẬT LÝ THPT",
    code: "CT-THPT",
    description:
      "Tổng hợp toàn bộ công thức trọng tâm từ Cơ học, Sóng, Điện - Từ đến Nhiệt học và Vật lý hiện đại. Tóm tắt theo bảng biểu dễ tra cứu và ghi nhớ.",
    topics: ["Toàn bộ công thức 10-11-12", "Sơ đồ tư duy định luật", "Bảng đại lượng & Đơn vị SI"],
    status: "active",
    grade: "all",
    gradeLabel: "Khối 10, 11, 12",
    driveFolderUrl: APP_CONFIG.googleDriveFolderUrl,
  },
  {
    id: "cat-ly-thuyet",
    name: "LÝ THUYẾT LÝ THPT",
    code: "LT-THPT",
    description:
      "Hệ thống hóa bản chất các hiện tượng vật lý, định nghĩa, định luật và giải thích ứng dụng thực tế. Soạn thảo chuẩn theo chương trình giáo dục phổ thông.",
    topics: [
      "Cơ học & Động lực học",
      "Dao động & Sóng cơ",
      "Điện trường & Từ trường",
      "Giao thoa sóng & Quang học",
    ],
    status: "active",
    grade: "all",
    gradeLabel: "Toàn cấp THPT",
    driveFolderUrl: APP_CONFIG.googleDriveFolderUrl,
  },
  {
    id: "cat-10",
    name: "TÀI LIỆU VẬT LÝ 10",
    code: "VL-K10",
    description:
      "Chuyên đề Cơ học, Chuyển động thẳng, Chuyển động ném, Ba định luật Newton, Moment lực, Năng lượng và Động lượng.",
    topics: [
      "Sai số & Phép đo vật lý",
      "Chuyển động biến đổi đều",
      "Động lực học Newton",
      "Định luật bảo toàn cơ năng",
    ],
    status: "active",
    grade: "10",
    gradeLabel: "Khối 10",
    driveFolderUrl: APP_CONFIG.googleDriveFolderUrl,
  },
  {
    id: "cat-11",
    name: "TÀI LIỆU VẬT LÝ 11",
    code: "VL-K11",
    description:
      "Dao động điều hòa, Sóng cơ và Sóng âm, Giao thoa sóng nước & sóng ánh sáng, Điện trường tĩnh, Dòng điện không đổi và Từ trường.",
    topics: [
      "Con lắc đơn & Con lắc lò xo",
      "Giao thoa sóng nước & Sóng dừng",
      "Khúc xạ & Truyền sóng",
      "Điện trường & Tụ điện",
    ],
    status: "active",
    grade: "11",
    gradeLabel: "Khối 11",
    driveFolderUrl: APP_CONFIG.googleDriveFolderUrl,
  },
  {
    id: "cat-12",
    name: "TÀI LIỆU VẬT LÝ 12",
    code: "VL-K12",
    description:
      "Vật lý nhiệt, Khí lý tưởng, Từ trường, Hiện tượng cảm ứng điện từ, Vật lý hạt nhân và Phóng xạ.",
    topics: [
      "Nhiệt động lực học",
      "Mô hình động học phân tử",
      "Cảm ứng điện từ & Suất điện động",
      "Năng lượng hạt nhân & Phóng xạ",
    ],
    status: "active",
    grade: "12",
    gradeLabel: "Khối 12",
    driveFolderUrl: APP_CONFIG.googleDriveFolderUrl,
  },
  {
    id: "cat-de-thi",
    name: "ĐỀ THI & ÔN TẬP ĐÁNH GIÁ",
    code: "DT-THPT",
    description:
      "Tuyển tập đề kiểm tra giữa kỳ, cuối kỳ, đề thi thử Tốt nghiệp THPT và đề thi học sinh giỏi các năm có hướng dẫn giải chi tiết.",
    topics: [
      "Đề thi Tốt nghiệp THPT",
      "Đề kiểm tra học kỳ 1 & 2",
      "Bộ câu hỏi trắc nghiệm đúng/sai",
      "Bài tập định lượng có giải",
    ],
    status: "active",
    grade: "all",
    gradeLabel: "Ôn thi & Luyện đề",
    driveFolderUrl: APP_CONFIG.googleDriveFolderUrl,
  },
];

function TaiLieuPage() {
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showEmbedPreview, setShowEmbedPreview] = useState<boolean>(false);
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [favoriteDocs, setFavoriteDocs] = useState<string[]>(() => getLearningState().favoriteDocs);

  useEffect(() => {
    return subscribeLearningState((st) => setFavoriteDocs(st.favoriteDocs));
  }, []);

  const filteredCategories = DRIVE_CATEGORIES.filter((cat) => {
    const query = searchQuery.toLowerCase().trim();
    const matchSearch =
      !query ||
      cat.name.toLowerCase().includes(query) ||
      cat.description.toLowerCase().includes(query) ||
      cat.code.toLowerCase().includes(query) ||
      cat.topics.some((t) => t.toLowerCase().includes(query));

    const matchGrade =
      selectedGrade === "all" || cat.grade === "all" || cat.grade === selectedGrade;
    const matchFav = !onlyFavorites || favoriteDocs.includes(cat.id);

    return matchSearch && matchGrade && matchFav;
  });

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200">
      {/* Unified Academic Header */}
      <SiteHeader currentPath="/tai-lieu" />

      <main className="flex-1 pb-20">
        {/* Google Drive Hero Section */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-secondary/50 via-background to-background px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-4xl text-center space-y-5">
            <p className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#16845A] dark:text-[#72CF91]">
              <BookOpen className="size-3.5" />
              <span>Kho tài liệu · Bản đồ dẫn đến một khám phá mới</span>
            </p>

            <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
              ĐỌC ĐỂ HIỂU, KHÔNG CHỈ ĐỂ CHÉP
            </h1>

            <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#0f2942] dark:text-[#93c5fd] font-semibold sm:text-lg">
              Mỗi tài liệu là một bản đồ dẫn đến một khám phá mới — tổng hợp lý thuyết bản chất,
              chuyên đề trọng tâm và bộ đề luyện tập Vật lý THPT Tam Giang.
            </p>

            <p className="mx-auto max-w-xl text-xs leading-relaxed text-muted-foreground">
              Toàn bộ tài liệu chính thức được lưu trữ tập trung trên Google Drive của Trường THPT
              Tam Giang, mở công khai không cần đăng nhập để học sinh tra cứu và tải về nhanh chóng.
            </p>

            {/* Prominent Google Drive CTA Button */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <a
                href={APP_CONFIG.googleDriveFolderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-xl bg-[#16845A] dark:bg-[#38A875] px-6 py-3.5 text-sm font-bold text-white dark:text-[#0B1511] shadow-md hover:bg-[#126b48] dark:hover:bg-[#4ade80] transition-all hover:scale-105 active:scale-95"
              >
                <FolderOpen className="size-4.5" />
                <span>MỞ KHO TÀI LIỆU GOOGLE DRIVE</span>
                <ExternalLink className="size-4" />
              </a>

              <button
                type="button"
                onClick={() => setShowEmbedPreview(!showEmbedPreview)}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <Eye className="size-4 text-[#16845A] dark:text-[#72CF91]" />
                <span>
                  {showEmbedPreview ? "Ẩn khung xem trực tiếp" : "Xem trực tiếp trên trang"}
                </span>
              </button>
            </div>

            {/* Drive Permission info */}
            <div className="mx-auto flex max-w-md items-center justify-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck className="size-3.5 text-[#16845A] dark:text-[#72CF91]" />
              <span>
                Quyền truy cập: <strong>Anyone with the link – Viewer</strong> (Xem và tải về miễn
                phí)
              </span>
            </div>

            {/* Search Input */}
            <div className="mx-auto mt-6 max-w-xl">
              <div className="relative flex items-center">
                <Search className="absolute left-4 size-4 text-[#16845A] dark:text-[#72CF91]" />
                <input
                  type="text"
                  placeholder="Tìm kiếm danh mục: công thức, lý thuyết, đề thi, sai số..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card py-3.5 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-[#16845A] dark:focus:border-[#38A875] focus:ring-1 focus:ring-[#16845A]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Embedded Google Drive Preview (if user toggles) */}
        {showEmbedPreview && (
          <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen className="size-4 text-[#16845A] dark:text-[#72CF91]" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Khung duyệt thư mục Google Drive trực tiếp
                  </h3>
                </div>
                <a
                  href={APP_CONFIG.googleDriveFolderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#16845A] dark:text-[#72CF91] hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Mở toàn màn hình</span>
                  <ExternalLink className="size-3" />
                </a>
              </div>
              <div className="relative h-[500px] w-full overflow-hidden rounded-xl border border-border bg-black/5 dark:bg-black/40">
                <iframe
                  src={APP_CONFIG.googleDriveEmbedUrl}
                  title="Google Drive Trường THPT Tam Giang"
                  className="size-full border-0"
                  allow="fullscreen"
                />
              </div>
            </div>
          </section>
        )}

        {/* Filters & Content Area */}
        <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
          {/* Grade Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground mr-1 flex items-center gap-1">
                <GraduationCap className="size-3.5" /> Lọc theo khối lớp:
              </span>
              {[
                { id: "all", label: "Tất cả khối lớp" },
                { id: "10", label: "Lớp 10" },
                { id: "11", label: "Lớp 11" },
                { id: "12", label: "Lớp 12" },
              ].map((grade) => (
                <button
                  key={grade.id}
                  type="button"
                  onClick={() => setSelectedGrade(grade.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    selectedGrade === grade.id
                      ? "bg-[#16845A] dark:bg-[#38A875] text-white dark:text-[#0B1511] font-semibold"
                      : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted border border-border"
                  }`}
                >
                  {grade.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setOnlyFavorites((v) => !v)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1 ${
                  onlyFavorites
                    ? "bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40 font-semibold"
                    : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                <Star className={`size-3.5 ${onlyFavorites ? "fill-current" : ""}`} />
                <span>Đã lưu ({favoriteDocs.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs font-medium">
              <Link
                to="/cong-thuc"
                className="inline-flex items-center gap-1 text-[#16845A] dark:text-[#72CF91] hover:underline"
              >
                <Calculator className="size-3.5" /> Sổ tay công thức
              </Link>
              <Link
                to="/mo-phong"
                className="inline-flex items-center gap-1 text-[#16845A] dark:text-[#72CF91] hover:underline"
              >
                <Compass className="size-3.5" /> Phòng Lab
              </Link>
            </div>
          </div>

          {/* Drive Folders Grid */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#16845A] dark:text-[#72CF91]">
                Danh mục kho tài liệu Google Drive
              </h2>
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {filteredCategories.length} phân loại tài liệu
              </span>
            </div>

            {filteredCategories.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-8 text-center text-xs text-muted-foreground">
                Không có danh mục tài liệu nào khớp với bộ lọc hiện tại.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {filteredCategories.map((cat) => {
                  const isSaved = favoriteDocs.includes(cat.id);
                  return (
                    <div
                      key={cat.id}
                      className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-[#16845A]/50 dark:hover:border-[#72CF91]/50 group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#075C40] dark:text-[#72CF91]">
                            <FolderOpen className="size-3.5" />
                            {cat.code}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-medium text-muted-foreground">
                              {cat.gradeLabel}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleFavoriteItem("favoriteDocs", cat.id)}
                              className={`rounded-md p-1 transition-colors ${
                                isSaved
                                  ? "text-amber-500"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                              title={isSaved ? "Bỏ lưu danh mục" : "Lưu danh mục tài liệu"}
                              aria-label={isSaved ? "Bỏ lưu danh mục" : "Lưu danh mục tài liệu"}
                            >
                              <Star className={`size-4 ${isSaved ? "fill-amber-500" : ""}`} />
                            </button>
                          </div>
                        </div>

                        <h3 className="text-base font-bold text-foreground group-hover:text-[#16845A] dark:group-hover:text-[#72CF91] transition-colors">
                          {cat.name}
                        </h3>

                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {cat.description}
                        </p>

                        <div className="pt-2 border-t border-border">
                          <span className="text-[11px] font-medium text-muted-foreground block mb-1.5">
                            Tài liệu tiêu biểu:
                          </span>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-foreground/85">
                            {cat.topics.map((t) => (
                              <li key={t} className="truncate">
                                • {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                        <span className="text-[11px] text-[#16845A] dark:text-[#72CF91] flex items-center gap-1 font-medium">
                          <CheckCircle2 className="size-3.5" />
                          Thư mục Google Drive chính thức
                        </span>

                        <a
                          href={cat.driveFolderUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#16845A]/10 dark:bg-[#38A875]/15 border border-[#16845A]/30 dark:border-[#38A875]/40 px-3.5 py-1.5 text-xs font-semibold text-[#16845A] dark:text-[#72CF91] hover:bg-[#16845A]/20 transition-all"
                        >
                          <span>Mở thư mục</span>
                          <ExternalLink className="size-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Drive Sync Explanation Notice */}
          <div className="mt-12 rounded-2xl border border-border bg-secondary/50 p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#16845A] dark:text-[#72CF91]">
              <Info className="size-4.5" />
              <span>Cơ chế cập nhật tài liệu qua Google Drive</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground max-w-3xl">
              Kho tài liệu Trường THPT Tam Giang hiện được kết nối trực tiếp với thư mục Google
              Drive chính thức được cung cấp. Mọi tài liệu mới được tải lên thư mục này sẽ hiển thị
              ngay cho học sinh khi mở liên kết Drive. Website không sử dụng đường dẫn tệp giả hoặc
              nút tải giả.
            </p>
            <div className="pt-2">
              <a
                href={APP_CONFIG.googleDriveFolderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#16845A] dark:text-[#72CF91] hover:underline"
              >
                <span>Mở thư mục tổng hợp trên Google Drive</span>
                <ChevronRight className="size-3" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Unified Academic Footer */}
      <Footer />
    </div>
  );
}
