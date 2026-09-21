import { useState, useEffect } from 'react';
import './TextFlip.css';

export interface TextFlipProps {
  /** The text value to display. */
  text: string;
  /** The direction of the flip animation. Default is 'vertical'. */
  direction?: 'vertical' | 'horizontal';
  /** The tag to use for the wrapper. Default is 'span'. */
  as?: keyof React.JSX.IntrinsicElements;
  /** Additional CSS class names. */
  className?: string;
}

export function TextFlip({
  text,
  direction = 'vertical',
  as: Component = 'span',
  className = '',
}: TextFlipProps) {
  const [currentText, setCurrentText] = useState(text);
  const [prevText, setPrevText] = useState(text);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (text !== currentText) {
      setPrevText(currentText);
      setCurrentText(text);
      setIsFlipping(true);
    }
  }, [text, currentText]);

  useEffect(() => {
    if (isFlipping) {
      const timer = window.setTimeout(() => {
        // Stop flipping visually (removes the class), but to prevent a backwards animation,
        // we need to set prevText = currentText, effectively making front = back
        setPrevText(currentText);
        setIsFlipping(false);
      }, 780); // Ensure it perfectly matches --d5 (780ms)
      
      return () => window.clearTimeout(timer);
    }
  }, [isFlipping, currentText]);

  return (
    <Component
      data-text-flip=""
      data-direction={direction}
      data-flipping={isFlipping ? '' : undefined}
      data-settled={!isFlipping ? '' : undefined}
      className={className}
      aria-label={text}
    >
      <span className="text-flip-sizer" aria-hidden="true">
        {currentText.length > prevText.length ? currentText : prevText}
      </span>
      <span className="text-flip-container" aria-hidden="true">
        <span className="text-flip-front">
          {prevText}
        </span>
        <span className="text-flip-back">
          {currentText}
        </span>
      </span>
    </Component>
  );
}
