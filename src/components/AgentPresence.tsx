import './AgentPresence.css';

export type AgentPresenceState =
  | 'offline' | 'idle' | 'available' | 'listening' | 'thinking' | 'streaming' | 'speaking'
  | 'tool-use' | 'delegating' | 'waiting' | 'success' | 'warning' | 'error';

export type AgentPresenceSize = 'xs' | 'sm' | 'md' | 'hero';

export interface AgentPresenceProps {
  state: AgentPresenceState;
  size?: AgentPresenceSize;
  /** Accessible label (defaults to "Agent is {state}"); also the visible text when `showLabel` is set. */
  label?: string;
  /** Render as a pill with the label beside the dial. */
  showLabel?: boolean;
  className?: string;
}

export const AGENT_PRESENCE_LABEL: Record<AgentPresenceState, string> = {
  available: 'Available', listening: 'Listening', thinking: 'Thinking', speaking: 'Speaking', streaming: 'Streaming',
  'tool-use': 'Using tools', delegating: 'Delegating', waiting: 'Waiting', idle: 'Idle', offline: 'Offline',
  success: 'Done', warning: 'Warning', error: 'Error',
};

const BARS = new Set<AgentPresenceState>(['listening', 'speaking', 'streaming']);
const GLYPH: Partial<Record<AgentPresenceState, string>> = {
  success: 'M7 12.5l3.2 3.2L17 9',
  error: 'M8.5 8.5l7 7M15.5 8.5l-7 7',
  warning: 'M12 7.5v5.5M12 16.5v.01',
};

function Core({ state }: { state: AgentPresenceState }) {
  if (BARS.has(state)) return <span className="agent-presence-bars"><i /><i /><i /></span>;
  const d = GLYPH[state];
  if (d) return <svg className="agent-presence-glyph" viewBox="0 0 24 24" aria-hidden="true"><path d={d} /></svg>;
  return <span className="agent-presence-dot" />;
}

export function AgentPresence({ state, size = 'md', label, showLabel = false, className = '' }: AgentPresenceProps) {
  const text = label || AGENT_PRESENCE_LABEL[state] || state;
  const aria = label ?? `Agent is ${state}`;
  return (
    <span
      className={`agent-presence agent-presence-${size} agent-presence-${state} ${showLabel ? 'has-label' : ''} ${className}`.trim()}
      role="status"
      aria-label={aria}
      data-state={state}
    >
      <span className="agent-presence-dial">
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <circle className="agent-presence-track" cx="20" cy="20" r="17" pathLength={100} />
          <circle className="agent-presence-arc" cx="20" cy="20" r="17" pathLength={100} />
          {state === 'delegating' && <circle className="agent-presence-arc agent-presence-arc2" cx="20" cy="20" r="12" pathLength={100} />}
        </svg>
        <span className="agent-presence-inner"><Core state={state} /></span>
      </span>
      {showLabel && <span className="agent-presence-label">{text}</span>}
    </span>
  );
}
