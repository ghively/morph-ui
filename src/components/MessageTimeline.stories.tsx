import type { StoryDefault, Story } from '@ladle/react';
import { MessageTimeline } from './MessageTimeline';

export default {
  title: 'Components / MessageTimeline',
} satisfies StoryDefault;

export const Default: Story = () => (
  <div style={{ height: 600, display: 'flex' }}>
    <MessageTimeline
      label="Timeline Log"
      messages={[]}
      exhausted={true}
    />
  </div>
);
