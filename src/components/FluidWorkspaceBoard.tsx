import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import type { ReactNode, KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import './FluidWorkspaceBoard.css';

export interface FluidWorkspaceBoardItem {
  id: string;
  title: string;
  node: ReactNode;
}

export interface FluidWorkspaceBoardProps {
  items: FluidWorkspaceBoardItem[];
  defaultOrder?: string[];
  controlledOrder?: string[];
  onReorder?: (newOrder: string[]) => void;
  density?: 'compact' | 'comfortable';
}

function getRects(container: HTMLElement) {
  const rects = new Map<string, DOMRect>();
  Array.from(container.children).forEach((child) => {
    if (child instanceof HTMLElement && child.dataset.id) {
      rects.set(child.dataset.id, child.getBoundingClientRect());
    }
  });
  return rects;
}

export function FluidWorkspaceBoard({
  items,
  defaultOrder,
  controlledOrder,
  onReorder,
  density = 'comfortable',
}: FluidWorkspaceBoardProps) {
  const isControlled = controlledOrder !== undefined;
  const initialOrder = isControlled ? controlledOrder : (defaultOrder || items.map(item => item.id));
  
  const [internalOrder, setInternalOrder] = useState<string[]>(initialOrder);
  const currentOrder = isControlled ? controlledOrder : internalOrder;

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // FLIP animation states
  const prevRectsRef = useRef<Map<string, DOMRect>>(new Map());
  const animatingNodesRef = useRef<Set<string>>(new Set());
  
  // Measure before layout changes
  useLayoutEffect(() => {
    if (containerRef.current) {
      prevRectsRef.current = getRects(containerRef.current);
    }
  }, [currentOrder, items]); // Dependency includes order to measure BEFORE DOM update applies the new order

  // Apply FLIP after layout changes
  useLayoutEffect(() => {
    if (!containerRef.current || prevRectsRef.current.size === 0) return;
    
    // Check if motion is reduced
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
       return; // Skip animation
    }

    const currentRects = getRects(containerRef.current);
    
    Array.from(containerRef.current.children).forEach((child) => {
      if (!(child instanceof HTMLElement) || !child.dataset.id) return;
      
      const id = child.dataset.id;
      // Do not animate the item currently being dragged
      if (id === draggedId) return;

      const prevRect = prevRectsRef.current.get(id);
      const currRect = currentRects.get(id);

      if (prevRect && currRect) {
        const dx = prevRect.left - currRect.left;
        const dy = prevRect.top - currRect.top;

        if (dx !== 0 || dy !== 0) {
          // Invert
          child.style.transition = 'none';
          child.style.transform = `translate(${dx}px, ${dy}px)`;
          
          animatingNodesRef.current.add(id);

          // Play
          requestAnimationFrame(() => {
            // Need a second RAF to ensure the transition="none" frame is painted
            requestAnimationFrame(() => {
              if (animatingNodesRef.current.has(id)) {
                // Keep the component's CSS transition by clearing inline transform/transition
                child.style.transition = '';
                child.style.transform = '';
                animatingNodesRef.current.delete(id);
              }
            });
          });
        }
      }
    });
  }, [currentOrder, items, draggedId]);
  
  // Sync internal order if items change and not controlled
  useEffect(() => {
    if (!isControlled) {
      const newItemsIds = items.map(i => i.id);
      const updatedOrder = currentOrder.filter(id => newItemsIds.includes(id));
      const missingIds = newItemsIds.filter(id => !currentOrder.includes(id));
      if (missingIds.length > 0 || updatedOrder.length !== currentOrder.length) {
         setInternalOrder([...updatedOrder, ...missingIds]);
      }
    }
  }, [items, currentOrder, isControlled]);

  const handleOrderChange = (newOrder: string[]) => {
    if (!isControlled) {
      setInternalOrder(newOrder);
    }
    if (onReorder) {
      onReorder(newOrder);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, id: string) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const currentIndex = currentOrder.indexOf(id);
      if (currentIndex === -1) return;

      let newIndex = currentIndex;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        newIndex = Math.max(0, currentIndex - 1);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        newIndex = Math.min(currentOrder.length - 1, currentIndex + 1);
      }

      if (newIndex !== currentIndex) {
        // Measure before keydown reflow
        if (containerRef.current) {
          prevRectsRef.current = getRects(containerRef.current);
        }
        
        const newOrder = [...currentOrder];
        newOrder.splice(currentIndex, 1);
        newOrder.splice(newIndex, 0, id);
        handleOrderChange(newOrder);
        
        // Wait for render, then refocus the item
        setTimeout(() => {
          const el = document.getElementById(`workspace-board-item-${id}`);
          if (el) el.focus();
        }, 0);
      }
    }
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>, id: string) => {
    // Only handle primary pointer (left click)
    if (e.button !== 0) return;
    
    const target = e.currentTarget as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    
    setDraggedId(id);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDragPos({
      x: e.clientX,
      y: e.clientY,
    });
    
    // Clear any leftover inline transforms on this element from previous FLIPs
    target.style.transition = 'none';
    target.style.transform = '';
    animatingNodesRef.current.delete(id);
    
    if (typeof target.setPointerCapture === 'function') {
      target.setPointerCapture(e.pointerId);
    }
    e.preventDefault();
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>, id: string) => {
    if (draggedId !== id) return;

    setDragPos({
      x: e.clientX,
      y: e.clientY,
    });

    // Detect overlap and reorder
    if (containerRef.current) {
      const itemsElements = Array.from(containerRef.current.children) as HTMLElement[];
      const draggedElement = document.getElementById(`workspace-board-item-${id}`);
      
      if (!draggedElement) return;

      // Calculate dragged center using pointer coords instead of getBoundingClientRect 
      // because getBoundingClientRect may be affected by translate
      const pointerX = e.clientX;
      const pointerY = e.clientY;

      let hoveredIndex = -1;

      for (let i = 0; i < itemsElements.length; i++) {
        const el = itemsElements[i];
        if (el.dataset.id === id) continue; // Skip self

        // Get actual rect of other items (they are in DOM flow)
        const rect = el.getBoundingClientRect();
        
        // Overlap if pointer is within their rect
        if (
          pointerX >= rect.left &&
          pointerX <= rect.right &&
          pointerY >= rect.top &&
          pointerY <= rect.bottom
        ) {
          hoveredIndex = currentOrder.indexOf(el.dataset.id!);
          break;
        }
      }

      if (hoveredIndex !== -1) {
        const currentIndex = currentOrder.indexOf(id);
        if (currentIndex !== -1 && currentIndex !== hoveredIndex) {
          // Store rects BEFORE state updates so FLIP can use them
          prevRectsRef.current = getRects(containerRef.current);
          
          const newOrder = [...currentOrder];
          newOrder.splice(currentIndex, 1);
          newOrder.splice(hoveredIndex, 0, id);
          handleOrderChange(newOrder);
        }
      }
    }
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>, id: string) => {
    if (draggedId === id) {
      setDraggedId(null);
      const target = e.currentTarget as HTMLDivElement;
      
      // Clear visual dragging styles so it snaps back to place
      target.style.transform = '';
      target.style.transition = '';
      
      if (typeof target.releasePointerCapture === 'function') {
        target.releasePointerCapture(e.pointerId);
      }
    }
  };

  const orderedItems = currentOrder
    .map(id => items.find(item => item.id === id))
    .filter((item): item is FluidWorkspaceBoardItem => item !== undefined);

  if (orderedItems.length === 0) {
    return (
      <div 
        className="fluid-workspace-board" 
        data-density={density}
        ref={containerRef}
      >
        <div className="fluid-workspace-board-empty">No items</div>
      </div>
    );
  }

  return (
    <div 
      className="fluid-workspace-board" 
      data-density={density}
      ref={containerRef}
    >
      {orderedItems.map((item) => {
        const isDragging = draggedId === item.id;
        
        let style = {};
        if (isDragging && draggedId) {
          // Try to compute visual offset. We use position: relative, so we can translate
          // If we want it to follow pointer perfectly:
          const el = document.getElementById(`workspace-board-item-${item.id}`);
          if (el) {
            style = {
               position: 'fixed',
               left: dragPos.x - dragOffset.x,
               top: dragPos.y - dragOffset.y,
               margin: 0,
               zIndex: 100,
               pointerEvents: 'none' // let mouse pass through so pointerMove hits underlying items, wait, pointerCapture handles events!
            };
          }
        }
        
        return (
          <div
            key={item.id}
            id={`workspace-board-item-${item.id}`}
            data-id={item.id}
            className={`fluid-workspace-board-item ${isDragging ? 'is-dragging' : ''}`}
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, item.id)}
            onPointerDown={(e) => handlePointerDown(e, item.id)}
            onPointerMove={(e) => handlePointerMove(e, item.id)}
            onPointerUp={(e) => handlePointerUp(e, item.id)}
            onPointerCancel={(e) => handlePointerUp(e, item.id)}
            style={isDragging ? style : undefined}
          >
            <div className="fluid-workspace-board-item-header">
              {item.title}
            </div>
            <div className="fluid-workspace-board-item-content">
              {item.node}
            </div>
          </div>
        );
      })}
    </div>
  );
}
