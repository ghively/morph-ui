import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { ConfettiCannon, type ConfettiCannonRef } from '../src/components/ConfettiCannon';
import { useRef } from 'react';

// Wrapper component to test imperative handle
function TestWrapper() {
  const cannonRef = useRef<ConfettiCannonRef>(null);
  
  return (
    <div>
      <ConfettiCannon ref={cannonRef} />
      <button onClick={() => cannonRef.current?.fire()}>Fire</button>
    </div>
  );
}

describe('ConfettiCannon', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('renders canvas when motion is allowed', () => {
    const { container } = render(<TestWrapper />);
    expect(container.querySelector('canvas')).toBeTruthy();
  });

  it('does not render canvas when reduced motion is preferred', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    const { container } = render(<TestWrapper />);
    expect(container.querySelector('canvas')).toBeFalsy();
  });

  it('handles fire() gracefully without errors', () => {
    // Reset mock for normal motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    const { getByText } = render(<TestWrapper />);
    const button = getByText('Fire');
    
    // In jsdom canvas getContext returns null by default if canvas pkg isn't installed
    // We just want to ensure it doesn't throw.
    expect(() => {
      act(() => {
        button.click();
      });
    }).not.toThrow();
  });
});
