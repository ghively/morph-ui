import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { GanttTimeline } from '../src/components/GanttTimeline';
import { addDays, dayFloor } from '../src/components/dataShell.shared';

const T0 = dayFloor(new Date('2026-10-05T00:00:00').getTime());
const NOW = addDays(T0, 7);

const TASKS = [
  { id: 't1', label: 'Freeze', start: T0, end: addDays(T0, 3), progress: 1 },
  { id: 't2', label: 'Rebuild', start: addDays(T0, 3), end: addDays(T0, 8), dependsOn: ['t1'] },
  { id: 't3', label: 'Cutover', start: addDays(T0, 11), end: addDays(T0, 13), dependsOn: ['t2'] },
];

describe('GanttTimeline', () => {
  it('renders a bar per task with an accessible name', () => {
    render(<GanttTimeline tasks={TASKS} zoom="day" span={16} now={NOW} />);
    expect(screen.getByRole('button', { name: 'Freeze' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Rebuild' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Cutover' })).toBeTruthy();
  });

  it('draws a dependency path per dependsOn edge', () => {
    const { container } = render(<GanttTimeline tasks={TASKS} zoom="day" span={16} now={NOW} />);
    const svg = container.querySelector('[data-gantt-deps]')!;
    const paths = svg.querySelectorAll('path[d^="M"]');
    // 2 dependency edges (t1→t2, t2→t3); the arrow marker path has no d^="M" at index 0.
    expect(paths.length).toBeGreaterThanOrEqual(2);
  });

  it('renders the today marker inside the window', () => {
    const { container } = render(<GanttTimeline tasks={TASKS} zoom="day" span={16} now={NOW} />);
    const today = container.querySelector('[data-gantt-today]') as HTMLElement;
    expect(today).toBeTruthy();
    expect(parseFloat(today.style.left)).toBeGreaterThan(0);
  });

  it('zoom buttons report changes and mark the active zoom', () => {
    const onZoomChange = vi.fn();
    const { container } = render(<GanttTimeline tasks={TASKS} zoom="week" span={4} now={NOW} onZoomChange={onZoomChange} />);
    const active = container.querySelector('[data-gantt-zoombtn][data-active]');
    expect(active?.textContent).toBe('Weeks');
    fireEvent.click(screen.getByRole('button', { name: 'Months' }));
    expect(onZoomChange).toHaveBeenCalledWith('month');
  });

  it('progress renders a fill strip at the given width', () => {
    const { container } = render(<GanttTimeline tasks={TASKS} zoom="day" span={16} now={NOW} />);
    const fill = container.querySelector('[data-gantt-progress]') as HTMLElement;
    expect(fill).toBeTruthy();
    expect(fill.style.width).toBe('100%');
  });

  it('fires onTaskActivate on bar click', () => {
    const onTaskActivate = vi.fn();
    render(<GanttTimeline tasks={TASKS} zoom="day" span={16} now={NOW} onTaskActivate={onTaskActivate} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cutover' }));
    expect(onTaskActivate).toHaveBeenCalledWith(expect.objectContaining({ id: 't3' }));
  });
});
