import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TextShimmer } from '../src/components/TextShimmer';

describe('TextShimmer', () => {
  it('renders children correctly', () => {
    render(<TextShimmer>Loading...</TextShimmer>);
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('applies custom style properties', () => {
    const { container } = render(
      <TextShimmer duration="3s" angle="90deg" color="gray" shimmerColor="white" className="shimmer-class">
        Shimmering
      </TextShimmer>
    );

    const el = container.querySelector('[data-text-shimmer]') as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.className).toContain('shimmer-class');
    expect(el.style.getPropertyValue('--shimmer-duration')).toBe('3s');
    expect(el.style.getPropertyValue('--shimmer-angle')).toBe('90deg');
    expect(el.style.getPropertyValue('--shimmer-color')).toBe('gray');
    expect(el.style.getPropertyValue('--shimmer-highlight')).toBe('white');
  });
});
