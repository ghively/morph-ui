import { MessageTimeline } from '../../src/components/MessageTimeline';
import type { TimelineMessage } from '../../src/components/MessageTimeline';

// Capture clock is pinned to 2024-05-15T12:00:00Z.
const NOW = Date.parse('2024-05-15T12:00:00Z');
const min = 60_000;

const MESSAGES: TimelineMessage[] = [
  { id: 'e1', senderId: '@alice:example.com', senderName: 'Alice Moreno', mine: false, ts: NOW - 42 * min, kind: 'text',
    text: 'Morning! The Q3 support summary is due today — can the agent pull ticket deltas?' },
  { id: 'e2', senderId: '@alice:example.com', senderName: 'Alice Moreno', mine: false, ts: NOW - 41 * min, kind: 'text',
    text: 'Scope is Support + Sales, last 30 days.' },
  { id: 'e3', senderId: '@bot:example.com', senderName: 'Support Bot', isAgent: true, agentLabel: 'Agent', mine: false, ts: NOW - 38 * min, kind: 'text',
    text: 'On it. Pulled 1,204 rows and aggregated by department — draft summary is streaming into #results.',
    reactions: [{ key: '👍', count: 2, mine: true, senders: ['@me:example.com', '@alice:example.com'] }] },
  { id: 'e4', senderId: '@me:example.com', senderName: 'You', mine: true, ts: NOW - 20 * min, kind: 'text',
    text: 'Thanks! Hold the Finance section until sign-off comes through.', sendState: 'sent', edited: true },
  { id: 'e5', senderId: '@carol:example.com', senderName: 'Carol Lindqvist', mine: false, ts: NOW - 6 * min, kind: 'text',
    text: 'Finance approved — go ahead and publish.',
    replyTo: { id: 'e4', senderName: 'You', preview: 'Hold the Finance section until sign-off comes through.' } },
];

export const Default = () => (
  <div style={{ height: 520, display: 'flex' }}>
    <MessageTimeline label="#support-ops" messages={MESSAGES} exhausted={true} />
  </div>
);
