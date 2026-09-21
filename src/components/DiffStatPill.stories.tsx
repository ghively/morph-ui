import type { StoryDefault, Story } from '@ladle/react';
import { DiffStatPill } from './DiffStatPill';

const frame: React.CSSProperties = {
  padding: '2rem',
  maxWidth: '520px',
  display: 'grid',
  gap: '0.75rem',
  fontFamily: 'system-ui, -apple-system, sans-serif',
};

export const Default = () => (
  <div style={frame}>
    <DiffStatPill added={99} removed={12} fileName="src/components/AgentCard.tsx" />
  </div>
);

export const FileList = () => {
  const files = [
    { fileName: 'src/components/CommandPalette.tsx', added: 230, removed: 0 },
    { fileName: 'src/components/ModelSelector.tsx', added: 232, removed: 18 },
    { fileName: 'src/components/ContextMeter.tsx', added: 41, removed: 3 },
    { fileName: 'src/index.ts', added: 9, removed: 9 },
    { fileName: 'test/legacy-shim.test.tsx', added: 0, removed: 74 },
  ];
  const max = Math.max(...files.map((file) => file.added + file.removed));

  return (
    <div style={frame}>
      {files.map((file) => (
        <DiffStatPill
          key={file.fileName}
          fileName={file.fileName}
          added={file.added}
          removed={file.removed}
          max={max}
        />
      ))}
      <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
        A shared max keeps every bar on the same scale across the file list.
      </p>
    </div>
  );
};

export const AdditionsAndDeletionsOnly = () => (
  <div style={frame}>
    <DiffStatPill added={605} removed={0} fileName="new-feature.tsx" max={605} />
    <DiffStatPill added={0} removed={312} fileName="removed-module.tsx" max={605} />
    <DiffStatPill added={44} removed={44} />
  </div>
);
