import './Drawer.css';
import { useDrawer } from "./layout.shared";
import type { DrawerProps } from './layout.shared';

export function Drawer({ open, onClose, label, title, actions, children, size = 'md', dismissOnScrimClick = true, dismissOnEscape = true, className = '' }: DrawerProps) {
  const { panelRef } = useDrawer(open, dismissOnEscape, onClose);
  if (!open) return null;
  return (
    <div data-drawerscrim="" onClick={() => dismissOnScrimClick && onClose()}>
      <div ref={panelRef} className={className} data-drawer="" data-size={size} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} onClick={(e) => e.stopPropagation()}>
        {(title || actions) && (
          <div data-drawerhead="">
            <h2 data-drawertitle="">{title}</h2>
            <div data-drawerheadactions="">{actions}<button type="button" data-drawerclose="" aria-label={`Close ${typeof title === 'string' ? title : label}`} onClick={onClose}><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg></button></div>
          </div>
        )}
        <div data-drawerbody="">{children}</div>
      </div>
    </div>
  );
}
export type { DrawerSize, DrawerProps } from './layout.shared';
