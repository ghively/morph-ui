import { CanvasVersionRail } from './CanvasVersionRail';

const NOW = '2026-03-12T10:30:00Z';

const versions = [
  { id: 'v1', at: '2026-03-12T08:02:00Z', by: 'Maya', label: 'Initial draft' },
  { id: 'v2', at: '2026-03-12T09:14:00Z', by: 'Gene', label: 'Positioning section' },
  { id: 'v3', at: '2026-03-12T09:51:00Z', by: 'Riya', label: 'Added risk table' },
  { id: 'v4', at: '2026-03-12T10:22:00Z', by: 'Gene', label: 'Tightened intro' },
];

export default { title: 'CanvasVersionRail', component: CanvasVersionRail };

export const History = () => (
  <div style={{ width: 300 }}>
    <CanvasVersionRail versions={versions} now={NOW} onRestore={() => {}} />
  </div>
);

export const ViewingAnOlderVersion = () => (
  <div style={{ width: 300 }}>
    <CanvasVersionRail versions={versions} currentId="v2" now={NOW} onRestore={() => {}} />
  </div>
);
