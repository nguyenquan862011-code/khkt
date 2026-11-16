import type { QuestionFigure as Figure } from "@/data/question-bank/types";

const COLORS = ["#38A875", "#E0A93B", "#5AA9E6"];

function niceTicks(min: number, max: number, count = 5): number[] {
  if (min === max) return [min];
  const raw = (max - min) / count;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= raw) ?? raw;
  const ticks: number[] = [];
  for (let t = Math.ceil(min / step) * step; t <= max + step * 1e-6; t += step) {
    ticks.push(Math.round(t * 1e6) / 1e6);
  }
  return ticks;
}

const fmt = (n: number) => String(n).replace(".", ",");

/** Vẽ đồ thị / bảng số liệu đi kèm câu hỏi (dữ liệu nằm trong ngân hàng, không phải ảnh). */
export function QuestionFigure({ figure }: { figure: Figure }) {
  if (figure.type === "table") {
    return (
      <div className="my-3 overflow-x-auto">
        <table className="min-w-max border-collapse text-xs">
          {figure.caption && (
            <caption className="mb-1.5 text-left text-[11px] font-semibold text-muted-foreground">
              {figure.caption}
            </caption>
          )}
          <thead>
            <tr>
              {figure.headers.map((h, i) => (
                <th
                  key={i}
                  className="border border-border bg-secondary/60 px-2.5 py-1.5 text-left font-semibold"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {figure.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} className="border border-border px-2.5 py-1.5 font-mono">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const W = 340,
    H = 220,
    L = 44,
    R = 14,
    T = 16,
    B = 36;
  const points = figure.series.flatMap((s) => s.points);
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const xMin = Math.min(0, ...xs),
    xMax = Math.max(...xs, xMin + 1e-9);
  const yMin = Math.min(0, ...ys),
    yMax = Math.max(0, ...ys, yMin + 1e-9);
  const sx = (x: number) => L + ((x - xMin) / (xMax - xMin)) * (W - L - R);
  const sy = (y: number) => H - B - ((y - yMin) / (yMax - yMin)) * (H - T - B);
  const xTicks = niceTicks(xMin, xMax);
  const yTicks = niceTicks(yMin, yMax);

  return (
    <figure className="my-3 w-full max-w-sm">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={figure.title ?? `Đồ thị ${figure.yLabel} theo ${figure.xLabel}`}
        className="w-full rounded-lg border border-border bg-card"
      >
        {xTicks.map((t) => (
          <g key={`x${t}`}>
            <line
              x1={sx(t)}
              x2={sx(t)}
              y1={T}
              y2={H - B}
              stroke="currentColor"
              strokeOpacity={0.12}
            />
            <text
              x={sx(t)}
              y={H - B + 13}
              textAnchor="middle"
              fontSize={9}
              fill="currentColor"
              opacity={0.75}
            >
              {fmt(t)}
            </text>
          </g>
        ))}
        {yTicks.map((t) => (
          <g key={`y${t}`}>
            <line
              x1={L}
              x2={W - R}
              y1={sy(t)}
              y2={sy(t)}
              stroke="currentColor"
              strokeOpacity={0.12}
            />
            <text
              x={L - 5}
              y={sy(t) + 3}
              textAnchor="end"
              fontSize={9}
              fill="currentColor"
              opacity={0.75}
            >
              {fmt(t)}
            </text>
          </g>
        ))}
        <line x1={L} x2={W - R} y1={sy(0)} y2={sy(0)} stroke="currentColor" strokeOpacity={0.6} />
        <line x1={sx(0)} x2={sx(0)} y1={T} y2={H - B} stroke="currentColor" strokeOpacity={0.6} />
        {figure.series.map((s, i) => (
          <g key={i}>
            <polyline
              fill="none"
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              points={s.points.map((p) => `${sx(p[0])},${sy(p[1])}`).join(" ")}
            />
            {s.points.length <= 12 &&
              s.points.map((p, k) => (
                <circle
                  key={k}
                  cx={sx(p[0])}
                  cy={sy(p[1])}
                  r={2.6}
                  fill={COLORS[i % COLORS.length]}
                />
              ))}
            {s.label && (
              <text
                x={W - R - 2}
                y={T + 10 + i * 12}
                textAnchor="end"
                fontSize={9}
                fill={COLORS[i % COLORS.length]}
              >
                {s.label}
              </text>
            )}
          </g>
        ))}
        <text x={(L + W - R) / 2} y={H - 6} textAnchor="middle" fontSize={10} fill="currentColor">
          {figure.xLabel}
        </text>
        <text
          x={11}
          y={(T + H - B) / 2}
          textAnchor="middle"
          fontSize={10}
          fill="currentColor"
          transform={`rotate(-90 11 ${(T + H - B) / 2})`}
        >
          {figure.yLabel}
        </text>
      </svg>
      {figure.title && (
        <figcaption className="mt-1 text-center text-[11px] text-muted-foreground">
          {figure.title}
        </figcaption>
      )}
    </figure>
  );
}
