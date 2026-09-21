import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import './Drawer.css';

export type DrawerSize = 'sm' | 'md' | 'lg';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name. */
  label: string;
  title?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  size?: DrawerSize;
  dismissOnScrimClick?: boolean;
  dismissOnEscape?: boolean;
  className?: string;
}

const FOCUSABLE = "a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex='-1'])";

/** Right-side slide-over with scrim, Escape, and focus trap. For drill-downs and inspectors. */
export function Drawer({
  open,
  onClose,
  label,
  title,
  actions,
  children,
  size = 'md',
  dismissOnScrimClick = true,
  dismissOnEscape = true,
  className = '',
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const prevFocus = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    prevFocus.current = document.activeElement;
    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panel)?.focus();
    return () => {
      if (prevFocus.current && 'focus' in prevFocus.current) {
        (prevFocus.current as HTMLElement).focus?.();
      }
    };
  }, [open ]);

  useEffect(() => {
    if (!open || !dismissOnEscape) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      } else if (e.key === 'Tab' && panelRef.current) {
        const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((x) => x.offsetParent !== null);
        if (items.length === 0) return;
        const first = items[0]!;
        const last = items[items.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open, dismissOnEscape, onClose]);

  if (!open) return null;

  return (
    <div data-drawerscrim="" onClick={() => dismissOnScrimClick && onClose()}>
      <div
        ref={panelRef}
        className={className}
        data-drawer=""
        data-size={size}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || actions) && (
          <div data-drawerhead="">
            <h2 data-drawertitle="">{title}</h2>
            <div data-drawerheadactions="">
              {actions}
              <button type="button" data-drawerclose="" aria-label={`Close ${typeof title === 'string' ? title : label}`} onClick={onClose}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>
          </div>
        )}
        <div data-drawerbody="">{children}</div>
      </div>
    </div>
  );
}
