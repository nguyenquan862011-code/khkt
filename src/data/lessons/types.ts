/**
 * Mô hình nội dung bài giảng do Trường THPT Tam Giang biên soạn.
 *
 * Nguyên tắc:
 *  - Toàn bộ văn bản ở đây do nhà trường tự soạn theo khung chương trình GDPT
 *    môn Vật lý của Bộ GD&ĐT. Không sao chép từ bất kỳ website bên thứ ba nào.
 *  - Khung kiến thức (tên bài, thứ tự) là khung chung của Bộ GD&ĐT.
 *  - Mỗi bài phải được giáo viên bộ môn duyệt trước khi công bố rộng rãi.
 *
 * Trạng thái duyệt: xem `review.status` của từng bài.
 *  - "draft"       : AI soạn, CHƯA có giáo viên duyệt — hiển thị nhãn cảnh báo
 *  - "teacher-reviewed": giáo viên đã duyệt nội dung
 */

export type ReviewStatus = "draft" | "teacher-reviewed";

export interface LessonBlockText {
  type: "text";
  /** Đoạn văn. Cho phép **đậm** và *nghiêng* bằng markdown nhẹ. */
  value: string;
}

export interface LessonBlockFormula {
  type: "formula";
  /** Công thức dạng chữ, ví dụ "v = s / t" */
  expression: string;
  /** Giải thích các đại lượng */
  legend?: string;
}

export interface LessonBlockList {
  type: "list";
  ordered?: boolean;
  items: string[];
}

export interface LessonBlockCallout {
  type: "callout";
  tone: "info" | "warn" | "tip";
  title: string;
  value: string;
}

export interface LessonBlockTable {
  type: "table";
  headers: string[];
  rows: string[][];
  caption?: string;
}

export type LessonBlock =
  LessonBlockText | LessonBlockFormula | LessonBlockList | LessonBlockCallout | LessonBlockTable;

export interface LessonExample {
  id: string;
  title: string;
  /** Đề bài */
  prompt: string;
  /** Các bước giải, hiển thị lần lượt */
  steps: { label: string; detail: string }[];
  /** Kết quả cuối */
  answer: string;
}

export interface LessonExercise {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonReflection {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonContent {
  /** Khoá khớp với `lessonSlug` trong curriculum.json */
  lessonSlug: string;
  /** Tiêu đề hiển thị */
  title: string;
  /** Mục tiêu học tập (2–4 gạch đầu dòng) */
  objectives: string[];
  /** Nội dung lý thuyết chính */
  blocks: LessonBlock[];
  /** Ví dụ minh hoạ có lời giải từng bước */
  examples: LessonExample[];
  /** Bài tập tự kiểm tra */
  exercises: LessonExercise[];
  /** Câu hỏi phản biện, kết nối với thí nghiệm kinh điển nếu có */
  reflection?: LessonReflection;
  /** Slug thí nghiệm trong classic-experiments.ts để liên kết (tuỳ chọn) */
  relatedExperimentId?: string;
  /** Slug mô phỏng tương tác trong physics-simulations.ts (tuỳ chọn) */
  relatedSimulationDomain?: string;
  review: {
    status: ReviewStatus;
    /** Ghi chú về trạng thái duyệt */
    note?: string;
    updatedAt: string;
  };
}

/** Tập hợp nội dung bài giảng đã biên soạn */
export interface LessonContentMap {
  [lessonSlug: string]: LessonContent;
}
