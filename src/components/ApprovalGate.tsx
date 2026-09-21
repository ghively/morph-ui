import { useState } from 'react';
import './ApprovalGate.css';

export interface ApprovalGateProps {
  title: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  actionSummary: string;
  onResolve: (approved: boolean, comment?: string) => void;
}

export function ApprovalGate({
  title,
  description,
  riskLevel,
  actionSummary,
  onResolve,
}: ApprovalGateProps) {
  const [resolved, setResolved] = useState(false);
  const [comment, setComment] = useState('');

  const handleApprove = () => {
    if (resolved) return;
    setResolved(true);
    onResolve(true, comment.trim() || undefined);
  };

  const handleDeny = () => {
    if (resolved) return;
    setResolved(true);
    onResolve(false, comment.trim() || undefined);
  };

  const showCommentField = riskLevel === 'medium' || riskLevel === 'high';

  return (
    <div data-approval-gate="" data-risk={riskLevel} data-resolved={resolved ? "true" : undefined}>
      <div data-approval-gate-header="">
        <div data-approval-gate-title="">{title}</div>
        <div data-approval-gate-badge="">{riskLevel.toUpperCase()} RISK</div>
      </div>
      
      <p data-approval-gate-desc="">{description}</p>
      
      <div data-approval-gate-summary="">
        <strong>Action:</strong> <span>{actionSummary}</span>
      </div>

      {!resolved && showCommentField && (
        <div data-approval-gate-comment="">
          <input 
            type="text" 
            placeholder="Optional comment..." 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
      )}

      <div data-approval-gate-actions="">
        <button 
          data-approval-gate-btn="deny" 
          onClick={handleDeny} 
          disabled={resolved}
        >
          Deny
        </button>
        <button 
          data-approval-gate-btn="approve" 
          onClick={handleApprove} 
          disabled={resolved}
        >
          Approve
        </button>
      </div>
    </div>
  );
}
