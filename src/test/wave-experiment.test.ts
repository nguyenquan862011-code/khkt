import { describe, expect, it } from "vitest";

import {
  analyzeInterferencePoint,
  calculateInterferenceMaxima,
  calculateWaveSpeedCmS,
  countInterferenceExtrema,
} from "@/lib/wave-experiment";

describe("wave experiment interference count", () => {
  it("shows seven maxima for 6.0 cm spacing and a 1.6 cm wavelength", () => {
    expect(calculateInterferenceMaxima(6, 1.6)).toBe(7);
  });

  it("shows five maxima for 6.0 cm spacing and a 2.2 cm wavelength", () => {
    expect(calculateInterferenceMaxima(6, 2.2)).toBe(5);
  });

  it("shows three maxima for 6.0 cm spacing at a 3.2 cm wavelength", () => {
    expect(calculateInterferenceMaxima(6.0, 3.2)).toBe(3);
  });

  it("computes wave propagation speed v = lambda * f cleanly", () => {
    expect(calculateWaveSpeedCmS(2.0, 12)).toBe(24);
    expect(calculateWaveSpeedCmS(0, 10)).toBe(0);
  });

  it("counts extrema accurately for in-phase and out-of-phase sources", () => {
    const inPhase = countInterferenceExtrema(6.0, 1.6, 0);
    expect(inPhase.maximaCount).toBe(7);
    expect(inPhase.minimaCount).toBe(8);

    // Opposite phase swaps central line to a minimum
    const antiPhase = countInterferenceExtrema(6.0, 1.6, 1);
    expect(antiPhase.minimaCount).toBe(7);
    expect(antiPhase.maximaCount).toBe(8);
  });

  it("classifies interference point probe verdicts for maxima and minima", () => {
    const s1 = { x: -3, y: 0 };
    const s2 = { x: 3, y: 0 };

    // On perpendicular bisector (d2 - d1 = 0): maximum when in-phase
    const centerInPhase = analyzeInterferencePoint({ x: 0, y: 4 }, s1, s2, 1.6, 0);
    expect(centerInPhase.verdict).toBe("max");
    expect(centerInPhase.amplitudeFactor).toBeCloseTo(1, 5);

    // On perpendicular bisector when opposite phase (delta phi = pi): minimum
    const centerAntiPhase = analyzeInterferencePoint({ x: 0, y: 4 }, s1, s2, 1.6, 1);
    expect(centerAntiPhase.verdict).toBe("min");
    expect(centerAntiPhase.amplitudeFactor).toBeCloseTo(0, 5);

    // Along S1S2 at x = 0.4 cm -> d1 = 3.4, d2 = 2.6 -> |d2 - d1| = 0.8 = lambda/2 -> minimum
    const nodalPoint = analyzeInterferencePoint({ x: 0.4, y: 0 }, s1, s2, 1.6, 0);
    expect(nodalPoint.verdict).toBe("min");
    expect(nodalPoint.amplitudeFactor).toBeCloseTo(0, 5);
  });
});
