import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";

import { APP_CONFIG } from "@/lib/config";
import { ALL_CLASSIC_EXPERIMENTS, CLASSIC_EXPERIMENTS } from "@/data/classic-experiments";
import { EXPERIMENT_PHOTOS, PHOTO_FALLBACK_TEXT } from "@/data/experiment-photos";
import { getLearningState, updateStudyPreferences } from "@/lib/learning-store";

describe("TamGiang Physics ecosystem upgrade & personalization", () => {
  it("uses UniformCircularMotionExperiment on homepage with restored dark-green hero and zero dark-blue banner", () => {
    const indexPath = path.resolve(__dirname, "../routes/index.tsx");
    const indexSource = fs.readFileSync(indexPath, "utf-8");

    expect(indexSource).toContain("UniformCircularMotionExperiment");
    expect(indexSource).not.toContain("WaveInterferenceExperiment");
    expect(indexSource).not.toContain("PrismDispersionExperiment");
    expect(indexSource).not.toContain("#0F2942");
    expect(indexSource).toContain("Đừng chỉ học công thức.");
    expect(indexSource).toContain("Hãy quan sát cách thế giới");
    expect(indexSource).toContain("Vào phòng thí nghiệm");
    expect(indexSource).toContain("from-[#0d1d16]");
  });

  // Từ khi có tài khoản học sinh: biểu mẫu đăng nhập/đăng ký chỉ nằm trong src/components/account/
  // (trang /tai-khoan). Các trang bài học, thí nghiệm, luyện tập không được chèn biểu mẫu hay chặn khách.
  it("keeps login and signup forms out of public routes and shared components", () => {
    const srcDirs = [
      path.resolve(__dirname, "../routes"),
      path.resolve(__dirname, "../components"),
    ];
    const forbiddenPatterns = [
      /Đăng nhập tài khoản/i,
      /Tạo tài khoản/i,
      /Mật khẩu/i,
      /supabase\.auth/i,
    ];

    for (const dir of srcDirs) {
      for (const file of fs.readdirSync(dir)) {
        if (!file.endsWith(".tsx") && !file.endsWith(".ts")) continue;
        const content = fs.readFileSync(path.join(dir, file), "utf-8");
        for (const pat of forbiddenPatterns) {
          expect(content).not.toMatch(pat);
        }
      }
    }
  });

  it("preserves TamGiang Physics footer credits and contact email", () => {
    const footerPath = path.resolve(__dirname, "../components/footer.tsx");
    const footerSource = fs.readFileSync(footerPath, "utf-8");

    expect(APP_CONFIG.feedbackEmail).toBe("nguyenquan862011@gmail.com");
    expect(APP_CONFIG.authorCredit).toBe("Trần Đình Nguyên Quân");
    expect(footerSource).toContain("APP_CONFIG.feedbackEmail");
    expect(footerSource).toContain("APP_CONFIG.authorCredit");
    expect(footerSource).toContain("ĐỒNG HÀNH & PHÁT TRIỂN");
  });

  it("has 54 unique verified real local lab photos with open-license credits and clean fallback", () => {
    expect(PHOTO_FALLBACK_TEXT).toBe("Đang cập nhật ảnh thí nghiệm thực tế.");

    const entries = Object.values(EXPERIMENT_PHOTOS);
    expect(entries.length).toBe(54);

    // Zero duplicate src files across different experiments
    const uniqueSrcs = new Set(entries.map((e) => e.src));
    expect(uniqueSrcs.size).toBe(entries.length);

    for (const item of entries) {
      const fileOnDisk = path.resolve(__dirname, "../../public", item.src.replace(/^\//, ""));
      expect(fs.existsSync(fileOnDisk)).toBe(true);
      const stat = fs.statSync(fileOnDisk);
      expect(stat.size).toBeGreaterThan(10_000);
      expect(item.sourceUrl).toMatch(/^https:\/\/commons\.wikimedia\.org\//);
      expect(item.license.length).toBeGreaterThan(2);
    }

    // 29 of 30 CLASSIC_EXPERIMENTS (41 of 42 ALL_CLASSIC_EXPERIMENTS) have unique real photos; only CE04 intentionally uses fallback
    const classicWithPhotos = CLASSIC_EXPERIMENTS.filter((e) => Boolean(EXPERIMENT_PHOTOS[e.id]));
    const classicFallback = CLASSIC_EXPERIMENTS.filter((e) => !EXPERIMENT_PHOTOS[e.id]);
    expect(classicWithPhotos.length).toBe(29);
    expect(classicFallback.map((e) => e.code)).toEqual(["CE04"]);

    const allWithPhotos = ALL_CLASSIC_EXPERIMENTS.filter((e) => Boolean(EXPERIMENT_PHOTOS[e.id]));
    expect(allWithPhotos.length).toBe(41);
  });

  it("persists auth-free personalization preferences in local learning store", () => {
    const updated = updateStudyPreferences({
      grade: "Lớp 11",
      focusTopic: "Sóng cơ & Giao thoa",
      level: "nang-cao",
    });

    expect(updated.preferences.grade).toBe("Lớp 11");
    expect(updated.preferences.focusTopic).toBe("Sóng cơ & Giao thoa");
    expect(updated.preferences.level).toBe("nang-cao");
    expect(getLearningState().preferences.grade).toBe("Lớp 11");
  });
});
