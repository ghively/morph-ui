import { useLayoutEffect, useRef, useState } from 'react';
import './PanelDestinationTransition.css';

export interface PanelDestinationTransitionProps {
  active: boolean;
  sourceRef: React.RefObject<HTMLElement | null>;
  duration?: 'd2' | 'd3';
  children: React.ReactNode;
  onTransitionEnd?: () => void;
}

export function PanelDestinationTransition({
  active,
  sourceRef,
  duration = 'd2',
  children,
  onTransitionEnd
}: PanelDestinationTransitionProps) {
  const destRef = useRef<HTMLDivElement>(null);
  const [ghostStyle, setGhostStyle] = useState<React.CSSProperties | null>(null);
  const [childrenVisible, setChildrenVisible] = useState(active);
  const previousActive = useRef(active);

  // We only run the FLIP transition when going from inactive to active.
  useLayoutEffect(() => {
    if (active && !previousActive.current) {
      if (!sourceRef.current || !destRef.current) {
        setChildrenVisible(true);
        if (onTransitionEnd) onTransitionEnd();
      } else {
        const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
          setChildrenVisible(true);
          if (onTransitionEnd) onTransitionEnd();
        } else {
          // FLIP technique
          const sourceRect = sourceRef.current.getBoundingClientRect();
          const destRect = destRef.current.getBoundingClientRect();
          
          if (sourceRect.width === 0 && sourceRect.height === 0 && destRect.width === 0 && destRect.height === 0) {
            // jsdom or invisible, just show children
             setChildrenVisible(true);
             if (onTransitionEnd) onTransitionEnd();
          } else {
             const scaleX = sourceRect.width / destRect.width;
             const scaleY = sourceRect.height / destRect.height;
             
             // First state (source)
             setGhostStyle({
               top: destRect.top,
               left: destRect.left,
               width: destRect.width,
               height: destRect.height,
               transform: `translate(${sourceRect.left - destRect.left}px, ${sourceRect.top - destRect.top}px) scale(${scaleX}, ${scaleY})`,
               transition: 'none',
             });
             
             // Wait one frame to apply the final state (destination)
             requestAnimationFrame(() => {
               requestAnimationFrame(() => {
                 setGhostStyle({
                   top: destRect.top,
                   left: destRect.left,
                   width: destRect.width,
                   height: destRect.height,
                   transform: 'translate(0px, 0px) scale(1, 1)',
                   transition: `transform var(--${duration}) var(--ease-spring)`,
                 });
                 setChildrenVisible(true);
               });
             });
          }
        }
      }
    } else if (!active && previousActive.current) {
      // If we become inactive, hide children.
      setChildrenVisible(false);
      setGhostStyle(null);
    }
    
    // Set active synchronously if active initially
    if (active && previousActive.current === active && !childrenVisible) {
       setChildrenVisible(true);
    }

    previousActive.current = active;
  }, [active, sourceRef, duration, onTransitionEnd, childrenVisible]);

  const handleGhostTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName === 'transform') {
      setGhostStyle(null);
      if (onTransitionEnd) {
        onTransitionEnd();
      }
    }
  };

  return (
    <div className="panel-destination-transition" ref={destRef}>
      {/* 
        We render children unconditionally but control their visibility. 
        When ghost is animating, children might be visible, but ghost will overlay.
        Actually, we can just hide children until the ghost reaches its destination,
        or we can show them right away. 
        The instruction: "children render in the destination slot while a visual ghost springs from the source rect... then unmounts the ghost." 
        If we show children immediately, they might pop in. 
        Usually, children opacity is 0 during FLIP or ghost just overlays.
        Let's render them and keep their opacity at 0 while ghost is animating.
      */}
      <div 
        className="panel-destination-content" 
        style={{ opacity: ghostStyle ? 0 : (childrenVisible ? 1 : 0) }}
        data-testid="destination-content"
      >
        {childrenVisible && children}
      </div>

      {ghostStyle && (
        <div 
          className="panel-destination-ghost"
          style={ghostStyle}
          onTransitionEnd={handleGhostTransitionEnd}
          data-testid="destination-ghost"
        >
          {/* We clone the children to render in the ghost */}
          {children}
        </div>
      )}
    </div>
  );
}
