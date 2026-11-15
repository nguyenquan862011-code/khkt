export interface WavePoint {
  x: number;
  y: number;
}

export interface InterferencePointAnalysis {
  d1: number;
  d2: number;
  diff: number;
  ratio: number;
  order: number;
  amplitudeFactor: number;
  verdict: "max" | "min" | "between";
}

export function calculateInterferenceMaxima(sourceDistance: number, wavelength: number): number {
  if (sourceDistance < 0 || wavelength <= 0) return 0;
  return Math.floor(sourceDistance / wavelength) * 2 + 1;
}

export function calculateWaveSpeedCmS(wavelengthCm: number, frequencyHz: number): number {
  if (wavelengthCm <= 0 || frequencyHz <= 0) return 0;
  return wavelengthCm * frequencyHz;
}

export function countInterferenceExtrema(
  sourceDistance: number,
  wavelength: number,
  phaseDiffPi = 0,
): { maximaCount: number; minimaCount: number; maximaOffsets: number[] } {
  if (sourceDistance <= 0 || wavelength <= 0) {
    return { maximaCount: 0, minimaCount: 0, maximaOffsets: [] };
  }
  const phaseShift = phaseDiffPi / 2;
  const eps = 1e-6;
  const minMaxOrder = Math.floor(-sourceDistance / wavelength - phaseShift + eps) + 1;
  const maxMaxOrder = Math.ceil(sourceDistance / wavelength - phaseShift - eps) - 1;
  const maximaCount = Math.max(0, maxMaxOrder - minMaxOrder + 1);

  const minMinOrder = Math.floor(-sourceDistance / wavelength - phaseShift - 0.5 + eps) + 1;
  const maxMinOrder = Math.ceil(sourceDistance / wavelength - phaseShift - 0.5 - eps) - 1;
  const minimaCount = Math.max(0, maxMinOrder - minMinOrder + 1);

  const maximaOffsets = Array.from({ length: maximaCount }, (_, idx) => {
    const kOrder = minMaxOrder + idx;
    return -((kOrder + phaseShift) * wavelength) / 2;
  });

  return { maximaCount, minimaCount, maximaOffsets };
}

export function analyzeInterferencePoint(
  probe: WavePoint,
  s1: WavePoint,
  s2: WavePoint,
  wavelength: number,
  phaseDiffPi = 0,
): InterferencePointAnalysis {
  const d1 = Math.hypot(probe.x - s1.x, probe.y - s1.y);
  const d2 = Math.hypot(probe.x - s2.x, probe.y - s2.y);
  const diff = d2 - d1;
  const safeLambda = Math.max(0.1, wavelength);
  const phaseShift = phaseDiffPi / 2;
  const effRatio = diff / safeLambda - phaseShift;
  const order = Math.round(effRatio);
  const nearestHalf = Math.round(effRatio - 0.5) + 0.5;
  const maxErr = Math.abs(effRatio - order);
  const minErr = Math.abs(effRatio - nearestHalf);

  let verdict: "max" | "min" | "between" = "between";
  if (maxErr < 0.1) {
    verdict = "max";
  } else if (minErr < 0.1) {
    verdict = "min";
  }

  const dPhi = phaseDiffPi * Math.PI;
  const amplitudeFactor = Math.abs(Math.cos((Math.PI * diff) / safeLambda - dPhi / 2));

  return {
    d1,
    d2,
    diff,
    ratio: diff / safeLambda,
    order,
    amplitudeFactor,
    verdict,
  };
}
