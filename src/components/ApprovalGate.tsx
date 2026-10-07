import './ApprovalGate.css';
import { useGate, cv, RISK_LABEL, type ApprovalGateProps } from './agentOps.shared';

export function ApprovalGate(props: ApprovalGateProps) {
  const { title, description, riskLevel, actionSummary, className = '' } = props;
  const g = useGate(props);
  return (
    <div className={'approval-gate ' + className} data-approval-gate="" data-risk={riskLevel} data-resolved={g.resolved ? 'true' : undefined} data-decision={g.decision || undefined} style={cv(g.color)}>
      <div className="approval-gate-head" data-approval-gate-header="">
        <span className="approval-gate-meter" aria-hidden="true">{[1, 2, 3].map(n => <i key={n} data-on={n <= g.level ? '' : undefined} />)}</span>
        <div className="approval-gate-title" data-approval-gate-title="">{title}</div>
        <div className="approval-gate-badge" data-approval-gate-badge="">{RISK_LABEL[riskLevel]}</div>
      </div>
      <p className="approval-gate-desc" data-approval-gate-desc="">{description}</p>
      {/* Long commands scroll sideways (wrapping breaks flags apart), so the strip takes focus for keyboard scrolling. */}
      <div className="approval-gate-cmd" data-approval-gate-summary="" tabIndex={0} role="group" aria-label="Command"><span aria-hidden="true">$</span><code>{actionSummary}</code></div>
      {g.resolved ? (
        <div className="approval-gate-done" role="status"><b>{g.decision === 'approved' ? '✓ Approved' : '✕ Denied'}</b>{g.comment.trim() && <span>{'“' + g.comment.trim() + '”'}</span>}</div>
      ) : (
        <>
          {g.showComment && <div className="approval-gate-comment" data-approval-gate-comment=""><input type="text" placeholder="Add a note for the agent (optional)" value={g.comment} onChange={e => g.setComment(e.target.value)} aria-label="Comment" /></div>}
          <div className="approval-gate-actions" data-approval-gate-actions="">
            <button type="button" data-approval-gate-btn="deny" onClick={g.deny}>Deny</button>
            <button type="button" data-approval-gate-btn="approve" onClick={g.approve}>Approve</button>
          </div>
        </>
      )}
    </div>
  );
}

export type { ApprovalGateProps } from './agentOps.shared';
