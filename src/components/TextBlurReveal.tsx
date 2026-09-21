import { useState, useEffect, useRef } from 'react';
import './TextBlurReveal.css';

export interface TextBlurRevealProps {
  text: string;
  trigger?: 'mount' | 'scroll';
  mode?: 'character' | 'word';
  className?: string;
  staggerDelay?: number;
}

export function TextBlurReveal({
  text,
  trigger = 'mount',
  mode = 'character',
  className = '',
  staggerDelay = 30 // ms per item
}: TextBlurRevealProps) {
  const [isVisible, setIsVisible] = useState(trigger === 'mount' ? false : false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(isReduced);

    if (isReduced) {
      setIsVisible(true);
      return;
    }

    if (trigger === 'mount') {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else if (trigger === 'scroll') {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }
  }, [trigger]);

  const items = mode === 'word' ? text.split(' ') : text.split('');
  
  return (
    <div 
      data-text-blur-reveal 
      ref={containerRef} 
      className={`${className} ${isVisible ? 'is-visible' : ''}`}
      aria-label={text}
    >
      {items.map((item, index) => {
        const itemContent = mode === 'word' ? `${item}\u00A0` : (item === ' ' ? '\u00A0' : item);
        
        return (
          <span 
            key={index} 
            className="blur-item"
            style={
              !reducedMotion && isVisible 
                ? { animationDelay: `${index * staggerDelay}ms` } 
                : {}
            }
            aria-hidden="true"
          >
            {itemContent}
          </span>
        );
      })}
    </div>
  );
}
