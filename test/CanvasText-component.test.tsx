import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { CanvasText } from '../src/components/CanvasText';

describe('CanvasText', () => {
  beforeAll(() => {
    // Mock matchMedia for testing reduced motion
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

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('renders canvas normally', () => {
    const { container } = render(<CanvasText text="Hello" />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeTruthy();
    expect(canvas?.getAttribute('aria-label')).toBe('Hello');
  });

  it('renders fallback when reduced motion is preferred', () => {
    // Override mock to simulate reduced motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    const { getByText, container } = render(<CanvasText text="Fallback" />);
    const fallback = getByText('Fallback');
    expect(fallback).toBeTruthy();
    expect(container.querySelector('canvas')).toBeFalsy();
  });
});
