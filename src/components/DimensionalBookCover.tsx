import { useState, useRef } from 'react';
import type { ReactNode, MouseEvent as ReactMouseEvent } from 'react';
import './DimensionalBookCover.css';

export interface DimensionalBookCoverProps {
  coverContent: ReactNode;
  spineContent?: ReactNode;
  pageContent?: ReactNode;
  className?: string;
}

export function DimensionalBookCover({
  coverContent,
  spineContent,
  pageContent,
  className = ''
}: DimensionalBookCoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const bookRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (isOpen || !bookRef.current) return;
    const rect = bookRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Slight tilt for parallax
    setTilt({
      rotateX: -(y / rect.height) * 15,
      rotateY: (x / rect.width) * 15
    });
  };

  const handleMouseLeave = () => {
    if (isOpen) return;
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTilt({ rotateX: 0, rotateY: 0 });
    }
  };

  return (
    <div 
      className={`dimensional-book-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={toggleOpen}
      data-testid="dimensional-book-wrapper"
    >
      <div 
        className={`dimensional-book ${isOpen ? 'is-open' : ''}`}
        ref={bookRef}
        style={{
          transform: !isOpen ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)` : undefined
        }}
      >
        <div className="book-spine">
          {spineContent || <div className="book-spine-default"></div>}
        </div>
        <div className="book-back"></div>
        <div className="book-pages-side"></div>
        <div className="book-pages-bottom"></div>
        <div className="book-inside">
          <div className="book-page">
             {pageContent || <div className="book-page-default"></div>}
          </div>
        </div>
        <div className="book-cover">
          <div className="book-cover-content">
            {coverContent}
          </div>
          <div className="book-specular-highlight"></div>
        </div>
      </div>
    </div>
  );
}
