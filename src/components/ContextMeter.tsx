import './ContextMeter.css';
import type { ReactNode } from 'react';
import { useMeter, fmtK, cv, SEG_C, type ContextMeterProps } from './agentOps.shared';

export function ContextMeter({ used, total, label = 'Context window', breakdown, className = '' }: ContextMeterProps) {
  const m = useMeter({ used, total });
  return (
    <div className={'context-meter ' + className} data-context-meter="" data-level={m.level} style={cv(m.color)}>
      <div className="context-meter-head" data-context-meter-header="">
        <span data-context-meter-label="">{label}</span>
        <span className="context-meter-pct">{m.pctText}</span>
        <span className="context-meter-val" data-context-meter-value="">{fmtK(used) + ' / ' + fmtK(total)}</span>
      </div>
      <div className="context-meter-track" data-context-meter-track="" role="meter" aria-valuemin={0} aria-valuemax={total} aria-valuenow={used} aria-label={label}>
        {breakdown && breakdown.length ? breakdown.reduce((acc, b, i) => {
          const w = total > 0 ? (b.value / total) * 100 : 0;
          acc.els.push(<span key={b.label} className="context-meter-seg" style={{ left: acc.x + '%', width: w + '%', background: SEG_C[i % SEG_C.length] }} title={b.label + ' ' + fmtK(b.value)} />);
          acc.x += w; return acc;
        }, { x: 0, els: [] as ReactNode[] }).els : <span className="context-meter-fill" data-context-meter-fill="" style={{ width: m.pct + '%' }} />}
        {[25, 50, 75].map(t => <i key={t} data-context-meter-tick="" style={{ left: t + '%' }} />)}
      </div>
      {breakdown && breakdown.length > 0 && (
        <div className="context-meter-legend">{breakdown.map((b, i) => <span key={b.label}><i style={{ background: SEG_C[i % SEG_C.length] }} />{b.label + ' ' + fmtK(b.value)}</span>)}<span className="context-meter-left">{fmtK(m.left) + ' free'}</span></div>
      )}
    </div>
  );
}

export type { ContextMeterProps } from './agentOps.shared';
