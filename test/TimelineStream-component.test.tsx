import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { TimelineStream } from '../src/components/TimelineStream';

const ITEMS = [
  { id: 'a1', time: '09:41', title: 'Re-index finished', tone: 'success' as const },
  { id: 'a2', time: '09:38', title: 'Sweep started', tone: 'info' as const, active: true },
  { id: 'a3', time: '09:12', title: 'Digest sent' },
];

describe('TimelineStream', () => {
  it('renders items with times, tones and connectors (no wire on last)', () => {
    const { container } = render(<TimelineStream items={ITEMS} />);
    const rows = container.querySelectorAll('[data-tstream-item]');
    expect(rows).toHaveLength(3);
    expect(rows[0]!.getAttribute('data-tone')).toBe('success');
    expect(rows[0]!.querySelector('[data-tstream-wire]')).toBeTruthy();
    expect(rows[2]!.querySelector('[data-tstream-wire]')).toBeNull();
    expect(screen.getByText('09:41')).toBeTruthy();
  });

  it('marks the active item', () => {
    const { container } = render(<TimelineStream items={ITEMS} />);
    expect(container.querySelector('[data-tstream-item][data-active]')!.textContent).toContain('Sweep started');
  });

  it('newestFirst flips the visual order', () => {
    const { container } = render(<TimelineStream items={ITEMS} newestFirst />);
    const rows = container.querySelectorAll('[data-tstream-item]');
    expect(rows[0]!.textContent).toContain('Digest sent');
    expect(rows[2]!.textContent).toContain('Re-index finished');
  });

  it('fires onItemActivate on click and Enter when interactive', () => {
    const onItemActivate = vi.fn();
    const { container } = render(<TimelineStream items={ITEMS} onItemActivate={onItemActivate} />);
    fireEvent.click(screen.getByText('Digest sent'));
    expect(onItemActivate).toHaveBeenCalledWith(expect.objectContaining({ id: 'a3' }));
    fireEvent.keyDown(container.querySelector('[data-tstream-item]') as HTMLElement, { key: 'Enter' });
    expect(onItemActivate).toHaveBeenCalledTimes(2);
  });

  it('renders the empty state', () => {
    render(<TimelineStream items={[]} />);
    expect(screen.getByText('No activity yet.')).toBeTruthy();
  });
});
