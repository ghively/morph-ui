import { useState, useMemo } from 'react';
import { LiveTvGuide, type Channel, type Program, type ProgramKind } from './LiveTvGuide';
import { credit } from './__fixtures__/mediaLibrary';

const CH: Channel[] = [
  { id: 'c1', number: '2.1', name: 'Open Movies', accent: '#8000ff' },
  { id: 'c2', number: '4.1', name: 'City News', accent: '#ffbd2e' },
  { id: 'c3', number: '7.2', name: 'Field Sports', accent: '#27c93f' },
  { id: 'c4', number: '9.1', name: 'Shorts Channel', accent: '#00f3ff' },
  { id: 'c5', number: '11.3', name: 'Kids Zone', accent: '#ff8ad8' },
];

function demoPrograms(t0: number): Program[] {
  const m = 60000;
  const out: Program[] = [];
  const add = (ch: string, items: [string, number, ProgramKind, Partial<Program>?][]) => {
    let t = t0;
    items.forEach(([title, mins, kind, x], i) => {
      out.push({ id: ch + i, channelId: ch, title, start: t, end: t + mins * m, kind, ...x });
      t += mins * m;
    });
  };
  add('c1', [
    ['Elephants Dream', 30, 'movie'],
    ['Sintel', 30, 'movie', { recording: 'once' }],
    ['Tears of Steel', 30, 'movie', { isNew: true }],
    ['Cosmos Laundromat', 30, 'movie'],
    ['Spring', 30, 'movie'],
    ['Sprite Fright', 60, 'movie'],
  ]);
  add('c2', [
    ['Morning Desk', 60, 'news', { live: true }],
    ['Weather Now', 30, 'news', { live: true }],
    ['Market Wrap', 30, 'news'],
    ['City Desk', 90, 'news', { live: true }],
  ]);
  add('c3', [
    ['Regional Cycling', 120, 'sports', { live: true }],
    ['Highlights', 30, 'sports'],
    ['Match Day', 90, 'sports', { live: true, recording: 'series' }],
  ]);
  add('c4', [
    ['Caminandes', 30, 'series', { episode: 'S01E01' }],
    ['Caminandes', 30, 'series', { episode: 'S01E02', isNew: true }],
    ['Caminandes', 30, 'series', { episode: 'S01E03' }],
    ['The Daily Dweebs', 30, 'series'],
    ['Coffee Run', 60, 'series'],
    ['Charge', 60, 'series'],
  ]);
  add('c5', [
    ['Big Buck Bunny', 30, 'kids'],
    ['Wing It!', 30, 'kids'],
    ['Glass Half', 60, 'kids'],
    ['Hero', 60, 'kids'],
    ['Agent 327', 60, 'kids'],
  ]);
  return out;
}

export const Default = () => {
  const now = useMemo(() => Date.now(), []);
  const t0 = Math.floor(now / 1800000) * 1800000 - 1800000;
  const [progs, setProgs] = useState(() => demoPrograms(t0));
  const [msg, setMsg] = useState('> scroll horizontally; ←/→ moves between programs');

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <LiveTvGuide
        channels={CH}
        programs={progs}
        start={t0}
        hours={4}
        onSelect={g => setMsg('> ' + g.title)}
        onRecord={g => {
          setProgs(ps =>
            ps.map(x => (x.id === g.id ? { ...x, recording: x.recording ? undefined : 'once' } : x))
          );
          setMsg('> toggled recording: ' + g.title);
        }}
      />
      <div style={{ fontSize: 11, color: 'var(--app-faint)', fontFamily: 'var(--app-mono)' }}>
        {msg}. Channels and schedule are demo data.
      </div>
      {credit}
    </div>
  );
};
