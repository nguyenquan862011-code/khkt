/**
 * Ảnh thực tế cho thí nghiệm: dùng ảnh thật có sẵn trong EXPERIMENT_PHOTOS,
 * kèm chú thích nguồn. Khi thiếu ảnh, hiển thị ảnh dự phòng trung thực
 * (KHÔNG tạo ảnh giả) kèm ghi rõ đây là ảnh minh hoạ theo chủ đề.
 */
import { ImageOff } from "lucide-react";
import { EXPERIMENT_PHOTOS } from "@/data/experiment-photos";

/** Khóa ảnh dự phòng trung thực khi chủ đề chưa có ảnh riêng. */
const FALLBACK_PHOTO_ID = "circular-motion";

interface ExperimentPhotoProps {
  photoIds: string[];
  title: string;
  className?: string;
}

export function ExperimentPhoto({ photoIds, title, className }: ExperimentPhotoProps) {
  const found = photoIds
    .map((id) => EXPERIMENT_PHOTOS[id])
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const photo = found[0] ?? EXPERIMENT_PHOTOS[FALLBACK_PHOTO_ID];

  if (!photo) {
    return (
      <div
        className={`flex aspect-[16/9] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#2c4438] bg-[#0d2118] text-sm text-[#9db8a8] ${className ?? ""}`}
      >
        <ImageOff className="size-6" />
        <span>Chưa có ảnh minh hoạ cho thí nghiệm này</span>
      </div>
    );
  }

  const isExact = found.length > 0;

  return (
    <figure
      className={`overflow-hidden rounded-2xl border border-[#2c4438] bg-[#0d2118] ${className ?? ""}`}
    >
      <img
        src={photo.src}
        alt={photo.title}
        title={photo.title}
        loading="lazy"
        className="aspect-[16/9] w-full object-cover"
        onError={(e) => {
          const el = e.currentTarget;
          if (!el.dataset["fallback"]) {
            el.dataset["fallback"] = "1";
            el.src = "/images/experiments/circular-motion-wheel.jpg";
          }
        }}
      />
      <figcaption className="space-y-1 px-4 py-3 text-xs text-[#9db8a8]">
        <p className="font-semibold text-[#d7e7dc]">
          {isExact ? photo.title : `Ảnh minh hoạ theo chủ đề: ${title}`}
        </p>
        <p>
          {isExact
            ? photo.caption
            : "Thí nghiệm này chưa có ảnh chụp riêng — ảnh trên thuộc thư viện ảnh thật của khoá học."}
        </p>
        <p className="text-[10px] uppercase tracking-wide">
          Nguồn: {photo.sourceName} · {photo.license}
        </p>
      </figcaption>
    </figure>
  );
}
