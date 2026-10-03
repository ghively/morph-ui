import { cloneElement, isValidElement, Fragment, type ReactElement } from 'react';
import './DropdownMenu.css';
import { useMenu, type DropdownMenuProps } from './forms.shared';

/** Anchored menu: actions, sections, and checkbox items. Closes on select / outside / Escape. */
export function DropdownMenu(props: DropdownMenuProps) {
  const m = useMenu(props);
  const { trigger, sections, checkedIds, label = 'Menu', align = 'left', className = '' } = props;
  const trig = isValidElement(trigger) && trigger.type !== Fragment ? cloneElement(trigger as ReactElement<Record<string, unknown>>, { 'aria-haspopup': 'menu', 'aria-expanded': m.open }) : trigger;
  return (
    <div className={className} data-dropdown="" data-open={m.open ? '' : undefined} ref={m.wrapRef}>
      <span data-dropdowntrigger="" ref={m.trigRef} onClick={m.toggle} onKeyDown={m.onTriggerKey}>{trig}</span>
      {m.open && (
        <div data-menupop="" data-align={align} role="menu" aria-label={label} ref={m.popRef} onKeyDown={m.onKeyDown}>
          {sections.map((sec, si) => (
            <div key={si} data-menusection="" role="group" aria-label={sec.title}>
              {sec.title && <div data-menutitle="" aria-hidden="true">{sec.title}</div>}
              {sec.items.map(item => {
                const checked = m.isChecked(item.id);
                return (
                  <button key={item.id} type="button" role={checkedIds ? 'menuitemcheckbox' : 'menuitem'} aria-checked={checkedIds ? checked : undefined} tabIndex={-1}
                    data-menuitem="" data-danger={item.danger ? '' : undefined} disabled={item.disabled} onClick={() => m.fire(item)}>
                    {checkedIds && <span data-menucheck="" data-on={checked ? '' : undefined} aria-hidden="true">{checked ? '✓' : ''}</span>}
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

export type { MenuItem, MenuSection, DropdownMenuProps } from './forms.shared';
