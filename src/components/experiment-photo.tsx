import { useEffect, useState } from "react";
import { Camera, ExternalLink, X, ZoomIn } from "lucide-react";
import { getExperimentPhoto, PHOTO_FALLBACK_TEXT } from "@/data/experiment-photos";

interface ExperimentPhotoProps {
  photoId: string;
  aspectClassName?: string;
  compact?: boolean;
  showCaption?: boolean;
}

export function ExperimentPhoto({
  photoId,
  aspectClassName = "aspect-[16/10]",
  compact = false,
  showCaption = true,
}: ExperimentPhotoProps) {
  const photo = getExperimentPhoto(photoId);
  const [hasError, setHasError] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    setHasError(false);
    setZoomed(false);
  }, [photoId]);

  // Phóng to ảnh: đóng bằng phím Esc, khoá cuộn nền khi đang mở.
  useEffect(() => {
    if (!zoomed) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomed(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [zoomed]);

  if (!photo || hasError) {
    return (
      <div
        className={`flex ${aspectClassName} w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-secondary/40 px-4 text-center text-xs text-muted-foreground`}
      >
        <Camera className="size-5 opacity-50" />
        <span>{PHOTO_FALLBACK_TEXT}</span>
      </div>
    );
  }

  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
      <div className={`relative ${aspectClassName} w-full overflow-hidden bg-[#07110C]`}>
        <img
          src={photo.src}
          alt={photo.title}
          onError={() => setHasError(true)}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <span className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#C8ED78] backdrop-blur-xs">
          Ảnh thực tế · {photo.license}
        </span>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setZoomed(true);
          }}
          aria-label={`Phóng to ảnh: ${photo.title}`}
          className="absolute right-2 bottom-2 flex size-9 items-center justify-center rounded-lg bg-black/70 text-white backdrop-blur-xs transition-colors hover:bg-black/90 focus-visible:ring-2 focus-visible:ring-[#C8ED78]"
        >
          <ZoomIn className="size-4" />
        </button>
      </div>

      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={photo.title}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setZoomed(false);
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-3 bg-black/90 p-3 sm:p-6"
        >
          <button
            type="button"
            autoFocus
            aria-label="Đóng ảnh phóng to"
            className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="size-5" />
          </button>
          <img
            src={photo.src}
            alt={photo.title}
            className="max-h-[78vh] max-w-full rounded-lg object-contain"
          />
          <p className="max-w-3xl text-center text-xs leading-relaxed text-white/85">
            <span className="font-semibold text-white">{photo.title}</span> — {photo.caption}
            <span className="mt-1 block font-mono text-[10px] text-white/60">
              {photo.author} · {photo.license} · {photo.sourceName}
            </span>
          </p>
        </div>
      )}

      {showCaption && (
        <figcaption
          className={`${compact ? "p-2.5" : "p-3.5"} space-y-1.5 border-t border-border text-xs`}
        >
          <div className="font-semibold text-foreground line-clamp-1">{photo.title}</div>
          {!compact && (
            <p className="text-[11px] leading-relaxed text-muted-foreground line-clamp-2">
              {photo.caption}
            </p>
          )}
          <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-muted-foreground">
            <span className="truncate">{photo.author}</span>
            <a
              href={photo.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#16845A] dark:text-[#72CF91] hover:underline shrink-0"
            >
              <span>{photo.sourceName}</span>
              <ExternalLink className="size-2.5" />
            </a>
          </div>
        </figcaption>
      )}
    </figure>
  );
}
