import { useState, useRef, useMemo, useEffect, useContext, createContext, useCallback, type ReactNode, type CSSProperties, type KeyboardEvent } from 'react';
import './mediaLibrary.shared.css';
import { initials } from './agentOps.shared';

/* ── types (normalized) ──────────────────────────────────────────────────── */
export type ArtType = 'Primary' | 'Backdrop' | 'Logo' | 'Thumb' | 'Banner' | 'Art' | 'Disc' | 'Profile' | 'Screenshot';
export type ArtShape = 'portrait' | 'landscape' | 'square' | 'banner' | 'circle' | 'hex' | 'fill' | 'logo';
export type ItemKind = 'Movie' | 'Series' | 'Season' | 'Episode' | 'BoxSet' | 'MusicAlbum' | 'MusicArtist' | 'Audio' | 'AudioBook' | 'Book' | 'Photo' | 'PhotoAlbum' | 'Video' | 'TvChannel' | 'Program';

export interface MediaStreams {
  video?: { codec?: string; width?: number; height?: number; range?: 'SDR' | 'HDR10' | 'HDR10+' | 'DV' | 'HLG' };
  audio?: { codec?: string; channels?: number; atmos?: boolean; lang?: string }[];
  subs?: string[];
  container?: string;
  bitrate?: number;
}

export interface Person {
  id: string;
  name: string;
  role?: string;
  type: 'Actor' | 'Director' | 'Writer' | 'Producer' | 'Composer' | 'GuestStar' | string;
  art?: { Profile?: string };
}

export interface MediaItem {
  id: string;
  type: ItemKind;
  title: string;
  sortTitle?: string;
  year?: number;
  endYear?: number;
  premiere?: string;
  added?: string;
  overview?: string;
  tagline?: string;
  genres?: string[];
  runtimeMin?: number;
  official?: string;
  community?: number;
  critic?: number;
  art: Partial<Record<ArtType, string | string[]>>;
  blurhash?: Partial<Record<ArtType, string>>;
  accent?: string;
  played?: boolean;
  progress?: number;
  unplayed?: number;
  favorite?: boolean;
  childCount?: number;
  index?: number;
  parentIndex?: number;
  seriesTitle?: string;
  streams?: MediaStreams;
  people?: Person[];
  themeSong?: string;
  themeVideo?: string;
}

/** Pass a normalized `item`, or a raw Jellyfin/Emby `raw` BaseItemDto + `server` (+ optional `apiKey`). */
export interface ItemSource {
  item?: MediaItem;
  raw?: Record<string, unknown>;
  server?: string;
  apiKey?: string;
}

/* ── Jellyfin / Emby adapter ─────────────────────────────────────────────── */
export interface JellyfinOpts {
  server: string;
  apiKey?: string;
  maxWidth?: Partial<Record<ArtType, number>>;
  themeSongs?: Record<string, unknown>[];
  themeVideos?: Record<string, unknown>[];
}

const MAXW: Record<string, number> = { Primary: 600, Backdrop: 1600, Logo: 800, Thumb: 960, Banner: 1400, Art: 800, Disc: 500, Profile: 300, Screenshot: 1280 };

export function jellyfinImageUrl(server: string, id: string, type: ArtType | string, tag?: string, index?: number, maxWidth?: number, apiKey?: string) {
  const q = new URLSearchParams();
  if (tag) q.set('tag', tag);
  q.set('quality', '90');
  if (maxWidth) q.set('maxWidth', String(maxWidth));
  if (apiKey) q.set('api_key', apiKey);
  return server.replace(/\/$/, '') + '/Items/' + id + '/Images/' + type + (index != null ? '/' + index : '') + '?' + q;
}

const RANGE: Record<string, 'DV' | 'HDR10' | 'HDR10+' | 'HLG' | 'SDR'> = {
  DOVI: 'DV',
  DOVIWithHDR10: 'DV',
  DOVIWithHLG: 'DV',
  DOVIWithSDR: 'DV',
  HDR10: 'HDR10',
  HDR10Plus: 'HDR10+',
  HLG: 'HLG',
  SDR: 'SDR',
};

