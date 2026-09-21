import './LineChart.css';

export interface LineChartProps {
  /** Y values, oldest first. */
  values: number[];
  /** X labels, same length as values. Falls back to index numbers. */
  labels?: string[];
  height?: number;
  showArea?: boolean;
  showDots?: boolean;
  formatValue?: (value: number) => string;
  label?: string;
  className?: string;
}

/** Dependency-free SVG line chart with area fill and an accessible text summary. */
export function LineChart({
  values,
  labels,
  height = 180,
  showArea = true,
  showDots = true,
  formatValue = (v) => String(v),
  label = 'Line chart',
  className = '',
}: LineChartProps) {
  const W = 560;
  const H = 200;
  const PAD = 8;
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 1;
  const span = max - min || 1;

  const points = values.map((v, i) => {
    const x = values.length > 1 ? PAD + (i / (values.length - 1)) * (W - PAD * 2) : W / 2;
    const y = PAD + (1 - (v - min) / span) * (H - PAD * 2);
    return { x, y, v, label: labels?.[i] ?? `#${i + 1}` };
  });

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const summary = points.map((p) => `${p.label}: ${formatValue(p.v)}`).join(', ');

  return (
    <figure className={className} data-linechart="">
      <div data-linearea="" style={{ height }} role="img" aria-label={`${label}. ${summary || 'No data'}`}>
        {points.length === 0 ? (
          <span data-lineempty="">No data</span>
        ) : (
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
            {showArea && <path d={`${line} L${(W - PAD).toFixed(1)},${H} L${PAD},${H} Z`} data-linefill="" />}
            <path d={line} fill="none" data-linestroke="" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            {showDots &&
              points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={4} data-linedot="">
                  <title>{`${p.label}: ${formatValue(p.v)}`}</title>
                </circle>
              ))}
          </svg>
        )}
      </div>
      <figcaption data-sronly="">{summary || 'No data'}</figcaption>
    </figure>
  );
}
