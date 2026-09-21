import { useId } from 'react';
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
  className?: string;
  style?: CSSProperties;
}

const PRESETS: Record<TextPathPreset, { d: string; viewBox: string }> = {
  wave: {
    d: 'M 0 50 C 40 10, 60 10, 100 50 C 140 90, 160 90, 200 50 C 240 10, 260 10, 300 50 C 340 90, 360 90, 400 50',
    viewBox: '0 0 400 100',
  },
  arc: {
    d: 'M 0 100 A 200 100 0 0 1 400 100',
    viewBox: '0 0 400 100',
  },
  circle: {
    d: 'M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0',
    viewBox: '0 0 200 200',
  },
};

export function TextPath({
  text,
  path = 'wave',
  duration = '10s',
  repeat = 1,
  className = '',
  style,
}: TextPathProps) {
  const id = useId();
  const pathId = `textpath-${id}`;

  const isPreset = path in PRESETS;
  const pathData = isPreset ? PRESETS[path as TextPathPreset].d : path;
  const viewBox = isPreset ? PRESETS[path as TextPathPreset].viewBox : '0 0 400 100';

  const fullText = Array(Math.max(1, repeat)).fill(text).join(' \u00A0 '); // Non-breaking space separator

  return (
    <div 
      className={`text-path-container ${className}`} 
      style={{ ...style, '--duration': duration } as React.CSSProperties}
      data-text-path
    >
      <svg 
        viewBox={viewBox} 
        className="text-path-svg"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <path id={pathId} d={pathData} fill="none" stroke="none" />
        <text className="text-path-text">
          <textPath href={`#${pathId}`} startOffset="0%">
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
