import { useState, useEffect, useRef } from 'react';
import './TextCycle.css';

export interface TextCycleProps {
  /** The list of words or phrases to cycle through. */
  items: string[];
  /** The interval between cycles in milliseconds. Default is 2000. */
  interval?: number;
  /** Whether the cycle should pause on hover. Default is true. */
  pauseOnHover?: boolean;
  /** The tag to use for the wrapper. Default is 'span'. */
  as?: keyof React.JSX.IntrinsicElements;
  /** Additional CSS class names. */
  className?: string;
}

export function TextCycle({
  items,
  interval = 2000,
  pauseOnHover = true,
  as: Component = 'span',
  className = '',
}: TextCycleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (items.length <= 1) return;

    if (isHovered && pauseOnHover) {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
      return;
    }

    timerRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [items.length, interval, isHovered, pauseOnHover]);

  return (
    <Component
      data-text-cycle=""
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-live="polite"
    >
      <span className="text-cycle-sizer" aria-hidden="true">
        {/* Render all items to maintain maximum width if needed, or just longest? 
            Here we render all invisibly to ensure the container is as wide as the widest item */}
        {items.map((item, idx) => (
          <span key={idx} style={{ display: 'block', height: 0, overflow: 'hidden' }}>
            {item}
          </span>
        ))}
        <span style={{ visibility: 'hidden' }}>
          {items[currentIndex]}
        </span>
      </span>
      
      <span className="text-cycle-items">
        {items.map((item, index) => {
          const isActive = index === currentIndex;
          const isPrev = index === (currentIndex - 1 + items.length) % items.length;
          
          let state = 'idle';
          if (isActive) state = 'active';
          else if (isPrev) state = 'prev';

          return (
            <span
              key={index}
              data-text-cycle-item=""
              data-state={state}
              aria-hidden={!isActive}
            >
              {item}
            </span>
          );
        })}
      </span>
    </Component>
  );
}