export function fromJellyfin(d: Record<string, unknown>, o: JellyfinOpts | string, apiKey?: string): MediaItem {
  const opts: JellyfinOpts = typeof o === 'string' ? { server: o, apiKey } : o;
  const s = opts.server, k = opts.apiKey, w = (t: string) => opts.maxWidth?.[t as ArtType] ?? MAXW[t];
  const url = (id: string, t: string, tag?: string, i?: number) => jellyfinImageUrl(s, id, t, tag, i, w(t), k);
  const tags = (d.ImageTags as Record<string, string> | undefined) || {};
  const bh = (d.ImageBlurHashes as Record<string, Record<string, string>> | undefined) || {};
  const art: MediaItem['art'] = {}, blur: MediaItem['blurhash'] = {};
  const own = (t: ArtType) => { if (tags[t]) { art[t] = url(d.Id as string, t, tags[t]); const b = bh[t]?.[tags[t]]; if (b) blur[t] = b; } };
  (['Primary', 'Logo', 'Thumb', 'Banner', 'Art', 'Disc'] as ArtType[]).forEach(own);
  if (!art.Primary && d.SeriesPrimaryImageTag && d.SeriesId) art.Primary = url(d.SeriesId as string, 'Primary', d.SeriesPrimaryImageTag as string);
  if (!art.Primary && d.AlbumPrimaryImageTag && d.AlbumId) art.Primary = url(d.AlbumId as string, 'Primary', d.AlbumPrimaryImageTag as string);
  if (!art.Logo && d.ParentLogoImageTag && d.ParentLogoItemId) art.Logo = url(d.ParentLogoItemId as string, 'Logo', d.ParentLogoImageTag as string);
  if (!art.Thumb && d.ParentThumbImageTag && d.ParentThumbItemId) art.Thumb = url(d.ParentThumbItemId as string, 'Thumb', d.ParentThumbImageTag as string);
  if (!art.Art && d.ParentArtImageTag && d.ParentArtItemId) art.Art = url(d.ParentArtItemId as string, 'Art', d.ParentArtImageTag as string);
  const bd: string[] = (d.BackdropImageTags as string[] | undefined)?.length ? (d.BackdropImageTags as string[]) : (d.ParentBackdropImageTags as string[] | undefined) || [];
  const bdId = (d.BackdropImageTags as string[] | undefined)?.length ? (d.Id as string) : (d.ParentBackdropItemId as string);
  if (bd.length && bdId) { art.Backdrop = bd.map((t: string, i: number) => url(bdId, 'Backdrop', t, i)); const b = bh.Backdrop?.[bd[0]!]; if (b) blur.Backdrop = b; }
  const rawSources = d.MediaSources as Array<{ MediaStreams?: Array<Record<string, unknown>>; Container?: string; Bitrate?: number }> | undefined;
  const rawStreams = (d.MediaStreams as Array<Record<string, unknown>> | undefined) || rawSources?.[0]?.MediaStreams || [];
  const v = rawStreams.find(x => x.Type === 'Video');
  const rangeVal = (v?.VideoRangeType as string) || (v?.VideoRange as string) || '';
  const streams: MediaStreams = {
    video: v ? { codec: v.Codec as string | undefined, width: v.Width as number | undefined, height: v.Height as number | undefined, range: RANGE[rangeVal] || (v.VideoRange === 'HDR' ? 'HDR10' : 'SDR') } : undefined,
    audio: rawStreams.filter(x => x.Type === 'Audio').map(a => ({ codec: a.Codec as string | undefined, channels: a.Channels as number | undefined, atmos: /atmos/i.test((String(a.Profile || '')) + (String(a.DisplayTitle || ''))), lang: a.Language as string | undefined })),
    subs: rawStreams.filter(x => x.Type === 'Subtitle').map(x => String(x.Language || x.DisplayTitle || '?').toUpperCase()),
    container: (d.Container as string | undefined) || rawSources?.[0]?.Container,
    bitrate: (d.Bitrate as number | undefined) || rawSources?.[0]?.Bitrate,
  };
  const ud = (d.UserData as Record<string, unknown> | undefined) || {};
  const stream = (kind: 'Audio' | 'Videos', x: Record<string, unknown>) => s.replace(/\/$/, '') + '/' + kind + '/' + x.Id + '/stream?static=true' + (k ? '&api_key=' + k : '');
  const people = ((d.People as Array<Record<string, unknown>> | undefined) || []).map(p => ({
    id: String(p.Id ?? ''),
    name: String(p.Name ?? ''),
    role: p.Role as string | undefined,
    type: String(p.Type ?? 'Actor'),
    art: p.PrimaryImageTag ? { Profile: url(String(p.Id), 'Primary', String(p.PrimaryImageTag)) } : {},
  }));
  return {
    id: String(d.Id ?? ''),
    type: (d.Type as ItemKind) ?? 'Movie',
    title: String(d.Name ?? ''),
    sortTitle: d.SortName as string | undefined,
    year: d.ProductionYear as number | undefined,
    endYear: d.EndDate ? new Date(d.EndDate as string).getFullYear() : undefined,
    premiere: d.PremiereDate as string | undefined,
    added: d.DateCreated as string | undefined,
    overview: d.Overview as string | undefined,
    tagline: (d.Taglines as string[] | undefined)?.[0],
    genres: d.Genres as string[] | undefined,
    runtimeMin: d.RunTimeTicks ? Math.round(Number(d.RunTimeTicks) / 6e8) : undefined,
    official: d.OfficialRating as string | undefined,
    community: d.CommunityRating as number | undefined,
    critic: d.CriticRating as number | undefined,
    art,
    blurhash: blur,
    played: ud.Played as boolean | undefined,
    progress:
      ud.PlayedPercentage != null
        ? Number(ud.PlayedPercentage) / 100
        : ud.PlaybackPositionTicks && d.RunTimeTicks
        ? Number(ud.PlaybackPositionTicks) / Number(d.RunTimeTicks)
        : undefined,
    unplayed: ud.UnplayedItemCount as number | undefined,
    favorite: ud.IsFavorite as boolean | undefined,
    childCount: d.ChildCount as number | undefined,
    index: d.IndexNumber as number | undefined,
    parentIndex: d.ParentIndexNumber as number | undefined,
    seriesTitle: d.SeriesName as string | undefined,
    streams,
    people,
    themeSong: opts.themeSongs?.[0] ? stream('Audio', opts.themeSongs[0]) : undefined,
    themeVideo: opts.themeVideos?.[0] ? stream('Videos', opts.themeVideos[0]) : undefined,
  };
}

export function useMediaItem(p: ItemSource): MediaItem | null {
  return useMemo(() => p.item ?? (p.raw && p.server ? fromJellyfin(p.raw, { server: p.server, apiKey: p.apiKey }) : null), [p.item, p.raw, p.server, p.apiKey]);
}

