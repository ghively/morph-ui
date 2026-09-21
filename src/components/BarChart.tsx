import './BarChart.css';

export interface BarDatum {
  label: string;
  value: number;
}

export interface BarChartProps {
  data: BarDatum[];
  height?: number;
  /** Formats the value shown atop each bar. Default: raw number. */
  formatValue?: (value: number) => string;
  label?: string;
  className?: string;
}

const PALETTE = ['#2f7cf6', '#30a46c', '#e8930c', '#8e6cc8', '#e5484d', '#18a999'];

/** Dependency-free vertical bar chart. Values render as text — readable without color. */
export function BarChart({ data, height = 180, formatValue = (v) => String(v), label = 'Bar chart', className = '' }: BarChartProps) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const summary = data.map((d) => `${d.label}: ${formatValue(d.value)}`).join(', ');
  return (
    <figure className={className} data-barchart="">
      <div data-bararea="" style={{ height }} role="img" aria-label={`${label}. ${summary}`}>
        {data.map((d, i) => (
          <div key={d.label} data-barcol="">
            <span data-barvalue="">{formatValue(d.value)}</span>
            <span
              data-bar=""
              style={{ height: `${Math.max(2, (d.value / max) * 100)}%`, background: PALETTE[i % PALETTE.length] }}
            />
            <span data-barlabel="">{d.label}</span>
          </div>
        ))}
        {data.length === 0 && <span data-barempty="">No data</span>}
      </div>
      <figcaption data-sronly="">{summary || 'No data'}</figcaption>
    </figure>
  );
}
