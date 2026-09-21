import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TextMorphing } from '../src/components/TextMorphing';

describe('TextMorphing', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders correctly', () => {
    const { container, getByLabelText } = render(<TextMorphing text="Start" />);
    
    const wrapper = getByLabelText('Start');
    expect(wrapper).toBeDefined();
    expect(wrapper.hasAttribute('data-morphing')).toBe(false);

    const prev = container.querySelector('.text-morphing-prev');
    const curr = container.querySelector('.text-morphing-curr');
    
    expect(prev?.textContent).toBe('Start');
    expect(curr?.textContent).toBe('Start');
  });

  it('morphs on text change', () => {
    const { container, rerender } = render(<TextMorphing text="Start" />);
    
    rerender(<TextMorphing text="End" />);

    const wrapper = container.querySelector('[data-text-morphing]');
    expect(wrapper?.hasAttribute('data-morphing')).toBe(true);

    const prev = container.querySelector('.text-morphing-prev');
    const curr = container.querySelector('.text-morphing-curr');
    
    expect(prev?.textContent).toBe('Start');
    expect(curr?.textContent).toBe('End');

    act(() => {
      vi.runAllTimers();
    });

    expect(wrapper?.hasAttribute('data-morphing')).toBe(false);
  });

  it('supports custom props', () => {
    const { getByLabelText } = render(<TextMorphing text="Test" as="div" className="custom" />);
    const wrapper = getByLabelText('Test');
    
    expect(wrapper.tagName.toLowerCase()).toBe('div');
    expect(wrapper.className).toBe('custom');
  });
});
