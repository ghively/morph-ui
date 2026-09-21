import { render, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { FeatureChipHopper } from '../src/components/FeatureChipHopper';

describe('FeatureChipHopper', () => {
  const chips = [
    { id: 1, content: 'Chip 1' },
    { id: 2, content: 'Chip 2' },
    { id: 3, content: 'Chip 3' },
  ];

  beforeAll(() => {
    vi.useFakeTimers();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), 
        removeListener: vi.fn(), 
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('renders and cycles through chips', () => {
    const { getByTestId } = render(<FeatureChipHopper chips={chips} intervalMs={1000} />);
    
    const chip1 = getByTestId('feature-chip-1');
    const chip2 = getByTestId('feature-chip-2');

    expect(chip1.classList.contains('is-active')).toBe(true);
    expect(chip2.classList.contains('is-waiting')).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(chip1.classList.contains('is-leaving')).toBe(true);
    expect(chip2.classList.contains('is-active')).toBe(true);
  });

  it('pauses on hover', () => {
    const { getByTestId } = render(<FeatureChipHopper chips={chips} intervalMs={1000} />);
    const hopper = getByTestId('feature-chip-hopper');
    const chip1 = getByTestId('feature-chip-1');

    fireEvent.mouseEnter(hopper);
    
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // Should still be chip1 because of pause
    expect(chip1.classList.contains('is-active')).toBe(true);

    fireEvent.mouseLeave(hopper);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Should move to next now
    expect(chip1.classList.contains('is-leaving')).toBe(true);
  });
  
  it('pauses on focus', () => {
    const { getByTestId } = render(<FeatureChipHopper chips={chips} intervalMs={1000} />);
    const hopper = getByTestId('feature-chip-hopper');
    const chip1 = getByTestId('feature-chip-1');

    fireEvent.focus(hopper);
    
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(chip1.classList.contains('is-active')).toBe(true);
  });
});
