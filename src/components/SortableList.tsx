import './SortableList.css';
import { useState } from 'react';
import type { KeyboardEvent, PointerEvent as ReactPointerEvent, ReactNode } from 'react';

export interface SortableListItem {
  id: string;
  content: ReactNode;
  meta?: string;
}

export interface SortableListProps {
  items: SortableListItem[];
  /** Initial order override (ids). Defaults to items order. */
  defaultOrder?: string[];
  controlledOrder?: string[];
  onReorder?: (newOrder: string[]) => void;
  /** Show the drag handles (default true). Keyboard reorder works either way. */
  handles?: boolean;
  label?: string;
  className?: string;
}

/**
 * SortableList — reorder rows by dragging a handle (pointer events with
 * capture, FluidWorkspaceBoard pattern) or with Ctrl/⌘+↑/↓ on the row.
 * FLIP-free: order changes apply immediately; a subtle settle transition runs
 * under motion. Original morph-ui design.
 */
export function SortableList({
  items,
  defaultOrder,
  controlledOrder,
  onReorder,
  handles = true,
  label = 'List',
  className = '',
}: SortableListProps) {
  const isControlled = controlledOrder !== undefined;
  const [order, setOrder] = useState<string[]>(() => defaultOrder ?? items.map((i) => i.id));
  const current = isControlled ? controlledOrder : order;

  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const byId = new Map(items.map((i) => [i.id, i]));
  const ordered = current.map((id) => byId.get(id)).filter((i): i is SortableListItem => !!i);

  const commit = (next: string[]) => {
    if (!isControlled) setOrder(next);
    onReorder?.(next);
  };

  const move = (id: string, toIndex: number) => {
    const from = current.indexOf(id);
    if (from === -1 || toIndex < 0 || toIndex >= current.length || from === toIndex) return;
    const next = [...current];
    next.splice(from, 1);
    next.splice(toIndex, 0, id);
    commit(next);
  };

  const rowAt = (y: number): string | null => {
    for (const row of Array.from(document.querySelectorAll('[data-slist-row]')) as HTMLElement[]) {
      const r = row.getBoundingClientRect();
      if (y >= r.top && y <= r.bottom) return row.dataset.slistRow ?? null;
    }
    return null;
  };

  const onRowKeyDown = (e: KeyboardEvent<HTMLDivElement>, id: string) => {
    if (!(e.metaKey || e.ctrlKey) || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
    e.preventDefault();
    move(id, current.indexOf(id) + (e.key === 'ArrowDown' ? 1 : -1));
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLButtonElement>, id: string) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDragId(id);
    setOverId(id);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (!dragId) return;
    setOverId(rowAt(e.clientY));
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (!dragId) return;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    const target = rowAt(e.clientY);
    if (target && target !== dragId) move(dragId, current.indexOf(target));
    setDragId(null);
    setOverId(null);
  };

  return (
    <div className={className} data-slist="" aria-label={label}>
      <div data-slist-rows="" role="list">
        {ordered.map((item) => (
          <div
            key={item.id}
            data-slist-row={item.id}
            role="listitem"
            tabIndex={0}
            data-dragging={dragId === item.id || undefined}
            data-over={overId === item.id && dragId && dragId !== item.id ? '' : undefined}
            onKeyDown={(e) => onRowKeyDown(e, item.id)}
          >
            {handles && (
              <button
                type="button"
                data-slist-handle=""
                aria-label={`Reorder ${typeof item.content === 'string' ? item.content : item.id}`}
                onPointerDown={(e) => handlePointerDown(e, item.id)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={() => { setDragId(null); setOverId(null); }}
              >
                <span aria-hidden="true">⠿</span>
              </button>
            )}
            <span data-slist-content="">{item.content}</span>
            {item.meta && <span data-slist-meta="">{item.meta}</span>}
          </div>
        ))}
      </div>
      {ordered.length === 0 && <p data-slist-empty="">No items.</p>}
    </div>
  );
}
