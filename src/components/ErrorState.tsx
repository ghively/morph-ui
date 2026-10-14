import type { ReactNode } from 'react';
import './ErrorState.css';

export interface ErrorStateProps {
  /** Short human title, e.g. "Couldn't load the dashboard". */
  title: ReactNode;
  /** One or two sentences a person can act on. */
  children?: ReactNode;
  /** Primary recovery action (usually a Retry button). */
  action?: ReactNode;
  /** Secondary action, e.g. a status-page link. */
  secondaryAction?: ReactNode;
  /** Verbatim details — an error message, stack frame or request id. Rendered in a mono block. */
  details?: string;
  /** Caption for the details block. Default "Details". */
  detailsLabel?: string;
  /** Small mono tag shown by the heading, e.g. "500" or "ECONNREFUSED". */
  code?: string;
  /** Accessible role. Default 'alert'. */
  role?: 'alert' | 'status';
  className?: string;
}

/**
 * Friendly failure panel: what broke, what to do, and a collapsible code block
 * with the verbatim details for debugging. Pairs with EmptyState (nothing yet)
 * and AlertBanner (inline notice). Provenance: original morph-ui design (2026-10).
 */
export function ErrorState({
  title,
  children,
  action,
  secondaryAction,
  details,
  detailsLabel = 'Details',
  code,
  role = 'alert',
  className = '',
}: ErrorStateProps) {
  return (
    <div className={className} data-errorstate="" role={role}>
      <div data-errhead="">
        <span data-errmark="" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2.5L18.5 17.5H1.5L10 2.5z" />
            <path d="M10 7.5v4.5" />
            <circle cx="10" cy="14.6" r="0.4" fill="currentColor" stroke="none" />
          </svg>
        </span>
        <div data-errtitles="">
          <h3 data-errtitle="">{title}</h3>
          {children && <p data-errbody="">{children}</p>}
        </div>
        {code && <span data-errcode="">{code}</span>}
      </div>
      {(action || secondaryAction) && (
        <div data-erractions="">
          {action}
          {secondaryAction}
        </div>
      )}
      {details && (
        <details data-errdetails="">
          <summary>{detailsLabel}</summary>
          <pre data-errpre="">
            <code>{details}</code>
          </pre>
        </details>
      )}
    </div>
  );
}
