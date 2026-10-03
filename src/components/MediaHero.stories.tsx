import { useState } from 'react';
import { MediaHero } from './MediaHero';
import { MediaTheme, type MediaItem } from './mediaLibrary.shared';
import { Seg, note, TOS, SINTEL, CAMINANDES } from './__fixtures__/mediaLibrary';

export const Default = () => {
  const [id, setId] = useState<'tos' | 'sintel' | 'cam'>('tos');
  const [msg, setMsg] = useState('> theme audio starts muted');
  const it = id === 'tos' ? TOS : id === 'sintel' ? SINTEL : CAMINANDES;
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Seg label="item" value={id} onChange={setId} options={[{ v: 'tos', l: '3 backdrops' }, { v: 'sintel', l: 'theme video' }, { v: 'cam', l: 'series' }]} />
      <MediaTheme.Provider value={{ backdropInterval: 6000, themeAudio: 'muted' }}>
        <MediaHero
          key={id}
          item={it}
          onPlay={(x: MediaItem, r: boolean) => setMsg('> ' + (r ? 'resume ' : 'play ') + x.title)}
          onTrailer={(x: MediaItem) => setMsg('> trailer ' + x.title)}
          onPlayedChange={(v: boolean, x: MediaItem) => setMsg('> ' + (v ? 'played ' : 'unplayed ') + x.title)}
          onFavoriteChange={(v: boolean, x: MediaItem) => setMsg('> ' + (v ? 'favorite ' : 'unfavorite ') + x.title)}
        />
      </MediaTheme.Provider>
      {note(msg)}
      {note('No clear logos in the demo set, so the title renders as text. Theme video: Sintel, muted until toggled.')}
    </div>
  );
};
