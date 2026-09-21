import { useState, useCallback } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import './DragIntroOrb.css';

export interface DragIntroOrbProps {
  onEnter?: () => void;
  className?: string;
  skipLabel?: string;
  dragThreshold?: number; // How far to drag up to enter
}

export function DragIntroOrb({ 
  onEnter, 
  className = '', 
  skipLabel = 'Skip Intro',
  dragThreshold = -150
}: DragIntroOrbProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ y: 0 });
  const [isEntered, setIsEntered] = useState(false);
  
  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (isEntered) return;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || isEntered) return;
    
    // Calculate new position
    const newY = Math.min(0, position.y + e.movementY); 
    setPosition({ y: newY });
    
    // Check if threshold met
    if (newY <= dragThreshold) {
      setIsDragging(false);
      setIsEntered(true);
      if (onEnter) onEnter();
    }
  }, [isDragging, isEntered, position.y, dragThreshold, onEnter]);

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || isEntered) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    
    // Spring back
    setPosition({ y: 0 });
  };

  const handleSkip = () => {
    setIsEntered(true);
    if (onEnter) onEnter();
  };

  return (
    <div className={`drag-intro-container ${isEntered ? 'entered' : ''} ${className}`} data-drag-intro-orb>
      <div 
        className={`drag-orb ${isDragging ? 'dragging' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ transform: `translateY(${position.y}px)` }}
        aria-label="Drag orb to enter"
        role="button"
        tabIndex={0}
      >
        <div className="orb-shine"></div>
        <div className="orb-distortion"></div>
      </div>
      
      {!isEntered && (
        <button className="drag-intro-skip" onClick={handleSkip}>
          {skipLabel}
        </button>
      )}
    </div>
  );
}
