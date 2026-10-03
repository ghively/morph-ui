import React, { type ReactNode } from 'react';
import type { MediaItem, Person, MediaThemeValue } from '../mediaLibrary.shared';

/* ── demo data: Blender Foundation open movies (CC BY), via Wikimedia Commons ─ */
/* Direct upload.wikimedia.org thumbs (they send CORS headers, so accent extraction can read pixels). Paths are md5-derived. */
export const HASH: Record<string, string> = {
  'Tos-poster.png': '7/70',
  'Tears_of_Steel_frame_01_2a.jpg': '1/18',
  'Tears_of_Steel_frame_08_4a.jpg': '4/4b',
  'Tears_of_Steel_frame_09_1a.jpg': '1/12',
  'Sintel_poster.jpg': '8/8f',
  'Sintel_Poster_Paintover_clean.jpg': 'f/f3',
  'Big_buck_bunny_poster_big.jpg': 'c/c5',
  'Bunny-bow.png': '1/1b',
  'Blender_Foundation_-_Caminandes_-_Episode_3_-_Llamigos_-_Cover_thumbnail.png': 'a/aa',
  'Blender_Foundation_-_Caminandes_-_Episode_3_-_Llamigos_-_Koro_and_Oti_share_more_food_to_eat_at_night.png': 'b/b2',
  'Blender_Foundation_-_Caminandes_-_Episode_3_-_Llamigos_-_Riding_mine_cart_with_Koro_and_Oti_while_carrying_a_red_grape.png': 'd/d9',
};

export const STEP = [250, 330, 500, 960, 1280, 1920];
export const CF = (f: string, w: number) => {
  const s = STEP.find(x => x >= w) ?? 1920, h = HASH[f];
  return h
    ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/' + h + '/' + encodeURIComponent(f) + '/' + s + 'px-' + encodeURIComponent(f)
    : 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(f) + '?width=' + w;
};

export const LLAMA = 'Blender_Foundation_-_Caminandes_-_Episode_3_-_Llamigos_-_';
export const SINTEL_WEBM = 'https://upload.wikimedia.org/wikipedia/commons/transcoded/f/f1/Sintel_movie_4K.webm/Sintel_movie_4K.webm.720p.vp9.webm';
export const ATTRIBUTION = 'Artwork: Blender Foundation open movies, CC BY 3.0, via Wikimedia Commons.';
export const DEMO_BH = 'LEHV6nWB2yk8pyo0adR*.7kCMdnj';

export const TOS_PEOPLE: Person[] = [
  { id: 'p1', name: 'Derek de Lint', type: 'Actor' },
  { id: 'p2', name: 'Sergio Hasselbaink', type: 'Actor' },
  { id: 'p3', name: 'Rogier Schippers', type: 'Actor' },
  { id: 'p4', name: 'Vanja Rukavina', type: 'Actor' },
  { id: 'p5', name: 'Denise Rebergen', type: 'Actor' },
  { id: 'p6', name: 'Jody Bhe', type: 'Actor' },
  { id: 'p7', name: 'Chris Haley', type: 'Actor' },
  { id: 'p8', name: 'Ian Hubert', type: 'Director' },
  { id: 'p8w', name: 'Ian Hubert', type: 'Writer' },
  { id: 'p9', name: 'Ton Roosendaal', type: 'Producer' },
  { id: 'p10', name: 'Joram Letwory', type: 'Composer' },
];

export const TOS: MediaItem = {
  id: 'tos',
  type: 'Movie',
  title: 'Tears of Steel',
  year: 2012,
  runtimeMin: 12,
  official: 'PG-13',
  community: 6.6,
  critic: 74,
  genres: ['Sci-Fi', 'Short'],
  tagline: 'Every breakup has its casualties.',
  accent: '#4fa8c9',
  overview: 'In a near-future Amsterdam, a band of scientists and soldiers stage a last-ditch emotional reconstruction of an old breakup, hoping it will stop an army of robots.',
  art: {
    Primary: CF('Tos-poster.png', 500),
    Backdrop: [CF('Tears_of_Steel_frame_01_2a.jpg', 1280), CF('Tears_of_Steel_frame_08_4a.jpg', 1280), CF('Tears_of_Steel_frame_09_1a.jpg', 1280)],
    Thumb: CF('Tears_of_Steel_frame_08_4a.jpg', 960),
  },
  blurhash: { Primary: DEMO_BH },
  progress: 0.35,
  streams: {
    video: { codec: 'hevc', width: 3840, height: 1600, range: 'DV' },
    audio: [{ codec: 'eac3', channels: 6, atmos: true, lang: 'eng' }, { codec: 'aac', channels: 2, lang: 'nld' }],
    subs: ['ENG', 'NLD', 'DEU', 'FRA', 'SPA', 'JPN'],
    container: 'mkv',
    bitrate: 18.4e6,
  },
  people: TOS_PEOPLE,
};

