import './TrackPicker.css';
import { useState } from 'react';
import { useAccent, type MediaItem } from './mediaLibrary.shared';

export interface AudioTrack {
  index: number;
  label: string;
  lang?: string;
  codec?: string;
  channels?: number;
  atmos?: boolean;
  isDefault?: boolean;
}

export interface SubtitleTrack {
  index: number;
  label: string;
  lang?: string;
  codec?: string;
  forced?: boolean;
  sdh?: boolean;
  external?: boolean;
  isDefault?: boolean;
}

export interface QualityOption {
  id: string;
  label: string;
  /** bits/s; omit for Auto/Original */
  bitrate?: number;
  height?: number;
}

export interface TrackSelection {
  audio: number;
  subtitle: number;
  quality: string;
}

export interface TrackPickerProps {
  audio: AudioTrack[];
  subtitles: SubtitleTrack[];
  qualities?: QualityOption[];
  /** Source stream, used to tell Direct Play from Transcode. */
  source?: { bitrate?: number; height?: number };
  value: TrackSelection;
  onChange: (v: TrackSelection) => void;
  defaultTab?: 'audio' | 'subtitles' | 'quality';
  item?: MediaItem;
  className?: string;
}

const IMAGE_SUBS = /pgs|vobsub|dvd_?sub|dvb/i;
const CH = (c?: number) => (!c ? '' : c === 8 ? '7.1' : c === 6 ? '5.1' : c === 2 ? 'Stereo' : c + 'ch');

export const DEFAULT_QUALITIES: QualityOption[] = [
  { id: 'auto', label: 'Auto' },
  { id: 'orig', label: 'Original' },
  { id: '4k40', label: '4K', bitrate: 40e6, height: 2160 },
  { id: '1080p10', label: '1080p', bitrate: 10e6, height: 1080 },
  { id: '720p4', label: '720p', bitrate: 4e6, height: 720 },
  { id: '480p1', label: '480p', bitrate: 1.5e6, height: 480 },
];

/** Builds track lists from a normalized item. */
export function tracksFromItem(it: MediaItem) {
  const audio: AudioTrack[] = (it.streams?.audio ?? []).map((a, i) => ({
    index: i + 1,
    label: (a.lang || 'und').toUpperCase(),
    lang: a.lang,
    codec: a.codec,
    channels: a.channels,
    atmos: a.atmos,
    isDefault: i === 0,
  }));
  const subtitles: SubtitleTrack[] = (it.streams?.subs ?? []).map((s, i) => ({
    index: 10 + i,
    label: s,
    lang: s.toLowerCase(),
    codec: i % 3 === 2 ? 'pgssub' : 'subrip',
  }));
  return { audio, subtitles };
}

function Opt({ on, onPick, title, meta, tags, tone }: { on: boolean; onPick: () => void; title: string; meta?: string; tags?: string[]; tone?: 'ok' | 'warn' }) {
  return (
    <button type="button" role="radio" aria-checked={on} className="tpA-opt" onClick={onPick}>
      <span className="tpA-radio" aria-hidden="true" />
      <span className="tpA-main">
        <span className="tpA-t">{title}</span>
        {meta && <span className="tpA-m">{meta}</span>}
      </span>
      {tags?.filter(Boolean).map(t => (
        <span key={t} className="ml-chip" style={tone ? { ['--k' as string]: tone === 'warn' ? 'var(--state-warn)' : 'var(--state-ok)' } : undefined}>
          {t}
        </span>
      ))}
    </button>
  );
}

export function TrackPicker(p: TrackPickerProps) {
  const acc = useAccent(p.item ?? null);
  const [tab, setTab] = useState(p.defaultTab ?? 'audio');
  const qs = p.qualities ?? DEFAULT_QUALITIES;
  const q = qs.find(x => x.id === p.value.quality);
  const transcoding = !!q?.bitrate && !!p.source?.bitrate && q.bitrate < p.source.bitrate;
  const sub = p.subtitles.find(s => s.index === p.value.subtitle);
  const burn = transcoding && sub && IMAGE_SUBS.test(sub.codec || '');
  const set = <K extends keyof TrackSelection>(k: K, v: TrackSelection[K]) => p.onChange({ ...p.value, [k]: v });
  const a = p.audio.find(x => x.index === p.value.audio);
  const tabs = [
    { id: 'audio', l: 'Audio', s: a ? a.label + ' ' + CH(a.channels) : '' },
    { id: 'subtitles', l: 'Subtitles', s: sub ? sub.label : 'Off' },
    { id: 'quality', l: 'Quality', s: q?.label ?? 'Auto' },
  ] as const;

  return (
    <div className={'ml tpA ml-glass ' + (p.className || '')} style={acc.style}>
      <div className="ml-tabs tpA-tabs" role="tablist" aria-label="Playback tracks">
        {tabs.map(t => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>
            {t.l}
            <small>{t.s}</small>
          </button>
        ))}
      </div>
      <div className="tpA-body" role="radiogroup" aria-label={tab}>
        {tab === 'audio' &&
          p.audio.map(x => (
            <Opt
              key={x.index}
              on={p.value.audio === x.index}
              onPick={() => set('audio', x.index)}
              title={x.label + (x.isDefault ? ' · Default' : '')}
              meta={[x.codec?.toUpperCase(), CH(x.channels), x.atmos && 'Atmos'].filter(Boolean).join(' · ')}
            />
          ))}
        {tab === 'subtitles' && (
          <>
            <Opt on={p.value.subtitle === -1} onPick={() => set('subtitle', -1)} title="Off" />
            {p.subtitles.map(x => (
              <Opt
                key={x.index}
                on={p.value.subtitle === x.index}
                onPick={() => set('subtitle', x.index)}
                title={x.label}
                meta={[x.codec && (IMAGE_SUBS.test(x.codec) ? 'Image · ' : 'Text · ') + x.codec.toUpperCase(), x.external && 'External'].filter(Boolean).join(' · ')}
                tags={[x.forced && 'Forced', x.sdh && 'SDH', x.isDefault && 'Default'].filter(Boolean) as string[]}
              />
            ))}
          </>
        )}
        {tab === 'quality' &&
          qs.map(x => {
            const tc = !!x.bitrate && !!p.source?.bitrate && x.bitrate < p.source.bitrate;
            return (
              <Opt
                key={x.id}
                on={p.value.quality === x.id}
                onPick={() => set('quality', x.id)}
                title={x.label}
                meta={
                  x.bitrate
                    ? (x.bitrate / 1e6).toFixed(x.bitrate < 1e7 ? 1 : 0) + ' Mbps'
                    : x.id === 'auto'
                      ? 'Adapts to bandwidth'
                      : p.source?.bitrate
                        ? (p.source.bitrate / 1e6).toFixed(1) + ' Mbps source'
                        : 'Source'
                }
                tags={[x.id === 'auto' ? '' : tc ? 'Transcode' : 'Direct']}
                tone={tc ? 'warn' : 'ok'}
              />
            );
          })}
      </div>
      <div className="tpA-foot" aria-live="polite">
        <span className="ml-chip" data-mldot="" style={{ ['--k' as string]: transcoding ? 'var(--state-warn)' : 'var(--state-ok)' }}>
          {transcoding ? 'Transcoding' : 'Direct play'}
        </span>
        {burn && <span className="tpA-warn">Image subtitles will be burned in while transcoding.</span>}
      </div>
    </div>
  );
}
