import './Tabs.css';
import { useTabs } from "./layout.shared";
import type { TabsProps } from './layout.shared';

export function Tabs({ tabs, activeId, onTabChange, children, label = 'Sections', className = '' }: TabsProps) {
  const { listRef, onKeyDown } = useTabs(tabs, onTabChange);
  return (
    <div className={className} data-tabs="">
      <div ref={listRef} role="tablist" aria-label={label} data-tablist="">
        {tabs.map((tab) => {
          const selected = tab.id === activeId;
          return <button key={tab.id} type="button" role="tab" data-tabid={tab.id} data-selected={selected ? '' : undefined} aria-selected={selected} aria-controls={children && selected ? `tabpanel-${tab.id}` : undefined} id={`tab-${tab.id}`} tabIndex={selected ? 0 : -1} disabled={tab.disabled} onClick={() => onTabChange(tab.id)} onKeyDown={(e) => onKeyDown(e, tab.id)}><span>{tab.label}</span>{tab.badge !== undefined && <span data-tabbadge="">{tab.badge}</span>}</button>;
        })}
      </div>
      {children && <div role="tabpanel" id={`tabpanel-${activeId}`} aria-labelledby={`tab-${activeId}`} data-tabpanel="" tabIndex={0}>{children}</div>}
    </div>
  );
}
export type { TabItem, TabsProps } from './layout.shared';
