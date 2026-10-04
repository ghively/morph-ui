import { useState, useEffect } from 'react';
import './SplitFlapDisplay.css';

export interface SplitFlapDisplayProps {
  value: string;
  className?: string;
  padLength?: number;
  /**
   * Which side the value hugs when `padLength` adds blank tiles.
   * 'start' (default) pads after the value; 'end' pads before it (right-aligned,
   * e.g. counters and prices).
   */
  align?: 'start' | 'end';
}

export function SplitFlapDisplay({ value, className = '', padLength, align = 'start' }: SplitFlapDisplayProps) {
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

  const pad = (str: string) =>
    padLength ? (align === 'end' ? str.padStart(padLength, ' ') : str.padEnd(padLength, ' ')) : str;
  const displayString = pad(currentValue);
  const nextDisplayString = pad(nextValue);

  const chars = displayString.split('');
  const nextChars = nextDisplayString.split('');
  
  // ensure same length for mapping
  const maxLength = Math.max(chars.length, nextChars.length);

  return (
    <div data-split-flap-display data-align={align} className={className} aria-label={`Display showing ${nextValue}`}>
      {Array.from({ length: maxLength }).map((_, index) => {
        const char = chars[index] || ' ';
        const nextChar = nextChars[index] || ' ';
        const charIsAnimating = isAnimating && char !== nextChar;

        return (
          <div key={`${index}-${char}`} className="flap-character" data-animating={charIsAnimating}>
            {/* Each half clips one full-height glyph: the top shows its upper
                half, the bottom shifts it up to show the lower half. */}
            <div className="flap-top"><span className="flap-glyph">{nextChar}</span></div>
            <div className="flap-bottom"><span className="flap-glyph">{char}</span></div>
            
            {charIsAnimating && (
              <>
                <div className="flap-top-fold"><span className="flap-glyph">{char}</span></div>
                <div className="flap-bottom-fold"><span className="flap-glyph">{nextChar}</span></div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
