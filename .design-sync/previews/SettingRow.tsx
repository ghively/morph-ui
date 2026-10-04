import { SettingRow, SettingRule, ToggleSwitch, Select } from '@ghively/morph-ui';

export const Default = () => (
  <div style={{ maxWidth: 560 }}>
    <SettingRow heading="Send with Enter" description="Press Enter to send; Shift+Enter adds a new line.">
      <ToggleSwitch label="Send with Enter" on onChange={() => {}} />
    </SettingRow>
    <SettingRule />
    <SettingRow heading="Default model" description="Used for new conversations.">
      <Select id="default-model" aria-label="Default model" value="sonnet" onChange={() => {}} options={[{ value: 'sonnet', label: 'Sonnet' }, { value: 'haiku', label: 'Haiku' }]} />
    </SettingRow>
  </div>
);
