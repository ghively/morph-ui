import type { ReactNode } from 'react';
import './AgentCard.css';

export type AgentStatus = 'offline' | 'idle' | 'busy' | 'working';

export interface AgentCardProps {
  name: string;
  role?: string;
  children?: ReactNode; // avatar slot
  status: AgentStatus;
  capabilities?: string[];
  lastActive?: string;
  onFocus?: () => void;
}

export function AgentCard({
  name,
  role,
  children,
  status,
  capabilities,
  lastActive,
  onFocus,
}: AgentCardProps) {
  
  return (
    <div 
      data-agent-card="" 
      tabIndex={onFocus ? 0 : undefined}
      role={onFocus ? "button" : undefined}
      onClick={onFocus}
      onKeyDown={(e) => {
        if (onFocus && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onFocus();
        }
      }}
    >
      <div data-agent-card-header="">
        {children && (
          <div data-agent-card-avatar="">
            {children}
          </div>
        )}
        
        <div data-agent-card-identity="">
          <div data-agent-card-name="">{name}</div>
          {role && <div data-agent-card-role="">{role}</div>}
        </div>
      </div>
      
      <div data-agent-card-status-row="">
        <div data-agent-card-status="" data-status={status}>
          <div data-agent-card-status-dot="" />
          <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </div>
        
        {lastActive && (
          <div data-agent-card-last-active="">
            Active {lastActive}
          </div>
        )}
      </div>

      {capabilities && capabilities.length > 0 && (
        <div data-agent-card-capabilities="">
          {capabilities.map(cap => (
            <span key={cap} data-agent-card-cap="">{cap}</span>
          ))}
        </div>
      )}
    </div>
  );
}
