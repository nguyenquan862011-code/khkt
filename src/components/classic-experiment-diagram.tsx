import type { ClassicExperiment } from "@/data/classic-experiments";

function wavelengthToHex(nm: number): string {
  if (nm < 380) return "#9D4EDD";
  if (nm < 440) return "#7B2CBF";
  if (nm < 490) return "#3B82F6";
  if (nm < 510) return "#10B981";
  if (nm < 580) return "#84CC16";
  if (nm < 645) return "#F59E0B";
  return "#EF4444";
}

interface ClassicExperimentDiagramProps {
  experiment: ClassicExperiment;
  params: Record<string, number>;
  phase?: number;
}

export function ClassicExperimentDiagram({
  experiment,
  params,
  phase = 0,
}: ClassicExperimentDiagramProps) {
  const id = experiment.id;

  // CE01: Free fall
  if (id === "ce01-galilei-roi-tu-do") {
    const h = params["Độ cao ban đầu (h)"] ?? 45;
    const g = params["Gia tốc trọng trường (g)"] ?? 9.8;
    const k = params["Lực cản không khí"] ?? 0;
    const dropFactor = phase > 0 ? Math.min(1, (phase % 3) / 2.2) : Math.min(1, h / 100);
    const ball1Y = 24 + dropFactor * 105;
    const ball2Y = 24 + dropFactor * Math.max(25, 105 - k * 320);
    return (
      <svg
        viewBox="0 0 420 165"
        className="w-full h-44 rounded-xl bg-[#070E0B] border border-white/10 physics-raw"
      >
        <line
          x1="36"
          y1="140"
          x2="384"
          y2="140"
          stroke="#38A875"
          strokeWidth="1.5"
          strokeOpacity="0.5"
        />
        <line
          x1="72"
          y1="20"
          x2="72"
          y2="140"
          stroke="#EDF5ED"
          strokeOpacity="0.2"
          strokeDasharray="4 4"
        />
        <text x="16" y="30" fill="#A5B7A8" fontSize="10" fontFamily="monospace">
          h={h}m
        </text>
        <text x="20" y="136" fill="#A5B7A8" fontSize="10" fontFamily="monospace">
          0m
        </text>
        <line
          x1="165"
          y1="24"
          x2="165"
          y2={ball1Y}
          stroke="#72CF91"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <circle cx="165" cy={ball1Y} r="13" fill="#38A875" stroke="#C8ED78" strokeWidth="1.5" />
        <text x="135" y="155" fill="#EDF5ED" fontSize="10">
          Quả cầu nặng
        </text>
        <line
          x1="265"
          y1="24"
          x2="265"
          y2={ball2Y}
          stroke="#C8ED78"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <circle cx="265" cy={ball2Y} r="8" fill="#C8ED78" stroke="#FFFFFF" strokeWidth="1.2" />
        <text x="235" y="155" fill="#EDF5ED" fontSize="10">
          Quả cầu nhẹ
        </text>
        <text x="315" y="34" fill="#72CF91" fontSize="10" fontFamily="monospace">
          g = {g} m/s²
        </text>
        <text x="315" y="50" fill="#A5B7A8" fontSize="10" fontFamily="monospace">
          {k === 0 ? "Chân không (k=0)" : `Cản k=${k}`}
        </text>
      </svg>
    );
  }

  // CE02: Galilei inclined plane
  if (id === "ce02-galilei-mat-nghieng") {
    const alphaDeg = params["Góc nghiêng (α)"] ?? 30;
    const d = params["Chiều dài máng (d)"] ?? 4;
    const rad = (alphaDeg * Math.PI) / 180;
    const baseX = 340;
    const baseY = 142;
    const lenPx = 220;
    const topX = baseX - Math.cos(rad) * lenPx;
    const topY = baseY - Math.sin(rad) * lenPx;
    const progress = phase > 0 ? (phase * 0.45) % 1 : 0.42;
    const bx = topX + (baseX - topX) * progress;
    const by = topY + (baseY - topY) * progress;
    return (
      <svg
        viewBox="0 0 420 165"
        className="w-full h-44 rounded-xl bg-[#070E0B] border border-white/10 physics-raw"
      >
        <polygon
          points={`${topX.toFixed(1)},${topY.toFixed(1)} ${baseX},${baseY} ${topX.toFixed(1)},${baseY}`}
          fill="#15271E"
          stroke="#38A875"
          strokeWidth="1.5"
        />
        <circle cx={bx} cy={by - 8} r="9" fill="#C8ED78" stroke="#070E0B" strokeWidth="1.5" />
        <text x="20" y="28" fill="#72CF91" fontSize="10" fontFamily="monospace">
          α = {alphaDeg}° · d = {d} m
        </text>
      </svg>
    );
  }

  // CE03: Simple pendulum (EXACT key: "Biên độ góc (α₀)")
  if (id === "ce03-con-lac-don-chu-ky") {
    const l = params["Chiều dài dây (l)"] ?? 1.0;
    const g = params["Gia tốc trọng trường (g)"] ?? 9.8;
    const alpha0 = params["Biên độ góc (α₀)"] ?? 8;
    const ropePx = 45 + (l / 4.0) * 75;
    const angleInstant = phase > 0 ? alpha0 * Math.cos(phase * 2.2) : alpha0;
    const rad = (angleInstant * 2.0 * Math.PI) / 180;
    const pivotX = 210;
    const pivotY = 18;
    const bobX = pivotX + Math.sin(rad) * ropePx;
    const bobY = pivotY + Math.cos(rad) * ropePx;
    return (
      <svg
        viewBox="0 0 420 165"
        className="w-full h-44 rounded-xl bg-[#070E0B] border border-white/10 physics-raw"
      >
        <line
          x1="150"
          y1="18"
          x2="270"
          y2="18"
          stroke="#72CF91"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1={pivotX}
          y1={pivotY}
          x2={pivotX}
          y2={pivotY + ropePx + 8}
          stroke="#EDF5ED"
          strokeOpacity="0.2"
          strokeDasharray="4 4"
        />
        <line x1={pivotX} y1={pivotY} x2={bobX} y2={bobY} stroke="#C8ED78" strokeWidth="2" />
        <circle cx={bobX} cy={bobY} r="11" fill="#38A875" stroke="#C8ED78" strokeWidth="2" />
        <text x="20" y="34" fill="#72CF91" fontSize="10" fontFamily="monospace">
          l = {l.toFixed(1)} m
        </text>
        <text x="20" y="50" fill="#C8ED78" fontSize="10" fontFamily="monospace">
          α₀ = {alpha0}°
        </text>
        <text x="20" y="66" fill="#A5B7A8" fontSize="10" fontFamily="monospace">
          g = {g} m/s²
        </text>
      </svg>
    );
  }

  // CE04: Atwood machine
  if (id === "ce04-atwood-dinh-luat-2-newton") {
    const m1 = params["Khối lượng m₁"] ?? 2.2;
    const m2 = params["Khối lượng m₂"] ?? 1.8;
    const shift = Math.max(-28, Math.min(28, (m1 - m2) * 14));
    return (
      <svg
        viewBox="0 0 420 165"
        className="w-full h-44 rounded-xl bg-[#070E0B] border border-white/10 physics-raw"
      >
        <circle cx="210" cy="36" r="18" fill="#15271E" stroke="#72CF91" strokeWidth="2" />
        <line x1="192" y1="36" x2="192" y2={95 + shift} stroke="#C8ED78" strokeWidth="2" />
        <line x1="228" y1="36" x2="228" y2={95 - shift} stroke="#C8ED78" strokeWidth="2" />
        <rect
          x="174"
          y={95 + shift}
          width="36"
          height="24"
          rx="4"
          fill="#38A875"
          stroke="#C8ED78"
        />
        <text
          x="180"
          y={111 + shift}
          fill="#070E0B"
          fontSize="9"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {m1}kg
        </text>
        <rect x="210" y={95 - shift} width="36" height="24" rx="4" fill="#C8ED78" />
        <text
          x="216"
          y={111 - shift}
          fill="#070E0B"
          fontSize="9"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {m2}kg
        </text>
      </svg>
    );
  }

  // CE05: Hooke's law (EXACT key: "Khối lượng tải (m)")
  if (id === "ce05-dinh-luat-hooke") {
    const k = params["Độ cứng lò xo (k)"] ?? 100;
    const m = params["Khối lượng tải (m)"] ?? 0.5;
    const stretch = Math.min(72, ((m * 9.8) / k) * 280);
    const coils = 8;
    const topY = 18;
    const endY = 58 + stretch;
    const stepY = (endY - topY) / coils;
    const points = Array.from({ length: coils + 1 }, (_, i) => {
      const y = topY + i * stepY;
      const x = i === 0 || i === coils ? 210 : i % 2 === 0 ? 194 : 226;
      return `${x},${y.toFixed(1)}`;
    }).join(" ");
    return (
      <svg
        viewBox="0 0 420 165"
        className="w-full h-44 rounded-xl bg-[#070E0B] border border-white/10 physics-raw"
      >
        <line x1="160" y1="18" x2="260" y2="18" stroke="#72CF91" strokeWidth="3" />
        <polyline
          points={points}
          fill="none"
          stroke="#C8ED78"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <rect
          x="192"
          y={endY}
          width="36"
          height="24"
          rx="4"
          fill="#38A875"
          stroke="#C8ED78"
          strokeWidth="1.5"
        />
        <text
          x="197"
          y={endY + 15}
          fill="#070E0B"
          fontSize="10"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {m}kg
        </text>
        <text x="20" y="34" fill="#72CF91" fontSize="10" fontFamily="monospace">
          k = {k} N/m
        </text>
        <text x="20" y="50" fill="#C8ED78" fontSize="10" fontFamily="monospace">
          Δl = {(((m * 9.8) / k) * 100).toFixed(2)} cm
        </text>
      </svg>
    );
  }

  // CE09: Young's Double Slit (EXACT keys: "Bước sóng (λ)", "Khoảng cách đến màn (D)")
  if (id === "ce09-giao-thoa-khe-young") {
    const lambdaNm = params["Bước sóng (λ)"] ?? 632;
    const aMm = params["Khoảng cách 2 khe (a)"] ?? 1.0;
    const D = params["Khoảng cách đến màn (D)"] ?? 2.0;
    const iMm = (lambdaNm * 1e-6 * D) / (aMm * 1e-3);
    const color = wavelengthToHex(lambdaNm);
    const spacingPx = Math.max(12, Math.min(44, iMm * 14));
    const fringes = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
    return (
      <svg
        viewBox="0 0 420 165"
        className="w-full h-44 rounded-xl bg-[#070E0B] border border-white/10 physics-raw"
      >
        <text x="16" y="22" fill="#A5B7A8" fontSize="10" fontFamily="monospace">
          Hệ vân giao thoa Young (λ={lambdaNm}nm, i={iMm.toFixed(2)}mm)
        </text>
        {fringes.map((kIdx) => {
          const x = 210 + kIdx * spacingPx;
          if (x < 24 || x > 396) return null;
          return (
            <rect
              key={kIdx}
              x={x - spacingPx * 0.24}
              y="34"
              width={spacingPx * 0.48}
              height="96"
              rx="4"
              fill={color}
              fillOpacity={Math.max(0.35, 1 - Math.abs(kIdx) * 0.12)}
            />
          );
        })}
        <text x="197" y="148" fill="#EDF5ED" fontSize="10" fontFamily="monospace">
          k=0
        </text>
      </svg>
    );
  }

  // CE10: Standing wave (EXACT keys: "Chiều dài dây (L)", "Tốc độ truyền sóng (v)", "Số bó sóng (k)")
  if (id === "ce10-song-dung-tren-day") {
    const L = params["Chiều dài dây (L)"] ?? 1.2;
    const v = params["Tốc độ truyền sóng (v)"] ?? 24;
    const kLoops = Math.max(1, Math.round(params["Số bó sóng (k)"] ?? 3));
    const ampScale = phase > 0 ? Math.cos(phase * 3) : 1;
    const ptsUpper: string[] = [];
    const ptsLower: string[] = [];
    for (let x = 30; x <= 390; x += 4) {
      const ratio = (x - 30) / 360;
      const amp = 42 * Math.sin(kLoops * Math.PI * ratio) * ampScale;
      ptsUpper.push(`${x},${(82 - amp).toFixed(1)}`);
      ptsLower.push(`${x},${(82 + amp).toFixed(1)}`);
    }
    return (
      <svg
        viewBox="0 0 420 165"
        className="w-full h-44 rounded-xl bg-[#070E0B] border border-white/10 physics-raw"
      >
        <line
          x1="30"
          y1="82"
          x2="390"
          y2="82"
          stroke="#EDF5ED"
          strokeOpacity="0.2"
          strokeDasharray="4 4"
        />
        <polyline points={ptsUpper.join(" ")} fill="none" stroke="#38A875" strokeWidth="2.4" />
        <polyline
          points={ptsLower.join(" ")}
          fill="none"
          stroke="#C8ED78"
          strokeWidth="1.6"
          strokeDasharray="4 3"
        />
        <circle cx="30" cy="82" r="4" fill="#FFFFFF" />
        <circle cx="390" cy="82" r="4" fill="#FFFFFF" />
        <text x="20" y="24" fill="#72CF91" fontSize="10" fontFamily="monospace">
          L = {L}m · v = {v} m/s · {kLoops} bó ({kLoops + 1} nút sóng)
        </text>
      </svg>
    );
  }

  // CE16: Ohm's law
  if (id === "ce16-dinh-luat-ohm") {
    const U = params["Hiệu điện thế (U)"] ?? 12;
    const R = params["Điện trở (R)"] ?? 10;
    const I = U / R;
    const P = U * I;
    const heatOpacity = Math.min(0.95, 0.2 + P / 120);
    return (
      <svg
        viewBox="0 0 420 165"
        className="w-full h-44 rounded-xl bg-[#070E0B] border border-white/10 physics-raw"
      >
        <rect
          x="85"
          y="34"
          width="250"
          height="92"
          rx="10"
          fill="none"
          stroke="#38A875"
          strokeWidth="2"
        />
        <rect
          x="172"
          y="22"
          width="76"
          height="24"
          rx="5"
          fill="#15271E"
          stroke="#C8ED78"
          strokeWidth="1.5"
        />
        <rect
          x="174"
          y="24"
          width="72"
          height="20"
          rx="4"
          fill="#F59E0B"
          fillOpacity={heatOpacity}
        />
        <text x="190" y="38" fill="#FFFFFF" fontSize="10" fontFamily="monospace">
          R={R}Ω
        </text>
        <circle cx="85" cy="80" r="16" fill="#0E1E16" stroke="#72CF91" strokeWidth="2" />
        <text x="72" y="84" fill="#C8ED78" fontSize="10" fontWeight="bold" fontFamily="monospace">
          {U}V
        </text>
        <text x="150" y="148" fill="#72CF91" fontSize="10" fontFamily="monospace">
          I = {I.toFixed(2)} A · P = {P.toFixed(1)} W
        </text>
      </svg>
    );
  }

  // CE19: Faraday's law (FIXED 1e-3 mWb conversion)
  if (id === "ce19-cam-ung-faraday") {
    const N = params["Số vòng dây (N)"] ?? 200;
    const dPhiWb = (params["Độ biến thiên từ thông (ΔΦ)"] ?? 5) * 1e-3;
    const dt = params["Thời gian biến thiên (Δt)"] ?? 0.1;
    const ec = N * (dPhiWb / dt);
    const angleDeg = Math.min(54, ec * 0.45);
    const rad = (angleDeg * Math.PI) / 180;
    const nx = 300 + Math.sin(rad) * 34;
    const ny = 96 - Math.cos(rad) * 34;
    return (
      <svg
        viewBox="0 0 420 165"
        className="w-full h-44 rounded-xl bg-[#070E0B] border border-white/10 physics-raw"
      >
        <rect x={42 + Math.sin(phase) * 14} y="64" width="44" height="32" fill="#DC2626" rx="3" />
        <rect x={86 + Math.sin(phase) * 14} y="64" width="44" height="32" fill="#2563EB" rx="3" />
        <text x={58 + Math.sin(phase) * 14} y="84" fill="#FFFFFF" fontSize="11" fontWeight="bold">
          S
        </text>
        <text x={102 + Math.sin(phase) * 14} y="84" fill="#FFFFFF" fontSize="11" fontWeight="bold">
          N
        </text>
        {[0, 1, 2, 3, 4].map((idx) => (
          <ellipse
            key={idx}
            cx={166 + idx * 12}
            cy="80"
            rx="8"
            ry="28"
            fill="none"
            stroke="#C8ED78"
            strokeWidth="2"
          />
        ))}
        <circle cx="300" cy="80" r="38" fill="#0E1E16" stroke="#38A875" strokeWidth="2" />
        <line
          x1="300"
          y1="96"
          x2={nx}
          y2={ny}
          stroke="#C8ED78"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <text x="262" y="138" fill="#72CF91" fontSize="10" fontFamily="monospace">
          |ec| = {ec.toFixed(1)} V
        </text>
      </svg>
    );
  }

  // CE25: Photoelectric effect (EXACT key: "Bước sóng kích thích (λ)")
  if (id === "ce25-hieu-ung-quang-dien") {
    const lambdaNm = params["Bước sóng kích thích (λ)"] ?? 280;
    const AEv = params["Công thoát kim loại (A)"] ?? 2.2;
    const ePhoton = 1240 / lambdaNm;
    const isOccur = ePhoton >= AEv;
    const photonColor = wavelengthToHex(lambdaNm);
    return (
      <svg
        viewBox="0 0 420 165"
        className="w-full h-44 rounded-xl bg-[#070E0B] border border-white/10 physics-raw"
      >
        <rect
          x="52"
          y="96"
          width="316"
          height="24"
          rx="4"
          fill="#1E3A2D"
          stroke="#72CF91"
          strokeWidth="1.5"
        />
        <text x="148" y="112" fill="#EDF5ED" fontSize="10" fontFamily="monospace">
          Tế bào quang điện (A={AEv} eV)
        </text>
        {[110, 170, 230].map((x) => (
          <line
            key={x}
            x1={x - 35}
            y1="22"
            x2={x}
            y2="92"
            stroke={photonColor}
            strokeWidth="2.2"
            strokeDasharray="5 3"
          />
        ))}
        {isOccur ? (
          [135, 205, 275].map((x) => (
            <g key={x}>
              <line
                x1={x}
                y1="92"
                x2={x + 28}
                y2="34"
                stroke="#C8ED78"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle cx={x + 28} cy="34" r="5" fill="#C8ED78" />
              <text x={x + 36} y="37" fill="#C8ED78" fontSize="9" fontFamily="monospace">
                e⁻
              </text>
            </g>
          ))
        ) : (
          <text x="95" y="55" fill="#F87171" fontSize="11" fontWeight="bold" fontFamily="monospace">
            ε = {ePhoton.toFixed(2)} eV &lt; A ({AEv} eV) — Không bật e⁻
          </text>
        )}
      </svg>
    );
  }

  // Generalized Live Quantitative Schematic Diagram for all remaining CE experiments (CE06-08, CE11-15, CE17-18, CE20-24, CE26-30)
  const summary = experiment.compute(params);
  const paramEntries = experiment.modelParams.map((p) => ({
    label: p.label,
    val: params[p.label] ?? p.defaultVal,
    unit: p.unit,
    ratio: (params[p.label] ?? p.defaultVal - p.min) / Math.max(1e-6, p.max - p.min),
  }));

  return (
    <svg
      viewBox="0 0 420 165"
      className="w-full h-44 rounded-xl bg-[#070E0B] border border-white/10 physics-raw"
    >
      <text x="16" y="22" fill="#72CF91" fontSize="10" fontFamily="monospace">
        {experiment.code} · {experiment.scientist} ({experiment.year})
      </text>
      {/* Interactive vector bars for parameters + output metrics */}
      {paramEntries.slice(0, 3).map((pe, idx) => {
        const y = 38 + idx * 24;
        const clamped = Math.max(0.08, Math.min(1, pe.ratio));
        return (
          <g key={pe.label}>
            <text x="16" y={y + 11} fill="#A5B7A8" fontSize="9" fontFamily="monospace">
              {pe.label}: {pe.val} {pe.unit}
            </text>
            <rect
              x="240"
              y={y + 2}
              width="160"
              height="10"
              rx="3"
              fill="#15271E"
              stroke="#2B4033"
            />
            <rect x="240" y={y + 2} width={clamped * 160} height="10" rx="3" fill="#38A875" />
          </g>
        );
      })}
      {/* Live output summary banner inside optical chamber */}
      <rect
        x="16"
        y="114"
        width="388"
        height="36"
        rx="6"
        fill="#101F18"
        stroke="#38A875"
        strokeOpacity="0.5"
      />
      <text x="26" y="129" fill="#C8ED78" fontSize="10" fontFamily="monospace">
        {summary.metrics[0]?.label}: {summary.metrics[0]?.value} {summary.metrics[0]?.unit}
      </text>
      <text x="26" y="143" fill="#EDF5ED" fontSize="9" fontFamily="monospace">
        {summary.lawConfirmed}
      </text>
    </svg>
  );
}
