import { MentionAutocomplete } from '../../src/components/MentionAutocomplete';
import { TextField } from '../../src/components/TextField';
import type { MentionTrigger } from '../../src/components/MentionAutocomplete';

const candidates = [
  { id: '@alice:example.com', name: 'Alice Moreno' },
  { id: '@bot:example.com', name: 'Support Bot', agentLabel: 'Agent' },
  { id: '@bob:example.com', name: 'Bob Okafor' },
  { id: '@research:example.com', name: 'Research Agent', agentLabel: 'Agent' },
  { id: '@carol:example.com', name: 'Carol Lindqvist' },
];

// The popover anchors to the bottom of its positioned host (it sits above a composer),
// so give it a relative host with room above and a real TextField as the anchor.
const Host = ({ children, query }: { children: React.ReactNode; query: string }) => (
  <div style={{ position: 'relative', height: 300, maxWidth: 480, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
    <div style={{ position: 'relative' }}>
      {children}
      <TextField id={'mention-host-' + query} aria-label="Message" defaultValue={'Can you loop in @' + query} />
    </div>
  </div>
);

const render = (trigger: MentionTrigger, activeIndex: number) => {
  const q = trigger ? trigger.query.toLowerCase() : '';
  const matches = candidates.filter((c) => !q || c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
  return (
    <Host query={trigger ? trigger.query : ''}>
      <MentionAutocomplete
        trigger={trigger}
        candidates={matches}
        activeIndex={activeIndex}
        onActiveIndexChange={() => {}}
        onPick={() => {}}
      />
    </Host>
  );
};

export const Default = () => render({ start: 0, query: '' }, 0);

export const WithQuery = () => render({ start: 0, query: 'al' }, 0);

export const SecondActive = () => render({ start: 0, query: 'b' }, 1);

export const EmptyResults = () => render({ start: 0, query: 'zzz' }, 0);
