import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import './FollowCursorLabel.css';

export interface FollowCursorLabelProps {
  label: ReactNode;
  targetSelector: string; // CSS selector for hover targets
  className?: string;
}

export function FollowCursorLabel({
  label,
  targetSelector,
  className = ''
}: FollowCursorLabelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Check reduced motion early
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    // Detect touch device - hide for touch
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      return;
    }

    const targets = document.querySelectorAll(targetSelector);
    
    let currentTarget: Element | null = null;
    let requestRef: number;
    // Spring physics state
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    
    // Simple spring constants
    const stiffness = 0.1;
    const damping = 0.8;
    let velocityX = 0;
    let velocityY = 0;

    const animate = () => {
      // Calculate spring
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      
      const ax = dx * stiffness;
      const ay = dy * stiffness;
      
      velocityX = (velocityX + ax) * damping;
      velocityY = (velocityY + ay) * damping;
      
      currentX += velocityX;
      currentY += velocityY;
      
      setPosition({ x: currentX, y: currentY });
      requestRef = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      // If we just entered, snap immediately to avoid long travel
      if (!currentTarget) {
        currentX = targetX;
        currentY = targetY;
        setPosition({ x: currentX, y: currentY });
      }
    };

    const handleMouseEnter = (e: Event) => {
      currentTarget = e.currentTarget as Element;
      setIsVisible(true);
      // Initialize position based on current mouse, if available (often not in this event directly)
      // The mousemove handler will catch it quickly
    };

    const handleMouseLeave = () => {
      currentTarget = null;
      setIsVisible(false);
    };

    targets.forEach(target => {
      target.addEventListener('mouseenter', handleMouseEnter);
      target.addEventListener('mouseleave', handleMouseLeave);
      target.addEventListener('mousemove', handleMouseMove as EventListener);
    });
    
    requestRef = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(requestRef);
      targets.forEach(target => {
        target.removeEventListener('mouseenter', handleMouseEnter);
        target.removeEventListener('mouseleave', handleMouseLeave);
        target.removeEventListener('mousemove', handleMouseMove as EventListener);
      });
    };
  }, [targetSelector]);

  return (
    <div
      className={`follow-cursor-label ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`
      }}
      aria-hidden="true"
      data-testid="follow-cursor-label"
    >
      {label}
    </div>
  );
}