export const SINTEL: MediaItem = {
  id: 'sintel',
  type: 'Movie',
  title: 'Sintel',
  year: 2010,
  runtimeMin: 15,
  official: 'PG',
  community: 7.4,
  critic: 81,
  genres: ['Fantasy', 'Animation'],
  accent: '#b5703a',
  overview: 'A lone young woman crosses a hostile, snowbound world in search of the baby dragon she once nursed back to health.',
  art: { Primary: CF('Sintel_poster.jpg', 500), Backdrop: [CF('Sintel_Poster_Paintover_clean.jpg', 500)] },
  played: true,
  themeVideo: SINTEL_WEBM,
  streams: {
    video: { codec: 'vp9', width: 3840, height: 1636, range: 'SDR' },
    audio: [{ codec: 'opus', channels: 6, lang: 'eng' }],
    subs: ['ENG', 'NLD', 'DEU', 'ESP', 'FRA', 'ITA', 'RUS', 'PTB', 'POL'],
    container: 'webm',
  },
  people: [
    { id: 's1', name: 'Halina Reijn', type: 'Actor', role: 'Sintel (voice)' },
    { id: 's2', name: 'Thom Hoffman', type: 'Actor', role: 'Shaman (voice)' },
    { id: 's3', name: 'Colin Levy', type: 'Director' },
    { id: 's4', name: 'Jan Morgenstern', type: 'Composer' },
  ],
};

export const BBB: MediaItem = {
  id: 'bbb',
  type: 'Movie',
  title: 'Big Buck Bunny',
  year: 2008,
  runtimeMin: 10,
  official: 'G',
  community: 6.5,
  genres: ['Comedy', 'Animation'],
  accent: '#7fae3a',
  overview: 'A large, gentle rabbit takes slow and very thorough revenge on three rodents who bully the meadow.',
  art: { Primary: CF('Big_buck_bunny_poster_big.jpg', 500), Backdrop: [CF('Bunny-bow.png', 1280)] },
  progress: 0.62,
  streams: { video: { codec: 'h264', width: 3840, height: 2160, range: 'SDR' }, audio: [{ codec: 'aac', channels: 6, lang: 'eng' }], container: 'mp4' },
};

export const CAMINANDES: MediaItem = {
  id: 'cam',
  type: 'Series',
  title: 'Caminandes',
  year: 2013,
  endYear: 2016,
  childCount: 1,
  unplayed: 2,
  official: 'TV-Y',
  genres: ['Animation', 'Comedy'],
  accent: '#d79a3b',
  overview: 'Koro the llama keeps finding new ways across Patagonia, and new ways to get into trouble.',
  art: {
    Backdrop: [CF(LLAMA + 'Cover_thumbnail.png', 1280), CF(LLAMA + 'Koro_and_Oti_share_more_food_to_eat_at_night.png', 1280)],
    Thumb: CF(LLAMA + 'Cover_thumbnail.png', 960),
  },
};

const ep = (index: number, title: string, year: number, runtimeMin: number, extra: Partial<MediaItem>): MediaItem => ({
  id: 'cam-e' + index,
  type: 'Episode',
  title,
  index,
  parentIndex: 1,
  seriesTitle: 'Caminandes',
  year,
  runtimeMin,
  premiere: year + '-01-29',
  art: { Backdrop: CAMINANDES.art.Backdrop, ...(extra.art || {}) },
  accent: CAMINANDES.accent,
  ...extra,
  ...(extra.art ? { art: { Backdrop: CAMINANDES.art.Backdrop, ...extra.art } } : {}),
});

