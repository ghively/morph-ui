import './CostMeter.css';
import { useCost, cv, type CostMeterProps } from './agentOps.shared';

export function CostMeter(props: CostMeterProps) {
  const { spent, budget, formatValue = (v: number) => String(v), label = 'Run cost', className = '' } = props;
  const c = useCost(props);
  return (
    <div className={'cost-meter ' + className} data-cost="" data-over={c.over ? '' : undefined} data-level={c.level} style={cv(c.color)}>
      <div className="cost-meter-head" data-costhead="">
        <span className="cost-meter-lab">{label}</span>
        <span className="cost-meter-big" data-costnumbers="">{formatValue(spent)}<small>{'of ' + formatValue(budget)}</small></span>
      </div>
      <div className="cost-meter-bar" data-costbar="" aria-label={label} {...c.aria}><span data-costfill="" style={{ width: c.pct + '%' }} /><i style={{ left: (props.warnAt ?? 0.8) * 100 + '%' }} /></div>
      {c.over ? <div className="cost-meter-alert" data-costover="" role="alert"><b>{formatValue(c.overBy) + ' over'}</b> — further tool calls are paused.</div>
        : <div className="cost-meter-left"><b>{formatValue(c.left)}</b>{' remaining'}</div>}
    </div>
  );
}

export type { CostMeterProps } from './agentOps.shared';
