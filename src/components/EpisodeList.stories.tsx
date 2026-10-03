import { useState } from 'react';
import { EpisodeList } from './EpisodeList';
import type { MediaItem } from './mediaLibrary.shared';
import { note, CAM_SEASONS } from './__fixtures__/mediaLibrary';

export const Default = () => {
  const [msg, setMsg] = useState('> next up defaults to the first unplayed episode');
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <EpisodeList
        seasons={CAM_SEASONS}
        onPlay={(e: MediaItem) => setMsg('> play S01E' + String(e.index).padStart(2, '0') + ' ' + e.title)}
        onOpen={(e: MediaItem) => setMsg('> open ' + e.title)}
      />
      {note(msg)}
    </div>
  );
};
