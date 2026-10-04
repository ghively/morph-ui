import './mediaLibrary.shared.css';
import './DownloadQueue.css';
import type { CSSProperties } from 'react';

export type QState =
  | 'downloading'
  | 'queued'
  | 'paused'
  | 'seeding'
  | 'stalled'
  | 'extracting'
  | 'importing'
  | 'failed'
  | 'completed';

export interface QueueItem {
  id: string;
  name: string;
  client: 'SABnzbd' | 'qBittorrent' | 'NZBGet' | 'Transmission';
  protocol: 'usenet' | 'torrent';
  category?: string;
  state: QState;
  progress: number;
  size: number;
  speed?: number;
  eta?: number;
  seeds?: number;
  peers?: number;
  ratio?: number;
  linked?: { title: string; arr: 'Sonarr' | 'Radarr' | 'Lidarr' };
  error?: string;
}

export interface DownloadQueueProps {
  items: QueueItem[];
  /** Alternative (throttled) speed mode, as in SABnzbd / qBittorrent. */
  altSpeed?: boolean;
  onAltSpeed?: (on: boolean) => void;
  paused?: boolean;
  onPauseAll?: (paused: boolean) => void;
  onPause?: (q: QueueItem) => void;
  onResume?: (q: QueueItem) => void;
  onRemove?: (q: QueueItem) => void;
  onRetry?: (q: QueueItem) => void;
  className?: string;
}

const S: Record<QState, { l: string; k: string }> = {
  downloading: { l: 'Downloading', k: 'var(--state-live)' },
  queued: { l: 'Queued', k: 'var(--state-idle)' },
  paused: { l: 'Paused', k: 'var(--state-idle)' },
  seeding: { l: 'Seeding', k: 'var(--state-ok)' },
  stalled: { l: 'Stalled', k: 'var(--state-warn)' },
  extracting: { l: 'Extracting', k: 'var(--sec)' },
  importing: { l: 'Importing', k: 'var(--state-ready)' },
  failed: { l: 'Failed', k: 'var(--state-error)' },
  completed: { l: 'Completed', k: 'var(--state-ok)' },
};

export const fmtB = (b: number) =>
  b >= 1024 ** 3
    ? (b / 1024 ** 3).toFixed(1) + ' GB'
    : b >= 1024 ** 2
    ? (b / 1024 ** 2).toFixed(b >= 100 * 1024 ** 2 ? 0 : 1) + ' MB'
    : Math.round(b / 1024) + ' KB';

const fmtEta = (s?: number) =>
  s == null
    ? ''
    : s < 60
    ? s + 's'
    : s < 3600
    ? Math.round(s / 60) + 'm'
    : Math.floor(s / 3600) + 'h ' + Math.round((s % 3600) / 60) + 'm';

