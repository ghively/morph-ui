import './SyncStatusIndicator.css';

export type SyncStatus = 'idle' | 'syncing' | 'offline' | 'conflict';

export interface SyncStatusIndicatorProps {
  status: SyncStatus;
  /** Pill caption; defaults to a word per status. */
  label?: string;
  /** Secondary line, e.g. "12 changes queued" or "3m ago". */
  meta?: string;
  /** Accessible name. Default `label` or the status word. */
  name?: string;
  className?: string;
}

const DEFAULTS: Record<SyncStatus, string> = {
  idle: 'Synced',
  syncing: 'Syncing',
  offline: 'Offline',
  conflict: 'Conflict',
};

/**
 * Compact sync pill: animated icon + status word for idle/syncing/offline/
 * conflict. The dot orbits while syncing, goes hollow offline, and splits
 * while a conflict needs a decision. Provenance: original morph-ui design (2026-10).
 */
export function SyncStatusIndicator({ status, label, meta, name, className = '' }: SyncStatusIndicatorProps) {
  const text = label ?? DEFAULTS[status];
  return (
    <span
      className={className}
      data-sync=""
      data-status={status}
      role="status"
      aria-label={name ?? text}
      title={meta}
    >
      <span data-syncicon="" aria-hidden="true">
        {status === 'syncing' ? (
          // orbit: two dots chasing (pure CSS animation, static SVG bones)
          <svg viewBox="0 0 16 16" width="14" height="14">
            <circle data-syncorbit="" cx="8" cy="8" r="6" fill="none" strokeWidth="1.6" />
            <circle data-syncmoon="" cx="8" cy="2" r="2.2" />
          </svg>
        ) : status === 'conflict' ? (
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 3v6a3 3 0 0 0 3 3h3" />
            <path d="M11 12l-2-2m2 2l-2 2" />
            <path d="M11 3v6a3 3 0 0 1-3 3H5" className="sync-ghost" />
            <path d="M5 12l2-2m-2 2l2 2" className="sync-ghost" />
          </svg>
        ) : status === 'offline' ? (
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6.5L1.5 9a5.2 5.2 0 0 0 7 7L11 13.5" />
            <path d="M12 9.5L14.5 7a5.2 5.2 0 0 0-7-7L5 2.5" />
            <path d="M3.5 3.5l9 9" />
          </svg>
        ) : (
          // idle: settled double-check
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 8.5l3 3 5.5-6.5" />
            <path d="M7.5 11l1 1L14 5.5" className="sync-ghost" />
          </svg>
        )}
      </span>
      <span data-synclabel="">{text}</span>
      {meta && <span data-syncmeta="">{meta}</span>}
    </span>
  );
}
