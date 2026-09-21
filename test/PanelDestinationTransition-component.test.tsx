import { useRef } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { PanelDestinationTransition } from '../src/components/PanelDestinationTransition';

// Mock getBoundingClientRect
const mockGetBoundingClientRect = vi.fn(() => ({
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
  toJSON: () => {}
}));

describe('PanelDestinationTransition', () => {
  beforeEach(() => {
    // Setup matchMedia mock
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
    
    // Mock getBoundingClientRect for all HTMLElements
    window.HTMLElement.prototype.getBoundingClientRect = mockGetBoundingClientRect;

    // We also need to mock requestAnimationFrame to run immediately
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when active', () => {
    const TestComponent = () => {
      const sourceRef = useRef<HTMLDivElement>(null);
      return (
        <div>
          <div ref={sourceRef} data-testid="source">Source</div>
          <PanelDestinationTransition active={true} sourceRef={sourceRef}>
            <div data-testid="child">Destination Child</div>
          </PanelDestinationTransition>
        </div>
      );
    };

    render(<TestComponent />);
    
    expect(screen.getByTestId('child')).toBeTruthy();
  });

  it('does not crash and renders children if sourceRef is null', () => {
    const TestComponent = () => {
      const nullRef = useRef<HTMLDivElement>(null);
      return (
        <PanelDestinationTransition active={true} sourceRef={nullRef}>
          <div data-testid="child">Destination Child</div>
        </PanelDestinationTransition>
      );
    };

    render(<TestComponent />);
    
    expect(screen.getByTestId('child')).toBeTruthy();
  });

  it('handles prefers-reduced-motion correctly (no ghost)', () => {
    // Override matchMedia to return true for prefers-reduced-motion
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

    const onTransitionEnd = vi.fn();
    
    const TestComponent = ({ active }: { active: boolean }) => {
      const sourceRef = useRef<HTMLDivElement>(null);
      return (
        <div>
          <div ref={sourceRef} data-testid="source">Source</div>
          <PanelDestinationTransition active={active} sourceRef={sourceRef} onTransitionEnd={onTransitionEnd}>
            <div data-testid="child">Destination Child</div>
          </PanelDestinationTransition>
        </div>
      );
    };

    const { rerender } = render(<TestComponent active={false} />);
    expect(screen.queryByTestId('child')).toBeNull();

    rerender(<TestComponent active={true} />);
    
    // Ghost should not exist
    expect(screen.queryByTestId('destination-ghost')).toBeNull();
    
    // Child should be visible
    expect(screen.getByTestId('child')).toBeTruthy();
    
    // Callback should fire
    expect(onTransitionEnd).toHaveBeenCalled();
  });

  it('fires onTransitionEnd callback when animation finishes', () => {
    const onTransitionEnd = vi.fn();
    
    const TestComponent = ({ active }: { active: boolean }) => {
      const sourceRef = useRef<HTMLDivElement>(null);
      return (
        <div>
          <div ref={sourceRef} data-testid="source">Source</div>
          <PanelDestinationTransition active={active} sourceRef={sourceRef} onTransitionEnd={onTransitionEnd}>
            <div data-testid="child">Destination Child</div>
          </PanelDestinationTransition>
        </div>
      );
    };

    const { rerender } = render(<TestComponent active={false} />);
    
    // Make getBoundingClientRect return non-zero so we hit the FLIP logic
    mockGetBoundingClientRect.mockReturnValueOnce({
      top: 100, left: 100, width: 200, height: 100, bottom: 200, right: 300, x: 100, y: 100, toJSON: () => {}
    });
    mockGetBoundingClientRect.mockReturnValueOnce({
      top: 0, left: 0, width: 400, height: 200, bottom: 200, right: 400, x: 0, y: 0, toJSON: () => {}
    });

    rerender(<TestComponent active={true} />);
    
    // In our implementation with requestAnimationFrame mocked, the ghost should be rendered
    const ghost = screen.getByTestId('destination-ghost');
    expect(ghost).toBeTruthy();

    // Trigger transitionEnd manually
    act(() => {
      ghost.dispatchEvent(new Event('transitionend', { bubbles: true }));
    });
    
    // But since our handler checks propertyName === 'transform', we need a more specific event
    act(() => {
      const event = new TransitionEvent('transitionend', { bubbles: true, propertyName: 'transform' });
      ghost.dispatchEvent(event);
    });

    expect(screen.queryByTestId('destination-ghost')).toBeNull();
    expect(onTransitionEnd).toHaveBeenCalled();
  });
});
