import { useState } from 'react';
import { MediaShelf } from './MediaShelf';
import type { MediaItem } from './mediaLibrary.shared';
import { note, TOS, BBB, CAMINANDES, CAM_EPISODES, LIBRARY } from './__fixtures__/mediaLibrary';

export const Default = () => {
  const [msg, setMsg] = useState('> ←/→ inside a row moves focus and scrolls');
  const log = (verb: string) => (it: MediaItem) => setMsg('> ' + verb + ' ' + it.title);
  const resume = [TOS, BBB, CAM_EPISODES[1]!, { ...LIBRARY[5]!, art: { Thumb: CAMINANDES.art.Thumb } }];
  return (
    <div style={{ display: 'grid', gap: 22 }}>
      <MediaShelf title="Continue watching" items={resume} shape="landscape" onOpen={log('open')} onPlay={log('resume')} onSeeAll={() => setMsg('> see all: continue watching')} />
      <MediaShelf title="Recently added" items={LIBRARY} onOpen={log('open')} onPlay={log('play')} onSeeAll={() => setMsg('> see all: recently added')} />
      <MediaShelf title="Next up" items={[]} shape="landscape" emptyText="You're all caught up." />
      {note(msg)}
    </div>
  );
};
