import { useMemo } from 'react';
import './ContextMeter.css';

export interface ContextMeterProps {
  used: number;
  total: number;
  label?: string;
}

export function ContextMeter({ used, total, label = 'Context window' }: ContextMeterProps) {
  const percentage = Math.min(100, Math.max(0, (used / total) * 100));
  
  const level = useMemo(() => {
    if (percentage >= 95) return 'danger';
    if (percentage >= 80) return 'warn';
    return 'ok';
  }, [percentage]);

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    return String(num);
  };

  return (
    <div data-context-meter="" data-level={level}>
      <div data-context-meter-header="">
        <span data-context-meter-label="">{label}</span>
        <span data-context-meter-value="">
          {formatNumber(used)} / {formatNumber(total)}
        </span>
      </div>
      
      <div data-context-meter-track="" aria-hidden="true">
        <div data-context-meter-fill="" style={{ width: `${percentage}%` }} />
        <div data-context-meter-tick="" style={{ left: '25%' }} />
        <div data-context-meter-tick="" style={{ left: '50%' }} />
        <div data-context-meter-tick="" style={{ left: '75%' }} />
      </div>
    </div>
  );
}
