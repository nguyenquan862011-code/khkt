/**
 * Kiểm tra toàn vẹn thư viện thí nghiệm mở rộng:
 * ID/slug duy nhất · đủ 14 phần · engine hợp lệ · tìm kiếm/lọc chính xác.
 */
import { describe, expect, it } from "vitest";
import {
  ALL_EXPERIMENTS,
  countByTopic,
  filterExperiments,
  getExperimentById,
  getExperimentBySlug,
} from "@/data/experiments";
import { ENGINES, getEngine } from "@/data/experiments/engines";

describe("Thư viện thí nghiệm mở rộng", () => {
  it("có thí nghiệm và ID/slug/mã là duy nhất", () => {
    expect(ALL_EXPERIMENTS.length).toBeGreaterThanOrEqual(40);
    const ids = ALL_EXPERIMENTS.map((e) => e.id);
    const slugs = ALL_EXPERIMENTS.map((e) => e.slug);
    const codes = ALL_EXPERIMENTS.map((e) => e.code);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("mỗi thí nghiệm đủ 14 phần nội dung", () => {
    for (const e of ALL_EXPERIMENTS) {
      expect(e.intro.length, `${e.id} intro`).toBeGreaterThan(40);
      expect(e.objectives.length, `${e.id} objectives`).toBeGreaterThanOrEqual(2);
      expect(e.knowledge.length, `${e.id} knowledge`).toBeGreaterThanOrEqual(2);
      expect(e.apparatus.length, `${e.id} apparatus`).toBeGreaterThanOrEqual(2);
      expect(e.procedure.length, `${e.id} procedure`).toBeGreaterThanOrEqual(3);
      expect(e.explanation.length, `${e.id} explanation`).toBeGreaterThan(80);
      expect(e.conclusion.length, `${e.id} conclusion`).toBeGreaterThan(30);
      expect(e.quiz.length, `${e.id} quiz`).toBeGreaterThanOrEqual(2);
      expect(e.dataRows.columns.length, `${e.id} columns`).toBeGreaterThanOrEqual(2);
      expect(e.dataRows.rows.length, `${e.id} rows`).toBeGreaterThanOrEqual(2);
      expect(e.photoIds.length, `${e.id} photoIds`).toBeGreaterThanOrEqual(1);
      expect(e.description.length, `${e.id} description`).toBeGreaterThan(30);
      expect(e.durationMinutes, `${e.id} duration`).toBeGreaterThan(0);
    }
  });

  it("mọi câu hỏi kiểm tra có đáp án hợp lệ và giải thích", () => {
    for (const e of ALL_EXPERIMENTS) {
      for (const q of e.quiz) {
        expect(q.options.length, `${e.id} quiz options`).toBeGreaterThanOrEqual(2);
        expect(q.answerIndex, `${e.id} answerIndex`).toBeGreaterThanOrEqual(0);
        expect(q.answerIndex, `${e.id} answerIndex`).toBeLessThan(q.options.length);
        expect(q.explain.length, `${e.id} explain`).toBeGreaterThan(10);
      }
    }
  });

  it("mọi engine được đăng ký hợp lệ: tham số, compute, render, duration", () => {
    for (const e of ALL_EXPERIMENTS) {
      const engine = getEngine(e.sim.engineId);
      expect(engine, `${e.id} engine ${e.sim.engineId} phải tồn tại`).toBeDefined();
      if (!engine) continue;
      for (const def of engine.params) {
        expect(def.min, `${e.id}:${def.key} min`).toBeLessThanOrEqual(def.default);
        expect(def.default, `${e.id}:${def.key} default`).toBeLessThanOrEqual(def.max);
        expect(def.step, `${e.id}:${def.key} step`).toBeGreaterThan(0);
      }
      const outputs = engine.compute(e.sim.params);
      expect(outputs.length, `${e.id} compute`).toBeGreaterThan(0);
      for (const o of outputs) {
        expect(Number.isFinite(o.value), `${e.id} output ${o.label}`).toBe(true);
      }
      const objects = engine.render(e.sim.params, 1);
      expect(objects.length, `${e.id} render`).toBeGreaterThan(0);
      const dur = engine.duration(e.sim.params);
      expect(dur, `${e.id} duration`).toBeGreaterThan(0);
    }
  });

  it("bảng số liệu có số cột khớp mọi hàng", () => {
    for (const e of ALL_EXPERIMENTS) {
      for (const row of e.dataRows.rows) {
        expect(row.length, `${e.id} row width`).toBe(e.dataRows.columns.length);
      }
    }
  });

  it("tra cứu theo slug và ID hoạt động", () => {
    const first = ALL_EXPERIMENTS[0];
    expect(first).toBeDefined();
    if (!first) return;
    expect(getExperimentBySlug(first.slug)?.id).toBe(first.id);
    expect(getExperimentById(first.id)?.slug).toBe(first.slug);
    expect(getExperimentBySlug("khong-ton-tai-xyz")).toBeUndefined();
  });

  it("tìm kiếm và lọc hoạt động chính xác", () => {
    const all = filterExperiments({});
    expect(all.length).toBe(ALL_EXPERIMENTS.length);
    const first = ALL_EXPERIMENTS[0];
    if (!first) return;
    const byQuery = filterExperiments({ query: first.code });
    expect(byQuery.some((e) => e.id === first.id)).toBe(true);
    const byTopic = filterExperiments({ topic: first.topic });
    expect(byTopic.every((e) => e.topic === first.topic)).toBe(true);
    const byLevel = filterExperiments({ level: first.level });
    expect(byLevel.every((e) => e.level === first.level)).toBe(true);
    const byKind = filterExperiments({ kind: first.kind });
    expect(byKind.every((e) => e.kind === first.kind)).toBe(true);
  });

  it("thống kê countByTopic khớp dữ liệu", () => {
    const counts = countByTopic();
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    expect(total).toBe(ALL_EXPERIMENTS.length);
  });

  it("không có engine mồ côi không được dùng (cảnh báo nội bộ)", () => {
    const used = new Set(ALL_EXPERIMENTS.map((e) => e.sim.engineId));
    for (const id of Object.keys(ENGINES)) {
      expect(used.has(id), `engine ${id} nên được ít nhất một thí nghiệm sử dụng`).toBe(true);
    }
  });
});
