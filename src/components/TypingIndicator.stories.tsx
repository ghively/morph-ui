import type { StoryDefault, Story } from '@ladle/react';
import { TypingIndicator } from './TypingIndicator';

export default {
  title: 'Components / TypingIndicator',
} satisfies StoryDefault;

export const Default: Story = () => (
  <div style={{ padding: '20px' }}>
    <TypingIndicator
      participants={[
        { id: '1', name: 'Alice' },
      ]}
    />
  </div>
);
