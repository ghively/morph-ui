import { type ReactNode, useEffect, useRef, useState } from 'react';
import './ScrollStackCards.css';

export interface ScrollStackCard {
  id: string;
  content: ReactNode;
}

export interface ScrollStackCardsProps {
  cards: ScrollStackCard[];
  className?: string;
  'data-testid'?: string;
}

export function ScrollStackCards({
  cards,
  className = '',
  'data-testid': testId,
}: ScrollStackCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far we are through the container
      // Start when top hits top of viewport
      // End when bottom hits bottom of viewport
      const start = rect.top;
      const totalScroll = rect.height - windowHeight;
      
      if (totalScroll <= 0) {
        setScrollProgress(0);
        return;
      }
      
      let progress = -start / totalScroll;
      progress = Math.max(0, Math.min(1, progress));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reducedMotion]);

  const numCards = cards.length;

  return (
    <div
      ref={containerRef}
      className={`scroll-stack-container ${className}`}
      data-testid={testId}
      style={{ height: reducedMotion ? 'auto' : `${numCards * 100}vh` }}
    >
      <div className="scroll-stack-sticky">
        <div className="scroll-stack-scene">
          {cards.map((card, i) => {
            if (reducedMotion) {
              return (
                 <div key={card.id} className="scroll-stack-card static-card">
                   {card.content}
                 </div>
              );
            }

            // progress goes 0 to 1 over the whole container.
            // each card (except first) takes 1/(numCards-1) of the scroll to come in and stack.
            const segment = numCards > 1 ? 1 / (numCards - 1) : 1;
            const startProgress = i * segment;
            const endProgress = (i + 1) * segment;
            
            // Local progress for this card's segment
            let localProgress = 0;
            if (scrollProgress > startProgress) {
               localProgress = Math.min(1, (scrollProgress - startProgress) / segment);
            }

            // Next cards progress for compressing current card
            let nextProgress = 0;
            if (i < numCards - 1 && scrollProgress > endProgress) {
               nextProgress = Math.min(1, (scrollProgress - endProgress) / segment);
            }

            // Active cards slide in from bottom
            let translateY = 100; // start 100% down
            if (i === 0) {
              translateY = 0; // First card is already there
            } else if (scrollProgress > startProgress) {
               translateY = 100 - (localProgress * 100);
            }
            
            // As next cards come in, current card scales down slightly and pushes back
            const scale = 1 - (nextProgress * 0.05);
            const zTranslate = -nextProgress * 50;

            const isVisible = scrollProgress >= (i - 1) * segment;

            return (
              <div
                key={card.id}
                className="scroll-stack-card"
                style={{
                  transform: `translateY(${translateY}%) translateZ(${zTranslate}px) scale(${scale})`,
                  opacity: isVisible ? 1 : 0,
                  visibility: isVisible ? 'visible' : 'hidden',
                  zIndex: i,
                }}
                data-testid={`card-${i}`}
              >
                {card.content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
