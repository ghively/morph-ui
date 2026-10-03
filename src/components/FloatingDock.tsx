import './FloatingDock.css';
import { useFloatingDock } from "./layout.shared";
import type { FloatingDockProps, DockItem } from './layout.shared';
import { useRef } from 'react';

export function FloatingDock({ items, className = '', horizontal = true, baseItemSize = 48, maxItemSize = 80, magnificationRange = 200 }: FloatingDockProps) {
  const { dockRef, bouncingItemId, handlePointerMove, handlePointerLeave, handleItemClick, calculateScale } = useFloatingDock(horizontal, baseItemSize, maxItemSize, magnificationRange);
  return (
    <div className={`floating-dock-container ${horizontal ? 'horizontal' : 'vertical'} ${className}`} data-floating-dock ref={dockRef} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      <div className="floating-dock-panel" role="toolbar" aria-label="Floating Dock">
        {items.map((item) => <DockItemComponent key={item.id} item={item} scaleFn={calculateScale} isBouncing={bouncingItemId === item.id} onClick={() => handleItemClick(item)} baseSize={baseItemSize} />)}
      </div>
    </div>
  );
}

function DockItemComponent({ item, scaleFn, isBouncing, onClick, baseSize }: { item: DockItem; scaleFn: (el: HTMLButtonElement | null) => number; isBouncing: boolean; onClick: () => void; baseSize: number; }) {
  const itemRef = useRef<HTMLButtonElement>(null);
  const scale = scaleFn(itemRef.current);
  return (
    <div className="floating-dock-item-wrapper" style={{ width: scale * baseSize, height: scale * baseSize }}>
      <button ref={itemRef} className={`floating-dock-item ${isBouncing ? 'bouncing' : ''}`} onClick={onClick} aria-label={item.label} style={{ transform: `scale(${scale})` }}><span className="floating-dock-icon">{item.icon}</span><span className="floating-dock-tooltip" role="tooltip">{item.label}</span></button>
    </div>
  );
}
export type { DockItem, FloatingDockProps } from './layout.shared';
