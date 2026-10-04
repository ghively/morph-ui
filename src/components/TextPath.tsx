import { useId, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import './TextPath.css';

export type TextPathPreset = 'wave' | 'arc' | 'circle';

export interface TextPathProps {
  /** The text to display along the path */
  text: string;
  /** A custom SVG path `d` string, or a preset string */
  path?: string | TextPathPreset;
  /** Animation duration string (e.g. '10s') */
  duration?: string;
  /** Number of times to repeat the text to fill the path (default 1) */
  repeat?: number;
  /**
   * Stretch letter spacing so the text covers the whole path exactly (no seam
   * on closed paths). Defaults to true for the `circle` preset, false otherwise.
   */
  fit?: boolean;
  className?: string;
  style?: CSSProperties;
}

const PRESETS: Record<TextPathPreset, { d: string; viewBox: string; length?: number }> = {
  wave: {
    d: 'M 0 50 C 40 10, 60 10, 100 50 C 140 90, 160 90, 200 50 C 240 10, 260 10, 300 50 C 340 90, 360 90, 400 50',
    viewBox: '0 0 400 100',
  },
  arc: {
    d: 'M 0 100 A 200 100 0 0 1 400 100',
    // Headroom above the apex so the larger arc type is not cropped.
    viewBox: '0 -40 400 150',
  },
  circle: {
    d: 'M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0',
    viewBox: '0 0 200 200',
    length: 2 * Math.PI * 75,
  },
};

const SEPARATOR = '   '; // Non-breaking space separator

export function TextPath({
  text,
  path = 'wave',
  duration = '10s',
  repeat = 1,
  fit,
  className = '',
  style,
}: TextPathProps) {
  const id = useId();
  const pathId = `textpath-${id}`;
  const pathRef = useRef<SVGPathElement>(null);

  const isPreset = path in PRESETS;
  const preset = isPreset ? (path as TextPathPreset) : undefined;
  const pathData = preset ? PRESETS[preset].d : path;
  const viewBox = preset ? PRESETS[preset].viewBox : '0 0 400 100';
  const shouldFit = fit ?? preset === 'circle';
  const centered = preset === 'arc' && !shouldFit;

  const [measured, setMeasured] = useState<number | undefined>(undefined);
  useLayoutEffect(() => {
    if (!shouldFit) return;
    const el = pathRef.current;
    if (!el || typeof el.getTotalLength !== 'function') return;
    try {
      const len = el.getTotalLength();
      if (len > 0) setMeasured(len);
    } catch {
      /* not rendered – fall back to the preset length */
    }
  }, [shouldFit, pathData]);
  const pathLength = measured ?? (preset ? PRESETS[preset].length : undefined);

  const count = Math.max(1, repeat);
  const fullText = shouldFit
    ? // Closed loop: trim each repeat and end with the separator so the gap at
      // the seam matches every other gap.
      Array(count).fill(text.trim()).join(SEPARATOR) + (preset === 'circle' ? SEPARATOR : '')
    : Array(count).fill(text).join(SEPARATOR);

  const fitProps =
    shouldFit && pathLength ? { textLength: pathLength, lengthAdjust: 'spacing' as const } : {};

  return (
    <div 
      className={`text-path-container ${className}`} 
      style={{ ...style, '--duration': duration } as React.CSSProperties}
      data-text-path
      data-text-path-preset={preset}
      data-fit={shouldFit ? '' : undefined}
    >
      <svg 
        viewBox={viewBox} 
        className="text-path-svg"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <path ref={pathRef} id={pathId} d={pathData} fill="none" stroke="none" />
        <text className="text-path-text">
          <textPath
            href={`#${pathId}`}
            startOffset={centered ? '50%' : '0%'}
            textAnchor={centered ? 'middle' : undefined}
            {...fitProps}
          >
            {fullText}
            {/* The animation happens on startOffset via CSS */}
          </textPath>
        </text>
      </svg>
      {/* Screen reader only text since SVG textPath accessibility is poor */}
      <span className="text-path-sr-only">{text}</span>
    </div>
  );
}
