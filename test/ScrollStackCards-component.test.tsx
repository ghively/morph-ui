import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { ScrollStackCards } from '../src/components/ScrollStackCards';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe('ScrollStackCards', () => {
  const cards = [
    { id: '1', content: <div>Card 1</div> },
    { id: '2', content: <div>Card 2</div> },
    { id: '3', content: <div>Card 3</div> },
  ];

  it('renders correctly', () => {
    render(<ScrollStackCards cards={cards} />);
    expect(screen.getByText('Card 1')).toBeTruthy();
    expect(screen.getByText('Card 2')).toBeTruthy();
    expect(screen.getByText('Card 3')).toBeTruthy();
  });

  it('updates transforms on scroll', () => {
    const { container } = render(<ScrollStackCards cards={cards} />);
    
    const containerDiv = container.firstChild as HTMLElement;
    // Mock getBoundingClientRect
    containerDiv.getBoundingClientRect = vi.fn().mockReturnValue({
      top: -1000, // Scrolled halfway
      height: 3000, // 300vh assuming window height 1000
    });
    
    Object.defineProperty(window, 'innerHeight', { value: 1000, writable: true });
    
    // Trigger scroll
    fireEvent.scroll(window);
    
    const card0 = screen.getByTestId('card-0');
    // First card should be scaling down as card 1 comes in
    expect(card0.getAttribute('style')).toContain('scale(');
  });

  it('respects reduced motion', () => {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(<ScrollStackCards cards={cards} />);
    const card = screen.getByText('Card 1').parentElement;
    expect(card?.classList.contains('static-card')).toBe(true);
  });
});
