import { MentionAutocomplete } from './MentionAutocomplete';
import type { MentionTrigger } from './MentionAutocomplete';

const candidates = [
  { id: '@alice:example.com', name: 'Alice' },
  { id: '@bot:example.com', name: 'Support Bot', agentLabel: 'Agent' },
  { id: '@bob:example.com', name: 'Bob' },
];

export default {
  title: 'MentionAutocomplete',
};

const render = (trigger: MentionTrigger, activeIndex: number) => (
  <MentionAutocomplete
    trigger={trigger}
    candidates={candidates}
    activeIndex={activeIndex}
    onActiveIndexChange={() => {}}
    onPick={() => {}}
  />
);

export const Default = () => render({ start: 0, query: '' }, 0);

export const WithQuery = () => render({ start: 0, query: 'al' }, 0);

export const SecondActive = () => render({ start: 0, query: 'bo' }, 1);

export const EmptyResults = () => render({ start: 0, query: 'zzz' }, 0);
