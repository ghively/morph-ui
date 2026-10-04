import { useLayoutEffect, useRef, useState } from 'react';
import './LineFillText.css';

export interface LineFillTextProps {
  text: string;
  fillDelay?: string;
  className?: string;
}

/** Fallback viewBox before the text has been measured (and in non-layout envs). */
const DEFAULT_VIEWBOX = '0 0 800 200';
/** Breathing room around the measured glyph box, in user units (covers the stroke). */
const PAD = 8;

export function LineFillText({ text, fillDelay = 'var(--d3)', className = '' }: LineFillTextProps) {
  const textRef = useRef<SVGTextElement>(null);
  const [viewBox, setViewBox] = useState(DEFAULT_VIEWBOX);

  // Fit the viewBox to the rendered text so long headings scale down instead of
  // overflowing (and being clipped by) a fixed-width box.
  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el || typeof el.getBBox !== 'function') return;
    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      try {
        const box = el.getBBox();
        if (box.width > 0 && box.height > 0) {
          setViewBox(
            `${box.x - PAD} ${box.y - PAD} ${box.width + PAD * 2} ${box.height + PAD * 2}`,
          );
        }
      } catch {
        /* not rendered (display:none / jsdom) – keep the fallback viewBox */
      }
    };
    measure();
    // Re-measure once web fonts settle; the fallback face has different metrics.
    document.fonts?.ready.then(measure).catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [text]);

  return (
    <div 
      className={`line-fill-text-container ${className}`} 
      data-line-fill-text
      style={{ '--fill-delay': fillDelay } as React.CSSProperties}
    >
      <svg className="line-fill-text-svg" viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
        <text
          ref={textRef}
          className="line-fill-text-stroke"
          x="400"
          y="100"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {text}
        </text>
        <text
          className="line-fill-text-fill"
          x="400"
          y="100"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {text}
        </text>
      </svg>
    </div>
  );
}
