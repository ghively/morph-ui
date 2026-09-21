import type { ReactNode, CSSProperties } from 'react';
import './EmptyState.css';

export interface EmptyStateProps {
  title: string;
  children?: ReactNode;
  /** Buttons/links rendered after the body. */
  action?: ReactNode;
  /** Wrap in a padded card and mark `data-notconfigured=""` — the `NotConfigured` variant. */
  framed?: boolean;
  /** Replaces the default dot inside the tile (e.g. an icon). */
  icon?: ReactNode;
  /** Pulsing dot for "in progress" empties. */
  live?: boolean;
  /** Forwarded to the root (RoomNav/AgentsScreen pass layout overrides). */
  className?: string;
  style?: CSSProperties;
}

export function EmptyState({
  title,
  children,
  action,
  framed,
  icon,
  live,
  className = '',
  style
}: EmptyStateProps) {
  const inner = (
    <div data-empty="" className={className} style={style}>
      <div data-tile="">
        {icon ? icon : <div data-dot="" data-live={live ? "" : undefined} />}
      </div>
      <div data-eyebrow="">{title}</div>
      {children ? <div>{children}</div> : null}
      {action}
    </div>
  );

  if (framed) {
    return (
      <div data-card="" data-pad="roomy" data-notconfigured="">
        {inner}
      </div>
    );
  }

  return inner;
}