export const CAM_EPISODES: MediaItem[] = [
  ep(1, 'Llama Drama', 2013, 2, { played: true, premiere: '2013-09-20', overview: 'Koro tries to cross a road that a passing car has made far more complicated than it should be.' }),
  ep(2, 'Gran Dillama', 2013, 3, { progress: 0.55, premiere: '2013-11-15', overview: 'An electric fence stands between Koro and the greener grass on the other side.' }),
  ep(3, 'Llamigos', 2016, 3, { premiere: '2016-01-29', overview: 'Winter. Koro meets Oti, a pesky penguin, in an epic battle over a handful of red berries.', art: { Primary: CF(LLAMA + 'Riding_mine_cart_with_Koro_and_Oti_while_carrying_a_red_grape.png', 960) } }),
];

export const CAM_SEASONS = [
  { id: 's1', name: 'Season 1', index: 1, episodes: CAM_EPISODES },
  { id: 's0', name: 'Specials', index: 0, episodes: [] as MediaItem[] },
];

const bare = (id: string, title: string, year: number, runtimeMin: number, accent: string, genres: string[], extra: Partial<MediaItem> = {}): MediaItem => ({
  id,
  type: 'Movie',
  title,
  year,
  runtimeMin,
  accent,
  genres,
  art: {},
  ...extra,
});

/** A deliberately broken primary so the fallback chain is visible. */
export const BROKEN: MediaItem = {
  ...BBB,
  id: 'broken',
  title: 'Big Buck Bunny (bad Primary)',
  art: { Primary: 'https://invalid.example/missing.jpg', Thumb: 'https://invalid.example/missing-thumb.jpg', Backdrop: BBB.art.Backdrop },
};

export const LIBRARY: MediaItem[] = [
  TOS,
  SINTEL,
  BBB,
  CAMINANDES,
  bare('ed', 'Elephants Dream', 2006, 11, '#c98a3a', ['Sci-Fi'], { played: true }),
  bare('cl', 'Cosmos Laundromat', 2015, 12, '#4fb08f', ['Fantasy'], { progress: 0.2 }),
  bare('gh', 'Glass Half', 2015, 3, '#9b7fd1', ['Comedy']),
  bare('a327', 'Agent 327: Operation Barbershop', 2017, 4, '#d1a33a', ['Action'], { favorite: true }),
  bare('hero', 'Hero', 2018, 4, '#d1563a', ['Short']),
  bare('dd', 'The Daily Dweebs', 2018, 3, '#c9b33a', ['Comedy']),
  bare('spring', 'Spring', 2019, 8, '#5fbf6a', ['Fantasy'], { favorite: true }),
  bare('cr', 'Coffee Run', 2020, 3, '#b56b3a', ['Short']),
  bare('sf', 'Sprite Fright', 2021, 10, '#8fbf3a', ['Horror', 'Comedy']),
  bare('charge', 'Charge', 2022, 4, '#3a9bd1', ['Action']),
  bare('wing', 'Wing It!', 2023, 4, '#d13a6b', ['Comedy']),
  bare('sing', 'Singularity', 2026, 5, '#3ad1c4', ['Sci-Fi'], { unplayed: 1 }),
];

export const LIB_THEMES: Record<string, MediaThemeValue> = {
  films: { label: 'Films', useArtAccent: true },
  shorts: { label: 'Shorts', useArtAccent: false, accent: '#00f3ff', shape: 'landscape' },
  kids: { label: 'Kids', useArtAccent: false, accent: '#ffbd2e' },
};

/* ── demo helpers ────────────────────────────────────────────────────────── */
export const cap = (t: string) =>
  React.createElement('div', {
    style: { fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--app-faint)', fontFamily: 'var(--app-mono)' }
  }, t);

export const note = (t: ReactNode) =>
  React.createElement('div', {
    style: { fontSize: 11, color: 'var(--app-faint)', minHeight: 16, fontFamily: 'var(--app-mono)' }
  }, t);

