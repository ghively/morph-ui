import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AgentActivityHeatmap } from '../src/components/AgentActivityHeatmap';
import { ArchiveCollection } from '../src/components/ArchiveCollection';

describe('AgentActivityHeatmap (polish additions)', () => {
  // 2023-10-04 is a Wednesday → first cell sits in row 4 (Sun-first).
  const data = [
    { date: '2023-10-04', metric: 'agent runs/day', count: 4 },
    { date: '2023-10-05', metric: 'agent runs/day', count: 8 },
    { date: '2023-10-12', metric: 'agent runs/day', count: 2 },
  ];

  it('aligns cells to weekdays', () => {
    const { container } = render(<AgentActivityHeatmap data={data} />);
    const cells = container.querySelectorAll<HTMLElement>('.agent-activity-heatmap-cell[role="gridcell"]');
    expect(cells[0].style.gridRow).toBe('4');
    expect(cells[2].style.gridColumn).toBe('2');
  });

  it('headline shows the total, then the hovered day', () => {
    const { container } = render(<AgentActivityHeatmap data={data} title="Runs" />);
    expect(screen.getByText('14')).toBeTruthy();
    fireEvent.mouseEnter(container.querySelectorAll('[role="gridcell"]')[1]);
    expect(screen.getByText('8')).toBeTruthy();
  });

  it('ArrowRight jumps a week and Enter selects', () => {
    const onCellSelect = vi.fn();
    const { container } = render(<AgentActivityHeatmap data={data} onCellSelect={onCellSelect} />);
    const cells = container.querySelectorAll('[role="gridcell"]');
    fireEvent.keyDown(cells[0], { key: 'ArrowRight' });
    expect(cells[0].getAttribute('tabindex')).toBe('0'); // 2023-10-11 has no cell → focus stays
    fireEvent.keyDown(cells[1], { key: 'ArrowRight' });
    expect(cells[2].getAttribute('tabindex')).toBe('0');
    fireEvent.keyDown(cells[2], { key: 'Enter' });
    expect(onCellSelect).toHaveBeenCalledWith('2023-10-12', 'agent runs/day', 2);
  });
});

describe('ArchiveCollection (polish additions)', () => {
  const entries = [
    { id: 'a', date: '2026-09-02T12:00:00Z', title: 'Alpha', tags: ['x'] },
    { id: 'b', date: '2026-09-20T12:00:00Z', title: 'Beta' },
  ];

  it('marks the selected entry and shows a per-month count', () => {
    render(<ArchiveCollection entries={entries} selectedId="b" />);
    expect(screen.getByTestId('archive-entry-b').getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByTestId('archive-entry-a').getAttribute('aria-pressed')).toBe('false');
    expect(document.querySelector('[data-archive-group-header] span')?.textContent).toBe('2');
  });
});
