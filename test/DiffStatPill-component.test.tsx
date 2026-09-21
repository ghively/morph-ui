import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DiffStatPill } from '../src/components/DiffStatPill';

describe('DiffStatPill', () => {
  it('renders numbers and data attributes', () => {
    const { container } = render(<DiffStatPill added={123} removed={45} />);
    
    expect(screen.getByText('+123')).toBeTruthy();
    expect(screen.getByText('−45')).toBeTruthy(); // Using minus sign, not hyphen
    
    const pill = container.querySelector('[data-diff-stat-pill]');
    expect(pill?.getAttribute('data-added')).toBe('123');
    expect(pill?.getAttribute('data-removed')).toBe('45');
  });

  it('renders filename if provided', () => {
    render(<DiffStatPill added={10} removed={5} fileName="src/index.ts" />);
    expect(screen.getByText('src/index.ts')).toBeTruthy();
  });

  it('scales bars correctly', () => {
    const { container } = render(<DiffStatPill added={50} removed={50} max={200} />);
    
    const addedBar = container.querySelector('[data-diff-stat-bar="added"]') as HTMLElement;
    const removedBar = container.querySelector('[data-diff-stat-bar="removed"]') as HTMLElement;
    
    expect(addedBar.style.width).toBe('25%'); // 50 / 200
    expect(removedBar.style.width).toBe('25%'); // 50 / 200
  });

  it('handles zero values without error', () => {
    const { container } = render(<DiffStatPill added={0} removed={0} />);
    
    const addedBar = container.querySelector('[data-diff-stat-bar="added"]');
    const removedBar = container.querySelector('[data-diff-stat-bar="removed"]');
    
    expect(addedBar).toBeNull();
    expect(removedBar).toBeNull();
  });
});
