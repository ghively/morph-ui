import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SortableList } from '../src/components/SortableList';

const ITEMS = [
  { id: 'a', content: 'Alpha' },
  { id: 'b', content: 'Beta' },
  { id: 'c', content: 'Gamma' },
];

function texts(container: { querySelectorAll: (s: string) => NodeListOf<HTMLElement> }) {
  return Array.from(container.querySelectorAll('[data-slist-content]')).map((e) => e.textContent);
}

describe('SortableList', () => {
  it('renders items in the given order', () => {
    const { container } = render(<SortableList items={ITEMS} />);
    expect(texts(container)).toEqual(['Alpha', 'Beta', 'Gamma']);
  });

  it('reorders with Ctrl/⌘ + arrows', () => {
    const onReorder = vi.fn();
    const { container } = render(<SortableList items={ITEMS} onReorder={onReorder} />);
    const row = screen.getByText('Alpha').closest('[data-slist-row]') as HTMLElement;
    fireEvent.keyDown(row, { key: 'ArrowDown', ctrlKey: true });
    expect(onReorder).toHaveBeenCalledWith(['b', 'a', 'c']);
    expect(texts(container)).toEqual(['Beta', 'Alpha', 'Gamma']);
    // Without the modifier nothing happens.
    onReorder.mockClear();
    fireEvent.keyDown(row, { key: 'ArrowDown' });
    expect(onReorder).not.toHaveBeenCalled();
  });

  it('reorders by dragging the handle over another row', () => {
    const onReorder = vi.fn();
    const { container } = render(<SortableList items={ITEMS} onReorder={onReorder} />);
    const handle = screen.getByLabelText('Reorder Alpha');
    const rows = Array.from(container.querySelectorAll('[data-slist-row]')) as HTMLElement[];
    rows.forEach((row, i) => {
      row.getBoundingClientRect = () =>
        ({ left: 0, top: i * 50, right: 400, bottom: i * 50 + 50, width: 400, height: 50, x: 0, y: i * 50, toJSON: () => {} }) as DOMRect;
    });

    fireEvent.pointerDown(handle, { button: 0, clientX: 10, clientY: 10, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 10, clientY: 105, pointerId: 1 }); // over row 2 (Gamma)
    expect(rows[2]!.hasAttribute('data-over')).toBe(true);
    fireEvent.pointerUp(handle, { clientX: 10, clientY: 105, pointerId: 1 });

    // Dropping onto Gamma's slot inserts Alpha at Gamma's index (2), i.e. after it.
    expect(onReorder).toHaveBeenCalledWith(['b', 'c', 'a']);
    expect(texts(container)).toEqual(['Beta', 'Gamma', 'Alpha']);
  });

  it('respects controlledOrder and does not self-update', () => {
    const onReorder = vi.fn();
    const { container } = render(
      <SortableList items={ITEMS} controlledOrder={['c', 'a', 'b']} onReorder={onReorder} />,
    );
    expect(texts(container)).toEqual(['Gamma', 'Alpha', 'Beta']);
    const row = screen.getByText('Gamma').closest('[data-slist-row]') as HTMLElement;
    fireEvent.keyDown(row, { key: 'ArrowDown', metaKey: true });
    expect(onReorder).toHaveBeenCalledWith(['a', 'c', 'b']);
    expect(texts(container)).toEqual(['Gamma', 'Alpha', 'Beta']); // unchanged until parent re-renders
  });

  it('hides handles when handles=false', () => {
    const { container } = render(<SortableList items={ITEMS} handles={false} />);
    expect(container.querySelector('[data-slist-handle]')).toBeNull();
  });

  it('renders the empty state', () => {
    render(<SortableList items={[]} />);
    expect(screen.getByText('No items.')).toBeTruthy();
  });
});
