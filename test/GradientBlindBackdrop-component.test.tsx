import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { GradientBlindBackdrop } from '../src/components/GradientBlindBackdrop';

describe('GradientBlindBackdrop', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('renders with correct default state', () => {
    const { container } = render(<GradientBlindBackdrop />);
    const backdrop = container.firstChild as HTMLElement;
    expect(backdrop.getAttribute('data-state')).toBe('idle');
  });

  it('updates state based on prop', () => {
    const { container, rerender } = render(<GradientBlindBackdrop state="active" />);
    const backdrop = container.firstChild as HTMLElement;
    expect(backdrop.getAttribute('data-state')).toBe('active');
    
    rerender(<GradientBlindBackdrop state="idle" />);
    expect(backdrop.getAttribute('data-state')).toBe('idle');
  });

  it('renders layers', () => {
    const { container } = render(<GradientBlindBackdrop />);
    expect(container.querySelectorAll('.gradient-blind-layer').length).toBe(3);
  });
});
