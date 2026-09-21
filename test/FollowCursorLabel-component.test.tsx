import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { FollowCursorLabel } from '../src/components/FollowCursorLabel';

describe('FollowCursorLabel', () => {
  beforeAll(() => {
    // Mock matchMedia for testing
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
    
    // Mock requestAnimationFrame
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(cb, 0));
    vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id));
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('renders correctly and is hidden by default', () => {
    const { getByTestId } = render(
      <FollowCursorLabel label="Hover me" targetSelector=".test-target" />
    );
    const label = getByTestId('follow-cursor-label');
    expect(label).toBeTruthy();
    expect(label.classList.contains('is-visible')).toBe(false);
  });

  it('shows when mouse enters target and hides when leaves', async () => {
    // Need a target in the DOM
    const target = document.createElement('div');
    target.className = 'test-target';
    document.body.appendChild(target);

    const { getByTestId } = render(
      <FollowCursorLabel label="Hover me" targetSelector=".test-target" />
    );
    
    const label = getByTestId('follow-cursor-label');
    
    fireEvent.mouseEnter(target);
    expect(label.classList.contains('is-visible')).toBe(true);
    
    fireEvent.mouseLeave(target);
    expect(label.classList.contains('is-visible')).toBe(false);

    document.body.removeChild(target);
  });

  it('honors reduced motion preference by not showing', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(), 
        removeListener: vi.fn(), 
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const target = document.createElement('div');
    target.className = 'test-target-rm';
    document.body.appendChild(target);

    const { getByTestId } = render(
      <FollowCursorLabel label="Hover me" targetSelector=".test-target-rm" />
    );
    
    const label = getByTestId('follow-cursor-label');
    
    fireEvent.mouseEnter(target);
    // Because of the early return in useEffect, event listeners aren't attached, 
    // so it won't become visible.
    expect(label.classList.contains('is-visible')).toBe(false);

    document.body.removeChild(target);
  });
});
