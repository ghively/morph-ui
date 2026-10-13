import './VirtualizedList.css';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export interface VirtualizedListProps<T> {
  items: T[];
  /** Fixed row height in px. Required — windowing math depends on it. */
  rowHeight: number;
  /** Rows visible above/below the window (default 4). */
  overscan?: number;
  /** Total height of the scroll container (px). */
  height?: number;
  rowKey: (item: T, index: number) => string;
  renderRow: (item: T, index: number) => ReactNode;
  onVisibleRangeChange?: (start: number, end: number) => void;
  label?: string;
  className?: string;
}

/**
 * VirtualizedList — fixed-row-height windowing over a scroll container. Renders
 * only the visible slice plus overscan; spacer divs hold the scrollbar true.
 * jsdom-safe: defaults to height 400 and reads scrollTop from the scroll event.
 * Original morph-ui design.
 */
export function VirtualizedList<T>({
  items,
  rowHeight,
  overscan = 4,
  height = 400,
  rowKey,
  renderRow,
  onVisibleRangeChange,
  label = 'List',
  className = '',
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [viewport, setViewport] = useState(height);
  const scrollRef = useRef<HTMLDivElement>(null);

  const total = items.length * rowHeight;

  const { start, end } = useMemo(() => {
    const first = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const visible = Math.ceil(viewport / rowHeight) + overscan * 2;
    const last = Math.min(items.length, first + visible);
    return { start: first, end: last };
  }, [scrollTop, viewport, rowHeight, overscan, items.length]);

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    setScrollTop(el.scrollTop);
    setViewport(el.clientHeight || height);
    onVisibleRangeChange?.(
      Math.max(0, Math.floor(el.scrollTop / rowHeight)),
      Math.min(items.length, Math.ceil((el.scrollTop + el.clientHeight) / rowHeight)),
    );
  }, [rowHeight, height, items.length, onVisibleRangeChange]);

  const slice = items.slice(start, end);

  return (
    <div
      ref={scrollRef}
      className={className}
      data-vlist=""
      role="list"
      aria-label={label}
      tabIndex={0}
      style={{ maxHeight: height }}
      onScroll={onScroll}
    >
      <div data-vlist-viewport="" style={{ height: total }}>
        <div data-vlist-window="" style={{ transform: `translateY(${start * rowHeight}px)` }}>
          {slice.map((item, i) => {
            const index = start + i;
            return (
              <div key={rowKey(item, index)} data-vlist-row="" style={{ height: rowHeight }} role="listitem">
                {renderRow(item, index)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
