import { useState, useEffect, useRef, type ReactNode, type PointerEvent as ReactPointerEvent } from 'react';
import './SwipeDeck.css';

export interface SwipeDeckProps {
  cards: ReactNode[];
  onSwipe?: (direction: 'left' | 'right', index: number) => void;
  className?: string;
}

export function SwipeDeck({ cards, onSwipe, className = '' }: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeAnimation, setSwipeAnimation] = useState<'left' | 'right' | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const startX = useRef(0);
  
  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (swipeAnimation || currentIndex >= cards.length) return;
    setIsDragging(true);
    startX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const offset = e.clientX - startX.current;
    setDragOffset(offset);
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    if (Math.abs(dragOffset) > 100) {
      const direction = dragOffset > 0 ? 'right' : 'left';
      swipe(direction);
    } else {
      setDragOffset(0);
    }
  };

  const swipe = (direction: 'left' | 'right') => {
    if (currentIndex >= cards.length) return;

    if (reducedMotion) {
      onSwipe?.(direction, currentIndex);
      setCurrentIndex((prev) => prev + 1);
      setDragOffset(0);
      return;
    }

    setSwipeAnimation(direction);
    onSwipe?.(direction, currentIndex);

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setSwipeAnimation(null);
      setDragOffset(0);
    }, 300);
  };

  if (currentIndex >= cards.length) {
    return (
      <div data-swipe-deck className={`deck-empty ${className}`}>
        No more cards
      </div>
    );
  }

  return (
    <div data-swipe-deck className={className}>
      {cards.map((card, idx) => {
        if (idx < currentIndex) return null;
        if (idx > currentIndex + 2) return null; // only render top 3

        const isTop = idx === currentIndex;
        const relativeIndex = idx - currentIndex;
        
        let style = {};
        let animationClass = '';

        if (isTop) {
          if (swipeAnimation) {
            animationClass = `swipe-${swipeAnimation}`;
          } else if (isDragging) {
            const rotate = dragOffset * 0.1;
            style = {
              transform: `translateX(${dragOffset}px) rotate(${rotate}deg)`,
              transition: 'none' // remove transition while dragging
            };
          }
        }

        return (
          <div
            key={idx}
            className={`swipe-card swipe-pos-${relativeIndex} ${animationClass}`}
            style={{ 
              zIndex: 10 - relativeIndex,
              ...style 
            }}
            onPointerDown={isTop ? handlePointerDown : undefined}
            onPointerMove={isTop ? handlePointerMove : undefined}
            onPointerUp={isTop ? handlePointerUp : undefined}
            onPointerCancel={isTop ? handlePointerUp : undefined}
            aria-hidden={!isTop}
          >
            {card}
          </div>
        );
      })}
    </div>
  );
}
