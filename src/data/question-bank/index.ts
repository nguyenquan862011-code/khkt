/**
 * Ngân hàng bài tập TamGiang Physics — điểm truy cập chung.
 * Giai đoạn 1: 13 bài Lớp 10 (b01–b13) + 2 bộ bài tập gắn thí nghiệm. Xem docs/TIEN-DO-NANG-CAP.md.
 */
import { expandBank, type BankItem } from "./dsl";
import { EXPERIMENT_BANK, EXPERIMENT_SETS } from "./experiments";
import { LESSON_CATALOG } from "./lesson-catalog";
import { LOP10A } from "./lop10a";
import { LOP10B } from "./lop10b";
import type { Question, QuestionLevel } from "./types";

export * from "./types";
export { LESSON_CATALOG, EXPERIMENT_SETS };

export interface PracticeSet {
  code: string;
  key: string;
  grade: string;
  topic: string;
  name: string;
  /** Đường dẫn mở bài học / thí nghiệm liên quan để ôn tập. */
  href: string;
  experiment?: string;
}

const RAW: Record<string, BankItem[]> = { ...LOP10A, ...LOP10B, ...EXPERIMENT_BANK };

export const PRACTICE_SETS: PracticeSet[] = [
  ...LESSON_CATALOG.filter((l) => RAW[l.code]).map((l) => ({
    code: l.code,
    key: l.key,
    grade: l.grade,
    topic: l.topic,
    name: l.name,
    href: `/mo-phong/${l.firstPath}`,
  })),
  ...EXPERIMENT_SETS.map((s) => ({
    code: s.code,
    key: s.key,
    grade: s.grade,
    topic: "Bài tập gắn với thí nghiệm",
    name: s.name,
    href: s.href,
    experiment: s.experiment,
  })),
];

/** Các bài trong giáo trình chưa có ngân hàng câu hỏi nội bộ (sẽ bổ sung ở giai đoạn sau). */
export const PENDING_LESSONS = LESSON_CATALOG.filter((l) => !RAW[l.code]);

const cache = new Map<string, Question[]>();

export function getSetQuestions(code: string): Question[] {
  const cached = cache.get(code);
  if (cached) return cached;
  const set = PRACTICE_SETS.find((s) => s.code === code);
  const items = RAW[code];
  if (!set || !items) return [];
  const questions = expandBank(code, set.key, items);
  cache.set(code, questions);
  return questions;
}

export function getAllQuestions(): Question[] {
  return PRACTICE_SETS.flatMap((s) => getSetQuestions(s.code));
}

export function getSetByKey(key: string): PracticeSet | undefined {
  return PRACTICE_SETS.find((s) => s.key === key || s.code === key);
}

export function countByLevel(questions: Question[]): Record<QuestionLevel, number> {
  const out: Record<QuestionLevel, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const item of questions) out[item.level]++;
  return out;
}

/** Bộ bài tập khai thác một thí nghiệm / mô phỏng cụ thể. */
export function getExperimentSet(experimentId: string): PracticeSet | undefined {
  return PRACTICE_SETS.find(
    (s) =>
      s.experiment === experimentId ||
      getSetQuestions(s.code).some((x) => x.experiment === experimentId),
  );
}
