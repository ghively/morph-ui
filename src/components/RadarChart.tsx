import './RadarChart.css';

export interface RadarSeries {
  label: string;
  /** One value per axis, 0–1 (normalized) or raw — max is taken across all series. */
  values: number[];
}

export interface RadarChartProps {
  /** Axis names, one per point. */
  axes: string[];
  /** Two or more series overlay in --series-* order. */
  series: RadarSeries[];
  size?: number;
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
 * Dependency-free spider/radar chart, pure SVG. Each series is a closed
 * polygon over the shared axes; values are printed in the legend table and
 * figcaption, so shape is never the only channel.
 */
export function RadarChart({
  axes,
  series,
  size = 240,
  formatValue = (v) => String(v),
  label = 'Radar chart',
  className = '',
}: RadarChartProps) {
  const S = 200;
  const C = S / 2;
  const R = 74;
  const n = axes.length;
  const hasData = n >= 3 && series.length > 0;
  const max = hasData ? Math.max(1, ...series.flatMap((s) => s.values)) : 1;

  const angle = (i: number) => (i / n) * Math.PI * 2 - Math.PI / 2;
  const point = (i: number, frac: number) => {
    const a = angle(i);
    return [C + Math.cos(a) * R * frac, C + Math.sin(a) * R * frac] as const;
  };
  const polygon = (values: number[]) =>
    values
      .map((v, i) => {
        const [x, y] = point(i, Math.max(0, Math.min(1, v / max)));
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

  const summary = hasData
    ? `${axes.join('/')}: ${series.map((s) => `${s.label} (${s.values.map((v) => formatValue(v)).join(', ')})`).join('; ')}`
    : '';

  return (
    <figure className={className} data-radar="">
      <div data-radarrow="">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${S} ${S}`}
          role="img"
          aria-label={`${label}. ${summary || 'No data'}`}
          data-radarsvg=""
        >
          {!hasData ? (
            <text x={C} y={C} textAnchor="middle" data-radarempty="">
              No data
            </text>
          ) : (
            <>
              {/* Concentric grid rings at 25/50/75/100% plus spoke lines. */}
              {[0.25, 0.5, 0.75, 1].map((frac) => (
                <polygon
                  key={frac}
                  points={Array.from({ length: n }, (_, i) => {
                    const [x, y] = point(i, frac);
                    return `${x.toFixed(1)},${y.toFixed(1)}`;
                  }).join(' ')}
                  data-radarring=""
                />
              ))}
              {axes.map((name, i) => {
                const [x, y] = point(i, 1);
                return <line key={name} x1={C} y1={C} x2={x.toFixed(1)} y2={y.toFixed(1)} data-radarspoke="" />;
              })}
              {series.map((s, si) => (
                <polygon
                  key={s.label}
                  points={polygon(s.values)}
                  data-radarshape=""
                  fill={PALETTE[si % PALETTE.length]}
                  stroke={PALETTE[si % PALETTE.length]}
                >
                  <title>{`${s.label}: ${s.values.map((v, i) => `${axes[i]} ${formatValue(v)}`).join(', ')}`}</title>
                </polygon>
              ))}
              {axes.map((name, i) => {
                const [x, y] = point(i, 1.16);
                return (
                  <text
                    key={name}
                    x={x.toFixed(1)}
                    y={y.toFixed(1)}
                    textAnchor={x < C - 4 ? 'end' : x > C + 4 ? 'start' : 'middle'}
                    dominantBaseline={y < C - 4 ? 'hanging' : y > C + 4 ? 'auto' : 'central'}
                    data-radaraxis=""
                  >
                    {name}
                  </text>
                );
              })}
            </>
          )}
        </svg>
        <ul data-radarlegend="">
          {series.map((s, i) => (
            <li key={s.label}>
              <span data-radarswatch="" style={{ background: PALETTE[i % PALETTE.length] }} aria-hidden="true" />
              <span data-radarname="">{s.label}</span>
              <span data-radarvalue="">{s.values.map((v) => formatValue(v)).join(' · ')}</span>
            </li>
          ))}
        </ul>
      </div>
      <figcaption data-sronly="">{summary || 'No data'}</figcaption>
    </figure>
  );
}
