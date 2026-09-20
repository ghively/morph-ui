
import './AgentActivityCapsule.css';
import { AgentPresence } from './AgentPresence';

export type AgentActivityState =
  | 'collapsed'
  | 'summary'
  | 'expanded'
  | 'completed'
  | 'failed'
  | 'awaiting-user';

export interface AgentActivityCapsuleProps {
  state: AgentActivityState;
  agent: string;
  activity: string;
  count?: number;
  details?: string[];
  progress?: number;
  onExpand?: () => void;
  onCollapse?: () => void;
}

export function AgentActivityCapsule({
  state,
  agent,
  activity,
  count,
  details = [],
  progress,
  onExpand,
  onCollapse
}: AgentActivityCapsuleProps) {
  const isExpanded = state === 'expanded' || state === 'awaiting-user';
  
  return (
    <div 
      className={`agent-activity-capsule agent-activity-${state}`}
      onClick={isExpanded ? onCollapse : onExpand}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
    >
      <div className="agent-activity-header">
        <AgentPresence 
          state={state === 'failed' ? 'error' : state === 'completed' ? 'success' : state === 'awaiting-user' ? 'waiting' : 'tool-use'} 
          size="xs" 
        />
        <span className="agent-activity-title">
          <strong>{agent}</strong> {state !== 'expanded' && <span className="agent-activity-bullet">&middot;</span>} {activity}
        </span>
        {!isExpanded && count && count > 0 && (
          <span className="agent-activity-badge">{count} tools</span>
        )}
      </div>
      
      {isExpanded && (
        <div className="agent-activity-body">
          {details.length > 0 && (
            <ul className="agent-activity-details">
              {details.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
          )}
          {progress !== undefined && (
            <div className="agent-activity-progress">
              <div className="agent-activity-progress-bar" style={{ width: `${progress}%` }} />
            </div>
          )}
          {state === 'awaiting-user' && (
            <div className="agent-activity-actions">
              <button className="agent-btn-primary">Approve</button>
              <button className="agent-btn-secondary">Inspect</button>
              <button className="agent-btn-danger">Cancel</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
