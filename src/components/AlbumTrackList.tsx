import './AlbumTrackList.css';
import { useState } from 'react';
import { Art, useAccent, rove, type MediaItem } from './mediaLibrary.shared';

export interface Track extends MediaItem {
  artist: string;
  album: string;
  albumId: string;
  seconds: number;
  disc: number;
}

export const fmtS = (s: number) => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');

export interface AlbumTrackListProps {
  album: MediaItem & { artist?: string };
  tracks: Track[];
  /** Id of the playing track (shows the EQ). */
  nowPlayingId?: string;
  playing?: boolean;
  onPlay?: (t: Track, all: Track[]) => void;
  onPlayAll?: (shuffle: boolean) => void;
  onFavoriteChange?: (fav: boolean, t: Track) => void;
  className?: string;
}

export function AlbumTrackList(p: AlbumTrackListProps) {
  const acc = useAccent(p.album);
  const [favs, setFavs] = useState(() => new Set(p.tracks.filter(t => t.favorite).map(t => t.id)));
  const total = p.tracks.reduce((s, t) => s + t.seconds, 0);
  const discs = [...new Set(p.tracks.map(t => t.disc))];

  const fav = (t: Track) => {
    const n = new Set(favs);
    const on = !n.has(t.id);
    if (on) n.add(t.id);
    else n.delete(t.id);
    setFavs(n);
    p.onFavoriteChange?.(on, t);
  };

  return (
    <section className={'ml atA ml-glass ' + (p.className || '')} style={acc.style} aria-label={p.album.title}>
      <header className="atA-head">
        <Art item={p.album} type="Primary" shape="square" alt="" className="atA-art" eager />
        <div className="atA-info">
          <span className="atA-kind">Album</span>
          <h3 className="atA-title">{p.album.title}</h3>
          <span className="atA-meta ml-num">
            {[p.album.artist, p.album.year, p.tracks.length + ' tracks', Math.round(total / 60) + ' min'].filter(Boolean).join(' · ')}
          </span>
          <div className="atA-acts">
            <button type="button" className="ml-pill" data-tone="accent" onClick={() => p.onPlayAll?.(false)}>
              ▶ Play
            </button>
            <button type="button" className="ml-pill" onClick={() => p.onPlayAll?.(true)}>
              ⤮ Shuffle
            </button>
          </div>
        </div>
      </header>
      <div className="atA-list" onKeyDown={rove('[data-track]')}>
        {discs.map(d => (
          <div key={d} role="list" aria-label={discs.length > 1 ? 'Disc ' + d : 'Tracks'}>
            {discs.length > 1 && <div className="atA-disc">Disc {d}</div>}
            {p.tracks
              .filter(t => t.disc === d)
              .map(t => {
                const now = t.id === p.nowPlayingId;
                const on = favs.has(t.id);
                return (
                  <div key={t.id} role="listitem" className="atA-row ml-li" data-active={now ? '' : undefined}>
                    <button
                      type="button"
                      className="atA-btn"
                      data-track=""
                      onClick={() => p.onPlay?.(t, p.tracks)}
                      aria-label={'Play ' + t.title}
                      aria-current={now || undefined}
                    >
                      <span className="atA-n ml-num">
                        {now ? (
                          <span className="atA-eq" data-on={p.playing ? '' : undefined} aria-hidden="true">
                            <b />
                            <b />
                            <b />
                          </span>
                        ) : (
                          t.index
                        )}
                      </span>
                      <span className="atA-play" aria-hidden="true">
                        ▶
                      </span>
                      <span className="atA-t ml-ell">
                        {t.title}
                        {t.artist !== p.album.artist && <small> · {t.artist}</small>}
                      </span>
                      <span className="atA-d ml-num">{fmtS(t.seconds)}</span>
                    </button>
                    <button
                      type="button"
                      className="atA-fav"
                      data-on={on ? '' : undefined}
                      aria-pressed={on}
                      aria-label={on ? 'Remove favorite' : 'Add favorite'}
                      onClick={() => fav(t)}
                    >
                      ★
                    </button>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </section>
  );
}