export function DownloadQueue(p: DownloadQueueProps) {
  const down = p.items.filter(i => i.state === 'downloading').reduce((n, i) => n + (i.speed ?? 0), 0);
  const up = p.items.filter(i => i.state === 'seeding').reduce((n, i) => n + (i.speed ?? 0), 0);
  const left = p.items
    .filter(i => i.state !== 'seeding' && i.state !== 'completed')
    .reduce((n, i) => n + i.size * (1 - i.progress), 0);

  return (
    <section className={'ml dqA ml-glass ' + (p.className || '')} aria-label="Download queue">
      <header className="dqA-head">
        <h3 className="ml-h">Queue</h3>
        <span className="dqA-rate ml-num">
          <b>↓ {fmtB(down)}/s</b>
          <span>↑ {fmtB(up)}/s</span>
          <span>{fmtB(left)} left</span>
        </span>
        <span className="ml-sp" />
        {p.onAltSpeed && (
          <button
            type="button"
            className="ml-pill"
            data-size="sm"
            aria-pressed={!!p.altSpeed}
            onClick={() => p.onAltSpeed!(!p.altSpeed)}
            title="Alternative speed limits"
          >
            Speed limit
          </button>
        )}
        {p.onPauseAll && (
          <button type="button" className="ml-pill" data-size="sm" onClick={() => p.onPauseAll!(!p.paused)}>
            {p.paused ? '▶ Resume all' : '❚❚ Pause all'}
          </button>
        )}
      </header>
      {p.items.length === 0 ? (
        <div className="dqA-empty">Queue is empty.</div>
      ) : (
        <ul className="ml-list" aria-live="polite">
          {p.items.map(q => {
            const s = S[q.state];
            const active = q.state === 'downloading' || q.state === 'seeding';
            return (
              <li
                key={q.id}
                className="ml-li dqA-row"
                data-queue-state={q.state}
                style={{ ['--k' as string]: s.k }}
              >
                <span className="dqA-client" title={q.client} data-proto={q.protocol}>
                  {q.client === 'SABnzbd' ? 'SAB' : q.client === 'qBittorrent' ? 'qB' : q.client.slice(0, 3)}
                </span>
                <div className="dqA-main">
                  <div className="ml-row">
                    <span className="dqA-name ml-ell" title={q.name}>
                      {q.linked?.title ?? q.name}
                    </span>
                    {q.linked && <span className="ml-chip">{q.linked.arr}</span>}
                    {q.category && <span className="ml-chip">{q.category}</span>}
                  </div>
                  {q.linked && (
                    <span className="dqA-rel ml-ell" title={q.name}>
                      {q.name}
                    </span>
                  )}
                  <div className="dqA-prog">
                    <span
                      className="ml-bar"
                      data-indet={q.state === 'extracting' || q.state === 'importing' ? '' : undefined}
                    >
                      <i
                        style={
                          {
                            width: q.progress * 100 + '%',
                            ['--k' as string]: s.k,
                          } as CSSProperties
                        }
                      />
                    </span>
                    <span className="ml-num">{Math.round(q.progress * 100)}%</span>
                  </div>
                  <div className="dqA-stats ml-num">
                    <span
                      className="ml-chip"
                      data-mldot=""
                      data-mllive={active ? '' : undefined}
                      style={{ ['--k' as string]: s.k }}
                    >
                      {s.l}
                    </span>
                    <span>
                      {fmtB(q.size * q.progress)} / {fmtB(q.size)}
                    </span>
                    {q.speed ? <span>{q.state === 'seeding' ? '↑' : '↓'} {fmtB(q.speed)}/s</span> : null}
                    {q.eta != null && q.state === 'downloading' && <span>ETA {fmtEta(q.eta)}</span>}
                    {q.seeds != null && <span>{q.seeds} seeds · {q.peers} peers</span>}
                    {q.ratio != null && <span>ratio {q.ratio.toFixed(2)}</span>}
                  </div>
                  {q.error && <span className="dqA-err">{q.error}</span>}
                </div>
                <div className="dqA-acts">
                  {q.state === 'failed' ? (
                    p.onRetry && (
                      <button
                        type="button"
                        className="ml-icon"
                        onClick={() => p.onRetry!(q)}
                        aria-label={'Retry ' + q.name}
                      >
                        ↻
                      </button>
                    )
                  ) : q.state === 'paused' ? (
                    p.onResume && (
                      <button
                        type="button"
                        className="ml-icon"
                        onClick={() => p.onResume!(q)}
                        aria-label={'Resume ' + q.name}
                      >
                        ▶
                      </button>
                    )
                  ) : (
                    q.state !== 'extracting' &&
                    q.state !== 'importing' &&
                    p.onPause && (
                      <button
                        type="button"
                        className="ml-icon"
                        onClick={() => p.onPause!(q)}
                        aria-label={'Pause ' + q.name}
                      >
                        ❚❚
                      </button>
                    )
                  )}
                  {p.onRemove && (
                    <button
                      type="button"
                      className="ml-icon dqA-rm"
                      onClick={() => p.onRemove!(q)}
                      aria-label={'Remove ' + q.name}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
