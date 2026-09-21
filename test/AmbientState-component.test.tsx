import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AmbientState } from '../src/components/AmbientState';

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

describe('AmbientState', () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
    
    originalMatchMedia = window.matchMedia;
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

  afterEach(() => {
    vi.unstubAllGlobals();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
  });

  it('renders structure and data attributes', () => {
    const { container } = render(<AmbientState state="idle" intensity="subtle" />);
    const root = container.querySelector('.ambient-state');
    expect(root).toBeTruthy();
    expect(root?.getAttribute('data-state')).toBe('idle');
    expect(root?.getAttribute('data-intensity')).toBe('subtle');
  });

  it('renders fallback when canvas getContext returns null', () => {
    // JSDOM canvas implementation is limited, and might return null for context, 
    // but if it doesn't, we can mock it.
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(null);
    
    const { container } = render(<AmbientState state="thinking" />);
    expect(container.querySelector('.ambient-state-fallback')).toBeTruthy();
    expect(container.querySelector('canvas')).toBeFalsy();
    
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });

  it('renders canvas when context is available', () => {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    // Mock getContext to return a dummy object
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      createRadialGradient: vi.fn().mockReturnValue({ addColorStop: vi.fn() }),
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      scale: vi.fn(),
    });
    
    const { container } = render(<AmbientState state="speaking" />);
    expect(container.querySelector('canvas')).toBeTruthy();
    expect(container.querySelector('.ambient-state-fallback')).toBeFalsy();
    
    HTMLCanvasElement.prototype.getContext = originalGetContext;
  });
});