/* ── theme context: per-library overrides ────────────────────────────────── */
export interface MediaThemeValue {
  /** Fixed accent for this library. Used when artwork accent is off or unavailable. */
  accent?: string;
  /** Derive the accent from artwork (default true). */
  useArtAccent?: boolean;
  /** Backdrop rotation interval in ms; 0 disables (default 8000). */
  backdropInterval?: number;
  /** Theme video plays muted behind the hero (default true). */
  themeVideo?: boolean;
  /** Theme song / theme video audio start state (default 'muted'). */
  themeAudio?: 'muted' | 'on';
  /** Default card shape for the library. */
  shape?: 'portrait' | 'landscape' | 'square';
  label?: string;
}

export const MediaTheme = createContext<MediaThemeValue>({});
export const useMediaTheme = () => useContext(MediaTheme);

/* ── art resolution ──────────────────────────────────────────────────────── */
export const FALLBACK: Record<ArtType, ArtType[]> = {
  Primary: [],
  Backdrop: ['Thumb'],
  Thumb: ['Backdrop'],
  Banner: ['Thumb', 'Backdrop'],
  Logo: [],
  Art: ['Logo'],
  Disc: ['Primary'],
  Profile: [],
  Screenshot: ['Backdrop'],
};

export const list = (v?: string | string[]) => (!v ? [] : Array.isArray(v) ? v : [v]);

export function artChain(it: MediaItem | null, type: ArtType, fallback?: ArtType[]) {
  if (!it) return [];
  const types = [type, ...(fallback ?? FALLBACK[type])];
  return types.flatMap(t => list(it.art[t]).slice(0, 1).map(u => ({ type: t, url: u, blurhash: it.blurhash?.[t] })));
}

/* blurhash (decode for placeholders; DC term for a cheap accent) */
const B83 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%*+,-.:;=?@[]^_{|}~';
const d83 = (s: string) => { let v = 0; for (const c of s) v = v * 83 + B83.indexOf(c); return v; };
const s2l = (v: number) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const l2s = (v: number) => { v = Math.max(0, Math.min(1, v)); return Math.round((v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055) * 255); };
const sp = (b: number, e: number) => Math.sign(b) * Math.abs(b) ** e;
const bhCache = new Map<string, string | null>();

export function decodeBlurhash(h?: string, W = 32, H = 32): string | null {
  if (!h || h.length < 6) return null;
  if (bhCache.has(h)) return bhCache.get(h)!;
  try {
    const sf = d83(h[0]!), ny = Math.floor(sf / 9) + 1, nx = (sf % 9) + 1, max = (d83(h[1]!) + 1) / 166;
    if (h.length !== 4 + 2 * nx * ny) throw 0;
    const cols: number[][] = [];
    for (let i = 0; i < nx * ny; i++) {
      if (i === 0) { const v = d83(h.slice(2, 6)); cols.push([s2l(v >> 16), s2l((v >> 8) & 255), s2l(v & 255)]); }
      else { const v = d83(h.slice(4 + i * 2, 6 + i * 2)); cols.push([sp((Math.floor(v / 361) - 9) / 9, 2) * max, sp(((Math.floor(v / 19) % 19) - 9) / 9, 2) * max, sp(((v % 19) - 9) / 9, 2) * max]); }
    }
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');
    if (!ctx) return null;
    const img = ctx.createImageData(W, H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let r = 0, g = 0, b = 0;
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const bs = Math.cos((Math.PI * x * i) / W) * Math.cos((Math.PI * y * j) / H), c = cols[i + j * nx]!;
        r += c[0]! * bs; g += c[1]! * bs; b += c[2]! * bs;
      }
      const p = 4 * (x + y * W); img.data[p] = l2s(r); img.data[p + 1] = l2s(g); img.data[p + 2] = l2s(b); img.data[p + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    const out = cv.toDataURL(); bhCache.set(h, out); return out;
  } catch { bhCache.set(h, null); return null; }
}

export const blurhashAverage = (h?: string) => {
  if (!h || h.length < 6) return null;
  const v = d83(h.slice(2, 6));
  return toHex(v >> 16, (v >> 8) & 255, v & 255);
};

/* colour helpers — accents are normalised so they stay legible on dark glass */
const toHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
function rgb2hsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  let h = 0, s = 0;
  if (mx !== mn) {
    const d = mx - mn;
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h /= 6;
  }
  return [h, s, l] as const;
}

function hsl2hex(h: number, s: number, l: number) {
  const f = (n: number) => {
    const k = (n + h * 12) % 12, a = s * Math.min(l, 1 - l);
    return 255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)));
  };
  return toHex(f(0), f(8), f(4));
}

export function legibleAccent(hex: string) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1]!, 16), [h, s, l] = rgb2hsl(n >> 16, (n >> 8) & 255, n & 255);
  return hsl2hex(h, Math.max(s, 0.5), Math.min(Math.max(l, 0.58), 0.72));
}

const accCache = new Map<string, Promise<string | null>>();

