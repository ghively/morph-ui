import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { KanbanBoard } from '../src/components/KanbanBoard';

const COLUMNS = [
  { id: 'todo', title: 'To do' },
  { id: 'doing', title: 'In flight', wipLimit: 1 },
  { id: 'done', title: 'Done' },
];
const CARDS = [
  { id: 'a', title: 'Card A', meta: '2h' },
  { id: 'b', title: 'Card B' },
  { id: 'c', title: 'Card C', tone: 'danger' as const },
];

describe('KanbanBoard', () => {
  it('places cards by defaultPlacements and defaults to the first column', () => {
    const { container } = render(
      <KanbanBoard columns={COLUMNS} cards={CARDS} defaultPlacements={{ a: 'todo', b: 'doing' }} />,
    );
    expect(container.querySelector('[data-kanban-column="todo"]')!.querySelectorAll('[data-kanban-card]')).toHaveLength(2); // a + c (defaulted)
    expect(container.querySelector('[data-kanban-column="doing"]')!.querySelectorAll('[data-kanban-card]')).toHaveLength(1);
    expect(container.querySelector('[data-kanban-column="done"]')!.querySelectorAll('[data-kanban-card]')).toHaveLength(0);
  });

  it('moves a card to the next column with ArrowRight', () => {
    const onPlacementsChange = vi.fn();
    const { container } = render(
      <KanbanBoard columns={COLUMNS} cards={CARDS} defaultPlacements={{ a: 'todo', b: 'todo', c: 'done' }} onPlacementsChange={onPlacementsChange} />,
    );
    const card = screen.getByText('Card A').closest('[data-kanban-card]') as HTMLElement;
    fireEvent.keyDown(card, { key: 'ArrowRight' });
    expect(onPlacementsChange).toHaveBeenCalledWith(expect.objectContaining({ a: 'doing' }));
    expect(container.querySelector('[data-kanban-column="doing"]')!.textContent).toContain('Card A');
  });

  it('flags a column over its WIP limit', () => {
    const { container } = render(
      <KanbanBoard columns={COLUMNS} cards={CARDS} defaultPlacements={{ a: 'doing', b: 'doing', c: 'todo' }} />,
    );
    expect(container.querySelector('[data-kanban-column="doing"]')!.hasAttribute('data-over')).toBe(true);
    expect(container.querySelector('[data-kanban-column="todo"]')!.hasAttribute('data-over')).toBe(false);
  });

  it('drags a card into another column via pointer events', () => {
    const onPlacementsChange = vi.fn();
    const { container } = render(
      <KanbanBoard columns={COLUMNS} cards={CARDS} defaultPlacements={{ a: 'todo', b: 'todo', c: 'done' }} onPlacementsChange={onPlacementsChange} />,
    );
    const card = screen.getByText('Card A').closest('[data-kanban-card]') as HTMLElement;

    // jsdom has no layout: stub each column's rect (0-200, 200-400, 400-600).
    const cols = Array.from(container.querySelectorAll('[data-kanban-column]')) as HTMLElement[];
    cols.forEach((col, i) => {
      col.getBoundingClientRect = () =>
        ({ left: i * 200, top: 0, right: i * 200 + 200, bottom: 400, width: 200, height: 400, x: i * 200, y: 0, toJSON: () => {} }) as DOMRect;
    });
    card.getBoundingClientRect = () => ({ left: 0, top: 0, right: 200, bottom: 100, width: 200, height: 100, x: 0, y: 0, toJSON: () => {} }) as DOMRect;

    fireEvent.pointerDown(card, { button: 0, clientX: 50, clientY: 50, pointerId: 1 });
    expect(card.classList.contains('is-dragging')).toBe(true);
    fireEvent.pointerMove(card, { clientX: 250, clientY: 50, pointerId: 1 });
    fireEvent.pointerUp(card, { clientX: 250, clientY: 50, pointerId: 1 });

    expect(onPlacementsChange).toHaveBeenCalledWith(expect.objectContaining({ a: 'doing' }));
    // The card is remounted inside the target column; grab it fresh from there.
    const moved = container.querySelector('[data-kanban-column="doing"] [data-card-id="a"]') as HTMLElement;
    expect(moved).toBeTruthy();
    expect(moved.classList.contains('is-dragging')).toBe(false);
  });

  it('renders empty-column hint and column counts', () => {
    render(<KanbanBoard columns={COLUMNS} cards={[CARDS[0]!]} defaultPlacements={{ a: 'todo' }} />);
    expect(screen.getAllByText('Drop cards here')).toHaveLength(2); // doing + done
    expect(screen.getByText('0/1')).toBeTruthy(); // doing count with wip limit
  });
});
