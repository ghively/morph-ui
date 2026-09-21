import './setup';
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SwipeDeck } from '../src/components/SwipeDeck';

describe('SwipeDeck', () => {
  it('renders correctly', () => {
    const { container } = render(
      <SwipeDeck cards={[<div key="1">Card 1</div>, <div key="2">Card 2</div>]} />
    );
    const deck = container.querySelector('[data-swipe-deck]');
    expect(deck).toBeTruthy();
    
    const cards = container.querySelectorAll('.swipe-card');
    expect(cards.length).toBe(2);
  });

  it('handles drag and swipe logic', () => {
    const mockOnSwipe = vi.fn();
    const { container } = render(
      <SwipeDeck 
        cards={[<div key="1">Card 1</div>, <div key="2">Card 2</div>]} 
        onSwipe={mockOnSwipe}
      />
    );
    
    const frontCard = container.querySelector('.swipe-pos-0');
    expect(frontCard).toBeTruthy();

    if (frontCard) {
      fireEvent.pointerDown(frontCard, { clientX: 100, pointerId: 1 });
      fireEvent.pointerMove(frontCard, { clientX: 250, pointerId: 1 }); // dragged 150px right
      fireEvent.pointerUp(frontCard, { clientX: 250, pointerId: 1 });
    }

    expect(mockOnSwipe).toHaveBeenCalledWith('right', 0);
    // After swipe initiation, card should have animation class
    expect(frontCard?.classList.contains('swipe-right')).toBe(true);
  });
});
