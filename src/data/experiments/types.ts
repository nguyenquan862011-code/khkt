/**
 * Schema thống nhất cho thư viện thí nghiệm mở rộng (đợt 1+).
 * Mỗi thí nghiệm gồm đủ 14 phần chuẩn hiển thị ở trang chi tiết:
 * 1. Giới thiệu · 2. Mục tiêu · 3. Kiến thức Vật lý · 4. Dụng cụ ·
 * 5. Hình ảnh thực tế · 6. Quy trình · 7–11. Mô phỏng tương tác
 * (điều chỉnh thông số → kết quả → bảng số liệu → đồ thị) ·
 * 12. Giải thích hiện tượng · 13. Kết luận · 14. Câu hỏi kiểm tra.
 */

export type ExperimentTopic =
  | "co-hoc"
  | "nhiet-hoc"
  | "dien-hoc"
  | "tu-hoc"
  | "quang-hoc"
  | "dao-dong-song"
  | "vat-ly-hien-dai"
  | "vat-ly-hat-nhan"
  | "stem"
  | "lien-mon";

export type ExperimentLevel = "10" | "11" | "12" | "nang-cao";

export type ExperimentKind = "thi-nghiem" | "mo-phong" | "ung-dung" | "stem";

/** Một thông số người dùng chỉnh được trong mô phỏng. */
export interface ParamDef {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  default: number;
}

export interface SimOutput {
  label: string;
  value: number;
  unit: string;
}

export interface SeriesPoint {
  x: number;
  y: number;
}

/** Chuỗi dữ liệu để vẽ đồ thị (tự sinh từ engine khi mô phỏng chạy). */
export interface SimSeries {
  label: string;
  points: SeriesPoint[];
  xLabel: string;
  yLabel: string;
}

/** Đối tượng SVG dùng chung cho mọi scene mô phỏng. */
export type SceneObject =
  | {
      t: "circle";
      cx: number;
      cy: number;
      r: number;
      fill?: string;
      stroke?: string;
      width?: number;
      opacity?: number;
    }
  | {
      t: "rect";
      x: number;
      y: number;
      w: number;
      h: number;
      fill?: string;
      stroke?: string;
      width?: number;
      rx?: number;
      opacity?: number;
    }
  | {
      t: "line";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      stroke?: string;
      width?: number;
      dash?: string;
      opacity?: number;
    }
  | {
      t: "text";
      x: number;
      y: number;
      text: string;
      size?: number;
      fill?: string;
      anchor?: "start" | "middle" | "end";
    }
  | {
      t: "path";
      d: string;
      stroke?: string;
      fill?: string;
      width?: number;
      opacity?: number;
    };

/** Một engine mô phỏng: tính kết quả thật + dựng scene hoạt ảnh. */
export interface EngineDef {
  id: string;
  params: ParamDef[];
  /** Kết quả vật lý tính từ thông số hiện tại. */
  compute: (p: Record<string, number>) => SimOutput[];
  /** Chuỗi số liệu để vẽ đồ thị (tuỳ chọn). */
  series?: (p: Record<string, number>) => SimSeries[];
  /** Scene SVG tại thời điểm t (giây). */
  render: (p: Record<string, number>, t: number) => SceneObject[];
  /** Thời lượng hoạt ảnh (giây). */
  duration: (p: Record<string, number>) => number;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answerIndex: number;
  explain: string;
}

/** Bảng số liệu quan sát/ghi chép của thí nghiệm. */
export interface ExperimentTable {
  columns: string[];
  rows: (string | number)[][];
}

/** Cấu trúc dữ liệu thống nhất cho mọi thí nghiệm trong thư viện. */
export interface ExperimentEntry {
  /** ID duy nhất, dạng TNxxx. */
  id: string;
  /** Mã hiển thị ngắn, duy nhất. */
  code: string;
  /** Slug đường dẫn /thi-nghiem/<slug> — duy nhất. */
  slug: string;
  title: string;
  topic: ExperimentTopic;
  /** Chương/Lĩnh vực trong sách giáo khoa. */
  chapter: string;
  level: ExperimentLevel;
  kind: ExperimentKind;
  durationMinutes: number;
  /** Mô tả ngắn cho card. */
  description: string;
  /** Khóa ảnh trong EXPERIMENT_PHOTOS (dùng ảnh thật có sẵn). */
  photoIds: string[];
  /** Bài học liên quan trong giáo trình (đường dẫn /mo-phong/... hợp lệ). */
  relatedLessonPath?: string;

  // ——— 14 phần chuẩn ———
  intro: string;
  objectives: string[];
  knowledge: string[];
  apparatus: string[];
  procedure: string[];
  /** Mô phỏng tương tác (engine + thông số khởi tạo). */
  sim: {
    engineId: string;
    params: Record<string, number>;
  };
  /** Bảng số liệu mẫu (quan sát/ghi chép). */
  dataRows: ExperimentTable;
  /** Giải thích hiện tượng (phần 12). */
  explanation: string;
  /** Kết luận (phần 13). */
  conclusion: string;
  /** Câu hỏi kiểm tra (phần 14). */
  quiz: QuizQuestion[];
}

export const EXPERIMENT_TOPIC_LABELS: Record<ExperimentTopic, string> = {
  "co-hoc": "Cơ học",
  "nhiet-hoc": "Nhiệt học",
  "dien-hoc": "Điện học",
  "tu-hoc": "Từ học – Cảm ứng điện từ",
  "quang-hoc": "Quang học",
  "dao-dong-song": "Dao động và Sóng",
  "vat-ly-hien-dai": "Vật lý hiện đại",
  "vat-ly-hat-nhan": "Vật lý hạt nhân",
  stem: "STEM",
  "lien-mon": "Liên môn",
};

export const EXPERIMENT_LEVEL_LABELS: Record<ExperimentLevel, string> = {
  "10": "Lớp 10",
  "11": "Lớp 11",
  "12": "Lớp 12",
  "nang-cao": "Nâng cao",
};

export const EXPERIMENT_KIND_LABELS: Record<ExperimentKind, string> = {
  "thi-nghiem": "Thí nghiệm",
  "mo-phong": "Mô phỏng",
  "ung-dung": "Ứng dụng",
  stem: "Dự án STEM",
};
