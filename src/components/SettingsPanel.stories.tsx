import { useState } from 'react';
import type { StoryDefault, Story } from '@ladle/react';
import { SettingsPanel, SettingRow, SettingRule, TimeRangeField } from './SettingsPanel';

export default {
  title: 'Layout/SettingsPanel',
} satisfies StoryDefault;

export const Default: Story = () => {
  const [active, setActive] = useState('gen');
  const [start, setStart] = useState(480);
  const [end, setEnd] = useState(1020);
  
  return (
    <div style={{ width: 800, height: 600, background: 'var(--app-bg)', color: 'var(--app-text)', display: 'flex' }}>
      <SettingsPanel
        sections={[
          { id: 'gen', label: 'General' },
          { id: 'notif', label: 'Notifications' }
        ]}
        activeSection={active}
        onSectionChange={setActive}
        onClose={() => {}}
      >
        <SettingRow heading="Send with Enter" description="Pressing Enter sends the message">
          <button data-btn="">Toggle</button>
        </SettingRow>
        <SettingRule />
        <SettingRow heading="Quiet hours">
          <TimeRangeField start={start} end={end} onStartChange={setStart} onEndChange={setEnd} />
        </SettingRow>
      </SettingsPanel>
    </div>
  );
};
