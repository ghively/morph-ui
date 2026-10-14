import { TimelineStream } from './TimelineStream';

const ITEMS = [
  { id: 'a1', time: '09:41', title: 'Corpus re-index finished', body: '48,210 documents · 3m 12s', tone: 'success' as const, icon: '✓' },
  { id: 'a2', time: '09:38', title: 'Eval sweep started', body: 'suite: retrieval-v4 · 220 cases', tone: 'info' as const, icon: '→', active: true },
  { id: 'a3', time: '09:31', title: 'Rate limit hit', body: '429 from upstream · backed off 30s', tone: 'warn' as const, icon: '!' },
  { id: 'a4', time: '09:12', title: 'Nightly digest sent', body: 'to #ops · 6 sections', icon: '·' },
  { id: 'a5', time: '08:57', title: 'Index shard 3 failed', body: 'disk pressure on gh-nvidia', tone: 'danger' as const, icon: '✕', meta: 'ACK by Ren' },
];

export default {
  title: 'TimelineStream',
  component: TimelineStream,
};

export const Default = () => (
  <div style={{ maxWidth: 480 }}>
    <TimelineStream items={ITEMS} label="Ops activity" />
  </div>
);

export const NewestFirst = () => (
  <div style={{ maxWidth: 480 }}>
    <TimelineStream items={ITEMS} newestFirst />
  </div>
);

export const Interactive = () => (
  <div style={{ maxWidth: 480 }}>
    <TimelineStream items={ITEMS} onItemActivate={(item) => console.log(item.id)} />
  </div>
);

export const Empty = () => (
  <div style={{ maxWidth: 480 }}>
    <TimelineStream items={[]} />
  </div>
);
