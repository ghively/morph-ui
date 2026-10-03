import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject, type TransitionEvent } from 'react';
import './PanelDestinationTransition.css';

export interface PanelDestinationTransitionProps {
  active: boolean;
  sourceRef: RefObject<HTMLElement | null>;
  duration?: 'd2' | 'd3';
  children: ReactNode;
  onTransitionEnd?: () => void;
  className?: string;
}

/**
 * FLIP from the source rect into this slot. A wireframe ghost flies over,
 * then the panel scans in. The ghost is absolutely positioned inside the slot,
 * so transformed or scrolled ancestors do not offset it.
 */
export function PanelDestinationTransition({ active, sourceRef, duration = 'd3', children, onTransitionEnd, className = '' }: PanelDestinationTransitionProps) {
  const destRef = useRef<HTMLDivElement>(null);
  const [ghost, setGhost] = useState<CSSProperties | null>(null);
  const [shown, setShown] = useState(active);
  const prev = useRef(active);

  useLayoutEffect(() => {
    if (active && !prev.current) {
      const s = sourceRef.current?.getBoundingClientRect();
      const d = destRef.current?.getBoundingClientRect();
      const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (!s || !d || reduce || !d.width || !d.height) {
        setShown(true);
        onTransitionEnd?.();
      } else {
        setGhost({
          width: d.width,
          height: d.height,
          transform: `translate(${s.left - d.left}px, ${s.top - d.top}px) scale(${s.width / d.width}, ${s.height / d.height})`,
          transition: 'none',
        });
        requestAnimationFrame(() => requestAnimationFrame(() => {
          setGhost({ width: d.width, height: d.height, transform: 'none', transition: `transform var(--${duration}) var(--ease-morph)` });
          setShown(true);
        }));
      }
    } else if (!active && prev.current) {
      setShown(false);
      setGhost(null);
    }
    prev.current = active;
  }, [active, sourceRef, duration, onTransitionEnd]);

  const onGhostEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName === 'transform') { setGhost(null); onTransitionEnd?.(); }
  };

  return (
    <div className={`panel-destination-transition ${shown ? 'is-shown' : ''} ${ghost ? 'is-flying' : ''} ${className}`.trim()} ref={destRef}>
      <div className="panel-destination-content" data-testid="destination-content" style={{ opacity: ghost ? 0 : shown ? 1 : 0 }}>
        {shown && children}
      </div>
      {ghost && (
        <div className="panel-destination-ghost" data-testid="destination-ghost" style={ghost} onTransitionEnd={onGhostEnd} aria-hidden="true">
          <span className="panel-destination-corner tl" />
          <span className="panel-destination-corner tr" />
          <span className="panel-destination-corner bl" />
          <span className="panel-destination-corner br" />
        </div>
      )}
    </div>
  );
}
