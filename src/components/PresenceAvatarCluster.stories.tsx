import { useState } from 'react';
import { PresenceAvatarCluster } from './PresenceAvatarCluster';
import type { Collaborator } from './canvas.shared';

const team: Collaborator[] = [
  { id: 'gene', name: 'Gene', hue: 1 },
  { id: 'maya', name: 'Maya Patel', hue: 2 },
  { id: 'riya', name: 'Riya Chen', hue: 3 },
  { id: 'sam', name: 'Sam Osei', hue: 4 },
  { id: 'tess', name: 'Tess Whitfield', hue: 5 },
  { id: 'jules', name: 'Jules Farrow', hue: 6 },
];

export default { title: 'PresenceAvatarCluster', component: PresenceAvatarCluster };

export const Default = () => (
  <div style={{ padding: 48 }}>
    <PresenceAvatarCluster collaborators={team} />
  </div>
);

export const SmallTeam = () => (
  <div style={{ padding: 48 }}>
    <PresenceAvatarCluster collaborators={team.slice(0, 2)} max={4} />
  </div>
);

export const ControlledExpansion = () => {
  const [max, setMax] = useState(3);
  return (
    <div style={{ padding: 48 }}>
      <PresenceAvatarCluster collaborators={team} max={max} />
      <button type="button" style={{ marginTop: 16 }} onClick={() => setMax((m) => (m === 3 ? 6 : 3))}>
        {max === 3 ? 'Show all' : 'Fold'}
      </button>
    </div>
  );
};