export function Seg<T extends string>({ value, options, onChange, label }: { value: T; options: { v: T; l: string }[]; onChange: (v: T) => void; label?: string }) {
  return React.createElement(
    'div',
    {
      style: { display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', fontFamily: 'var(--app-mono)', fontSize: 11, color: 'var(--app-faint)' },
      role: 'group',
      'aria-label': label,
    },
    label ? React.createElement('span', null, label) : null,
    options.map(o =>
      React.createElement(
        'button',
        {
          key: o.v,
          type: 'button',
          'aria-pressed': value === o.v,
          onClick: () => onChange(o.v),
          style: {
            all: 'unset',
            cursor: 'pointer',
            padding: '3px 8px',
            borderRadius: 6,
            border: '1px solid ' + (value === o.v ? 'var(--morph-accent)' : 'var(--app-line)'),
            color: value === o.v ? 'var(--on-accent)' : 'var(--app-dim)',
            background: value === o.v ? 'var(--morph-accent)' : 'transparent',
          },
        },
        o.l
      )
    )
  );
}

export const credit = note(ATTRIBUTION);

/* ── music library fixtures ──────────────────────────────────────────────── */
const album = (id: string, title: string, artist: string, year: number, from: MediaItem, accent: string): MediaItem & { artist: string } => ({
  id,
  type: 'MusicAlbum',
  title,
  artist,
  year,
  accent,
  art: { Primary: from.art.Primary, Backdrop: from.art.Backdrop },
  genres: ['Soundtrack'],
});

export const ALBUMS = [
  album('al-sintel', 'Sintel (Score)', 'Jan Morgenstern', 2010, SINTEL, '#b5703a'),
  album('al-tos', 'Tears of Steel (Score)', 'Joram Letwory', 2012, TOS, '#4fa8c9'),
  album('al-bbb', 'Big Buck Bunny (Score)', 'Jan Morgenstern', 2008, BBB, '#7fae3a'),
];

export interface Track extends MediaItem {
  artist: string;
  album: string;
  albumId: string;
  seconds: number;
  disc: number;
}

const T = (al: (typeof ALBUMS)[number], rows: [string, number, number?, Partial<Track>?][]): Track[] =>
  rows.map(([title, seconds, disc = 1, x = {}], i) => ({
    id: al.id + '-' + i,
    type: 'Audio',
    title,
    artist: al.artist,
    album: al.title,
    albumId: al.id,
    seconds,
    disc,
    index: i + 1,
    art: al.art,
    accent: al.accent,
    ...x,
  }));

export const TRACKS: Record<string, Track[]> = {
  'al-sintel': T(ALBUMS[0]!, [['Prologue', 94], ['Market', 142, 1, { favorite: true }], ['Scales', 201], ['Snowfield', 176], ['The Cave', 228], ['Reunion', 187, 2], ['End Titles', 254, 2]]),
  'al-tos': T(ALBUMS[1]!, [['Opening', 118], ['Bridge', 163], ['Old Church', 196, 1, { favorite: true }], ['Reconstruction', 241], ['Credits', 212]]),
  'al-bbb': T(ALBUMS[2]!, [['Meadow', 132], ['Rodents', 98], ['Revenge', 176], ['Butterfly', 121]]),
};

export const fmtS = (s: number) => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');

/* ── server fixtures ─────────────────────────────────────────────────────── */
export interface User { id: string; name: string; avatar?: string; admin?: boolean; pin?: boolean; accent?: string }
export const USERS: User[] = [
  { id: 'u1', name: 'Gene', admin: true, accent: '#00ff00' },
  { id: 'u2', name: 'Sam', pin: true, accent: '#00f3ff' },
  { id: 'u3', name: 'Riley', accent: '#ffbd2e' },
  { id: 'u4', name: 'Kids', accent: '#ff5f56' },
];

export type PlayMethod = 'DirectPlay' | 'DirectStream' | 'Transcode';

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

export const SESSIONS: Session[] = [
  { id: 'se1', user: USERS[0]!, client: 'Jellyfin Web', device: 'Firefox · Desktop', ip: '10.0.0.24', item: TOS, position: 257, duration: 734, method: 'DirectPlay', bitrate: 18.4e6, quality: '4K DV' },
  { id: 'se2', user: USERS[1]!, client: 'Jellyfin Android TV', device: 'Shield TV', ip: '10.0.0.41', item: SINTEL, position: 402, duration: 888, method: 'Transcode', reasons: ['VideoCodecNotSupported', 'SubtitleCodecNotSupported'], transcode: { progress: 0.71, fps: 96, hw: 'QSV', video: 'vp9 → h264', audio: 'opus → aac', container: 'webm → ts' }, bitrate: 8e6, quality: '1080p' },
  { id: 'se3', user: USERS[3]!, client: 'Swiftfin', device: 'iPad', ip: '100.64.0.7', item: CAM_EPISODES[1]!, position: 61, duration: 150, paused: true, method: 'DirectStream', reasons: ['ContainerNotSupported'], bitrate: 4.2e6, quality: '1080p' },
];

export type TaskState = 'Idle' | 'Running' | 'Queued' | 'Failed';

export interface ScanTask {
  id: string;
  name: string;
  library?: string;
  state: TaskState;
  progress?: number;
  lastRun?: string;
  lastDuration?: string;
  detail?: string;
}

export const TASKS: ScanTask[] = [
  { id: 't1', name: 'Scan media library', library: 'Films', state: 'Running', progress: 0.42, detail: 'Sprite Fright (2021)…' },
  { id: 't2', name: 'Generate trickplay images', library: 'Films', state: 'Queued' },
  { id: 't3', name: 'Refresh metadata', library: 'Shows', state: 'Idle', lastRun: '2h ago', lastDuration: '1m 12s' },
  { id: 't4', name: 'Extract chapter images', library: 'Films', state: 'Failed', lastRun: '6h ago', detail: 'ffmpeg exited with code 1 on Cosmos Laundromat' },
  { id: 't5', name: 'Scan media library', library: 'Music', state: 'Idle', lastRun: 'Yesterday', lastDuration: '24s' },
];

export const LIBS = [
  { id: 'l1', name: 'Films', type: 'movies', count: 14, size: '212 GB' },
  { id: 'l2', name: 'Shows', type: 'tvshows', count: 1, size: '3.1 GB' },
  { id: 'l3', name: 'Music', type: 'music', count: 16, size: '1.4 GB' },
];

export type ReqStatus = 'Pending' | 'Approved' | 'Processing' | 'Available' | 'Declined' | 'Failed';

export interface MediaRequest {
  id: string;
  item: MediaItem;
  by: User;
  when: string;
  status: ReqStatus;
  seasons?: number[];
  progress?: number;
  is4k?: boolean;
  note?: string;
}

export const REQUESTS: MediaRequest[] = [
  { id: 'r1', item: LIBRARY[10]!, by: USERS[2]!, when: '12m ago', status: 'Pending', note: 'For movie night' },
  { id: 'r2', item: BBB, by: USERS[3]!, when: '1h ago', status: 'Processing', progress: 0.58, is4k: true },
  { id: 'r3', item: { ...LIBRARY[3]!, title: 'Caminandes' }, by: USERS[1]!, when: 'Yesterday', status: 'Available', seasons: [1] },
];

/* ── *arr fixtures ───────────────────────────────────────────────────────── */
export type EpState = 'downloaded' | 'missing' | 'unaired' | 'downloading' | 'unmonitored';

export interface ArrSeason {
  number: number;
  monitored: boolean;
  episodes: { n: number; title?: string; state: EpState; airDate?: string }[];
}

export const CAM_ARR: ArrSeason[] = [
  { number: 1, monitored: true, episodes: [{ n: 1, title: 'Llama Drama', state: 'downloaded' }, { n: 2, title: 'Gran Dillama', state: 'downloaded' }, { n: 3, title: 'Llamigos', state: 'downloading' }] },
  { number: 0, monitored: false, episodes: [{ n: 1, title: 'Making of', state: 'unmonitored' }] },
];

export type QState = 'downloading' | 'queued' | 'paused' | 'seeding' | 'stalled' | 'extracting' | 'importing' | 'failed' | 'completed';

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

const GB = 1024 ** 3;
const MB = 1024 ** 2;

export const QUEUE: QueueItem[] = [
  { id: 'q1', name: 'Caminandes.S01E03.Llamigos.1080p.WEB.h264', client: 'SABnzbd', protocol: 'usenet', category: 'tv', state: 'downloading', progress: 0.64, size: 1.2 * GB, speed: 38 * MB, eta: 12, linked: { title: 'Caminandes S01E03', arr: 'Sonarr' } },
  { id: 'q2', name: 'Sprite.Fright.2021.2160p.UHD.BluRay.x265', client: 'qBittorrent', protocol: 'torrent', category: 'movies', state: 'downloading', progress: 0.27, size: 14.6 * GB, speed: 9.4 * MB, eta: 1170, seeds: 42, peers: 7, linked: { title: 'Sprite Fright (2021)', arr: 'Radarr' } },
  { id: 'q3', name: 'Charge.2022.1080p.WEB-DL.DDP5.1', client: 'qBittorrent', protocol: 'torrent', category: 'movies', state: 'stalled', progress: 0.81, size: 3.1 * GB, speed: 0, seeds: 0, peers: 2, linked: { title: 'Charge (2022)', arr: 'Radarr' } },
  { id: 'q4', name: 'Wing.It.2023.1080p.WEB.h264', client: 'SABnzbd', protocol: 'usenet', category: 'movies', state: 'extracting', progress: 1, size: 2.4 * GB, linked: { title: 'Wing It! (2023)', arr: 'Radarr' } },
  { id: 'q5', name: 'Spring.2019.720p.WEB.x264', client: 'SABnzbd', protocol: 'usenet', category: 'movies', state: 'failed', progress: 0.12, size: 900 * MB, error: 'Unpacking failed, archive is incomplete', linked: { title: 'Spring (2019)', arr: 'Radarr' } },
  { id: 'q6', name: 'Big.Buck.Bunny.2008.2160p.60fps', client: 'qBittorrent', protocol: 'torrent', category: 'movies', state: 'seeding', progress: 1, size: 8.2 * GB, speed: 2.1 * MB, ratio: 1.84, seeds: 120, peers: 3 },
];

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

const DAY_MS = 86400000;

export function calendarItems(base = Date.now()): CalItem[] {
  const day0 = new Date(base);
  day0.setHours(0, 0, 0, 0);
  const t = (d: number, h: number, m = 0) => day0.getTime() + d * DAY_MS + h * 3600000 + m * 60000;
  return [
    { id: 'k1', title: 'Caminandes', sub: 'S01E02 · Gran Dillama', at: t(-2, 20), kind: 'episode', state: 'downloaded', item: CAMINANDES },
    { id: 'k2', title: 'Sprite Fright', sub: 'Digital release', at: t(-1, 0), kind: 'movie', state: 'downloading', item: LIBRARY[12] },
    { id: 'k3', title: 'Caminandes', sub: 'S01E03 · Llamigos', at: t(0, 21), kind: 'episode', state: 'airing', item: CAMINANDES },
    { id: 'k4', title: 'Charge', sub: 'Physical release', at: t(0, 0), kind: 'movie', state: 'missing', item: LIBRARY[13] },
    { id: 'k5', title: 'The Daily Dweebs', sub: 'S01E04', at: t(2, 18, 30), kind: 'episode', state: 'unaired', item: LIBRARY[9] },
    { id: 'k6', title: 'Singularity', sub: 'In cinemas', at: t(3, 0), kind: 'movie', state: 'unaired', item: LIBRARY[15] },
    { id: 'k7', title: 'Caminandes', sub: 'S02E01', at: t(4, 20), kind: 'episode', state: 'unaired', item: CAMINANDES },
    { id: 'k8', title: 'Wing It!', sub: 'Digital release', at: t(-3, 0), kind: 'movie', state: 'downloaded', item: LIBRARY[14] },
  ];
}

export type Health = 'ok' | 'warn' | 'error' | 'disabled';

export interface Service {
  id: string;
  name: string;
  kind: 'indexer' | 'client' | 'app';
  protocol?: 'usenet' | 'torrent';
  status: Health;
  latency?: number[];
  grabs?: number;
  queries?: number;
  message?: string;
  app?: string;
}

export const SERVICES: Service[] = [
  { id: 'i1', name: 'NZB Planet', kind: 'indexer', protocol: 'usenet', status: 'ok', latency: [210, 190, 230, 205, 180, 240, 198], grabs: 31, queries: 412 },
  { id: 'i2', name: 'OpenTracker', kind: 'indexer', protocol: 'torrent', status: 'warn', latency: [620, 880, 940, 1210, 760, 1340, 1180], grabs: 9, queries: 388, message: 'Slow responses (avg 990 ms); rate limit hit twice today' },
  { id: 'i3', name: 'Archive Feed', kind: 'indexer', protocol: 'torrent', status: 'error', latency: [300, 0, 0, 0, 0, 0, 0], grabs: 0, queries: 41, message: 'HTTP 401: API key rejected' },
  { id: 'c1', name: 'SABnzbd', kind: 'client', protocol: 'usenet', status: 'ok', message: '4.3 · 38 MB/s' },
  { id: 'c2', name: 'qBittorrent', kind: 'client', protocol: 'torrent', status: 'ok', message: '5.0 · 2 active' },
  { id: 'a1', name: 'Sonarr', kind: 'app', status: 'ok', message: 'v4 · 1 series' },
  { id: 'a2', name: 'Radarr', kind: 'app', status: 'warn', message: 'Root folder /media/films is 91% full' },
];

export const POSTERS = { TOS, SINTEL, BBB, CAM_EPISODES };
