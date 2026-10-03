import { useState, useEffect } from 'react';
import { DownloadQueue, type QueueItem } from './DownloadQueue';
import { QUEUE, credit } from './__fixtures__/mediaLibrary';

export const Default = () => {
  const [items, setItems] = useState<QueueItem[]>(QUEUE);
  const [paused, setPaused] = useState(false);
  const [alt, setAlt] = useState(false);

  useEffect(() => {
    if (paused) return;
    const h = setInterval(() => {
      setItems(xs =>
        xs.map(q => {
          if (q.state === 'downloading') {
            const sp = (q.speed ?? 0) * (alt ? 0.25 : 1);
            const pr = Math.min(1, q.progress + sp / q.size);
            return pr >= 1
              ? {
                  ...q,
                  progress: 1,
                  state: q.protocol === 'usenet' ? 'extracting' : 'seeding',
                  eta: undefined,
                }
              : {
                  ...q,
                  progress: pr,
                  eta: Math.round((q.size * (1 - pr)) / Math.max(1, sp)),
                };
          }
          if (q.state === 'extracting' && Math.random() < 0.15) return { ...q, state: 'importing' };
          if (q.state === 'importing' && Math.random() < 0.2) return { ...q, state: 'completed' };
          return q;
        })
      );
    }, 1000);
    return () => clearInterval(h);
  }, [paused, alt]);

  const set = (id: string, x: Partial<QueueItem>) =>
    setItems(xs => xs.map(q => (q.id === id ? { ...q, ...x } : q)));

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <DownloadQueue
        items={items}
        paused={paused}
        onPauseAll={setPaused}
        altSpeed={alt}
        onAltSpeed={setAlt}
        onPause={q => set(q.id, { state: 'paused' })}
        onResume={q => set(q.id, { state: 'downloading' })}
        onRetry={q =>
          set(q.id, { state: 'downloading', error: undefined, speed: 22 * 1024 ** 2 })
        }
        onRemove={q => setItems(xs => xs.filter(x => x.id !== q.id))}
      />
      <div style={{ fontSize: 11, color: 'var(--app-faint)', fontFamily: 'var(--app-mono)' }}>
        &gt; simulated SABnzbd + qBittorrent queue; release names are illustrative.
      </div>
      {credit}
    </div>
  );
};
