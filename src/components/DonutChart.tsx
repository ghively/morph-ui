import './DonutChart.css';

export interface DonutSegment {
  label: string;
  value: number;
}

export interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  /** Text in the hole. Defaults to the formatted total. */
  centerLabel?: string;
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

/** Dependency-free donut with a real list-based legend — color is never the only channel. */
export function DonutChart({
  segments,
  size = 168,
  thickness = 22,
  centerLabel,
  formatValue = (v) => String(v),
  label = 'Donut chart',
  className = '',
}: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const R = 70;
  const C = 2 * Math.PI * R;
  let offset = 25; // start at 12 o'clock (% of circumference)

  const summary = segments.map((s) => `${s.label}: ${formatValue(s.value)}`).join(', ');

  return (
    <figure className={className} data-donut="">
      <div data-donutrow="">
        <svg
          width={size}
          height={size}
          viewBox="0 0 168 168"
          role="img"
          aria-label={`${label}. ${summary || 'No data'}`}
          data-donutsvg=""
        >
          <circle cx="84" cy="84" r={R} fill="none" data-donuttrack="" strokeWidth={thickness} />
          {total > 0 &&
            segments.map((s, i) => {
              const frac = s.value / total;
              const dash = `${(frac * C).toFixed(2)} ${(C - frac * C).toFixed(2)}`;
              const el = (
                <circle
                  key={s.label}
                  cx="84"
                  cy="84"
                  r={R}
                  fill="none"
                  stroke={PALETTE[i % PALETTE.length]}
                  strokeWidth={thickness}
                  strokeDasharray={dash}
                  strokeDashoffset={`${((offset * C) / 100).toFixed(2)}`}
                  data-donutseg=""
                >
                  <title>{`${s.label}: ${formatValue(s.value)}`}</title>
                </circle>
              );
              offset -= frac * 100;
              return el;
            })}
          <text x="84" y="84" textAnchor="middle" dominantBaseline="central" data-donutcenter="">
            {centerLabel ?? formatValue(total)}
          </text>
        </svg>
        <ul data-donutlegend="">
          {segments.map((s, i) => (
            <li key={s.label}>
              <span data-donutswatch="" style={{ background: PALETTE[i % PALETTE.length] }} aria-hidden="true" />
              <span data-donutname="">{s.label}</span>
              <span data-donutvalue="">{formatValue(s.value)}</span>
            </li>
          ))}
          {segments.length === 0 && <li data-donutnone="">No data</li>}
        </ul>
      </div>
      <figcaption data-sronly="">{summary || 'No data'}</figcaption>
    </figure>
  );
}
