import { useState } from 'react';
import { ArtworkPicker, type RemoteImage } from './ArtworkPicker';
import { TOS, credit } from './__fixtures__/mediaLibrary';
import type { MediaItem } from './mediaLibrary.shared';

const B = TOS.art.Backdrop as string[];
const DEMO_IMAGES: RemoteImage[] = [
  { url: TOS.art.Primary as string, type: 'Primary', provider: 'TheMovieDb', width: 2700, height: 4000, lang: 'en', rating: 5.6, votes: 12 },
  { url: B[1]!, type: 'Primary', provider: 'Fanart.tv', width: 1000, height: 1426, lang: 'en', rating: 4.2, votes: 3 },
  { url: B[0]!, type: 'Primary', provider: 'TheMovieDb', width: 2000, height: 3000, lang: 'nl', rating: 3.9, votes: 2 },
  ...B.map((u, i) => ({
    url: u,
    type: 'Backdrop' as const,
    provider: i ? 'Fanart.tv' : 'TheMovieDb',
    width: 3840,
    height: 1600,
    rating: 5.3 - i * 0.4,
    votes: 8 - i * 2,
  })),
  { url: B[2]!, type: 'Thumb', provider: 'Fanart.tv', width: 1000, height: 562, lang: 'en', rating: 4.8, votes: 4 },
];

export const Default = () => {
  const [it, setIt] = useState<MediaItem>(TOS);
  const [msg, setMsg] = useState('> pick a candidate, then set it');

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <ArtworkPicker
        item={it}
        images={DEMO_IMAGES}
        onApply={img => {
          setIt(x => ({ ...x, art: { ...x.art, [img.type]: img.type === 'Backdrop' ? [img.url] : img.url } }));
          setMsg('> set ' + img.type + ' from ' + img.provider);
        }}
        onUpload={t => setMsg('> upload ' + t)}
      />
      <div style={{ fontSize: 11, color: 'var(--app-faint)', fontFamily: 'var(--app-mono)' }}>
        {msg}. Providers and votes are demo values.
      </div>
      {credit}
    </div>
  );
};
