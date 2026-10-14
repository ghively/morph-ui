import { CollaborativeCanvas } from './CollaborativeCanvas';
import { CanvasToolbar } from './CanvasToolbar';
import { CanvasStatusBar } from './CanvasStatusBar';
import { CanvasMiniMap } from './CanvasMiniMap';
import { PresenceAvatarCluster } from './PresenceAvatarCluster';
import type { Collaborator } from './canvas.shared';

const collaborators: Collaborator[] = [
  { id: 'gene', name: 'Gene', x: 380, y: 130, hue: 1 },
  { id: 'maya', name: 'Maya', x: 150, y: 290, hue: 2 },
  { id: 'riya', name: 'Riya', x: 620, y: 420, hue: 3 },
];

const doc = (
  <article className="cv-demo-doc" style={{ padding: '48px 56px', maxWidth: 760 }}>
    <h1 style={{ fontSize: 'var(--t-h2)', margin: '0 0 16px' }}>Q4 Launch Brief</h1>
    <p style={{ margin: '0 0 12px', color: 'var(--app-dim)' }}>
      A collaborative draft. Remote cursors follow each collaborator; the selection outline marks
      the passage Maya is editing.
    </p>
    <h2 style={{ fontSize: 'var(--t-h4)', margin: '24px 0 8px' }}>Positioning</h2>
    <p style={{ margin: '0 0 12px', color: 'var(--app-dim)' }}>
      The canvas is the shared surface: presence, comments and versions all anchor to the same
      document geometry.
    </p>
    <h2 style={{ fontSize: 'var(--t-h4)', margin: '24px 0 8px' }}>Risks</h2>
    <p style={{ margin: 0, color: 'var(--app-dim)' }}>None recorded yet.</p>
  </article>
);

export default { title: 'CollaborativeCanvas', component: CollaborativeCanvas };

export const LiveDocument = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 12, top: 12, zIndex: 5 }}>
          <CanvasToolbar dock="left" defaultTool="select" />
        </div>
        <CollaborativeCanvas
          collaborators={collaborators}
          contentWidth={800}
          contentHeight={520}
          selection={{ x: 90, y: 250, width: 320, height: 76, label: 'Maya’s selection' }}
          defaultZoom={1}
        >
          {doc}
        </CollaborativeCanvas>
        <CanvasStatusBar zoom={1} cursor={{ x: 380, y: 130 }} tool="Select" connection="live" />
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 170 }}>
      <PresenceAvatarCluster collaborators={collaborators} />
      <CanvasMiniMap contentWidth={800} contentHeight={520} viewport={{ x: 40, y: 20, width: 420, height: 300 }} width={170} />
    </div>
  </div>
);

export const ZoomedIn = () => (
  <div style={{ maxWidth: 720 }}>
    <CollaborativeCanvas
      collaborators={[{ id: 'gene', name: 'Gene', x: 500, y: 200, hue: 1 }]}
      contentWidth={800}
      contentHeight={520}
      defaultZoom={1.5}
    >
      {doc}
    </CollaborativeCanvas>
  </div>
);

export const Empty = () => (
  <div style={{ maxWidth: 720 }}>
    <CollaborativeCanvas contentWidth={640} contentHeight={320} />
  </div>
);
