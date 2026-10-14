import './KanbanBoard.css';
import { useMemo, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { cv, fixedOrigin } from './dataShell.shared';

export interface KanbanCard {
  id: string;
  title: string;
  meta?: string;
  /** Badge-ish accent from the Tone vocabulary, mapped to --state-*. */
  tone?: 'neutral' | 'info' | 'success' | 'warn' | 'danger';
  node?: ReactNode;
}

export interface KanbanColumn {
  id: string;
  title: string;
  /** WIP limit; cards over it flag the column (data-over). */
  wipLimit?: number;
}

export interface KanbanBoardProps {
  columns: KanbanColumn[];
  cards: KanbanCard[];
  /** Column id each card sits in (defaults to the first column). */
  defaultPlacements?: Record<string, string>;
  controlledPlacements?: Record<string, string>;
  onPlacementsChange?: (placements: Record<string, string>) => void;
  onCardActivate?: (card: KanbanCard) => void;
  label?: string;
  className?: string;
}

const TONE_C: Record<NonNullable<KanbanCard['tone']>, string> = {
  neutral: 'var(--app-faint)',
  info: 'var(--state-think)',
  success: 'var(--state-ok)',
  warn: 'var(--state-warn)',
  danger: 'var(--state-error)',
};

/**
 * KanbanBoard — columns of draggable cards. Pointer-event drag follows the
 * FluidWorkspaceBoard pattern (pointer capture + fixed-position ghost that
 * corrects for transformed hosts); drop targets are the columns themselves, so
 * it works in jsdom with stubbed geometry. Keyboard: focus a card, ←/→ moves it
 * one column. Original morph-ui design.
 */
export function KanbanBoard({
  columns,
  cards,
  defaultPlacements,
  controlledPlacements,
  onPlacementsChange,
  onCardActivate,
  label = 'Board',
  className = '',
}: KanbanBoardProps) {
  const isControlled = controlledPlacements !== undefined;
  const [internal, setInternal] = useState<Record<string, string>>(() => {
    const base = defaultPlacements ?? {};
    const out: Record<string, string> = {};
    for (const c of cards) out[c.id] = base[c.id] ?? columns[0]?.id ?? '';
    return out;
  });
  const placements = isControlled ? controlledPlacements : internal;

  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);
  const [ghost, setGhost] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragSize, setDragSize] = useState({ w: 0 });
  const originRef = useRef({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);

  const byColumn = useMemo(() => {
    const map = new Map<string, KanbanCard[]>();
    for (const col of columns) map.set(col.id, []);
    for (const card of cards) {
      const col = placements[card.id] ?? columns[0]?.id;
      if (col && map.has(col)) map.get(col)!.push(card);
    }
    return map;
  }, [columns, cards, placements]);

  const setPlacements = (next: Record<string, string>) => {
    if (!isControlled) setInternal(next);
    onPlacementsChange?.(next);
  };

  const moveCard = (cardId: string, toCol: string) => {
    if (!columns.some((c) => c.id === toCol)) return;
    if (placements[cardId] === toCol) return;
    setPlacements({ ...placements, [cardId]: toCol });
  };

  const columnAt = (x: number, y: number): string | null => {
    const board = boardRef.current;
    if (!board) return null;
    for (const col of Array.from(board.querySelectorAll('[data-kanban-column]')) as HTMLElement[]) {
      const r = col.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return col.dataset.kanbanColumn ?? null;
    }
    return null;
  };

  const onCardKeyDown = (e: KeyboardEvent<HTMLDivElement>, card: KanbanCard) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const cur = columns.findIndex((c) => c.id === placements[card.id]);
    const next = cur + (e.key === 'ArrowRight' ? 1 : -1);
    if (next >= 0 && next < columns.length) moveCard(card.id, columns[next]!.id);
  };

  const cardProps = (card: KanbanCard) => ({
    'data-kanban-card': '',
    'data-card-id': card.id,
    tabIndex: 0,
    'aria-label': `${card.title}${card.meta ? ', ' + card.meta : ''}`,
    onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => onCardKeyDown(e, card),
    onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture?.(e.pointerId);
      const rect = e.currentTarget.getBoundingClientRect();
      originRef.current = fixedOrigin(boardRef.current);
      setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setDragSize({ w: rect.width });
      setGhost({ x: e.clientX, y: e.clientY });
      setDragId(card.id);
    },
    onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => {
      if (dragId !== card.id) return;
      setGhost({ x: e.clientX, y: e.clientY });
      setOverCol(columnAt(e.clientX, e.clientY));
    },
    onPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => {
      if (dragId !== card.id) return;
      e.currentTarget.releasePointerCapture?.(e.pointerId);
      const target = columnAt(e.clientX, e.clientY);
      if (target) moveCard(card.id, target);
      setDragId(null);
      setOverCol(null);
      setGhost(null);
    },
    onPointerCancel: () => {
      if (dragId !== card.id) return;
      setDragId(null);
      setOverCol(null);
      setGhost(null);
    },
  });

  const ghostCard = cards.find((c) => c.id === dragId);
  const ghostStyle: CSSProperties | undefined = ghostCard && ghost
    ? {
        position: 'fixed',
        left: ghost.x - dragOffset.x - originRef.current.x,
        top: ghost.y - dragOffset.y - originRef.current.y,
        width: dragSize.w || undefined,
        zIndex: 100,
        pointerEvents: 'none',
      }
    : undefined;

  return (
    <div ref={boardRef} className={className} data-kanban-board="" aria-label={label}>
      <div data-kanban-columns="">
        {columns.map((col) => {
          const colCards = byColumn.get(col.id) ?? [];
          const over = colCards.length > (col.wipLimit ?? Infinity);
          return (
            <section key={col.id} data-kanban-column={col.id} data-over={over ? '' : undefined} data-dropping={overCol === col.id && dragId ? '' : undefined} aria-label={col.title}>
              <header>
                <h3>{col.title}</h3>
                <span data-kanban-count="">{`${colCards.length}${col.wipLimit != null ? `/${col.wipLimit}` : ''}`}</span>
              </header>
              <div data-kanban-cards="">
                {colCards.map((card) => (
                  <div
                    key={card.id}
                    {...cardProps(card)}
                    className={dragId === card.id ? 'is-dragging' : undefined}
                    style={cv(TONE_C[card.tone ?? 'neutral'])}
                    onClick={() => onCardActivate?.(card)}
                  >
                    <span data-kanban-cardtitle="">{card.title}</span>
                    {card.meta && <span data-kanban-cardmeta="">{card.meta}</span>}
                    {card.node}
                    <span data-kanban-grip="" aria-hidden="true">⠿</span>
                  </div>
                ))}
                {colCards.length === 0 && <p data-kanban-empty="">Drop cards here</p>}
              </div>
            </section>
          );
        })}
      </div>
      {ghostCard && ghostStyle && (
        <div data-kanban-ghost="" aria-hidden="true" style={{ ...ghostStyle, ...cv(TONE_C[ghostCard.tone ?? 'neutral']) }}>
          <span data-kanban-cardtitle="">{ghostCard.title}</span>
        </div>
      )}
    </div>
  );
}
