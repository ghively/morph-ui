import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode, type RefCallback } from 'react';
import './Popover.css';
import { Button } from './Button';
import { useDismiss } from './forms.shared';

export type PopoverPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

/** Props handed to `renderTrigger`; spread them onto your own focusable element. */
export interface PopoverTriggerProps {
  /** Ref the popover uses to return focus to the trigger on Escape. */
  ref: RefCallback<HTMLElement>;
  /** Toggles the panel. */
  onClick: () => void;
  'aria-haspopup': 'dialog';
  'aria-expanded': boolean;
  'aria-controls': string;
  'data-popovertrigger': '';
}

export interface PopoverProps {
  /** Content rendered inside the default library-style trigger button. Ignored when `renderTrigger` is set. */
  trigger?: ReactNode;
  /** Render a custom trigger element. Spread the given props (aria wiring, ref, onClick) onto it. */
  renderTrigger?: (props: PopoverTriggerProps) => ReactNode;
  /** Panel content: a mini form, filters, a profile card, … */
  children: ReactNode;
  /** Heading shown at the top of the panel; also labels the dialog. */
  title?: ReactNode;
  /** Accessible name for the dialog when there is no `title`. */
  label?: string;
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Initial open state when uncontrolled. Opening on mount does not move focus. */
  defaultOpen?: boolean;
  /** Called whenever the popover asks to open or close. */
  onOpenChange?: (open: boolean) => void;
  /** Side and edge of the trigger the panel anchors to. Defaults to `bottom-start`. */
  placement?: PopoverPlacement;
  /** Panel width: a number of px or any CSS length. Defaults to 280px. */
  width?: number | string;
  /** Close when the pointer goes down outside the popover. Defaults to true. */
  closeOnInteractOutside?: boolean;
  /** Extra class on the root wrapper. */
  className?: string;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

/**
 * Anchored, click-triggered popover for rich content such as filters, a mini
 * form or a profile card. The panel is a non-modal `role="dialog"` positioned
 * with CSS against the root wrapper (no portal). Opening moves focus into the
 * panel, Escape closes it and returns focus to the trigger, and a pointer down
 * outside closes it unless `closeOnInteractOutside` is false.
 *
 * Provenance: original morph-ui design (2026-10).
 */
export function Popover({
  trigger, renderTrigger, children, title, label, open: openProp, defaultOpen = false, onOpenChange,
  placement = 'bottom-start', width, closeOnInteractOutside = true, className = '',
}: PopoverProps) {
  const [inner, setInner] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : inner;
  const setOpen = useCallback((next: boolean) => { if (!controlled) setInner(next); onOpenChange?.(next); }, [controlled, onOpenChange]);

  const uid = useId();
  const panelId = 'popover-' + uid.replace(/:/g, '');
  const titleId = panelId + '-title';
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const trigEl = useRef<HTMLElement | null>(null);
  const setTrig = useCallback<RefCallback<HTMLElement>>(el => { trigEl.current = el; }, []);

  useDismiss(wrapRef, open && closeOnInteractOutside, () => setOpen(false));

  // Move focus into the panel when it opens through interaction (not on mount).
  const wasOpen = useRef(open);
  useEffect(() => {
    if (open && !wasOpen.current) {
      const p = panelRef.current;
      const first = p?.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? p)?.focus({ preventScroll: true });
    }
    wasOpen.current = open;
  }, [open]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Escape' || !open) return;
    e.preventDefault(); e.stopPropagation();
    setOpen(false);
    (trigEl.current ?? wrapRef.current?.querySelector<HTMLElement>('[data-popovertrigger]'))?.focus();
  };

  const trigProps: PopoverTriggerProps = {
    ref: setTrig, onClick: () => setOpen(!open),
    'aria-haspopup': 'dialog', 'aria-expanded': open, 'aria-controls': panelId, 'data-popovertrigger': '',
  };
  const { ref: _ref, ...ariaProps } = trigProps;
  const style = width !== undefined ? ({ '--popover-w': typeof width === 'number' ? width + 'px' : width } as CSSProperties) : undefined;

  return (
    <div className={('morph-popover ' + className).trim()} data-popover="" data-open={open ? '' : undefined} ref={wrapRef} onKeyDown={onKeyDown}>
      {renderTrigger ? renderTrigger(trigProps) : (
        // React 19 passes `ref` through as a prop; Button spreads it onto its <button>.
        <Button {...ariaProps} {...({ ref: setTrig } as object)}>{trigger}</Button>
      )}
      {open && (
        <div id={panelId} ref={panelRef} role="dialog" tabIndex={-1} data-popoverpanel="" data-placement={placement} style={style}
          aria-labelledby={title ? titleId : undefined} aria-label={title ? undefined : (label ?? 'Popover')}>
          {title && <div data-popovertitle="" id={titleId} role="heading" aria-level={2}>{title}</div>}
          <div data-popoverbody="">{children}</div>
        </div>
      )}
    </div>
  );
}
