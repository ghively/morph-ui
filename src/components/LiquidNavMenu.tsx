import { useState, useRef, useEffect } from 'react';
import type { ReactNode, KeyboardEvent } from 'react';
import './LiquidNavMenu.css';

export interface LiquidNavActionProps {
  id: string;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

export interface LiquidNavMenuProps {
  actions: LiquidNavActionProps[];
  triggerIcon?: ReactNode;
  className?: string;
  'aria-label'?: string;
}

export function LiquidNavMenu({ 
  actions, 
  triggerIcon, 
  className = '', 
  'aria-label': ariaLabel = 'Menu' 
}: LiquidNavMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const actionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
        triggerRef.current?.focus();
      }
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node) && isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const toggleMenu = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isExpanded) {
        setIsExpanded(true);
      } else {
        // Focus last item (closest to trigger visually if it's at the bottom)
        const targetIndex = e.key === 'ArrowUp' ? actions.length - 1 : 0;
        actionRefs.current[targetIndex]?.focus();
      }
    }
  };

  const handleActionKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (index > 0) {
        actionRefs.current[index - 1]?.focus();
      } else {
        triggerRef.current?.focus();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (index < actions.length - 1) {
        actionRefs.current[index + 1]?.focus();
      } else {
        triggerRef.current?.focus();
      }
    }
  };

  const defaultTriggerIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );

  return (
    <div className={`liquid-nav-menu-container ${className}`} ref={containerRef} data-liquid-nav>
      {/* Invisible SVG filter for gooey effect */}
      <svg className="liquid-nav-svg-filters" aria-hidden="true">
        <defs>
          <filter id="liquid-nav-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div className="liquid-nav-menu" data-expanded={isExpanded}>
        <div className="liquid-nav-actions" role="menu" aria-orientation="vertical">
          {actions.map((action, i) => {
            // Reverse index for delay so items closest to trigger move first
            const reverseIndex = actions.length - 1 - i;
            // E.g. d1, d2 are tokens, we can just use inline calc or simple values
            const delay = isExpanded ? `${reverseIndex * 50}ms` : '0ms';
            
            return (
              <button
                key={action.id}
                ref={(el) => { actionRefs.current[i] = el; }}
                className="liquid-nav-action"
                role="menuitem"
                aria-label={action.label}
                title={action.label}
                onClick={() => {
                  action.onClick();
                  setIsExpanded(false);
                }}
                onKeyDown={(e) => handleActionKeyDown(e, i)}
                tabIndex={isExpanded ? 0 : -1}
                style={{ transitionDelay: delay }}
              >
                {action.icon}
              </button>
            );
          })}
        </div>

        <button
          ref={triggerRef}
          className="liquid-nav-trigger"
          aria-expanded={isExpanded}
          aria-haspopup="menu"
          aria-label={ariaLabel}
          onClick={toggleMenu}
          onKeyDown={handleTriggerKeyDown}
        >
          <span className="liquid-nav-trigger-icon">
            {triggerIcon || defaultTriggerIcon}
          </span>
        </button>
      </div>
    </div>
  );
}
