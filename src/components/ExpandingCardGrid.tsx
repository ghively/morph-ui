import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import './ExpandingCardGrid.css';

export interface ExpandingCardItem {
  id: string | number;
  thumbnail: ReactNode;
  content: ReactNode;
}

export interface ExpandingCardGridProps {
  items: ExpandingCardItem[];
  className?: string;
}

export function ExpandingCardGrid({ items, className = '' }: ExpandingCardGridProps) {
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expandedId !== null) {
        setExpandedId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedId]);

  return (
    <div className={`expanding-card-grid ${className}`} data-testid="expanding-card-grid">
      {items.map((item) => {
        const isExpanded = item.id === expandedId;
        const isCollapsed = expandedId !== null && !isExpanded;

        return (
          <div
            key={item.id}
            className={`expanding-card ${isExpanded ? 'is-expanded' : ''} ${isCollapsed ? 'is-collapsed' : ''}`}
            onClick={() => setExpandedId(isExpanded ? null : item.id)}
            data-testid={`expanding-card-${item.id}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setExpandedId(isExpanded ? null : item.id);
              }
            }}
            aria-expanded={isExpanded}
          >
            <div className="expanding-card-inner">
              <div className="expanding-card-thumbnail" aria-hidden={isExpanded}>
                {item.thumbnail}
              </div>
              <div className="expanding-card-content" aria-hidden={!isExpanded}>
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
