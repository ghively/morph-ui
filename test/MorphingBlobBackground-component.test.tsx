import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { MorphingBlobBackground } from '../src/components/MorphingBlobBackground';

describe('MorphingBlobBackground', () => {
  beforeAll(() => {
    // Mock requestAnimationFrame
    vi.stubGlobal('requestAnimationFrame', (cb: (time: number) => void) => setTimeout(cb, 16));
    vi.stubGlobal('cancelAnimationFrame', (id: ReturnType<typeof setTimeout>) => clearTimeout(id));
    
    // Mock matchMedia
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
    vi.unstubAllGlobals();
  });

  it('renders correctly', () => {
    const { container } = render(<MorphingBlobBackground />);
    
    expect(container.querySelector('.morphing-blob-container')).toBeTruthy();
    expect(container.querySelector('canvas')).toBeTruthy();
    expect(container.querySelector('.morphing-blob-fallback')).toBeTruthy();
  });

  it('handles custom colors and blob count', () => {
    const { container } = render(
      <MorphingBlobBackground colors={['red', 'green']} blobCount={2} />
    );
    expect(container.querySelector('.morphing-blob-container')).toBeTruthy();
  });
});
