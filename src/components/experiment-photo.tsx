import { useEffect, useState } from "react";
import { Camera, ExternalLink } from "lucide-react";
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

  useEffect(() => {
    setHasError(false);
  }, [photoId]);

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
      </div>

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
