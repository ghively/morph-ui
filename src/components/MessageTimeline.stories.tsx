import type { StoryDefault, Story } from '@ladle/react';
import { MessageTimeline } from './MessageTimeline';
import type { TimelineMessage } from './MessageTimeline';

export default {
  title: 'Components / MessageTimeline',
} satisfies StoryDefault;

// Fixed clock so the catalog renders the same day/time labels every run.
const T0 = Date.UTC(2026, 8, 21, 14, 2);
const min = 60_000;

const messages: TimelineMessage[] = [
  { id: 'm1', senderId: '@ada:example.org', senderName: 'Ada', mine: false, ts: T0, kind: 'text',
    text: 'Morning! The staging deploy is green. Can someone sanity-check the new retrieval settings before we ship?' },
  { id: 'm2', senderId: '@ada:example.org', senderName: 'Ada', mine: false, ts: T0 + 1 * min, kind: 'text',
    text: 'Mostly the chunk size change, 512 → 768 tokens.',
    reactions: [{ key: '👀', count: 2, mine: true, senders: ['You', 'Grace'] }] },
  { id: 'm3', senderId: '@reviewer:example.org', senderName: 'Reviewer', isAgent: true, agentLabel: 'Agent', mine: false, ts: T0 + 3 * min, kind: 'text',
    text: 'Ran the eval set against both configs. Answer accuracy is up 4.1 points; median latency rose by 38 ms. No regressions in the citation checks.',
    thread: { count: 3, lastSenderName: 'Grace', lastTs: T0 + 9 * min } },
  { id: 'm4', senderId: '@me:example.org', senderName: 'You', mine: true, ts: T0 + 5 * min, kind: 'text',
    text: 'Nice, that latency hit is fine. Shipping after lunch.', sendState: 'sent',
    replyTo: { id: 'm3', senderName: 'Reviewer', preview: 'Ran the eval set against both configs…' } },
  { id: 'm5', senderId: '@grace:example.org', senderName: 'Grace', mine: false, ts: T0 + 7 * min, kind: 'text',
    text: '👍 I’ll update the runbook.', edited: true },
];

export const Default: Story = () => (
  <div style={{ height: 600, display: 'flex' }}>
    <MessageTimeline
      label="Timeline Log"
      messages={messages}
      exhausted={true}
    />
  </div>
);

export const Empty: Story = () => (
  <div style={{ height: 600, display: 'flex' }}>
    <MessageTimeline
      label="Timeline Log"
      messages={[]}
      exhausted={true}
    />
  </div>
);
