/**
 * Liên kết thí nghiệm / mô phỏng trên website → bộ bài tập khai thác chính thí nghiệm đó.
 * Tệp này cố ý rất nhẹ (không import ngân hàng câu hỏi) để nhúng được vào các trang mô phỏng.
 */
export const EXPERIMENT_PRACTICE_LINKS: Record<string, { code: string; label: string }> = {
  "circular-motion": { code: "e01", label: "Bài tập gắn với thí nghiệm chuyển động tròn đều" },
  "co-hoc": { code: "e02", label: "Bài tập vận dụng cao: rơi tự do & ném xiên" },
};