/** Picks the most vivid, mid-luminance colour from an image. Needs CORS; resolves null when the canvas is tainted. */
export function extractAccent(url: string): Promise<string | null> {
  if (accCache.has(url)) return accCache.get(url)!;
  const p = new Promise<string | null>(res => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => {
      try {
        const S = 24, cv = document.createElement('canvas'); cv.width = S; cv.height = S;
        const ctx = cv.getContext('2d', { willReadFrequently: true });
        if (!ctx) { res(null); return; }
        ctx.drawImage(img, 0, 0, S, S);
        const d = ctx.getImageData(0, 0, S, S).data;
        let r = 0, g = 0, b = 0, wt = 0;
        for (let i = 0; i < d.length; i += 4) {
          const [, s, l] = rgb2hsl(d[i]!, d[i + 1]!, d[i + 2]!);
          const w = s * s * (1 - Math.abs(l - 0.5) * 2) + 0.002;
          r += d[i]! * w; g += d[i + 1]! * w; b += d[i + 2]! * w; wt += w;
        }
        res(legibleAccent(toHex(r / wt, g / wt, b / wt)));
      } catch {
        res(null);
      }
    };
    img.onerror = () => res(null);
    img.src = url;
  });
  accCache.set(url, p);
  return p;
}

export type AccentSource = 'artwork' | 'declared' | 'blurhash' | 'library' | 'default';

/** Resolves an item's accent: library override → artwork pixels → declared → blurhash DC → library → default. */
export function useAccent(it: MediaItem | null) {
  const th = useMediaTheme();
  const fixed = th.useArtAccent === false && th.accent;
  const primaryArt = list(it?.art.Primary)[0];
  const backdropArt = list(it?.art.Backdrop)[0];
  const thumbArt = list(it?.art.Thumb)[0];
  const srcs = useMemo(() => [primaryArt, backdropArt, thumbArt].filter(Boolean) as string[], [primaryArt, backdropArt, thumbArt]);
  const src = srcs.join('|');
  const interim = useCallback((): [string | undefined, AccentSource] => {
    if (fixed) return [th.accent, 'library'];
    if (it?.accent) return [legibleAccent(it.accent), 'declared'];
    const bhAvg = blurhashAverage(it?.blurhash?.Primary || it?.blurhash?.Backdrop);
    if (bhAvg) return [legibleAccent(bhAvg), 'blurhash'];
    if (th.accent) return [th.accent, 'library'];
    return [undefined, 'default'];
  }, [fixed, th.accent, it?.accent, it?.blurhash?.Primary, it?.blurhash?.Backdrop]);

  const [st, set] = useState<{ c?: string; s: AccentSource }>(() => {
    const [c, s] = interim();
    return { c, s };
  });

  useEffect(() => {
    let live = true;
    const [c, s] = interim();
    set({ c, s });
    if (!fixed && srcs.length) {
      (async () => {
        for (const u of srcs) {
          const x = await extractAccent(u);
          if (!live) return;
          if (x) {
            set({ c: x, s: 'artwork' });
            return;
          }
        }
      })();
    }
    return () => { live = false; };
  }, [it?.id, src, fixed, th.accent, interim, srcs]);

  return { accent: st.c, source: st.s, style: (st.c ? { ['--c' as string]: st.c } : {}) as CSSProperties };
}

/* ── <Art>: the one loader every component uses ──────────────────────────── */
export interface ArtResolution {
  phase: 'loading' | 'ready' | 'none';
  type?: ArtType;
  url?: string;
  step: number;
  tried: ArtType[];
}

export interface ArtProps {
  item: MediaItem | null;
  type?: ArtType;
  fallback?: ArtType[];
  shape?: ArtShape;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  eager?: boolean;
  /** Called whenever the resolved source changes. */
  onResolve?: (r: ArtResolution) => void;
  /** Swaps the src when the item has several (e.g. backdrop rotation). */
  index?: number;
  /** Demo-only: hold the image back to show the placeholder. */
  latency?: number;
  /** Rendered when every candidate fails. Default: title + [ NO_ART ]. */
  empty?: ReactNode;
}

export function Art({ item, type = 'Primary', fallback, shape = 'portrait', alt, className, style, children, eager, onResolve, index = 0, latency = 0, empty }: ArtProps) {
  const chain = useMemo(() => {
    const c = artChain(item, type, fallback);
    if (index && c[0]) {
      const l = list(item?.art[c[0].type]);
      if (l.length > 1) c[0] = { ...c[0], url: l[index % l.length]! };
    }
    return c;
  }, [item, type, fallback, index]);
  const key = chain.map(c => c.url).join('|');
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'ready' | 'none'>(chain.length ? 'loading' : 'none');
  const [held, setHeld] = useState(latency > 0);

  useEffect(() => {
    setStep(0);
    setPhase(chain.length ? 'loading' : 'none');
    setHeld(latency > 0);
    if (latency > 0) {
      const t = setTimeout(() => setHeld(false), latency);
      return () => clearTimeout(t);
    }
  }, [key, latency, chain.length]);

  const cur = chain[step];
  const onResolveRef = useRef(onResolve);
  onResolveRef.current = onResolve;

  useEffect(() => {
    onResolveRef.current?.({ phase, type: cur?.type, url: cur?.url, step, tried: chain.slice(0, step + 1).map(c => c.type) });
  }, [phase, step, key, cur?.type, cur?.url, chain]);

  const ph = decodeBlurhash(cur?.blurhash);
  const fail = () => {
    if (step + 1 < chain.length) {
      setStep(step + 1);
      setPhase('loading');
    } else {
      setPhase('none');
    }
  };
  const contain = shape === 'logo';

  return (
    <div className={'mlArt ' + (className || '')} data-shape={shape} data-fit={contain ? 'contain' : undefined} data-phase={phase} data-art-type={cur?.type} style={style}>
      {ph && phase !== 'none' && !contain && <img className="mlArt-ph" src={ph} alt="" aria-hidden="true" />}
      {cur && !held && phase !== 'none' && (
        <img
          key={cur.url}
          className="mlArt-img"
          src={cur.url}
          alt={alt ?? item?.title ?? ''}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          onLoad={() => setPhase('ready')}
          onError={fail}
        />
      )}
      {phase === 'none' && (empty !== undefined ? empty : (
        <span className="mlArt-none" aria-hidden="true">
          <b>{shape === 'circle' || shape === 'hex' ? (initials(item?.title || '') || '?') : item?.title}</b>
          <i>[ NO_ART ]</i>
        </span>
      ))}
      {children}
    </div>
  );
}

