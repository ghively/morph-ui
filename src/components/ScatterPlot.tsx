import './ScatterPlot.css';

export interface ScatterPoint {
  label: string;
  x: number;
  y: number;
  /** Bubble radius weight; default 1. */
  weight?: number;
  /** Series index 0–5 picks the --series-N color. */
  series?: number;
}

export interface ScatterPlotProps {
  points: ScatterPoint[];
  /** Optional crosshair medians; defaults to the midpoint of each axis. */
  quadrantX?: number;
  quadrantY?: number;
  /** Corner labels clockwise from top-left. Default: Q1–Q4. */
  quadrantLabels?: [string, string, string, string];
  height?: number;
  formatValue?: (value: number) => string;
  label?: string;
  className?: string;
}

const PALETTE = [
  'var(--series-1)',
  'var(--series-2)',
  'var(--series-3)',
  'var(--series-4)',
  'var(--series-5)',
  'var(--series-6)',
];

/**
 * Dependency-free bubble scatter plot with quadrant crosshairs, pure SVG.
 * Every bubble carries a `title` and the figcaption lists every point as
 * text, so position and size are never the only channel.
 */
export function ScatterPlot({
  points,
  quadrantX,
  quadrantY,
  quadrantLabels = ['Q1', 'Q2', 'Q3', 'Q4'],
  height = 240,
  formatValue = (v) => String(v),
  label = 'Scatter plot',
  className = '',
}: ScatterPlotProps) {
  const W = 460;
  const H = 240;
  const PAD = 18;
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const xMin = Math.min(...xs, 0);
  const xMax = Math.max(...xs, 1);
  const yMin = Math.min(...ys, 0);
  const yMax = Math.max(...ys, 1);
  const xSpan = xMax - xMin || 1;
  const ySpan = yMax - yMin || 1;
  const midX = quadrantX ?? (xMin + xMax) / 2;
  const midY = quadrantY ?? (yMin + yMax) / 2;

  const px = (v: number) => PAD + ((v - xMin) / xSpan) * (W - PAD * 2);
  const py = (v: number) => PAD + (1 - (v - yMin) / ySpan) * (H - PAD * 2);

  const summary =
    points.length === 0
      ? ''
      : `${points.map((p) => `${p.label} (${formatValue(p.x)}, ${formatValue(p.y)})`).join(', ')}. Median cross at (${formatValue(midX)}, ${formatValue(midY)}).`;

  return (
    <figure className={className} data-scatter="">
      <div data-scatterarea="" style={{ height }}>
        {points.length === 0 ? (
          <span data-scatterempty="">No data</span>
        ) : (
          <div data-scatterplot="">
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${label}. ${summary}`} data-scattersvg="">
              {/* Quadrant crosshairs: vertical + horizontal medians. */}
              <line
                x1={px(midX)}
                y1={PAD}
                x2={px(midX)}
                y2={H - PAD}
                data-scatteraxis=""
                data-scatteraxis-v=""
              />
              <line
                x1={PAD}
                y1={py(midY)}
                x2={W - PAD}
                y2={py(midY)}
                data-scatteraxis=""
                data-scatteraxis-h=""
              />
              {quadrantLabels.map((q, i) => (
                <text
                  key={q + i}
                  data-scatterquad=""
                  x={i % 2 === 0 ? PAD + 6 : W - PAD - 6}
                  y={i < 2 ? PAD + 12 : H - PAD - 6}
                  textAnchor={i % 2 === 0 ? 'start' : 'end'}
                >
                  {q}
                </text>
              ))}
              {points.map((p) => {
                const r = 4 + (p.weight ?? 1) * 5;
                const ci = (p.series ?? 0) % PALETTE.length;
                return (
                  <circle
                    key={p.label}
                    cx={px(p.x).toFixed(1)}
                    cy={py(p.y).toFixed(1)}
                    r={r.toFixed(1)}
                    data-scatterdot=""
                    fill={PALETTE[ci]}
                    className={className ? undefined : undefined}
                  >
                    <title>{`${p.label}: ${formatValue(p.x)} / ${formatValue(p.y)} (weight ${p.weight ?? 1})`}</title>
                  </circle>
                );
              })}
            </svg>
          </div>
        )}
      </div>
      <figcaption data-sronly="">{summary || 'No data'}</figcaption>
    </figure>
  );
}
