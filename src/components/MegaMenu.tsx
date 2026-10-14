import React, { type ReactNode } from 'react';
import './MegaMenu.css';
export interface MegaMenuLink { id: string; label: ReactNode; href?: string; description?: ReactNode; onSelect?: () => void; disabled?: boolean; }
export interface MegaMenuSection { id: string; label: ReactNode; links: MegaMenuLink[]; }
export interface MegaMenuProps { label: ReactNode; sections: MegaMenuSection[]; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; className?: string; }
export function MegaMenu({ label, sections, open: controlled, defaultOpen = false, onOpenChange, className = '' }: MegaMenuProps) {
  const [internal, setInternal] = React.useState(defaultOpen);
  const open = controlled ?? internal;
  const setOpen = (next: boolean) => { if (controlled === undefined) setInternal(next); onOpenChange?.(next); };
  return <div className={`mega-menu ${className}`} data-mega-menu="" onMouseLeave={() => setOpen(false)}>
    <button type="button" data-mega-trigger="" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen(!open)}>{label}<span aria-hidden="true" data-mega-chevron="">⌄</span></button>
    {open && <div data-mega-panel="">
      {sections.map((s) => <h3 key={s.id} data-mega-section-label="">{s.label}</h3>)}
      <div role="menu" aria-label={`${String(label)} menu`} data-mega-menu-list="">
        {sections.flatMap((s) => s.links).map((l) => <a key={l.id} role="menuitem" aria-disabled={l.disabled || undefined} href={l.href ?? '#'} onClick={(e) => { if (l.disabled || !l.href) e.preventDefault(); l.onSelect?.(); }}>{l.label}{l.description && <small>{l.description}</small>}</a>)}
      </div>
    </div>}
  </div>;
}
