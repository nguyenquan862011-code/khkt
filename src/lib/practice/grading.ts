/**
 * Chấm điểm tự động cho ngân hàng bài tập.
 * - Điền số: chấp nhận dấu phẩy/dấu chấm thập phân, dạng a·10^n, phân số a/b, kèm đơn vị; cho phép sai số làm tròn.
 * - Trả lời ngắn: không phân biệt hoa thường, dấu câu, khoảng trắng và dấu tiếng Việt.
 * - Đúng/sai 4 ý: tính điểm theo thang 0,1 – 0,25 – 0,5 – 1 (đúng 1, 2, 3, 4 ý).
 */
import type { Question, UserAnswer } from "@/data/question-bank/types";

const SUPERSCRIPTS: Record<string, string> = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
  "⁻": "-",
  "⁺": "+",
};

/** Chuyển chuỗi học sinh nhập thành số; trả về null nếu không hiểu được. */
export function parseNumber(input: string): number | null {
  if (typeof input !== "string") return null;
  let text = input.trim().toLowerCase();
  if (!text) return null;
  text = text.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+/g, (m) => "^" + [...m].map((c) => SUPERSCRIPTS[c]).join(""));
  text = text.replace(/−|–/g, "-").replace(/\s+/g, "");
  // "1.234,5" hoặc "1,5" → dấu phẩy là dấu thập phân kiểu Việt Nam
  if (/,/.test(text)) text = text.replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".");
  // a·10^n, a*10^n, ax10^n → aEn
  text = text
    .replace(/[·*x×]10\^?\(?([+-]?\d+)\)?/, "e$1")
    .replace(/^10\^\(?([+-]?\d+)\)?/, "1e$1");
  const fraction = /^([+-]?\d*\.?\d+(?:e[+-]?\d+)?)\/(\d*\.?\d+(?:e[+-]?\d+)?)/.exec(text);
  if (fraction) {
    const den = Number(fraction[2]);
    return den === 0 ? null : Number(fraction[1]) / den;
  }
  const match = /^[+-]?\d*\.?\d+(?:e[+-]?\d+)?/.exec(text);
  if (!match) return null;
  const value = Number(match[0]);
  return Number.isFinite(value) ? value : null;
}

export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export interface GradeResult {
  /** Điểm của câu trong [0, 1]. */
  score: number;
  /** Đúng hoàn toàn. */
  correct: boolean;
  answered: boolean;
}

const TF_SCALE = [0, 0.1, 0.25, 0.5, 1];

export function gradeQuestion(question: Question, answer: UserAnswer | undefined): GradeResult {
  const none: GradeResult = { score: 0, correct: false, answered: false };
  if (!answer || answer.form !== question.form) return none;
  if (question.form === "mcq" && answer.form === "mcq") {
    if (answer.choice == null) return none;
    const ok = answer.choice === question.answerIndex;
    return { score: ok ? 1 : 0, correct: ok, answered: true };
  }
  if (question.form === "tf" && answer.form === "tf") {
    if (!answer.choices.some((c) => c != null)) return none;
    const right = question.statements.filter((s, i) => answer.choices[i] === s.answer).length;
    const score = right === question.statements.length ? 1 : (TF_SCALE[right] ?? 0);
    return { score, correct: score === 1, answered: true };
  }
  if (question.form === "short" && answer.form === "short") {
    if (!answer.text.trim()) return none;
    const given = normalizeText(answer.text);
    const ok = question.accept.some((a) => normalizeText(a) === given);
    return { score: ok ? 1 : 0, correct: ok, answered: true };
  }
  if (question.form === "numeric" && answer.form === "numeric") {
    const value = parseNumber(answer.text);
    if (value == null) return { score: 0, correct: false, answered: Boolean(answer.text.trim()) };
    const tolerance = Math.max(question.absTol, Math.abs(question.answer) * question.relTol, 1e-12);
    const ok = Math.abs(value - question.answer) <= tolerance;
    return { score: ok ? 1 : 0, correct: ok, answered: true };
  }
  return none;
}

/** Đáp án đúng ở dạng chữ để hiển thị và lưu vào lịch sử làm bài. */
export function formatCorrectAnswer(question: Question): string {
  if (question.form === "mcq") {
    return `${"ABCD"[question.answerIndex]}. ${question.options[question.answerIndex]}`;
  }
  if (question.form === "tf") {
    return question.statements
      .map((s, i) => `${"abcd"[i]}) ${s.answer ? "Đúng" : "Sai"}`)
      .join("; ");
  }
  if (question.form === "short") return question.accept[0] ?? "";
  const rounded = Number(question.answer.toPrecision(4));
  return `${String(rounded).replace(".", ",")}${question.unit ? " " + question.unit : ""}`;
}

export function formatUserAnswer(question: Question, answer: UserAnswer | undefined): string {
  if (!answer) return "(bỏ trống)";
  if (answer.form === "mcq" && question.form === "mcq") {
    return answer.choice == null
      ? "(bỏ trống)"
      : `${"ABCD"[answer.choice]}. ${question.options[answer.choice]}`;
  }
  if (answer.form === "tf") {
    return answer.choices
      .map((c, i) => `${"abcd"[i]}) ${c == null ? "—" : c ? "Đúng" : "Sai"}`)
      .join("; ");
  }
  if (answer.form === "short" || answer.form === "numeric")
    return answer.text.trim() || "(bỏ trống)";
  return "(bỏ trống)";
}

/** Chọn ngẫu nhiên n câu, trải đều theo mức độ đã lọc. */
export function pickQuestions(pool: Question[], count: number, seed = Date.now()): Question[] {
  let state = seed >>> 0;
  const rand = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  const byLevel = new Map<number, Question[]>();
  for (const item of shuffled) byLevel.set(item.level, [...(byLevel.get(item.level) ?? []), item]);
  const out: Question[] = [];
  const levels = [...byLevel.keys()].sort();
  while (out.length < Math.min(count, pool.length)) {
    for (const level of levels) {
      const next = byLevel.get(level)!.shift();
      if (next && out.length < count) out.push(next);
    }
  }
  return out.sort((a, b) => a.level - b.level);
}
