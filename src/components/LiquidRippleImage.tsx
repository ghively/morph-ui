import { useState, useRef, useCallback } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import './LiquidRippleImage.css';

export interface LiquidRippleImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function LiquidRippleImage({ src, alt, className = '' }: LiquidRippleImageProps) {
  const [ripplePos, setRipplePos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // In JSDOM getBoundingClientRect returns 0 for all properties, fallback gracefully
    if (rect.width === 0 && rect.height === 0) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setRipplePos({ x, y });
  }, []);

  // For testing, since getBoundingClientRect is 0, we can also expose a way to test or just know that 
  // JSDOM won't trigger the filter meaningfully. The fallback prevents divide by 0.

  return (
    <div 
      className={`liquid-ripple-container ${className}`} 
      ref={containerRef}
      onPointerMove={handlePointerMove}
      data-liquid-ripple-image
      style={{
        '--ripple-x': `${ripplePos.x}%`,
        '--ripple-y': `${ripplePos.y}%`
      } as React.CSSProperties}
    >
      <img src={src} alt={alt} className="liquid-ripple-img" />
      <svg className="liquid-ripple-svg" width="0" height="0">
        <filter id="liquid-ripple-filter">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.015" 
            numOctaves="3" 
            result="noise" 
          />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            scale="20" 
            xChannelSelector="R" 
            yChannelSelector="G" 
          />
        </filter>
      </svg>
      <div className="liquid-ripple-overlay" aria-hidden="true" />
    </div>
  );
}
