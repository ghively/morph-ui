import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import './TextWordFlip.css';

export interface TextWordFlipProps {
  /** Array of words to flip through */
  words: string[];
  /** Duration each word stays visible (ms) */
  interval?: number;
  /** Custom class name */
  className?: string;
  style?: CSSProperties;
}

export function TextWordFlip({
  words,
  interval = 2000,
  className = '',
  style,
}: TextWordFlipProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, interval);

    return () => clearInterval(timer);
  }, [words.length, interval]);

  if (!words || words.length === 0) return null;

  return (
    <span 
      className={`text-word-flip-container ${className}`}
      style={style}
      data-text-word-flip
      aria-label={words[currentIndex]}
    >
      <span className="text-word-flip-sr-only">
        {words.join(', ')}
      </span>
      <span className="text-word-flip-words" aria-hidden="true">
        {words.map((word, i) => {
          const isCurrent = i === currentIndex;
          // Determine if this word was just shown to play the flip-out animation
          const isPrevious = i === (currentIndex - 1 + words.length) % words.length;
          
          let stateClass = 'is-hidden';
          if (isCurrent) stateClass = 'is-entering';
          else if (isPrevious) stateClass = 'is-leaving';

          return (
            <span
              key={`${i}-${word}`}
              className={`text-word-flip-word ${stateClass}`}
            >
              {word}
            </span>
          );
        })}
      </span>
    </span>
  );
}
