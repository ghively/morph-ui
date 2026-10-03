import './Combobox.css';
import { useCombobox, Match, type ComboboxProps } from './forms.shared';

/** Searchable single-select with typeahead. Controlled; clears to null. */
export function Combobox(props: ComboboxProps) {
  const c = useCombobox(props);
  const { id, label, value, placeholder = 'Search…', searching, disabled, className = '' } = props;
  return (
    <div className={className} data-combobox="" data-open={c.open ? '' : undefined} ref={c.wrapRef}>
      {label && <label htmlFor={id}>{label}</label>}
      <div data-combofield="">
        <input id={id} role="combobox" aria-expanded={c.open} aria-controls={c.listId} aria-autocomplete="list" aria-activedescendant={c.activeId} autoComplete="off"
          value={c.open ? c.query : c.selected?.label ?? ''} placeholder={placeholder} disabled={disabled}
          onChange={e => c.setQuery(e.target.value)} onFocus={c.show} onClick={c.show} onKeyDown={c.onKeyDown} />
        {(c.selected || c.query) && !disabled && <button type="button" data-comboclear="" aria-label="Clear selection" onClick={() => c.commit(null)}>×</button>}
      </div>
      {c.open && (
        <ul data-combolist="" id={c.listId} ref={c.listRef} role="listbox" aria-label={typeof label === 'string' ? label : 'Options'} aria-busy={searching || undefined}>
          {searching && <li data-comboempty="" data-searching=""><i aria-hidden="true" />Searching…</li>}
          {!searching && c.filtered.length === 0 && <li data-comboempty="">No matches.</li>}
          {!searching && c.filtered.map((o, i) => (
            <li key={o.value} id={c.optId(i)} role="option" aria-selected={o.value === value} data-combooption="" data-active={i === c.active ? '' : undefined}
              onMouseDown={e => { e.preventDefault(); c.commit(o.value); }} onMouseEnter={() => c.setActive(i)}>
              <span><Match text={o.label} query={c.typed ? c.query : ''} /></span>
              {o.hint && <span data-combohint="">{o.hint}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export type { ComboboxOption, ComboboxProps } from './forms.shared';
