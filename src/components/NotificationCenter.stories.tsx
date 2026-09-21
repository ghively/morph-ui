import { useState } from 'react';
import { NotificationCenter } from './NotificationCenter';
import type { Notification } from './NotificationCenter';

const SEED: Notification[] = [
  { id: 'n1', title: 'Support reindex finished', body: '120,408 chunks in 6m 12s. 2 skipped.', tone: 'success', time: '4m ago' },
  { id: 'n2', title: 'Finance source went stale', body: 'No heartbeat for 6 hours. Retry scheduled.', tone: 'warn', time: '1h ago', read: true },
  { id: 'n3', title: 'Approval requested: delete corpus', body: 'Agent Atlas wants to drop the 2019 archive.', tone: 'danger', time: '2h ago' },
];

export default {
  title: 'NotificationCenter',
  component: NotificationCenter,
};

export const Default = () => {
  const [items, setItems] = useState<Notification[]>(SEED);
  const [opened, setOpened] = useState<string | null>(null);
  return (
    <div style={{ maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <NotificationCenter
        notifications={items}
        onOpen={setOpened}
        onMarkAllRead={() => setItems((ns) => ns.map((n) => ({ ...n, read: true })))}
        onDismiss={(id) => setItems((ns) => ns.filter((n) => n.id !== id))}
      />
      {opened && <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>Opened: {opened}</p>}
    </div>
  );
};
