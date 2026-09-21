import './ApprovalInbox.css';

export interface ApprovalRequest {
  id: string;
  title: string;
  detail?: string;
  agent?: string;
  time?: string;
  risk?: 'low' | 'medium' | 'high';
}

export interface ApprovalInboxProps {
  requests: ApprovalRequest[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  emptyText?: string;
  className?: string;
}

/** Human-in-the-loop queue: agent actions waiting on a yes/no. Risk sorts first. */
export function ApprovalInbox({ requests, onApprove, onReject, emptyText = 'Nothing waiting on you.', className = '' }: ApprovalInboxProps) {
  const rank = { high: 0, medium: 1, low: 2 };
  const sorted = [...requests].sort((a, b) => (rank[a.risk ?? 'medium'] ?? 1) - (rank[b.risk ?? 'medium'] ?? 1));
  if (sorted.length === 0) {
    return (
      <div className={className} data-approvals="" data-empty="">
        {emptyText}
      </div>
    );
  }
  return (
    <ul className={className} data-approvals="">
      {sorted.map((r) => (
        <li key={r.id} data-approval="" data-risk={r.risk ?? 'medium'}>
          <div data-approvalmain="">
            <span data-approvaltitle="">{r.title}</span>
            {r.detail && <span data-approvaldetail="">{r.detail}</span>}
            <span data-approvalmeta="">
              {r.agent && <span>by {r.agent}</span>}
              {r.time && <span>{r.time}</span>}
              {r.risk && <span data-riskflag="">{r.risk} risk</span>}
            </span>
          </div>
          <div data-approvalactions="">
            <button type="button" data-approvereject="" aria-label={`Reject: ${r.title}`} onClick={() => onReject?.(r.id)}>
              Reject
            </button>
            <button type="button" data-approveok="" aria-label={`Approve: ${r.title}`} onClick={() => onApprove?.(r.id)}>
              Approve
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
