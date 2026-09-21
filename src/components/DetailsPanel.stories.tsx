import type { StoryDefault, Story } from '@ladle/react';
import { DetailsPanel, ProfileCard } from './DetailsPanel';

export default {
  title: 'Layout/DetailsPanel',
} satisfies StoryDefault;

export const Default: Story = () => (
  <div style={{ width: 320, height: '100vh', background: 'var(--app-panel)' }}>
    <DetailsPanel
      kind="Member"
      context="Design Team"
      label="Member details"
      onClose={() => {}}
      onBack={() => {}}
    >
      <ProfileCard
        title="Jules"
        identifier="@jules:morphui"
        avatar={<div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--app-blue)' }} />}
        status={{ text: 'online', tone: 'ok' }}
      />
      <ProfileCard
        eyebrow="Agent"
        title="Morph Assistant"
        chips={['Search', 'Edit']}
        badges={[{ id: 'b1', label: 'Bot', solid: true }]}
        note="Backend healthy"
      />
    </DetailsPanel>
  </div>
);
