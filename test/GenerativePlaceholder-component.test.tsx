import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GenerativePlaceholder } from '../src/components/GenerativePlaceholder';

describe('GenerativePlaceholder', () => {
  it('renders correctly with role progressbar', () => {
    render(<GenerativePlaceholder variant="text" />);
    const el = document.querySelectorAll('[role=progressbar]')[document.querySelectorAll('[role=progressbar]').length - 1] as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.getAttribute('aria-busy')).toBe('true');
    expect(el.classList.contains('gen-placeholder-text')).toBe(true);
  });

  it('renders all variants', () => {
    const variants = ['text', 'conversation', 'card', 'artifact', 'table', 'graph', 'agent'] as const;
    const { rerender } = render(<GenerativePlaceholder variant="text" />);
    
    for (const variant of variants) {
      rerender(<GenerativePlaceholder variant={variant} />);
      const el = document.querySelectorAll('[role=progressbar]')[document.querySelectorAll('[role=progressbar]').length - 1] as HTMLElement;
      expect(el.classList.contains(`gen-placeholder-${variant}`)).toBe(true);
    }
  });
});
