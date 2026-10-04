import './mediaLibrary.shared.css';
import './LibraryScanStatus.css';
import type { CSSProperties } from 'react';

export type TaskState = 'Idle' | 'Running' | 'Queued' | 'Failed';

export interface ScanTask {
  id: string;
  name: string;
  library?: string;
  state: TaskState;
  progress?: number;
  lastRun?: string;
  lastDuration?: string;
  detail?: string;
}

export interface LibraryScanStatusProps {
  tasks: ScanTask[];
  libraries?: { id: string; name: string; type: string; count: number; size?: string }[];
  onRun?: (t: ScanTask) => void;
  onCancel?: (t: ScanTask) => void;
  onScanAll?: () => void;
  className?: string;
}

const K: Record<TaskState, string> = {
  Running: 'var(--state-live)',
  Queued: 'var(--state-wait)',
  Idle: 'var(--state-idle)',
  Failed: 'var(--state-error)',
};

export function LibraryScanStatus(p: LibraryScanStatusProps) {
  const running = p.tasks.filter(t => t.state === 'Running');
  const failed = p.tasks.filter(t => t.state === 'Failed').length;

  return (
    <section className={'ml lsA ml-glass ' + (p.className || '')} aria-label="Library tasks">
      <header className="lsA-head">
        <h3 className="ml-h">Libraries</h3>
        {running.length > 0 && (
          <span className="ml-chip" data-mldot="" data-mllive="" style={{ ['--k' as string]: K.Running }}>
            {running.length} running
          </span>
        )}
        {failed > 0 && (
          <span className="ml-chip" data-mldot="" style={{ ['--k' as string]: K.Failed }}>
            {failed} failed
          </span>
        )}
        <span className="ml-sp" />
        {p.onScanAll && (
          <button type="button" className="ml-pill" data-tone="accent" onClick={p.onScanAll}>
            Scan all
          </button>
        )}
      </header>
      {p.libraries && (
        <div className="lsA-libs">
          {p.libraries.map(l => {
            const busy = p.tasks.find(t => t.library === l.name && t.state === 'Running');
            return (
              <div key={l.id} className="lsA-lib ml-glass-soft" data-busy={busy ? '' : undefined}>
                <span className="lsA-ln">{l.name}</span>
                <span className="lsA-lc ml-num">
                  {l.count} items{l.size ? ' · ' + l.size : ''}
                </span>
                {busy && (
                  <span className="ml-bar lsA-lb">
                    <i style={{ width: (busy.progress ?? 0) * 100 + '%' }} />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
      <ul className="ml-list" aria-live="polite">
        {p.tasks.map(t => (
          <li key={t.id} className="lsA-row ml-li" data-task-state={t.state} style={{ ['--k' as string]: K[t.state] }}>
            <span className="lsA-dot" aria-hidden="true" />
            <div className="lsA-main">
              <div className="ml-row">
                <span className="lsA-name ml-ell">{t.name}</span>
                {t.library && <span className="ml-chip">{t.library}</span>}
              </div>
              {t.state === 'Running' ? (
                <div className="lsA-run">
                  <span className="ml-bar" style={{ ['--k' as string]: K.Running } as CSSProperties}>
                    <i style={{ width: (t.progress ?? 0) * 100 + '%' }} />
                  </span>
                  <span className="ml-num">{Math.round((t.progress ?? 0) * 100)}%</span>
                </div>
              ) : null}
              <span className="lsA-sub ml-ell" data-err={t.state === 'Failed' ? '' : undefined}>
                {t.state === 'Running'
                  ? t.detail
                  : t.state === 'Queued'
                  ? 'Waiting for the current scan'
                  : t.state === 'Failed'
                  ? t.detail
                  : 'Last run ' + t.lastRun + (t.lastDuration ? ' · took ' + t.lastDuration : '')}
              </span>
            </div>
            {t.state === 'Running' || t.state === 'Queued'
              ? p.onCancel && (
                  <button type="button" className="ml-pill" data-size="sm" onClick={() => p.onCancel!(t)}>
                    Cancel
                  </button>
                )
              : p.onRun && (
                  <button
                    type="button"
                    className="ml-pill"
                    data-size="sm"
                    data-tone={t.state === 'Failed' ? 'danger' : undefined}
                    onClick={() => p.onRun!(t)}
                  >
                    {t.state === 'Failed' ? 'Retry' : 'Run'}
                  </button>
                )}
          </li>
        ))}
      </ul>
    </section>
  );
}
