import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LaptopFrame } from '../src/components/LaptopFrame';

describe('LaptopFrame', () => {
  it('renders children correctly', () => {
    const { container } = render(
      <LaptopFrame>
        <div data-testid="screen-content">Hello</div>
      </LaptopFrame>
    );
    
    expect(container.querySelector('[data-testid="screen-content"]')).toBeTruthy();
    expect(container.querySelector('.laptop-camera')).toBeTruthy();
    expect(container.querySelector('.laptop-thumb-notch')).toBeTruthy();
  });

  it('applies animation class by default', () => {
    const { container } = render(<LaptopFrame>content</LaptopFrame>);
    expect(container.querySelector('.laptop-frame-wrapper')?.classList.contains('animate-open')).toBe(true);
  });

  it('can disable animation', () => {
    const { container } = render(<LaptopFrame animateOpen={false}>content</LaptopFrame>);
    expect(container.querySelector('.laptop-frame-wrapper')?.classList.contains('animate-open')).toBe(false);
  });

  it('applies custom class name', () => {
    const { container } = render(<LaptopFrame className="my-laptop">content</LaptopFrame>);
    expect(container.querySelector('.laptop-frame-wrapper')?.classList.contains('my-laptop')).toBe(true);
  });
});
