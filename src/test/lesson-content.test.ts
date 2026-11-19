import { describe, expect, it } from "vitest";
import { getLessonContent, hasLessonContent, getAuthoredLessonSlugs } from "@/data/lessons";
import { bai01LamQuenVoiMonVatLy } from "@/data/lessons/bai-01-lam-quen-voi-mon-vat-ly";
import type { LessonContent } from "@/data/lessons/types";
import { curriculum } from "@/data/curriculum";

const ALL_AUTHORED: LessonContent[] = [bai01LamQuenVoiMonVatLy];

describe("Nội dung bài giảng do trường biên soạn", () => {
  describe("Registry", () => {
    it("tra cứu được Bài 1 theo lessonSlug", () => {
      const found = getLessonContent("bai-1-lam-quen-voi-mon-vat-ly");
      expect(found).toBeDefined();
      expect(found?.title).toContain("Làm quen với môn Vật lý");
    });

    it("trả undefined cho bài chưa biên soạn", () => {
      expect(getLessonContent("bai-khong-ton-tai")).toBeUndefined();
      expect(hasLessonContent("bai-khong-ton-tai")).toBe(false);
    });

    it("hasLessonContent khớp với registry", () => {
      expect(hasLessonContent("bai-1-lam-quen-voi-mon-vat-ly")).toBe(true);
      expect(getAuthoredLessonSlugs()).toContain("bai-1-lam-quen-voi-mon-vat-ly");
    });
  });

  describe("Tính toàn vẹn dữ liệu", () => {
    it.each(ALL_AUTHORED.map((l) => [l.lessonSlug, l] as const))(
      "%s có đủ trường bắt buộc",
      (_slug, lesson) => {
        expect(lesson.title.trim().length).toBeGreaterThan(0);
        expect(lesson.objectives.length).toBeGreaterThan(0);
        expect(lesson.blocks.length).toBeGreaterThan(0);
        expect(lesson.review.status).toMatch(/^(draft|teacher-reviewed)$/);
        expect(lesson.review.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      },
    );

    it.each(ALL_AUTHORED.map((l) => [l.lessonSlug, l] as const))(
      "%s có lessonSlug tồn tại trong curriculum.json",
      (slug) => {
        const allSlugs = new Set(Object.values(curriculum.lessons).map((l) => l.lessonSlug));
        expect(allSlugs.has(slug)).toBe(true);
      },
    );

    it("mọi block có type hợp lệ", () => {
      const valid = new Set(["text", "formula", "list", "callout", "table"]);
      for (const lesson of ALL_AUTHORED) {
        for (const block of lesson.blocks) {
          expect(valid.has(block.type)).toBe(true);
        }
      }
    });

    it("bảng không có hàng lệch số cột so với header", () => {
      for (const lesson of ALL_AUTHORED) {
        for (const block of lesson.blocks) {
          if (block.type !== "table") continue;
          for (const row of block.rows) {
            expect(row.length).toBe(block.headers.length);
          }
        }
      }
    });
  });

  describe("Tính đúng đắn của câu hỏi", () => {
    it.each(ALL_AUTHORED.map((l) => [l.lessonSlug, l] as const))(
      "%s — mọi bài tập có correctIndex hợp lệ",
      (_slug, lesson) => {
        for (const ex of lesson.exercises) {
          expect(ex.options.length).toBeGreaterThanOrEqual(2);
          expect(ex.correctIndex).toBeGreaterThanOrEqual(0);
          expect(ex.correctIndex).toBeLessThan(ex.options.length);
          expect(ex.explanation.trim().length).toBeGreaterThan(0);
        }
      },
    );

    it("câu hỏi suy ngẫm (nếu có) có correctIndex hợp lệ", () => {
      for (const lesson of ALL_AUTHORED) {
        if (!lesson.reflection) continue;
        const r = lesson.reflection;
        expect(r.options.length).toBeGreaterThanOrEqual(2);
        expect(r.correctIndex).toBeGreaterThanOrEqual(0);
        expect(r.correctIndex).toBeLessThan(r.options.length);
      }
    });

    it("ví dụ có đủ bước giải và kết quả", () => {
      for (const lesson of ALL_AUTHORED) {
        for (const ex of lesson.examples) {
          expect(ex.prompt.trim().length).toBeGreaterThan(0);
          expect(ex.steps.length).toBeGreaterThan(0);
          expect(ex.answer.trim().length).toBeGreaterThan(0);
          for (const step of ex.steps) {
            expect(step.label.trim().length).toBeGreaterThan(0);
            expect(step.detail.trim().length).toBeGreaterThan(0);
          }
        }
      }
    });

    it("không có đáp án trùng nhau trong cùng một câu", () => {
      for (const lesson of ALL_AUTHORED) {
        for (const ex of lesson.exercises) {
          const unique = new Set(ex.options.map((o) => o.trim()));
          expect(unique.size).toBe(ex.options.length);
        }
      }
    });
  });

  describe("Tuân thủ bản quyền", () => {
    it("không chứa tên miền bên thứ ba trong nội dung", () => {
      const serialized = JSON.stringify(ALL_AUTHORED).toLowerCase();
      for (const domain of ["vatly.ai", "vatly.al"]) {
        expect(serialized).not.toContain(domain);
      }
    });

    it("không có nội dung nào bị đánh dấu là đã duyệt khi chưa duyệt", () => {
      for (const lesson of ALL_AUTHORED) {
        if (lesson.review.status === "teacher-reviewed") {
          expect(lesson.review.note?.toLowerCase() ?? "").not.toContain("cần giáo viên");
        }
      }
    });
  });

  describe("Bài 1 — kiểm tra nội dung cụ thể", () => {
    it("có 2 ví dụ và 3 bài tập", () => {
      expect(bai01LamQuenVoiMonVatLy.examples).toHaveLength(2);
      expect(bai01LamQuenVoiMonVatLy.exercises).toHaveLength(3);
    });

    it("có 4 mục tiêu học tập", () => {
      expect(bai01LamQuenVoiMonVatLy.objectives).toHaveLength(4);
    });

    it("đáp án bài tập 1 là 'Vật chất, năng lượng...' (index 1)", () => {
      const bt1 = bai01LamQuenVoiMonVatLy.exercises.find((e) => e.id === "bt1");
      expect(bt1?.correctIndex).toBe(1);
      expect(bt1?.options[1]).toContain("Vật chất");
    });

    it("liên kết tới thí nghiệm CE01 và domain co-hoc", () => {
      expect(bai01LamQuenVoiMonVatLy.relatedExperimentId).toBe("CE01");
      expect(bai01LamQuenVoiMonVatLy.relatedSimulationDomain).toBe("co-hoc");
    });

    it("có cảnh báo chờ giáo viên duyệt", () => {
      expect(bai01LamQuenVoiMonVatLy.review.status).toBe("draft");
      expect(bai01LamQuenVoiMonVatLy.review.note).toBeTruthy();
    });
  });
});
