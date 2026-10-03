import type { CSSProperties } from 'react';
import { AgentActivityCapsule, type AgentActivityStep } from './AgentActivityCapsule';

const RUN: AgentActivityStep[] = [
  { label: 'Read src/gateway/router.ts', status: 'done', meta: '412 lines' },
  { label: 'Patched retry backoff → exponential + jitter', status: 'done' },
  { label: 'Running vitest', status: 'active', meta: '248 / 400' },
  { label: 'Open pull request', status: 'pending' },
];
const APPROVE: AgentActivityStep[] = [
  { label: 'Generated migration 0042_add_run_index', status: 'done' },
  { label: 'Dry-run on staging', status: 'done', meta: '1.2s' },
  { label: 'Apply to prod-db', status: 'pending' },
];
const wrap: CSSProperties = { maxWidth: 440, display: 'grid', gap: 12 };

export const Default = () => (
  <div style={wrap}>
    <AgentActivityCapsule status="running" agent="Hermes" activity="Refactoring gateway retry policy" count={3} progress={0.62} elapsed="1m 42s" steps={RUN} />
  </div>
);

export const Expanded = () => (
  <div style={wrap}>
    <AgentActivityCapsule status="running" defaultExpanded agent="Hermes" activity="Refactoring gateway retry policy" count={3} progress={0.62} elapsed="1m 42s" steps={RUN} />
  </div>
);

export const Indeterminate = () => (
  <div style={wrap}>
    <AgentActivityCapsule status="running" agent="Iris" activity="Searching the knowledge base" steps={['Embedding query', 'Searching 3 indexes']} />
  </div>
);

export const AwaitingApproval = () => (
  <div style={wrap}>
    <AgentActivityCapsule status="awaiting-user" defaultExpanded agent="Hermes" activity="Run migration 0042 on prod-db" count={2} progress={0.66} elapsed="0m 51s" steps={APPROVE} onApprove={() => {}} onInspect={() => {}} onCancel={() => {}} />
  </div>
);

export const Outcomes = () => (
  <div style={wrap}>
    <AgentActivityCapsule status="failed" agent="Atlas" activity="Deploy to gh-media stalled" elapsed="0m 18s" steps={['Built image ghcr.io/morph/app:4f2a', 'ssh: connect to host gh-media port 22: connection refused']} />
    <AgentActivityCapsule status="completed" agent="Iris" activity="Summarised 14 support threads" count={5} elapsed="3m 05s" steps={['Fetched threads', 'Clustered by topic', 'Drafted summary']} />
  </div>
);
