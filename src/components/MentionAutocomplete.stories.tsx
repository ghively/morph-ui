import type { ReactNode } from 'react';
import { MentionAutocomplete, rankMentionCandidates } from './MentionAutocomplete';
import type { MentionTrigger } from './MentionAutocomplete';

const candidates = [
  { id: '@alice:example.com', name: 'Alice' },
  { id: '@bot:example.com', name: 'Support Bot', agentLabel: 'Agent' },
  { id: '@bob:example.com', name: 'Bob' },
];

export default {
  title: 'MentionAutocomplete',
};

/**
 * The popover anchors to its nearest positioned ancestor and opens upward
 * (bottom: 100%), the way it sits over a chat composer. Give it a composer-like
 * anchor with room above, or it renders off the top of the canvas.
 */
const ComposerAnchor = ({ text, children }: { text: string; children: ReactNode }) => (
  <div style={{ paddingTop: 300, maxWidth: 480 }}>
    <div
      style={{
        position: 'relative',
        padding: 'var(--s3) var(--s5)',
        border: '1px solid var(--app-line)',
        borderRadius: 'var(--r-card)',
        background: 'var(--app-panel)',
        color: 'var(--app-text)',
        fontSize: 'var(--t-ctl)',
      }}
    >
      {children}
      <span>{text}</span>
    </div>
  </div>
);

const render = (trigger: MentionTrigger, activeIndex: number) => {
  const matches = rankMentionCandidates(candidates, trigger.query);
  return (
  <ComposerAnchor text={`Ask the team @${trigger.query}`}>
    {matches.length === 0 ? (
      <span style={{ position: 'absolute', left: 'var(--s5)', bottom: 'calc(100% + var(--s2))', fontSize: 'var(--t-meta)', color: 'var(--app-faint)' }}>
        No matches, so the popover stays closed.
      </span>
    ) : null}
    <MentionAutocomplete
      trigger={trigger}
      candidates={matches}
      activeIndex={activeIndex}
      onActiveIndexChange={() => {}}
      onPick={() => {}}
    />
  </ComposerAnchor>
  );
};

export const Default = () => render({ start: 0, query: '' }, 0);

export const WithQuery = () => render({ start: 0, query: 'al' }, 0);

export const SecondActive = () => render({ start: 0, query: 'bo' }, 1);

export const EmptyResults = () => render({ start: 0, query: 'zzz' }, 0);
