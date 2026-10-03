import { useState } from 'react';
import { CollectionTile } from './CollectionTile';
import type { MediaItem } from './mediaLibrary.shared';
import { TOS, SINTEL, BBB, LIBRARY, credit } from './__fixtures__/mediaLibrary';

export const Default = () => {
  const [msg, setMsg] = useState('> hover to spread the fan');
  const open = (c: MediaItem) => setMsg('> open collection ' + c.title);
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14 }}>
        <CollectionTile collection={{ id: 'bx1', type: 'BoxSet', title: 'Blender open movies', art: {} }} items={[TOS, SINTEL, BBB, LIBRARY[4]!, LIBRARY[5]!]} onOpen={open} />
        <CollectionTile collection={{ id: 'bx2', type: 'BoxSet', title: 'Studio shorts 2015–2018', art: {} }} items={LIBRARY.slice(6, 10)} onOpen={open} />
      </div>
      <div style={{ fontSize: 11, color: 'var(--app-faint)', fontFamily: 'var(--app-mono)' }}>{msg}. Members without posters fall back to title tiles.</div>
      {credit}
    </div>
  );
};
