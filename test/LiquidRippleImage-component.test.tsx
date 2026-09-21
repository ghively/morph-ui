import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LiquidRippleImage } from '../src/components/LiquidRippleImage';

describe('LiquidRippleImage', () => {
  it('renders correctly', () => {
    const { container } = render(<LiquidRippleImage src="test.jpg" alt="test image" />);
    
    const img = container.querySelector('.liquid-ripple-img') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.src).toContain('test.jpg');
    expect(img.alt).toBe('test image');

    const svg = container.querySelector('.liquid-ripple-svg');
    expect(svg).toBeTruthy();
    expect(svg?.querySelector('filter')).toBeTruthy();
  });

  it('updates css variables on pointer move (with mocked rect)', () => {
    const { container } = render(<LiquidRippleImage src="test.jpg" alt="test image" />);
    const wrapper = container.querySelector('.liquid-ripple-container') as HTMLElement;
    
    // Mock getBoundingClientRect
    wrapper.getBoundingClientRect = () => ({
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      bottom: 100,
      right: 100,
      x: 0,
      y: 0,
      toJSON: () => {}
    });

    fireEvent.pointerMove(wrapper, { clientX: 25, clientY: 75 });
    
    expect(wrapper.style.getPropertyValue('--ripple-x')).toBe('25%');
    expect(wrapper.style.getPropertyValue('--ripple-y')).toBe('75%');
  });

  it('handles zero dimensions gracefully (JSDOM default)', () => {
    const { container } = render(<LiquidRippleImage src="test.jpg" alt="test image" />);
    const wrapper = container.querySelector('.liquid-ripple-container') as HTMLElement;
    
    fireEvent.pointerMove(wrapper, { clientX: 25, clientY: 75 });
    
    // Values remain at 50% initial state if rect is 0
    expect(wrapper.style.getPropertyValue('--ripple-x')).toBe('50%');
    expect(wrapper.style.getPropertyValue('--ripple-y')).toBe('50%');
  });
});
