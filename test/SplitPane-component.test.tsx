import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { SplitPane } from '../src/components/SplitPane';

function setup(props = {}) {
  const utils = render(
    <SplitPane
      label="Test pane"
      defaultSize={200}
      start={<div>Start pane</div>}
      end={<div>End pane</div>}
      {...props}
    />,
  );
  const divider = screen.getByRole('separator', { name: 'Test pane divider' });
  const container = divider.closest('[data-split]') as HTMLElement;
  // jsdom layout stub: the container spans x 0..600.
  container.getBoundingClientRect = () =>
    ({ left: 0, top: 0, right: 600, bottom: 400, width: 600, height: 400, x: 0, y: 0, toJSON: () => {} }) as DOMRect;
  return { ...utils, divider, container };
}

describe('SplitPane', () => {
  it('renders both panes and a separator with aria state', () => {
    const { divider } = setup();
    expect(screen.getByText('Start pane')).toBeTruthy();
    expect(screen.getByText('End pane')).toBeTruthy();
    expect(divider.getAttribute('aria-orientation')).toBe('vertical');
    expect(divider.getAttribute('aria-valuenow')).toBe('200');
  });

  it('drags the divider and reports the size', () => {
    const onResize = vi.fn();
    const { divider } = setup({ onResize });
    fireEvent.pointerDown(divider, { button: 0, clientX: 200, clientY: 10, pointerId: 1 });
    expect(divider.closest('[data-split]')!.hasAttribute('data-dragging')).toBe(true);
    fireEvent.pointerMove(divider, { clientX: 300, clientY: 10, pointerId: 1 });
    fireEvent.pointerUp(divider, { clientX: 300, clientY: 10, pointerId: 1 });
    expect(onResize).toHaveBeenLastCalledWith(300);
    const start = screen.getByText('Start pane').closest('[data-split-pane]') as HTMLElement;
    expect(start.style.width).toBe('300px');
    expect(divider.closest('[data-split]')!.hasAttribute('data-dragging')).toBe(false);
  });

  it('clamps to minSize', () => {
    const onResize = vi.fn();
    const { divider } = setup({ onResize, minSize: 120 });
    fireEvent.pointerDown(divider, { button: 0, clientX: 200, clientY: 10, pointerId: 1 });
    fireEvent.pointerUp(divider, { clientX: 10, clientY: 10, pointerId: 1 });
    expect(onResize).toHaveBeenLastCalledWith(120);
  });

  it('moves with arrow keys and resets on double-click', () => {
    const onResize = vi.fn();
    const { divider } = setup({ onResize, defaultSize: 200 });
    fireEvent.keyDown(divider, { key: 'ArrowRight' });
    expect(onResize).toHaveBeenLastCalledWith(216);
    fireEvent.keyDown(divider, { key: 'ArrowLeft' });
    expect(onResize).toHaveBeenLastCalledWith(200);
    fireEvent.keyDown(divider, { key: 'ArrowRight' });
    fireEvent.dblClick(divider);
    expect(onResize).toHaveBeenLastCalledWith(200);
  });

  it('respects a controlled size without self-updating', () => {
    const onResize = vi.fn();
    const { divider } = setup({ onResize, size: 150 });
    const start = screen.getByText('Start pane').closest('[data-split-pane]') as HTMLElement;
    expect(start.style.width).toBe('150px');
    fireEvent.keyDown(divider, { key: 'ArrowRight' });
    expect(onResize).toHaveBeenLastCalledWith(166);
    expect(start.style.width).toBe('150px'); // unchanged until the host re-renders
  });
});
