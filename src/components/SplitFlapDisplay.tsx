import { useState, useEffect } from 'react';
import './SplitFlapDisplay.css';

export interface SplitFlapDisplayProps {
  value: string;
  className?: string;
  padLength?: number;
}

export function SplitFlapDisplay({ value, className = '', padLength }: SplitFlapDisplayProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const [nextValue, setNextValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    if (value !== nextValue) {
      if (reducedMotion) {
        setCurrentValue(value);
        setNextValue(value);
      } else {
        setNextValue(value);
        setIsAnimating(true);
      }
    }
  }, [value, nextValue, reducedMotion]);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setCurrentValue(nextValue);
        setIsAnimating(false);
      }, 300); // matches --d3 or similar animation duration
      return () => clearTimeout(timer);
    }
  }, [isAnimating, nextValue]);

  const displayString = padLength ? currentValue.padEnd(padLength, ' ') : currentValue;
  const nextDisplayString = padLength ? nextValue.padEnd(padLength, ' ') : nextValue;

  const chars = displayString.split('');
  const nextChars = nextDisplayString.split('');
  
  // ensure same length for mapping
  const maxLength = Math.max(chars.length, nextChars.length);

  return (
    <div data-split-flap-display className={className} aria-label={`Display showing ${nextValue}`}>
      {Array.from({ length: maxLength }).map((_, index) => {
        const char = chars[index] || ' ';
        const nextChar = nextChars[index] || ' ';
        const charIsAnimating = isAnimating && char !== nextChar;

        return (
          <div key={`${index}-${char}`} className="flap-character" data-animating={charIsAnimating}>
            <div className="flap-top">{nextChar}</div>
            <div className="flap-bottom">{char}</div>
            
            {charIsAnimating && (
              <>
                <div className="flap-top-fold">{char}</div>
                <div className="flap-bottom-fold">{nextChar}</div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
