import { useState } from 'react';
import './AgentActivityCapsule.css';

export type AgentRunStatus = 'running' | 'awaiting-user' | 'completed' | 'failed';
/** @deprecated use `status` + `expanded`. Still accepted via the `state` prop. */
export type AgentActivityState = 'collapsed' | 'summary' | 'expanded' | 'completed' | 'failed' | 'awaiting-user';
export type AgentStepStatus = 'done' | 'active' | 'pending' | 'failed';
export type AgentActivityStep = string | { label: string; status?: AgentStepStatus; meta?: string };

export interface AgentActivityCapsuleProps {
  agent: string;
  activity: string;
  status?: AgentRunStatus;
  /** @deprecated legacy combined state; mapped onto status + expanded. */
  state?: AgentActivityState;
  /** Tool-call count shown in the header. */
  count?: number;
  /** Steps; strings get a status inferred from position + run status. */
  steps?: AgentActivityStep[];
  /** @deprecated alias of `steps`. */
  details?: AgentActivityStep[];
  /** 0–1. Values above 1 are read as a percent. Omit for an indeterminate ring while running. */
  progress?: number;
  elapsed?: string;
  /** Controlled open state. */
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (open: boolean) => void;
  onExpand?: () => void;
  onCollapse?: () => void;
  onApprove?: () => void;
  onInspect?: () => void;
  onCancel?: () => void;
}

const RUN_LABEL: Record<AgentRunStatus, string> = { running: 'Running', 'awaiting-user': 'Needs approval', completed: 'Completed', failed: 'Failed' };
const ICON = { done: 'M7 12.5l3.2 3.2L17 9', failed: 'M8.5 8.5l7 7M15.5 8.5l-7 7' };

function statusFrom(p: AgentActivityCapsuleProps): AgentRunStatus {
  if (p.status) return p.status;
  if (p.state === 'failed' || p.state === 'completed' || p.state === 'awaiting-user') return p.state;
  return 'running';
}

export function AgentActivityCapsule(props: AgentActivityCapsuleProps) {
  const { agent, activity, count, elapsed, onApprove, onInspect, onCancel } = props;
  const status = statusFrom(props);
  const [own, setOwn] = useState(props.defaultExpanded ?? (props.state === 'expanded' || props.state === 'awaiting-user'));
  const open = props.expanded ?? own;
  const toggle = () => {
    const next = !open;
    setOwn(next);
    props.onExpandedChange?.(next);
    (next ? props.onExpand : props.onCollapse)?.();
  };

  const raw = props.steps || props.details || [];
  const steps = raw.map((s, i) => {
    const o = typeof s === 'string' ? { label: s } : s;
    const last = i === raw.length - 1;
    const inferred: AgentStepStatus = status === 'completed' || !last ? 'done' : status === 'failed' ? 'failed' : status === 'awaiting-user' ? 'pending' : 'active';
    return { label: o.label, meta: o.meta, status: o.status || inferred };
  });
  const done = steps.filter(s => s.status === 'done').length;
  const pct = props.progress == null ? null : Math.max(0, Math.min(1, props.progress > 1 ? props.progress / 100 : props.progress));
  const indet = pct == null && status === 'running';
  const fill = status === 'completed' ? 1 : pct ?? (steps.length ? done / steps.length : 0);

  return (
    <div className={`agent-activity agent-activity-${status} ${open ? 'is-open' : ''}`} data-status={status}>
      <button type="button" className="agent-activity-head" onClick={toggle} aria-expanded={open}>
        <span className={`agent-activity-ring ${indet ? 'is-indet' : ''}`}>
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <circle className="agent-activity-track" cx="20" cy="20" r="17" pathLength={100} />
            <circle className="agent-activity-arc" cx="20" cy="20" r="17" pathLength={100} style={{ strokeDasharray: indet ? '28 72' : `${fill * 100} 100` }} />
          </svg>
          <span className="agent-activity-core">
            {status === 'completed' || status === 'failed'
              ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d={status === 'completed' ? ICON.done : ICON.failed} /></svg>
              : <span className="agent-activity-pct">{pct != null ? Math.round(pct * 100) : steps.length ? `${done}/${steps.length}` : ''}</span>}
          </span>
        </span>
        <span className="agent-activity-text">
          <span className="agent-activity-kicker">
            <b>{agent}</b><span className="agent-activity-status">{RUN_LABEL[status]}</span>{elapsed && <span>{elapsed}</span>}
          </span>
          <span className="agent-activity-act">{activity}</span>
        </span>
        {count ? <span className="agent-activity-count">{`${count} tools`}</span> : null}
        <svg className="agent-activity-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      <div className="agent-activity-body">
        <div className="agent-activity-inner">
          {steps.length > 0 && (
            <ul className="agent-activity-steps">
              {steps.map((s, i) => (
                <li key={i} className={`agent-activity-step is-${s.status}`}>
                  <span className="agent-activity-ico">
                    {s.status === 'done' || s.status === 'failed' ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d={ICON[s.status]} /></svg> : null}
                  </span>
                  <span className="agent-activity-sl">{s.label}</span>
                  {s.meta && <span className="agent-activity-meta">{s.meta}</span>}
                </li>
              ))}
            </ul>
          )}
          {status === 'awaiting-user' && (
            <div className="agent-activity-actions">
              <button type="button" className="agent-activity-btn is-primary" onClick={onApprove}>Approve &amp; continue</button>
              <button type="button" className="agent-activity-btn" onClick={onInspect}>Inspect</button>
              <button type="button" className="agent-activity-btn is-danger" onClick={onCancel}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
