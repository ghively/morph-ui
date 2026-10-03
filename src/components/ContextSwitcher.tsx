import { useState, useRef, useEffect, type KeyboardEvent, type CSSProperties } from 'react';
import './ContextSwitcher.css';

export type ContextOption = string | { value: string; label?: string; description?: string; meta?: string };

export interface ContextSwitcherProps {
  current: string;
  options: ContextOption[];
  onChange?: (value: string) => void;
  /** Eyebrow above the current value. */
  label?: string;
}

const norm = (opts: ContextOption[]) => opts.map(o => (typeof o === 'string' ? { value: o, label: o } : { ...o, label: o.label || o.value }));

export function ContextSwitcher({ current, options, onChange, label = 'Context' }: ContextSwitcherProps) {
  const opts = norm(options);
  const curIdx = Math.max(0, opts.findIndex(o => o.value === current));
  const cur = opts[curIdx];
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(curIdx);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const away = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', away);
    return () => document.removeEventListener('mousedown', away);
  }, []);

  const choose = (i: number) => { onChange?.(opts[i].value); setOpen(false); };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) { setOpen(true); setHi(curIdx); return; }
      setHi(h => (h + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length);
    }
    if ((e.key === 'Enter' || e.key === ' ') && open) { e.preventDefault(); choose(hi); }
  };
  const tone = (i: number) => ({ ['--tc' as string]: `var(--series-${(i % 6) + 1})` } as CSSProperties);

  return (
    <div className={`context-switcher ${open ? 'is-open' : ''}`} ref={ref} onKeyDown={onKey}>
      <button type="button" className="context-switcher-trig" aria-haspopup="listbox" aria-expanded={open} onClick={() => { setHi(curIdx); setOpen(!open); }}>
        <span className="context-switcher-tile" style={tone(curIdx)}>{cur?.label.charAt(0)}</span>
        <span className="context-switcher-tt"><span className="context-switcher-k">{label}</span><span className="context-switcher-v">{cur?.label}</span></span>
        <svg className="context-switcher-ud" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 10l4-4 4 4M8 14l4 4 4-4" /></svg>
      </button>
      <div className="context-switcher-menu" role="listbox" aria-hidden={!open}>
        {opts.map((o, i) => (
          <div key={o.value} role="option" aria-selected={i === curIdx}
            className={`context-switcher-it ${i === hi ? 'is-hi' : ''} ${i === curIdx ? 'is-sel' : ''}`}
            onMouseEnter={() => setHi(i)} onClick={() => choose(i)}>
            <span className="context-switcher-tile is-sm" style={tone(i)}>{o.label.charAt(0)}</span>
            <span className="context-switcher-tt">
              <span className="context-switcher-v">{o.label}</span>
              {o.description && <span className="context-switcher-d">{o.description}</span>}
            </span>
            {i === curIdx && <svg className="context-switcher-check" viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 12.5l4.2 4.2L18.5 8" /></svg>}
          </div>
        ))}
      </div>
    </div>
  );
}
