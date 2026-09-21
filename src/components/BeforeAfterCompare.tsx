import { useState, useRef, useEffect, useCallback, type KeyboardEvent, type MouseEvent, type TouchEvent } from 'react';
import './BeforeAfterCompare.css';

export interface BeforeAfterCompareProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  beforeLabel?: string;
  afterLabel?: string;
  initialPosition?: number; // 0 to 1
  className?: string;
}

export function BeforeAfterCompare({
  beforeImage,
  afterImage,
  beforeAlt = 'Before',
  afterAlt = 'After',
  beforeLabel,
  afterLabel,
  initialPosition = 0.5,
  className = ''
}: BeforeAfterCompareProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);

  const calculatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition(x / rect.width);
  }, []);

  const handlePointerDown = (e: MouseEvent | TouchEvent) => {
    setIsDragging(true);
    if ('touches' in e) {
      calculatePosition(e.touches[0].clientX);
    } else {
      calculatePosition(e.clientX);
    }
    // Prevent default to avoid text selection etc
    if (e.cancelable) e.preventDefault();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: globalThis.MouseEvent | globalThis.TouchEvent) => {
      if ('touches' in e) {
        calculatePosition(e.touches[0].clientX);
      } else {
        calculatePosition(e.clientX);
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, calculatePosition]);

  const handleKeyDown = (e: KeyboardEvent) => {
    const step = 0.05; // 5%
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setPosition((p) => Math.max(0, p - step));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setPosition((p) => Math.min(1, p + step));
    }
  };

  return (
    <div 
      className={`before-after-compare ${className}`} 
      ref={containerRef}
      data-before-after-compare=""
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
    >
      <div className="before-after-compare-image-container before-image">
        <img src={beforeImage} alt={beforeAlt} draggable="false" />
        {beforeLabel && (
          <div className="before-after-compare-label label-before">{beforeLabel}</div>
        )}
      </div>

      <div 
        className="before-after-compare-image-container after-image"
        style={{ clipPath: `inset(0 0 0 ${position * 100}%)` }}
      >
        <img src={afterImage} alt={afterAlt} draggable="false" />
        {afterLabel && (
          <div className="before-after-compare-label label-after">{afterLabel}</div>
        )}
      </div>

      <button
        ref={handleRef}
        type="button"
        className="before-after-compare-handle"
        style={{ left: `${position * 100}%` }}
        onKeyDown={handleKeyDown}
        aria-label="Compare slider"
        aria-valuenow={Math.round(position * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        role="slider"
      >
        <div className="before-after-compare-handle-line" />
        <div className="before-after-compare-handle-button">
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </button>
    </div>
  );
}
