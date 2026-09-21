import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InfiniteMarquee } from '../src/components/InfiniteMarquee';

describe('InfiniteMarquee', () => {
  it('renders children and a duplicate for the loop', () => {
    render(
      <InfiniteMarquee>
        <div data-testid="item">Item 1</div>
        <div data-testid="item">Item 2</div>
      </InfiniteMarquee>
    );
    
    // 2 original + 2 duplicate
    const items = screen.getAllByTestId('item');
    expect(items.length).toBe(4);
  });

  it('applies custom speed and gap as inline styles', () => {
    const { container } = render(
      <InfiniteMarquee speed="10s" gap="20px">
        <span>Test</span>
      </InfiniteMarquee>
    );
    
    const containerEl = container.firstChild as HTMLElement;
    expect(containerEl.style.getPropertyValue('--marquee-speed')).toBe('10s');
    expect(containerEl.style.getPropertyValue('--marquee-gap')).toBe('20px');
  });
});
