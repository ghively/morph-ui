import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { DashboardGrid } from '../src/components/DashboardGrid';

const TILES = [
  { id: 'a', title: 'KPIs', colSpan: 3, node: <div>KPI body</div> },
  { id: 'b', title: 'Latency', colSpan: 3, node: <div>Latency body</div> },
  { id: 'c', title: 'Queue', colSpan: 6, rowSpan: 2, node: <div>Queue body</div> },
];

const PALETTE = [{ id: 'p1', title: 'Error rate', colSpan: 4, node: <div>Errors</div> }];

describe('DashboardGrid', () => {
  it('renders tiles with spans', () => {
    const { container } = render(<DashboardGrid tiles={TILES} />);
    const tiles = container.querySelectorAll('[data-dash-tile]');
    expect(tiles).toHaveLength(3);
    expect((tiles[0]! as HTMLElement).style.gridColumn).toBe('span 3');
    expect((tiles[2]! as HTMLElement).style.gridRow).toBe('span 2');
  });

  it('editable mode hides remove buttons by default and shows them when editable', () => {
    const { container } = render(<DashboardGrid tiles={TILES} />);
    expect(container.querySelector('[data-dash-remove]')).toBeNull();
  });

  it('editable mode shows remove buttons and the add palette', () => {
    render(<DashboardGrid tiles={TILES} editable addableTiles={PALETTE} />);
    expect(screen.getByRole('button', { name: 'Remove tile KPIs' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '+ Error rate' })).toBeTruthy();
  });

  it('removes a tile and reports it', () => {
    const onRemove = vi.fn();
    render(<DashboardGrid tiles={TILES} editable onRemove={onRemove} />);
    fireEvent.click(screen.getByRole('button', { name: 'Remove tile Queue' }));
    expect(onRemove).toHaveBeenCalledWith('c');
    // Visible tiles come from the host's tiles prop, so 'Queue' stays until the
    // host re-renders; the contract is the callback + order change.
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('added tiles render when the host appends them to tiles', () => {
    const onAdd = vi.fn();
    const { rerender } = render(
      <DashboardGrid tiles={TILES.slice(0, 1)} editable addableTiles={PALETTE} onAdd={onAdd} />,
    );
    fireEvent.click(screen.getByRole('button', { name: '+ Error rate' }));
    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({ id: 'p1' }));
    rerender(
      <DashboardGrid tiles={[...TILES.slice(0, 1), ...PALETTE]} editable addableTiles={PALETTE} onAdd={onAdd} />,
    );
    expect(screen.getByText('Errors')).toBeTruthy();
  });

  it('reorders tiles with Ctrl/⌘ + arrows in edit mode', () => {
    const onOrderChange = vi.fn();
    const { container } = render(<DashboardGrid tiles={TILES} editable onOrderChange={onOrderChange} />);
    const first = container.querySelector('[data-dash-tile]') as HTMLElement;
    fireEvent.keyDown(first, { key: 'ArrowRight', ctrlKey: true });
    expect(onOrderChange).toHaveBeenCalledWith(['b', 'a', 'c']);
    const titles = Array.from(container.querySelectorAll('[data-dash-tile-title]')).map((e) => e.textContent);
    expect(titles).toEqual(['Latency', 'KPIs', 'Queue']);
  });

  it('renders the empty state', () => {
    render(<DashboardGrid tiles={[]} />);
    expect(screen.getByText('No tiles.')).toBeTruthy();
  });
});
