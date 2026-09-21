import type { StoryDefault, Story } from '@ladle/react';
import { NavigationRail } from './NavigationRail';

export default {
  title: 'Layout/NavigationRail',
} satisfies StoryDefault;

export const Default: Story = () => {
  return (
    <div style={{ height: '100vh', display: 'flex', background: 'var(--app-bg)' }}>
      <NavigationRail
        items={[
          { id: '1', label: 'Item 1', icon: <span>1</span> },
          { id: '2', label: 'Item 2', icon: <span>2</span> }
        ]}
        activeId="1"
        onSelect={() => {}}
        brand={{ name: 'MorphUI' }}
        primaryAction={{ label: 'New', onSelect: () => {} }}
        footerItems={[
          { id: 'f1', label: 'Dashboard', icon: <span>D</span>, onSelect: () => {}, shedWhenFolded: true }
        ]}
        account={{ name: 'Jules', secondary: 'admin', avatar: <div>A</div>, onSelect: () => {} }}
      />
    </div>
  );
};
