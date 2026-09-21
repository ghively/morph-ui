import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TextFlip } from '../src/components/TextFlip';

describe('TextFlip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders initial text correctly', () => {
    const { container, getByLabelText } = render(<TextFlip text="Initial" />);
    
    const wrapper = getByLabelText('Initial');
    expect(wrapper).toBeDefined();
    expect(wrapper.getAttribute('data-direction')).toBe('vertical');
    expect(wrapper.hasAttribute('data-flipping')).toBe(false);

    const sizer = container.querySelector('.text-flip-sizer');
    expect(sizer?.textContent).toBe('Initial');

    const front = container.querySelector('.text-flip-front');
    expect(front?.textContent).toBe('Initial');

    const back = container.querySelector('.text-flip-back');
    expect(back?.textContent).toBe('Initial');
  });

  it('flips when text changes', () => {
    const { container, rerender } = render(<TextFlip text="Initial" />);
    
    rerender(<TextFlip text="New" />);

    const wrapper = container.querySelector('[data-text-flip]');
    expect(wrapper?.hasAttribute('data-flipping')).toBe(true);

    const front = container.querySelector('.text-flip-front');
    expect(front?.textContent).toBe('Initial');

    const back = container.querySelector('.text-flip-back');
    expect(back?.textContent).toBe('New');

    act(() => {
      vi.runAllTimers();
    });

    expect(wrapper?.hasAttribute('data-flipping')).toBe(false);
  });

  it('supports horizontal direction', () => {
    const { getByLabelText } = render(<TextFlip text="Test" direction="horizontal" />);
    const wrapper = getByLabelText('Test');
    expect(wrapper.getAttribute('data-direction')).toBe('horizontal');
  });
});