/* ── theme song / video + backdrop rotation ──────────────────────────────── */
export function useThemeMedia(it: MediaItem | null) {
  const th = useMediaTheme();
  const [on, setOn] = useState(th.themeAudio === 'on');
  const [videoReady, setVideoReady] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const hasVideo = !!it?.themeVideo && th.themeVideo !== false && !reduced;
  const hasSong = !!it?.themeSong;

  useEffect(() => {
    setVideoReady(false);
    setOn(th.themeAudio === 'on');
  }, [it?.id, th.themeAudio]);

  useEffect(() => {
    const a = audio.current, v = video.current;
    if (a) {
      a.volume = 0.35;
      if (on) a.play().catch(() => setOn(false));
      else a.pause();
    }
    if (v && !hasSong) {
      v.muted = !on;
      v.volume = 0.35;
    }
  }, [on, hasSong, it?.id]);

  return {
    hasSong,
    hasVideo,
    hasAny: hasSong || !!it?.themeVideo,
    on,
    videoReady,
    toggle: () => setOn(x => !x),
    audioProps: hasSong ? { ref: audio, src: it!.themeSong, loop: true, preload: 'none' as const } : null,
    videoProps: hasVideo ? { ref: video, src: it!.themeVideo, autoPlay: true, muted: true, loop: true, playsInline: true, preload: 'metadata' as const, onPlaying: () => setVideoReady(true), 'aria-hidden': true } : null,
    label: on ? 'Mute theme' : 'Play theme',
  };
}

export function useRotation(n: number, interval?: number) {
  const th = useMediaTheme();
  const ms = interval ?? th.backdropInterval ?? 8000;
  const [i, setI] = useState(0);

  useEffect(() => {
    setI(0);
    if (n < 2 || !ms) return;
    const t = setInterval(() => setI(x => (x + 1) % n), ms);
    return () => clearInterval(t);
  }, [n, ms]);

  return { index: i, set: setI, count: n };
}

/* ── formatting + derived metadata ───────────────────────────────────────── */
export { initials };
export const fmtRuntime = (m?: number) => (m == null ? '' : m >= 60 ? Math.floor(m / 60) + 'h ' + String(m % 60).padStart(2, '0') + 'm' : m + 'm');

/** Parses YYYY-MM-DD as a local date (no UTC shift). */
export const localDate = (s?: string) => {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  return m ? new Date(+m[1]!, +m[2]! - 1, +m[3]!) : new Date(s);
};

