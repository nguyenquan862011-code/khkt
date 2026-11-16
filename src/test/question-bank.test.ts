import { describe, expect, it } from "vitest";
import { curriculum } from "@/data/curriculum";
import {
  LESSON_CATALOG,
  PRACTICE_SETS,
  VDC_TYPES,
  countByLevel,
  getAllQuestions,
  getSetQuestions,
} from "@/data/question-bank";
import { EXPERIMENT_PRACTICE_LINKS } from "@/data/question-bank/links";
import {
  gradeQuestion,
  parseNumber,
  formatCorrectAnswer,
  pickQuestions,
} from "@/lib/practice/grading";
import { mergeLearningStates, getLearningState } from "@/lib/learning-store";

describe("Ngân hàng bài tập", () => {
  const all = getAllQuestions();

  it("danh mục 46 bài khớp với giáo trình và không trùng khóa", () => {
    const keys = new Set(
      Object.values(curriculum.lessons).map((l) => l.slugPath.slice(0, 4).join("/")),
    );
    expect(LESSON_CATALOG).toHaveLength(46);
    expect(new Set(LESSON_CATALOG.map((l) => l.key)).size).toBe(46);
    for (const entry of LESSON_CATALOG) {
      expect(keys.has(entry.key)).toBe(true);
      expect(curriculum.lessons[entry.firstPath]).toBeDefined();
    }
  });

  it("mọi câu hỏi có mã duy nhất, đề bài không trùng, có đáp án và lời giải", () => {
    expect(new Set(all.map((x) => x.id)).size).toBe(all.length);
    expect(new Set(all.map((x) => x.lessonKey + "|" + x.stem)).size).toBe(all.length);
    for (const item of all) {
      expect(item.stem.length, item.id).toBeGreaterThanOrEqual(8);
      expect(item.explanation.length, item.id).toBeGreaterThan(10);
      expect(item.stem + item.explanation, item.id).not.toMatch(
        /NaN|undefined|Infinity|\d\.\d{5,}/,
      );
      if (item.form === "mcq") {
        expect(new Set(item.options).size, item.id).toBe(4);
        expect(item.options[item.answerIndex]).toBeTruthy();
      } else if (item.form === "tf") {
        expect(item.statements, item.id).toHaveLength(4);
      } else if (item.form === "numeric") {
        expect(Number.isFinite(item.answer), item.id).toBe(true);
      } else {
        expect(item.accept.length).toBeGreaterThan(0);
      }
      if (item.figure?.type === "graph") {
        for (const s of item.figure.series)
          for (const p of s.points) expect(p.every(Number.isFinite)).toBe(true);
      }
    }
  });

  it("câu sinh từ mẫu ổn định giữa các lần tải (đồng bộ đa thiết bị)", () => {
    const again = getSetQuestions("b07").map((x) => x.id + x.stem);
    expect(getSetQuestions("b07").map((x) => x.id + x.stem)).toEqual(again);
  });

  it("mỗi bài Lớp 10 có đủ 4 mức độ và ít nhất 5 dạng bài", () => {
    // Ngưỡng tối thiểu của Giai đoạn 1; mục tiêu tham chiếu 10/10/10/5 được theo dõi trong docs/TIEN-DO-NANG-CAP.md.
    for (const set of PRACTICE_SETS.filter((s) => /^b/.test(s.code))) {
      const questions = getSetQuestions(set.code);
      const levels = countByLevel(questions);
      expect(questions.length, set.name).toBeGreaterThanOrEqual(20);
      for (const level of [1, 2, 3, 4] as const)
        expect(levels[level], `${set.name} mức ${level}`).toBeGreaterThanOrEqual(1);
      expect(new Set(questions.map((x) => x.category)).size, set.name).toBeGreaterThanOrEqual(5);
    }
  });

  it("câu vận dụng cao gắn thí nghiệm có đủ phân tích tư duy, kiến thức, lỗi sai", () => {
    const deep = all.filter((x) => x.deep);
    expect(deep.length).toBeGreaterThanOrEqual(10);
    for (const item of deep) {
      expect(item.level).toBe(4);
      expect(VDC_TYPES[item.deep!.type]).toBeTruthy();
      expect(item.deep!.thinking.length).toBeGreaterThan(20);
      expect(item.deep!.knowledge.length).toBeGreaterThan(5);
      expect(item.deep!.pitfall.length).toBeGreaterThan(10);
    }
    expect(new Set(deep.map((x) => x.deep!.type)).size).toBeGreaterThanOrEqual(8);
  });

  it("đáp án đúng luôn được chấm đúng; đáp án sai bị chấm sai", () => {
    for (const item of all) {
      if (item.form === "mcq") {
        expect(gradeQuestion(item, { form: "mcq", choice: item.answerIndex }).correct).toBe(true);
        expect(
          gradeQuestion(item, { form: "mcq", choice: (item.answerIndex + 1) % 4 }).correct,
        ).toBe(false);
      } else if (item.form === "tf") {
        const right = item.statements.map((s) => s.answer);
        expect(gradeQuestion(item, { form: "tf", choices: right }).score).toBe(1);
        expect(
          gradeQuestion(item, { form: "tf", choices: right.map((x, i) => (i === 0 ? !x : x)) })
            .score,
        ).toBe(0.5);
      } else if (item.form === "numeric") {
        // Đáp án hiển thị (đã làm tròn) phải được chấm đúng.
        expect(
          gradeQuestion(item, { form: "numeric", text: formatCorrectAnswer(item) }).correct,
          item.id,
        ).toBe(true);
        expect(
          gradeQuestion(item, { form: "numeric", text: String(item.answer * 1.2 + 1) }).correct,
        ).toBe(false);
      } else {
        expect(
          gradeQuestion(item, { form: "short", text: item.accept[0]!.toUpperCase() + " " }).correct,
        ).toBe(true);
      }
    }
  });

  it("hiểu nhiều cách viết số tương đương", () => {
    expect(parseNumber("12,5 m/s")).toBe(12.5);
    expect(parseNumber("12.5")).toBe(12.5);
    expect(parseNumber("4,5·10⁻⁵")).toBeCloseTo(4.5e-5, 12);
    expect(parseNumber("4.5*10^-5 m")).toBeCloseTo(4.5e-5, 12);
    expect(parseNumber("4,5e-5")).toBeCloseTo(4.5e-5, 12);
    expect(parseNumber("3/4")).toBe(0.75);
    expect(parseNumber("−2,0")).toBe(-2);
    expect(parseNumber("abc")).toBeNull();
  });

  it("chấm điền số: chấp nhận làm tròn hợp lí, kèm đơn vị; từ chối đáp án lệch", () => {
    const item = all.find((x) => x.form === "numeric" && Math.abs(x.answer) > 5)!;
    if (item.form !== "numeric") throw new Error("thiếu câu điền số");
    const ok = (text: string) => gradeQuestion(item, { form: "numeric", text }).correct;
    expect(ok(String(item.answer).replace(".", ","))).toBe(true);
    expect(ok(`${(item.answer * 1.01).toFixed(4)} ${item.unit}`)).toBe(true);
    expect(ok(String(item.answer * 1.1))).toBe(false);
    expect(gradeQuestion(item, { form: "numeric", text: "" }).answered).toBe(false);
  });

  it("chọn đề: đủ số câu, không lặp, trải các mức độ", () => {
    const pool = getSetQuestions("b08");
    const picked = pickQuestions(pool, 10, 42);
    expect(picked).toHaveLength(10);
    expect(new Set(picked.map((x) => x.id)).size).toBe(10);
    expect(new Set(picked.map((x) => x.level)).size).toBe(4);
    expect(pickQuestions(pool.slice(0, 3), 10, 1)).toHaveLength(3);
  });

  it("mỗi liên kết thí nghiệm → bài tập trỏ tới bộ đề có thật và có câu vận dụng cao", () => {
    for (const [experiment, link] of Object.entries(EXPERIMENT_PRACTICE_LINKS)) {
      const questions = getSetQuestions(link.code);
      expect(questions.length, experiment).toBeGreaterThan(5);
      expect(
        questions.every((x) => x.experiment),
        experiment,
      ).toBe(true);
      expect(
        questions.some((x) => x.level === 4 && x.deep),
        experiment,
      ).toBe(true);
    }
  });

  it("hợp nhất tiến độ hai thiết bị: không mất và không trùng dữ liệu", () => {
    const local = {
      ...getLearningState(),
      viewedLessons: ["a", "b"],
      savedQuestions: ["q1"],
      notes: { n: { id: "n", title: "t", content: "cũ", updatedAt: "2026-01-01" } },
    };
    const merged = mergeLearningStates(local, {
      viewedLessons: ["b", "c"],
      savedQuestions: ["q2"],
      notes: { n: { id: "n", title: "t", content: "mới", updatedAt: "2026-02-01" } },
    });
    expect(merged.viewedLessons).toEqual(["a", "b", "c"]);
    expect(merged.savedQuestions).toEqual(["q1", "q2"]);
    expect(merged.notes["n"]!.content).toBe("mới");
  });
});
