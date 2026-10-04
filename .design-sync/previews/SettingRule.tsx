import { SettingRow, SettingRule, ToggleSwitch } from '@ghively/morph-ui';

export const BetweenRows = () => (
  <div style={{ maxWidth: 560 }}>
    <SettingRow heading="Desktop notifications" description="Alert me when an agent needs approval.">
      <ToggleSwitch label="Desktop notifications" on onChange={() => {}} />
    </SettingRow>
    <SettingRule />
    <SettingRow heading="Sound" description="Play a chime on new messages.">
      <ToggleSwitch label="Sound" on={false} onChange={() => {}} />
    </SettingRow>
  </div>
);
