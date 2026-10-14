import './CanvasVersionRail.css';
import { fmtRel, fmtClock } from './canvas.shared';

export interface CanvasVersion {
  id: string;
  /** ISO timestamp of the save. */
  at: string;
  /** Who produced this version. */
  by?: string;
  label?: string;
}

export interface CanvasVersionRailProps {
  versions: CanvasVersion[];
  /** Currently viewed version id; defaults to the latest. */
  currentId?: string;
  onSelect?: (id: string) => void;
  /** Restore the given version. */
  onRestore?: (id: string) => void;
  /** Reference "now" for relative timestamps (stories/tests). */
  now?: string;
  className?: string;
}

/**
 * Vertical version-history rail. One dot per version along a spine, newest at
 * the bottom; each entry shows a timestamp, author and optional label. The
 * current version is highlighted; any other version offers a Restore action.
 */
export function CanvasVersionRail({ versions, currentId, onSelect, onRestore, now, className = '' }: CanvasVersionRailProps) {
  const current = currentId ?? versions[versions.length - 1]?.id;
  return (
    <div className={`cv-version-rail ${className}`} data-version-rail="" role="list" aria-label="Version history">
      {versions.map((v) => {
        const isCurrent = v.id === current;
        const rel = fmtRel(v.at, now);
        return (
          <div
            key={v.id}
            className="cv-version"
            data-version-id={v.id}
            data-current={isCurrent ? 'true' : 'false'}
            role="listitem"
            tabIndex={0}
            aria-current={isCurrent ? 'true' : undefined}
            onClick={() => onSelect?.(v.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(v.id); }
            }}
          >
            <span className="cv-version-dot" aria-hidden="true" />
            <span className="cv-version-body">
              <span className="cv-version-meta">
                <time dateTime={v.at} title={fmtClock(v.at)}>{rel}</time>
                {v.by && <span className="cv-version-by">{v.by}</span>}
              </span>
              {v.label && <span className="cv-version-label">{v.label}</span>}
              <span className="cv-version-actions">
                {isCurrent ? (
                  <span className="cv-version-now" data-version-state="current">Current</span>
                ) : (
                  <button
                    type="button"
                    className="cv-version-restore"
                    data-version-restore={v.id}
                    onClick={(e) => { e.stopPropagation(); onRestore?.(v.id); }}
                  >
                    Restore
                  </button>
                )}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
