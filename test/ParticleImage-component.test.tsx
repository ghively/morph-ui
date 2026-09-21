import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { ParticleImage } from '../src/components/ParticleImage';

// Mock Image
const originalImage = globalThis.Image;
beforeAll(() => {
  globalThis.Image = class {
    src = '';
    onload: (() => void) | null = null;
    crossOrigin = '';
    constructor() {
      setTimeout(() => {
        if (this.onload) this.onload();
      }, 0);
    }
  } as unknown as typeof Image;
  
  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

afterAll(() => {
  globalThis.Image = originalImage;
});

describe('ParticleImage', () => {
  it('renders canvas by default', async () => {
    const { container } = render(<ParticleImage src="test.png" alt="Test" />);
    // Wait for onload
    await new Promise(r => setTimeout(r, 10));
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeTruthy();
    expect(canvas?.getAttribute('aria-label')).toBe('Test');
  });

  it('renders static image on reduced motion', async () => {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(<ParticleImage src="test.png" alt="Test" />);
    await new Promise(r => setTimeout(r, 10));
    
    const staticImg = screen.getByTestId('static-image');
    expect(staticImg).toBeTruthy();
    expect(staticImg.getAttribute('src')).toBe('test.png');
  });

  it('handles mouse interaction without crashing', async () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(<ParticleImage src="test.png" alt="Test" data-testid="container" />);
    await new Promise(r => setTimeout(r, 10));
    
    const container = screen.getByTestId('container');
    fireEvent.mouseMove(container, { clientX: 50, clientY: 50 });
    fireEvent.mouseLeave(container);
    // Passing implies no crash
    expect(true).toBe(true);
  });
});
