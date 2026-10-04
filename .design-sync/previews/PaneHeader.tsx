import { PaneHeader } from '../../src/components/PaneHeader';
import { GlyphIcon } from '../../src/components/GlyphIcon';

export const Default = () => (
  <PaneHeader
    title="Main Workspace"
    subtitle="12 members · 3 agents"
    ornament={<GlyphIcon name="workspace" size={20} />}
    status={{ tone: 'ok', label: 'Connected', detail: 'example.com', phase: 'live' }}
    actions={[
      { id: 'search', label: 'Search', icon: <GlyphIcon name="search" />, onSelect: () => {} },
      { id: 'threads', label: 'Threads', icon: <GlyphIcon name="threads" />, onSelect: () => {} },
      { id: 'people', label: 'Members', icon: <GlyphIcon name="people" />, active: true, controls: 'members-panel', onSelect: () => {} },
    ]}
  />
);
