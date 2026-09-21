import type { StoryDefault, Story } from '@ladle/react';
import { StatusRowList, CollapsibleSection } from './StatusRowList';

export default {
  title: 'StatusRowList',
} satisfies StoryDefault;

export const WorkspaceRows: Story = () => (
  <div style={{ padding: '20px', maxWidth: 600 }}>
    <StatusRowList 
      flush
      rows={[
        { id: '1', title: 'morph.example.com', meta: 'Homeserver', metaFirst: true },
        { id: '2', title: 'Enabled', meta: 'Federation', metaFirst: true }
      ]}
    />
  </div>
);

export const AgentRows: Story = () => (
  <div style={{ padding: '20px', maxWidth: 800 }}>
    <StatusRowList 
      rows={[
        {
          id: '1',
          size: 'lg',
          title: 'Reviewer Agent',
          lead: true,
          onTitleSelect: () => {},
          badges: [{ id: 'b1', label: 'v1.2', solid: true, tone: 'ok' }],
          inlineStatus: { text: 'Online', tone: 'ok', live: true },
          identifier: '@reviewer:example.com',
          chips: ['read_events', 'write_events'],
          meta: 'Last active 5m ago',
          metric: { label: 'Requests', value: '1.2k' },
          actions: [
            { id: 'm1', label: 'Message', variant: 'accent', onSelect: () => {} },
            { id: 'm2', label: 'Mention', onSelect: () => {} }
          ]
        }
      ]}
    />
  </div>
);

export const AdminModeration: Story = () => (
  <div style={{ padding: '20px', maxWidth: 600 }}>
    <CollapsibleSection title="Moderation" meta="2 users">
      <StatusRowList 
        rows={[
          {
            id: '1',
            title: 'User 1',
            meta: '@user1:example.com',
            actions: [{ id: 'b', label: 'Ban', tone: 'danger', onSelect: () => {} }]
          },
          {
            id: '2',
            title: 'User 2',
            meta: '@user2:example.com',
            actions: [{ id: 'u', label: 'Unban', onSelect: () => {} }]
          }
        ]}
      />
    </CollapsibleSection>
  </div>
);

export const Listbox: Story = () => (
  <div style={{ padding: '20px', maxWidth: 400 }}>
    <StatusRowList 
      semantics="listbox"
      rows={[
        { id: '1', title: 'Note 1', meta: 'Yesterday', selected: true, onSelect: () => {} },
        { id: '2', title: 'Note 2', meta: '2 days ago', onSelect: () => {} }
      ]}
    />
  </div>
);
