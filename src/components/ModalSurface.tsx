import { GlyphIcon } from './GlyphIcon';
import './ModalSurface.css';
import { useModalSurface } from "./layout.shared";
import type { ModalSurfaceProps } from './layout.shared';

export function ModalSurface({ label, onClose, children, placement = 'bottom-sheet', width = 600, height, title, tabs, activeTab, onTabChange, dismissOnScrimClick = true, dismissOnEscape = true, className = '' }: ModalSurfaceProps) {
  const { panelRef } = useModalSurface(dismissOnEscape, onClose);
  let scrimAlign = 'flex-end', panelAttrs: Record<string, string> = { "data-pane": "" }, scrimZIndex = 80, scrimSoft = false, panelMarginTop = undefined, panelPadding = undefined;
  if (placement === 'bottom-sheet') { scrimAlign = 'flex-end'; panelAttrs = { "data-sheet": "", "data-drawer": "up", "data-pane": "" }; panelPadding = "20px 20px calc(var(--gap) + 6px)"; }
  // Centered dialogs are a full rounded pane, not a sheet: no squared-off bottom edge.
  else if (placement === 'center') { scrimAlign = 'center'; panelAttrs = { "data-drawer": "up", "data-pane": "" }; panelPadding = "var(--s6)"; }
  else if (placement === 'top-drawer') { scrimAlign = 'flex-start'; panelAttrs = { "data-sheet": "", "data-drawer": "down", "data-drawerpanel": "", "data-pane": "" }; scrimZIndex = 75; scrimSoft = true; panelMarginTop = "var(--gap)"; }
  return (
    <div className="modal-surface-scrim" data-scrim="" data-soft={scrimSoft} style={{ alignItems: scrimAlign, zIndex: scrimZIndex }} onClick={() => dismissOnScrimClick && onClose()}>
      <div ref={panelRef} className={`modal-surface-panel ${className}`} {...panelAttrs} role="dialog" aria-modal="true" aria-label={label} onClick={(e) => e.stopPropagation()} tabIndex={-1} style={{ width, maxWidth: "100%", height, maxHeight: "100%", display: "flex", flexDirection: "column", marginTop: panelMarginTop, padding: panelPadding }}>
        {title && <div className="modal-surface-head"><h2 className="modal-surface-title">{title}</h2><button type="button" data-iconbtn="" data-push="" aria-label={`Close ${title}`} onClick={onClose}><GlyphIcon name="close" /></button></div>}
        {tabs && <div className="modal-surface-head"><div data-tabstrip="" role="tablist" aria-label={label}>{tabs.map((tab) => <button key={tab.id} type="button" data-tab="" role="tab" aria-selected={activeTab === tab.id} onClick={() => onTabChange?.(tab.id)}>{tab.label}</button>)}</div><button type="button" data-iconbtn="" data-push="" aria-label="Close" onClick={onClose}><GlyphIcon name="close" /></button></div>}
        <div role={tabs ? "tabpanel" : undefined} style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>{children}</div>
      </div>
    </div>
  );
}
export type { ModalPlacement, ModalSurfaceTab, ModalSurfaceProps } from './layout.shared';
