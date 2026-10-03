import './MultiSelect.css';
import { useMultiSelect, Match, type MultiSelectProps } from './forms.shared';

/** Chip-style multi picker with typeahead, per-chip remove, and clear-all. */
export function MultiSelect(props: MultiSelectProps) {
  const m = useMultiSelect(props);
  const { id, label, values, onChange, placeholder = 'Add…', disabled, className = '' } = props;
  return (
    <div className={className} data-multiselect="" ref={m.wrapRef}>
      {label && <label htmlFor={id}>{label}</label>}
      <div data-msbox="" data-open={m.open ? '' : undefined} data-disabled={disabled ? '' : undefined} onClick={m.openBox}>
        {values.map(v => (
          <span key={v} data-mschip="">
            {m.labelOf(v)}
            <button type="button" aria-label={'Remove ' + m.labelOf(v)} disabled={disabled} onClick={e => { e.stopPropagation(); m.remove(v); }}>×</button>
          </span>
        ))}
        <input id={id} ref={m.inputRef} value={m.query} disabled={disabled} placeholder={values.length === 0 ? placeholder : ''} autoComplete="off"
          role="combobox" aria-expanded={m.open} aria-controls={m.listId} aria-autocomplete="list" aria-activedescendant={m.activeId}
          aria-label={typeof label === 'string' ? label + ' search' : 'Search options'}
          onChange={e => m.setQuery(e.target.value)} onFocus={() => m.setOpen(true)} onKeyDown={m.onKeyDown} />
        {values.length > 0 && !disabled && <button type="button" data-msclear="" onClick={e => { e.stopPropagation(); onChange([]); }}>Clear all</button>}
      </div>
      {m.open && (
        <ul data-mslist="" id={m.listId} ref={m.listRef} role="listbox" aria-label={typeof label === 'string' ? label : 'Options'} aria-multiselectable="true">
          {m.filtered.length === 0 && <li data-msempty="">{m.query ? 'No matches.' : 'All options selected.'}</li>}
          {m.filtered.map((o, i) => (
            <li key={o.value} id={m.optId(i)} role="option" aria-selected="false" data-msoption="" data-active={i === m.active ? '' : undefined}
              onMouseDown={e => { e.preventDefault(); m.add(o.value); }} onMouseEnter={() => m.setActive(i)}>
              <Match text={o.label} query={m.query} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export type { MultiSelectOption, MultiSelectProps } from './forms.shared';
