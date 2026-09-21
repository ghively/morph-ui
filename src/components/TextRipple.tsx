import { useState, useCallback, useEffect } from 'react';
import type { CSSProperties } from 'react';
import './TextRipple.css';

export interface TextRippleProps {
  /** The text to display and ripple */
  text: string;
  /** Whether the ripple should play on mount */
  playOnMount?: boolean;
  /** Whether clicking the text triggers the ripple */
  triggerOnClick?: boolean;
  /** Duration of the ripple animation per character (e.g. '0.6s') */
  duration?: string;
  /** Delay between each character's ripple start (e.g. '0.05s') */
  stagger?: string;
  className?: string;
  style?: CSSProperties;
}

export function TextRipple({
  text,
  playOnMount = false,
  triggerOnClick = true,
  duration = '0.6s',
  stagger = '0.05s',
  className = '',
  style,
}: TextRippleProps) {
  const [key, setKey] = useState(0);

  const triggerRipple = useCallback(() => {
    setKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (playOnMount) {
      triggerRipple();
    }
  }, [playOnMount, triggerRipple]);

  const chars = Array.from(text);

  return (
    <span
      className={`text-ripple-container ${className}`}
      style={{
        ...style,
        '--ripple-duration': duration,
        '--ripple-stagger': stagger,
      } as React.CSSProperties}
      onClick={triggerOnClick ? triggerRipple : undefined}
      data-text-ripple
      key={key} // Re-renders the component to restart animation when triggered
    >
      <span className="text-ripple-sr-only">{text}</span>
      <span aria-hidden="true" className="text-ripple-chars">
        {chars.map((char, index) => (
          <span
            key={index}
            className={`text-ripple-char ${char === ' ' ? 'is-space' : ''}`}
            style={{ '--char-index': index } as React.CSSProperties}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    </span>
  );
}
