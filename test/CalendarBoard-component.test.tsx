import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { CalendarBoard } from '../src/components/CalendarBoard';
import { dayFloor } from '../src/components/dataShell.shared';

const NOW = new Date('2026-10-13T12:00:00').getTime();
const D = (day: number) => dayFloor(new Date(2026, 9, day, 12).getTime());

const EVENTS = [
  { id: 'e1', title: 'Index rebuild', at: D(6), tone: 'info' as const },
  { id: 'e2', title: 'Cutover window', at: D(22), tone: 'danger' as const },
  { id: 'e3', title: 'Docs due', at: D(22), tone: 'warn' as const },
];

describe('CalendarBoard', () => {
  it('renders a 6x7 grid with weekday headers', () => {
    const { container } = render(<CalendarBoard events={EVENTS} now={NOW} />);
    expect(container.querySelectorAll('[data-cal-week]')).toHaveLength(6);
    expect(container.querySelectorAll('[data-cal-cell]')).toHaveLength(42);
    expect(container.querySelectorAll('[data-cal-weekdays] span')).toHaveLength(7);
  });

  it('places event chips inside their day cell', () => {
    const { container } = render(<CalendarBoard events={EVENTS} now={NOW} />);
    const cell = container.querySelector(`[data-day="${D(22)}"]`)!;
    expect(cell.querySelectorAll('[data-cal-event]')).toHaveLength(2);
  });

  it('marks today and dims other-month cells', () => {
    const { container } = render(<CalendarBoard events={EVENTS} now={NOW} />);
    expect(container.querySelector(`[data-day="${dayFloor(NOW)}"]`)!.hasAttribute('data-today')).toBe(true);
    // First week starts Sep 28 (Monday) — outside October.
    expect(container.querySelectorAll('[data-cal-cell]:not([data-inmonth])').length).toBeGreaterThan(0);
  });

  it('navigates months and reports the change', () => {
    const onMonthChange = vi.fn();
    render(<CalendarBoard events={EVENTS} now={NOW} onMonthChange={onMonthChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Next month' }));
    expect(onMonthChange).toHaveBeenCalledTimes(1);
    expect(screen.getByText('November 2026')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }));
    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByText('September 2026')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Today' }));
    expect(screen.getByText('October 2026')).toBeTruthy();
  });

  it('moves an event chip by pointer drag onto another day', () => {
    const onEventMove = vi.fn();
    const { container } = render(<CalendarBoard events={EVENTS} now={NOW} onEventMove={onEventMove} />);
    const chip = screen.getByText('Cutover window').closest('[data-cal-event]') as HTMLElement;

    // jsdom: give cells row rects so dayAt resolves by y position.
    const cells = Array.from(container.querySelectorAll('[data-cal-cell]')) as HTMLElement[];
    cells.forEach((cell, i) => {
      const col = i % 7;
      const row = Math.floor(i / 7);
      cell.getBoundingClientRect = () =>
        ({ left: col * 100, top: row * 100, right: col * 100 + 100, bottom: row * 100 + 100, width: 100, height: 100, x: col * 100, y: row * 100, toJSON: () => {} }) as DOMRect;
    });

    fireEvent.pointerDown(chip, { button: 0, clientX: 50, clientY: 50, pointerId: 1 });
    expect(chip.classList.contains('is-dragging')).toBe(true);
    // Drop over the cell at row 1, col 1.
    fireEvent.pointerMove(chip, { clientX: 150, clientY: 150, pointerId: 1 });
    fireEvent.pointerUp(chip, { clientX: 150, clientY: 150, pointerId: 1 });

    expect(onEventMove).toHaveBeenCalledTimes(1);
    expect(onEventMove.mock.calls[0]![0]).toBe('e2');
    expect(onEventMove.mock.calls[0]![1].getTime()).toBe(D(6)); // cell index 8 = row 1 col 1 = Oct 6
  });

  it('activates an event on click and Enter', () => {
    const onEventActivate = vi.fn();
    render(<CalendarBoard events={EVENTS} now={NOW} onEventActivate={onEventActivate} />);
    fireEvent.click(screen.getByText('Docs due'));
    expect(onEventActivate).toHaveBeenCalledWith(expect.objectContaining({ id: 'e3' }));
    fireEvent.keyDown(screen.getByText('Index rebuild'), { key: 'Enter' });
    expect(onEventActivate).toHaveBeenCalledWith(expect.objectContaining({ id: 'e1' }));
  });
});
