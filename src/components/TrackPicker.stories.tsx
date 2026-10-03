import { useState } from 'react';
import { TrackPicker, tracksFromItem, type TrackSelection } from './TrackPicker';
import { TOS } from './__fixtures__/mediaLibrary';

export const Default = () => {
  const t = tracksFromItem(TOS);
  t.subtitles[0] = { ...t.subtitles[0]!, isDefault: true, sdh: true };
  t.subtitles.push({ index: 30, label: 'ENG', lang: 'eng', codec: 'subrip', forced: true, external: true });
  const [v, setV] = useState<TrackSelection>({ audio: 1, subtitle: 12, quality: 'orig' });
  return (
    <div style={{ display: 'grid', gap: 10, maxWidth: 500 }}>
      <TrackPicker item={TOS} audio={t.audio} subtitles={t.subtitles} source={{ bitrate: 18.4e6, height: 1600 }} value={v} onChange={setV} defaultTab="subtitles" />
      <div style={{ fontSize: 11, color: 'var(--app-faint)', fontFamily: 'var(--app-mono)' }}>
        &gt; audio={v.audio} subtitle={v.subtitle} quality={v.quality}. Pick 720p with the PGS track to see the burn-in warning.
      </div>
    </div>
  );
};
