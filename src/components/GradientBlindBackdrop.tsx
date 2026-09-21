import { useEffect, useState } from 'react';
import './GradientBlindBackdrop.css';

export interface GradientBlindBackdropProps {
  state?: 'idle' | 'active';
  scrollTarget?: React.RefObject<HTMLElement | null>;
  className?: string;
}

export function GradientBlindBackdrop({ 
  state = 'idle', 
  scrollTarget,
  className = ''
}: GradientBlindBackdropProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const target = scrollTarget?.current || window;
    
    const handleScroll = (e: Event) => {
      if (target === window) {
        setScrollY(window.scrollY);
      } else {
        setScrollY((e.target as HTMLElement).scrollTop);
      }
    };

    target.addEventListener('scroll', handleScroll, { passive: true });
    return () => target.removeEventListener('scroll', handleScroll);
  }, [scrollTarget]);

  // Map scroll to slight rotations
  const scrollOffset1 = scrollY * 0.05;
  const scrollOffset2 = scrollY * -0.03;
  const scrollOffset3 = scrollY * 0.02;

  return (
    <div 
      className={`gradient-blind-backdrop ${className}`} 
      data-state={state}
      aria-hidden="true"
    >
      <div 
        className="gradient-blind-layer gradient-blind-layer-1" 
        style={state === 'idle' ? { transform: `rotate(${scrollOffset1}deg)` } : undefined}
      />
      <div 
        className="gradient-blind-layer gradient-blind-layer-2" 
        style={state === 'idle' ? { transform: `rotate(${5 + scrollOffset2}deg) translateY(-2%)` } : undefined}
      />
      <div 
        className="gradient-blind-layer gradient-blind-layer-3"
        style={state === 'idle' ? { transform: `rotate(${-5 + scrollOffset3}deg) translateY(2%)` } : undefined}
      />
    </div>
  );
}
