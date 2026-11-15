import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X, ArrowRight, Compass, History, Calculator, Award } from "lucide-react";
import { searchLessons } from "@/data/curriculum";
import { CLASSIC_EXPERIMENTS } from "@/data/classic-experiments";
import { FORMULA_DATABASE } from "@/data/formulas";
import { VDC_PROBLEMS } from "@/data/vdc-problems";

interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ open, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        lessons: [],
        experiments: CLASSIC_EXPERIMENTS.slice(0, 3),
        formulas: FORMULA_DATABASE.slice(0, 3),
        vdc: VDC_PROBLEMS.slice(0, 2),
      };
    }
    return {
      lessons: searchLessons(query).slice(0, 5),
      experiments: CLASSIC_EXPERIMENTS.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.scientist.toLowerCase().includes(q) ||
          e.code.toLowerCase().includes(q),
      ).slice(0, 4),
      formulas: FORMULA_DATABASE.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.expression.toLowerCase().includes(q) ||
          f.domain.toLowerCase().includes(q),
      ).slice(0, 4),
      vdc: VDC_PROBLEMS.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.topic.toLowerCase().includes(q) ||
          v.code.toLowerCase().includes(q),
      ).slice(0, 3),
    };
  }, [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 p-4 pt-16 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Tìm kiếm nhanh toàn hệ thống"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card text-foreground shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="size-4 text-[#16845A] dark:text-[#72CF91] shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm trong 777 bài học, 30 thí nghiệm CE, công thức, thử thách VDC..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Đóng tìm kiếm"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-4">
          {results.lessons.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#16845A] dark:text-[#72CF91]">
                <Compass className="size-3.5" /> Bài học & Mô phỏng ({results.lessons.length})
              </div>
              {results.lessons.map((l) => (
                <Link
                  key={l.fullPath}
                  to="/mo-phong/$"
                  params={{ _splat: l.fullPath }}
                  onClick={onClose}
                  className="flex items-center justify-between gap-2 rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-xs hover:border-[#16845A]"
                >
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{l.name}</div>
                    <div className="truncate text-[11px] text-muted-foreground">
                      {l.grade} · {l.topic}
                    </div>
                  </div>
                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}

          {results.experiments.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#16845A] dark:text-[#72CF91]">
                <History className="size-3.5" /> Thí nghiệm Kinh điển ({results.experiments.length})
              </div>
              {results.experiments.map((e) => (
                <Link
                  key={e.id}
                  to="/thi-nghiem-kinh-dien"
                  onClick={onClose}
                  className="flex items-center justify-between gap-2 rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-xs hover:border-[#16845A]"
                >
                  <div className="min-w-0">
                    <div className="truncate font-semibold">
                      {e.code}: {e.title}
                    </div>
                    <div className="truncate text-[11px] text-muted-foreground">
                      {e.scientist} · {e.year}
                    </div>
                  </div>
                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}

          {results.formulas.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#16845A] dark:text-[#72CF91]">
                <Calculator className="size-3.5" /> Sổ tay Công thức ({results.formulas.length})
              </div>
              {results.formulas.map((f) => (
                <Link
                  key={f.id}
                  to="/cong-thuc"
                  onClick={onClose}
                  className="flex items-center justify-between gap-2 rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-xs hover:border-[#16845A]"
                >
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{f.name}</div>
                    <div className="truncate font-mono text-[11px] text-[#16845A] dark:text-[#C8ED78]">
                      {f.expression} · {f.domain}
                    </div>
                  </div>
                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}

          {results.vdc.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#16845A] dark:text-[#72CF91]">
                <Award className="size-3.5" /> Thử thách VDC ({results.vdc.length})
              </div>
              {results.vdc.map((v) => (
                <Link
                  key={v.id}
                  to="/vdc"
                  onClick={onClose}
                  className="flex items-center justify-between gap-2 rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-xs hover:border-[#16845A]"
                >
                  <div className="min-w-0">
                    <div className="truncate font-semibold">
                      {v.code}: {v.title}
                    </div>
                    <div className="truncate text-[11px] text-muted-foreground">
                      {v.grade} · {v.tier}
                    </div>
                  </div>
                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
