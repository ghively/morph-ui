import { LiveCursors } from './LiveCursors';

export default { title: 'LiveCursors', component: LiveCursors };

const collaborators = [
  { id: 'gene', name: 'Gene', x: 300, y: 120, hue: 1 },
  { id: 'maya', name: 'Maya Patel', x: 120, y: 240, hue: 2 },
  { id: 'riya', name: 'Riya Chen', x: 520, y: 80, hue: 3 },
];

export const Default = () => (
  <div
    style={{
      position: 'relative',
      width: 640,
      height: 320,
      borderRadius: 'var(--r-lg)',
      border: '1px solid var(--app-line)',
      background: 'var(--app-panel)',
      overflow: 'hidden',
    }}
  >
    <LiveCursors collaborators={collaborators} contentWidth={640} contentHeight={320} />
  </div>
);

export const Single = () => (
  <div
    style={{
      position: 'relative',
      width: 420,
      height: 200,
      borderRadius: 'var(--r-md)',
      border: '1px solid var(--app-line)',
      background: 'var(--app-panel)',
      overflow: 'hidden',
    }}
  >
    <LiveCursors collaborators={[{ id: 'sam', name: 'Sam Osei', x: 210, y: 90, hue: 4 }]} contentWidth={420} contentHeight={200} />
  </div>
);
