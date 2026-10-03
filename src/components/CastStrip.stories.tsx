import { useState } from 'react';
import { CastStrip } from './CastStrip';
import type { Person } from './mediaLibrary.shared';
import { note, TOS } from './__fixtures__/mediaLibrary';

export const Default = () => {
  const [msg, setMsg] = useState('> no profile images in the demo set, so initials render');
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <CastStrip people={TOS.people!} title="Cast & crew" onSelect={(p: Person) => setMsg('> open person ' + p.name)} />
      {note(msg)}
    </div>
  );
};
