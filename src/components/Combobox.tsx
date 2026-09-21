import { useEffect, useId, useRef, useState } from 'react';
import './Combobox.css';

export interface ComboboxOption {
  value: string;
  label: string;
  hint?: string;
}

export interface ComboboxProps {
  id: string;
  label?: string;
  options: ComboboxOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  /** Async search hook; when set, typing calls it instead of local filtering. */
  onSearch?: (query: string) => void;
  searching?: boolean;
  disabled?: boolean;
  className?: string;
}

/** Searchable single-select with typeahead. Controlled; clears to null. */
export function Combobox({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = 'Search…',
  onSearch,
  searching,
  disabled,
  className = '',
}: ComboboxProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) ?? null;
  const filtered = onSearch ? options : options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open ]);

  useEffect(() => setActive(0), [query, open]);

  const commit = (v: string | null) => {
    onChange(v);
    const opt = options.find((o) => o.value === v);
    setQuery(opt ? opt.label : '');
    setOpen(false);
  };

  return (
    <div className={className} data-combobox="" ref={wrapRef}>
      {label && <label htmlFor={id}>{label}</label>}
      <div data-combofield="">
        <input
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && filtered[active] ? `${listId}-${filtered[active]!.value}` : undefined}
          value={open ? query : (selected?.label ?? '')}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            onSearch?.(e.target.value);
          }}
          onFocus={() => {
            setQuery(selected?.label ?? '');
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setOpen(true);
              setActive((a) => Math.min(filtered.length - 1, a + 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((a) => Math.max(0, a - 1));
            } else if (e.key === 'Enter') {
              const opt = filtered[active];
              if (open && opt) {
                e.preventDefault();
                commit(opt.value);
              }
            } else if (e.key === 'Escape') {
              setOpen(false);
            }
          }}
        />
        {(selected || query) && !disabled && (
          <button type="button" data-comboclear="" aria-label="Clear selection" onClick={() => commit(null)}>
            ×
          </button>
        )}
      </div>
      {open && (
        <ul data-combolist="" id={listId} role="listbox" aria-label={typeof label === 'string' ? label : 'Options'}>
          {searching && <li data-comboempty="">Searching…</li>}
          {!searching && filtered.length === 0 && <li data-comboempty="">No matches.</li>}
          {!searching &&
            filtered.map((o, i) => (
              <li
                key={o.value}
                id={`${listId}-${o.value}`}
                role="option"
                aria-selected={o.value === value}
                data-combooption=""
                data-active={i === active ? '' : undefined}
                onMouseDown={(e) => {
                  e.preventDefault();
                  commit(o.value);
                }}
                onMouseEnter={() => setActive(i)}
              >
                <span>{o.label}</span>
                {o.hint && <span data-combohint="">{o.hint}</span>}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
