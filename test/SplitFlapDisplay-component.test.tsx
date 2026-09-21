import './setup';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SplitFlapDisplay } from '../src/components/SplitFlapDisplay';

describe('SplitFlapDisplay', () => {
  it('renders initial value correctly', () => {
    const { container } = render(<SplitFlapDisplay value="DEP" />);
    const display = container.querySelector('[data-split-flap-display]');
    expect(display).toBeTruthy();
    expect(display?.getAttribute('aria-label')).toBe('Display showing DEP');
    
    const characters = container.querySelectorAll('.flap-character');
    expect(characters.length).toBe(3);
  });

  it('handles padding correctly', () => {
    const { container } = render(<SplitFlapDisplay value="A" padLength={3} />);
    const characters = container.querySelectorAll('.flap-character');
    expect(characters.length).toBe(3);
  });
});
