import { ToolCallCard } from './ToolCallCard';

const frame: React.CSSProperties = {
  padding: '2rem',
  maxWidth: '640px',
  display: 'grid',
  gap: '0.75rem',
  fontFamily: 'system-ui, -apple-system, sans-serif',
};

export const Default = () => (
  <div style={frame}>
    <ToolCallCard
      toolName="read_file"
      args={{ path: 'src/components/ToolCallCard.tsx', offset: 0, limit: 120 }}
      status="succeeded"
      duration={48}
      result={{ bytes: 3184, lines: 92 }}
    />
  </div>
);

export const AllStatuses = () => (
  <div style={frame}>
    <ToolCallCard
      toolName="grep"
      args={{ pattern: 'data-tool-call', glob: 'src/**/*.tsx' }}
      status="pending"
    />
    <ToolCallCard
      toolName="terminal"
      args={{ command: 'pnpm test', background: true, notify: true }}
      status="running"
      duration={12840}
    />
    <ToolCallCard
      toolName="write_file"
      args={{ path: 'src/components/RunTimeline.stories.tsx', bytes: 2211 }}
      status="succeeded"
      duration={7}
      result="ok"
    />
    <ToolCallCard
      toolName="ansible_playbook"
      args={{ host: 'gh-storage', playbook: 'site.yml', check: true }}
      status="failed"
      duration={9620}
      error="UNREACHABLE: ssh: connect to host gh-storage port 22: Connection refused. The DSM API is not reachable from this container."
    />
  </div>
);

export const ExpandedWithResult = () => (
  <div style={frame}>
    <ToolCallCard
      toolName="viking_search"
      args={{
        query: 'morph-ui ladle catalog',
        limit: 5,
        filters: { peer: 'claude-code', kind: 'resource' },
        includeVectors: false,
      }}
      status="succeeded"
      duration={214}
      defaultExpanded
      result={{
        hits: 2,
        uris: [
          'viking://resources/tasks/task-open-items.md',
          'viking://user/gene/memories/entities/software_project/morph_ui.md',
        ],
      }}
    />
    <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
      Four args means the header shows three chips plus an overflow marker; the expanded
      panel carries the full JSON.
    </p>
  </div>
);
