import { useState } from 'react';
import { ProfilePicker } from './ProfilePicker';
import { USERS, credit } from './__fixtures__/mediaLibrary';

export const Default = () => {
  const [msg, setMsg] = useState("> Sam's PIN is 1234");

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <ProfilePicker
        users={USERS}
        onSelect={u => setMsg('> signed in as ' + u.name)}
        onVerifyPin={(_, pin) => pin === '1234'}
        onAdd={() => setMsg('> add profile')}
      />
      <div style={{ fontSize: 11, color: 'var(--app-faint)', fontFamily: 'var(--app-mono)' }}>{msg}</div>
      {credit}
    </div>
  );
};
