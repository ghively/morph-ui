import './StackedBarChart.css';

export interface StackedSeries {
  label: string;
  /** One value per category, aligned across series. */
  values: number[];
}

export interface StackedCategory {
  label: string;
}

export interface StackedBarChartProps {
  categories: string[];
  series: StackedSeries[];
  /** Default vertical columns; 'horizontal' draws H bars (great for long labels). */
  orientation?: 'vertical' | 'horizontal';
  height?: number;
  /** Show each segment's value in text. Default true. */
  showValues?: boolean;
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
 * Dependency-free stacked bar chart, vertical or horizontal, pure CSS/HTML
 * flex (no SVG needed — bars are rectangles). Segments follow `--series-*`
 * order bottom-up / left-to-right; every segment carries a title, each bar
 * prints its total, and the figcaption repeats everything, so the stack is
 * never color-only.
 */
export function StackedBarChart({
  categories,
  series,
  orientation = 'vertical',
  height = 200,
  showValues = true,
  formatValue = (v) => String(v),
  label = 'Stacked bar chart',
  className = '',
}: StackedBarChartProps) {
  const n = categories.length;
  const hasData = n > 0 && series.length > 0;
  const totals = hasData
    ? Array.from({ length: n }, (_, i) => series.reduce((sum, s) => sum + (s.values[i] ?? 0), 0))
    : [];
  const max = hasData ? Math.max(1, ...totals) : 1;
  const summary = hasData
    ? categories
        .map(
          (c, i) =>
            `${c}: ${series.map((s) => `${s.label} ${formatValue(s.values[i] ?? 0)}`).join(', ')} (total ${formatValue(totals[i]!)})`,
        )
        .join('; ')
    : '';

  const horizontal = orientation === 'horizontal';

  return (
    <figure className={className} data-sbar="" data-orientation={orientation}>
      <div
        data-sbararea=""
        style={horizontal ? undefined : { height }}
        role="img"
        aria-label={`${label}. ${summary || 'No data'}`}
      >
        {!hasData ? (
          <span data-sbarempty="">No data</span>
        ) : (
          categories.map((c, i) => (
            <div key={c} data-sbarcol="">
              <div data-sbartrack="">
                <div
                  data-sbarstack=""
                  style={
                    horizontal
                      ? { width: `${(totals[i]! / max) * 100}%` }
                      : { height: `${(totals[i]! / max) * 100}%` }
                  }
                >
                  {series.map((s, si) => {
                    const v = s.values[i] ?? 0;
                    const share = totals[i]! > 0 ? (v / totals[i]!) * 100 : 0;
                    return (
                      <span
                        key={s.label}
                        data-sbarseg=""
                        title={`${c} · ${s.label}: ${formatValue(v)}`}
                        style={
                          {
                            background: PALETTE[si % PALETTE.length],
                            '--seg': `${share}%`,
                          } as React.CSSProperties
                        }
                      >
                        {showValues && share >= 9 ? formatValue(v) : null}
                      </span>
                    );
                  })}
                </div>
              </div>
              <span data-sbarcat="">{c}</span>
              <span data-sbartotal="">{formatValue(totals[i]!)}</span>
            </div>
          ))
        )}
      </div>
      <ul data-sbarlegend="">
        {series.map((s, i) => (
          <li key={s.label}>
            <span data-sbarswatch="" style={{ background: PALETTE[i % PALETTE.length] }} aria-hidden="true" />
            <span data-sbarname="">{s.label}</span>
          </li>
        ))}
      </ul>
      <figcaption data-sronly="">{summary || 'No data'}</figcaption>
    </figure>
  );
}

