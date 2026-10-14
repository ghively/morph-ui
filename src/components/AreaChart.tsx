import { useId } from 'react';
import './AreaChart.css';

export interface AreaSeries {
  label: string;
  /** Y values, oldest first. All series should share one length. */
  values: number[];
}

export interface AreaChartProps {
  /** Series stack bottom-up in array order. */
  series: AreaSeries[];
  /** X labels, same length as a series. Falls back to index numbers. */
  labels?: string[];
  height?: number;
  /** Fill each band with a vertical per-series gradient. Default true; false = flat fills. */
  gradient?: boolean;
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
 * Dependency-free stacked area chart, pure SVG. Series stack bottom-up in
 * `--series-*` order; each band carries its values in `title`, the legend
 * spells out totals and the figcaption repeats the full summary, so color is
 * never the only channel.
 */
export function AreaChart({
  series,
  labels,
  height = 200,
  gradient = true,
  formatValue = (v) => String(v),
  label = 'Area chart',
  className = '',
}: AreaChartProps) {
  const W = 560;
  const H = 200;
  const PAD = 8;
  const n = Math.max(0, ...series.map((s) => s.values.length));
  const hasData = n > 0;
  const totals = hasData
    ? Array.from({ length: n }, (_, i) => series.reduce((sum, s) => sum + (s.values[i] ?? 0), 0))
    : [];
  const max = hasData ? Math.max(...totals) || 1 : 1;

  const xAt = (i: number) => (n > 1 ? PAD + (i / (n - 1)) * (W - PAD * 2) : W / 2);
  const yAt = (v: number) => PAD + (1 - v / max) * (H - PAD * 2);

  // Cumulative baselines bottom-up: series[0] sits on the floor.
  const cum: number[][] = [];
  series.forEach((s) => {
    const prev = cum[cum.length - 1] ?? Array(n).fill(0);
    cum.push(Array.from({ length: n }, (_, i) => (prev[i] ?? 0) + (s.values[i] ?? 0)));
  });

  const summary = hasData
    ? series
        .map(
          (s) =>
            `${s.label}: ${s.values
              .map((v, i) => `${labels?.[i] ?? `#${i + 1}`} ${formatValue(v)}`)
              .join(', ')}`,
        )
        .join('; ')
    : '';

  // Unique per instance so several charts on one page do not share defs.
  const gid = `${useId()}-areagrad`;

  return (
    <figure className={className} data-areachart="">
      <div
        data-areaarea=""
        style={{ height }}
        role="img"
        aria-label={`${label}. ${summary || 'No data'}`}
      >
        {!hasData ? (
          <span data-areaempty="">No data</span>
        ) : (
          <div data-areaplot="">
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
              {gradient && (
                <defs>
                  {/* Each band fades toward its own baseline so upper crests
                      read lighter than the floor they sit on. */}
                  {series.map((s, si) => (
                    <linearGradient key={s.label} id={`${gid}-${si}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={PALETTE[si % PALETTE.length]} stopOpacity="0.55" />
                      <stop offset="100%" stopColor={PALETTE[si % PALETTE.length]} stopOpacity="0.12" />
                    </linearGradient>
                  ))}
                </defs>
              )}
              {series.map((s, si) => {
                const top = cum[si]!;
                const base = si === 0 ? Array<number>(n).fill(0) : cum[si - 1]!;
                const up = top
                  .map((v, i) => `${i === 0 ? 'M' : 'L'}${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`)
                  .join(' ');
                const down = Array.from({ length: n }, (_, k) => n - 1 - k)
                  .map((i) => `L${xAt(i).toFixed(1)},${yAt(base[i]!).toFixed(1)}`)
                  .join(' ');
                return (
                  <g key={s.label}>
                    <path
                      d={`${up} ${down} Z`}
                      data-areaband=""
                      fill={gradient ? `url(#${gid}-${si})` : PALETTE[si % PALETTE.length]}
                      fillOpacity={gradient ? undefined : 0.3}
                    >
                      <title>{`${s.label}: ${s.values.map((v) => formatValue(v)).join(', ')}`}</title>
                    </path>
                    <path
                      d={up}
                      fill="none"
                      data-areacrest=""
                      stroke={PALETTE[si % PALETTE.length]}
                      vectorEffect="non-scaling-stroke"
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>
      <ul data-arealegend="">
        {series.map((s, i) => (
          <li key={s.label}>
            <span
              data-areaswatch=""
              style={{ background: PALETTE[i % PALETTE.length] }}
              aria-hidden="true"
            />
            <span data-areaname="">{s.label}</span>
            <span data-areavalue="">{formatValue(s.values.reduce((a, b) => a + b, 0))}</span>
          </li>
        ))}
      </ul>
      <figcaption data-sronly="">{summary || 'No data'}</figcaption>
    </figure>
  );
}
