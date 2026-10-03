import './FilterBar.css';
import { useFilterBar, plural, type FilterBarProps } from './forms.shared';

/** Active-filter chip row with remove, clear-all, and result count. */
export function FilterBar(props: FilterBarProps) {
  const f = useFilterBar(props);
  const { filters, onClearAll, resultCount, className = '' } = props;
  if (filters.length === 0) {
    return (
      <div className={className} data-filterbar="" data-empty="">
        <span data-filternone="">No filters — showing everything{resultCount !== undefined ? ' (' + resultCount.toLocaleString('en-US') + ')' : ''}.</span>
      </div>
    );
  }
  return (
    <div className={className} data-filterbar="">
      <div data-filterchips="" role="group" aria-label="Active filters" ref={f.rowRef} onKeyDown={f.onKeyDown}>
        {filters.map((x, i) => (
          <span key={x.id} data-filterchip="">
            {x.label}
            <button type="button" aria-label={'Remove filter ' + x.label} onClick={() => f.remove(x.id, i)}>×</button>
          </span>
        ))}
      </div>
      <div data-filteractions="">
        {resultCount !== undefined && <span data-filtercount="" aria-live="polite">{plural(resultCount, 'result')}</span>}
        <button type="button" data-filterclear="" onClick={() => onClearAll?.()}>Clear all</button>
      </div>
    </div>
  );
}

export type { ActiveFilter, FilterBarProps } from './forms.shared';
