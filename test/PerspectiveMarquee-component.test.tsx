import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { PerspectiveMarquee } from '../src/components/PerspectiveMarquee';

beforeAll(() => {
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

describe('PerspectiveMarquee', () => {
  const rows = [
    {
      id: 'r1',
      direction: 'left' as const,
      images: [{ id: '1', src: '1.jpg', alt: 'img1' }, { id: '2', src: '2.jpg', alt: 'img2' }],
    },
    {
      id: 'r2',
      direction: 'right' as const,
      images: [{ id: '3', src: '3.jpg', alt: 'img3' }],
    }
  ];

  it('renders correctly with doubled images', () => {
    render(<PerspectiveMarquee rows={rows} />);
    const marquee = screen.getByLabelText('3D Perspective Image Marquee');
    expect(marquee).toBeTruthy();
    
    // Row 1: 2 images -> 4 total (doubled)
    // Row 2: 1 image -> 2 total (doubled)
    // Total images = 6
    const renderedImages = screen.getAllByRole('img');
    expect(renderedImages.length).toBe(6);
  });

  it('pauses on hover', () => {
    const { container } = render(<PerspectiveMarquee rows={rows} />);
    const marquee = screen.getByLabelText('3D Perspective Image Marquee');
    
    fireEvent.mouseEnter(marquee);
    
    const firstRow = container.querySelector('.perspective-marquee-row');
    expect(firstRow?.getAttribute('style')).toContain('animation-play-state: paused');
    
    fireEvent.mouseLeave(marquee);
    expect(firstRow?.getAttribute('style')).toContain('animation-play-state: running');
  });

  it('respects reduced motion', () => {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { container } = render(<PerspectiveMarquee rows={rows} />);
    const firstRow = container.querySelector('.perspective-marquee-row');
    expect(firstRow?.getAttribute('style')).toContain('animation-play-state: paused');
  });
});
