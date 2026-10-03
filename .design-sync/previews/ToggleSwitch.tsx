import { useState } from 'react';
import { ToggleSwitch } from '../../src/components/ToggleSwitch';

export const Default = () => {
  const [notify, setNotify] = useState(true);
  const [sound, setSound] = useState(false);
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <ToggleSwitch on={notify} onChange={setNotify} label="Desktop notifications" />
      <ToggleSwitch on={sound} onChange={setSound} label="Play a chime" />
      <ToggleSwitch on disabled onChange={() => {}} label="Managed by workspace policy" />
    </div>
  );
};
