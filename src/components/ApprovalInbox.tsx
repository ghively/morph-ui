import './ApprovalInbox.css';
import { useInbox, cv, RISK_C, type ApprovalInboxProps } from './agentOps.shared';

export function ApprovalInbox(props: ApprovalInboxProps) {
  const { emptyText = 'Nothing waiting on you.', className = '', title = 'Approvals' } = props;
  const x = useInbox(props);
  return (
    <div className={'approval-inbox ' + className}>
      <div className="approval-inbox-head">
        <b>{title}</b>
        {(['high', 'medium', 'low'] as const).map(k => x.counts[k] > 0 && <span key={k} style={cv(RISK_C[k])}><i />{x.counts[k] + ' ' + k}</span>)}
      </div>
      {x.sorted.length === 0 ? <div className="approval-inbox-empty" data-approvals="" data-empty="">{emptyText}</div> : (
        <ul className="approval-inbox-list" data-approvals="">
          {x.sorted.map(r => {
            const risk = r.risk ?? 'medium';
            return (
              <li key={r.id} className="approval-inbox-row" data-approval="" data-risk={risk} data-leaving={x.leaving[r.id]} style={cv(RISK_C[risk])}>
                <span className="approval-inbox-flag" data-riskflag="" aria-label={risk + ' risk'} />
                <div className="approval-inbox-main" data-approvalmain="">
                  <span className="approval-inbox-title" data-approvaltitle="">{r.title}</span>
                  <span className="approval-inbox-meta" data-approvalmeta="">{r.detail && <span data-approvaldetail="">{r.detail}</span>}{r.agent && <span>{r.agent}</span>}{r.time && <span>{r.time}</span>}</span>
                </div>
                <div className="approval-inbox-actions" data-approvalactions="">
                  <button type="button" data-approvereject="" aria-label={'Reject: ' + r.title} title="Reject" onClick={() => x.decide(r.id, false)}>✕</button>
                  <button type="button" data-approveok="" aria-label={'Approve: ' + r.title} title="Approve" onClick={() => x.decide(r.id, true)}>✓</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export type { ApprovalRequest, ApprovalInboxProps } from './agentOps.shared';
