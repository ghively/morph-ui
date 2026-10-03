import './PlayerScrubber.css';
import { useState, useRef, type PointerEvent as RPE, type KeyboardEvent } from 'react';
import { useAccent, type MediaItem } from './mediaLibrary.shared';

export interface Chapter { start: number; title: string; image?: string }
export type SegmentType = 'Intro' | 'Outro' | 'Recap' | 'Preview' | 'Commercial';
export interface MediaSegment { type: SegmentType; start: number; end: number }

/** Jellyfin trickplay sheet: `sheetUrl(i)` → tile sheet i, each holding cols×rows thumbs taken every `interval` ms. */
export interface Trickplay {
  sheetUrl: (i: number) => string;
  tileWidth: number;
  tileHeight: number;
  cols: number;
  rows: number;
  interval: number;
}

export interface PlayerScrubberProps {
  /** Seconds. */
  duration: number;
  position: number;
  buffered?: number;
  chapters?: Chapter[];
  segments?: MediaSegment[];
  trickplay?: Trickplay;
  playing?: boolean;
  onPlayPause?: () => void;
  onSeek: (t: number) => void;
  onSkip?: (s: MediaSegment) => void;
  /** Supplies the accent; optional. */
  item?: MediaItem;
  className?: string;
}

export const fmtT = (s: number) => {
  s = Math.max(0, Math.floor(s));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  return (h ? h + ':' + String(m).padStart(2, '0') : String(m)) + ':' + String(x).padStart(2, '0');
};

export const jellyfinTrickplay = (
  server: string,
  itemId: string,
  info: { Width: number; Height: number; TileWidth: number; TileHeight: number; Interval: number },
  apiKey?: string
): Trickplay => ({
  sheetUrl: i => server.replace(/\/$/, '') + '/Videos/' + itemId + '/Trickplay/' + info.Width + '/' + i + '.jpg' + (apiKey ? '?api_key=' + apiKey : ''),
  tileWidth: info.Width,
  tileHeight: info.Height,
  cols: info.TileWidth,
  rows: info.TileHeight,
  interval: info.Interval,
});

const SEG_L: Record<SegmentType, string> = {
  Intro: 'Skip intro',
  Outro: 'Skip credits',
  Recap: 'Skip recap',
  Preview: 'Skip preview',
  Commercial: 'Skip ad',
};

