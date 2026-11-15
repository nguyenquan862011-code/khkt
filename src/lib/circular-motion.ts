/**
 * TamGiangPhysics — Uniform Circular Motion (Chuyển động tròn đều) Physics Engine
 * Verified against SI units and Vietnamese Grade 10 Physics curriculum.
 */

export interface CircularMotionParams {
  radius: number; // R (m)
  omega: number; // ω (rad/s)
  mass: number; // m (kg)
  initialAngleDeg: number; // φ₀ (degrees)
}

export interface CircularMotionMetrics {
  linearSpeed: number; // v = ω · R (m/s)
  centripetalAccel: number; // a_ht = ω² · R (m/s²)
  centripetalForce: number; // F_ht = m · ω² · R (N)
  period: number; // T = 2π / ω (s)
  frequency: number; // f = 1 / T = ω / (2π) (Hz)
}

export interface CircularMotionInstantState {
  time: number; // s
  angleRad: number; // φ(t) in radians (unwrapped)
  wrappedAngleRad: number; // [0, 2π)
  wrappedAngleDeg: number; // [0, 360)
  revolutions: number;
  x: number; // m (cartesian, center at O(0,0))
  y: number; // m
  vx: number; // m/s
  vy: number; // m/s
  ax: number; // m/s²
  ay: number; // m/s²
}

export const DEFAULT_CIRCULAR_PARAMS: CircularMotionParams = {
  radius: 1.5,
  omega: 2.0,
  mass: 1.0,
  initialAngleDeg: 30,
};

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function normalizeAngleRad(rad: number): number {
  const twoPi = Math.PI * 2;
  const mod = rad % twoPi;
  return mod < 0 ? mod + twoPi : mod;
}

export function computeCircularMotionMetrics(params: CircularMotionParams): CircularMotionMetrics {
  const R = Math.max(0.1, params.radius);
  const omega = Math.max(0.05, params.omega);
  const m = Math.max(0.05, params.mass);

  const linearSpeed = omega * R;
  const centripetalAccel = omega * omega * R;
  const centripetalForce = m * centripetalAccel;
  const period = (2 * Math.PI) / omega;
  const frequency = 1 / period;

  return {
    linearSpeed,
    centripetalAccel,
    centripetalForce,
    period,
    frequency,
  };
}

export function computeCircularMotionState(
  params: CircularMotionParams,
  time: number,
): CircularMotionInstantState {
  const R = Math.max(0.1, params.radius);
  const omega = Math.max(0.05, params.omega);
  const phi0 = degToRad(params.initialAngleDeg);
  const angleRad = phi0 + omega * time;

  const cosPhi = Math.cos(angleRad);
  const sinPhi = Math.sin(angleRad);

  const vMag = omega * R;
  const aMag = omega * omega * R;

  // Counter-clockwise standard mathematical & physics convention:
  // r = R*(cosφ, sinφ)
  // v = ωR*(-sinφ, cosφ)  (tangential, perpendicular to r)
  // a_ht = ω²R*(-cosφ, -sinφ) (centripetal, pointing to center O)
  const x = R * cosPhi;
  const y = R * sinPhi;
  const vx = -vMag * sinPhi;
  const vy = vMag * cosPhi;
  const ax = -aMag * cosPhi;
  const ay = -aMag * sinPhi;

  const wrappedAngleRad = normalizeAngleRad(angleRad);
  const wrappedAngleDeg = radToDeg(wrappedAngleRad);
  const revolutions = Math.max(0, (omega * time) / (2 * Math.PI));

  return {
    time,
    angleRad,
    wrappedAngleRad,
    wrappedAngleDeg,
    revolutions,
    x,
    y,
    vx,
    vy,
    ax,
    ay,
  };
}
