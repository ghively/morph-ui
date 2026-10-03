import { useState, useEffect } from 'react';
import { PlayerScrubber, fmtT } from './PlayerScrubber';
import { TOS, credit } from './__fixtures__/mediaLibrary';

const F = TOS.art.Backdrop as string[];

export const Default = () => {
  const [pos, setPos] = useState(18);
  const [playing, setPlaying] = useState(true);
  const [msg, setMsg] = useState('> hover the bar for previews; ←/→ seeks 10s');

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setPos(x => (x + 1 >= 734 ? 0 : x + 1)), 1000);
    return () => clearInterval(t);
  }, [playing]);

  return (
    <div style={{ display: 'grid', gap: 12, paddingTop: 46 }}>
      <PlayerScrubber
        item={TOS}
        duration={734}
        position={pos}
        buffered={Math.min(734, pos + 140)}
        playing={playing}
        onPlayPause={() => setPlaying(x => !x)}
        onSeek={t => {
          setPos(t);
          setMsg('> seek ' + fmtT(t));
        }}
        onSkip={s => {
          setPos(s.end);
          setMsg('> skipped ' + s.type.toLowerCase());
        }}
        chapters={[
          { start: 0, title: 'Chapter 1', image: F[0] },
          { start: 160, title: 'Chapter 2', image: F[1] },
          { start: 380, title: 'Chapter 3', image: F[2] },
          { start: 590, title: 'Chapter 4', image: F[0] },
        ]}
        segments={[
          { type: 'Intro', start: 0, end: 42 },
          { type: 'Outro', start: 680, end: 734 },
        ]}
      />
      <div style={{ fontSize: 11, color: 'var(--app-faint)', fontFamily: 'var(--app-mono)' }}>{msg}</div>
      {credit}
    </div>
  );
};
