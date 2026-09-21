import { render, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TextCycle } from '../src/components/TextCycle';

describe('TextCycle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders initial item correctly', () => {
    const items = ['One', 'Two', 'Three'];
    const { container } = render(<TextCycle items={items} />);
    
    const wrapper = container.querySelector('[data-text-cycle]');
    expect(wrapper).toBeDefined();

    const cycleItems = container.querySelectorAll('[data-text-cycle-item]');
    expect(cycleItems.length).toBe(3);
    
    expect(cycleItems[0]?.getAttribute('data-state')).toBe('active');
    expect(cycleItems[1]?.getAttribute('data-state')).toBe('idle');
    expect(cycleItems[2]?.getAttribute('data-state')).toBe('prev'); // Because 0 - 1 = 2 (mod 3)
  });

  it('cycles through items automatically', () => {
    const items = ['One', 'Two', 'Three'];
    const { container } = render(<TextCycle items={items} interval={1000} />);
    
    const cycleItems = container.querySelectorAll('[data-text-cycle-item]');
    
    expect(cycleItems[0]?.getAttribute('data-state')).toBe('active');

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(cycleItems[1]?.getAttribute('data-state')).toBe('active');
    expect(cycleItems[0]?.getAttribute('data-state')).toBe('prev');

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(cycleItems[2]?.getAttribute('data-state')).toBe('active');
    expect(cycleItems[1]?.getAttribute('data-state')).toBe('prev');

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(cycleItems[0]?.getAttribute('data-state')).toBe('active');
  });

  it('pauses on hover', () => {
    const items = ['One', 'Two'];
    const { container } = render(<TextCycle items={items} interval={1000} />);
    
    const cycleItems = container.querySelectorAll('[data-text-cycle-item]');
    const wrapper = container.querySelector('[data-text-cycle]') as HTMLElement;

    expect(cycleItems[0]?.getAttribute('data-state')).toBe('active');

    fireEvent.mouseEnter(wrapper);

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // Should still be active because we paused
    expect(cycleItems[0]?.getAttribute('data-state')).toBe('active');

    fireEvent.mouseLeave(wrapper);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Should have cycled
    expect(cycleItems[1]?.getAttribute('data-state')).toBe('active');
  });

  it('supports custom props', () => {
    const { container } = render(
      <TextCycle items={['A', 'B']} as="h3" className="custom" />
    );
    
    const wrapper = container.querySelector('[data-text-cycle]');
    expect(wrapper?.tagName.toLowerCase()).toBe('h3');
    expect(wrapper?.className).toBe('custom');
  });
});
