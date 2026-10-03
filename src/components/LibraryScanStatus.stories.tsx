import { useState, useEffect } from 'react';
import { LibraryScanStatus, type ScanTask } from './LibraryScanStatus';
import { TASKS, LIBS, credit } from './__fixtures__/mediaLibrary';

export const Default = () => {
  const [tasks, setTasks] = useState<ScanTask[]>(TASKS);

  useEffect(() => {
    const h = setInterval(() => {
      setTasks(ts => {
        const r = ts.find(t => t.state === 'Running');
        if (!r) return ts;
        const pr = Math.min(1, (r.progress ?? 0) + 0.03);
        return ts.map(t =>
          t.id === r.id
            ? pr >= 1
              ? { ...t, state: 'Idle' as const, progress: undefined, lastRun: 'just now', lastDuration: '38s' }
              : { ...t, progress: pr }
            : pr >= 1 && t.state === 'Queued' && !ts.some(x => x.state === 'Queued' && ts.indexOf(x) < ts.indexOf(t))
            ? { ...t, state: 'Running' as const, progress: 0, detail: 'Processing…' }
            : t
        );
      });
    }, 600);
    return () => clearInterval(h);
  }, []);

  const run = (t: ScanTask) =>
    setTasks(ts =>
      ts.map(x =>
        x.id === t.id
          ? { ...x, state: ts.some(y => y.state === 'Running') ? 'Queued' : 'Running', progress: 0, detail: 'Starting…' }
          : x
      )
    );

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <LibraryScanStatus
        tasks={tasks}
        libraries={LIBS}
        onRun={run}
        onCancel={t =>
          setTasks(ts =>
            ts.map(x => (x.id === t.id ? { ...x, state: 'Idle', progress: undefined, lastRun: 'cancelled' } : x))
          )
        }
        onScanAll={() => tasks.filter(t => t.name.startsWith('Scan') && t.state === 'Idle').forEach(run)}
      />
      <div style={{ fontSize: 11, color: 'var(--app-faint)', fontFamily: 'var(--app-mono)' }}>
        &gt; simulated: running tasks advance, queued ones start next.
      </div>
      {credit}
    </div>
  );
};
