/**
 * Tổng hợp thư viện thí nghiệm mở rộng + bộ tìm kiếm/lọc dùng chung.
 */
import type { ExperimentEntry, ExperimentKind, ExperimentLevel, ExperimentTopic } from "./types";
import { BATCH_CO_HOC } from "./batch-co-hoc";
import { BATCH_NHIET_DIEN_TU } from "./batch-nhiet-dien-tu";
import { BATCH_QUANG_SONG } from "./batch-quang-song";
import { BATCH_HIEN_DAI } from "./batch-hien-dai";
import { BATCH_STEM_LIEN_MON } from "./batch-stem-lien-mon";

export * from "./types";

export const ALL_EXPERIMENTS: ExperimentEntry[] = [
  ...BATCH_CO_HOC,
  ...BATCH_NHIET_DIEN_TU,
  ...BATCH_QUANG_SONG,
  ...BATCH_HIEN_DAI,
  ...BATCH_STEM_LIEN_MON,
];

export function getExperimentBySlug(slug: string): ExperimentEntry | undefined {
  return ALL_EXPERIMENTS.find((e) => e.slug === slug);
}

export function getExperimentById(id: string): ExperimentEntry | undefined {
  return ALL_EXPERIMENTS.find((e) => e.id === id);
}

export function countByTopic(): Record<ExperimentTopic, number> {
  const counts = {} as Record<ExperimentTopic, number>;
  for (const e of ALL_EXPERIMENTS) {
    counts[e.topic] = (counts[e.topic] ?? 0) + 1;
  }
  return counts;
}

export interface ExperimentFilterInput {
  query?: string;
  topic?: ExperimentTopic | "all";
  level?: ExperimentLevel | "all";
  kind?: ExperimentKind | "all";
}

/** Tìm theo tên/mã/chủ đề + lọc chủ đề/cấp độ/loại. */
export function filterExperiments(input: ExperimentFilterInput): ExperimentEntry[] {
  const q = (input.query ?? "").trim().toLowerCase();
  return ALL_EXPERIMENTS.filter((e) => {
    if (input.topic && input.topic !== "all" && e.topic !== input.topic) return false;
    if (input.level && input.level !== "all" && e.level !== input.level) return false;
    if (input.kind && input.kind !== "all" && e.kind !== input.kind) return false;
    if (!q) return true;
    return (
      e.title.toLowerCase().includes(q) ||
      e.code.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.chapter.toLowerCase().includes(q)
    );
  });
}
