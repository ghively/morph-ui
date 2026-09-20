import { useState, useRef, useEffect } from 'react';
import './ContextSwitcher.css';

export interface ContextSwitcherProps {
  current: string;
  options: string[];
  onChange?: (value: string) => void;
}

export function ContextSwitcher({ current, options, onChange }: ContextSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="context-switcher" ref={containerRef}>
      <button 
        className="context-switcher-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="context-switcher-label">{current}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <ul className="context-switcher-menu" role="listbox">
          {options.map(option => (
            <li 
              key={option}
              role="option"
              aria-selected={option === current}
              className={`context-switcher-item ${option === current ? 'selected' : ''}`}
              onClick={() => {
                onChange?.(option);
                setIsOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onChange?.(option);
                  setIsOpen(false);
                }
              }}
              tabIndex={0}
            >
              {option}
              {option === current && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="check-icon">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
