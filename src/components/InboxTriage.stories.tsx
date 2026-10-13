import { InboxTriage } from './InboxTriage';

const ITEMS = [
  { id: 'q1', title: 'Grant Atlas outbound email', detail: 'policy:outbound-unapproved', from: 'Atlas', time: '2m', tone: 'danger' as const },
  { id: 'q2', title: 'Approve corpus deletion', detail: '3 indexes · support-2019', from: 'Atlas', time: '9m', tone: 'warn' as const },
  { id: 'q3', title: 'Review eval regression', detail: 'retrieval-v4 · -2.1%', from: 'Priya', time: '31m', tone: 'info' as const },
  { id: 'q4', title: 'Confirm on-call swap', from: 'Ren', time: '1h' },
  { id: 'q5', title: 'Export audit log', detail: 'Q3 range · 42MB', time: '3h', tone: 'success' as const },
];

export default {
  title: 'InboxTriage',
  component: InboxTriage,
};

export const Default = () => (
  <div style={{ maxWidth: 520 }}>
    <InboxTriage items={ITEMS} title="Needs you" />
  </div>
);

export const SnoozeChoices = () => (
  <div style={{ maxWidth: 520 }}>
    <InboxTriage items={ITEMS} snoozeOptions={['tomorrow', 'monday']} />
  </div>
);

export const Empty = () => (
  <div style={{ maxWidth: 520 }}>
    <InboxTriage items={[]} />
  </div>
);
