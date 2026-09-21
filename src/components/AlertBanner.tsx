import type { ReactNode, CSSProperties } from 'react';
import './AlertBanner.css';

export type AlertTone = 'info' | 'warn' | 'danger';

export interface AlertBannerProps {
  tone?: AlertTone;
  /** Bolded lead sentence rendered before `children`. */
  lead?: ReactNode;
  children?: ReactNode;
  /** Pulsing dot (`data-live`). */
  live?: boolean;
  /** Hide the leading dot entirely (BrowseRooms' error banner has none). */
  dot?: boolean;
  /** Trailing meta text, e.g. a timestamp. Rendered as `[data-num][data-meta]`. */
  meta?: ReactNode;
  /** Trailing control, e.g. a Retry button. */
  action?: ReactNode;
  /** 'status' (polite, default) | 'alert' (assertive) | 'note'. */
  role?: 'status' | 'alert' | 'note';
  /** `aria-live` — default 'polite' when role==='status', otherwise omitted. */
  ariaLive?: 'polite' | 'assertive' | 'off';
  /** Entry animation flag used by the composer banner. */
  animateIn?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * System-notice labels from EventTile (for reference):
 * loop_guard -> "Loop guard"
 * depth_limit -> "Delegation limit"
 * rate_limit -> "Rate limit"
 * delivery_failed -> "Delivery failed"
 * backend_retrying -> "Agent unavailable"
 * default -> "Gateway"
 */
export function AlertBanner({
  tone = 'info',
  lead,
  children,
  live,
  dot = true,
  meta,
  action,
  role = 'status',
  ariaLive,
  animateIn,
  className = '',
  style,
}: AlertBannerProps) {
  // If role === 'status' and ariaLive is not provided, default to 'polite'
  let effectiveAriaLive = ariaLive;
  if (!effectiveAriaLive && role === 'status') {
    effectiveAriaLive = 'polite';
  }

  return (
    <div
      data-alert=""
      data-tone={tone === 'info' ? undefined : tone}
      role={role}
      aria-live={effectiveAriaLive}
      data-enter={animateIn ? "" : undefined}
      className={className}
      style={style}
    >
      {dot && (
        <span data-dot="" data-live={live ? "" : undefined} />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {lead && (
          <>
            <strong>{lead}</strong>{" "}
          </>
        )}
        {children}
      </div>
      {meta && (
        <span data-num="" data-meta="">
          {meta}
        </span>
      )}
      {action}
    </div>
  );
}
