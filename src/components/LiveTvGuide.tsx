import './LiveTvGuide.css';
import { useState, useRef, useEffect, useMemo } from 'react';
import { rove } from './mediaLibrary.shared';

export interface Channel {
  id: string;
  number: string;
  name: string;
  logo?: string;
  accent?: string;
}

export type ProgramKind = 'movie' | 'series' | 'sports' | 'news' | 'kids';

export interface Program {
  id: string;
  channelId: string;
  title: string;
  start: number;
  end: number;
  kind?: ProgramKind;
  episode?: string;
  live?: boolean;
  isNew?: boolean;
  recording?: 'series' | 'once';
}

export interface LiveTvGuideProps {
  channels: Channel[];
  programs: Program[];
  /** Window start (ms epoch). Defaults to the current half hour. */
  start?: number;
  hours?: number;
  /** Pixels per minute (default 5). */
  scale?: number;
  now?: number;
  onSelect?: (p: Program) => void;
  onRecord?: (p: Program) => void;
  className?: string;
}

const KIND: Record<ProgramKind, string> = {
  movie: 'var(--sec)',
  series: 'var(--state-live)',
  sports: 'var(--state-ok)',
  news: 'var(--state-warn)',
  kids: '#ff8ad8',
};

const hm = (t: number) =>
  new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

export function LiveTvGuide(p: LiveTvGuideProps) {
  const [now, setNow] = useState(p.now ?? Date.now());

  useEffect(() => {
    if (p.now != null) {
      setNow(p.now);
      return;
    }
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, [p.now]);

  const half = 30 * 60000;
  const start = p.start ?? Math.floor(now / half) * half - half;
  const end = start + (p.hours ?? 4) * 3600000;
  const ppm = p.scale ?? 5;
  const W = ((end - start) / 60000) * ppm;
  const x = (t: number) => ((Math.max(start, Math.min(end, t)) - start) / 60000) * ppm;
  const sc = useRef<HTMLDivElement>(null);
  const [sel, setSel] = useState<string | null>(null);

  useEffect(() => {
    const el = sc.current;
    if (el) el.scrollLeft = Math.max(0, x(now) - 120);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slots = useMemo(() => {
    const a: number[] = [];
    for (let t = start; t < end; t += half) a.push(t);
    return a;
  }, [start, end, half]);

  const selected = p.programs.find(g => g.id === sel);

  return (
    <section className={'ml tvA ml-glass ' + (p.className || '')} aria-label="TV guide">
      <div className="tvA-scroll" ref={sc} onKeyDown={rove('[data-prog]', () => sc.current)}>
        <div className="tvA-grid" role="table" aria-label="Schedule" style={{ width: W + 168 }}>
          <div className="tvA-corner" aria-hidden="true">
            <b>
              {new Date(now).toLocaleDateString([], {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </b>
          </div>
          <div className="tvA-ruler" aria-hidden="true" style={{ width: W }}>
            {slots.map(t => (
              <span key={t} style={{ left: x(t) }} className="ml-num">
                {hm(t)}
              </span>
            ))}
          </div>
          {p.channels.map(c => (
            <div key={c.id} className="tvA-line" role="row">
              <div
                className="tvA-ch"
                role="rowheader"
                style={{ ['--c' as string]: c.accent ?? 'var(--morph-accent)' }}
              >
                <span className="tvA-num ml-num">{c.number}</span>
                {c.logo ? (
                  <img src={c.logo} alt="" className="tvA-logo" />
                ) : (
                  <span className="tvA-mono">{c.name.slice(0, 2).toUpperCase()}</span>
                )}
                <span className="tvA-name ml-ell">{c.name}</span>
              </div>
              <div className="tvA-row" role="cell" style={{ width: W }}>
                {p.programs
                  .filter(g => g.channelId === c.id && g.end > start && g.start < end)
                  .map(g => {
                    const on = now >= g.start && now < g.end;
                    const past = g.end <= now;
                    const l = x(g.start);
                    const w = Math.max(2, x(g.end) - l);
                    return (
                      <button
                        key={g.id}
                        type="button"
                        data-prog=""
                        className="tvA-prog"
                        data-now={on ? '' : undefined}
                        data-past={past ? '' : undefined}
                        aria-pressed={sel === g.id}
                        style={{ left: l, width: w - 3, ['--k' as string]: KIND[g.kind ?? 'series'] }}
                        onClick={() => {
                          setSel(g.id);
                          p.onSelect?.(g);
                        }}
                        aria-label={
                          g.title +
                          ', ' +
                          c.name +
                          ', ' +
                          hm(g.start) +
                          ' to ' +
                          hm(g.end) +
                          (on ? ', on now' : '')
                        }
                      >
                        <span className="tvA-pt ml-ell">
                          {g.recording && <i className="tvA-rec" aria-label="Recording" />}
                          {g.title}
                        </span>
                        <span className="tvA-ps ml-ell ml-num">
                          {hm(g.start)}
                          {g.episode ? ' · ' + g.episode : ''}
                        </span>
                        {on && (
                          <span className="tvA-pp">
                            <i style={{ width: ((now - g.start) / (g.end - g.start)) * 100 + '%' }} />
                          </span>
                        )}
                        <span className="tvA-flags">
                          {g.live && <b>LIVE</b>}
                          {g.isNew && <b>NEW</b>}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
          <div className="tvA-now" style={{ left: 168 + x(now) }} aria-hidden="true">
            <span className="ml-num">{hm(now)}</span>
          </div>
        </div>
      </div>
      {selected && (
        <footer className="tvA-detail" style={{ ['--k' as string]: KIND[selected.kind ?? 'series'] }}>
          <span className="ml-chip" data-mldot="" style={{ ['--k' as string]: KIND[selected.kind ?? 'series'] }}>
            {selected.kind ?? 'series'}
          </span>
          <b className="ml-ell">{selected.title}</b>
          <span className="ml-dim ml-sm ml-num">
            {hm(selected.start)}–{hm(selected.end)}
            {selected.episode ? ' · ' + selected.episode : ''}
          </span>
          <span className="ml-sp" />
          {p.onRecord && selected.end > now && (
            <button
              type="button"
              className="ml-pill"
              data-size="sm"
              aria-pressed={!!selected.recording}
              onClick={() => p.onRecord!(selected)}
            >
              <i className="tvA-rec" aria-hidden="true" />
              {selected.recording ? 'Recording' : 'Record'}
            </button>
          )}
        </footer>
      )}
    </section>
  );
}
