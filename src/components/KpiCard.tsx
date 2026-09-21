import type { ReactNode } from 'react';
import './KpiCard.css';

export type DeltaDirection = 'up' | 'down' | 'flat';
export type DeltaTone = 'good' | 'bad' | 'neutral';

export interface KpiCardProps {
  label: ReactNode;
  /** Big formatted value. Pass a string/number; keep formatting at the call site. */
  value: ReactNode;
  /** e.g. "+8.2% vs last week". */
  delta?: ReactNode;
  deltaDirection?: DeltaDirection;
  /** Overrides the automatic tone (up=good, down=bad). Set "bad" for up-is-bad metrics like churn. */
  deltaTone?: DeltaTone;
  hint?: ReactNode;
  /** Small trailing sparkline. */
  spark?: number[];
  className?: string;
}

function sparkPath(values: number[], width: number, height: number): string {
  if (values.length === 0) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = values.length > 1 ? width / (values.length - 1) : 0;
  return values
    .map((v, i) => {
      const x = (i * step).toFixed(1);
      const y = (height - 3 - ((v - min) / span) * (height - 6)).toFixed(1);
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');
}

/** Single headline metric tile for agent-built dashboards. */
export function KpiCard({ label, value, delta, deltaDirection = 'flat', deltaTone, hint, spark, className = '' }: KpiCardProps) {
  const tone: DeltaTone = deltaTone ?? (deltaDirection === 'up' ? 'good' : deltaDirection === 'down' ? 'bad' : 'neutral');
  const arrow = deltaDirection === 'up' ? '▲' : deltaDirection === 'down' ? '▼' : '●';
  return (
    <div className={className} data-kpi="">
      <div data-kpilabel="">{label}</div>
      <div data-kpirow="">
        <div data-kpivalue="">{value}</div>
        {spark && spark.length > 1 && (
          <svg data-kpispark="" width="96" height="30" viewBox="0 0 96 30" aria-hidden="true">
            <path d={sparkPath(spark, 96, 30)} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      {delta && (
        <div data-kpidelta="" data-direction={deltaDirection} data-tone={tone}>
          <span aria-hidden="true">{arrow}</span> {delta}
        </div>
      )}
      {hint && <div data-kpihint="">{hint}</div>}
    </div>
  );
}
