import type { LessonContent } from "./types";
import { bai01LamQuenVoiMonVatLy } from "./bai-01-lam-quen-voi-mon-vat-ly";

/**
 * Đăng ký nội dung bài giảng do nhà trường biên soạn.
 *
 * Khoá là `lessonSlug` — khớp với curriculum.json.
 * Bài nào chưa có trong map này sẽ dùng giao diện mô phỏng mặc định.
 */
const REGISTRY: Record<string, LessonContent> = {
  [bai01LamQuenVoiMonVatLy.lessonSlug]: bai01LamQuenVoiMonVatLy,
};

export function getLessonContent(lessonSlug: string): LessonContent | undefined {
  return REGISTRY[lessonSlug];
}

export function hasLessonContent(lessonSlug: string): boolean {
  return lessonSlug in REGISTRY;
}

/** Danh sách slug đã biên soạn nội dung */
export function getAuthoredLessonSlugs(): string[] {
  return Object.keys(REGISTRY);
}

export const AUTHORED_LESSON_COUNT = Object.keys(REGISTRY).length;

export type { LessonContent } from "./types";
