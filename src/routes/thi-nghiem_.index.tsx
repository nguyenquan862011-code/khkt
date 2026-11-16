/**
 * Thư viện thí nghiệm mở rộng — /thi-nghiem
 * Tìm kiếm theo tên/mã · lọc chủ đề/cấp độ/loại · phân trang · thống kê thật.
 */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FlaskConical, Search, SlidersHorizontal } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { ExperimentCard } from "@/components/experiments/experiment-card";
import {
  ALL_EXPERIMENTS,
  EXPERIMENT_KIND_LABELS,
  EXPERIMENT_LEVEL_LABELS,
  EXPERIMENT_TOPIC_LABELS,
  countByTopic,
  filterExperiments,
} from "@/data/experiments";
import type { ExperimentKind, ExperimentLevel, ExperimentTopic } from "@/data/experiments/types";

const PAGE_SIZE = 12;

export const Route = createFileRoute("/thi-nghiem_/")({
  head: () => ({
    meta: [
      { title: "Thư viện Thí nghiệm Vật lý | Trường THPT Tam Giang" },
      {
        name: "description",
        content:
          "Thư viện 1000+ thí nghiệm Vật lý THPT: mô phỏng tương tác, quy trình, bảng số liệu và câu hỏi kiểm tra cho từng thí nghiệm.",
      },
    ],
  }),
  component: ThiNghiemLibraryPage,
});

function ThiNghiemLibraryPage() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<ExperimentTopic | "all">("all");
  const [level, setLevel] = useState<ExperimentLevel | "all">("all");
  const [kind, setKind] = useState<ExperimentKind | "all">("all");
  const [page, setPage] = useState(1);

  const results = useMemo(() => {
    return filterExperiments({ query, topic, level, kind });
  }, [query, topic, level, kind]);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const byTopic = useMemo(() => countByTopic(), []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200">
      <SiteHeader currentPath="/thi-nghiem" />

      <main className="flex-1 pb-20">
        {/* Hero */}
        <section className="border-b border-border bg-gradient-to-b from-secondary/50 via-background to-background px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#16845A] dark:text-[#72CF91]">
              <FlaskConical className="size-3.5" /> Thư viện thí nghiệm · Đợt 1
            </p>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-4xl">
              Thí nghiệm Vật lý THPT
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Mỗi thí nghiệm gồm đầy đủ 14 phần: giới thiệu, mục tiêu, kiến thức, dụng cụ, quy
              trình, mô phỏng tương tác, bảng số liệu, giải thích, kết luận và câu hỏi kiểm tra.
            </p>
            <p className="mt-2 text-xs font-semibold text-[#16845A]">
              Đang có {ALL_EXPERIMENTS.length} thí nghiệm — tiếp tục bổ sung theo đợt.
            </p>
          </div>
        </section>

        {/* Bộ lọc */}
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <SlidersHorizontal className="size-4" /> Tìm kiếm & Lọc
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-4">
              <label className="md:col-span-1">
                <span className="sr-only">Tìm kiếm</span>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Tên, mã thí nghiệm…"
                    className="w-full rounded-xl border border-input bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#16845A]"
                  />
                </div>
              </label>
              <select
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value as ExperimentTopic | "all");
                  setPage(1);
                }}
                className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#16845A]"
              >
                <option value="all">Tất cả chủ đề</option>
                {Object.entries(EXPERIMENT_TOPIC_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <select
                value={level}
                onChange={(e) => {
                  setLevel(e.target.value as ExperimentLevel | "all");
                  setPage(1);
                }}
                className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#16845A]"
              >
                <option value="all">Tất cả cấp độ</option>
                {Object.entries(EXPERIMENT_LEVEL_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <select
                value={kind}
                onChange={(e) => {
                  setKind(e.target.value as ExperimentKind | "all");
                  setPage(1);
                }}
                className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#16845A]"
              >
                <option value="all">Tất cả loại</option>
                {Object.entries(EXPERIMENT_KIND_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            {/* Thống kê theo chủ đề */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {Object.entries(EXPERIMENT_TOPIC_LABELS).map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => {
                    setTopic(topic === k ? "all" : (k as ExperimentTopic));
                    setPage(1);
                  }}
                  className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                    topic === k
                      ? "border-[#16845A] bg-[#16845A] text-white"
                      : "border-border text-muted-foreground hover:border-[#16845A] hover:text-foreground"
                  }`}
                >
                  {label} · {byTopic[k as ExperimentTopic] ?? 0}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Danh sách card */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="mb-4 text-sm text-muted-foreground">
            Tìm thấy <strong className="text-foreground">{results.length}</strong> thí nghiệm
            {query ? ` cho “${query}”` : ""}.
          </p>
          {pageItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
              Không tìm thấy thí nghiệm phù hợp. Thử đổi từ khoá hoặc bỏ bớt bộ lọc.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pageItems.map((e) => (
                <ExperimentCard key={e.id} experiment={e} />
              ))}
            </div>
          )}

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
                className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-40"
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`min-w-9 rounded-lg border px-3 py-2 text-sm ${
                    p === currentPage
                      ? "border-[#16845A] bg-[#16845A] text-white"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage(currentPage + 1)}
                className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
