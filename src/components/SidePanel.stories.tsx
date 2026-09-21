import type { StoryDefault, Story } from '@ladle/react';
import { SidePanel } from './SidePanel';

export default {
  title: 'Layout/SidePanel',
} satisfies StoryDefault;

export const Default: Story = () => {
  return (
    <div style={{ width: 300, height: '100vh', background: 'var(--app-panel)' }}>
      <SidePanel
        open={true}
        slot="drawer"
        title="Rooms"
        subtitle="example.com"
        icon={<span>#</span>}
        onClose={() => {}}
        bodyId="rooms-body"
      >
        <div style={{ padding: 16 }}>Room list here</div>
      </SidePanel>
    </div>
  );
};
