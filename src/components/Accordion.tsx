import { useState } from 'react';
import type { ReactNode } from 'react';
import './Accordion.css';

export interface AccordionItem {
  id: string;
  title: ReactNode;
  badge?: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Open on mount. Uncontrolled after that. */
  defaultOpenIds?: string[];
  /** Allow several sections open at once. Default false (single-open). */
  allowMultiple?: boolean;
  className?: string;
}

/** Stacked disclosure sections for source lists, department groups, and FAQs. */
export function Accordion({ items, defaultOpenIds = [], allowMultiple = false, className = '' }: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return allowMultiple ? [...prev, id] : [id];
    });
  };

  return (
    <div className={className} data-accordion="">
      {items.map((item) => {
        const open = openIds.includes(item.id);
        return (
          <div key={item.id} data-accitem="" data-open={open ? '' : undefined}>
            <h3 data-acchead="">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`acc-panel-${item.id}`}
                id={`acc-button-${item.id}`}
                disabled={item.disabled}
                onClick={() => toggle(item.id)}
              >
                <span data-acctitle="">{item.title}</span>
                {item.badge !== undefined && <span data-accbadge="">{item.badge}</span>}
                <svg data-accicon="" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 4.5l3 3 3-3" />
                </svg>
              </button>
            </h3>
            <div
              role="region"
              id={`acc-panel-${item.id}`}
              aria-labelledby={`acc-button-${item.id}`}
              data-accpanel=""
              hidden={!open}
            >
              {open && item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
