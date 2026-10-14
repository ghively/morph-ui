import './WaterfallChart.css';

export interface WaterfallStep {
  label: string;
  /** Signed delta for intermediate steps; absolute total for `kind="total"`. */
  value: number;
  kind?: 'delta' | 'total';
}

export interface WaterfallChartProps {
  steps: WaterfallStep[];
  height?: number;
  formatValue?: (value: number) => string;
  label?: string;
  className?: string;
}

/**
 * Dependency-free waterfall (bridge) chart, pure SVG. Deltas float between
 * cumulative levels — increases use the success token, decreases the danger
 * token, totals the accent — and every step prints its value as text, so
 * direction is never color-only. `data-dir` hooks expose up/down/total.
 */
export function WaterfallChart({
  steps,
  height = 200,
  formatValue = (v) => String(v),
  label = 'Waterfall chart',
  className = '',
}: WaterfallChartProps) {
  const W = 560;
  const H = 200;
  const PAD = 22;
  const hasData = steps.length > 0;

  // Running totals: a delta moves the level, a total resets to its own value.
  const levels: number[] = [];
  const starts: number[] = [];
  let run = 0;
  steps.forEach((s) => {
    if (s.kind === 'total') {
      starts.push(0);
      levels.push(s.value);
      run = s.value;
    } else {
      starts.push(run);
      run += s.value;
      levels.push(run);
    }
  });
  const allVals = [...starts, ...levels, 0];
  const min = Math.min(...allVals);
  const max = Math.max(...allVals);
  const span = max - min || 1;

  const step = W / Math.max(steps.length, 1);
  const barW = Math.min(46, step * 0.55);
  const xAt = (i: number) => step * (i + 0.5);
  const yAt = (v: number) => PAD + (1 - (v - min) / span) * (H - PAD * 2);

  const summary = hasData
    ? steps
        .map((s, i) => `${s.label}: ${s.kind === 'total' ? `${formatValue(s.value)} (total)` : `${s.value >= 0 ? '+' : ''}${formatValue(s.value)} → ${formatValue(levels[i]!)}`}`)
        .join('; ')
    : '';

  return (
    <figure className={className} data-waterfall="">
      <div data-waterfallarea="" style={{ height }}>
        {!hasData ? (
          <span data-waterfalempty="">No data</span>
        ) : (
          <div data-waterfallplot="">
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${label}. ${summary}`} data-waterfallsvg="">
              {/* Zero baseline, only when in range. */}
              {min <= 0 && max >= 0 && (
                <line x1="0" y1={yAt(0).toFixed(1)} x2={W} y2={yAt(0).toFixed(1)} data-waterfallzero="" />
              )}
              {steps.map((s, i) => {
                const total = s.kind === 'total';
                const top = total ? Math.max(s.value, 0) : Math.max(starts[i]!, levels[i]!);
                const bottom = total ? Math.min(s.value, 0) : Math.min(starts[i]!, levels[i]!);
                const color = total
                  ? 'var(--morph-accent)'
                  : s.value >= 0
                    ? 'var(--morph-success)'
                    : 'var(--morph-danger)';
                const x = xAt(i);
                const dir = total ? 'total' : s.value >= 0 ? 'up' : 'down';
                return (
                  <g key={s.label} data-waterfallstep="" data-dir={dir}>
                    {/* Connector from this step's end level to the next step. */}
                    {!total && i < steps.length - 1 && (
                      <line
                        x1={(x + barW / 2).toFixed(1)}
                        y1={yAt(levels[i]!).toFixed(1)}
                        x2={(xAt(i + 1) - barW / 2).toFixed(1)}
                        y2={yAt(levels[i]!).toFixed(1)}
                        data-waterfallconn=""
                      />
                    )}
                    {total && i > 0 && (
                      <line
                        x1={(xAt(i - 1) + barW / 2).toFixed(1)}
                        y1={yAt(levels[i - 1]!).toFixed(1)}
                        x2={(x - barW / 2).toFixed(1)}
                        y2={yAt(levels[i - 1]!).toFixed(1)}
                        data-waterfallconn=""
                      />
                    )}
                    <rect
                      x={(x - barW / 2).toFixed(1)}
                      y={yAt(top).toFixed(1)}
                      width={barW.toFixed(1)}
                      height={Math.max(1.5, yAt(bottom) - yAt(top)).toFixed(1)}
                      rx="2"
                      fill={color}
                      fillOpacity={total ? 0.85 : 0.92}
                      data-waterfallbar=""
                    >
                      <title>
                        {`${s.label}: ${total ? formatValue(s.value) : `${s.value >= 0 ? '+' : ''}${formatValue(s.value)}`} (level ${formatValue(levels[i]!)})`}
                      </title>
                    </rect>
                    <text
                      x={x.toFixed(1)}
                      y={(yAt(top) - 5).toFixed(1)}
                      textAnchor="middle"
                      data-waterfallvalue=""
                    >
                      {total ? formatValue(s.value) : `${s.value >= 0 ? '+' : ''}${formatValue(s.value)}`}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>
      <div data-waterfallaxis="">
        {steps.map((s) => (
          <span key={s.label} data-waterfalltick="">
            {s.label}
          </span>
        ))}
      </div>
      <figcaption data-sronly="">{summary || 'No data'}</figcaption>
    </figure>
  );
}
