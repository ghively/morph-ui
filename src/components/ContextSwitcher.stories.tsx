import { useState } from 'react';
import { ContextSwitcher, type ContextOption } from './ContextSwitcher';

const options: ContextOption[] = [
  { value: 'workspace', label: 'Workspace', description: 'gh-main · 12 agents' },
  { value: 'agents', label: 'Agents', description: 'Hermes, Atlas, Iris' },
  { value: 'archive', label: 'Archive', description: '1,284 completed runs' },
  { value: 'telemetry', label: 'Telemetry', description: 'Live traces and cost' },
];

export const Default = () => (
  <div style={{ minHeight: 300 }}>
    <ContextSwitcher current="workspace" options={options} onChange={() => {}} />
  </div>
);

export const Interactive = () => {
  const [current, setCurrent] = useState('agents');
  return (
    <div style={{ minHeight: 300, display: 'grid', gap: 12, alignContent: 'start' }}>
      <div><ContextSwitcher current={current} options={options} onChange={setCurrent} /></div>
      <div style={{ fontSize: 12, color: 'var(--app-faint)' }}>Selected context: <b style={{ color: 'var(--app-text)' }}>{current}</b></div>
    </div>
  );
};

export const PlainStrings = () => (
  <div style={{ minHeight: 260 }}>
    <ContextSwitcher current="Agents" options={['Workspace', 'Agents', 'Archive', 'Telemetry']} label="Space" />
  </div>
);
