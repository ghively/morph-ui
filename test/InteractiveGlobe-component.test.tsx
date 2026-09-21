import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { InteractiveGlobe } from '../src/components/InteractiveGlobe';

describe('InteractiveGlobe', () => {
  beforeAll(() => {
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

  const markers = [
    { id: '1', lat: 40.7128, lng: -74.0060, label: 'New York' },
    { id: '2', lat: 51.5074, lng: -0.1278, label: 'London' }
  ];

  it('renders canvas and handles pointer events', () => {
    const { container } = render(<InteractiveGlobe markers={markers} />);
    const div = container.firstChild as HTMLElement;
    
    expect(screen.getByRole('application', { name: 'Interactive Globe' })).toBeDefined();

    // Mock DOM elements pointer capture methods
    div.setPointerCapture = vi.fn();
    div.releasePointerCapture = vi.fn();

    fireEvent.pointerDown(div, { clientX: 100, clientY: 100, pointerId: 1 });
    expect(div.setPointerCapture).toHaveBeenCalledWith(1);

    fireEvent.pointerMove(div, { clientX: 150, clientY: 100 });
    
    fireEvent.pointerUp(div, { pointerId: 1 });
    expect(div.releasePointerCapture).toHaveBeenCalledWith(1);
  });
});
