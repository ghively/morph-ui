import type { StoryDefault, Story } from '@ladle/react';
import { MentionAutocomplete } from './MentionAutocomplete';

export default {
  component: MentionAutocomplete,
  title: 'MentionAutocomplete',
  parameters: {
    layout: 'centered',
  };


const candidates = [
  { id: '@alice:example.com', name: 'Alice' },
  { id: '@bot:example.com', name: 'Support Bot', agentLabel: 'Agent' },
  { id: '@bob:example.com', name: 'Bob' },
];

export const 
  args: {
    trigger: { start: 0, query: '' },
    candidates,
    activeIndex: 0,
    onActiveIndexChange: () => {},
    onPick: () => {},
  },

};

export default {
  title: 'MentionAutocomplete',
} satisfies StoryDefault;
