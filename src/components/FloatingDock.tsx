import { useState, useRef, useCallback } from 'react';
import type { ReactNode, PointerEvent as ReactPointerEvent } from 'react';
import './FloatingDock.css';

export interface DockItem {
  id: string;
  label: string;
  icon: ReactNode;
  onClick?: () => void;
}

export interface FloatingDockProps {
  items: DockItem[];
  className?: string;
  horizontal?: boolean; // Default true in CSS usually, but we can make it explicit
  baseItemSize?: number;
  maxItemSize?: number;
  magnificationRange?: number;
}

export function FloatingDock({ 
  items, 
  className = '', 
  horizontal = true,
  baseItemSize = 48,
  maxItemSize = 80,
  magnificationRange = 200
}: FloatingDockProps) {
  const dockRef = useRef<HTMLDivElement>(null);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);
  const [bouncingItemId, setBouncingItemId] = useState<string | null>(null);

  const handlePointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    setPointerPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handlePointerLeave = () => {
    setPointerPos(null);
  };

  const handleItemClick = (item: DockItem) => {
    setBouncingItemId(item.id);
    if (item.onClick) item.onClick();
    setTimeout(() => {
      setBouncingItemId(null);
    }, 1000); // Bounce animation duration
  };

  // Helper to calculate scale based on distance
  const calculateScale = (_index: number, el: HTMLButtonElement | null) => {
    if (!pointerPos || !el) return 1;
    
    // In JSDOM, getBoundingClientRect() returns 0, handled with fallback
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return 1;

    const itemCenterX = rect.left + rect.width / 2;
    const itemCenterY = rect.top + rect.height / 2;
    
    const distance = horizontal 
      ? Math.abs(pointerPos.x - itemCenterX)
      : Math.abs(pointerPos.y - itemCenterY);
      
    if (distance > magnificationRange) return 1;

    // Scale calculation using cosine curve for smooth magnification
    const scale = 1 + ((maxItemSize / baseItemSize) - 1) * Math.cos((distance / magnificationRange) * (Math.PI / 2));
    
    return Math.max(1, scale);
  };

  return (
    <div 
      className={`floating-dock-container ${horizontal ? 'horizontal' : 'vertical'} ${className}`} 
      data-floating-dock
      ref={dockRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="floating-dock-panel" role="toolbar" aria-label="Floating Dock">
        {items.map((item, index) => {
          return (
            <DockItemComponent 
              key={item.id}
              item={item}
              scaleFn={(el) => calculateScale(index, el)}
              isBouncing={bouncingItemId === item.id}
              onClick={() => handleItemClick(item)}
              baseSize={baseItemSize}
            />
          );
        })}
      </div>
    </div>
  );
}

// Extract item to a separate component to manage its own ref for size calculation
function DockItemComponent({ 
  item, 
  scaleFn, 
  isBouncing, 
  onClick,
  baseSize
}: { 
  item: DockItem; 
  scaleFn: (el: HTMLButtonElement | null) => number; 
  isBouncing: boolean;
  onClick: () => void;
  baseSize: number;
}) {
  const itemRef = useRef<HTMLButtonElement>(null);
  const scale = scaleFn(itemRef.current);

  return (
    <div className="floating-dock-item-wrapper" style={{ width: scale * baseSize, height: scale * baseSize }}>
      <button
        ref={itemRef}
        className={`floating-dock-item ${isBouncing ? 'bouncing' : ''}`}
        onClick={onClick}
        aria-label={item.label}
        style={{ transform: `scale(${scale})` }}
      >
        <span className="floating-dock-icon">{item.icon}</span>
        <span className="floating-dock-tooltip" role="tooltip">{item.label}</span>
      </button>
    </div>
  );
}
