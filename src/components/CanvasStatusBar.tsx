import './CanvasStatusBar.css';

export type CanvasConnection = 'live' | 'syncing' | 'offline';

export interface CanvasStatusBarProps {
  /** Zoom ratio; 1 = 100%. */
  zoom?: number;
  /** Cursor position in content coordinates. */
  cursor?: { x: number; y: number };
  /** Active tool name shown as-is. */
  tool?: string;
  connection?: CanvasConnection;
  /** Extra status chips rendered on the right. */
  children?: React.ReactNode;
  className?: string;
}

const CONN_META: Record<CanvasConnection, { label: string; tone: string }> = {
  live: { label: 'Live', tone: 'var(--state-ok)' },
  syncing: { label: 'Syncing…', tone: 'var(--state-wait)' },
  offline: { label: 'Offline', tone: 'var(--state-error)' },
};

/**
 * Bottom status bar for a canvas surface: zoom percentage, cursor
 * coordinates, active tool and the live-connection state, all in tabular
 * numerals. Purely read-only chrome; no interactive elements unless children
 * supply them.
 */
export function CanvasStatusBar({ zoom = 1, cursor, tool, connection = 'live', children, className = '' }: CanvasStatusBarProps) {
  const conn = CONN_META[connection];
  return (
    <div className={`cv-statusbar ${className}`} data-canvas-statusbar="" data-connection={connection} role="status">
      <span className="cv-status-item" data-status-zoom="">
        <span className="cv-status-k">Zoom</span>
        <span className="cv-status-v">{Math.round(zoom * 100)}%</span>
      </span>
      {cursor && (
        <span className="cv-status-item" data-status-coords="">
          <span className="cv-status-k">Cursor</span>
          <span className="cv-status-v">
            {Math.round(cursor.x)}, {Math.round(cursor.y)}
          </span>
        </span>
      )}
      {tool && (
        <span className="cv-status-item" data-status-tool="">
          <span className="cv-status-k">Tool</span>
          <span className="cv-status-v">{tool}</span>
        </span>
      )}
      <span className="cv-status-spacer" />
      {children}
      <span className="cv-status-item cv-status-conn" data-status-connection="" style={{ ['--conn' as string]: conn.tone }}>
        <i className="cv-status-conn-dot" aria-hidden="true" />
        <span className="cv-status-v">{conn.label}</span>
      </span>
    </div>
  );
}
