import { useEffect, useRef, useState } from 'react';
import './MultiSelect.css';

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  id: string;
  label?: string;
  options: MultiSelectOption[];
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/** Chip-style multi picker with typeahead, per-chip remove, and clear-all. */
export function MultiSelect({
  id,
  label,
  options,
  values,
  onChange,
  placeholder = 'Add…',
  disabled,
  className = '',
}: MultiSelectProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const selected = new Set(values);
  const filtered = options.filter((o) => !selected.has(o.value) && o.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open ]);

  const add = (v: string) => {
    onChange([...values, v]);
    setQuery('');
  };
  const remove = (v: string) => onChange(values.filter((x) => x !== v));
  const labelOf = (v: string) => options.find((o) => o.value === v)?.label ?? v;

  return (
    <div className={className} data-multiselect="" ref={wrapRef}>
      {label && <label htmlFor={id}>{label}</label>}
      <div data-msbox="" data-open={open ? '' : undefined} onClick={() => !disabled && setOpen(true)}>
        {values.map((v) => (
          <span key={v} data-mschip="">
            {labelOf(v)}
            <button type="button" aria-label={`Remove ${labelOf(v)}`} disabled={disabled} onClick={(e) => { e.stopPropagation(); remove(v); }}>
              ×
            </button>
          </span>
        ))}
        <input
          id={id}
          value={query}
          disabled={disabled}
          placeholder={values.length === 0 ? placeholder : ''}
          aria-expanded={open}
          aria-label={typeof label === 'string' ? `${label} search` : 'Search options'}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && query === '' && values.length > 0) {
              remove(values[values.length - 1]!);
            } else if (e.key === 'Escape') {
              setOpen(false);
            } else if (e.key === 'Enter' && filtered[0]) {
              e.preventDefault();
              add(filtered[0].value);
            }
          }}
        />
        {values.length > 0 && !disabled && (
          <button type="button" data-msclear="" onClick={(e) => { e.stopPropagation(); onChange([]); }}>
            Clear all
          </button>
        )}
      </div>
      {open && (
        <ul data-mslist="" role="listbox" aria-label={typeof label === 'string' ? label : 'Options'}>
          {filtered.length === 0 && <li data-msempty="">{query ? 'No matches.' : 'All options selected.'}</li>}
          {filtered.map((o) => (
            <li
              key={o.value}
              role="option"
              aria-selected="false"
              data-msoption=""
              onMouseDown={(e) => {
                e.preventDefault();
                add(o.value);
              }}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
