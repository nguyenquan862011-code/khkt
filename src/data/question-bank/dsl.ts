/**
 * Bộ dựng câu hỏi: viết ngắn gọn câu hỏi tĩnh và mẫu tham số hoá.
 * Mỗi mẫu tham số hoá được "bung" thành nhiều biến thể bằng bộ sinh số giả ngẫu nhiên CÓ HẠT GIỐNG CỐ ĐỊNH,
 * nên mã câu hỏi, số liệu, đáp án và lời giải luôn giống nhau trên mọi thiết bị.
 */
import type {
  DeepAnalysis,
  McqQuestion,
  NumericQuestion,
  Question,
  QuestionCategory,
  QuestionFigure,
  QuestionLevel,
  ShortQuestion,
  TrueFalseQuestion,
} from "./types";

/* ---------- Số giả ngẫu nhiên có hạt giống ---------- */

function hashString(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export class Rng {
  private state: number;

  constructor(seed: string | number) {
    this.state = typeof seed === "number" ? seed >>> 0 : hashString(seed);
  }

  /** Số thực trong [0, 1). */
  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Số nguyên trong [min, max]. */
  i(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  /** Giá trị trên lưới min, min+step, …, max (đã khử sai số dấu phẩy động). */
  s(min: number, max: number, step: number): number {
    const n = Math.round((max - min) / step);
    return round(min + this.i(0, n) * step, 6);
  }

  pick<T>(list: readonly T[]): T {
    return list[this.i(0, list.length - 1)]!;
  }

  shuffle<T>(list: readonly T[]): T[] {
    const out = [...list];
    for (let k = out.length - 1; k > 0; k--) {
      const j = this.i(0, k);
      [out[k], out[j]] = [out[j]!, out[k]!];
    }
    return out;
  }
}

/* ---------- Định dạng số kiểu Việt Nam ---------- */

export function round(x: number, digits = 3): number {
  const f = 10 ** digits;
  return Math.round((x + Number.EPSILON) * f) / f;
}

/** Làm tròn tới n chữ số có nghĩa. */
export function sig(x: number, n = 3): number {
  if (x === 0 || !Number.isFinite(x)) return x;
  const d = Math.ceil(Math.log10(Math.abs(x)));
  const f = 10 ** (n - d);
  return Math.round(x * f) / f;
}

const SUP: Record<string, string> = {
  "-": "⁻",
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
};

/** Hiển thị số: dấu phẩy thập phân, tối đa `digits` chữ số thập phân; số rất lớn/nhỏ dùng a·10ⁿ. */
export function v(x: number, digits = 3): string {
  if (!Number.isFinite(x)) return "—";
  const abs = Math.abs(x);
  if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) {
    const exp = Math.floor(Math.log10(abs));
    const mant = round(x / 10 ** exp, 2);
    const expText = String(exp)
      .split("")
      .map((c) => SUP[c] ?? c)
      .join("");
    return `${String(mant).replace(".", ",")}·10${expText}`;
  }
  return String(round(x, digits)).replace(".", ",");
}

/* ---------- Bản nháp câu hỏi ---------- */

type Draft =
  | { form: "mcq"; stem: string; options: string[]; explanation: string; figure?: QuestionFigure }
  | {
      form: "tf";
      stem: string;
      statements: { text: string; answer: boolean; note?: string }[];
      explanation: string;
      figure?: QuestionFigure;
    }
  | { form: "short"; stem: string; accept: string[]; explanation: string; figure?: QuestionFigure }
  | {
      form: "numeric";
      stem: string;
      answer: number;
      unit: string;
      explanation: string;
      relTol?: number;
      absTol?: number;
      figure?: QuestionFigure;
    };

interface ItemExtras {
  deep?: DeepAnalysis;
  experiment?: string;
}

export interface StaticItem extends ItemExtras {
  kind: "static";
  level: QuestionLevel;
  category: QuestionCategory;
  draft: Draft;
}

export interface TemplateItem extends ItemExtras {
  kind: "template";
  level: QuestionLevel;
  category: QuestionCategory;
  variants: number;
  make: (r: Rng, index: number) => Draft;
}

export type BankItem = StaticItem | TemplateItem;

/** Viết tắt dạng bài: tn, ds, tln, tt, dt, bs, tte, tng, lm, th. */
const CATEGORY_CODES = {
  tn: "trac-nghiem",
  ds: "dung-sai",
  tln: "tra-loi-ngan",
  tt: "tinh-toan",
  dt: "do-thi",
  bs: "bang-so-lieu",
  tte: "thuc-te",
  tng: "thuc-nghiem",
  lm: "lien-mon",
  th: "tong-hop",
} as const satisfies Record<string, QuestionCategory>;

export type Cat = keyof typeof CATEGORY_CODES;

/** Bản nháp trắc nghiệm: phương án ĐÚNG luôn viết đầu tiên, thứ tự hiển thị được xáo cố định. */
export function M(
  stem: string,
  options: [string, string, string, string],
  explanation: string,
  figure?: QuestionFigure,
): Draft {
  return { form: "mcq", stem, options, explanation, ...(figure ? { figure } : {}) };
}

/** Bản nháp đúng/sai gồm 4 ý: [nội dung, đúng?, ghi chú]. */
export function T(
  stem: string,
  statements: [string, boolean, string?][],
  explanation = "",
  figure?: QuestionFigure,
): Draft {
  return {
    form: "tf",
    stem,
    statements: statements.map(([text, answer, note]) => ({
      text,
      answer,
      ...(note ? { note } : {}),
    })),
    explanation,
    ...(figure ? { figure } : {}),
  };
}

/** Bản nháp trả lời ngắn (chữ). */
export function S(stem: string, accept: string[], explanation: string): Draft {
  return { form: "short", stem, accept, explanation };
}

/** Bản nháp điền số. */
export function N(
  stem: string,
  answer: number,
  unit: string,
  explanation: string,
  opts: { relTol?: number; absTol?: number; figure?: QuestionFigure } = {},
): Draft {
  return { form: "numeric", stem, answer, unit, explanation, ...opts };
}

/** Trắc nghiệm số: tự định dạng đáp án và các phương án nhiễu (bỏ phương án trùng). */
export function NM(
  stem: string,
  answer: number,
  unit: string,
  wrong: number[],
  explanation: string,
  figure?: QuestionFigure,
): Draft {
  const fmt = (x: number) => `${v(sig(x, 3))}${unit ? " " + unit : ""}`;
  const correct = fmt(answer);
  const distractors: string[] = [];
  const pool = [
    ...wrong,
    answer * 2,
    answer / 2,
    answer * 1.5,
    answer * 0.1,
    answer * 10,
    answer + 1,
  ];
  for (const w of pool) {
    const text = fmt(w);
    if (text !== correct && !distractors.includes(text) && Number.isFinite(w))
      distractors.push(text);
    if (distractors.length === 3) break;
  }
  return M(stem, [correct, distractors[0]!, distractors[1]!, distractors[2]!], explanation, figure);
}

/** Câu hỏi tĩnh. */
export function q(level: QuestionLevel, cat: Cat, draft: Draft): StaticItem {
  return { kind: "static", level, category: CATEGORY_CODES[cat], draft };
}

/** Mẫu tham số hoá sinh `variants` biến thể khác số liệu. */
export function g(
  level: QuestionLevel,
  cat: Cat,
  variants: number,
  make: (r: Rng, index: number) => Draft,
): TemplateItem {
  return { kind: "template", level, category: CATEGORY_CODES[cat], variants, make };
}

/** Gắn phân tích vận dụng cao (dạng khó, hướng tư duy, kiến thức, lỗi sai) cho một mục. */
export function deep<I extends BankItem>(item: I, analysis: DeepAnalysis): I {
  return { ...item, deep: analysis };
}

/** Gắn câu hỏi với một thí nghiệm / mô phỏng đang có trên website. */
export function exp<I extends BankItem>(experiment: string, item: I): I {
  return { ...item, experiment };
}

/* ---------- Bung ngân hàng ---------- */

function finalize(
  draft: Draft,
  meta: {
    id: string;
    lessonKey: string;
    level: QuestionLevel;
    category: QuestionCategory;
    generated: boolean;
    deep?: DeepAnalysis;
    experiment?: string;
  },
): Question {
  const base = {
    id: meta.id,
    lessonKey: meta.lessonKey,
    level: meta.level,
    category: meta.category,
    stem: draft.stem,
    explanation: draft.explanation,
    ...(draft.figure ? { figure: draft.figure } : {}),
    ...(meta.generated ? { generated: true } : {}),
    ...(meta.deep ? { deep: meta.deep } : {}),
    ...(meta.experiment ? { experiment: meta.experiment } : {}),
  };
  if (draft.form === "mcq") {
    const order = new Rng(`${meta.id}|order`).shuffle([0, 1, 2, 3]);
    const question: McqQuestion = {
      ...base,
      form: "mcq",
      options: order.map((i) => draft.options[i]!),
      answerIndex: order.indexOf(0),
    };
    return question;
  }
  if (draft.form === "tf") {
    const question: TrueFalseQuestion = { ...base, form: "tf", statements: draft.statements };
    return question;
  }
  if (draft.form === "short") {
    const question: ShortQuestion = { ...base, form: "short", accept: draft.accept };
    return question;
  }
  const question: NumericQuestion = {
    ...base,
    form: "numeric",
    answer: draft.answer,
    unit: draft.unit,
    relTol: draft.relTol ?? 0.02,
    absTol: draft.absTol ?? 0,
  };
  return question;
}

/** Bung danh sách mục của một bài thành câu hỏi hoàn chỉnh với mã ổn định `<code>-<stt>[v<biến thể>]`. */
export function expandBank(code: string, lessonKey: string, items: BankItem[]): Question[] {
  const out: Question[] = [];
  const seenStems = new Set<string>();
  items.forEach((item, index) => {
    const slot = String(index + 1).padStart(2, "0");
    if (item.kind === "static") {
      out.push(
        finalize(item.draft, {
          id: `${code}-${slot}`,
          lessonKey,
          level: item.level,
          category: item.category,
          generated: false,
          ...(item.deep ? { deep: item.deep } : {}),
          ...(item.experiment ? { experiment: item.experiment } : {}),
        }),
      );
      seenStems.add(item.draft.stem);
      return;
    }
    for (let variant = 0; variant < item.variants; variant++) {
      let draft: Draft | null = null;
      // Đổi hạt giống nếu trùng đề với biến thể trước đó.
      for (let attempt = 0; attempt < 12; attempt++) {
        const candidate = item.make(new Rng(`${code}|${slot}|${variant}|${attempt}`), variant);
        if (!seenStems.has(candidate.stem)) {
          draft = candidate;
          break;
        }
      }
      if (!draft) continue;
      seenStems.add(draft.stem);
      out.push(
        finalize(draft, {
          id: `${code}-${slot}v${variant + 1}`,
          lessonKey,
          level: item.level,
          category: item.category,
          generated: true,
          ...(item.deep ? { deep: item.deep } : {}),
          ...(item.experiment ? { experiment: item.experiment } : {}),
        }),
      );
    }
  });
  return out;
}
