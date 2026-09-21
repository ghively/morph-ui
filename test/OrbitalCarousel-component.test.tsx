import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OrbitalCarousel } from '../src/components/OrbitalCarousel';

describe('OrbitalCarousel', () => {
  const images = [
    { id: '1', src: 'img1.jpg', alt: 'Image 1' },
    { id: '2', src: 'img2.jpg', alt: 'Image 2' },
    { id: '3', src: 'img3.jpg', alt: 'Image 3' },
  ];

  it('renders correctly', () => {
    render(<OrbitalCarousel images={images} />);
    const carousel = screen.getByLabelText('Orbital Image Carousel');
    expect(carousel).toBeTruthy();
    
    const renderedImages = screen.getAllByAltText(/Image/);
    // 3 in 3D scene, 3 in fallback
    expect(renderedImages.length).toBe(6);
  });

  it('handles keyboard navigation', () => {
    render(<OrbitalCarousel images={images} />);
    const carousel = screen.getByLabelText('Orbital Image Carousel');
    
    // Initial state: Image 1 is focused (index 0 maps to item 0 when rotation is 0)
    let sceneImages = carousel.querySelectorAll('.orbital-carousel-item');
    expect(sceneImages[0]?.getAttribute('data-focused')).toBe('true');

    // Press right arrow
    fireEvent.keyDown(carousel, { key: 'ArrowRight' });
    
    // After rotation increases, it wraps around (index 1 maps to item 2)
    // We expect the focused item to change
    sceneImages = carousel.querySelectorAll('.orbital-carousel-item');
    // Because it's an async/effect update, we verify the rotation style changes
    const ring = carousel.querySelector('.orbital-carousel-ring');
    expect(ring?.getAttribute('style')).toContain('rotateY(120deg)');
  });

  it('handles mouse dragging', () => {
    render(<OrbitalCarousel images={images} />);
    const carousel = screen.getByLabelText('Orbital Image Carousel');
    
    fireEvent.mouseDown(carousel, { clientX: 100 });
    const ring = carousel.querySelector('.orbital-carousel-ring');
    expect(ring?.getAttribute('data-dragging')).toBe('true');
    
    fireEvent.mouseMove(carousel, { clientX: 150 });
    // Rotation should update based on delta (150 - 100) * 0.5 = 25deg
    expect(ring?.getAttribute('style')).toContain('rotateY(25deg)');

    fireEvent.mouseUp(carousel);
    expect(ring?.getAttribute('data-dragging')).toBe('false');
  });
});
