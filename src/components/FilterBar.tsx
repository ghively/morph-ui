import './FilterBar.css';

export interface ActiveFilter {
  id: string;
  label: string;
}

export interface FilterBarProps {
  filters: ActiveFilter[];
  onRemove?: (id: string) => void;
  onClearAll?: () => void;
  resultCount?: number;
  className?: string;
}

/** Active-filter chip row with remove, clear-all, and result count. */
export function FilterBar({ filters, onRemove, onClearAll, resultCount, className = '' }: FilterBarProps) {
  if (filters.length === 0) {
    return (
      <div className={className} data-filterbar="" data-empty="">
        <span data-filternone="">No filters — showing everything{resultCount !== undefined ? ` (${resultCount})` : ''}.</span>
      </div>
    );
  }
  return (
    <div className={className} data-filterbar="">
      <div data-filterchips="" role="group" aria-label="Active filters">
        {filters.map((f) => (
          <span key={f.id} data-filterchip="">
            {f.label}
            <button type="button" aria-label={`Remove filter ${f.label}`} onClick={() => onRemove?.(f.id)}>
              ×
            </button>
          </span>
        ))}
      </div>
      <div data-filteractions="">
        {resultCount !== undefined && <span data-filtercount="">{resultCount} result{resultCount === 1 ? '' : 's'}</span>}
        <button type="button" data-filterclear="" onClick={() => onClearAll?.()}>
          Clear all
        </button>
      </div>
    </div>
  );
}
