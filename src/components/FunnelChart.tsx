import './FunnelChart.css';

export interface FunnelStage {
  label: string;
  value: number;
}

export interface FunnelChartProps {
  stages: FunnelStage[];
  formatValue?: (value: number) => string;
  /** Show drop-off % between consecutive stages. Default true. */
  showDropoff?: boolean;
  label?: string;
  className?: string;
}

/** Conversion funnel: queries → cited → resolved. Widths scale to the top stage. */
export function FunnelChart({ stages, formatValue = (v) => v.toLocaleString(), showDropoff = true, label = 'Funnel', className = '' }: FunnelChartProps) {
  const top = Math.max(1, ...stages.map((s) => s.value));
  const summary = stages.map((s) => `${s.label}: ${formatValue(s.value)}`).join(', ');
  return (
    <figure className={className} data-funnel="">
      <div data-funnellist="" role="img" aria-label={`${label}. ${summary || 'No data'}`}>
        {stages.map((s, i) => {
          const prev = stages[i - 1];
          const dropoff = showDropoff && prev && prev.value > 0 ? Math.round((1 - s.value / prev.value) * 100) : null;
          return (
            <div key={s.label} data-funnelrow="">
              <div data-funnelbarwrap="">
                <div data-funnelbar="" style={{ width: `${Math.max(8, (s.value / top) * 100)}%` }}>
                  <span data-funnellabel="">{s.label}</span>
                  <span data-funnelvalue="">{formatValue(s.value)}</span>
                </div>
              </div>
              {dropoff !== null && dropoff > 0 && <span data-funneldrop="">−{dropoff}%</span>}
            </div>
          );
        })}
        {stages.length === 0 && <span data-funnelempty="">No data</span>}
      </div>
      <figcaption data-sronly="">{summary || 'No data'}</figcaption>
    </figure>
  );
}
