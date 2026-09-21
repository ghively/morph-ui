import type { StoryDefault, Story } from "@ladle/react";
import { DirectoryBrowser } from './DirectoryBrowser';
import { useState } from 'react';

export default {
  title: 'Features/DirectoryBrowser',
} satisfies StoryDefault;

export const Default: Story = () => {
    const [tab, setTab] = useState<'collections' | 'directory' | 'address'>('collections');
    return (
      <DirectoryBrowser
        tab={tab}
        onTabChange={setTab}
        list={{
            status: 'done',
            entries: [
                {
                    id: '1', name: 'General', state: 'none', action: { label: 'Join', kind: 'join', disabled: false }
                }
            ],
            hasMore: false,
            error: null,
            degraded: false
        }}
        onAct={() => {}}
        onClose={() => {}}
      />
    );
};
