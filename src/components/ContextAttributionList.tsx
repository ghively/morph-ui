import './ContextAttributionList.css';

export interface AttributionEntry {
  source: string;
  tokens: number;
  department?: string;
}

export interface ContextAttributionListProps {
  entries: AttributionEntry[];
  /** Context window size; bars scale against the largest entry unless budget is given. */
  budget?: number;
  className?: string;
}

/** Where the context tokens went: per-source contribution bars against the window. */
export function ContextAttributionList({ entries, budget, className = '' }: ContextAttributionListProps) {
  const total = entries.reduce((s, e) => s + e.tokens, 0);
  const scale = Math.max(1, ...entries.map((e) => e.tokens));
  return (
    <div className={className} data-attribution="">
      <div data-attributionhead="">
        <span>Context usage</span>
        <span data-attributiontotal="">
          {total.toLocaleString()} tokens{budget ? ` of ${budget.toLocaleString()}` : ''}
        </span>
      </div>
      {budget !== undefined && (
        <div data-budgetbar="" role="progressbar" aria-valuemin={0} aria-valuemax={budget} aria-valuenow={Math.min(budget, total)} aria-label="Context window usage">
          <span data-budgetfill="" style={{ width: `${Math.min(100, (total / budget) * 100)}%` }} />
        </div>
      )}
      <ul data-attributionlist="">
        {entries.map((e) => (
          <li key={e.source} data-attributionrow="">
            <span data-attrsource="">{e.source}</span>
            {e.department && <span data-attrdept="">{e.department}</span>}
            <span data-attrbar="" aria-hidden="true">
              <span data-attrfill="" style={{ width: `${Math.max(2, (e.tokens / scale) * 100)}%` }} />
            </span>
            <span data-attrtokens="">{e.tokens.toLocaleString()}</span>
          </li>
        ))}
        {entries.length === 0 && <li data-attributionnone="">No context consumed.</li>}
      </ul>
    </div>
  );
}
