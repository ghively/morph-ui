import { useState, useRef, useEffect } from 'react';
import './ScrollPinnedSequence.css';

export interface SequenceStep {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface ScrollPinnedSequenceProps {
  steps: SequenceStep[];
  className?: string;
}

export function ScrollPinnedSequence({ steps, className = '' }: ScrollPinnedSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 1 for current step

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || steps.length === 0) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // The container takes up multiple viewport heights
      const totalScrollableHeight = Math.max(0, rect.height - windowHeight);
      const currentScroll = -rect.top;

      if (currentScroll <= 0 || totalScrollableHeight === 0) {
        setActiveStepIndex(0);
        setProgress(0);
      } else if (currentScroll >= totalScrollableHeight) {
        setActiveStepIndex(steps.length - 1);
        setProgress(1);
      } else {
        const scrollFraction = currentScroll / totalScrollableHeight;
        // Map fraction to step
        const stepFraction = scrollFraction * steps.length;
        const index = Math.floor(stepFraction);
        
        setActiveStepIndex(Math.min(index, steps.length - 1));
        setProgress(stepFraction - index);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [steps.length]);

  return (
    <div 
      className={`scroll-pinned-sequence ${className}`} 
      ref={containerRef}
      style={{ height: `${steps.length * 100}vh` }}
      data-scroll-pinned-sequence=""
    >
      <div className="scroll-pinned-sequence-sticky">
        <div className="scroll-pinned-sequence-content">
          {steps.map((step, index) => {
            const isActive = index === activeStepIndex;
            const isPast = index < activeStepIndex;
            const isFuture = index > activeStepIndex;
            
            let translateY = 0;
            let opacity = 0;

            if (isActive) {
              translateY = -20 * (1 - progress); // slide up slightly
              opacity = 1;
            } else if (isPast) {
              translateY = -50;
              opacity = 0;
            } else if (isFuture) {
              translateY = 50;
              opacity = 0;
            }

            return (
              <div
                key={step.id}
                className="scroll-pinned-sequence-step"
                aria-hidden={!isActive}
                style={{
                  transform: `translateY(${translateY}px)`,
                  opacity: opacity,
                  pointerEvents: isActive ? 'auto' : 'none'
                }}
              >
                <div className="scroll-pinned-sequence-step-inner">
                   <h2 className="scroll-pinned-sequence-title">{step.title}</h2>
                   <div className="scroll-pinned-sequence-body">{step.content}</div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="scroll-pinned-sequence-indicators" aria-hidden="true">
           {steps.map((step, index) => (
             <div 
               key={`indicator-${step.id}`}
               className="scroll-pinned-sequence-indicator"
               data-active={index === activeStepIndex ? "true" : "false"}
               data-past={index < activeStepIndex ? "true" : "false"}
             />
           ))}
        </div>
      </div>
    </div>
  );
}
