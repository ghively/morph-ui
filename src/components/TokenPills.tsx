import { useRef, type KeyboardEvent } from 'react';
import './TokenPills.css';

export interface TokenPillOption {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface TokenPillsProps {
  options: TokenPillOption[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  multiSelect?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function TokenPills({ options, selectedIds, onChange, multiSelect = true, className = '', ariaLabel = 'Select options' }: TokenPillsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const toggle = (id: string) => {
    if (multiSelect) onChange(selectedIds.includes(id) ? selectedIds.filter(s => s !== id) : [...selectedIds, id]);
    else onChange([id]);
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, opt: TokenPillOption, i: number) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!opt.disabled) toggle(opt.id); return; }
    const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    ref.current?.querySelectorAll<HTMLButtonElement>('button')[(i + step + options.length) % options.length]?.focus();
  };
  const focusIdx = Math.max(0, options.findIndex(o => selectedIds.includes(o.id)));

  return (
    <div ref={ref} className={`token-pills ${className}`.trim()} role="group" aria-label={ariaLabel}>
      {options.map((o, i) => {
        const on = selectedIds.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            className={`token-pill ${on ? 'is-on' : ''}`}
            data-on={on ? 'true' : undefined}
            aria-pressed={on}
            disabled={o.disabled}
            tabIndex={i === focusIdx ? 0 : -1}
            onClick={() => toggle(o.id)}
            onKeyDown={e => onKey(e, o, i)}
          >
            <span className="token-pill-check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 12.5l4.2 4.2L18.5 8" /></svg></span>
            <span>{o.label}</span>
            {o.count != null && <span className="token-pill-count">{o.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
