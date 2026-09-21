import './setup';
import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CardDeckReveal } from '../src/components/CardDeckReveal';

describe('CardDeckReveal', () => {
  it('renders cards and shows first card initially', () => {
    const { container } = render(
      <CardDeckReveal cards={[
        <div key="1">Card 1</div>,
        <div key="2">Card 2</div>,
        <div key="3">Card 3</div>
      ]} autoAdvanceInterval={0} />
    );
    
    const deck = container.querySelector('[data-card-deck-reveal]');
    expect(deck).toBeTruthy();
    
    const cards = container.querySelectorAll('.deck-card');
    expect(cards.length).toBe(3);
    
    const frontCard = container.querySelector('.card-pos-0');
    expect(frontCard?.textContent).toBe('Card 1');
  });

  it('advances to next card on click', () => {
    const { container } = render(
      <CardDeckReveal cards={[
        <div key="1">Card 1</div>,
        <div key="2">Card 2</div>,
        <div key="3">Card 3</div>
      ]} autoAdvanceInterval={0} />
    );
    
    const deck = container.querySelector('[data-card-deck-reveal]');
    fireEvent.click(deck!);
    
    // The click should initiate the animation, meaning the first card gets the animating out class
    const frontCard = container.querySelector('.card-pos-0');
    expect(frontCard?.classList.contains('card-animating-out')).toBe(true);
  });
});
