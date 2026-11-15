import { describe, expect, it } from "vitest";
import {
  DEFAULT_CIRCULAR_PARAMS,
  computeCircularMotionMetrics,
  computeCircularMotionState,
} from "@/lib/circular-motion";

describe("Uniform Circular Motion Physics Engine", () => {
  it("calculates v = ωR, aht = ω²R, T = 2π/ω, f = 1/T, Fht = mω²R accurately", () => {
    const metrics = computeCircularMotionMetrics({
      radius: 2.0,
      omega: 3.0,
      mass: 1.5,
      initialAngleDeg: 0,
    });

    expect(metrics.linearSpeed).toBeCloseTo(6.0, 6);
    expect(metrics.centripetalAccel).toBeCloseTo(18.0, 6);
    expect(metrics.centripetalForce).toBeCloseTo(27.0, 6);
    expect(metrics.period).toBeCloseTo((2 * Math.PI) / 3.0, 6);
    expect(metrics.frequency).toBeCloseTo(3.0 / (2 * Math.PI), 6);
  });

  it("maintains perpendicular tangential velocity (v · r = 0) and inward centripetal acceleration", () => {
    const params = { ...DEFAULT_CIRCULAR_PARAMS, radius: 1.8, omega: 2.5, initialAngleDeg: 45 };
    const times = [0, 0.25, 0.7, 1.35, 2.4];

    for (const t of times) {
      const state = computeCircularMotionState(params, t);
      const rMag = Math.hypot(state.x, state.y);
      expect(rMag).toBeCloseTo(params.radius, 6);

      // Tangential velocity must be strictly orthogonal to position vector r
      const dotProductVR = state.vx * state.x + state.vy * state.y;
      expect(dotProductVR).toBeCloseTo(0, 6);

      // Centripetal acceleration must point directly opposite to r (inward toward O)
      const crossProductAR = state.ax * state.y - state.ay * state.x;
      expect(crossProductAR).toBeCloseTo(0, 6);
      const dotProductAR = state.ax * state.x + state.ay * state.y;
      expect(dotProductAR).toBeLessThan(0);
    }
  });
});
