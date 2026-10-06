import { ToggleSwitch } from './ToggleSwitch';
import { useState } from 'react';
import { FormField } from './FormField';

export default {
  title: 'ToggleSwitch',
  component: ToggleSwitch,
};

export const Default = () => <ToggleSwitch on={false} onChange={() => {}} label="Demo Switch" />;

export const States = () => (
  <div style={{ display: 'flex', gap: 'var(--s4)', alignItems: 'center' }}>
    <ToggleSwitch on={false} onChange={() => {}} label="Off" />
    <ToggleSwitch on onChange={() => {}} label="On" />
    <ToggleSwitch on={false} disabled onChange={() => {}} label="Off, disabled" />
    <ToggleSwitch on disabled onChange={() => {}} label="On, disabled" />
  </div>
);

/** `id` lets FormField's label target the switch. */
export const InFormField = () => {
  const [on, setOn] = useState(true);
  return (
    <FormField id="notify-switch" label="Desktop notifications" hint={on ? 'You will be notified of mentions.' : 'Notifications are muted.'}>
      <ToggleSwitch id="notify-switch" on={on} onChange={setOn} label="Desktop notifications" />
    </FormField>
  );
};
