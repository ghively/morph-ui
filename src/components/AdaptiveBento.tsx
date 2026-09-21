import type { ReactNode } from 'react';
import './AdaptiveBento.css';

export interface AdaptiveBentoItem {
  id: string;
  span?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
  node: ReactNode;
}

export interface AdaptiveBentoProps {
  /**
   * Array of items to render as tiles in the bento grid.
   */
  items?: AdaptiveBentoItem[];
  /**
   * Density of the grid, controlling the gap spacing.
   */
  density?: 'compact' | 'normal';
  /**
   * Optional CSS class for the container.
   */
  className?: string;
}

/**
 * AdaptiveBento
 * 
 * A responsive bento-grid container that reflows its tiles across container widths
 * using CSS container queries.
 */
export function AdaptiveBento({ 
  items = [], 
  density = 'normal', 
  className = '' 
}: AdaptiveBentoProps) {
  if (items.length === 0) {
    return (
      <div 
        className={`adaptive-bento ${className}`} 
        data-density={density}
        data-empty="true"
      >
        <div className="adaptive-bento-empty">No items</div>
      </div>
    );
  }

  return (
    <div 
      className={`adaptive-bento ${className}`} 
      data-density={density}
    >
      {items.map((item) => (
        <div 
          key={item.id} 
          className="adaptive-bento-tile"
          data-span={item.span ?? 1}
          data-rowspan={item.rowSpan ?? 1}
        >
          {item.node}
        </div>
      ))}
    </div>
  );
}
