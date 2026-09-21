import { useState, useEffect, useRef } from "react";
import type { ReactNode } from 'react';
import './BloomSheet.css';

export interface BloomSheetProps {
  triggerLabel: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export function BloomSheet({ triggerLabel, title, children, className = '' }: BloomSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Optional: Prevent background scrolling when open
      document.body.style.overflow = 'hidden';
      // Focus management
      setTimeout(() => closeRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOpen = () => setIsOpen(true);
  
  const handleClose = () => {
    setIsOpen(false);
    // Return focus to trigger after closing
    setTimeout(() => triggerRef.current?.focus(), 50);
  };

  return (
    <div className={`bloom-sheet-container ${className}`} data-open={isOpen} data-bloom-sheet>
      <button
        ref={triggerRef}
        className="bloom-sheet-trigger"
        onClick={handleOpen}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        {triggerLabel}
      </button>

      {/* Scrim */}
      <div 
        className="bloom-sheet-scrim" 
        aria-hidden="true" 
        onClick={handleClose}
      />

      {/* Panel */}
      <div 
        ref={panelRef}
        className="bloom-sheet-panel" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="bloom-sheet-title"
        tabIndex={-1}
      >
        <div className="bloom-sheet-header">
          <h2 id="bloom-sheet-title" className="bloom-sheet-title">{title}</h2>
          <button 
            ref={closeRef}
            className="bloom-sheet-close" 
            onClick={handleClose}
            aria-label="Close panel"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="bloom-sheet-content">
          {children}
        </div>
      </div>
    </div>
  );
}
