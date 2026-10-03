import { useState } from 'react';
import { IndexerHealth } from './IndexerHealth';
import { SERVICES, credit } from './__fixtures__/mediaLibrary';

export const Default = () => {
  const [msg, setMsg] = useState('> 24h latency per indexer; Test simulates a check');

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <IndexerHealth
        services={SERVICES}
        onOpen={s => setMsg('> open ' + s.name + ' settings')}
        onTest={s =>
          new Promise(r =>
            setTimeout(() => {
              r(s.status !== 'error');
              setMsg('> tested ' + s.name);
            }, 800)
          )
        }
      />
      <div style={{ fontSize: 11, color: 'var(--app-faint)', fontFamily: 'var(--app-mono)' }}>
        {msg}. Services are demo data (Prowlarr-style indexers, SABnzbd, qBittorrent, Sonarr, Radarr).
      </div>
      {credit}
    </div>
  );
};
