import './QuotaMeter.css';

export interface QuotaMeterProps {
  /** Current usage in any unit. */
  used: number;
  /** Total allowance; must be > 0. */
  limit: number;
  /** Plural unit shown between numbers, e.g. "credits" or "GB". */
  unit?: string;
  /** Compact headline, e.g. "84 GB of 100 GB". Default true. */
  showValues?: boolean;
  /** Fraction of the limit where the bar turns warn (0–1). Default 0.8. */
  warnAt?: number;
  /** Show the percent badge. Default true. */
  showPercent?: boolean;
  /** Accessible name. Default "Quota". */
  label?: string;
  /** Optional caption under the bar, e.g. "Resets in 6 days". */
  hint?: string;
  /** Compact (inline) or full (card) presentation. Default 'full'. */
  variant?: 'full' | 'compact';
  className?: string;
}

/**
 * Usage-vs-limit bar with an overage warn state: the bar turns gold past
 * `warnAt`, coral over the limit, and the overage is spelled out in text.
 * Numbers are tabular. Provenance: original morph-ui design (2026-10).
 */
export function QuotaMeter({
  used,
  limit,
  unit,
  showValues = true,
  warnAt = 0.8,
  showPercent = true,
  label = 'Quota',
  hint,
  variant = 'full',
  className = '',
}: QuotaMeterProps) {
  const safeLimit = limit > 0 ? limit : 1;
  const ratio = used / safeLimit;
  const pct = Math.round(ratio * 100);
  const over = used > safeLimit;
  const warn = !over && ratio >= warnAt;
  const fill = Math.min(100, Math.max(0, ratio * 100));
  const fmt = (n: number) =>
    Number.isInteger(n) ? n.toLocaleString() : n.toLocaleString(undefined, { maximumFractionDigits: 1 });
  const overBy = used - safeLimit;

  return (
    <div
      className={className}
      data-quota=""
      data-variant={variant}
      data-level={over ? 'over' : warn ? 'warn' : 'ok'}
      role="meter"
      aria-valuemin={0}
      aria-valuenow={Math.round(used)}
      aria-valuemax={Math.round(safeLimit)}
      aria-label={label}
    >
      <div data-quotarow="">
        <span data-quotaname="">{label}</span>
        {showPercent && (
          <span data-quotapct="">{over ? `+${Math.round((overBy / safeLimit) * 100)}%` : `${pct}%`}</span>
        )}
      </div>
      <div data-quotabar="">
        <span data-quotafill="" style={{ width: `${fill}%` }} />
        {over && <span data-quotaover="" style={{ width: `${Math.min(100, (overBy / safeLimit) * 100)}%` }} />}
        {warnAt > 0 && warnAt < 1 && <span data-quotamark="" style={{ left: `${warnAt * 100}%` }} aria-hidden="true" />}
      </div>
      {(showValues || hint || over) && (
        <div data-quotafeet="">
          {showValues && (
            <span data-quotavalues="">
              <b>{fmt(used)}</b>
              {' of '}
              {fmt(safeLimit)}
              {unit ? ` ${unit}` : ''}
            </span>
          )}
          {hint && <span data-quotahint="">{hint}</span>}
          {over && (
            <span data-quotaalert="" role="alert">
              {fmt(overBy)} {unit ?? 'units'} over limit
            </span>
          )}
        </div>
      )}
    </div>
  );
}