export const pad2 = (n?: number) => String(n ?? 0).padStart(2, '0');
export const endsAt = (min?: number, progress = 0) => {
  if (!min) return '';
  const d = new Date(Date.now() + min * (1 - progress) * 60000);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

export const yearSpan = (it: MediaItem) => (it.type === 'Series' && it.year ? it.year + '–' + (it.endYear ?? '') : it.year ? String(it.year) : '');
export const defaultShape = (it: MediaItem | null): 'portrait' | 'landscape' | 'square' => (!it ? 'portrait' : it.type === 'Episode' || it.type === 'Video' || it.type === 'TvChannel' || it.type === 'Program' ? 'landscape' : it.type === 'MusicAlbum' || it.type === 'Audio' || it.type === 'MusicArtist' || it.type === 'Photo' || it.type === 'AudioBook' ? 'square' : 'portrait');

/** Art type + fallbacks for a card shape (Jellyfin conventions). */
export const cardArt = (it: MediaItem | null, shape: string): { type: ArtType; fallback: ArtType[] } =>
  shape === 'landscape' ? (it?.type === 'Episode' ? { type: 'Primary', fallback: ['Thumb', 'Backdrop'] } : { type: 'Thumb', fallback: ['Backdrop'] })
    : shape === 'banner' ? { type: 'Banner', fallback: ['Thumb', 'Backdrop'] } : { type: 'Primary', fallback: [] };

export const subtitleFor = (it: MediaItem) =>
  it.type === 'Episode' ? 'S' + pad2(it.parentIndex) + 'E' + pad2(it.index) + (it.seriesTitle ? ' · ' + it.seriesTitle : '')
    : it.type === 'Series' ? [yearSpan(it), it.childCount ? it.childCount + (it.childCount === 1 ? ' season' : ' seasons') : ''].filter(Boolean).join(' · ')
      : [it.year, fmtRuntime(it.runtimeMin)].filter(Boolean).join(' · ');

export interface InfoBadge { key: string; label: string; group: 'video' | 'range' | 'audio' | 'subs' | 'rating' | 'official'; title: string }

const resLabel = (w?: number, h?: number) => (!w ? '' : w >= 3200 || (h ?? 0) >= 2000 ? '4K' : w >= 1800 ? '1080p' : w >= 1200 ? '720p' : 'SD');
const chLabel = (c?: number) => (!c ? '' : c === 8 ? '7.1' : c === 6 ? '5.1' : c === 2 ? 'Stereo' : c === 1 ? 'Mono' : c + 'ch');

export function mediaBadges(it: MediaItem | null): InfoBadge[] {
  if (!it) return [];
  const out: InfoBadge[] = [], v = it.streams?.video, a = it.streams?.audio?.[0];
  if (it.official) out.push({ key: 'off', label: it.official, group: 'official', title: 'Rated ' + it.official });
  if (v?.width) out.push({ key: 'res', label: resLabel(v.width, v.height), group: 'video', title: v.width + '×' + v.height });
  if (v?.range && v.range !== 'SDR') out.push({ key: 'rng', label: v.range === 'DV' ? 'Dolby Vision' : v.range, group: 'range', title: 'Dynamic range: ' + v.range });
  if (v?.codec) out.push({ key: 'vc', label: v.codec.toUpperCase(), group: 'video', title: 'Video codec ' + v.codec });
  if (a?.codec) out.push({ key: 'ac', label: a.codec.toUpperCase() + (a.channels ? ' ' + chLabel(a.channels) : ''), group: 'audio', title: 'Audio ' + a.codec + ' ' + chLabel(a.channels) });
  if (a?.atmos) out.push({ key: 'atm', label: 'Atmos', group: 'audio', title: 'Dolby Atmos' });
  if (it.streams?.subs?.length) out.push({ key: 'sub', label: 'CC ' + it.streams.subs.length, group: 'subs', title: 'Subtitles: ' + it.streams.subs.join(', ') });
  return out;
}

export function specRows(it: MediaItem | null) {
  if (!it?.streams) return [];
  const v = it.streams.video, au = it.streams.audio || [], rows: { k: string; v: string }[] = [];
  if (v) rows.push({ k: 'VIDEO', v: [v.codec?.toUpperCase(), v.width && v.width + '×' + v.height, v.range && v.range !== 'SDR' ? (v.range === 'DV' ? 'Dolby Vision' : v.range) : 'SDR'].filter(Boolean).join(' · ') });
  au.forEach((a, i) => rows.push({ k: i ? '' : 'AUDIO', v: [a.lang?.toUpperCase(), a.codec?.toUpperCase(), chLabel(a.channels), a.atmos && 'Atmos'].filter(Boolean).join(' · ') }));
  if (it.streams.subs?.length) rows.push({ k: 'SUBS', v: it.streams.subs.slice(0, 4).join(', ') + (it.streams.subs.length > 4 ? ' +' + (it.streams.subs.length - 4) : '') });
  if (it.streams.container) rows.push({ k: 'FILE', v: [it.streams.container.toUpperCase(), it.streams.bitrate && (it.streams.bitrate / 1e6).toFixed(1) + ' Mbps'].filter(Boolean).join(' · ') });
  return rows;
}

/** Roving focus that also keeps the focused item visible inside a horizontal or vertical scroller (no scrollIntoView). */
export function rove(sel: string, scroller?: () => HTMLElement | null) {
  return (e: KeyboardEvent<HTMLElement>) => {
    const fwd = e.key === 'ArrowRight' || e.key === 'ArrowDown', back = e.key === 'ArrowLeft' || e.key === 'ArrowUp';
    if (!fwd && !back && e.key !== 'Home' && e.key !== 'End') return;
    const items = Array.from(e.currentTarget.querySelectorAll(sel)) as HTMLElement[];
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    e.preventDefault();
    const n = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : Math.max(0, Math.min(items.length - 1, i + (fwd ? 1 : -1)));
    const el = items[n]!;
    el.focus({ preventScroll: true });
    const sc = scroller?.();
    if (sc) keepVisible(sc, el);
  };
}

export function keepVisible(sc: HTMLElement, el: HTMLElement) {
  const a = sc.getBoundingClientRect(), b = el.getBoundingClientRect();
  if (b.left < a.left) sc.scrollBy({ left: b.left - a.left - 8, behavior: 'smooth' });
  else if (b.right > a.right) sc.scrollBy({ left: b.right - a.right + 8, behavior: 'smooth' });
  if (b.top < a.top) sc.scrollBy({ top: b.top - a.top - 8, behavior: 'smooth' });
  else if (b.bottom > a.bottom) sc.scrollBy({ top: b.bottom - a.bottom + 8, behavior: 'smooth' });
}

/** Horizontal shelf scroll state: prev/next availability + visible range. */
export function useShelfScroll<T extends HTMLElement = HTMLDivElement>(count: number) {
  const ref = useRef<T>(null);
  const [st, set] = useState({ prev: false, next: count > 0, first: 0, last: 0 });
  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const kids = Array.from(el.children) as HTMLElement[];
    const L = el.scrollLeft, R = L + el.clientWidth;
    let first = -1, last = -1;
    kids.forEach((k, i) => {
      const a = k.offsetLeft - el.offsetLeft, b = a + k.offsetWidth;
      if (b > L + 4 && a < R - 4) {
        if (first < 0) first = i;
        last = i;
      }
    });
    set({ prev: L > 2, next: L + el.clientWidth < el.scrollWidth - 2, first: Math.max(0, first), last: Math.max(0, last) });
  }, []);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [count, measure]);

  const page = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' });
  };

  return { ref, ...st, onScroll: measure, page };
}

/* ── MediaHero helper ────────────────────────────────────────────────────── */
export interface MediaHeroProps extends ItemSource {
  onPlay?: (it: MediaItem, resume: boolean) => void;
  onTrailer?: (it: MediaItem) => void;
  onPlayedChange?: (played: boolean, it: MediaItem) => void;
  onFavoriteChange?: (favorite: boolean, it: MediaItem) => void;
  /** Overrides the library theme's rotation interval (ms, 0 = off). */
  backdropInterval?: number;
  className?: string;
}

