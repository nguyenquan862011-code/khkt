import { describe, expect, it } from "vitest";
import {
  CLASSIC_EXPERIMENTS,
  EXTRA_CLASSIC_EXPERIMENTS,
  ALL_CLASSIC_EXPERIMENTS,
} from "@/data/classic-experiments";

describe("Thư viện thí nghiệm kinh điển — không được ẩn thí nghiệm", () => {
  it("catalog gộp có đủ 42 = 30 gốc + 12 bổ sung", () => {
    expect(CLASSIC_EXPERIMENTS).toHaveLength(30);
    expect(EXTRA_CLASSIC_EXPERIMENTS).toHaveLength(12);
    expect(ALL_CLASSIC_EXPERIMENTS).toHaveLength(42);
  });

  it("ALL chứa toàn bộ 30 thí nghiệm gốc (không mất cái nào)", () => {
    const allIds = new Set(ALL_CLASSIC_EXPERIMENTS.map((e) => e.id));
    for (const exp of CLASSIC_EXPERIMENTS) {
      expect(allIds.has(exp.id)).toBe(true);
    }
  });

  it("ALL chứa toàn bộ 12 thí nghiệm bổ sung (CE31–CE42 không bị ẩn)", () => {
    const allCodes = new Set(ALL_CLASSIC_EXPERIMENTS.map((e) => e.code));
    for (const exp of EXTRA_CLASSIC_EXPERIMENTS) {
      expect(allCodes.has(exp.code)).toBe(true);
    }
    expect([...allCodes].sort()).toContain("CE42");
  });

  it("mã CE01..CE42 đầy đủ, không trùng, không thiếu", () => {
    const codes = ALL_CLASSIC_EXPERIMENTS.map((e) => e.code).sort();
    const expected = Array.from({ length: 42 }, (_, i) => `CE${String(i + 1).padStart(2, "0")}`);
    expect(codes).toEqual(expected);
  });

  it("mọi thí nghiệm đều có compute() — tương tác được", () => {
    const missing = ALL_CLASSIC_EXPERIMENTS.filter((e) => typeof e.compute !== "function");
    expect(missing.map((e) => e.code)).toEqual([]);
  });

  it("mọi thí nghiệm đều có modelParams để kéo slider", () => {
    const missing = ALL_CLASSIC_EXPERIMENTS.filter(
      (e) => !Array.isArray(e.modelParams) || e.modelParams.length === 0,
    );
    expect(missing.map((e) => e.code)).toEqual([]);
  });

  it("compute() trả về metrics với tham số mặc định, không ném lỗi", () => {
    for (const exp of ALL_CLASSIC_EXPERIMENTS) {
      const defaults: Record<string, number> = {};
      for (const p of exp.modelParams) {
        defaults[p.label] = p.defaultVal;
      }
      const result = exp.compute(defaults);
      expect(result, `${exp.code} compute()`).toBeDefined();
      expect(Array.isArray(result.metrics)).toBe(true);
      expect(result.metrics.length).toBeGreaterThan(0);
      for (const m of result.metrics) {
        expect(typeof m.label).toBe("string");
        expect(m.label.trim().length).toBeGreaterThan(0);
        expect(String(m.value).length).toBeGreaterThan(0);
      }
    }
  });

  it("mỗi thí nghiệm có câu hỏi phản biện + đáp án hợp lệ", () => {
    for (const exp of ALL_CLASSIC_EXPERIMENTS) {
      expect(exp.reflectionQuestion.trim().length).toBeGreaterThan(0);
      expect(exp.reflectionOptions.length).toBeGreaterThanOrEqual(2);
      expect(exp.reflectionCorrectIndex).toBeGreaterThanOrEqual(0);
      expect(exp.reflectionCorrectIndex).toBeLessThan(exp.reflectionOptions.length);
      expect(exp.reflectionExplain.trim().length).toBeGreaterThan(0);
    }
  });

  it("không có nội dung nào nhắc tới site bên thứ ba", () => {
    const serialized = JSON.stringify(ALL_CLASSIC_EXPERIMENTS).toLowerCase();
    expect(serialized).not.toContain("vatly.ai");
  });
});
