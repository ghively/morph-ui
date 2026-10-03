import { useState } from 'react';
import { MediaArtwork } from './MediaArtwork';
import { Seg, note, credit, TOS, CAMINANDES, CAM_EPISODES, BROKEN, LIBRARY } from './__fixtures__/mediaLibrary';

export const Default = () => {
  const [lat, setLat] = useState<'0' | '1400'>('0');
  const [k, setK] = useState(0);
  const L = Number(lat);
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <Seg label="latency" value={lat} onChange={v => { setLat(v); setK(x => x + 1); }} options={[{ v: '0', l: 'live' }, { v: '1400', l: '+1.4s' }]} />
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            onClick={() => setK(x => x + 1)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '3px 8px',
              borderRadius: 6,
              border: '1px solid var(--app-line)',
              color: 'var(--app-dim)',
              fontFamily: 'var(--app-mono)',
              fontSize: 11,
            }}
          >
            reload
          </button>
        </div>
      </div>
      <div key={k} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
        <MediaArtwork item={TOS} type="Primary" shape="portrait" latency={L} showMeta />
        <MediaArtwork item={BROKEN} type="Primary" fallback={['Thumb', 'Backdrop']} shape="portrait" latency={L} showMeta />
        <MediaArtwork item={LIBRARY[4]!} type="Primary" shape="portrait" latency={L} showMeta />
      </div>
      <div key={'l' + k} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
        <MediaArtwork item={CAMINANDES} type="Thumb" shape="landscape" latency={L} showMeta />
        <MediaArtwork item={CAM_EPISODES[0]!} type="Primary" fallback={['Thumb', 'Backdrop']} shape="landscape" latency={L} showMeta />
      </div>
      {note('Row 1: blurhash placeholder → Primary · Primary and Thumb 404 → Backdrop · no art → title tile. Row 2: series Thumb · episode with no still → series Backdrop.')}
      {credit}
    </div>
  );
};
