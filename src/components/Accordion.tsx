import './Accordion.css';
import { useAccordion, Chevron, type AccordionProps } from './forms.shared';

/** Stacked disclosure sections for source lists, department groups, and FAQs. */
export function Accordion(props: AccordionProps) {
  const a = useAccordion(props);
  const { items, className = '' } = props;
  return (
    <div className={className} data-accordion="" onKeyDown={a.onKeyDown}>
      {items.map(item => {
        const open = a.isOpen(item.id);
        return (
          <div key={item.id} data-accitem="" data-open={open ? '' : undefined}>
            <h3 data-acchead="">
              <button type="button" aria-expanded={open} aria-controls={'acc-panel-' + item.id} id={'acc-button-' + item.id} disabled={item.disabled} onClick={() => a.toggle(item.id)}>
                <span data-acctitle="">{item.title}</span>
                {item.badge !== undefined && <span data-accbadge="">{item.badge}</span>}
                <Chevron data-accicon="" />
              </button>
            </h3>
            <div role="region" id={'acc-panel-' + item.id} aria-labelledby={'acc-button-' + item.id} data-accpanel="" hidden={!open}>
              {open && item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export type { AccordionItem, AccordionProps } from './forms.shared';
