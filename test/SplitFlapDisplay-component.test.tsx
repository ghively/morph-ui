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

describe('SplitFlapDisplay halves and alignment', () => {
  it('renders one glyph per half so each half shows its slice of a single character', () => {
    const { container } = render(<SplitFlapDisplay value="M" />);
    const top = container.querySelector('.flap-top .flap-glyph');
    const bottom = container.querySelector('.flap-bottom .flap-glyph');
    expect(top?.textContent).toBe('M');
    expect(bottom?.textContent).toBe('M');
  });

  it('pads after the value by default', () => {
    const { container } = render(<SplitFlapDisplay value="7" padLength={3} />);
    const chars = Array.from(container.querySelectorAll('.flap-bottom')).map((n) => n.textContent);
    expect(chars).toEqual(['7', ' ', ' ']);
  });

  it('pads before the value with align="end"', () => {
    const { container } = render(<SplitFlapDisplay value="249" padLength={6} align="end" />);
    const chars = Array.from(container.querySelectorAll('.flap-bottom')).map((n) => n.textContent);
    expect(chars).toEqual([' ', ' ', ' ', '2', '4', '9']);
    expect(container.querySelector('[data-split-flap-display]')?.getAttribute('data-align')).toBe('end');
  });
});
