import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import './FeatureChipHopper.css';

export interface FeatureChip {
  id: string | number;
  content: ReactNode;
}

export interface FeatureChipHopperProps {
  chips: FeatureChip[];
  intervalMs?: number;
  className?: string;
}

export function FeatureChipHopper({
  chips,
  intervalMs = 2000,
  className = ''
}: FeatureChipHopperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (isPaused || chips.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % chips.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [chips.length, intervalMs, isPaused]);

  return (
    <div 
      className={`feature-chip-hopper ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      tabIndex={0}
      data-testid="feature-chip-hopper"
      aria-live="polite"
    >
      <div className="feature-chip-hopper-glass">
        {chips.map((chip, index) => {
          const isActive = index === currentIndex;
          const isLeaving = index === (currentIndex - 1 + chips.length) % chips.length;
          
          let stateClass = '';
          if (isActive) stateClass = 'is-active';
          else if (isLeaving) stateClass = 'is-leaving';
          else stateClass = 'is-waiting';

          return (
            <div 
              key={chip.id}
              className={`feature-chip ${stateClass}`}
              aria-hidden={!isActive}
              data-testid={`feature-chip-${chip.id}`}
            >
              {chip.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
