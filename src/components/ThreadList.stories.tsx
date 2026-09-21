import { useState } from 'react';
import { ThreadList } from './ThreadList';

export default {
  title: 'ThreadList',
};

export const Default = () => {
  const [activeId, setActiveId] = useState<string | null>('t2');

  return (
    <ThreadList
      label="Threads"
      activeId={activeId}
      onSelect={setActiveId}
      onSelectMain={() => setActiveId(null)}
      onPromote={(id) => console.log('Promote', id)}
      formatTime={() => '2h ago'}
      threads={[
        {
          id: 't1',
          title: 'Can we update the design docs?',
          replyCount: 5,
          lastSenderName: 'Alice',
          unread: 2,
        },
        {
          id: 't2',
          title: '', // Falls back to 'Thread'
          replyCount: 1,
          lastSenderName: 'Bob',
        },
        {
          id: 't3',
          title: 'Urgent: server down',
          replyCount: 12,
          lastSenderName: 'System',
          highlight: 1,
          unread: 5,
        }
      ]}
    />
  );
};

export const Empty = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  return (
    <ThreadList
      label="Threads"
      activeId={activeId}
      onSelect={setActiveId}
      onSelectMain={() => setActiveId(null)}
      threads={[]}
    />
  );
};
