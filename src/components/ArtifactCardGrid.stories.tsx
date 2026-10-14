import { ArtifactCardGrid } from './ArtifactCardGrid';

const NOW = '2026-03-12T10:30:00Z';

const artifacts = [
  { id: 'a1', title: 'Q4 Launch Brief', kind: 'doc' as const, updatedAt: '2026-03-12T10:22:00Z' },
  { id: 'a2', title: 'Pricing Model', kind: 'sheet' as const, updatedAt: '2026-03-11T16:45:00Z' },
  { id: 'a3', title: 'deploy.sh', kind: 'code' as const, updatedAt: '2026-03-10T09:12:00Z' },
  { id: 'a4', title: 'Hero render', kind: 'image' as const, updatedAt: '2026-03-12T08:30:00Z' },
  { id: 'a5', title: 'Roadmap board', kind: 'board' as const, updatedAt: '2026-03-09T14:00:00Z' },
  { id: 'a6', title: 'Interview notes', kind: 'doc' as const, updatedAt: '2026-03-08T11:20:00Z' },
];

export default { title: 'ArtifactCardGrid', component: ArtifactCardGrid };

export const Library = () => (
  <div style={{ maxWidth: 760 }}>
    <ArtifactCardGrid artifacts={artifacts} now={NOW} selectedId="a1" onOpen={() => {}} />
  </div>
);

export const Dense = () => (
  <div style={{ maxWidth: 520 }}>
    <ArtifactCardGrid artifacts={artifacts.slice(0, 4)} now={NOW} minCardWidth={150} />
  </div>
);
