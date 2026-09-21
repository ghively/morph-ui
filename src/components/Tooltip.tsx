import type { ReactNode } from 'react';
import './Tooltip.css';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** Tooltip text. Keep it short — a phrase, not a paragraph. */
  content: ReactNode;
  children: ReactNode;
  placement?: TooltipPlacement;
  className?: string;
}

/**
 * CSS-only tooltip on hover and keyboard focus.
 * The trigger must be focusable (button, link, input) for keyboard users.
 */
export function Tooltip({ content, children, placement = 'top', className = '' }: TooltipProps) {
  return (
    <span className={className} data-tooltip="" data-tip={typeof content === 'string' ? content : undefined} data-placement={placement}>
      {children}
      {typeof content !== 'string' && (
        <span data-tipbody="" role="tooltip">
          {content}
        </span>
      )}
    </span>
  );
}
