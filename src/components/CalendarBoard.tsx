import './CalendarBoard.css';
import { useMemo, useState } from 'react';
import { addDays, addMonthsSafe, dayFloor, dowShift, monthLabel } from './dataShell.shared';

export interface CalendarEvent {
  id: string;
  title: string;
  /** Epoch ms; the day is taken from this. */
  at: number;
  /** tone → left rail + chip tint from the Tone vocabulary. */
  tone?: 'neutral' | 'info' | 'success' | 'warn' | 'danger';
  meta?: string;
}

export interface CalendarBoardProps {
  events: CalendarEvent[];
  /** Any date inside the month to show. Defaults to now. */
  month?: Date;
  onMonthChange?: (d: Date) => void;
  /** 0 = Sunday, 1 = Monday (default). */
  weekStartsOn?: 0 | 1;
  /** Pin "today" for deterministic renders. */
  now?: number;
  onEventActivate?: (e: CalendarEvent) => void;
  /** Event chips drag between days (pointer events). Defaults on. */
  draggable?: boolean;
  onEventMove?: (eventId: string, newDay: Date) => void;
  label?: string;
  className?: string;
}

const TONE_C: Record<NonNullable<CalendarEvent['tone']>, string> = {
  neutral: 'var(--app-faint)',
  info: 'var(--state-think)',
  success: 'var(--state-ok)',
  warn: 'var(--state-warn)',
  danger: 'var(--state-error)',
};

/**
 * CalendarBoard — month grid with event chips, prev/next/today navigation and
 * optional pointer-drag to move an event between days (FluidWorkspaceBoard-style
 * capture; drop target resolution is hit-test based, so jsdom works too).
 * Original morph-ui design.
 */
export function CalendarBoard({
  events,
  month,
  onMonthChange,
  weekStartsOn = 1,
  now,
  onEventActivate,
  draggable = true,
  onEventMove,
  label = 'Calendar',
  className = '',
}: CalendarBoardProps) {
  const [ownNow] = useState(() => now ?? Date.now());
  const today = dayFloor(now ?? ownNow);
  const [ownMonth, setOwnMonth] = useState(() => month ?? new Date(now ?? ownNow));
  const shown = month ?? ownMonth;

  const [dragEventId, setDragEventId] = useState<string | null>(null);
  const [overDay, setOverDay] = useState<number | null>(null);

  const weeks = useMemo(() => {
    const first = new Date(shown.getFullYear(), shown.getMonth(), 1);
    const start = addDays(dayFloor(first.getTime()), -dowShift(first.getDay(), weekStartsOn));
    return Array.from({ length: 6 }, (_, w) =>
      Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d)),
    );
  }, [shown, weekStartsOn]);

  const byDay = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();
    for (const ev of events) {
      const key = dayFloor(ev.at);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    }
    return map;
  }, [events]);

  const nav = (n: number) => {
    const d = new Date(addMonthsSafe(shown.getTime(), n));
    setOwnMonth(d);
    onMonthChange?.(d);
  };

  const goToday = () => {
    const d = new Date(today);
    setOwnMonth(d);
    onMonthChange?.(d);
  };

  const dayAt = (x: number, y: number): number | null => {
    const cells = document.querySelectorAll('[data-cal-cell]');
    for (const cell of Array.from(cells)) {
      const r = cell.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        const t = Number((cell as HTMLElement).dataset.day);
        return Number.isFinite(t) ? t : null;
      }
    }
    return null;
  };

  const eventProps = (ev: CalendarEvent) => ({
    'data-cal-event': '',
    'data-event-id': ev.id,
    draggable: false,
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': `${ev.title}${ev.meta ? ', ' + ev.meta : ''}`,
    style: { ['--c' as string]: TONE_C[ev.tone ?? 'neutral'] },
    onClick: () => onEventActivate?.(ev),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onEventActivate?.(ev); }
    },
    onPointerDown: (e: React.PointerEvent) => {
      if (!draggable || e.button !== 0) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture?.(e.pointerId);
      setDragEventId(ev.id);
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (dragEventId !== ev.id) return;
      setOverDay(dayAt(e.clientX, e.clientY));
    },
    onPointerUp: (e: React.PointerEvent) => {
      if (dragEventId !== ev.id) return;
      e.currentTarget.releasePointerCapture?.(e.pointerId);
      const target = dayAt(e.clientX, e.clientY);
      if (target != null && target !== dayFloor(ev.at)) {
        onEventMove?.(ev.id, new Date(target));
      }
      setDragEventId(null);
      setOverDay(null);
    },
    onPointerCancel: () => {
      if (dragEventId !== ev.id) return;
      setDragEventId(null);
      setOverDay(null);
    },
  });

  const weekdayNames = useMemo(() => {
    const fmt = new Intl.DateTimeFormat([], { weekday: 'short' });
    const base = new Date(2023, 0, 1); // a Sunday
    return Array.from({ length: 7 }, (_, i) => fmt.format(addDays(base.getTime(), (i + weekStartsOn) % 7)));
  }, [weekStartsOn]);

  const movedEvent = dragEventId ? events.find((e) => e.id === dragEventId) : null;

  return (
    <div className={className} data-cal-board="" aria-label={label}>
      <header data-cal-head="">
        <h3>{monthLabel(shown)}</h3>
        <span data-cal-spacer="" />
        <button type="button" data-cal-nav="" aria-label="Previous month" onClick={() => nav(-1)}>‹</button>
        <button type="button" data-cal-today="" onClick={goToday}>Today</button>
        <button type="button" data-cal-nav="" aria-label="Next month" onClick={() => nav(1)}>›</button>
      </header>

      <div data-cal-grid="" role="grid" aria-label={monthLabel(shown)}>
        <div role="row" data-cal-weekdays="">
          {weekdayNames.map((name) => (
            <span key={name} role="columnheader">{name}</span>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} role="row" data-cal-week="">
            {week.map((day) => {
              const inMonth = new Date(day).getMonth() === shown.getMonth();
              const isToday = day === today;
              const dayEvents = byDay.get(day) ?? [];
              return (
                <div
                  key={day}
                  role="gridcell"
                  data-cal-cell=""
                  data-day={day}
                  data-inmonth={inMonth ? '' : undefined}
                  data-today={isToday ? '' : undefined}
                  data-dropping={overDay === day && dragEventId ? '' : undefined}
                  aria-label={new Date(day).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                >
                  <span data-cal-daynum="">{new Date(day).getDate()}</span>
                  <div data-cal-events="">
                    {dayEvents.map((ev) => (
                      <span key={ev.id} {...eventProps(ev)} className={dragEventId === ev.id ? 'is-dragging' : undefined}>
                        {ev.title}
                      </span>
                    ))}
                    {dayEvents.length > 3 && <span data-cal-more="">+{dayEvents.length - 3}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {movedEvent && draggable && (
        <span data-cal-ghost="" aria-hidden="true">{movedEvent.title}</span>
      )}
    </div>
  );
}

export type { CalendarEvent as CalendarBoardEvent };
