import { ReactionBar } from '../../src/components/ReactionBar';

export const Default = () => (
  <ReactionBar
    reactions={[
      { key: '👍', count: 3, mine: true, senders: ['Alice', 'Bob', 'You'] },
      { key: '👀', count: 1, mine: false, senders: ['Charlie'] },
    ]}
    onToggle={(k, m) => console.log('toggle', k, m)}
  />
);
