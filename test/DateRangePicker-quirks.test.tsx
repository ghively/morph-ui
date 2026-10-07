import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { DateRangePicker } from '../src/components/DateRangePicker';

afterEach(() => { vi.useRealTimers(); });

describe('DateRangePicker today anchor', () => {
  it('today anchors the default presets and the input max', () => {
    const onChange = vi.fn();
    render(<DateRangePicker id="dr" today="2026-03-12" value={{ from: '', to: '' }} onChange={onChange} />);
    expect(document.getElementById('dr-from')!.getAttribute('max')).toBe('2026-03-12');
    fireEvent.click(screen.getByRole('button', { name: '7d' }));
    expect(onChange).toHaveBeenLastCalledWith({ from: '2026-03-05', to: '2026-03-12' });
  });

  it('max still overrides the today anchor', () => {
    render(<DateRangePicker id="dr" today="2026-03-12" max="2026-03-01" value={{ from: '', to: '' }} onChange={() => {}} />);
    expect(document.getElementById('dr-to')!.getAttribute('max')).toBe('2026-03-01');
  });

  it('without today, the clock is captured once on mount, not re-read on re-render', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 2, 12, 12));
    const onChange = vi.fn();
    const { rerender } = render(<DateRangePicker id="dr" value={{ from: '', to: '' }} onChange={onChange} />);
    vi.setSystemTime(new Date(2026, 2, 20, 12));
    rerender(<DateRangePicker id="dr" value={{ from: '', to: '' }} onChange={onChange} label="Window" />);
    expect(document.getElementById('dr-from')!.getAttribute('max')).toBe('2026-03-12');
    fireEvent.click(screen.getByRole('button', { name: '7d' }));
    expect(onChange).toHaveBeenLastCalledWith({ from: '2026-03-05', to: '2026-03-12' });
  });
});
