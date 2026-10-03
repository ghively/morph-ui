import { useState } from 'react';
import { AlbumTrackList } from './AlbumTrackList';
import { ALBUMS, TRACKS, Seg, credit } from './__fixtures__/mediaLibrary';

export const Default = () => {
  const [al, setAl] = useState<'sintel' | 'tos'>('sintel');
  const [now, setNow] = useState<string | null>('al-sintel-1');
  const [playing, setPlaying] = useState(true);
  const [msg, setMsg] = useState('> click a track to play; heart to toggle favorites');
  const album = al === 'sintel' ? ALBUMS[0]! : ALBUMS[1]!;
  const tracks = TRACKS[album.id]!;

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Seg
        label="album"
        value={al}
        onChange={v => {
          setAl(v);
          setNow(null);
        }}
        options={[
          { v: 'sintel', l: 'Sintel (2 discs)' },
          { v: 'tos', l: 'Tears of Steel' },
        ]}
      />
      <AlbumTrackList
        album={album}
        tracks={tracks}
        nowPlayingId={now ?? undefined}
        playing={playing}
        onPlay={t => {
          setNow(t.id);
          setPlaying(true);
          setMsg('> playing ' + t.title);
        }}
        onPlayAll={sh => setMsg('> play all ' + album.title + (sh ? ' (shuffle)' : ''))}
        onFavoriteChange={(f, t) => setMsg('> ' + (f ? 'favorite ' : 'unfavorite ') + t.title)}
      />
      <div style={{ fontSize: 11, color: 'var(--app-faint)', fontFamily: 'var(--app-mono)' }}>{msg}</div>
      {credit}
    </div>
  );
};
