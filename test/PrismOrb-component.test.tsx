import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PrismOrb } from '../src/components/PrismOrb';

describe('PrismOrb', () => {
  it('renders canvas element with default size', () => {
    const { container } = render(<PrismOrb />);
    const orb = container.querySelector('[data-prism-orb]');
    expect(orb).toBeTruthy();
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeTruthy();
    expect(canvas?.getAttribute('width')).toBe('120');
    expect(canvas?.getAttribute('height')).toBe('120');
    expect(canvas?.getAttribute('aria-label')).toBe('Prism orb, currently idle');
  });

  it('renders correctly with custom state and size', () => {
    const { container } = render(<PrismOrb state="speaking" size={200} />);
    const canvas = container.querySelector('canvas');
    expect(canvas?.getAttribute('width')).toBe('200');
    expect(canvas?.getAttribute('aria-label')).toBe('Prism orb, currently speaking');
  });
});
