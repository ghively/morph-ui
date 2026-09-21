import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import './SearchMorphInput.css';

export interface SearchMorphInputProps {
  prompts?: string[];
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchMorphInput({ 
  prompts = ["Search for anything...", "Ask AI a question...", "Find settings..."],
  onSearch,
  className = ''
}: SearchMorphInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState("");
  
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimerRef = useRef<number | null>(null);

  // Typewriter effect
  useEffect(() => {
    const currentPrompt = prompts[promptIndex];
    if (!currentPrompt) return;

    if (query) {
      setTypewriterText("");
      return; // Hide placeholder if user is typing
    }

    let i = 0;
    let isDeleting = false;
    
    const tick = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (prefersReducedMotion) {
        setTypewriterText(currentPrompt);
        return;
      }

      if (isDeleting) {
        setTypewriterText(currentPrompt.substring(0, i - 1));
        i--;
      } else {
        setTypewriterText(currentPrompt.substring(0, i + 1));
        i++;
      }

      let speed = isDeleting ? 30 : 100;

      if (!isDeleting && i === currentPrompt.length) {
        speed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && i === 0) {
        isDeleting = false;
        setPromptIndex((prev) => (prev + 1) % prompts.length);
        return; // Break cycle to let effect re-run with new prompt
      }

      typingTimerRef.current = window.setTimeout(tick, speed);
    };

    typingTimerRef.current = window.setTimeout(tick, 100);

    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, [promptIndex, prompts, query]);

  // Click outside to collapse
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (!query) {
          setIsExpanded(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [query]);

  const handleExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      // If already expanded and icon clicked, treat as search submit
      if (query && onSearch) {
        onSearch(query);
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query && onSearch) {
      onSearch(query);
    } else if (e.key === 'Escape') {
      if (query) {
        setQuery("");
      } else {
        setIsExpanded(false);
        inputRef.current?.blur();
      }
    }
  };

  return (
    <div className={`search-morph-container ${className}`} ref={containerRef} data-search-morph>
      <div className="search-morph-wrapper" data-expanded={isExpanded}>
        <div className="search-morph-rim" aria-hidden="true" />
        
        <button 
          className="search-morph-icon-btn" 
          onClick={handleExpand}
          aria-label={isExpanded ? "Submit search" : "Open search"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>

        <div className="search-morph-input-container">
          {!query && (
            <div className="search-morph-typewriter" aria-hidden="true">
              {typewriterText}
              <span style={{ borderRight: '2px solid currentColor', animation: 'blink 1s step-end infinite', marginLeft: '2px' }}>&nbsp;</span>
            </div>
          )}
          <input
            ref={inputRef}
            type="text"
            className="search-morph-input"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            aria-label="Search input"
            tabIndex={isExpanded ? 0 : -1}
          />
        </div>
      </div>
      
      {/* Hint Row */}
      <div className="search-morph-hint-row" aria-hidden={!isExpanded}>
        <div className="search-morph-hint-content">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          <span>Search powered by <span className="search-morph-wordmark">AI Mode</span></span>
        </div>
      </div>
      <style>{`
        @keyframes blink {
          50% { border-color: transparent; }
        }
      `}</style>
    </div>
  );
}
