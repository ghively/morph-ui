import { useState } from 'react';
import { HandoffCard } from './HandoffCard';

export default {
  title: 'HandoffCard',
  component: HandoffCard,
};

export const Urgent = () => {
  const [taken, setTaken] = useState(false);
  return (
    <div style={{ maxWidth: 480 }}>
      <HandoffCard
        to="Priya (Support lead)"
        reason="Refundbot is unsure whether the March policy covers annual plans bought before March 3. Two customers are waiting."
        summary={['Policy §4.2 is ambiguous on grandfathering', 'Draft reply prepared, not sent']}
        needed="Approve the draft or rewrite the grandfathering line."
        urgency="now"
        onAccept={taken ? undefined : () => setTaken(true)}
      />
      {taken && <p style={{ fontSize: 12, opacity: 0.7 }}>You took over. The agent is standing by.</p>}
    </div>
  );
};
