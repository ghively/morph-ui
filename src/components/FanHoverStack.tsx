import { useState } from 'react';
import type { ReactNode, KeyboardEvent as ReactKeyboardEvent } from 'react';
import './FanHoverStack.css';

export interface FanHoverStackItem {
  id: string | number;
  content: ReactNode;
}

export interface FanHoverStackProps {
  items: FanHoverStackItem[];
  className?: string;
}

export function FanHoverStack({ items, className = '' }: FanHoverStackProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleKeyDown = (e: ReactKeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setHoveredIndex(hoveredIndex === index ? null : index);
    }
  };

  return (
    <div 
      className={`fan-hover-stack ${className} ${hoveredIndex !== null ? 'is-fanned' : ''}`}
      onMouseLeave={() => setHoveredIndex(null)}
      data-testid="fan-hover-stack"
    >
      {items.map((item, index) => {
        // Calculate spread
        const total = items.length;
        const offset = index - (total - 1) / 2; // -1 to 1 for 3 items
        
        const rotation = offset * 15; // deg
        const translateX = offset * 40; // px
        const translateY = Math.abs(offset) * 10; // px drop for side cards
        
        const isHovered = hoveredIndex === index;
        
        return (
          <div
            key={item.id}
            className={`fan-hover-stack-item ${isHovered ? 'is-active' : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onFocus={() => setHoveredIndex(index)}
            onBlur={() => setHoveredIndex(null)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            tabIndex={0}
            data-testid={`fan-hover-stack-item-${item.id}`}
            style={{
              '--spread-rotate': `${rotation}deg`,
              '--spread-x': `${translateX}px`,
              '--spread-y': `${translateY}px`,
              zIndex: isHovered ? total + 1 : total - index
            } as React.CSSProperties}
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
}
