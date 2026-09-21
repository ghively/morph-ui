import type { StoryDefault, Story } from '@ladle/react';
import { useState, type ReactNode } from 'react';
import { AgentTopologyView, type TopologyNode, type TopologyEdge } from './AgentTopologyView';

function TopologyContainer({
  title,
  subtitle,
  children,
  toolbar,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  toolbar?: ReactNode;
}) {
  return (
    <div
      style={{
        maxWidth: '760px',
        margin: '0 auto',
        backgroundColor: 'rgba(8, 12, 44, 0.7)',
        borderRadius: '16px',
        border: '1px solid rgba(150, 175, 255, 0.16)',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(150, 175, 255, 0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--app-text, #eef1fc)',
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: '0.25rem 0 0',
              fontSize: '0.8rem',
              color: 'var(--app-dim, #a9b0d8)',
            }}
          >
            {subtitle}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {toolbar}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              fontSize: '0.75rem',
              color: 'var(--app-dim, #a9b0d8)',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'var(--app-blue, #6c9cf0)',
                }}
              />
              Agent
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'var(--app-faint, #979ecd)',
                }}
              />
              Tool
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-success, #1a9b5e)',
                }}
              />
              Data
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'var(--app-dim, #a9b0d8)',
                }}
              />
              User
            </span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

const defaultNodes: TopologyNode[] = [
  { id: 'user-client', label: 'User Client', kind: 'user' },
  { id: 'agent-core', label: 'Supervisor Agent', kind: 'agent', status: 'active' },
  { id: 'tool-search', label: 'Web Search', kind: 'tool', status: 'active' },
  { id: 'tool-exec', label: 'Code Execution', kind: 'tool', status: 'idle' },
  { id: 'tool-fs', label: 'File System', kind: 'tool', status: 'idle' },
  { id: 'data-vector', label: 'Vector Store', kind: 'data', status: 'active' },
  { id: 'data-context', label: 'Context Buffer', kind: 'data', status: 'active' },
];

const defaultEdges: TopologyEdge[] = [
  { from: 'user-client', to: 'agent-core', label: 'Prompts' },
  { from: 'agent-core', to: 'tool-search', label: 'Query' },
  { from: 'agent-core', to: 'tool-exec', label: 'Execute' },
  { from: 'agent-core', to: 'tool-fs', label: 'File I/O' },
  { from: 'agent-core', to: 'data-vector', label: 'Embeddings' },
  { from: 'agent-core', to: 'data-context', label: 'Session' },
];

const swarmNodes: TopologyNode[] = [
  { id: 'agent-orch', label: 'Orchestrator', kind: 'agent', status: 'active' },
  { id: 'agent-research', label: 'Researcher', kind: 'agent', status: 'active' },
  { id: 'agent-coder', label: 'Code Writer', kind: 'agent', status: 'active' },
  { id: 'agent-tester', label: 'QA Evaluator', kind: 'agent', status: 'error' },
  { id: 'tool-git', label: 'Git Remote', kind: 'tool', status: 'active' },
  { id: 'tool-linter', label: 'Type Checker', kind: 'tool', status: 'error' },
  { id: 'tool-sandbox', label: 'Test Runner', kind: 'tool', status: 'idle' },
  { id: 'tool-docs', label: 'Docs Index', kind: 'tool', status: 'active' },
  { id: 'user-lead', label: 'Lead Engineer', kind: 'user' },
  { id: 'data-ast', label: 'Syntax Graph', kind: 'data', status: 'active' },
  { id: 'data-mem', label: 'Episodic Memory', kind: 'data', status: 'active' },
];

const swarmEdges: TopologyEdge[] = [
  { from: 'user-lead', to: 'agent-orch' },
  { from: 'agent-orch', to: 'agent-research' },
  { from: 'agent-orch', to: 'agent-coder' },
  { from: 'agent-coder', to: 'agent-tester' },
  { from: 'agent-tester', to: 'agent-orch' },
  { from: 'agent-research', to: 'tool-docs' },
  { from: 'agent-coder', to: 'tool-git' },
  { from: 'agent-coder', to: 'tool-linter' },
  { from: 'agent-tester', to: 'tool-sandbox' },
  { from: 'agent-research', to: 'data-mem' },
  { from: 'agent-coder', to: 'data-ast' },
];

const pipelineNodes: TopologyNode[] = [
  { id: 'user-input', label: 'Client Ingress', kind: 'user' },
  { id: 'agent-router', label: 'Router Agent', kind: 'agent', status: 'active' },
  { id: 'tool-guard', label: 'Safety Filter', kind: 'tool', status: 'active' },
  { id: 'data-sink', label: 'Audit Trail', kind: 'data', status: 'idle' },
];

const pipelineEdges: TopologyEdge[] = [
  { from: 'user-input', to: 'agent-router', label: 'HTTP POST' },
  { from: 'agent-router', to: 'tool-guard', label: 'Sanitize' },
  { from: 'agent-router', to: 'data-sink', label: 'Log Event' },
];

