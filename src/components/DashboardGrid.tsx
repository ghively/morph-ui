import './DashboardGrid.css';
import { useState } from 'react';
import type { ReactNode } from 'react';

export interface DashboardTile {
  id: string;
  title: string;
  /** 1–12 columns wide. */
  colSpan?: number;
  /** 1–3 rows tall (row height = --dash-row-h). */
  rowSpan?: number;
  node: ReactNode;
}

export interface DashboardGridProps {
  tiles: DashboardTile[];
  /** ids order override. */
  defaultOrder?: string[];
  onOrderChange?: (ids: string[]) => void;
  /** Edit mode: shows remove buttons and the add slot. */
  editable?: boolean;
  /** Palette of tiles the add slot can insert. */
  addableTiles?: DashboardTile[];
  onAdd?: (tile: DashboardTile) => void;
  onRemove?: (tileId: string) => void;
  title?: string;
  className?: string;
}

/**
 * DashboardGrid — a 12-column grid container for tiles, with an editable layout:
 * add tiles from a palette, remove tiles, reorder with Ctrl/⌘+arrows. Tiles are
 * dense and glanceable (Monitor archetype): header strip + body slot.
 * Original morph-ui design.
 */
export function DashboardGrid({
  tiles,
  defaultOrder,
  onOrderChange,
  editable = false,
  addableTiles = [],
  onAdd,
  onRemove,
  title,
  className = '',
}: DashboardGridProps) {
  const [order, setOrder] = useState<string[]>(() => defaultOrder ?? tiles.map((t) => t.id));

  const byId = new Map(tiles.map((t) => [t.id, t]));
  const ordered = order.map((id) => byId.get(id)).filter((t): t is DashboardTile => !!t);
  // tiles added after mount (via onAdd by the host) append automatically.
  const extra = tiles.filter((t) => !order.includes(t.id));
  const all = [...ordered, ...extra];

  const commit = (next: string[]) => {
    setOrder(next);
    onOrderChange?.(next);
  };

  const move = (id: string, delta: number) => {
    const list = all.map((t) => t.id);
    const from = list.indexOf(id);
    const to = from + delta;
    if (from === -1 || to < 0 || to >= list.length) return;
    list.splice(to, 0, ...list.splice(from, 1));
    commit(list);
  };

  const addTile = (tile: DashboardTile) => {
    commit([...all.map((t) => t.id), tile.id]);
    onAdd?.(tile);
  };

  const removeTile = (id: string) => {
    commit(all.map((t) => t.id).filter((x) => x !== id));
    onRemove?.(id);
  };

  return (
    <div className={className} data-dash="" data-editable={editable || undefined}>
      {title && <h3 data-dash-title="">{title}</h3>}
      <div data-dash-grid="">
        {all.map((tile) => (
          <section
            key={tile.id}
            data-dash-tile=""
            data-tile-id={tile.id}
            aria-label={tile.title}
            tabIndex={editable ? 0 : undefined}
            style={{
              gridColumn: `span ${Math.min(12, Math.max(1, tile.colSpan ?? 4))}`,
              gridRow: `span ${Math.min(3, Math.max(1, tile.rowSpan ?? 1))}`,
            }}
            onKeyDown={
              editable
                ? (e) => {
                    if (!(e.metaKey || e.ctrlKey)) return;
                    if (e.key === 'ArrowLeft') { e.preventDefault(); move(tile.id, -1); }
                    if (e.key === 'ArrowRight') { e.preventDefault(); move(tile.id, 1); }
                  }
                : undefined
            }
          >
            <header data-dash-tile-head="">
              <span data-dash-tile-title="">{tile.title}</span>
              {editable && (
                <button
                  type="button"
                  data-dash-remove=""
                  aria-label={`Remove tile ${tile.title}`}
                  title="Remove tile"
                  onClick={() => removeTile(tile.id)}
                >
                  ✕
                </button>
              )}
            </header>
            <div data-dash-tile-body="">{tile.node}</div>
          </section>
        ))}
        {editable && addableTiles.length > 0 && (
          <div data-dash-add="" role="group" aria-label="Add tiles" style={{ gridColumn: 'span 4' }}>
            {addableTiles.map((tile) => (
              <button key={tile.id} type="button" data-dash-addbtn="" onClick={() => addTile(tile)}>
                + {tile.title}
              </button>
            ))}
          </div>
        )}
        {all.length === 0 && addableTiles.length === 0 && (
          <p data-dash-empty="" data-empty="">No tiles.</p>
        )}
      </div>
    </div>
  );
}
