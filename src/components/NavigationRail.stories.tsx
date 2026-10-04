import { useState } from 'react';
import type { StoryDefault, Story } from '@ladle/react';
import { NavigationRail } from './NavigationRail';
import { GlyphIcon } from './GlyphIcon';

export default {
  title: 'Layout/NavigationRail',
} satisfies StoryDefault;

/**
 * The rail is a [data-dockzone] built on the host primitive layer, and it is
 * designed to sit in column 1 of an app [data-frame]: the frame supplies the
 * brand mark (--mark), the dock widths, and the fold. Folded (the default) it
 * shows icons only and opens on hover; [data-pinned="true"] on the frame keeps
 * it open with labels. Rendered bare, the mark has no mask (a white square) and
 * there is nothing to unfold into, which is what the old story showed.
 */
function Shell({ initiallyPinned }: { initiallyPinned: boolean }) {
  const [pinned, setPinned] = useState(initiallyPinned);
  const [active, setActive] = useState('chats');
  return (
    <div data-frame="" data-pinned={String(pinned)} style={{ height: 600 }}>
      <NavigationRail
        items={[
          { id: 'chats', label: 'Chats', icon: <GlyphIcon name="chats" /> },
          { id: 'notes', label: 'Notes', icon: <GlyphIcon name="notes" /> },
          { id: 'agents', label: 'Agents', icon: <GlyphIcon name="agents" /> },
          { id: 'workspace', label: 'Workspace', icon: <GlyphIcon name="workspace" /> },
        ]}
        activeId={active}
        onSelect={setActive}
        brand={{ name: 'MorphUi' }}
        primaryAction={{ label: 'New chat', icon: <GlyphIcon name="plus" />, onSelect: () => {} }}
        footerItems={[
          { id: 'dashboard', label: 'Dashboard', icon: <GlyphIcon name="dashboard" />, onSelect: () => {}, shedWhenFolded: true },
          { id: 'theme', label: 'Theme', icon: <GlyphIcon name="theme" />, onSelect: () => {} },
        ]}
        account={{
          name: 'Jules',
          secondary: 'admin',
          avatar: <span data-avatar="user" aria-hidden="true">J</span>,
          onSelect: () => {},
        }}
        pinned={pinned}
        onPinnedChange={setPinned}
      />
      <div data-inner="" />
    </div>
  );
}

/** Pinned open: icons + labels, wordmark and pin control visible. */
export const Default: Story = () => <Shell initiallyPinned />;

/** Folded: the icon-only rail; hover it (or press the pin) to open. */
export const Folded: Story = () => <Shell initiallyPinned={false} />;
