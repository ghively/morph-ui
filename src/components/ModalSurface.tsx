import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import './ModalSurface.css';

export type ModalPlacement = 'bottom-sheet' | 'center' | 'top-drawer';

export interface ModalSurfaceTab {
  id: string;
  label: string;
}

export interface ModalSurfaceProps {
  /** Accessible name for the dialog. */
  label: string;
  onClose: () => void;
  children: ReactNode;
  placement?: ModalPlacement;              // default 'bottom-sheet'
  width?: number;                           // default 600
  height?: number | string;                 // Dashboard uses '78vh'
  /** Renders the `SheetHead` title bar with a close button. */
  title?: string;
  /** Tab strip in the head (top-drawer usage). Omit for no tabs. */
  tabs?: ModalSurfaceTab[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
  /** Click on the scrim closes. Default true. */
  dismissOnScrimClick?: boolean;
  /** Escape closes. Default true. */
  dismissOnEscape?: boolean;
  className?: string;
}

function GlyphIcon({ name }: { name: string }) {
  if (name === 'close') {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <path d="M4 4l8 8M12 4l-8 8" />
      </svg>
    );
  }
  return null;
}

const FOCUSABLE_SELECTOR = "a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex='-1'])";

export function ModalSurface({
  label,
  onClose,
  children,
  placement = 'bottom-sheet',
  width = 600,
  height,
  title,
  tabs,
  activeTab,
  onTabChange,
  dismissOnScrimClick = true,
  dismissOnEscape = true,
  className = '',
}: ModalSurfaceProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<Element | null>(null);

  // Focus restore & auto-focus
  useEffect(() => {
    prevFocusRef.current = document.activeElement;
    if (panelRef.current) {
      const firstFocusable = panelRef.current.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      if (firstFocusable) {
        firstFocusable.focus();
      } else {
        panelRef.current.focus();
      }
    }
    
    return () => {
      if (prevFocusRef.current && 'focus' in prevFocusRef.current) {
        (prevFocusRef.current as HTMLElement).focus?.();
      }
    };
  }, []);

  // Escape key handler (capture phase on document)
  // Dashboard's Escape was a plain window listener, but unifying on capture phase 
  // is strictly stronger to prevent under-layers from reacting.
  useEffect(() => {
    if (!dismissOnEscape) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [dismissOnEscape, onClose]);

  // Tab trap handler
  useEffect(() => {
    const onTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panelRef.current) return;
      
      const focusableElements = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter(x => x.offsetParent !== null);
      
      if (focusableElements.length === 0) return;

      const first = focusableElements[0]!;
      const last = focusableElements[focusableElements.length - 1]!;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    
    document.addEventListener('keydown', onTabKey);
    return () => document.removeEventListener('keydown', onTabKey);
  }, []);

  let scrimAlign = 'flex-end';
  let panelAttrs: Record<string, string> = { "data-pane": "" };
  let scrimZIndex = 80;
  let scrimSoft = false;
  let panelMarginTop = undefined;
  let panelPadding = undefined;

  if (placement === 'bottom-sheet') {
    scrimAlign = 'flex-end';
    panelAttrs = { "data-sheet": "", "data-drawer": "up", "data-pane": "" };
    panelPadding = "20px 20px calc(var(--gap) + 6px)";
  } else if (placement === 'center') {
    scrimAlign = 'center';
    panelAttrs = { "data-sheet": "", "data-drawer": "up", "data-pane": "" };
  } else if (placement === 'top-drawer') {
    scrimAlign = 'flex-start';
    panelAttrs = { "data-sheet": "", "data-drawer": "down", "data-drawerpanel": "", "data-pane": "" };
    scrimZIndex = 75;
    scrimSoft = true;
    panelMarginTop = "var(--gap)";
  }

  const handleScrimClick = () => {
    if (dismissOnScrimClick) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-surface-scrim" 
      data-scrim="" 
      data-soft={scrimSoft}
      style={{ alignItems: scrimAlign, zIndex: scrimZIndex }}
      onClick={handleScrimClick}
    >
      <div 
        ref={panelRef}
        className={`modal-surface-panel ${className}`}
        {...panelAttrs}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        style={{ 
          width, 
          maxWidth: "100%", 
          height, 
          maxHeight: "100%", 
          display: "flex", 
          flexDirection: "column",
          marginTop: panelMarginTop,
          padding: panelPadding
        }}
      >
        {title && (
          <div className="modal-surface-head">
            <h2 className="modal-surface-title">{title}</h2>
            <button type="button" data-iconbtn="" data-push="" aria-label={`Close ${title}`} onClick={onClose}>
              <GlyphIcon name="close" />
            </button>
          </div>
        )}
        
        {tabs && (
          <div className="modal-surface-head">
            <div data-tabstrip="" role="tablist" aria-label={label}>
              {tabs.map((tab) => (
                <button 
                  key={tab.id} 
                  type="button" 
                  data-tab="" 
                  role="tab" 
                  aria-selected={activeTab === tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button type="button" data-iconbtn="" data-push="" aria-label="Close" onClick={onClose}>
              <GlyphIcon name="close" />
            </button>
          </div>
        )}
        
        <div role={tabs ? "tabpanel" : undefined} style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
