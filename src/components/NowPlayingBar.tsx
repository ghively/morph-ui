import './NowPlayingBar.css';
import { useState, useRef, type PointerEvent as RPE } from 'react';
import { Art, useAccent, type MediaItem } from './mediaLibrary.shared';
import { TextCharSlide } from './TextCharSlide';

export type Repeat = 'off' | 'all' | 'one';

export interface NowPlayingBarProps {
  track: MediaItem & { artist?: string; album?: string };
  /** Seconds. */
  position: number;
  duration: number;
  playing: boolean;
  shuffle?: boolean;
  repeat?: Repeat;
  volume?: number;
  muted?: boolean;
  queueCount?: number;
  hasPrev?: boolean;
  hasNext?: boolean;
  onPlayPause: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onSeek?: (t: number) => void;
  onShuffle?: () => void;
  onRepeat?: () => void;
  onVolume?: (v: number) => void;
  onMute?: () => void;
  onQueue?: () => void;
  onLyrics?: () => void;
  onOpen?: () => void;
  className?: string;
}

function useDragValue(onCommit?: (v: number) => void) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState<number | null>(null);
  const at = (x: number) => {
    const r = ref.current!.getBoundingClientRect();
    return Math.max(0, Math.min(1, (x - r.left) / r.width));
  };
  return {
    ref,
    v,
    props: {
      onPointerDown: (e: RPE<HTMLDivElement>) => {
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        setV(at(e.clientX));
      },
      onPointerMove: (e: RPE<HTMLDivElement>) => {
        if (v != null) setV(at(e.clientX));
      },
      onPointerUp: (e: RPE<HTMLDivElement>) => {
        if (v != null) {
          onCommit?.(at(e.clientX));
          setV(null);
        }
      },
    },
  };
}

export function NowPlayingBar(p: NowPlayingBarProps) {
  const acc = useAccent(p.track);
  const seek = useDragValue(f => p.onSeek?.(f * p.duration));
  const vol = useDragValue(f => p.onVolume?.(f));
  const frac = seek.v ?? (p.duration ? p.position / p.duration : 0);
  const vf = vol.v ?? (p.muted ? 0 : p.volume ?? 1);
  const rep = p.repeat ?? 'off';

  return (
    <div className={'ml npA ' + (p.className || '')} style={acc.style} data-playing={p.playing ? '' : undefined}>
      <div className="npA-glow" aria-hidden="true" />
      <div className="npA-in">
        <button
          type="button"
          className="npA-now"
          onClick={p.onOpen}
          aria-label={'Now playing: ' + p.track.title + (p.track.artist ? ' by ' + p.track.artist : '')}
        >
          <Art item={p.track} type="Primary" shape="square" alt="" className="npA-art" />
          <span className="npA-meta">
            <span className="npA-title">
              <TextCharSlide key={p.track.id} text={p.track.title} />
            </span>
            <span className="npA-artist ml-ell">{[p.track.artist, p.track.album].filter(Boolean).join(' · ')}</span>
          </span>
          <span className="npA-eq" aria-hidden="true">
            <b />
            <b />
            <b />
            <b />
          </span>
        </button>
        <div className="npA-center">
          <div className="npA-ctl">
            {p.onShuffle && (
              <button type="button" className="ml-icon" aria-pressed={!!p.shuffle} onClick={p.onShuffle} aria-label="Shuffle">
                ⤮
              </button>
            )}
            <button type="button" className="ml-icon" onClick={p.onPrev} disabled={p.hasPrev === false} aria-label="Previous">
              ⇤
            </button>
            <button type="button" className="ml-icon" data-tone="accent" onClick={p.onPlayPause} aria-label={p.playing ? 'Pause' : 'Play'}>
              {p.playing ? '❚❚' : '▶'}
            </button>
            <button type="button" className="ml-icon" onClick={p.onNext} disabled={p.hasNext === false} aria-label="Next">
              ⇥
            </button>
            {p.onRepeat && (
              <button type="button" className="ml-icon npA-rep" aria-pressed={rep !== 'off'} onClick={p.onRepeat} aria-label={'Repeat: ' + rep}>
                ↻{rep === 'one' && <small>1</small>}
              </button>
            )}
          </div>
          <div className="npA-seek">
            <span className="ml-num">{Math.floor((frac * p.duration) / 60) + ':' + String(Math.floor((frac * p.duration) % 60)).padStart(2, '0')}</span>
            <div
              ref={seek.ref}
              className="npA-track"
              role="slider"
              tabIndex={0}
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={Math.round(p.duration)}
              aria-valuenow={Math.round(p.position)}
              aria-valuetext={String(Math.floor(p.position / 60)) + ':' + String(Math.floor(p.position % 60)).padStart(2, '0')}
              onKeyDown={e => {
                if (e.key === 'ArrowRight') p.onSeek?.(Math.min(p.duration, p.position + 5));
                if (e.key === 'ArrowLeft') p.onSeek?.(Math.max(0, p.position - 5));
              }}
              {...seek.props}
            >
              <div className="ml-bar">
                <i style={{ width: frac * 100 + '%' }} />
              </div>
              <span className="npA-knob" style={{ left: frac * 100 + '%' }} />
            </div>
            <span className="ml-num">{Math.floor(p.duration / 60) + ':' + String(Math.floor(p.duration % 60)).padStart(2, '0')}</span>
          </div>
        </div>
        <div className="npA-right">
          {p.onLyrics && (
            <button type="button" className="ml-icon" onClick={p.onLyrics} aria-label="Lyrics">
              ❝
            </button>
          )}
          {p.onQueue && (
            <button type="button" className="ml-icon npA-q" onClick={p.onQueue} aria-label={'Queue, ' + (p.queueCount ?? 0) + ' tracks'}>
              ≡{p.queueCount ? <small className="ml-num">{p.queueCount}</small> : null}
            </button>
          )}
          <button type="button" className="ml-icon" onClick={p.onMute} aria-pressed={!!p.muted} aria-label={p.muted ? 'Unmute' : 'Mute'}>
            <span className="npA-spk" data-level={p.muted || vf === 0 ? 0 : vf < 0.4 ? 1 : vf < 0.75 ? 2 : 3} aria-hidden="true">
              <b />
              <b />
              <b />
            </span>
          </button>
          <div
            ref={vol.ref}
            className="npA-vol"
            role="slider"
            tabIndex={0}
            aria-label="Volume"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(vf * 100)}
            onKeyDown={e => {
              if (e.key === 'ArrowRight') p.onVolume?.(Math.min(1, vf + 0.05));
              if (e.key === 'ArrowLeft') p.onVolume?.(Math.max(0, vf - 0.05));
            }}
            {...vol.props}
          >
            <div className="ml-bar">
              <i style={{ width: vf * 100 + '%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
