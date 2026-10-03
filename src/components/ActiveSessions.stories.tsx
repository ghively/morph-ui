import { useState } from 'react';
import { ActiveSessions } from './ActiveSessions';
import { SESSIONS, credit } from './__fixtures__/mediaLibrary';

export const Default = () => {
  const [list, setList] = useState(SESSIONS);
  const [log, setLog] = useState('> live session telemetry');

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <ActiveSessions
        sessions={list}
        onStop={s => {
          setLog(`> stopped session ${s.id} (${s.user.name})`);
          setList(cur => cur.filter(x => x.id !== s.id));
        }}
        onMessage={s => setLog(`> message ${s.user.name}`)}
        onOpen={s => setLog(`> open item: ${s.item.title}`)}
      />
      <div style={{ fontSize: 11, color: 'var(--app-faint)', fontFamily: 'var(--app-mono)' }}>{log}</div>
      {credit}
    </div>
  );
};
