import { useState, useEffect, type ReactNode } from 'react';
import './CardDeckReveal.css';

export interface CardDeckRevealProps {
  cards: ReactNode[];
  autoAdvanceInterval?: number;
  className?: string;
}

export function CardDeckReveal({ 
  cards, 
  autoAdvanceInterval = 3000,
  className = '' 
}: CardDeckRevealProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animatingOut, setAnimatingOut] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (!autoAdvanceInterval) return;

    const timer = setInterval(() => {
      handleNext();
    }, autoAdvanceInterval);

    return () => clearInterval(timer);
  }, [autoAdvanceInterval, currentIndex, cards.length, reducedMotion]);

  const handleNext = () => {
    if (cards.length <= 1) return;
    
    if (reducedMotion) {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
      return;
    }

    setAnimatingOut(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
      setAnimatingOut(false);
    }, 500); // Wait for the drop away animation
  };

  if (!cards || cards.length === 0) return null;

  return (
    <div data-card-deck-reveal className={className} onClick={handleNext}>
      {cards.map((card, idx) => {
        // Calculate relative position. 0 is front, 1 is behind, 2 is behind that, etc.
        let relativeIndex = idx - currentIndex;
        if (relativeIndex < 0) {
          relativeIndex += cards.length;
        }

        const isFront = relativeIndex === 0;
        const isAnimatingOut = isFront && animatingOut;

        // If it's more than 3 cards back, hide it
        if (relativeIndex > 2 && !isAnimatingOut) {
          return null;
        }
        
        const zIndex = 10 - relativeIndex;
        let animationClass = '';
        
        if (isAnimatingOut) {
          animationClass = 'card-animating-out';
        } else if (animatingOut && relativeIndex > 0) {
          animationClass = `card-promoting-to-${relativeIndex - 1}`;
        }

        return (
          <div 
            key={idx} 
            className={`deck-card card-pos-${relativeIndex} ${animationClass}`}
            style={{ zIndex }}
            aria-hidden={!isFront}
          >
            {card}
          </div>
        );
      })}
    </div>
  );
}
