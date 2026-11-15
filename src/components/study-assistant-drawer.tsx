import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BookMarked, Trash2, X, Search, PlusCircle, CheckCircle2, Star } from "lucide-react";
import {
  deleteStudyNote,
  getLearningState,
  resetLearningProgress,
  saveStudyNote,
  subscribeLearningState,
  type LearningState,
} from "@/lib/learning-store";
import { FORMULA_DATABASE } from "@/data/formulas";
import { CLASSIC_EXPERIMENTS } from "@/data/classic-experiments";
import { searchLessons } from "@/data/curriculum";

interface StudyAssistantDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function StudyAssistantDrawer({ open, onClose }: StudyAssistantDrawerProps) {
  const [state, setState] = useState<LearningState>(() => getLearningState());
  const [tab, setTab] = useState<"progress" | "notes" | "lookup">("progress");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [lookupQuery, setLookupQuery] = useState("");

  useEffect(() => {
    return subscribeLearningState(setState);
  }, []);

  const lookupResult = useMemo(() => {
    const q = lookupQuery.trim().toLowerCase();
    if (!q) return null;
    return {
      formulas: FORMULA_DATABASE.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.expression.toLowerCase().includes(q) ||
          f.dimension.toLowerCase().includes(q) ||
          f.domain.toLowerCase().includes(q),
      ).slice(0, 4),
      experiments: CLASSIC_EXPERIMENTS.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.scientist.toLowerCase().includes(q) ||
          e.significance.toLowerCase().includes(q),
      ).slice(0, 3),
      lessons: searchLessons(lookupQuery).slice(0, 3),
    };
  }, [lookupQuery]);

  if (!open) return null;

  const notesList = Object.values(state.notes).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    const id = `note-${Date.now()}`;
    saveStudyNote(id, noteTitle.trim() || "Ghi chú Vật lý", noteContent);
    setNoteTitle("");
    setNoteContent("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Sổ tay Tiến độ & Tra cứu Vật lý"
      onClick={onClose}
    >
      <aside
        className="flex h-full w-full max-w-md flex-col border-l border-border bg-card text-foreground shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <BookMarked className="size-4 text-[#16845A] dark:text-[#72CF91]" />
            <h2 className="text-sm font-bold">Sổ tay Tiến độ & Tra cứu</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Đóng sổ tay"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-border bg-secondary/40 px-4 pt-2 gap-2">
          {[
            { id: "progress" as const, label: "Tiến độ học" },
            { id: "notes" as const, label: `Ghi chú (${notesList.length})` },
            { id: "lookup" as const, label: "Tra cứu SI" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-t-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                tab === t.id
                  ? "border-b-2 border-[#16845A] dark:border-[#72CF91] bg-card text-[#16845A] dark:text-[#72CF91] font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {tab === "progress" && (
            <>
              <div className="grid grid-cols-2 gap-3 tabular-nums">
                <div className="rounded-xl border border-border bg-secondary/30 p-3">
                  <div className="text-[11px] text-muted-foreground">Bài mô phỏng đã xem</div>
                  <div className="mt-0.5 font-mono text-xl font-bold text-[#16845A] dark:text-[#72CF91]">
                    {state.viewedLessons.length}
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-secondary/30 p-3">
                  <div className="text-[11px] text-muted-foreground">Lab số hoàn thành</div>
                  <div className="mt-0.5 font-mono text-xl font-bold text-[#16845A] dark:text-[#72CF91]">
                    {state.completedLabs.length} / 5
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-secondary/30 p-3">
                  <div className="text-[11px] text-muted-foreground">Bài VDC đã giải đúng</div>
                  <div className="mt-0.5 font-mono text-xl font-bold text-[#16845A] dark:text-[#C8ED78]">
                    {state.solvedVdcIds.length}
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-secondary/30 p-3">
                  <div className="text-[11px] text-muted-foreground">Mục đã đánh dấu ★</div>
                  <div className="mt-0.5 font-mono text-xl font-bold text-foreground">
                    {state.favoriteExperiments.length +
                      state.favoriteFormulas.length +
                      state.favoriteLessons.length +
                      state.favoriteDocs.length}
                  </div>
                </div>
              </div>

              {state.favoriteExperiments.length > 0 && (
                <div className="space-y-1.5">
                  <h3 className="flex items-center gap-1.5 text-xs font-semibold">
                    <Star className="size-3.5 text-amber-500" /> Thí nghiệm yêu thích
                  </h3>
                  {state.favoriteExperiments.map((id) => {
                    const exp = CLASSIC_EXPERIMENTS.find((e) => e.id === id);
                    if (!exp) return null;
                    return (
                      <Link
                        key={id}
                        to="/thi-nghiem-kinh-dien"
                        onClick={onClose}
                        className="block rounded-lg border border-border bg-secondary/20 px-3 py-2 text-xs hover:border-[#16845A]"
                      >
                        <span className="font-mono font-bold text-[#16845A] dark:text-[#72CF91]">
                          {exp.code}
                        </span>{" "}
                        · {exp.title}
                      </Link>
                    );
                  })}
                </div>
              )}

              {state.favoriteFormulas.length > 0 && (
                <div className="space-y-1.5">
                  <h3 className="flex items-center gap-1.5 text-xs font-semibold">
                    <CheckCircle2 className="size-3.5 text-[#16845A] dark:text-[#72CF91]" /> Công
                    thức đã lưu
                  </h3>
                  {state.favoriteFormulas.map((id) => {
                    const f = FORMULA_DATABASE.find((item) => item.id === id);
                    if (!f) return null;
                    return (
                      <Link
                        key={id}
                        to="/cong-thuc"
                        onClick={onClose}
                        className="block rounded-lg border border-border bg-secondary/20 px-3 py-2 text-xs hover:border-[#16845A]"
                      >
                        <div className="font-semibold">{f.name}</div>
                        <div className="font-mono text-[11px] text-[#16845A] dark:text-[#C8ED78]">
                          {f.expression}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              <div className="pt-2 border-t border-border flex justify-end">
                <button
                  type="button"
                  onClick={() => resetLearningProgress()}
                  className="inline-flex items-center gap-1 text-xs text-destructive hover:underline"
                >
                  <Trash2 className="size-3.5" /> Đặt lại toàn bộ tiến độ cục bộ
                </button>
              </div>
            </>
          )}

          {tab === "notes" && (
            <div className="space-y-4">
              <form
                onSubmit={handleCreateNote}
                className="space-y-2 rounded-xl border border-border bg-secondary/30 p-3.5"
              >
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Tiêu đề ghi chú (VD: Lưu ý giao thoa sóng)"
                  className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-[#16845A]"
                />
                <textarea
                  rows={3}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Ghi lại công thức cần nhớ, nhận xét thí nghiệm..."
                  className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-[#16845A]"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#16845A] dark:bg-[#38A875] px-3 py-1.5 text-xs font-semibold text-white dark:text-[#0B1511]"
                >
                  <PlusCircle className="size-3.5" /> Lưu ghi chú
                </button>
              </form>

              {notesList.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  Chưa có ghi chú nào. Mọi ghi chú được lưu tự động trong trình duyệt của bạn.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {notesList.map((n) => (
                    <div
                      key={n.id}
                      className="rounded-xl border border-border bg-card p-3 space-y-1"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs font-semibold">{n.title}</div>
                        <button
                          type="button"
                          onClick={() => deleteStudyNote(n.id)}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label="Xóa ghi chú"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                        {n.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "lookup" && (
            <div className="space-y-3">
              <div className="relative flex items-center">
                <Search className="absolute left-3 size-3.5 text-muted-foreground" />
                <input
                  type="search"
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  placeholder="Tra công thức, thứ nguyên [M][L][T], từ khóa Vật lý..."
                  className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs outline-none focus:border-[#16845A]"
                />
              </div>

              {!lookupResult ? (
                <div className="rounded-xl border border-border bg-secondary/20 p-4 text-xs text-muted-foreground space-y-2">
                  <p className="font-semibold text-foreground">Bộ tra cứu quy đổi chuẩn SI</p>
                  <p>
                    Nhập tên đại lượng (VD: Newton, Joule, khí lý tưởng, Faraday, Young) để tra biểu
                    thức, thứ nguyên SI và bài học tương ứng.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lookupResult.formulas.map((f) => (
                    <div
                      key={f.id}
                      className="rounded-xl border border-border bg-secondary/25 p-3 text-xs space-y-1"
                    >
                      <div className="font-semibold">{f.name}</div>
                      <div className="font-mono text-[#16845A] dark:text-[#C8ED78]">
                        {f.expression}
                      </div>
                      <div className="font-mono text-[11px] text-muted-foreground">
                        Thứ nguyên: {f.dimension}
                      </div>
                    </div>
                  ))}
                  {lookupResult.experiments.map((e) => (
                    <Link
                      key={e.id}
                      to="/thi-nghiem-kinh-dien"
                      onClick={onClose}
                      className="block rounded-xl border border-border bg-secondary/25 p-3 text-xs hover:border-[#16845A]"
                    >
                      <div className="font-semibold">
                        {e.code}: {e.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{e.significance}</div>
                    </Link>
                  ))}
                  {lookupResult.lessons.map((l) => (
                    <Link
                      key={l.fullPath}
                      to="/mo-phong/$"
                      params={{ _splat: l.fullPath }}
                      onClick={onClose}
                      className="block rounded-xl border border-border bg-secondary/25 p-3 text-xs hover:border-[#16845A]"
                    >
                      <div className="font-semibold">{l.name}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {l.grade} · {l.topic}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
