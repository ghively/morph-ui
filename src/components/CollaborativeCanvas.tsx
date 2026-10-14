import './CollaborativeCanvas.css';
import { useZoom, identityHue, hueVar } from './canvas.shared';
import type { Collaborator } from './canvas.shared';
import { LiveCursors } from './LiveCursors';

export type { Collaborator } from './canvas.shared';

export interface CollaborativeCanvasProps {
  /** Document / artifact content. Rendered inside the zoomable content layer. */
  children?: React.ReactNode;
  /** Live collaborators; presence cursors are drawn for those with x/y. */
  collaborators?: Collaborator[];
  /** Canvas content size in the same units as collaborator x/y. */
  contentWidth?: number;
  contentHeight?: number;
  /** Controlled zoom (1 = 100%). Uncontrolled when omitted. */
  zoom?: number;
  defaultZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  onZoomChange?: (zoom: number) => void;
  /** Hide the zoom control cluster (keyboard/document zoom still works). */
  hideZoomControls?: boolean;
  /** Rect of the current selection in content coordinates; drawn as an outline overlay. */
  selection?: { x: number; y: number; width: number; height: number; label?: string };
  /** Extra layers (comments, minimap…) rendered above the content, below the chrome. */
  overlays?: React.ReactNode;
  className?: string;
}

const ZOOM_STEPS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];

/**
 * Live document/artifact canvas: a layered content area (content → overlays →
 * presence cursors → selection outline) with floating zoom controls. Remote
 * collaborators' cursors are coloured from each person's --series-N identity
 * hue. The zoom controls are a real group of buttons; Ctrl/Cmd + / − and 0
 * zoom the canvas when it has focus.
 */
export function CollaborativeCanvas({
  children,
  collaborators = [],
  contentWidth = 1,
  contentHeight = 1,
  zoom: zoomProp,
  defaultZoom = 1,
  minZoom = 0.25,
  maxZoom = 4,
  onZoomChange,
  hideZoomControls = false,
  selection,
  overlays,
  className = '',
}: CollaborativeCanvasProps) {
  const [zoom, setZoom] = useZoom(zoomProp, defaultZoom, onZoomChange);
  const zoomIn = () => {
    const above = ZOOM_STEPS.find((z) => z > zoom + 0.001);
    setZoom(above ?? maxZoom);
  };
  const zoomOut = () => {
    const below = [...ZOOM_STEPS].reverse().find((z) => z < zoom - 0.001);
    setZoom(below ?? minZoom);
  };
  const resetZoom = () => setZoom(1);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!(e.metaKey || e.ctrlKey)) return;
    if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomIn(); }
    else if (e.key === '-') { e.preventDefault(); zoomOut(); }
    else if (e.key === '0') { e.preventDefault(); resetZoom(); }
  };

  const sel = selection
    ? {
        left: `${(selection.x / Math.max(1, contentWidth)) * 100}%`,
        top: `${(selection.y / Math.max(1, contentHeight)) * 100}%`,
        width: `${(selection.width / Math.max(1, contentWidth)) * 100}%`,
        height: `${(selection.height / Math.max(1, contentHeight)) * 100}%`,
        label: selection.label,
      }
    : null;

  return (
    <div
      className={`cv-canvas ${className}`}
      data-collaborative-canvas=""
      style={{ ['--cv-zoom' as string]: zoom }}
      onKeyDown={onKeyDown}
      tabIndex={-1}
    >
      <div className="cv-canvas-viewport" data-canvas-viewport="" role="region" tabIndex={0} aria-label="Canvas viewport">
        <div
          className="cv-canvas-content"
          data-canvas-content=""
          style={{ width: contentWidth, height: contentHeight, transform: `scale(${zoom})` }}
          aria-live="off"
        >
          {children}
          {overlays}
          <LiveCursors collaborators={collaborators} contentWidth={contentWidth} contentHeight={contentHeight} />
          {sel && (
            <div
              className="cv-canvas-selection"
              data-canvas-selection=""
              style={sel as React.CSSProperties}
              aria-hidden="true"
            >
              {sel.label && <span className="cv-canvas-selection-tag">{sel.label}</span>}
            </div>
          )}
        </div>
      </div>

      {!hideZoomControls && (
        <div className="cv-zoom-controls" role="group" aria-label="Canvas zoom" data-canvas-zoom-controls="">
          <button type="button" data-zoom-action="out" onClick={zoomOut} aria-label="Zoom out" title="Zoom out (Ctrl −)">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="M3 8h10" /></svg>
          </button>
          <button type="button" data-zoom-action="reset" onClick={resetZoom} className="cv-zoom-pct" aria-label="Reset zoom to 100%" title="Reset zoom (Ctrl 0)">
            <span className="cv-zoom-pct-text">{Math.round(zoom * 100)}%</span>
          </button>
          <button type="button" data-zoom-action="in" onClick={zoomIn} aria-label="Zoom in" title="Zoom in (Ctrl +)">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="M8 3v10M3 8h10" /></svg>
          </button>
        </div>
      )}

      <ul className="cv-canvas-roster" aria-label="On this canvas" data-canvas-roster="">
        {collaborators.map((c) => (
          <li key={c.id} data-collaborator-id={c.id} style={{ ['--cc' as string]: hueVar(c.hue ?? identityHue(c.id)) }} title={c.name}>
            <i className="cv-canvas-roster-dot" aria-hidden="true" />
            <span className="cv-canvas-roster-name">{c.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
