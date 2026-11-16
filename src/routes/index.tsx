import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { UniformCircularMotionExperiment } from "@/components/circular-motion-experiment";
import { ExperimentPhoto } from "@/components/experiment-photo";
import { ExperimentPracticeLink } from "@/components/practice/experiment-practice-link";
import { ShowcaseTopics } from "@/components/showcase-topics";
import { InteractivePhysicsLab } from "@/components/interactive-physics-lab";
import { curriculum, searchLessons, type LessonMeta } from "@/data/curriculum";
import { CLASSIC_EXPERIMENTS } from "@/data/classic-experiments";
import { FORMULA_DATABASE } from "@/data/formulas";
import { VDC_PROBLEMS } from "@/data/vdc-problems";
import { getExperimentPhoto } from "@/data/experiment-photos";
import { getSubmissionsHistory, type StoredSubmission } from "@/lib/submission-service";
import {
  getLearningState,
  subscribeLearningState,
  updateStudyPreferences,
  type GradePreference,
  type LearningState,
  type StudyLevel,
} from "@/lib/learning-store";
import {
  ArrowRight,
  Compass,
  BookOpen,
  Sparkles,
  Activity,
  Zap,
  Radio,
  Sliders,
  CheckCircle2,
  Search,
  X,
  History,
  Award,
  Calculator,
  Trophy,
  Waves,
  Orbit,
  GraduationCap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TAMGIANG PHYSICS — Trường THPT Tam Giang | Phòng thí nghiệm Vật lý số" },
      {
        name: "description",
        content:
          "TAMGIANG PHYSICS – Trường THPT Tam Giang: Không gian học tập thực nghiệm không cần đăng nhập với hơn 777+ mô phỏng Vật lý, chuyển động tròn đều và kho học liệu THPT.",
      },
      {
        property: "og:title",
        content: "TAMGIANG PHYSICS — Trường THPT Tam Giang | Phòng thí nghiệm Vật lý số",
      },
      {
        property: "og:description",
        content:
          "Đừng chỉ học công thức. Hãy quan sát cách thế giới vận hành. Trải nghiệm mô phỏng tương tác trực tiếp dành riêng cho học sinh Trường THPT Tam Giang.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

interface FeaturedLabExperiment {
  id: string;
  photoId: string;
  title: string;
  domain: string;
  grade: "Lớp 10" | "Lớp 11" | "Lớp 12";
  level: StudyLevel;
  description: string;
  splat: string;
  icon: typeof Waves;
}

const LAB_EXPERIMENTS: FeaturedLabExperiment[] = [
  {
    id: "circular-motion",
    photoId: "circular-motion",
    title: "Chuyển động tròn đều – Gia tốc hướng tâm",
    domain: "Động học & Lực hướng tâm",
    grade: "Lớp 10",
    level: "co-ban",
    description:
      "Khảo sát quỹ đạo tròn tâm O, vectơ vận tốc tiếp tuyến v, gia tốc hướng tâm aht và góc quay φ theo bán kính R và tốc độ góc ω.",
    splat:
      "lop-10/co-hoc-phan-1/chu-de-2-mo-ta-chuyen-dong/bai-1-do-dich-chuyen-quang-duong-di-duoc/1-ly-thuyet-do-dich-chuyen-quang-duong-di-duoc",
    icon: Orbit,
  },
  {
    id: "water-interference",
    photoId: "water-interference",
    title: "Giao thoa sóng nước – Chồng chất hai nguồn",
    domain: "Sóng cơ & Giao thoa",
    grade: "Lớp 11",
    level: "thong-hieu",
    description:
      "Quan sát hai nguồn sóng kết hợp trên mặt nước, điều chỉnh bước sóng λ, tần số f, biên độ a và đo hiệu đường đi d₂ − d₁.",
    splat:
      "lop-11/song/chu-de-3-giao-thoa-song/bai-1-giao-thoa-song-co/1-ly-thuyet-giao-thoa-song-co",
    icon: Waves,
  },
  {
    id: "pendulum",
    photoId: "pendulum",
    title: "Đo chu kì con lắc đơn & Bảo toàn cơ năng",
    domain: "Dao động & Thực hành",
    grade: "Lớp 10",
    level: "co-ban",
    description:
      "Tương tác với chiều dài dây, gia tốc trọng trường g và đồng hồ bấm giờ để xác định chu kỳ dao động và sai số phép đo.",
    splat:
      "lop-10/co-hoc-phan-1/chu-de-1-gioi-thieu-muc-dich-hoc-tap-mon-vat-ly/bai-3-sai-so-trong-phep-do/2-vd6-do-chu-ki-con-lac-don",
    icon: Activity,
  },
  {
    id: "projectile",
    photoId: "projectile",
    title: "Chuyển động ném xiên trong trọng trường",
    domain: "Cơ học",
    grade: "Lớp 10",
    level: "thong-hieu",
    description:
      "Phân tích quỹ đạo parabol, tầm bay xa, tầm bay cao phụ thuộc vào vận tốc đầu v₀ và góc ném α.",
    splat:
      "lop-10/co-hoc-phan-1/chu-de-2-mo-ta-chuyen-dong/bai-6-chuyen-dong-nem/1-ly-thuyet-chuyen-dong-nem",
    icon: Compass,
  },
  {
    id: "newton",
    photoId: "newton",
    title: "Ba định luật Newton & Gia tốc",
    domain: "Động lực học",
    grade: "Lớp 10",
    level: "co-ban",
    description:
      "Khảo sát mối quan hệ giữa hợp lực tác dụng, khối lượng quán tính và gia tốc chuyển động của vật rắn trên đệm khí.",
    splat:
      "lop-10/co-hoc-phan-1/chu-de-3-luc-va-chuyen-dong/bai-2-ba-dinh-luat-newton/1-ly-thuyet-ba-dinh-luat-newton",
    icon: Sliders,
  },
  {
    id: "standing-wave",
    photoId: "standing-wave",
    title: "Sóng dừng trên dây đàn hồi",
    domain: "Sóng cơ",
    grade: "Lớp 11",
    level: "thong-hieu",
    description:
      "Quan sát các nút sóng, bụng sóng và điều kiện hình thành sóng dừng trên sợi dây hai đầu cố định.",
    splat: "lop-11/song/chu-de-4-song-dung/bai-1-song-dung/1-ly-thuyet-song-dung",
    icon: Radio,
  },
  {
    id: "lorentz",
    photoId: "lorentz",
    title: "Proton trong điện trường & từ trường",
    domain: "Từ trường & Điện tích",
    grade: "Lớp 12",
    level: "nang-cao",
    description:
      "Khảo sát quỹ đạo chuyển động của hạt mang điện dưới tác dụng đồng thời của lực điện và lực từ Lorentz.",
    splat:
      "lop-12/tu-truong/chu-de-1-tu-truong/bai-2-luc-tu/2-vd9-proton-trong-dien-truong-va-tu-truong",
    icon: Zap,
  },
  {
    id: "ripple-diffraction",
    photoId: "ripple-diffraction",
    title: "Nhiễu xạ & Truyền sóng trên mặt nước",
    domain: "Sóng cơ",
    grade: "Lớp 11",
    level: "thong-hieu",
    description:
      "Theo dõi sự truyền pha sóng phẳng qua khe hẹp và vật cản trong bể gợn sóng quang học.",
    splat: "lop-11/song/chu-de-1-song-co/bai-1-mo-ta-song/1-ly-thuyet-mo-ta-song",
    icon: Waves,
  },
];

const ECOSYSTEM_MODULES = [
  {
    to: "/thi-nghiem-kinh-dien" as const,
    title: "30 Thí nghiệm Kinh điển",
    subtitle: "Galilei, Newton, Young, Faraday, Einstein",
    icon: History,
  },
  {
    to: "/vdc" as const,
    title: "Thử thách VDC",
    subtitle: "Khi công thức không còn đủ, tư duy sẽ dẫn đường",
    icon: Award,
  },
  {
    to: "/thiet-ke-thi-nghiem" as const,
    title: "Thiết kế Lab & Sai số",
    subtitle: "Biến ý tưởng thành thí nghiệm có thể kiểm chứng",
    icon: Sliders,
  },
  {
    to: "/cong-thuc" as const,
    title: "Sổ tay Công thức",
    subtitle: "Mỗi công thức là một câu chuyện của tự nhiên",
    icon: Calculator,
  },
];

const FOCUS_TOPIC_OPTIONS = [
  { id: "all", label: "Mọi chuyên đề" },
  { id: "cơ học", label: "Cơ học & Chuyển động" },
  { id: "sóng", label: "Dao động & Sóng nước" },
  { id: "điện", label: "Điện trường & Dòng điện" },
  { id: "từ", label: "Từ trường & Cảm ứng" },
  { id: "nhiệt", label: "Nhiệt học & Chất khí" },
];

const LEVEL_OPTIONS: { id: StudyLevel; label: string }[] = [
  { id: "co-ban", label: "Cơ bản" },
  { id: "thong-hieu", label: "Thông hiểu" },
  { id: "nang-cao", label: "Nâng cao" },
];

function getKindLabel(kind: LessonMeta["kind"]) {
  switch (kind) {
    case "theory":
      return "Lý thuyết";
    case "example":
      return "Ví dụ";
    case "exercise":
      return "Bài tập";
    case "practice":
      return "Luyện tập";
    default:
      return "Bài học";
  }
}

function Index() {
  const [quickQuery, setQuickQuery] = useState("");
  const [recentSubmissions, setRecentSubmissions] = useState<StoredSubmission[]>([]);
  const [learningState, setLearningState] = useState<LearningState>(() => getLearningState());

  useEffect(() => {
    setRecentSubmissions(getSubmissionsHistory().slice(0, 3));
    return subscribeLearningState(setLearningState);
  }, []);

  const searchResults = useMemo(() => {
    const trimmed = quickQuery.trim();
    if (trimmed.length < 2) return [];
    return searchLessons(trimmed).slice(0, 6);
  }, [quickQuery]);

  const { preferences } = learningState;

  // Tailored lesson recommendations without login
  const personalizedLessons = useMemo(() => {
    const allLessons = Object.values(curriculum.lessons);
    const filtered = allLessons.filter((lesson) => {
      const gradeOk = preferences.grade === "all" || lesson.grade === preferences.grade;
      const topicOk =
        preferences.focusTopic === "all" ||
        `${lesson.part} ${lesson.topic} ${lesson.name}`
          .toLowerCase()
          .includes(preferences.focusTopic);
      const levelOk =
        preferences.level === "co-ban"
          ? lesson.kind === "theory"
          : preferences.level === "nang-cao"
            ? lesson.kind === "exercise" || lesson.kind === "practice"
            : true;
      return gradeOk && topicOk && levelOk;
    });
    return filtered.slice(0, 4);
  }, [preferences]);

  const displayedExperiments = useMemo(() => {
    if (preferences.grade === "all" && preferences.focusTopic === "all") {
      return LAB_EXPERIMENTS;
    }
    const sorted = [...LAB_EXPERIMENTS].sort((a, b) => {
      const aMatch =
        (preferences.grade === "all" || a.grade === preferences.grade ? 2 : 0) +
        (preferences.focusTopic !== "all" &&
        `${a.domain} ${a.title}`.toLowerCase().includes(preferences.focusTopic)
          ? 2
          : 0) +
        (a.level === preferences.level ? 1 : 0);
      const bMatch =
        (preferences.grade === "all" || b.grade === preferences.grade ? 2 : 0) +
        (preferences.focusTopic !== "all" &&
        `${b.domain} ${b.title}`.toLowerCase().includes(preferences.focusTopic)
          ? 2
          : 0) +
        (b.level === preferences.level ? 1 : 0);
      return bMatch - aMatch;
    });
    return sorted;
  }, [preferences]);

  const featuredRealPhotos = useMemo(() => {
    return [
      getExperimentPhoto("water-interference"),
      getExperimentPhoto("pendulum"),
      getExperimentPhoto("lorentz"),
      getExperimentPhoto("ripple-diffraction"),
    ].filter((p): p is NonNullable<typeof p> => p !== null);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200">
      {/* Unified Academic Header */}
      <SiteHeader currentPath="/" />

      <main className="flex-1">
        {/* Original Dark-Green Scientific Hero Section + Interactive Uniform Circular Motion Lab */}
        <section
          aria-labelledby="hero-title"
          className="relative overflow-hidden border-b border-border bg-gradient-to-b from-[#0d1d16] via-background to-background px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
        >
          {/* Subtle Lab Grid & Emerald-Lime Ambient Glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(56, 168, 117, 0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 168, 117, 0.16) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage: "radial-gradient(ellipse 80% 70% at 50% 25%, #000 40%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 70% at 50% 25%, #000 40%, transparent 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-36 -left-28 size-[30rem] rounded-full bg-[#16845A]/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/4 -right-32 size-[26rem] rounded-full bg-[#C8ED78]/10 blur-3xl"
          />

          <div className="relative mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
              {/* Left Column: Original Mission Headline, Intro & Actions */}
              <div className="space-y-6 lg:col-span-5">
                <p className="inline-flex items-start gap-2 rounded-full border border-[#38A875]/35 bg-[#16845A]/15 px-3.5 py-1.5 font-mono text-xs font-semibold tracking-wide text-[#16845A] dark:text-[#C8ED78]">
                  <Sparkles className="mt-0.5 size-3.5 shrink-0 text-[#16845A] dark:text-[#C8ED78]" />
                  <span>Trường THPT Tam Giang · Phòng thí nghiệm Vật lý số</span>
                </p>

                <h1
                  id="hero-title"
                  className="text-balance text-3xl font-extrabold tracking-tight sm:text-5xl sm:leading-[1.12]"
                >
                  Đừng chỉ học công thức.{" "}
                  <span className="text-gradient-science">Hãy quan sát cách thế giới</span> vận
                  hành.
                </h1>

                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Mỗi hiện tượng được tái hiện thành mô phỏng thực nghiệm để học sinh THPT Tam Giang
                  tự thay đổi thông số, quan sát trực tiếp bản chất vật lý và làm chủ kiến thức —
                  không cần đăng nhập.
                </p>

                {/* Primary Hero CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Link
                    to="/mo-phong"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#16845A] dark:bg-[#38A875] px-5 py-3 text-sm font-bold text-white dark:text-[#0B1511] shadow-md hover:bg-[#126b48] dark:hover:bg-[#72CF91] transition-all hover:scale-[1.01] active:scale-[0.99] whitespace-nowrap shrink-0"
                  >
                    <Compass className="size-4" />
                    <span>Vào phòng thí nghiệm</span>
                    <ArrowRight className="size-4" />
                  </Link>

                  <a
                    href="#mo-phong-tieu-bieu"
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/80 px-5 py-3 text-sm font-semibold text-foreground hover:border-[#38A875]/60 hover:bg-secondary transition-all whitespace-nowrap shrink-0"
                  >
                    <span>Khám phá mô phỏng</span>
                  </a>
                </div>

                {/* Homepage Learning Principles */}
                <div className="rounded-2xl border border-border bg-card/75 p-4 space-y-2 text-xs text-muted-foreground backdrop-blur-xs">
                  <p className="font-semibold text-foreground">
                    Triết lý thực nghiệm tại TamGiang Physics:
                  </p>
                  <ul className="space-y-1.5">
                    <li>
                      • Quan sát sự biến đổi vectơ trực tiếp thay vì học thuộc công thức rời rạc.
                    </li>
                    <li>• Thử thay đổi một thông số và dự đoán trước khi chạy kiểm chứng.</li>
                    <li>• Hiểu được vì sao quan trọng hơn nhớ được bao nhiêu công thức.</li>
                  </ul>
                </div>

                {/* Verified Academic Statistics */}
                <div className="grid grid-cols-3 gap-4 border-t border-border pt-5">
                  <div className="space-y-0.5">
                    <div className="font-mono text-2xl font-bold tabular-nums text-[#16845A] dark:text-[#C8ED78]">
                      {curriculum.total}+
                    </div>
                    <div className="text-xs text-muted-foreground">Bài học & Mô phỏng</div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="font-mono text-2xl font-bold tabular-nums text-[#16845A] dark:text-[#72CF91]">
                      {CLASSIC_EXPERIMENTS.length} CE · {VDC_PROBLEMS.length} VDC
                    </div>
                    <div className="text-xs text-muted-foreground">Thí nghiệm & Thử thách</div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="font-mono text-2xl font-bold tabular-nums text-[#16845A] dark:text-[#72CF91]">
                      {FORMULA_DATABASE.length} Công thức
                    </div>
                    <div className="text-xs text-muted-foreground">8 Chuyên đề THPT</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Featured Uniform Circular Motion Interactive Simulation */}
              <div className="lg:col-span-7">
                <UniformCircularMotionExperiment />
                <div className="mt-3 grid items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 sm:grid-cols-[11rem_1fr]">
                  <ExperimentPhoto photoId="circular-motion" compact showCaption={false} />
                  <div className="space-y-2 text-xs leading-relaxed text-[#EDF5ED]/85">
                    <p>
                      <b className="text-[#C8ED78]">Đối chiếu thực tế:</b> vành bánh xe quay đều —
                      mọi điểm trên vành có cùng tốc độ góc, gia tốc luôn hướng vào trục quay.
                    </p>
                    <ExperimentPracticeLink experimentId="circular-motion" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Ecosystem Strip */}
            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {ECOSYSTEM_MODULES.map((mod) => {
                const Icon = mod.icon;
                return (
                  <Link
                    key={mod.to}
                    to={mod.to}
                    className="group flex items-start gap-3 rounded-xl border border-border bg-card/85 p-3.5 transition-all hover:border-[#38A875]/60 hover:bg-card"
                  >
                    <div className="rounded-lg border border-border bg-secondary p-2 text-[#16845A] dark:text-[#72CF91] shrink-0">
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 text-xs font-semibold text-foreground group-hover:text-[#16845A] dark:group-hover:text-[#C8ED78]">
                        <span className="truncate">{mod.title}</span>
                        <ArrowRight className="size-3 shrink-0 opacity-60 transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-1">
                        {mod.subtitle}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Auth-Free Personalization Bar (Optional, Saved in Browser Only) */}
        <section
          id="ca-nhan-hoa"
          className="border-b border-border bg-secondary/40 px-4 py-8 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl space-y-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#16845A] dark:text-[#72CF91]">
                  <GraduationCap className="size-3.5" />
                  <span>Không cần đăng nhập · Tự chọn lộ trình học ngay</span>
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  Cá nhân hóa gợi ý học tập cho học sinh THPT Tam Giang
                </h2>
              </div>

              {(preferences.grade !== "all" || preferences.focusTopic !== "all") && (
                <button
                  type="button"
                  onClick={() =>
                    updateStudyPreferences({ grade: "all", focusTopic: "all", level: "thong-hieu" })
                  }
                  className="self-start text-xs font-medium text-[#16845A] dark:text-[#C8ED78] hover:underline"
                >
                  Xem lại toàn bộ chương trình
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5 lg:grid-cols-12">
              <div className="lg:col-span-4 space-y-2">
                <span className="block text-xs font-semibold text-foreground">
                  1. Chọn khối lớp của bạn
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(["all", "Lớp 10", "Lớp 11", "Lớp 12"] as GradePreference[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => updateStudyPreferences({ grade: g })}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        preferences.grade === g
                          ? "bg-[#16845A] dark:bg-[#38A875] text-white dark:text-[#0B1511] font-semibold"
                          : "border border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {g === "all" ? "Tất cả khối" : g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-2">
                <span className="block text-xs font-semibold text-foreground">
                  2. Chủ đề đang quan tâm
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {FOCUS_TOPIC_OPTIONS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => updateStudyPreferences({ focusTopic: t.id })}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        preferences.focusTopic === t.id
                          ? "bg-[#16845A] dark:bg-[#38A875] text-white dark:text-[#0B1511] font-semibold"
                          : "border border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-3 space-y-2">
                <span className="block text-xs font-semibold text-foreground">
                  3. Mức độ kiến thức
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {LEVEL_OPTIONS.map((lv) => (
                    <button
                      key={lv.id}
                      type="button"
                      onClick={() => updateStudyPreferences({ level: lv.id })}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        preferences.level === lv.id
                          ? "bg-[#16845A] dark:bg-[#38A875] text-white dark:text-[#0B1511] font-semibold"
                          : "border border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {lv.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Curriculum Lessons matching Preferences */}
            {personalizedLessons.length > 0 && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {personalizedLessons.map((lesson) => (
                  <Link
                    key={lesson.fullPath}
                    to="/mo-phong/$"
                    params={{ _splat: lesson.fullPath }}
                    className="group flex flex-col justify-between rounded-xl border border-border bg-card p-3.5 transition-all hover:border-[#38A875]/60"
                  >
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] font-semibold uppercase text-[#16845A] dark:text-[#72CF91]">
                        {lesson.grade} · {getKindLabel(lesson.kind)}
                      </span>
                      <p className="text-xs font-semibold text-foreground group-hover:text-[#16845A] dark:group-hover:text-[#C8ED78] line-clamp-2">
                        {lesson.name}
                      </p>
                    </div>
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <span className="truncate">{lesson.topic}</span>
                      <ArrowRight className="size-3 shrink-0" />
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Recent Study Activity & Personal Progress (Local Browser Storage) */}
        {(recentSubmissions.length > 0 ||
          learningState.viewedLessons.length > 0 ||
          learningState.completedLabs.length > 0 ||
          learningState.solvedVdcIds.length > 0) && (
          <section className="border-b border-border bg-secondary/25 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#16845A] dark:text-[#72CF91]">
                  <Trophy className="size-3.5" />
                  <span>Tiến độ thực nghiệm đang lưu trên trình duyệt</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono tabular-nums text-muted-foreground">
                  <span>
                    Đã xem:{" "}
                    <strong className="text-foreground">
                      {learningState.viewedLessons.length}
                    </strong>{" "}
                    bài
                  </span>
                  <span>
                    Lab 5 lĩnh vực:{" "}
                    <strong className="text-[#16845A] dark:text-[#72CF91]">
                      {learningState.completedLabs.length}/5
                    </strong>
                  </span>
                  <span>
                    VDC đúng:{" "}
                    <strong className="text-[#16845A] dark:text-[#C8ED78]">
                      {learningState.solvedVdcIds.length}/{VDC_PROBLEMS.length}
                    </strong>
                  </span>
                  <Link
                    to="/mo-phong"
                    className="font-sans font-medium text-foreground hover:underline"
                  >
                    Mở Phòng Lab →
                  </Link>
                </div>
              </div>
              {recentSubmissions.length > 0 && (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {recentSubmissions.map((item) => (
                    <Link
                      key={item.id}
                      to="/mo-phong/$"
                      params={{ _splat: item.lessonPath }}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-[#16845A]/50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-foreground">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          Đúng {item.correctCount}/{item.totalQuestions} câu · {item.timeSpent}
                        </p>
                      </div>
                      <span className="font-mono text-base font-bold tabular-nums text-[#16845A] dark:text-[#C8ED78] shrink-0">
                        {item.score.toFixed(1)}đ
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Interactive 5-Domain Digital Lab Workbench */}
        <section className="border-b border-border bg-background px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1.5">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#16845A] dark:text-[#72CF91]">
                  Đã đến lúc tự tay kiểm chứng điều bạn vừa học
                </span>
                <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
                  Phòng Thí Nghiệm Số 5 Lĩnh Vực
                </h2>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Thay đổi thông số, dự đoán kết quả trước khi chạy, so sánh hai lần đo (Lần A vs
                  Lần B) và quan sát quy luật trực tiếp trên đồ thị.
                </p>
              </div>
              <Link
                to="/mo-phong"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16845A] dark:text-[#72CF91] hover:underline whitespace-nowrap shrink-0"
              >
                <span>Mở toàn bộ {curriculum.total}+ bài mô phỏng</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <InteractivePhysicsLab initialDomain="co-hoc" />
          </div>
        </section>

        {/* Featured Laboratory Experiments with Verified Real Lab Photographs */}
        <section
          id="mo-phong-tieu-bieu"
          className="border-b border-border bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-2">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#16845A] dark:text-[#72CF91]">
                  Phòng thí nghiệm kỹ thuật số · Ảnh chụp thực tế từng thí nghiệm
                </span>
                <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
                  MÔ PHỎNG VẬT LÝ TIÊU BIỂU
                </h2>
                <p className="text-sm text-muted-foreground">
                  Đối chiếu hiện tượng thực tế trong phòng Lab với mô phỏng tương tác, hoặc tìm kiếm
                  nhanh trong toàn bộ {curriculum.total} bài học Lớp 10–11–12.
                </p>
              </div>

              {/* Quick Simulation Search */}
              <div className="relative w-full lg:max-w-md">
                <div className="relative flex items-center">
                  <Search className="pointer-events-none absolute left-3.5 size-4 text-muted-foreground" />
                  <input
                    type="search"
                    value={quickQuery}
                    onChange={(e) => setQuickQuery(e.target.value)}
                    placeholder="Tìm nhanh: chuyển động tròn đều, giao thoa, con lắc..."
                    className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-9 text-xs text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-[#38A875]"
                    aria-label="Tìm nhanh bài mô phỏng trong 777+ bài học"
                  />
                  {quickQuery && (
                    <button
                      type="button"
                      onClick={() => setQuickQuery("")}
                      className="absolute right-2.5 rounded p-1 text-muted-foreground hover:text-foreground"
                      aria-label="Xóa từ khóa tìm kiếm"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                {quickQuery.trim().length >= 2 && (
                  <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
                    {searchResults.length === 0 ? (
                      <div className="p-4 text-center text-xs text-muted-foreground">
                        Không tìm thấy bài học phù hợp với &ldquo;{quickQuery}&rdquo;.
                      </div>
                    ) : (
                      <div className="divide-y divide-border/70">
                        {searchResults.map((lesson) => (
                          <Link
                            key={lesson.fullPath}
                            to="/mo-phong/$"
                            params={{ _splat: lesson.fullPath }}
                            className="flex items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-secondary"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-foreground">
                                {lesson.name}
                              </p>
                              <p className="truncate text-[11px] text-muted-foreground">
                                {lesson.grade} · {lesson.topic} · {getKindLabel(lesson.kind)}
                              </p>
                            </div>
                            <ArrowRight className="size-3.5 shrink-0 text-[#16845A] dark:text-[#72CF91]" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {displayedExperiments.map((exp) => {
                const IconComponent = exp.icon;
                return (
                  <div
                    key={exp.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:border-[#38A875]/60 hover:shadow-md"
                  >
                    <div className="p-2.5 pb-0">
                      <ExperimentPhoto photoId={exp.photoId} compact />
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-5 pt-3.5">
                      <div>
                        <div className="mb-2.5 flex items-center justify-between gap-2">
                          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#16845A] dark:text-[#72CF91]">
                            {exp.domain} · {exp.grade}
                          </span>
                          <div className="rounded-lg border border-border bg-secondary p-1.5 text-[#16845A] dark:text-[#72CF91]">
                            <IconComponent className="size-3.5" />
                          </div>
                        </div>

                        <h3 className="text-sm font-bold text-foreground group-hover:text-[#16845A] dark:group-hover:text-[#C8ED78] transition-colors">
                          {exp.title}
                        </h3>

                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                          {exp.description}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                        <span className="font-mono text-[10px] text-muted-foreground">
                          THPT Tam Giang
                        </span>
                        <Link
                          to="/mo-phong/$"
                          params={{ _splat: exp.splat }}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#16845A] dark:text-[#72CF91] group-hover:translate-x-0.5 transition-transform hover:underline"
                        >
                          <span>Khám phá ngay</span>
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Real Physics Photography Archive Strip with Verified Credits */}
        <section className="border-b border-border bg-secondary/35 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#16845A] dark:text-[#72CF91]">
                  Thư viện tư liệu ảnh thực nghiệm xác thực
                </span>
                <h2 className="text-xl font-bold tracking-tight sm:text-2xl text-foreground">
                  Quan sát hiện tượng thực tế từ phòng thí nghiệm vật lý
                </h2>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                Nguồn ảnh mở: Wikimedia Commons (CC0 / CC BY-SA / BSD)
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featuredRealPhotos.map((photo) => (
                <ExperimentPhoto key={photo.id} photoId={photo.id} />
              ))}
            </div>
          </div>
        </section>

        {/* 4-Step Scientific Learning Methodology */}
        <section
          id="phuong-phap"
          className="border-b border-border bg-secondary/50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl space-y-2 text-center">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#16845A] dark:text-[#72CF91]">
                Phương pháp học Vật lý chuẩn 4 bước
              </span>
              <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
                HIỂU BẢN CHẤT – LÀM CHỦ TRI THỨC
              </h2>
              <p className="text-sm text-muted-foreground">
                Chuyển hóa từ học thuộc công thức thụ động sang tư duy thực nghiệm khoa học.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  num: "01",
                  title: "Bước 1 – Quan sát",
                  desc: "Chứng kiến hiện tượng vật lý qua ảnh thí nghiệm thực tế và mô phỏng trực quan thay vì hình dung trừu tượng.",
                  badge: "Kích thích tò mò khoa học",
                },
                {
                  num: "02",
                  title: "Bước 2 – Đặt câu hỏi",
                  desc: "Tự đặt câu hỏi về nguyên nhân, mối liên hệ giữa bán kính, vận tốc, lực, bước sóng và cấu trúc hiện tượng.",
                  badge: "Đặt giả thuyết ban đầu",
                },
                {
                  num: "03",
                  title: "Bước 3 – Dự đoán & Kiểm chứng",
                  desc: "Đưa ra dự đoán trước khi xem đáp án, sau đó kéo thanh trượt thông số để kiểm chứng trực tiếp.",
                  badge: "Khám phá quy luật định lượng",
                },
                {
                  num: "04",
                  title: "Bước 4 – Phân tích & Vận dụng",
                  desc: "Rút ra công thức bản chất, kiểm tra thứ nguyên SI và giải quyết bài toán thực tiễn & VDC.",
                  badge: "Làm chủ kiến thức THPT",
                },
              ].map((step) => (
                <div
                  key={step.num}
                  className="relative space-y-3.5 rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <div className="inline-flex size-10 items-center justify-center rounded-xl border border-[#38A875]/35 bg-[#16845A]/15 font-mono text-sm font-bold text-[#16845A] dark:text-[#C8ED78]">
                    {step.num}
                  </div>
                  <h3 className="text-base font-bold text-foreground">{step.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
                  <div className="flex items-center gap-2 pt-2 text-[11px] font-medium text-[#16845A] dark:text-[#72CF91]">
                    <CheckCircle2 className="size-3.5 shrink-0" />
                    <span>{step.badge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Curriculum Knowledge Domains */}
        <section className="border-b border-border bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <ShowcaseTopics />
          </div>
        </section>

        {/* Materials / Google Drive Promo Section */}
        <section className="bg-secondary/30 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-md">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
                <div className="space-y-4 md:col-span-8">
                  <p className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#16845A] dark:text-[#72CF91]">
                    <BookOpen className="size-3.5" />
                    <span>Kho học liệu Trường THPT Tam Giang</span>
                  </p>
                  <h3 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
                    Đọc để hiểu, không chỉ để chép.
                  </h3>
                  <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Mỗi tài liệu là một bản đồ dẫn đến một khám phá mới. Toàn bộ chuyên đề lý
                    thuyết, bài tập tự luyện và đề kiểm tra Lớp 10–11–12 được đồng bộ công khai qua
                    Google Drive.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      to="/tai-lieu"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#16845A] dark:bg-[#38A875] px-5 py-2.5 text-xs font-semibold text-white dark:text-[#0B1511] hover:bg-[#126b48] dark:hover:bg-[#72CF91] transition-colors"
                    >
                      <BookOpen className="size-4" />
                      <span>Truy cập Kho tài liệu</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col gap-3 rounded-2xl border border-border bg-secondary p-5 md:col-span-4">
                  <div className="font-mono text-xs font-semibold text-foreground">
                    Mở tự do · Không cần đăng nhập
                  </div>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                      <span>Công thức trọng tâm:</span>
                      <span className="font-mono font-medium tabular-nums text-foreground">
                        Lớp 10–11–12
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                      <span>Đề thi thử & Kiểm tra:</span>
                      <span className="font-mono font-medium text-foreground">Có đáp án</span>
                    </div>
                    <div className="flex items-center justify-between pb-0.5">
                      <span>Quyền truy cập:</span>
                      <span className="font-mono font-medium text-[#16845A] dark:text-[#72CF91]">
                        Công khai miễn phí
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Unified Academic Footer */}
      <Footer />
    </div>
  );
}