export function useHero(p: MediaHeroProps) {
  const it = useMediaItem(p);
  const acc = useAccent(it);
  const backdrops = it ? (list(it.art.Backdrop).length ? list(it.art.Backdrop) : ['x']) : [];
  const rot = useRotation(backdrops.length, p.backdropInterval);
  const tm = useThemeMedia(it);
  const [played, setPlayed] = useState(!!it?.played);
  const [fav, setFav] = useState(!!it?.favorite);

  useEffect(() => {
    setPlayed(!!it?.played);
    setFav(!!it?.favorite);
  }, [it?.id, it?.played, it?.favorite]);

  const resume = !played && (it?.progress ?? 0) > 0;
  return {
    it,
    acc,
    rot,
    tm,
    played,
    fav,
    resume,
    backdrops,
    pct: Math.round((it?.progress ?? 0) * 100),
    year: it ? yearSpan(it) : '',
    runtime: fmtRuntime(it?.runtimeMin),
    ends: endsAt(it?.runtimeMin, resume ? it?.progress : 0),
    play: () => { if (it) p.onPlay?.(it, resume); },
    trailer: p.onTrailer && it ? () => p.onTrailer!(it) : undefined,
    togglePlayed: () => { if (!it) return; const v = !played; setPlayed(v); p.onPlayedChange?.(v, it); },
    toggleFav: () => { if (!it) return; const v = !fav; setFav(v); p.onFavoriteChange?.(v, it); },
  };
}

/* ── PosterCard helper ───────────────────────────────────────────────────── */
export interface PosterCardProps extends ItemSource {
  /** Default comes from the library theme, then the item type (Episode → landscape, Album → square). */
  shape?: 'portrait' | 'landscape' | 'square' | 'banner';
  width?: number | string;
  showTitle?: boolean;
  selected?: boolean;
  onOpen?: (it: MediaItem) => void;
  onPlay?: (it: MediaItem) => void;
  onPlayedChange?: (played: boolean, it: MediaItem) => void;
  onFavoriteChange?: (favorite: boolean, it: MediaItem) => void;
  className?: string;
  latency?: number;
}

export function usePosterCard(p: PosterCardProps) {
  const it = useMediaItem(p);
  const th = useMediaTheme();
  const shape = p.shape ?? th.shape ?? defaultShape(it);
  const art = cardArt(it, shape);
  const { style, accent } = useAccent(it);
  const [played, setPlayed] = useState(!!it?.played);
  const [fav, setFav] = useState(!!it?.favorite);

  useEffect(() => {
    setPlayed(!!it?.played);
    setFav(!!it?.favorite);
  }, [it?.id, it?.played, it?.favorite]);

  const progress = !played && it?.progress ? it.progress : 0;
  return {
    it,
    shape,
    art,
    accent,
    played,
    fav,
    progress,
    left: progress && it?.runtimeMin ? Math.max(1, Math.round(it.runtimeMin * (1 - progress))) : 0,
    unplayed: !played && it?.unplayed ? it.unplayed : 0,
    sub: it ? subtitleFor(it) : '',
    res: mediaBadges(it).find(b => b.key === 'res')?.label,
    style: { ...style, ...(p.width != null ? { width: p.width } : {}) } as CSSProperties,
    open: () => { if (it) p.onOpen?.(it); },
    play: () => { if (it) p.onPlay?.(it); },
    togglePlayed: () => { if (!it) return; const v = !played; setPlayed(v); p.onPlayedChange?.(v, it); },
    toggleFav: () => { if (!it) return; const v = !fav; setFav(v); p.onFavoriteChange?.(v, it); },
  };
}

/* ── LibraryGrid helper ──────────────────────────────────────────────────── */
export type LibSort = 'title' | 'year' | 'runtime';
export type LibFilter = 'all' | 'unplayed' | 'resume' | 'favorites';

export interface LibraryGridProps {
  items: MediaItem[];
  title?: string;
  /** Path-style label for the structured lane, e.g. ~/library/films */
  path?: string;
  defaultSort?: LibSort;
  defaultFilter?: LibFilter;
  /** Max height of the scroll area (default 520). */
  height?: number;
  onOpen?: (it: MediaItem) => void;
  onPlay?: (it: MediaItem) => void;
  className?: string;
}

export const sortKey = (it: MediaItem) => (it.sortTitle || it.title).replace(/^(the|a|an)\s+/i, '').toUpperCase();
export const letterOf = (it: MediaItem) => { const c = sortKey(it)[0] || '#'; return /[A-Z]/.test(c) ? c : '#'; };
export const LETTERS = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
export const SORTS: { v: LibSort; l: string }[] = [{ v: 'title', l: 'Name' }, { v: 'year', l: 'Year' }, { v: 'runtime', l: 'Runtime' }];
export const FILTERS: { v: LibFilter; l: string }[] = [{ v: 'all', l: 'All' }, { v: 'unplayed', l: 'Unplayed' }, { v: 'resume', l: 'Resume' }, { v: 'favorites', l: 'Favorites' }];

