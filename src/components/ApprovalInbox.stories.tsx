import { useState } from 'react';
import { ApprovalInbox } from './ApprovalInbox';
import type { ApprovalRequest } from './ApprovalInbox';

const SEED: ApprovalRequest[] = [
  { id: 'a1', title: 'Drop the 2019 archive index', detail: '184k chunks across 3 indexes. Reindex takes ~40 min.', agent: 'Atlas', time: '2h ago', risk: 'high' },
  { id: 'a2', title: 'Email the Q3 summary to Finance', detail: 'Draft ready for review.', agent: 'Atlas', time: '20m ago', risk: 'medium' },
  { id: 'a3', title: 'Retry Finance source sync', detail: 'Idempotent, safe to rerun.', agent: 'Atlas', time: '5m ago', risk: 'low' },
];

export default {
  title: 'ApprovalInbox',
  component: ApprovalInbox,
};

export const Default = () => {
  const [items, setItems] = useState(SEED);
  const [log, setLog] = useState('Nothing decided yet.');
  const decide = (verb: string) => (id: string) => {
    setItems((ns) => ns.filter((n) => n.id !== id));
    setLog(`${verb}: ${id}`);
  };
  return (
    <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <ApprovalInbox requests={items} onApprove={decide('Approved')} onReject={decide('Rejected')} />
      <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>{log}</p>
    </div>
  );
};
