import { useState } from 'react';
import { PosterCard } from '../../src/components/PosterCard';
import type { MediaItem } from '../../src/components/mediaLibrary.shared';
import { cap, note, BBB, SINTEL, CAMINANDES, CAM_EPISODES, TOS, LIBRARY } from '../../src/components/__fixtures__/mediaLibrary';

export const Default = () => {
  const [msg, setMsg] = useState('> hover or tab to a card');
  const log = (verb: string) => (it: MediaItem) => setMsg('> ' + verb + ' ' + it.title);
  const on = {
    onOpen: log('open'),
    onPlay: log('play'),
    onPlayedChange: (v: boolean, it: MediaItem) => setMsg('> ' + (v ? 'played ' : 'unplayed ') + it.title),
    onFavoriteChange: (v: boolean, it: MediaItem) => setMsg('> ' + (v ? 'favorite ' : 'unfavorite ') + it.title),
  };
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      {cap('Portrait · resume / watched / unplayed count / no art')}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
        <PosterCard item={BBB} {...on} />
        <PosterCard item={SINTEL} {...on} />
        <PosterCard item={CAMINANDES} shape="portrait" {...on} />
        <PosterCard item={LIBRARY[7]!} {...on} />
      </div>
      {cap('Landscape · episode still and Thumb')}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
        <PosterCard item={CAM_EPISODES[1]!} {...on} />
        <PosterCard item={TOS} shape="landscape" {...on} />
      </div>
      {note(msg)}
    </div>
  );
};
