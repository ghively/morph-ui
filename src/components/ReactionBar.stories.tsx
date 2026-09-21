import type { StoryDefault, Story } from '@ladle/react';
import { ReactionBar } from './ReactionBar';

export default {
  title: 'Components / ReactionBar',
} satisfies StoryDefault;

export const Default: Story = () => (
  <ReactionBar
    reactions={[
      { key: '👍', count: 3, mine: true, senders: ['Alice', 'Bob', 'You'] },
      { key: '👀', count: 1, mine: false, senders: ['Charlie'] },
    ]}
    onToggle={(k, m) => console.log('toggle', k, m)}
  />
);
