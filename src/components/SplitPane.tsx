import './SplitPane.css';
import { useCallback, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';

export interface SplitPaneProps {
  start: ReactNode;
  end: ReactNode;
  /** 'row' splits left|right, 'column' splits top|bottom. */
  orientation?: 'row' | 'column';
  /** Initial size of the start pane in px (or fraction of 1 when < 1). */
  defaultSize?: number;
  minSize?: number;
  /** Controlled start-pane size. */
  size?: number;
  onResize?: (size: number) => void;
  label?: string;
  className?: string;
}

/**
 * SplitPane — two panes with a draggable divider (pointer events with capture).
 * Uncontrolled by default; `onResize` fires on every settled divider position so
 * hosts can persist it (localStorage etc.) and pass it back via `size`.
 * Double-click the divider to reset to `defaultSize`. Original morph-ui design.
 */
export function SplitPane({
  start,
  end,
  orientation = 'row',
  defaultSize = 320,
  minSize = 120,
  size: controlledSize,
  onResize,
  label = 'Split pane',
  className = '',
}: SplitPaneProps) {
  const isControlled = controlledSize !== undefined;
  const [ownSize, setOwnSize] = useState(defaultSize);
  const size = isControlled ? controlledSize : ownSize;

  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const pxFromEvent = useCallback(
    (e: { clientX: number; clientY: number }) => {
      const el = containerRef.current;
      if (!el) return size;
      const rect = el.getBoundingClientRect();
      const raw = orientation === 'row' ? e.clientX - rect.left : e.clientY - rect.top;
      const total = orientation === 'row' ? rect.width : rect.height;
      return Math.round(Math.min(Math.max(raw, minSize), Math.max(minSize, total - minSize)));
    },
    [orientation, minSize, size],
  );

  const apply = useCallback(
    (px: number) => {
      if (!isControlled) setOwnSize(px);
      onResize?.(px);
    },
    [isControlled, onResize],
  );

  const onDividerPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDragging(true);
  };

  const onDividerPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    apply(pxFromEvent(e));
  };

  const onDividerPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    setDragging(false);
    apply(pxFromEvent(e));
  };

  const onDividerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const delta = e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -16 : e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 16 : 0;
    if (!delta) return;
    e.preventDefault();
    apply(Math.min(Math.max(size + delta, minSize), 16000));
  };

  const dimension = orientation === 'row' ? 'width' : 'height';

  return (
    <div
      ref={containerRef}
      className={className}
      data-split=""
      data-orientation={orientation}
      data-dragging={dragging || undefined}
      role="group"
      aria-label={label}
    >
      <div data-split-pane="" data-split-start="" style={{ [dimension]: size }}>
        {start}
      </div>
      <div
        data-split-divider=""
        role="separator"
        aria-orientation={orientation === 'row' ? 'vertical' : 'horizontal'}
        aria-label={`${label} divider`}
        aria-valuenow={size}
        aria-valuemin={minSize}
        tabIndex={0}
        onPointerDown={onDividerPointerDown}
        onPointerMove={onDividerPointerMove}
        onPointerUp={onDividerPointerUp}
        onPointerCancel={() => setDragging(false)}
        onKeyDown={onDividerKeyDown}
        onDoubleClick={() => apply(defaultSize)}
      >
        <span data-split-grip="" aria-hidden="true" />
      </div>
      <div data-split-pane="" data-split-end="">
        {end}
      </div>
    </div>
  );
}
