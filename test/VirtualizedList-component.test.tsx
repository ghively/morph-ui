import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { VirtualizedList } from '../src/components/VirtualizedList';

const ITEMS = Array.from({ length: 1000 }, (_, i) => ({ id: `r${i}`, label: `Row ${i}` }));

function setup(overScan?: number) {
  return render(
    <VirtualizedList
      items={ITEMS}
      rowHeight={40}
      overscan={overScan}
      height={400}
      label="Rows"
      rowKey={(r) => r.id}
      renderRow={(r) => <span>{r.label}</span>}
    />,
  );
}

describe('VirtualizedList', () => {
  it('renders only the windowed slice, not all items', () => {
    const { container } = setup();
    const rows = container.querySelectorAll('[data-vlist-row]');
    expect(rows.length).toBeGreaterThan(4);
    expect(rows.length).toBeLessThan(50);
    expect(container.querySelectorAll('[data-vlist-row]').length).toBeLessThan(ITEMS.length);
    expect(rows[0]!.textContent).toBe('Row 0');
  });

  it('positions the window at scrollTop and reports the visible range', () => {
    const onVisibleRangeChange = vi.fn();
    const { container } = render(
      <VirtualizedList
        items={ITEMS}
        rowHeight={40}
        height={400}
        onVisibleRangeChange={onVisibleRangeChange}
        label="Rows"
        rowKey={(r) => r.id}
        renderRow={(r) => <span>{r.label}</span>}
      />,
    );
    const scroller = container.querySelector('[data-vlist]') as HTMLElement;
    // jsdom does not layout, so drive the handler with a real event:
    Object.defineProperty(scroller, 'scrollTop', { configurable: true, value: 4000 });
    Object.defineProperty(scroller, 'clientHeight', { configurable: true, value: 400 });
    fireEvent.scroll(scroller);

    const win = container.querySelector('[data-vlist-window]') as HTMLElement;
    expect(win.style.transform).toContain('translateY(3840px)'); // (4000/40 - overscan 4) * 40
    expect(onVisibleRangeChange).toHaveBeenLastCalledWith(100, 110);
    const rows = container.querySelectorAll('[data-vlist-row]');
    expect(rows[0]!.textContent).toBe('Row 96'); // 100 - overscan 4
  });

  it('sizes the spacer to the full virtual height', () => {
    const { container } = setup();
    const viewport = container.querySelector('[data-vlist-viewport]') as HTMLElement;
    expect(viewport.style.height).toBe(`${ITEMS.length * 40}px`);
  });

  it('clamps the window at the end of the list', () => {
    const { container } = setup();
    const scroller = container.querySelector('[data-vlist]') as HTMLElement;
    Object.defineProperty(scroller, 'scrollTop', { configurable: true, value: 1000 * 40 });
    Object.defineProperty(scroller, 'clientHeight', { configurable: true, value: 400 });
    fireEvent.scroll(scroller);
    const rows = container.querySelectorAll('[data-vlist-row]');
    expect(rows.length).toBeLessThanOrEqual(ITEMS.length);
    expect(rows[rows.length - 1]!.textContent).toBe('Row 999');
  });
});
