import type { StoryDefault, Story } from '@ladle/react';
import { PaneHeader } from './PaneHeader';

export default {
  title: 'Layout/PaneHeader',
} satisfies StoryDefault;

export const Default: Story = () => (
  <PaneHeader 
    title="Main Workspace"
    subtitle="12 members"
    status={{ tone: 'ok', label: 'Connected', detail: 'example.com', phase: 'ready' }}
    actions={[
      { id: 'search', label: 'Search', icon: <span>S</span>, shortLabel: <span style={{ fontFamily: 'var(--app-mono)' }}>⌘K</span>, onSelect: () => {} },
      { id: 'rooms', label: 'Rooms', icon: <span>R</span>, shortLabel: 'Rooms', active: true, controls: 'r-1', onSelect: () => {} }
    ]}
  />
);
