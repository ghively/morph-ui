import './ReleaseCalendar.css';
import { useState, useMemo } from 'react';
import { Art, type MediaItem } from './mediaLibrary.shared';

export type CalState = 'downloaded' | 'missing' | 'unaired' | 'airing' | 'downloading';

export interface CalItem {
  id: string;
  title: string;
  sub: string;
  at: number;
  kind: 'episode' | 'movie';
  state: CalState;
  item?: MediaItem;
}

export interface ReleaseCalendarProps {
  items: CalItem[];
  /** Any date inside the week to show. */
  week?: Date;
  onWeekChange?: (d: Date) => void;
  /** 0 = Sunday, 1 = Monday (default). */
  weekStartsOn?: 0 | 1;
  onSelect?: (i: CalItem) => void;
  now?: number;
  className?: string;
}

const K: Record<CalState, { l: string; k: string }> = {
  downloaded: { l: 'Downloaded', k: 'var(--state-ok)' },
  missing: { l: 'Missing', k: 'var(--state-error)' },
  unaired: { l: 'Upcoming', k: 'var(--state-idle)' },
  airing: { l: 'Airing today', k: 'var(--state-live)' },
  downloading: { l: 'Downloading', k: 'var(--sec)' },
};

const D = 86400000;

export function ReleaseCalendar(p: ReleaseCalendarProps) {
  const [mountedAt] = useState(() => Date.now());
  const [own, setOwn] = useState(() => p.week ?? new Date(p.now ?? mountedAt));
  const wk = p.week ?? own;
  const ws = p.weekStartsOn ?? 1;
  const wkTime = wk.getTime();

  const start = useMemo(() => {
    const d = new Date(wkTime);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - ((d.getDay() - ws + 7) % 7));
    return d.getTime();
  }, [wkTime, ws]);

  const today = new Date(p.now ?? mountedAt);
  today.setHours(0, 0, 0, 0);
  const days = Array.from({ length: 7 }, (_, i) => start + i * D);

  const nav = (n: number) => {
    const d = new Date(start + n * 7 * D);
    setOwn(d);
    p.onWeekChange?.(d);
  };

  const label =
    new Date(start).toLocaleDateString([], { month: 'short', day: 'numeric' }) +
    ' – ' +
    new Date(start + 6 * D).toLocaleDateString([], { month: 'short', day: 'numeric' });

  return (
    <section className={'ml rcA ml-glass ' + (p.className || '')} aria-label="Release calendar">
      <header className="rcA-head">
        <h3 className="ml-h">Calendar</h3>
        <span className="ml-dim ml-sm ml-num">{label}</span>
        <span className="ml-sp" />
        <div className="rcA-legend">
          {(Object.keys(K) as CalState[]).map(s => (
            <span key={s} className="ml-chip" data-mldot="" style={{ ['--k' as string]: K[s].k }}>
              {K[s].l}
            </span>
          ))}
        </div>
        <button type="button" className="ml-icon" onClick={() => nav(-1)} aria-label="Previous week">
          ‹
        </button>
        <button
          type="button"
          className="ml-pill"
          data-size="sm"
          onClick={() => {
            const d = new Date(p.now ?? Date.now());
            setOwn(d);
            p.onWeekChange?.(d);
          }}
        >
          Today
        </button>
        <button type="button" className="ml-icon" onClick={() => nav(1)} aria-label="Next week">
          ›
        </button>
      </header>
      <div className="rcA-grid">
        {days.map(d => {
          const its = p.items.filter(i => i.at >= d && i.at < d + D).sort((a, b) => a.at - b.at);
          const isToday = d === today.getTime();
          const past = d < today.getTime();
          const dt = new Date(d);
          return (
            <div
              key={d}
              className="rcA-day"
              data-today={isToday ? '' : undefined}
              data-past={past ? '' : undefined}
              aria-label={dt.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            >
              <div className="rcA-dh">
                <span>{dt.toLocaleDateString([], { weekday: 'short' })}</span>
                <b className="ml-num">{dt.getDate()}</b>
              </div>
              <div className="rcA-items">
                {its.length === 0 && (
                  <span className="rcA-none" aria-hidden="true">
                    ·
                  </span>
                )}
                {its.map(i => (
                  <button
                    key={i.id}
                    type="button"
                    className="rcA-it"
                    style={{ ['--k' as string]: K[i.state].k }}
                    onClick={() => p.onSelect?.(i)}
                    aria-label={i.title + ', ' + i.sub + ', ' + K[i.state].l}
                  >
                    {i.item && (
                      <Art
                        item={i.item}
                        type="Thumb"
                        fallback={['Backdrop']}
                        shape="landscape"
                        alt=""
                        className="rcA-art"
                        empty={null}
                      />
                    )}
                    <span className="rcA-t ml-ell">{i.title}</span>
                    <span className="rcA-s ml-ell">{i.sub}</span>
                    <span className="rcA-m ml-num">
                      {i.kind === 'episode'
                        ? new Date(i.at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                        : 'Movie'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
