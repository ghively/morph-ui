import { useState, useMemo } from 'react';
import { ReleaseCalendar } from './ReleaseCalendar';
import { calendarItems, credit } from './__fixtures__/mediaLibrary';

export const Default = () => {
  const items = useMemo(() => calendarItems(), []);
  const [msg, setMsg] = useState('> Sonarr + Radarr calendar, this week');

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <ReleaseCalendar items={items} onSelect={i => setMsg('> ' + i.title + ' · ' + i.sub)} />
      <div style={{ fontSize: 11, color: 'var(--app-faint)', fontFamily: 'var(--app-mono)' }}>
        {msg}. Dates are relative to today; future episodes are illustrative.
      </div>
      {credit}
    </div>
  );
};
