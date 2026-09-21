import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import './DropdownMenu.css';

export interface MenuItem {
  id: string;
  label: ReactNode;
  hint?: string;
  danger?: boolean;
  disabled?: boolean;
}

export interface MenuSection {
  title?: string;
  items: MenuItem[];
}

export interface DropdownMenuProps {
  /** Trigger element (usually a Button). */
  trigger: ReactNode;
  sections: MenuSection[];
  onPick?: (id: string) => void;
  /** Checkbox-style toggle items; omitted ids render as plain actions. */
  checkedIds?: string[];
  onToggle?: (id: string, next: boolean) => void;
  label?: string;
  align?: 'left' | 'right';
  className?: string;
}

/** Anchored menu: actions, sections, and checkbox items. Closes on select / outside / Escape. */
export function DropdownMenu({ trigger, sections, onPick, checkedIds, onToggle, label = 'Menu', align = 'left', className = '' }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open ]);

  const fire = (item: MenuItem) => {
    if (item.disabled) return;
    if (checkedIds && onToggle) {
      onToggle(item.id, !checkedIds.includes(item.id));
    } else {
      onPick?.(item.id);
      setOpen(false);
    }
  };

  return (
    <div className={className} data-dropdown="" ref={wrapRef}>
      <span data-dropdowntrigger="" onClick={() => setOpen((o) => !o)}>
        {trigger}
      </span>
      {open && (
        <div data-menupop="" data-align={align} role="menu" aria-label={label}>
          {sections.map((sec, si) => (
            <div key={si} data-menusection="">
              {sec.title && <div data-menutitle="">{sec.title}</div>}
              {sec.items.map((item) => {
                const checked = checkedIds?.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    role={checkedIds ? 'menuitemcheckbox' : 'menuitem'}
                    aria-checked={checkedIds ? !!checked : undefined}
                    data-menuitem=""
                    data-danger={item.danger ? '' : undefined}
                    disabled={item.disabled}
                    onClick={() => fire(item)}
                  >
                    {checkedIds && (
                      <span data-menucheck="" aria-hidden="true">
                        {checked ? '✓' : ''}
                      </span>
                    )}
                    <span data-menulabel="">{item.label}</span>
                    {item.hint && <span data-menuhint="">{item.hint}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
