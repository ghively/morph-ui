
import './AgentPresence.css';

export type AgentPresenceState =
  | 'offline'
  | 'idle'
  | 'available'
  | 'listening'
  | 'thinking'
  | 'streaming'
  | 'speaking'
  | 'tool-use'
  | 'delegating'
  | 'waiting'
  | 'success'
  | 'warning'
  | 'error';

export type AgentPresenceSize = 'xs' | 'sm' | 'md' | 'hero';

export interface AgentPresenceProps {
  state: AgentPresenceState;
  size?: AgentPresenceSize;
  className?: string;
  label?: string;
}

export function AgentPresence({ state, size = 'md', className = '', label }: AgentPresenceProps) {
  const classes = `agent-presence agent-presence-${size} agent-presence-${state} ${className}`;
  
  return (
    <div className={classes} role="status" aria-label={label || `Agent is ${state}`}>
      <div className="agent-presence-core" />
      {(state === 'listening' || state === 'speaking' || state === 'streaming') && (
        <div className="agent-presence-waves">
          <div className="agent-presence-wave agent-presence-wave-1" />
          <div className="agent-presence-wave agent-presence-wave-2" />
          <div className="agent-presence-wave agent-presence-wave-3" />
        </div>
      )}
      {(state === 'thinking' || state === 'tool-use') && (
        <div className="agent-presence-spinner" />
      )}
    </div>
  );
}