export function useLibrary(p: LibraryGridProps) {
  const [sort, setSort] = useState<LibSort>(p.defaultSort ?? 'title');
  const [filter, setFilter] = useState<LibFilter>(p.defaultFilter ?? 'all');
  const [active, setActive] = useState<string | null>(null);
  const sc = useRef<HTMLDivElement>(null);

  const rows = useMemo(() => {
    const f = p.items.filter(it => (filter === 'all' ? true : filter === 'unplayed' ? !it.played : filter === 'resume' ? !it.played && (it.progress ?? 0) > 0 : !!it.favorite));
    return [...f].sort((a, b) => (sort === 'title' ? sortKey(a).localeCompare(sortKey(b)) : sort === 'year' ? (b.year ?? 0) - (a.year ?? 0) : (b.runtimeMin ?? 0) - (a.runtimeMin ?? 0)));
  }, [p.items, sort, filter]);

  const available = useMemo(() => new Set(sort === 'title' ? rows.map(letterOf) : []), [rows, sort]);

  const measure = useCallback(() => {
    const el = sc.current;
    if (!el || sort !== 'title') {
      setActive(null);
      return;
    }
    const cards = Array.from(el.querySelectorAll('[data-letter]')) as HTMLElement[];
    const hit = cards.find(c => c.offsetTop + c.offsetHeight > el.scrollTop + 4);
    setActive(hit?.dataset.letter ?? null);
  }, [sort]);

  useEffect(() => {
    measure();
  }, [rows, measure]);

  const jump = (L: string) => {
    const el = sc.current;
    if (!el) return;
    const i = LETTERS.indexOf(L), target = LETTERS.slice(i).find(x => available.has(x));
    if (!target) return;
    const card = el.querySelector('[data-letter="' + target + '"]') as HTMLElement | null;
    if (card) {
      if (typeof el.scrollTo === 'function') {
        el.scrollTo({ top: card.offsetTop - 6, behavior: 'smooth' });
      } else {
        el.scrollTop = card.offsetTop - 6;
      }
      setActive(target);
      (card.querySelector('[data-card-open]') as HTMLElement | null)?.focus({ preventScroll: true });
    }
  };

  return {
    rows,
    sort,
    setSort,
    filter,
    setFilter,
    sc,
    active,
    available,
    jump,
    onScroll: measure,
    alpha: sort === 'title',
    letterOf,
    count: rows.length,
    total: p.items.length,
    onKeyDown: rove('[data-card-open]', () => sc.current),
  };
}

/* ── EpisodeList helper ──────────────────────────────────────────────────── */
export interface Season { id: string; name: string; index?: number; episodes: MediaItem[] }
export interface EpisodeListProps {
  seasons: Season[];
  seasonId?: string;
  defaultSeasonId?: string;
  onSeasonChange?: (id: string) => void;
  /** Defaults to the first unplayed episode of the active season. */
  nextUpId?: string;
  onPlay?: (ep: MediaItem) => void;
  onOpen?: (ep: MediaItem) => void;
  className?: string;
}

export function useEpisodes(p: EpisodeListProps) {
  const [own, setOwn] = useState(p.defaultSeasonId ?? p.seasons.find(s => s.episodes.length)?.id ?? p.seasons[0]?.id);
  const sid = p.seasonId ?? own;
  const season = p.seasons.find(s => s.id === sid) ?? p.seasons[0];
  const [open, setOpen] = useState<string | null>(null);
  const eps = season?.episodes ?? [];
  const nextUp = p.nextUpId ?? eps.find(e => !e.played)?.id;

  return {
    season,
    eps,
    nextUp,
    open,
    toggle: (id: string) => setOpen(o => (o === id ? null : id)),
    pick: (id: string) => { setOwn(id); setOpen(null); p.onSeasonChange?.(id); },
    tabs: p.seasons.map(s => ({ ...s, active: s.id === season?.id, count: s.episodes.length, watched: s.episodes.filter(e => e.played).length })),
    onKeyDown: rove('[data-ep-btn]'),
    tabKeys: rove('[data-season-tab]'),
  };
}

/* ── CastStrip helper ────────────────────────────────────────────────────── */
export interface CastStripProps {
  people: Person[];
  title?: string;
  max?: number;
  onSelect?: (p: Person) => void;
  className?: string;
}

const CREW = ['Director', 'Writer', 'Producer', 'Composer'];
const CREW_L: Record<string, string> = { Director: 'Directed by', Writer: 'Written by', Producer: 'Produced by', Composer: 'Music by' };

export function useCast(p: CastStripProps) {
  const cast = p.people.filter(x => x.type === 'Actor' || x.type === 'GuestStar');
  const shown = p.max ? cast.slice(0, p.max) : cast;
  const crew = CREW.map(t => ({ type: t, label: CREW_L[t]!, people: p.people.filter(x => x.type === t) })).filter(g => g.people.length);
  return { cast: shown, more: cast.length - shown.length, crew, select: (x: Person) => p.onSelect?.(x), onKeyDown: rove('[data-person]') };
}

export const personItem = (x: Person): MediaItem => ({ id: x.id, type: 'Video', title: x.name, art: { Profile: x.art?.Profile } as Partial<Record<ArtType, string>> });

/* ── MediaShelf helper ───────────────────────────────────────────────────── */
export interface MediaShelfProps {
  title: string;
  items: MediaItem[];
  /** Card shape for the row. Continue Watching / Next Up read best as landscape. */
  shape?: 'portrait' | 'landscape' | 'square';
  /** Card width in px (default 132 portrait / 236 landscape / 150 square). */
  cardWidth?: number;
  onSeeAll?: () => void;
  onOpen?: (it: MediaItem) => void;
  onPlay?: (it: MediaItem) => void;
  emptyText?: string;
  className?: string;
}

export const shelfWidth = (shape?: string, w?: number) => w ?? (shape === 'landscape' ? 236 : shape === 'square' ? 150 : 132);
