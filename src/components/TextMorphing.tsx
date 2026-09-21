import { useState, useEffect, useId } from 'react';
import './TextMorphing.css';

export interface TextMorphingProps {
  /** The text value to morph to. */
  text: string;
  /** The tag to use for the wrapper. Default is 'span'. */
  as?: keyof React.JSX.IntrinsicElements;
  /** Additional CSS class names. */
  className?: string;
}

export function TextMorphing({
  text,
  as: Component = 'span',
  className = '',
}: TextMorphingProps) {
  const [currentText, setCurrentText] = useState(text);
  const [prevText, setPrevText] = useState(text);
  const [isMorphing, setIsMorphing] = useState(false);
  const baseId = useId();
  const filterId = `text-morphing-blur-${baseId.replace(/:/g, '')}`;

  useEffect(() => {
    if (text !== currentText) {
      setPrevText(currentText);
      setCurrentText(text);
      setIsMorphing(true);
    }
  }, [text, currentText]);

  useEffect(() => {
    if (isMorphing) {
      const timer = window.setTimeout(() => {
        setIsMorphing(false);
      }, 780); // matches --d5
      return () => window.clearTimeout(timer);
    }
  }, [isMorphing]);

  return (
    <Component
      data-text-morphing=""
      data-morphing={isMorphing ? '' : undefined}
      className={className}
      aria-label={text}
    >
      <span className="text-morphing-sizer" aria-hidden="true">
        {currentText.length > prevText.length ? currentText : prevText}
      </span>
      <span className="text-morphing-container" aria-hidden="true">
        <svg width="0" height="0" className="text-morphing-filter">
          <defs>
            <filter id={filterId}>
              <feGaussianBlur in="SourceGraphic" stdDeviation="0" result="blur">
                {isMorphing && (
                  <animate
                    attributeName="stdDeviation"
                    values="0;4;0"
                    dur="780ms"
                    calcMode="spline"
                    keySplines="0.38 1.21 0.22 1; 0.38 1.21 0.22 1"
                  />
                )}
              </feGaussianBlur>
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <span className="text-morphing-content" style={{ filter: `url(#${filterId})` }}>
          <span className="text-morphing-prev">{prevText}</span>
          <span className="text-morphing-curr">{currentText}</span>
        </span>
      </span>
    </Component>
  );
}
