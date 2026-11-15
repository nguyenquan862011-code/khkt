import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  CheckCircle2,
  Trophy,
  History,
  X,
  FileCheck,
  AlertCircle,
  Trash2,
  HelpCircle,
  RefreshCw,
  Star,
  StickyNote,
  Sliders,
} from "lucide-react";
import type { LessonMeta } from "@/data/curriculum";
import {
  saveSubmission,
  getSubmissionsHistory,
  clearSubmissionsHistory,
  type StoredSubmission,
  type SubmissionPayload,
} from "@/lib/submission-service";
import {
  getLearningState,
  markLessonViewed,
  saveStudyNote,
  subscribeLearningState,
  toggleFavoriteItem,
} from "@/lib/learning-store";
import type { SimulationDomainId } from "@/lib/physics-simulations";
import { recordAttempt } from "@/lib/account/sync";
import { InteractivePhysicsLab } from "@/components/interactive-physics-lab";

function mapLessonToDomain(lesson: LessonMeta): SimulationDomainId {
  const hay = `${lesson.part} ${lesson.topic} ${lesson.name}`.toLowerCase();
  if (hay.includes("quang") || hay.includes("lăng kính") || hay.includes("thấu kính")) {
    return "quang-hoc";
  }
  if (hay.includes("điện") || hay.includes("từ") || hay.includes("ohm")) {
    return "dien-tu";
  }
  if (hay.includes("nhiệt") || hay.includes("khí")) {
    return "nhiet-hoc";
  }
  if (hay.includes("dao động") || hay.includes("sóng") || hay.includes("giao thoa")) {
    return "dao-dong-song";
  }
  return "co-hoc";
}

interface SimulationViewerProps {
  lesson: LessonMeta;
  onToggleSidebar?: () => void;
}

