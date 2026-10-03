import { useState } from 'react';
import { ArrItemStatus } from './ArrItemStatus';
import { CAMINANDES, LIBRARY, CAM_ARR, credit } from './__fixtures__/mediaLibrary';

export const Default = () => {
  const [mode, setMode] = useState<'s' | 'r'>('s');
  const [mon, setMon] = useState(true);
  const [seasons, setSeasons] = useState(CAM_ARR);
  const [msg, setMsg] = useState('> toggle monitoring per series or season');

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          className="ml-pill"
          data-tone={mode === 's' ? 'accent' : undefined}
          aria-pressed={mode === 's'}
          onClick={() => setMode('s')}
        >
          Sonarr series
        </button>
        <button
          type="button"
          className="ml-pill"
          data-tone={mode === 'r' ? 'accent' : undefined}
          aria-pressed={mode === 'r'}
          onClick={() => setMode('r')}
        >
          Radarr movie
        </button>
      </div>
      {mode === 's' ? (
        <ArrItemStatus
          key="s"
          app="Sonarr"
          item={CAMINANDES}
          monitored={mon}
          qualityProfile="HD-1080p"
          sizeOnDisk="2.3 GB"
          path="/media/shows/Caminandes"
          nextAiring="Thu 20:00"
          seasons={seasons}
          onMonitorChange={(v, n) => {
            if (n == null) setMon(v);
            else setSeasons(ss => ss.map(s => (s.number === n ? { ...s, monitored: v } : s)));
            setMsg(
              '> ' +
                (v ? 'monitor ' : 'unmonitor ') +
                (n == null ? 'series' : n ? 'season ' + n : 'specials')
            );
          }}
          onSearch={s => setMsg('> search ' + (s === 'all' ? 'all monitored' : 'season ' + s))}
          onInteractive={() => setMsg('> interactive search')}
        />
      ) : (
        <ArrItemStatus
          key="r"
          app="Radarr"
          item={LIBRARY[12]!}
          monitored={mon}
          qualityProfile="Ultra-HD"
          path="/media/films/Sprite Fright (2021)"
          movie={{
            state: 'downloading',
            quality: 'WEBDL-1080p',
            customFormatScore: 25,
            availability: 'Released',
          }}
          onMonitorChange={v => {
            setMon(v);
            setMsg('> ' + (v ? 'monitor' : 'unmonitor'));
          }}
          onSearch={() => setMsg('> search movie')}
          onInteractive={() => setMsg('> interactive search')}
        />
      )}
      <div style={{ fontSize: 11, color: 'var(--app-faint)', fontFamily: 'var(--app-mono)' }}>{msg}</div>
      {credit}
    </div>
  );
};
