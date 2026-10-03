import './SearchField.css';
import { useSearch, type SearchFieldProps } from './forms.shared';

/** Search input with icon, clear button, and optional submit (Enter). */
export function SearchField(props: SearchFieldProps) {
  const s = useSearch(props);
  const { id, label = 'Search', placeholder = 'Search…', disabled, className = '' } = props;
  return (
    <div className={className} data-searchfield="" data-pending={s.pending ? '' : undefined}>
      <label htmlFor={id} data-sronly="">{label}</label>
      <svg data-searchicon="" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
        <circle cx="7" cy="7" r="4.5" />
        <path d="M10.5 10.5L14 14" />
      </svg>
      <input id={id} type="search" value={s.draft} disabled={disabled} placeholder={placeholder} aria-label={label} onChange={e => s.type(e.target.value)} onKeyDown={s.onKeyDown} />
      {s.draft && !disabled && <button type="button" data-searchclear="" aria-label="Clear search" onClick={s.clear}>×</button>}
    </div>
  );
}

export type { SearchFieldProps } from './forms.shared';
