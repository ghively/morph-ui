import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AgentActivityHeatmap } from '../src/components/AgentActivityHeatmap';

describe('AgentActivityHeatmap', () => {
  const mockData = [
    { date: '2023-10-01', metric: 'agent runs/day', count: 5 },
    { date: '2023-10-02', metric: 'agent runs/day', count: 12 },
    { date: '2023-10-03', metric: 'agent runs/day', count: 0 },
    { date: '2023-10-01', metric: 'messages/day', count: 20 },
  ];

  it('renders correctly with default metrics', () => {
    const { container } = render(<AgentActivityHeatmap data={mockData} />);
    const heatmap = container.querySelector('.agent-activity-heatmap');
    expect(heatmap).toBeTruthy();
    
    // Default metric 'agent runs/day' should be selected
    const activeBtn = container.querySelector('button[aria-pressed="true"]');
    expect(activeBtn?.textContent).toBe('agent runs/day');
    
    // Grid cells should render based on dates
    const cells = container.querySelectorAll('.agent-activity-heatmap-cell[role="gridcell"]');
    expect(cells.length).toBe(3); // 3 unique dates in mockData
  });

  it('renders correct aria-labels on cells', () => {
    const { container } = render(<AgentActivityHeatmap data={mockData} />);
    const cells = container.querySelectorAll('.agent-activity-heatmap-cell[role="gridcell"]');
    
    // First cell should be for 2023-10-01
    const firstCell = cells[0];
    expect(firstCell!.getAttribute('aria-label')).toBe('2023-10-01: 5 agent runs/day');
  });

  it('switches metric on click and updates grid', () => {
    const { container, getByText } = render(<AgentActivityHeatmap data={mockData} />);
    
    // Switch to messages/day
    const msgBtn = getByText('messages/day');
    fireEvent.click(msgBtn);
    
    const activeBtn = container.querySelector('button[aria-pressed="true"]');
    expect(activeBtn?.textContent).toBe('messages/day');
    
    // Check cell count - dates are still 3, but count for 10-01 should be 20 and others 0
    const cells = container.querySelectorAll('.agent-activity-heatmap-cell[role="gridcell"]');
    expect(cells[0]!.getAttribute('aria-label')).toBe('2023-10-01: 20 messages/day');
    expect(cells[1]!.getAttribute('aria-label')).toBe('2023-10-02: 0 messages/day');
  });

  it('fires onCellSelect callback when cell is clicked', () => {
    const callback = vi.fn();
    const { container } = render(<AgentActivityHeatmap data={mockData} onCellSelect={callback} />);
    
    const cells = container.querySelectorAll('.agent-activity-heatmap-cell[role="gridcell"]');
    fireEvent.click(cells[1]!); // 2023-10-02
    
    expect(callback).toHaveBeenCalledWith('2023-10-02', 'agent runs/day', 12);
  });

  it('handles empty data', () => {
    const { container } = render(<AgentActivityHeatmap data={[]} />);
    const cells = container.querySelectorAll('.agent-activity-heatmap-cell[role="gridcell"]');
    expect(cells.length).toBe(0);
  });

  it('supports keyboard navigation via arrow keys', () => {
    const { container } = render(<AgentActivityHeatmap data={mockData} />);
    const cells = container.querySelectorAll('.agent-activity-heatmap-cell[role="gridcell"]');
    
    // By default, first cell should be focusable (tabIndex 0), others -1
    expect(cells[0]!.getAttribute('tabindex')).toBe('0');
    expect(cells[1]!.getAttribute('tabindex')).toBe('-1');

    // Simulate keydown on first cell (Down arrow moves to next row, same column)
    fireEvent.keyDown(cells[0]!, { key: 'ArrowDown' });
    
    // Now second cell should be focusable
    expect(cells[1]!.getAttribute('tabindex')).toBe('0');
    expect(cells[0]!.getAttribute('tabindex')).toBe('-1');
  });
});
