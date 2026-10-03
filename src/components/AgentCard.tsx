import './AgentCard.css';
import { cardInteractive, initials, cv, AGENT_C, AGENT_LABEL, type AgentCardProps } from './agentOps.shared';

export function AgentCard({ name, role, children, status, capabilities, lastActive, onFocus, className = '' }: AgentCardProps) {
  return (
    <div className={'agent-card ' + className} data-agent-card="" data-status={status} style={cv(AGENT_C[status])} {...cardInteractive(onFocus)}>
      <div className="agent-card-header" data-agent-card-header="">
        <div className="agent-card-av" data-agent-card-avatar="">
          <span className="agent-card-ring" aria-hidden="true" />
          <span className="agent-card-face">{children ?? initials(name)}</span>
        </div>
        <div className="agent-card-id" data-agent-card-identity="">
          <div className="agent-card-name" data-agent-card-name="">{name}</div>
          {role && <div className="agent-card-role" data-agent-card-role="">{role}</div>}
        </div>
      </div>
      <div className="agent-card-row" data-agent-card-status-row="">
        <div className="agent-card-st" data-agent-card-status="" data-status={status}><i data-agent-card-status-dot="" /><span>{AGENT_LABEL[status]}</span></div>
        {lastActive && <div className="agent-card-last" data-agent-card-last-active="">{'Active ' + lastActive}</div>}
      </div>
      {capabilities && capabilities.length > 0 && <div className="agent-card-caps" data-agent-card-capabilities="">{capabilities.map(c => <span key={c} data-agent-card-cap="">{c}</span>)}</div>}
    </div>
  );
}

export type { AgentStatus, AgentCardProps } from './agentOps.shared';
