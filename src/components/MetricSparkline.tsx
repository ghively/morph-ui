import { useState, useMemo, type MouseEvent } from 'react';
import './MetricSparkline.css';

export interface MetricSparklineProps {
  label: string;
  value: string;
  series: number[];
  /** Lower is better (latency, errors): flips the good/bad colouring of the delta. */
  invert?: boolean;
  /** Window caption, e.g. "24h". */
  period?: string;
  className?: string;
}

const W = 120, H = 32, PAD = 3;

export function MetricSparkline({ label, value, series, invert = false, period, className = '' }: MetricSparklineProps) {
  const s = useMemo(() => {
    const n = series.length;
    const min = n ? Math.min(...series) : 0, max = n ? Math.max(...series) : 0, range = max - min || 1;
    const pts = series.map((v, i) => [n === 1 ? W / 2 : PAD + (i * (W - PAD * 2)) / (n - 1), n === 1 ? H / 2 : PAD + (H - PAD * 2) * (1 - (v - min) / range)] as [number, number]);
    const d = n > 1 ? pts.map((p, i) => `${i ? 'L' : 'M'} ${+p[0].toFixed(2)} ${+p[1].toFixed(2)}`).join(' ') : n === 1 ? `M ${PAD} ${H / 2} L ${W - PAD} ${H / 2}` : '';
    const first = series[0], last = series[n - 1];
    const trend = n > 1 && last > first ? 'up' : n > 1 && last < first ? 'down' : 'neutral';
    const delta = n > 1 && first ? ((last - first) / Math.abs(first)) * 100 : 0;
    const good = trend === 'neutral' ? 'neutral' : (trend === 'up') !== invert ? 'good' : 'bad';
    return { pts, d, trend, delta, good };
  }, [series, invert]);

  const [hov, setHov] = useState<number | null>(null);
  const last = s.pts[s.pts.length - 1];
  const hp = hov != null ? s.pts[hov] : null;
  const move = (e: MouseEvent<HTMLDivElement>) => {
    if (series.length < 2) return;
    const r = e.currentTarget.getBoundingClientRect();
    setHov(Math.max(0, Math.min(series.length - 1, Math.round(((e.clientX - r.left) / r.width) * (series.length - 1)))));
  };
  const abs = Math.abs(s.delta);
  const deltaText = `${s.delta > 0 ? '+' : s.delta < 0 ? '−' : '±'}${abs >= 10 ? abs.toFixed(0) : abs.toFixed(1)}%`;

  return (
    <div className={`metric-sparkline trend-${s.trend} is-${s.good} ${className}`.trim()} aria-label={`${label}: ${value}`}>
      <div className="metric-sparkline-txt metric-sparkline-info">
        <span className="metric-sparkline-label">{label}{period && <em>{period}</em>}</span>
        <span className="metric-sparkline-row">
          <span className="metric-sparkline-value">{hov != null ? series[hov].toLocaleString() : value}</span>
          {series.length > 1 && <span className="metric-sparkline-delta">{deltaText}</span>}
        </span>
      </div>
      <div className="metric-sparkline-chart" onMouseMove={move} onMouseLeave={() => setHov(null)}>
        {series.length === 0 ? <span className="metric-sparkline-empty">—</span> : (
          <>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
              <line className="metric-sparkline-base" x1="0" x2={W} y1={H - 1} y2={H - 1} vectorEffect="non-scaling-stroke" />
              <path className="metric-sparkline-line metric-sparkline-path" d={s.d} fill="none" vectorEffect="non-scaling-stroke" />
            </svg>
            {last && !hp && <span className="metric-sparkline-dot" style={{ left: `${(last[0] / W) * 100}%`, top: `${(last[1] / H) * 100}%` }} />}
            {hp && <span className="metric-sparkline-cross" style={{ left: `${(hp[0] / W) * 100}%` }}><i style={{ top: `${(hp[1] / H) * 100}%` }} /></span>}
          </>
        )}
      </div>
    </div>
  );
}
