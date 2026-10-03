import './ArrItemStatus.css';
import type { CSSProperties } from 'react';
import { Art, useAccent, yearSpan, type MediaItem } from './mediaLibrary.shared';

export type EpState = 'downloaded' | 'missing' | 'unaired' | 'downloading' | 'unmonitored';

export interface ArrSeason {
  number: number;
  monitored: boolean;
  episodes: { n: number; title?: string; state: EpState; airDate?: string }[];
}

export type MovieState = 'downloaded' | 'missing' | 'announced' | 'inCinemas' | 'released' | 'downloading';

export interface ArrItemStatusProps {
  item: MediaItem;
  app: 'Sonarr' | 'Radarr';
  monitored: boolean;
  qualityProfile: string;
  /** Sonarr: seasons with per-episode file state. */
  seasons?: ArrSeason[];
  /** Radarr: movie file state + quality of the file on disk. */
  movie?: { state: MovieState; quality?: string; customFormatScore?: number; availability?: string };
  sizeOnDisk?: string;
  path?: string;
  nextAiring?: string;
  onMonitorChange?: (monitored: boolean, season?: number) => void;
  onSearch?: (scope: 'all' | number) => void;
  onInteractive?: () => void;
  className?: string;
}

const EK: Record<EpState, string> = {
  downloaded: 'var(--state-ok)',
  missing: 'var(--state-error)',
  unaired: 'var(--state-idle)',
  downloading: 'var(--state-live)',
  unmonitored: 'color-mix(in srgb, var(--app-text) 14%, transparent)',
};

const MK: Record<MovieState, [string, string]> = {
  downloaded: ['On disk', 'var(--state-ok)'],
  missing: ['Missing', 'var(--state-error)'],
  announced: ['Announced', 'var(--state-idle)'],
  inCinemas: ['In cinemas', 'var(--state-wait)'],
  released: ['Released · not grabbed', 'var(--state-warn)'],
  downloading: ['Downloading', 'var(--state-live)'],
};

function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className="aiA-sw"
      onClick={() => onChange(!on)}
    >
      <i />
    </button>
  );
}

export function ArrItemStatus(p: ArrItemStatusProps) {
  const acc = useAccent(p.item);
  const eps = (p.seasons ?? []).filter(s => s.monitored).flatMap(s => s.episodes);
  const have = eps.filter(e => e.state === 'downloaded').length;
  const aired = eps.filter(e => e.state !== 'unaired').length;

  return (
    <section
      className={'ml aiA ml-glass ' + (p.className || '')}
      style={acc.style}
      data-monitored={p.monitored ? '' : undefined}
    >
      <Art item={p.item} type="Backdrop" fallback={['Thumb']} shape="fill" alt="" className="aiA-bg" empty={null} />
      <header className="aiA-head">
        <Art item={p.item} type="Primary" shape="portrait" alt="" className="aiA-poster" />
        <div className="aiA-info">
          <div className="ml-row">
            <span
              className="ml-chip"
              style={{ ['--k' as string]: p.app === 'Sonarr' ? 'var(--state-live)' : 'var(--state-wait)' }}
            >
              {p.app}
            </span>
            <span className="ml-sp" />
            <span className="ml-sm ml-dim">Monitored</span>
            <Switch on={p.monitored} label="Monitored" onChange={v => p.onMonitorChange?.(v)} />
          </div>
          <h3 className="aiA-title ml-ell">
            {p.item.title} <span className="ml-dim ml-num">{yearSpan(p.item)}</span>
          </h3>
          <div className="aiA-tags">
            <span className="ml-chip">{p.qualityProfile}</span>
            {p.sizeOnDisk && <span className="ml-chip ml-num">{p.sizeOnDisk}</span>}
            {p.movie?.quality && <span className="ml-chip">{p.movie.quality}</span>}
            {p.movie?.customFormatScore != null && (
              <span className="ml-chip ml-num" title="Custom format score">
                CF {p.movie.customFormatScore > 0 ? '+' : ''}
                {p.movie.customFormatScore}
              </span>
            )}
          </div>
          {p.seasons && (
            <div className="aiA-sum">
              <span className="ml-bar">
                <i
                  style={
                    {
                      width: (aired ? have / aired : 0) * 100 + '%',
                      ['--k' as string]: have === aired ? 'var(--state-ok)' : 'var(--c)',
                    } as CSSProperties
                  }
                />
              </span>
              <span className="ml-num ml-sm">
                {have}/{aired} episodes{p.nextAiring ? ' · next ' + p.nextAiring : ''}
              </span>
            </div>
          )}
          {p.movie && (
            <div className="aiA-sum">
              <span
                className="ml-chip"
                data-mldot=""
                data-mllive={p.movie.state === 'downloading' ? '' : undefined}
                style={{ ['--k' as string]: MK[p.movie.state][1] }}
              >
                {MK[p.movie.state][0]}
              </span>
              {p.movie.availability && (
                <span className="ml-sm ml-faint">Minimum availability: {p.movie.availability}</span>
              )}
            </div>
          )}
          {p.path && <span className="aiA-path ml-ell">{p.path}</span>}
        </div>
      </header>
      {p.seasons && (
        <ul className="ml-list aiA-seasons">
          {p.seasons.map(s => {
            const h = s.episodes.filter(e => e.state === 'downloaded').length;
            return (
              <li key={s.number} className="ml-li aiA-season" data-off={!s.monitored ? '' : undefined}>
                <Switch
                  on={s.monitored}
                  label={(s.number ? 'Season ' + s.number : 'Specials') + ' monitored'}
                  onChange={v => p.onMonitorChange?.(v, s.number)}
                />
                <span className="aiA-sn">{s.number ? 'Season ' + s.number : 'Specials'}</span>
                <span className="aiA-cells" role="img" aria-label={h + ' of ' + s.episodes.length + ' downloaded'}>
                  {s.episodes.map(e => (
                    <i
                      key={e.n}
                      title={'E' + String(e.n).padStart(2, '0') + (e.title ? ' · ' + e.title : '') + ' · ' + e.state}
                      data-st={e.state}
                      style={{ ['--k' as string]: s.monitored ? EK[e.state] : EK.unmonitored }}
                    />
                  ))}
                </span>
                <span className="ml-num ml-sm ml-dim">
                  {h}/{s.episodes.length}
                </span>
                {p.onSearch && (
                  <button
                    type="button"
                    className="ml-icon"
                    aria-label={'Search ' + (s.number ? 'season ' + s.number : 'specials')}
                    onClick={() => p.onSearch!(s.number)}
                  >
                    ⌕
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <footer className="aiA-foot">
        {p.onSearch && (
          <button type="button" className="ml-pill" data-tone="accent" onClick={() => p.onSearch!('all')}>
            ⌕ {p.seasons ? 'Search monitored' : 'Search movie'}
          </button>
        )}
        {p.onInteractive && (
          <button type="button" className="ml-pill" onClick={p.onInteractive}>
            Interactive search
          </button>
        )}
      </footer>
    </section>
  );
}
