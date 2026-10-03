import { useState } from 'react';
import { LibraryGrid } from './LibraryGrid';
import { MediaTheme, type MediaItem } from './mediaLibrary.shared';
import { Seg, note, LIBRARY, LIB_THEMES } from './__fixtures__/mediaLibrary';

export const Default = () => {
  const [lib, setLib] = useState<'films' | 'shorts' | 'kids'>('films');
  const [msg, setMsg] = useState('> per-library theme: Films uses artwork accents');
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Seg
        label="library theme"
        value={lib}
        onChange={v => {
          setLib(v);
          setMsg(
            '> theme: ' +
              LIB_THEMES[v]!.label +
              (LIB_THEMES[v]!.useArtAccent === false ? ' (fixed accent ' + LIB_THEMES[v]!.accent + ')' : ' (artwork accents)'),
          );
        }}
        options={[
          { v: 'films', l: 'Films' },
          { v: 'shorts', l: 'Shorts' },
          { v: 'kids', l: 'Kids' },
        ]}
      />
      <MediaTheme.Provider value={LIB_THEMES[lib]!}>
        <LibraryGrid
          key={lib}
          items={LIBRARY}
          height={460}
          onOpen={(it: MediaItem) => setMsg('> open ' + it.title)}
          onPlay={(it: MediaItem) => setMsg('> play ' + it.title)}
        />
      </MediaTheme.Provider>
      {note(msg)}
    </div>
  );
};
