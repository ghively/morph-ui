import { render, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FluidWorkspaceBoard } from '../src/components/FluidWorkspaceBoard';

describe('FluidWorkspaceBoard', () => {
  const items = [
    { id: '1', title: 'Card 1', node: <div>Content 1</div> },
    { id: '2', title: 'Card 2', node: <div>Content 2</div> },
    { id: '3', title: 'Card 3', node: <div>Content 3</div> },
  ];

  it('renders correctly and respects density', () => {
    const { container } = render(<FluidWorkspaceBoard items={items} density="compact" />);
    const board = container.querySelector('.fluid-workspace-board');
    expect(board).toBeTruthy();
    expect(board?.getAttribute('data-density')).toBe('compact');
    
    const renderedItems = container.querySelectorAll('.fluid-workspace-board-item');
    expect(renderedItems.length).toBe(3);
    expect(renderedItems[0].textContent).toContain('Card 1');
  });

  it('renders empty state correctly', () => {
    const { container } = render(<FluidWorkspaceBoard items={[]} />);
    const emptyState = container.querySelector('.fluid-workspace-board-empty');
    expect(emptyState).toBeTruthy();
    expect(emptyState?.textContent).toBe('No items');
  });

  it('handles keyboard navigation for reordering', () => {
    const onReorder = vi.fn();
    const { container } = render(<FluidWorkspaceBoard items={items} onReorder={onReorder} />);
    
    const renderedItems = container.querySelectorAll('.fluid-workspace-board-item');
    const firstItem = renderedItems[0] as HTMLElement;

    // Move right -> moves item 1 to index 1
    act(() => {
      firstItem.focus();
      fireEvent.keyDown(firstItem, { key: 'ArrowRight' });
    });

    expect(onReorder).toHaveBeenCalledWith(['2', '1', '3']);
    
    // Reset mock
    onReorder.mockClear();

    // Move left -> moves it back to index 0
    act(() => {
      fireEvent.keyDown(firstItem, { key: 'ArrowLeft' });
    });

    expect(onReorder).toHaveBeenCalledWith(['1', '2', '3']);
  });

  it('handles keyboard up and down as left and right', () => {
    const onReorder = vi.fn();
    const { container } = render(<FluidWorkspaceBoard items={items} onReorder={onReorder} />);
    
    const renderedItems = container.querySelectorAll('.fluid-workspace-board-item');
    const firstItem = renderedItems[0] as HTMLElement;

    // Move down -> moves item 1 to index 1
    act(() => {
      firstItem.focus();
      fireEvent.keyDown(firstItem, { key: 'ArrowDown' });
    });

    expect(onReorder).toHaveBeenCalledWith(['2', '1', '3']);
    
    // Reset mock
    onReorder.mockClear();

    // Move up -> moves it back to index 0
    act(() => {
      fireEvent.keyDown(firstItem, { key: 'ArrowUp' });
    });

    expect(onReorder).toHaveBeenCalledWith(['1', '2', '3']);
  });

  it('respects controlledOrder prop', () => {
    const onReorder = vi.fn();
    const { container, rerender } = render(
      <FluidWorkspaceBoard items={items} controlledOrder={['3', '2', '1']} onReorder={onReorder} />
    );
    
    let renderedItems = container.querySelectorAll('.fluid-workspace-board-item');
    expect(renderedItems[0].textContent).toContain('Card 3');
    
    // Simulate keyboard move, the callback should fire but the order shouldn't change
    // until the parent updates controlledOrder
    const firstItem = renderedItems[0] as HTMLElement;
    act(() => {
      firstItem.focus();
      fireEvent.keyDown(firstItem, { key: 'ArrowRight' });
    });

    expect(onReorder).toHaveBeenCalledWith(['2', '3', '1']);
    
    // Component didn't re-render with new order because it's controlled
    renderedItems = container.querySelectorAll('.fluid-workspace-board-item');
    expect(renderedItems[0].textContent).toContain('Card 3');

    // Update controlledOrder
    rerender(<FluidWorkspaceBoard items={items} controlledOrder={['2', '3', '1']} onReorder={onReorder} />);
    renderedItems = container.querySelectorAll('.fluid-workspace-board-item');
    expect(renderedItems[0].textContent).toContain('Card 2');
  });

  it('handles pointer drag simulation', () => {
    const onReorder = vi.fn();
    const { container } = render(<FluidWorkspaceBoard items={items} onReorder={onReorder} />);
    
    const renderedItems = container.querySelectorAll('.fluid-workspace-board-item');
    const firstItem = renderedItems[0] as HTMLElement;
    const secondItem = renderedItems[1] as HTMLElement;

    // Mock getBoundingClientRect for overlap detection
    firstItem.getBoundingClientRect = () => ({
      left: 10, top: 10, right: 110, bottom: 110, width: 100, height: 100, x: 10, y: 10, toJSON: () => {}
    });
    secondItem.getBoundingClientRect = () => ({
      left: 120, top: 10, right: 220, bottom: 110, width: 100, height: 100, x: 120, y: 10, toJSON: () => {}
    });

    act(() => {
      // Start drag
      fireEvent.pointerDown(firstItem, { button: 0, clientX: 20, clientY: 20 });
    });

    expect(firstItem.classList.contains('is-dragging')).toBe(true);

    act(() => {
      // Move drag - shift center of dragged element to overlap with second element
      // Original center was 60, 60. Let's move it to 150, 60
      firstItem.getBoundingClientRect = () => ({
        left: 100, top: 10, right: 200, bottom: 110, width: 100, height: 100, x: 100, y: 10, toJSON: () => {}
      });
      fireEvent.pointerMove(firstItem, { clientX: 150, clientY: 60 });
    });

    expect(onReorder).toHaveBeenCalledWith(['2', '1', '3']);

    act(() => {
      // End drag
      fireEvent.pointerUp(firstItem, { clientX: 150, clientY: 60 });
    });

    expect(firstItem.classList.contains('is-dragging')).toBe(false);
  });
});