export function PlayerScrubber(p: PlayerScrubberProps) {
  const acc = useAccent(p.item ?? null);
  const track = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [drag, setDrag] = useState<number | null>(null);
  const d = Math.max(1, p.duration), pos = drag ?? p.position;

  const at = (x: number) => {
    const r = track.current!.getBoundingClientRect();
    return Math.max(0, Math.min(1, (x - r.left) / r.width)) * d;
  };

  const chs = [...(p.chapters ?? [])].sort((a, b) => a.start - b.start);
  const chAt = (t: number) => [...chs].reverse().find(c => c.start <= t);
  const seg = (p.segments ?? []).find(s => p.position >= s.start && p.position < s.end - 1);
  const preview = hover ?? drag;

  const thumb = (t: number) => {
    const tp = p.trickplay;
    if (tp) {
      const n = Math.floor((t * 1000) / tp.interval);
      const per = tp.cols * tp.rows;
      const i = Math.floor(n / per);
      const k = n % per;
      return {
        kind: 'sprite' as const,
        url: tp.sheetUrl(i),
        x: (k % tp.cols) * tp.tileWidth,
        y: Math.floor(k / tp.cols) * tp.tileHeight,
        w: tp.tileWidth,
        h: tp.tileHeight,
        sw: tp.cols * tp.tileWidth,
        sh: tp.rows * tp.tileHeight,
      };
    }
    const c = chAt(t);
    return c?.image ? { kind: 'img' as const, url: c.image } : null;
  };

  const down = (e: RPE<HTMLDivElement>) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setDrag(at(e.clientX));
  };
  const move = (e: RPE<HTMLDivElement>) => {
    const t = at(e.clientX);
    setHover(t);
    if (drag != null) setDrag(t);
  };
  const up = (e: RPE<HTMLDivElement>) => {
    if (drag != null) {
      p.onSeek(at(e.clientX));
      setDrag(null);
    }
  };
  const key = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 60 : 10;
    const m: Record<string, number> = {
      ArrowRight: pos + step,
      ArrowLeft: pos - step,
      Home: 0,
      End: d,
      PageUp: pos + 60,
      PageDown: pos - 60,
    };
    if (e.key in m) {
      e.preventDefault();
      p.onSeek(Math.max(0, Math.min(d, m[e.key]!)));
    }
  };

  const th = preview != null ? thumb(preview) : null;
  const cur = chAt(pos);

  return (
    <div className={'ml psA ml-glass ' + (p.className || '')} style={acc.style}>
      {seg && p.onSkip && (
        <button type="button" key={seg.type + seg.start} className="ml-pill psA-skip" data-tone="accent" onClick={() => p.onSkip!(seg)}>
          {SEG_L[seg.type]} <span aria-hidden="true">›</span>
        </button>
      )}
      <div className="psA-trackwrap">
        {preview != null && (
          <div className="psA-prev" style={{ left: (preview / d) * 100 + '%' }} aria-hidden="true">
            {th && (
              <div className="psA-thumb">
                {th.kind === 'sprite' ? (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundImage: 'url(' + th.url + ')',
                      backgroundSize: (th.sw / th.w) * 100 + '% ' + (th.sh / th.h) * 100 + '%',
                      backgroundPosition: (th.x / (th.sw - th.w || 1)) * 100 + '% ' + (th.y / (th.sh - th.h || 1)) * 100 + '%',
                    }}
                  />
                ) : (
                  <img src={th.url} alt="" />
                )}
              </div>
            )}
            <div className="psA-pt">
              <b className="ml-num">{fmtT(preview)}</b>
              {chAt(preview) && <span className="ml-ell">{chAt(preview)!.title}</span>}
            </div>
          </div>
        )}
        <div
          ref={track}
          className="psA-track"
          role="slider"
          tabIndex={0}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(d)}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={fmtT(pos) + ' of ' + fmtT(d) + (cur ? ', ' + cur.title : '')}
          data-drag={drag != null ? '' : undefined}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerLeave={() => setHover(null)}
          onKeyDown={key}
        >
          <div className="psA-rail">
            {(chs.length ? chs : [{ start: 0, title: '' }]).map((c, i, a) => {
              const s = c.start, e = a[i + 1]?.start ?? d, w = ((e - s) / d) * 100;
              const fill = Math.max(0, Math.min(1, (pos - s) / (e - s)));
              const buf = Math.max(0, Math.min(1, ((p.buffered ?? 0) - s) / (e - s)));
              const hv = preview != null && preview >= s && preview < e;
              return (
                <span key={i} className="psA-ch" data-hover={hv ? '' : undefined} style={{ width: w + '%' }}>
                  <i className="psA-buf" style={{ width: buf * 100 + '%' }} />
                  <i className="psA-fill" style={{ width: fill * 100 + '%' }} />
                </span>
              );
            })}
            {(p.segments ?? []).map((s, i) => (
              <span key={i} className="psA-seg" data-type={s.type} title={s.type} style={{ left: (s.start / d) * 100 + '%', width: ((s.end - s.start) / d) * 100 + '%' }} />
            ))}
          </div>
          <span className="psA-knob" style={{ left: (pos / d) * 100 + '%' }} />
        </div>
      </div>
      <div className="psA-ctl">
        {p.onPlayPause && (
          <button type="button" className="ml-icon" data-tone="accent" onClick={p.onPlayPause} aria-label={p.playing ? 'Pause' : 'Play'}>
            {p.playing ? '❚❚' : '▶'}
          </button>
        )}
        <button type="button" className="ml-icon" onClick={() => p.onSeek(Math.max(0, pos - 10))} aria-label="Back 10 seconds">
          ↺
        </button>
        <button type="button" className="ml-icon" onClick={() => p.onSeek(Math.min(d, pos + 30))} aria-label="Forward 30 seconds">
          ↻
        </button>
        <span className="psA-time ml-num">
          <b>{fmtT(pos)}</b> / {fmtT(d)}
        </span>
        {cur && <span className="psA-cur ml-ell">{cur.title}</span>}
        <span className="ml-sp" />
        <span className="psA-left ml-num">−{fmtT(d - pos)}</span>
      </div>
    </div>
  );
}
