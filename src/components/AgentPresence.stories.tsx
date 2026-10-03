import type { CSSProperties } from 'react';
import { AgentPresence, type AgentPresenceState } from './AgentPresence';

const ALL_STATES: AgentPresenceState[] = [
  'available', 'listening', 'thinking', 'speaking', 'streaming', 'tool-use', 'delegating',
  'waiting', 'idle', 'offline', 'success', 'warning', 'error',
];

const tile: CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '14px 4px 10px', borderRadius: 10,
  background: 'color-mix(in srgb, var(--app-text) 3%, transparent)', border: '1px solid var(--app-line)',
};
const caption: CSSProperties = { fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--app-faint)' };

export const Default = () => <AgentPresence state="available" label="Agent is online and ready" />;

export const AllStates = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 8 }}>
    {ALL_STATES.map(state => (
      <div key={state} style={tile}>
        <div style={{ height: 44, display: 'grid', placeItems: 'center' }}><AgentPresence state={state} /></div>
        <span style={{ fontSize: 11, color: 'var(--app-dim)' }}>{state}</span>
      </div>
    ))}
  </div>
);

export const SizeVariants = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
    <AgentPresence state="thinking" size="xs" />
    <AgentPresence state="thinking" size="sm" />
    <AgentPresence state="thinking" size="md" />
    <AgentPresence state="thinking" size="hero" />
  </div>
);

export const WithLabel = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
    {(['available', 'thinking', 'tool-use', 'waiting', 'error'] as AgentPresenceState[]).map(s => (
      <AgentPresence key={s} state={s} size="xs" showLabel />
    ))}
  </div>
);

export const Outcomes = () => (
  <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
    {(['success', 'warning', 'error'] as AgentPresenceState[]).map(s => (
      <div key={s} style={{ display: 'grid', justifyItems: 'center', gap: 10 }}>
        <AgentPresence state={s} size="hero" />
        <span style={caption}>{s}</span>
      </div>
    ))}
  </div>
);
