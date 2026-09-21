import type { StoryDefault, Story } from '@ladle/react';
import { MessageTile } from './MessageTile';
import type { TimelineMessage } from './MessageTimeline';

export default {
  title: 'Components / MessageTile',
} satisfies StoryDefault;

const mockMsg: TimelineMessage = {
  id: 'm1',
  senderId: 'u1',
  senderName: 'Alice',
  mine: true,
  ts: Date.now(),
  kind: 'text',
  text: 'Hello world! What is going on?',
  preview: 'Hello world! What is going on?',
  sendState: 'sent',
  canEdit: true,
  canDelete: true,
};

export const Own: Story = () => (
  <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
    <MessageTile message={mockMsg} accent="blue" />
  </div>
);

export const Other: Story = () => (
  <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
    <MessageTile message={{ ...mockMsg, mine: false, senderName: 'Bob' }} accent="green" />
  </div>
);
