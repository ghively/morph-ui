import './ActiveSessions.css';
import { useState, type CSSProperties } from 'react';
import { Art, useAccent, initials, type MediaItem } from './mediaLibrary.shared';
import { fmtT } from './PlayerScrubber';

export type PlayMethod = 'DirectPlay' | 'DirectStream' | 'Transcode';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  admin?: boolean;
  pin?: boolean;
  accent?: string;
}

export interface Session {
  id: string;
  user: User;
  client: string;
  device: string;
  ip?: string;
  item: MediaItem;
  position: number;
  duration: number;
  paused?: boolean;
  method: PlayMethod;
  reasons?: string[];
  transcode?: { progress: number; fps: number; hw?: string; video?: string; audio?: string; container?: string };
  bitrate: number;
  quality?: string;
}

export interface ActiveSessionsProps {
  sessions: Session[];
  /** Upload cap in bits/s for the bandwidth meter. */
  bandwidthCap?: number;
  onStop?: (s: Session) => void;
  onMessage?: (s: Session) => void;
  onOpen?: (s: Session) => void;
  className?: string;
}

const METHOD: Record<PlayMethod, { l: string; k: string }> = {
  DirectPlay: { l: 'Direct play', k: 'var(--state-ok)' },
  DirectStream: { l: 'Direct stream', k: 'var(--state-live)' },
  Transcode: { l: 'Transcode', k: 'var(--state-warn)' },
};

const REASON: Record<string, string> = {
  VideoCodecNotSupported: 'video codec',
  AudioCodecNotSupported: 'audio codec',
  SubtitleCodecNotSupported: 'subtitles',
  ContainerNotSupported: 'container',
  ContainerBitrateExceedsLimit: 'bitrate limit',
  VideoRangeTypeNotSupported: 'HDR',
};

const mbps = (b: number) => (b / 1e6).toFixed(1) + ' Mbps';

function Row({ s, p }: { s: Session; p: ActiveSessionsProps }) {
  const acc = useAccent(s.item);
  const m = METHOD[s.method], f = s.position / s.duration;
  const [open, setOpen] = useState(false);
  const title = s.item.type === 'Episode' ? s.item.seriesTitle + ' · ' + s.item.title : s.item.title;

  return (
    <li className="asA-row ml-li" style={acc.style} data-paused={s.paused ? '' : undefined}>
      <div className="asA-thumb">
        <Art item={s.item} type="Backdrop" fallback={['Thumb', 'Primary']} shape="landscape" alt="" />
        <span className="asA-state" aria-label={s.paused ? 'Paused' : 'Playing'}>
          {s.paused ? '❚❚' : '▶'}
        </span>
      </div>
      <div className="asA-main">
        <div className="ml-row">
          <span className="asA-av" style={{ ['--k' as string]: s.user.accent }} aria-hidden="true">
            {initials(s.user.name)}
          </span>
          <span className="asA-user">{s.user.name}</span>
          <span className="asA-dev ml-ell">
            {s.client} · {s.device}
          </span>
        </div>
        <button type="button" className="asA-title ml-ell" onClick={() => p.onOpen?.(s)}>
          {title}
        </button>
        <div className="asA-prog">
          <div className="ml-bar">
            <i data-sub="" style={{ width: (s.transcode ? Math.min(1, f + 0.12) : f) * 100 + '%' }} />
            <i style={{ width: f * 100 + '%' }} />
          </div>
          <span className="ml-num">
            {fmtT(s.position)} / {fmtT(s.duration)}
          </span>
        </div>
        <div className="asA-tags">
          <span className="ml-chip" data-mldot="" style={{ ['--k' as string]: m.k }}>
            {m.l}
          </span>
          {s.quality && <span className="ml-chip">{s.quality}</span>}
          <span className="ml-chip ml-num">{mbps(s.bitrate)}</span>
          {s.transcode?.hw && <span className="ml-chip" style={{ ['--k' as string]: 'var(--sec)' }}>HW · {s.transcode.hw}</span>}
          {(s.reasons?.length || s.transcode) && (
            <button type="button" className="asA-more" aria-expanded={open} onClick={() => setOpen(x => !x)}>
              {open ? 'Less' : 'Why?'}
            </button>
          )}
        </div>
        {open && (
          <dl className="asA-why ml-glass-soft">
            {s.reasons?.length ? (
              <div>
                <dt>Reason</dt>
                <dd>{s.reasons.map(r => REASON[r] ?? r).join(', ')}</dd>
              </div>
            ) : null}
            {s.transcode?.video && (
              <div>
                <dt>Video</dt>
                <dd>{s.transcode.video}</dd>
              </div>
            )}
            {s.transcode?.audio && (
              <div>
                <dt>Audio</dt>
                <dd>{s.transcode.audio}</dd>
              </div>
            )}
            {s.transcode?.container && (
              <div>
                <dt>Container</dt>
                <dd>{s.transcode.container}</dd>
              </div>
            )}
            {s.transcode && (
              <div>
                <dt>Encoder</dt>
                <dd className="ml-num">
                  {s.transcode.fps} fps · {Math.round(s.transcode.progress * 100)}% ahead
                </dd>
              </div>
            )}
            {s.ip && (
              <div>
                <dt>Address</dt>
                <dd className="ml-num">{s.ip}</dd>
              </div>
            )}
          </dl>
        )}
      </div>
      <div className="asA-acts">
        {p.onMessage && (
          <button type="button" className="ml-icon" onClick={() => p.onMessage!(s)} aria-label={'Message ' + s.user.name}>
            ✎
          </button>
        )}
        {p.onStop && (
          <button type="button" className="ml-icon asA-stop" onClick={() => p.onStop!(s)} aria-label={'Stop ' + s.user.name + "'s stream"}>
            ■
          </button>
        )}
      </div>
    </li>
  );
}

export function ActiveSessions(p: ActiveSessionsProps) {
  const total = p.sessions.reduce((n, s) => n + (s.paused ? 0 : s.bitrate), 0);
  const tc = p.sessions.filter(s => s.method === 'Transcode').length;
  const cap = p.bandwidthCap ?? 60e6;

  return (
    <section className={'ml asA ml-glass ' + (p.className || '')} aria-label="Active sessions">
      <header className="asA-head">
        <h3 className="ml-h">Now playing</h3>
        <span className="ml-chip" data-mldot="" data-mllive="" style={{ ['--k' as string]: 'var(--state-live)' }}>
          {p.sessions.length} streams
        </span>
        {tc > 0 && <span className="ml-chip" style={{ ['--k' as string]: 'var(--state-warn)' }}>{tc} transcoding</span>}
        <span className="ml-sp" />
        <span className="asA-bw ml-num" title="Outbound bandwidth">
          <span>{mbps(total)}</span>
          <span className="ml-bar" style={{ ['--k' as string]: total / cap > 0.8 ? 'var(--state-warn)' : 'var(--state-ok)' } as CSSProperties}>
            <i style={{ width: Math.min(1, total / cap) * 100 + '%' }} />
          </span>
        </span>
      </header>
      {p.sessions.length === 0 ? <div className="asA-empty">Nothing is playing.</div> : <ul className="ml-list">{p.sessions.map(s => <Row key={s.id} s={s} p={p} />)}</ul>}
    </section>
  );
}
