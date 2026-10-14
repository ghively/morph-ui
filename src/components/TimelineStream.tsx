import './TimelineStream.css';
import type { ReactNode } from 'react';

export interface TimelineStreamItem {
  id: string;
  /** Icon node inside the marker circle. Keep to a glyph. */
  icon?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  /** Mono timestamp column. */
  time?: string;
  tone?: 'neutral' | 'info' | 'success' | 'warn' | 'danger';
  /** Marks a step-in-progress (pulsing marker, dim connector below). */
  active?: boolean;
  meta?: ReactNode;
}

export interface TimelineStreamProps {
  items: TimelineStreamItem[];
  label?: string;
  /** Show the mono time column. */
  showTimes?: boolean;
  /** Ordered markers newest-first (visual flip only). */
  newestFirst?: boolean;
  onItemActivate?: (item: TimelineStreamItem) => void;
  className?: string;
}

const TONE_C: Record<NonNullable<TimelineStreamItem['tone']>, string> = {
  neutral: 'var(--app-faint)',
  info: 'var(--state-think)',
  success: 'var(--state-ok)',
  warn: 'var(--state-warn)',
  danger: 'var(--state-error)',
};

/**
 * TimelineStream — vertical activity feed: marker column with connectors,
 * per-item tone, optional live pulse on the active item. Complements
 * RunTimeline (step statuses) as a generic event stream. Original morph-ui design.
 */
export function TimelineStream({
  items,
  label = 'Activity',
  showTimes = true,
  newestFirst = false,
  onItemActivate,
  className = '',
}: TimelineStreamProps) {
  const ordered = newestFirst ? [...items].reverse() : items;

  return (
    <div className={className} data-tstream="" aria-label={label}>
      {ordered.map((item, i) => {
        const last = i === ordered.length - 1;
        const interactive = !!onItemActivate;
        const Row = 'div';
        return (
          <Row
            key={item.id}
            data-tstream-item=""
            data-tone={item.tone ?? 'neutral'}
            data-active={item.active ? '' : undefined}
            data-last={last || undefined}
            style={{ ['--c' as string]: TONE_C[item.tone ?? 'neutral'] }}
            tabIndex={interactive ? 0 : undefined}
            role={interactive ? 'button' : undefined}
            aria-label={interactive ? typeof item.title === 'string' ? item.title : undefined : undefined}
            onClick={interactive ? () => onItemActivate(item) : undefined}
            onKeyDown={
              interactive
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onItemActivate(item);
                    }
                  }
                : undefined
            }
          >
            {showTimes && item.time && (
              <span data-tstream-time="">{item.time}</span>
            )}
            <span data-tstream-marker="" aria-hidden="true">
              <span data-tstream-node="">{item.icon}</span>
              {!last && <span data-tstream-wire="" />}
            </span>
            <span data-tstream-body="">
              <span data-tstream-title="">{item.title}</span>
              {item.body && <span data-tstream-text="">{item.body}</span>}
              {item.meta && <span data-tstream-meta="">{item.meta}</span>}
            </span>
          </Row>
        );
      })}
      {items.length === 0 && <div data-tstream-empty="">No activity yet.</div>}
    </div>
    );
}