export function SimulationViewer({ lesson, onToggleSidebar }: SimulationViewerProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [loadTimedOut, setLoadTimedOut] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Submissions and Grading state
  const [submissions, setSubmissions] = useState<StoredSubmission[]>([]);
  const [activeResult, setActiveResult] = useState<StoredSubmission | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [viewerMode, setViewerMode] = useState<"iframe" | "native">("iframe");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");

  // Load history, track viewed lesson, and subscribe to favorites/notes on lesson change
  useEffect(() => {
    setSubmissions(getSubmissionsHistory(lesson.fullPath));
    markLessonViewed(lesson.fullPath);
    const sync = (st: ReturnType<typeof getLearningState>) => {
      setIsFavorite(st.favoriteLessons.includes(lesson.fullPath));
      setNoteDraft(st.notes[`lesson:${lesson.fullPath}`]?.content ?? "");
    };
    return subscribeLearningState(sync);
  }, [lesson.fullPath]);

  // Reset loading and error when lesson changes or reloads, and detect pre-hydration iframe loads
  useEffect(() => {
    setHasError(false);
    setLoadTimedOut(false);

    const checkIframeReady = (): boolean => {
      const iframe = iframeRef.current;
      if (!iframe) return false;
      try {
        const doc = iframe.contentDocument;
        if (
          doc &&
          doc.URL &&
          doc.URL.includes("/api/mo-phong/") &&
          (doc.readyState === "complete" ||
            (doc.readyState === "interactive" && (doc.body?.innerText?.trim().length ?? 0) > 20))
        ) {
          setIsLoading(false);
          setLoadTimedOut(false);
          return true;
        }
      } catch {
        // Ignore transient access error
      }
      return false;
    };

    if (checkIframeReady()) {
      return;
    }

    setIsLoading(true);

    // Poll briefly in case browser completed iframe load before React attached onLoad during hydration
    const pollInterval = setInterval(() => {
      if (checkIframeReady()) {
        clearInterval(pollInterval);
      }
    }, 120);

    // Watchdog timer: If iframe doesn't load within 12s, offer fallback
    const timer = setTimeout(() => {
      if (!checkIframeReady()) {
        setLoadTimedOut(true);
      }
    }, 12000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timer);
    };
  }, [lesson.fullPath, reloadKey]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (e.key === "[" && lesson.prevLessonPath) {
        e.preventDefault();
        navigate({ to: "/mo-phong/$", params: { _splat: lesson.prevLessonPath } });
      } else if (e.key === "]" && lesson.nextLessonPath) {
        e.preventDefault();
        navigate({ to: "/mo-phong/$", params: { _splat: lesson.nextLessonPath } });
      } else if (e.key === "b" || e.key === "B") {
        e.preventDefault();
        onToggleSidebar?.();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        handleRetry();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "?") {
        e.preventDefault();
        setShowHelpModal((v) => !v);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lesson, navigate, onToggleSidebar]);

  // Message listener for auto-grading bridge from iframe simulation
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== "object") return;

      if (
        e.data.type === "TAMGIANG_SUBMISSION_RESULT" ||
        e.data.type === "VATLY_SUBMIT_RESULT" ||
        e.data.type === "EXAM_SUBMISSION_RESULT"
      ) {
        const payload = e.data.payload as SubmissionPayload;
        if (payload) {
          const stored = saveSubmission({
            ...payload,
            lessonPath: payload.lessonPath || lesson.fullPath,
          });
          setSubmissions((prev) => [stored, ...prev.filter((s) => s.id !== stored.id)]);
          setActiveResult(stored);
          // Đã đăng nhập ⇒ lưu thêm vào lịch sử làm bài của tài khoản (khách chỉ lưu trên máy).
          const [minutes, seconds] = String(stored.timeSpent || "0:0")
            .split(":")
            .map(Number);
          const durationSec = (minutes || 0) * 60 + (seconds || 0);
          const finishedAt = stored.submittedAt || stored.savedLocallyAt;
          recordAttempt({
            clientId: stored.id,
            source: "lesson",
            title: stored.title || lesson.name,
            grade: lesson.grade,
            topic: lesson.topic,
            lessonKey: lesson.slugPath.slice(0, 4).join("/"),
            level: stored.mode,
            startedAt: new Date(Date.parse(finishedAt) - durationSec * 1000).toISOString(),
            finishedAt,
            durationSec,
            total: stored.totalQuestions,
            correct: stored.correctCount,
            wrong: stored.wrongCount,
            score: stored.score,
            meta: { lessonPath: stored.lessonPath, p1: stored.p1, p2: stored.p2, p3: stored.p3 },
          });
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [lesson.fullPath]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch((err) => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen?.().catch((err) => {
        console.error("Exit fullscreen error:", err);
      });
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setLoadTimedOut(false);
    setIsLoading(true);
    setReloadKey((k) => k + 1);
  };

  const proxiedSimulationUrl = `/api/mo-phong/${lesson.fullPath}`;
  const latestAttempt = submissions[0];
  const mappedDomain = mapLessonToDomain(lesson);

  return (
    <div
      ref={containerRef}
      className={`relative flex min-h-0 flex-1 flex-col bg-[#070E0B] text-[#EDF5ED] ${
        isFullscreen ? "h-screen w-screen" : "h-full"
      }`}
    >
      {/* Top Mode Switcher Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#153325] bg-[#091A13] px-3 py-1.5 text-xs">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewerMode("iframe")}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
              viewerMode === "iframe"
                ? "bg-[#16845A] text-white font-semibold"
                : "text-[#EDF5ED]/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            Mô phỏng Bài học
          </button>
          <button
            type="button"
            onClick={() => setViewerMode("native")}
            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
              viewerMode === "native"
                ? "bg-[#16845A] text-white font-semibold"
                : "text-[#EDF5ED]/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Sliders className="size-3" /> Phòng Lab Tương Tác Số
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => toggleFavoriteItem("favoriteLessons", lesson.fullPath)}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] transition-colors whitespace-nowrap shrink-0 ${
              isFavorite
                ? "bg-amber-500/20 text-amber-300 font-semibold"
                : "text-[#EDF5ED]/70 hover:bg-white/10"
            }`}
            title="Đánh dấu bài học yêu thích"
          >
            <Star className={`size-3 ${isFavorite ? "fill-amber-300" : ""}`} />
            <span>{isFavorite ? "Đã lưu ★" : "Lưu bài"}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowNoteModal(true)}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-[#72CF91] hover:bg-white/10 whitespace-nowrap shrink-0"
            title="Ghi chú cá nhân cho bài học này"
          >
            <StickyNote className="size-3" />
            <span>Ghi chú</span>
          </button>
        </div>
      </div>

      {/* Simulation Viewport */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {viewerMode === "native" ? (
          <div className="h-full overflow-y-auto bg-background p-4 sm:p-6">
            <InteractivePhysicsLab initialDomain={mappedDomain} compact />
          </div>
        ) : (
          <>
            {/* Loading overlay */}
            {isLoading && !hasError && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#070E0B]/90 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3 text-center px-4 max-w-md">
                  <Loader2 className="size-8 animate-spin text-[#38A875]" />
                  <p className="font-mono text-xs text-[#EDF5ED]/80">
                    Đang khởi tạo buồng thí nghiệm Vật lý số...
                  </p>
                  <p className="text-[11px] text-[#A5B7A8]">
                    {lesson.name} · {lesson.grade}
                  </p>

                  {loadTimedOut && (
                    <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200 space-y-2.5">
                      <p>
                        Nguồn mô phỏng trực tuyến phản hồi chậm. Bạn có thể chuyển sang Phòng Lab
                        Tương Tác Số tích hợp sẵn ngay tại đây.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setViewerMode("native")}
                          className="rounded-lg bg-[#38A875] px-3 py-1.5 text-xs font-semibold text-[#0B1511]"
                        >
                          Mở Phòng Lab Tương Tác Số
                        </button>
                        <button
                          type="button"
                          onClick={handleRetry}
                          className="rounded-lg bg-amber-500/20 px-2.5 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-500/30"
                        >
                          Thử tải lại
                        </button>
                        <a
                          href={proxiedSimulationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-[#16845A] px-2.5 py-1.5 text-xs font-medium text-white hover:bg-[#38A875]"
                        >
                          Mở tab mới <ExternalLink className="size-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error Fallback Viewport */}
            {hasError ? (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#070E0B] p-6 text-center">
                <div className="max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 p-6 space-y-4">
                  <AlertCircle className="mx-auto size-10 text-red-400" />
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Không thể tải mô phỏng trực tuyến
                    </h3>
                    <p className="mt-1 text-xs text-[#EDF5ED]/80">
                      Đường truyền máy chủ nguồn tạm gián đoạn. Hãy dùng Phòng Lab Tương Tác Số tích
                      hợp sẵn hoặc thử tải lại.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setViewerMode("native")}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#38A875] px-3.5 py-1.5 text-xs font-semibold text-[#0B1511]"
                    >
                      <Sliders className="size-3.5" /> Dùng Phòng Lab Số
                    </button>
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
                    >
                      <RefreshCw className="size-3.5" /> Thử lại
                    </button>
                    <a
                      href={proxiedSimulationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#16845A] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-[#38A875]"
                    >
                      <ExternalLink className="size-3.5" /> Mở trực tiếp
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                key={`${lesson.fullPath}-${reloadKey}`}
                src={proxiedSimulationUrl}
                title={lesson.name}
                onLoad={() => {
                  setIsLoading(false);
                  setLoadTimedOut(false);
                }}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
                className="size-full border-0"
                sandbox="allow-scripts allow-popups allow-forms allow-pointer-lock allow-same-origin allow-modals allow-downloads"
                allow="fullscreen; autoplay"
              />
            )}
          </>
        )}
      </div>

      {/* Bottom control toolbar */}
      <footer className="flex h-11 shrink-0 items-center justify-between border-t border-[#153325] dark:border-[#12261C] bg-[#091A13] dark:bg-[#06120D] px-3 text-xs text-[#EDF5ED]/80 shadow-md">
        {/* Left: Navigation previous / next */}
        <div className="flex items-center gap-1">
          {lesson.prevLessonPath ? (
            <Link
              to="/mo-phong/$"
              params={{ _splat: lesson.prevLessonPath }}
              className="inline-flex h-8 items-center gap-1 rounded-md px-2.5 font-medium text-[#EDF5ED]/90 hover:bg-white/10 hover:text-white transition-colors"
              title="Bài trước (Phím [)"
            >
              <ChevronLeft className="size-4" />
              <span className="hidden sm:inline">Bài trước</span>
            </Link>
          ) : (
            <button
              disabled
              className="inline-flex h-8 items-center gap-1 rounded-md px-2.5 font-medium text-white/30 cursor-not-allowed"
            >
              <ChevronLeft className="size-4" />
              <span className="hidden sm:inline">Bài trước</span>
            </button>
          )}

          {lesson.nextLessonPath ? (
            <Link
              to="/mo-phong/$"
              params={{ _splat: lesson.nextLessonPath }}
              className="inline-flex h-8 items-center gap-1 rounded-md px-2.5 font-medium text-[#EDF5ED]/90 hover:bg-white/10 hover:text-white transition-colors"
              title="Bài sau (Phím ])"
            >
              <span className="hidden sm:inline">Bài sau</span>
              <ChevronRight className="size-4" />
            </Link>
          ) : (
            <button
              disabled
              className="inline-flex h-8 items-center gap-1 rounded-md px-2.5 font-medium text-white/30 cursor-not-allowed"
            >
              <span className="hidden sm:inline">Bài sau</span>
              <ChevronRight className="size-4" />
            </button>
          )}

          <span className="hidden md:inline text-[11px] text-white/40 pl-2">
            Phím: <kbd className="rounded bg-white/10 px-1 py-0.5 text-[10px] font-mono">[</kbd>{" "}
            <kbd className="rounded bg-white/10 px-1 py-0.5 text-[10px] font-mono">]</kbd>
          </span>
        </div>

        {/* Center: Submission and Lesson index info */}
        <div className="flex items-center gap-2 text-[#EDF5ED]">
          {latestAttempt ? (
            <button
              type="button"
              onClick={() => setActiveResult(latestAttempt)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#38A875]/40 bg-[#16845A]/20 px-2.5 py-1 text-[11px] font-semibold text-[#72CF91] hover:bg-[#16845A]/30 transition-all"
            >
              <Trophy className="size-3 text-[#C8ED78]" />
              <span>Điểm gần nhất: {latestAttempt.score.toFixed(1)}/10</span>
            </button>
          ) : (
            <span className="hidden lg:inline text-[11px] text-white/50">
              Bài #{lesson.index} / 777 · {lesson.grade}
            </span>
          )}
        </div>

        {/* Right: Actions (History, Help, Reload, Fullscreen, Open external) */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowHistoryModal(true)}
            className="flex h-8 items-center gap-1.5 rounded-md px-2 text-[#72CF91] hover:bg-white/10 transition-colors"
            title="Xem lịch sử bài làm"
          >
            <History className="size-3.5" />
            <span className="hidden sm:inline text-xs font-medium">Lịch sử</span>
            {submissions.length > 0 && (
              <span className="rounded-full bg-[#38A875] px-1.5 py-0.2 text-[10px] font-bold text-white">
                {submissions.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="flex size-8 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            title="Phím tắt & Hướng dẫn (Phím ?)"
            aria-label="Hướng dẫn phím tắt"
          >
            <HelpCircle className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={handleRetry}
            className="flex h-8 items-center gap-1.5 rounded-md px-2 text-[#EDF5ED]/80 hover:bg-white/10 hover:text-white transition-colors"
            title="Tải lại mô phỏng (Phím R)"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline text-xs">Tải lại</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex h-8 items-center gap-1.5 rounded-md px-2 text-[#EDF5ED]/80 hover:bg-white/10 hover:text-white transition-colors"
            title={isFullscreen ? "Thu nhỏ (Phím F)" : "Toàn màn hình (Phím F)"}
          >
            {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
            <span className="hidden sm:inline text-xs">
              {isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
            </span>
          </button>

          <a
            href={proxiedSimulationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-8 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            title="Mở trong tab mới"
          >
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </footer>

      {/* Keyboard Shortcuts Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-[#38A875]/40 bg-[#0B1511] p-6 text-[#EDF5ED] shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#2B4033] pb-3">
              <div className="flex items-center gap-2 text-[#72CF91]">
                <HelpCircle className="size-5" />
                <h3 className="text-base font-bold text-white">Phím tắt phòng Lab</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-white/60 hover:text-white p-1"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-[#A5B7A8]">Chuyển sang bài trước</span>
                <kbd className="rounded bg-white/10 px-2 py-0.5 font-mono text-[#C8ED78]">[</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-[#A5B7A8]">Chuyển sang bài sau</span>
                <kbd className="rounded bg-white/10 px-2 py-0.5 font-mono text-[#C8ED78]">]</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-[#A5B7A8]">Đóng/Mở thanh giáo trình</span>
                <kbd className="rounded bg-white/10 px-2 py-0.5 font-mono text-[#C8ED78]">B</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-[#A5B7A8]">Tải lại mô phỏng hiện tại</span>
                <kbd className="rounded bg-white/10 px-2 py-0.5 font-mono text-[#C8ED78]">R</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-[#A5B7A8]">Toàn màn hình / Thu nhỏ</span>
                <kbd className="rounded bg-white/10 px-2 py-0.5 font-mono text-[#C8ED78]">F</kbd>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#A5B7A8]">Hiện bảng phím tắt này</span>
                <kbd className="rounded bg-white/10 px-2 py-0.5 font-mono text-[#C8ED78]">?</kbd>
              </div>
            </div>

            <div className="border-t border-[#2B4033] pt-3 text-right">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="rounded-lg bg-[#16845A] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#38A875]"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submission Success & Result Modal */}
      {activeResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-[#38A875]/40 bg-[#0B1511] p-6 text-[#EDF5ED] shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-[#2B4033] pb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-[#16845A]/20 text-[#72CF91]">
                  <CheckCircle2 className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#EDF5ED]">
                    NỘP BÀI THÀNH CÔNG & ĐÃ CHẤM ĐIỂM
                  </h3>
                  <p className="text-xs text-[#72CF91] font-mono">
                    Hệ thống Trường THPT Tam Giang đã ghi nhận bài làm
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveResult(null)}
                className="text-[#EDF5ED]/60 hover:text-white p-1"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Score Big Display */}
            <div className="rounded-xl border border-[#38A875]/30 bg-gradient-to-br from-[#16845A]/15 to-[#38A875]/10 p-5 text-center space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#72CF91]">
                KẾT QUẢ ĐẠT ĐƯỢC
              </span>
              <div className="text-4xl font-extrabold text-[#EDF5ED]">
                {activeResult.score.toFixed(1)} <span className="text-xl text-[#C8ED78]">/ 10</span>
              </div>
              <p className="text-xs text-[#EDF5ED]/70">
                Thang điểm 10 chuẩn THPT · Chế độ:{" "}
                <strong className="text-white">
                  {activeResult.mode === "thi" ? "Thi thật có bấm giờ" : "Ôn luyện"}
                </strong>
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="rounded-lg border border-[#2B4033] bg-[#15271E] p-3">
                <span className="text-[#A5B7A8] block text-[11px]">Số câu đúng</span>
                <span className="text-base font-bold text-[#72CF91]">
                  {activeResult.correctCount}
                </span>
              </div>
              <div className="rounded-lg border border-[#2B4033] bg-[#15271E] p-3">
                <span className="text-[#A5B7A8] block text-[11px]">Tổng số câu</span>
                <span className="text-base font-bold text-[#EDF5ED]">
                  {activeResult.totalQuestions}
                </span>
              </div>
              <div className="rounded-lg border border-[#2B4033] bg-[#15271E] p-3">
                <span className="text-[#A5B7A8] block text-[11px]">Thời gian làm</span>
                <span className="text-base font-bold text-[#C8ED78] font-mono">
                  {activeResult.timeSpent || "00:00"}
                </span>
              </div>
            </div>

            {/* Detailed sections breakdown if present */}
            {(activeResult.p1 || activeResult.p2 || activeResult.p3) && (
              <div className="rounded-lg border border-[#2B4033] bg-[#15271E]/60 p-3 text-xs space-y-1.5">
                <span className="text-[11px] font-semibold text-[#72CF91] block uppercase">
                  Chi tiết từng phần:
                </span>
                {activeResult.p1 && (
                  <div className="flex justify-between text-[#EDF5ED]/80">
                    <span>Phần I: Trắc nghiệm</span>
                    <span className="font-mono">
                      {activeResult.p1.correct} / {activeResult.p1.total} câu
                    </span>
                  </div>
                )}
                {activeResult.p2 && (
                  <div className="flex justify-between text-[#EDF5ED]/80">
                    <span>Phần II: Đúng / Sai</span>
                    <span className="font-mono">
                      {activeResult.p2.correct} / {activeResult.p2.total} ý
                    </span>
                  </div>
                )}
                {activeResult.p3 && (
                  <div className="flex justify-between text-[#EDF5ED]/80">
                    <span>Phần III: Trả lời ngắn</span>
                    <span className="font-mono">
                      {activeResult.p3.correct} / {activeResult.p3.total} câu
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-[#2B4033] pt-4 text-xs">
              <span className="text-[#A5B7A8] text-[11px]">
                Mã bài nộp: <span className="font-mono">{activeResult.id}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveResult(null)}
                  className="rounded-lg border border-[#2B4033] bg-[#15271E] px-4 py-2 font-medium text-white hover:bg-[#1B3025] transition-colors"
                >
                  Đóng & Xem đáp án
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submissions History Dialog */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-2xl border border-[#2B4033] bg-[#0B1511] p-6 text-[#EDF5ED] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2B4033] pb-3">
              <div className="flex items-center gap-2">
                <History className="size-5 text-[#72CF91]" />
                <h3 className="text-base font-bold text-[#EDF5ED]">
                  Lịch sử làm bài: {lesson.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="text-white/60 hover:text-white p-1"
              >
                <X className="size-5" />
              </button>
            </div>

            {submissions.length === 0 ? (
              <div className="rounded-xl border border-[#2B4033] bg-[#15271E]/50 p-8 text-center space-y-2">
                <FileCheck className="mx-auto size-8 text-[#72CF91]/40" />
                <p className="text-sm font-semibold text-white">
                  Chưa có bài nộp nào cho bài học này
                </p>
                <p className="text-xs text-[#A5B7A8]">
                  Hãy hoàn thành các câu hỏi trong mô phỏng bài tập và nhấn &ldquo;Nộp bài&rdquo; để
                  lưu kết quả.
                </p>
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                {submissions.map((sub, idx) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between rounded-xl border border-[#2B4033] bg-[#15271E] p-3.5 transition-colors hover:border-[#38A875]/40"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#72CF91]">
                          Lần #{submissions.length - idx}
                        </span>
                        <span className="text-[11px] text-[#A5B7A8]">
                          {new Date(sub.submittedAt).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          ·{" "}
                          {new Date(sub.submittedAt).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-[#EDF5ED]/70">
                        Đúng {sub.correctCount} / {sub.totalQuestions} câu · Thời gian làm:{" "}
                        {sub.timeSpent}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded-lg border border-[#38A875]/30 bg-[#16845A]/20 px-2.5 py-1 text-sm font-extrabold text-[#72CF91]">
                        {sub.score.toFixed(1)}/10
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowHistoryModal(false);
                          setActiveResult(sub);
                        }}
                        className="text-xs text-[#C8ED78] hover:underline"
                      >
                        Chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-[#2B4033] pt-3 text-xs">
              <span className="text-[#A5B7A8] text-[11px]">
                Tổng cộng {submissions.length} lần nộp bài được lưu
              </span>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Xóa toàn bộ lịch sử làm bài trong trình duyệt này?")) {
                    clearSubmissionsHistory();
                    setSubmissions([]);
                  }
                }}
                className="text-xs text-red-400 hover:text-red-300 hover:underline flex items-center gap-1"
              >
                <Trash2 className="size-3" />
                Xóa lịch sử bài học này
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Personal Lesson Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-[#2B4033] bg-[#0B1511] p-6 text-[#EDF5ED] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#2B4033] pb-3">
              <div className="flex items-center gap-2">
                <StickyNote className="size-4 text-[#72CF91]" />
                <h3 className="text-sm font-bold text-white">Ghi chú bài học</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNoteModal(false)}
                className="text-white/60 hover:text-white p-1"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="text-xs text-[#A5B7A8]">{lesson.name}</p>
            <textarea
              rows={5}
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Ghi lại hiện tượng quan sát được, công thức hoặc lỗi hay gặp..."
              className="w-full rounded-xl border border-[#2B4033] bg-[#15271E] p-3 text-xs text-white outline-none focus:border-[#38A875]"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNoteModal(false)}
                className="rounded-lg border border-[#2B4033] px-3 py-1.5 text-xs text-white/80 hover:bg-white/5"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  saveStudyNote(`lesson:${lesson.fullPath}`, lesson.name, noteDraft);
                  setShowNoteModal(false);
                }}
                className="rounded-lg bg-[#16845A] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#38A875]"
              >
                Lưu ghi chú
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
