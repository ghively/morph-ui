import './CostMeter.css';

export interface CostMeterProps {
  /** Spent so far, in the same unit as budget. */
  spent: number;
  budget: number;
  /** Formats money/tokens, e.g. (v) => `$${v.toFixed(2)}`. */
  formatValue?: (value: number) => string;
  label?: string;
  className?: string;
}

/** Run-cost meter: spend vs budget with over-budget state. Never subtle when blown. */
export function CostMeter({ spent, budget, formatValue = (v) => String(v), label = 'Run cost', className = '' }: CostMeterProps) {
  const over = spent > budget;
  const pct = budget <= 0 ? 0 : Math.min(100, (spent / budget) * 100);
  return (
    <div className={className} data-cost="" data-over={over ? '' : undefined}>
      <div data-costhead="">
        <span>{label}</span>
        <span data-costnumbers="">
          {formatValue(spent)} / {formatValue(budget)}
        </span>
      </div>
      <div
        data-costbar=""
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={budget}
        aria-valuenow={Math.min(budget, Math.max(0, spent))}
        aria-label={label}
      >
        <span data-costfill="" style={{ width: `${pct}%` }} />
      </div>
      {over && (
        <div data-costover="" role="alert">
          {formatValue(spent - budget)} over budget — further tool calls are paused.
        </div>
      )}
    </div>
  );
}
