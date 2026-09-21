import { useState, useRef, useEffect } from 'react';
import type { ReactNode, KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';
import './CoverFlowCarousel.css';

export interface CoverFlowItem {
  id: string | number;
  content: ReactNode;
}

export interface CoverFlowCarouselProps {
  items: CoverFlowItem[];
  className?: string;
  mirroredFloor?: boolean;
}

export function CoverFlowCarousel({
  items,
  className = '',
  mirroredFloor = false
}: CoverFlowCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const total = items.length;

  const navigate = (direction: 'next' | 'prev') => {
    if (direction === 'next' && activeIndex < total - 1) {
      setActiveIndex(activeIndex + 1);
    } else if (direction === 'prev' && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      navigate('next');
    } else if (e.key === 'ArrowLeft') {
      navigate('prev');
    }
  };

  // Basic drag to navigate
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const diffX = e.clientX - startX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        navigate('prev');
      } else {
        navigate('next');
      }
      setIsDragging(false);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div
      className={`cover-flow-carousel ${className} ${mirroredFloor ? 'has-mirror' : ''}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      data-testid="cover-flow-carousel"
    >
      <div className="cover-flow-track" ref={trackRef}>
        {items.map((item, index) => {
          const distance = index - activeIndex;
          const isCenter = distance === 0;
          const isLeft = distance < 0;
          const isRight = distance > 0;
          
          const translateZ = Math.abs(distance) * -100;
          const translateX = distance * 60; // Spread
          let rotateY = 0;
          
          if (isLeft) rotateY = 45;
          if (isRight) rotateY = -45;

          return (
            <div
              key={item.id}
              className={`cover-flow-item ${isCenter ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
                zIndex: total - Math.abs(distance)
              }}
              data-testid={`cover-flow-item-${index}`}
            >
              <div className="cover-flow-item-content">
                {item.content}
              </div>
              {mirroredFloor && (
                <div className="cover-flow-item-reflection">
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="cover-flow-controls">
        <button 
          onClick={() => navigate('prev')} 
          disabled={activeIndex === 0}
          aria-label="Previous"
        >
          ‹
        </button>
        <span className="cover-flow-indicator">{activeIndex + 1} / {total}</span>
        <button 
          onClick={() => navigate('next')} 
          disabled={activeIndex === total - 1}
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </div>
  );
}
