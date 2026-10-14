import './SectionOutline.css';
import { useState } from 'react';

export interface OutlineSection {
  id: string;
  title: string;
  /** Nesting depth; 0 = top level. */
  level?: number;
}

export interface SectionOutlineProps {
  sections: OutlineSection[];
  /** Id of the section currently in view. */
  activeId?: string;
  onSelect?: (id: string) => void;
  /** Start collapsed. */
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  label?: string;
  className?: string;
}

/**
 * Collapsible document outline (TOC) synced to headings. The active section
 * carries a highlight; entries indent by heading level. Collapsing animates
 * with the grid-rows 0fr → 1fr technique.
 */
export function SectionOutline({
  sections,
  activeId,
  onSelect,
  defaultCollapsed = false,
  collapsed: collapsedProp,
  onCollapsedChange,
  label = 'Outline',
  className = '',
}: SectionOutlineProps) {
  const [innerCollapsed, setInnerCollapsed] = useState(defaultCollapsed);
  const collapsed = collapsedProp ?? innerCollapsed;
  const toggle = () => {
    const v = !collapsed;
    if (collapsedProp === undefined) setInnerCollapsed(v);
    onCollapsedChange?.(v);
  };
  const active = activeId ?? sections[0]?.id;

  return (
    <nav className={`cv-outline ${className}`} data-section-outline="" aria-label={label}>
      <button
        type="button"
        className="cv-outline-head"
        data-outline-toggle=""
        aria-expanded={!collapsed}
        aria-controls="cv-outline-list"
        onClick={toggle}
      >
        <span className="cv-outline-title">{label}</span>
        <span className="cv-outline-count" data-outline-count="">{sections.length}</span>
        <svg
          className="cv-outline-chevron"
          viewBox="0 0 12 12"
          width="10"
          height="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M2 4l4 4 4-4" />
        </svg>
      </button>
      <div className={`cv-outline-wrap ${collapsed ? 'is-collapsed' : ''}`} id="cv-outline-list">
        <ul className="cv-outline-list">
          {sections.map((s) => {
            const on = s.id === active;
            const level = Math.max(0, s.level ?? 0);
            return (
              <li key={s.id} data-level={level} data-active={on ? 'true' : 'false'}>
                <button
                  type="button"
                  className="cv-outline-item"
                  data-outline-item={s.id}
                  aria-current={on ? 'true' : undefined}
                  style={{ ['--cv-level' as string]: level }}
                  onClick={() => onSelect?.(s.id)}
                >
                  {on && <i className="cv-outline-active-bar" aria-hidden="true" />}
                  <span className="cv-outline-item-title">{s.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
