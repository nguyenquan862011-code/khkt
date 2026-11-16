/**
 * Card thí nghiệm theo form chuẩn: tên · ảnh · mô tả ngắn · chủ đề ·
 * chương · cấp độ · thời lượng · nút "Bắt đầu thí nghiệm" → trang chi tiết.
 */
import { Link } from "@tanstack/react-router";
import { Clock, PlayCircle, Tag } from "lucide-react";
import type { ExperimentEntry } from "@/data/experiments/types";
import {
  EXPERIMENT_KIND_LABELS,
  EXPERIMENT_LEVEL_LABELS,
  EXPERIMENT_TOPIC_LABELS,
} from "@/data/experiments/types";
import { EXPERIMENT_PHOTOS } from "@/data/experiment-photos";

export function ExperimentCard({ experiment }: { experiment: ExperimentEntry }) {
  const photo =
    EXPERIMENT_PHOTOS[experiment.photoIds[0] ?? ""] ?? EXPERIMENT_PHOTOS["circular-motion"];
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[#2c4438] bg-[#0d2118] transition-shadow hover:shadow-lg hover:shadow-black/30">
      <div className="relative aspect-[16/9] overflow-hidden bg-[#153325]">
        {photo ? (
          <img
            src={photo.src}
            alt={photo.title}
            title={photo.title}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={(e) => {
              const el = e.currentTarget;
              if (!el.dataset["fallback"]) {
                el.dataset["fallback"] = "1";
                el.src = "/images/experiments/circular-motion-wheel.jpg";
              }
            }}
          />
        ) : null}
        <span className="absolute left-3 top-3 rounded-full bg-[#16845A] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
          {experiment.code}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-sm font-bold leading-snug text-[#edf5ed]">{experiment.title}</h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-[#9db8a8]">
          {experiment.description}
        </p>
        <div className="mt-auto space-y-2 pt-2">
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-[#9db8a8]">
            <span className="inline-flex items-center gap-1 rounded-full border border-[#2c4438] px-2 py-0.5">
              <Tag className="size-3 text-[#5ec98d]" /> {EXPERIMENT_TOPIC_LABELS[experiment.topic]}
            </span>
            <span className="rounded-full border border-[#2c4438] px-2 py-0.5">
              {EXPERIMENT_LEVEL_LABELS[experiment.level]}
            </span>
            <span className="rounded-full border border-[#2c4438] px-2 py-0.5">
              {EXPERIMENT_KIND_LABELS[experiment.kind]}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#2c4438] px-2 py-0.5">
              <Clock className="size-3" /> {experiment.durationMinutes} phút
            </span>
          </div>
          <p className="text-[10px] text-[#5c7263]">{experiment.chapter}</p>
          <Link
            to="/thi-nghiem/$slug"
            params={{ slug: experiment.slug }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#16845A] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#126b48]"
          >
            <PlayCircle className="size-4" /> Bắt đầu thí nghiệm
          </Link>
        </div>
      </div>
    </article>
  );
}
