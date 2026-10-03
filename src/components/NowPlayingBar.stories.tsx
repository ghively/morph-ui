import { useState, useEffect } from 'react';
import { NowPlayingBar, type Repeat } from './NowPlayingBar';
import { TRACKS, type Track, credit } from './__fixtures__/mediaLibrary';

export const Default = () => {
  const queue: Track[] = [...TRACKS['al-sintel']!.slice(0, 3), ...TRACKS['al-tos']!.slice(0, 2), ...TRACKS['al-bbb']!.slice(0, 2)];
  const [i, setI] = useState(0);
  const [pos, setPos] = useState(31);
  const [playing, setPlaying] = useState(true);
  const [shuffle, setShuffle] = useState(false);
  const [rep, setRep] = useState<Repeat>('off');
  const [vol, setVol] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const t = queue[i]!;

  useEffect(() => {
    if (!playing) return;
    const h = setInterval(() => {
      setPos(x => {
        if (x + 1 >= t.seconds) {
          setI(n => (n + 1) % queue.length);
          return 0;
        }
        return x + 1;
      });
    }, 1000);
    return () => clearInterval(h);
  }, [playing, i, t.seconds, queue.length]);

  const go = (d: number) => {
    setI(n => (n + d + queue.length) % queue.length);
    setPos(0);
  };

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <NowPlayingBar
        track={t}
        position={pos}
        duration={t.seconds}
        playing={playing}
        shuffle={shuffle}
        repeat={rep}
        volume={vol}
        muted={muted}
        queueCount={queue.length - i - 1}
        onPlayPause={() => setPlaying(x => !x)}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
        onSeek={setPos}
        onShuffle={() => setShuffle(x => !x)}
        onRepeat={() => setRep(r => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'))}
        onVolume={v => {
          setVol(v);
          setMuted(false);
        }}
        onMute={() => setMuted(x => !x)}
        onQueue={() => {}}
        onLyrics={() => {}}
      />
      <div style={{ fontSize: 11, color: 'var(--app-faint)', fontFamily: 'var(--app-mono)' }}>
        &gt; simulated playback; next/prev changes track and the accent follows the cover. Track names are placeholders.
      </div>
      {credit}
    </div>
  );
};
