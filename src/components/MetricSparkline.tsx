
import './MetricSparkline.css';

export interface MetricSparklineProps {
  label: string;
  value: string;
  series: number[];
  className?: string;
}

export function MetricSparkline({ label, value, series, className = '' }: MetricSparklineProps) {
  const computePath = (data: number[]) => {
    if (data.length === 0) return '';
    if (data.length === 1) return `M 0 10 L 100 10`;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const dx = 100 / (data.length - 1);
    
    return data.map((d, i) => {
      const x = i * dx;
      const y = 20 - ((d - min) / range) * 20; // 20 is svg height
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const pathD = computePath(series);
  
  // Basic determination of trend for color mapping (just an example, customize if needed)
  const isUp = series.length > 1 && series[series.length - 1]! > series[0]!;
  const isDown = series.length > 1 && series[series.length - 1]! < series[0]!;
  const trendClass = isUp ? 'trend-up' : isDown ? 'trend-down' : 'trend-neutral';

  return (
    <div className={`metric-sparkline ${trendClass} ${className}`} aria-label={`${label}: ${value}`}>
      <div className="metric-sparkline-info">
        <span className="metric-sparkline-label">{label}</span>
        <span className="metric-sparkline-value">{value}</span>
      </div>
      <div className="metric-sparkline-chart">
        <svg viewBox="0 0 100 20" preserveAspectRatio="none">
          {pathD && (
            <path
              className="metric-sparkline-path"
              d={pathD}
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
      </div>
    </div>
  );
}
