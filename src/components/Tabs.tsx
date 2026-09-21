import { useRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import './Tabs.css';

export interface TabItem {
  id: string;
  label: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onTabChange: (id: string) => void;
  /** Panel content for the active tab. */
  children?: ReactNode;
  label?: string;
  className?: string;
}

/** Controlled tab strip with arrow-key navigation. Content renders in an associated tabpanel. */
export function Tabs({ tabs, activeId, onTabChange, children, label = 'Sections', className = '' }: TabsProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const enabledIds = tabs.filter((t) => !t.disabled).map((t) => t.id);

  const move = (fromId: string, delta: 1 | -1) => {
    const idx = enabledIds.indexOf(fromId);
    if (idx === -1) return;
    const next = enabledIds[(idx + delta + enabledIds.length) % enabledIds.length]!;
    onTabChange(next);
    listRef.current?.querySelector<HTMLElement>(`[data-tabid="${CSS.escape(next)}"]`)?.focus();
  };

  const onKeyDown = (e: KeyboardEvent, id: string) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      move(id, 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      move(id, -1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      if (enabledIds[0]) onTabChange(enabledIds[0]);
    } else if (e.key === 'End') {
      e.preventDefault();
      const last = enabledIds[enabledIds.length - 1];
      if (last) onTabChange(last);
    }
  };

  return (
    <div className={className} data-tabs="">
      <div ref={listRef} role="tablist" aria-label={label} data-tablist="">
        {tabs.map((tab) => {
          const selected = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              data-tabid={tab.id}
              data-selected={selected ? '' : undefined}
              aria-selected={selected}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => onTabChange(tab.id)}
              onKeyDown={(e) => onKeyDown(e, tab.id)}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && <span data-tabbadge="">{tab.badge}</span>}
            </button>
          );
        })}
      </div>
      {children && (
        <div role="tabpanel" id={`tabpanel-${activeId}`} aria-labelledby={`tab-${activeId}`} data-tabpanel="" tabIndex={0}>
          {children}
        </div>
      )}
    </div>
  );
}
