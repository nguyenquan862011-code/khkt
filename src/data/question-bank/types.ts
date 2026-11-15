/** Ngân hàng bài tập TamGiang Physics — kiểu dữ liệu dùng chung. */

/** 1 Nhận biết · 2 Thông hiểu · 3 Vận dụng · 4 Vận dụng cao */
export type QuestionLevel = 1 | 2 | 3 | 4;

export const LEVEL_LABELS: Record<QuestionLevel, string> = {
  1: "Nhận biết",
  2: "Thông hiểu",
  3: "Vận dụng",
  4: "Vận dụng cao",
};

export const LEVEL_SLUGS: Record<QuestionLevel, string> = {
  1: "nhan-biet",
  2: "thong-hieu",
  3: "van-dung",
  4: "van-dung-cao",
};

/** 10 dạng bài tập theo yêu cầu xây dựng ngân hàng câu hỏi. */
export type QuestionCategory =
  | "trac-nghiem"
  | "dung-sai"
  | "tra-loi-ngan"
  | "tinh-toan"
  | "do-thi"
  | "bang-so-lieu"
  | "thuc-te"
  | "thuc-nghiem"
  | "lien-mon"
  | "tong-hop";

export const CATEGORY_LABELS: Record<QuestionCategory, string> = {
  "trac-nghiem": "Trắc nghiệm 4 phương án",
  "dung-sai": "Trắc nghiệm đúng/sai",
  "tra-loi-ngan": "Trả lời ngắn",
  "tinh-toan": "Bài tập tính toán",
  "do-thi": "Phân tích đồ thị",
  "bang-so-lieu": "Đọc bảng số liệu",
  "thuc-te": "Giải thích hiện tượng thực tế",
  "thuc-nghiem": "Bài tập thực nghiệm",
  "lien-mon": "Vận dụng liên môn",
  "tong-hop": "Tổng hợp nhiều kiến thức",
};

export interface GraphFigure {
  type: "graph";
  title?: string;
  xLabel: string;
  yLabel: string;
  series: { label?: string; points: [number, number][] }[];
}

export interface TableFigure {
  type: "table";
  caption?: string;
  headers: string[];
  rows: (string | number)[][];
}

export type QuestionFigure = GraphFigure | TableFigure;

interface QuestionBase {
  id: string;
  lessonKey: string;
  level: QuestionLevel;
  category: QuestionCategory;
  stem: string;
  explanation: string;
  figure?: QuestionFigure;
  /** true nếu câu hỏi sinh từ mẫu tham số hoá (cùng dạng, khác số liệu). */
  generated?: boolean;
  /** Phân tích chuyên sâu cho câu vận dụng cao (dạng khó, hướng tư duy, kiến thức, lỗi sai thường gặp). */
  deep?: DeepAnalysis;
  /** Mã thí nghiệm / mô phỏng trên website mà câu hỏi khai thác. */
  experiment?: string;
}

/** 10 dạng vận dụng cao có chiều sâu. */
export const VDC_TYPES = {
  "nhieu-buoc": "Bài toán nhiều bước",
  nguoc: "Bài toán ngược",
  "do-thi": "Phân tích đồ thị nâng cao",
  "so-lieu": "Xử lí số liệu thực nghiệm",
  "thi-nghiem": "Khai thác thí nghiệm",
  "sai-so": "Sai số và đánh giá phép đo",
  "sua-loi": "Phát hiện và sửa lỗi sai",
  "thiet-ke": "Thiết kế phương án thí nghiệm",
  "thuc-tien": "Tình huống thực tiễn",
  "lien-chuong": "Tổng hợp liên chương",
} as const;

export type VdcType = keyof typeof VDC_TYPES;

export interface DeepAnalysis {
  type: VdcType;
  /** Phân tích tư duy / hướng giải. */
  thinking: string;
  /** Kiến thức cần vận dụng. */
  knowledge: string;
  /** Lỗi sai thường gặp. */
  pitfall: string;
}

export interface McqQuestion extends QuestionBase {
  form: "mcq";
  options: string[];
  answerIndex: number;
}

export interface TrueFalseQuestion extends QuestionBase {
  form: "tf";
  statements: { text: string; answer: boolean; note?: string }[];
}

export interface ShortQuestion extends QuestionBase {
  form: "short";
  /** Các đáp án chấp nhận (so sánh không phân biệt hoa thường, dấu cách, dấu câu). */
  accept: string[];
}

export interface NumericQuestion extends QuestionBase {
  form: "numeric";
  answer: number;
  unit: string;
  /** Sai số tương đối chấp nhận (mặc định 2%). */
  relTol: number;
  /** Sai số tuyệt đối chấp nhận tối thiểu. */
  absTol: number;
}

export type Question = McqQuestion | TrueFalseQuestion | ShortQuestion | NumericQuestion;

/** Câu trả lời của học sinh cho từng dạng. */
export type UserAnswer =
  | { form: "mcq"; choice: number | null }
  | { form: "tf"; choices: (boolean | null)[] }
  | { form: "short"; text: string }
  | { form: "numeric"; text: string };
