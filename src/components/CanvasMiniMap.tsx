import './CanvasMiniMap.css';
import { useRef } from 'react';

export interface CanvasMiniMapProps {
  /** Full canvas content size. */
  contentWidth?: number;
  contentHeight?: number;
  /** Visible viewport rect in content coordinates. */
  viewport?: { x: number; y: number; width: number; height: number };
  /** Click/drag moves the viewport center there. */
  onViewportChange?: (center: { x: number; y: number }) => void;
  width?: number;
  className?: string;
}

/**
 * Small navigable minimap of the canvas. The content footprint is drawn to
 * scale with a dotted-grid texture; the viewport rectangle is draggable and
 * keyboard-steppable, moving the viewport center.
 */
export function CanvasMiniMap({ contentWidth = 1, contentHeight = 1, viewport, onViewportChange, width = 148, className = '' }: CanvasMiniMapProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const vp = viewport ?? { x: 0, y: 0, width: contentWidth, height: contentHeight };
  const pct = (n: number, of: number) => `${Math.max(0, Math.min(100, (n / Math.max(1, of)) * 100))}%`;

  const pointTo = (e: { clientX: number; clientY: number }) => {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box) return;
    const x = ((e.clientX - box.left) / box.width) * contentWidth;
    const y = ((e.clientY - box.top) / box.height) * contentHeight;
    onViewportChange?.({ x: Math.max(0, Math.min(contentWidth, x)), y: Math.max(0, Math.min(contentHeight, y)) });
  };

  return (
    <div
      ref={boxRef}
      className={`cv-minimap ${className}`}
      data-minimap=""
      role="application"
      aria-label="Canvas minimap"
      tabIndex={0}
      style={{ width, aspectRatio: `${Math.max(1, contentWidth)} / ${Math.max(1, contentHeight)}` }}
      onPointerDown={(e) => {
        draggingRef.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        pointTo(e);
      }}
      onPointerMove={(e) => { if (draggingRef.current) pointTo(e); }}
      onPointerUp={() => { draggingRef.current = false; }}
      onPointerCancel={() => { draggingRef.current = false; }}
      onKeyDown={(e) => {
        const stepX = vp.width / 4, stepY = vp.height / 4;
        const cx = vp.x + vp.width / 2, cy = vp.y + vp.height / 2;
        if (e.key === 'ArrowLeft') { e.preventDefault(); onViewportChange?.({ x: cx - stepX, y: cy }); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); onViewportChange?.({ x: cx + stepX, y: cy }); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); onViewportChange?.({ x: cx, y: cy - stepY }); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); onViewportChange?.({ x: cx, y: cy + stepY }); }
      }}
    >
      <div
        className="cv-minimap-viewport"
        data-minimap-viewport=""
        aria-hidden="true"
        style={{ left: pct(vp.x, contentWidth), top: pct(vp.y, contentHeight), width: pct(vp.width, contentWidth), height: pct(vp.height, contentHeight) }}
      />
    </div>
  );
}