export const Default = () => (
  <div style={{ padding: '2rem' }}>
    <TopologyContainer
      title="Agent Execution Topology"
      subtitle="Single supervisor agent coordinating tools, vector embeddings, and user sessions"
    >
      <AgentTopologyView
        nodes={defaultNodes}
        edges={defaultEdges}
        maxHeight={440}
      />
    </TopologyContainer>
  </div>
);

export const InteractiveSelection = () => {
  const [selectedId, setSelectedId] = useState<string>('agent-core');

  const selectedNode = defaultNodes.find((n) => n.id === selectedId);

  return (
    <div style={{ padding: '2rem' }}>
      <TopologyContainer
        title="Interactive Node Inspector"
        subtitle="Click any node in the topology canvas to inspect metadata and connectivity"
      >
        <AgentTopologyView
          nodes={defaultNodes}
          edges={defaultEdges}
          selectedId={selectedId}
          onNodeClick={setSelectedId}
          maxHeight={400}
        />
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid rgba(150, 175, 255, 0.12)',
            backgroundColor: 'rgba(150, 175, 255, 0.04)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {selectedNode ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--app-dim, #a9b0d8)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Selected Node
                </span>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--app-text, #eef1fc)' }}>
                  {selectedNode.label}
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 400,
                      color: 'var(--app-faint, #979ecd)',
                      marginLeft: '6px',
                    }}
                  >
                    ({selectedNode.id})
                  </span>
                </div>
              </div>

              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(108, 156, 240, 0.18)',
                  color: 'var(--app-blue, #6c9cf0)',
                  border: '1px solid rgba(108, 156, 240, 0.3)',
                  textTransform: 'capitalize',
                }}
              >
                Kind: {selectedNode.kind}
              </span>

              {selectedNode.status && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    backgroundColor:
                      selectedNode.status === 'active'
                        ? 'rgba(26, 155, 94, 0.18)'
                        : selectedNode.status === 'error'
                        ? 'rgba(214, 60, 60, 0.18)'
                        : 'rgba(151, 158, 205, 0.18)',
                    color:
                      selectedNode.status === 'active'
                        ? 'var(--color-success, #1a9b5e)'
                        : selectedNode.status === 'error'
                        ? 'var(--color-error, #d63c3c)'
                        : 'var(--app-faint, #979ecd)',
                    border: '1px solid currentColor',
                    textTransform: 'capitalize',
                  }}
                >
                  Status: {selectedNode.status}
                </span>
              )}
            </div>
          ) : (
            <div style={{ fontSize: '0.85rem', color: 'var(--app-dim, #a9b0d8)' }}>
              Click any node above to inspect its properties.
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setSelectedId('agent-core')}
              style={{
                fontSize: '0.75rem',
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(150, 175, 255, 0.1)',
                border: '1px solid rgba(150, 175, 255, 0.2)',
                color: 'var(--app-text, #eef1fc)',
                cursor: 'pointer',
              }}
            >
              Select Agent
            </button>
            <button
              type="button"
              onClick={() => setSelectedId('data-vector')}
              style={{
                fontSize: '0.75rem',
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: 'rgba(150, 175, 255, 0.1)',
                border: '1px solid rgba(150, 175, 255, 0.2)',
                color: 'var(--app-text, #eef1fc)',
                cursor: 'pointer',
              }}
            >
              Select Vector Store
            </button>
            {selectedId && (
              <button
                type="button"
                onClick={() => setSelectedId('')}
                style={{
                  fontSize: '0.75rem',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(150, 175, 255, 0.15)',
                  color: 'var(--app-dim, #a9b0d8)',
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </TopologyContainer>
    </div>
  );
};

export const MultiAgentSwarm = () => (
  <div style={{ padding: '2rem' }}>
    <TopologyContainer
      title="Collaborative Multi-Agent Swarm"
      subtitle="Distributed circle layout featuring orchestrator, coder, tester, and error alerts"
    >
      <AgentTopologyView
        nodes={swarmNodes}
        edges={swarmEdges}
        maxHeight={460}
      />
    </TopologyContainer>
  </div>
);

export const PausedAnimation = () => {
  const [paused, setPaused] = useState(true);

  return (
    <div style={{ padding: '2rem' }}>
      <TopologyContainer
        title="Paused Animation (Reduced Motion)"
        subtitle="Static line-dash drift rendering for reduced motion preferences or low-power snapshots"
        toolbar={
          <button
            type="button"
            onClick={() => setPaused(!paused)}
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: paused ? 'var(--app-blue, #6c9cf0)' : 'rgba(150, 175, 255, 0.15)',
              color: paused ? '#080c2c' : 'var(--app-text, #eef1fc)',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {paused ? '▶ Resume Motion' : '⏸ Pause Motion'}
          </button>
        }
      >
        <AgentTopologyView
          nodes={defaultNodes}
          edges={defaultEdges}
          paused={paused}
          maxHeight={440}
        />
      </TopologyContainer>
    </div>
  );
};

export const CompactPipeline = () => (
  <div style={{ padding: '2rem' }}>
    <TopologyContainer
      title="Compact Ingress Pipeline"
      subtitle="Condensed 260px height layout displaying linear ingestion and validation stage"
    >
      <AgentTopologyView
        nodes={pipelineNodes}
        edges={pipelineEdges}
        maxHeight={260}
      />
    </TopologyContainer>
  </div>
);
