import { useState, useEffect, useId } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import './TextScribble.css';

export type ScribbleType = 'underline' | 'strike' | 'circle';

export interface TextScribbleProps {
  /** The text or elements to be scribbled over */
  children: ReactNode;
  /** Type of scribble mark */
  type?: ScribbleType;
  /** Whether the scribble draws on mount */
  playOnMount?: boolean;
  /** Trigger the scribble manually */
  trigger?: boolean;
  /** Duration of the drawing animation (e.g., '0.5s') */
  duration?: string;
  /** Delay before drawing starts */
  delay?: string;
  /** Custom stroke color */
  color?: string;
  className?: string;
  style?: CSSProperties;
}

const PRESETS: Record<ScribbleType, { d: string; viewBox: string }> = {
  underline: {
    d: 'M 5 90 Q 20 80, 50 85 T 100 80 T 150 85 T 200 80 T 250 85 T 295 80',
    viewBox: '0 0 300 100',
  },
  strike: {
    d: 'M 5 50 Q 50 40, 150 50 T 295 45',
    viewBox: '0 0 300 100',
  },
  circle: {
    d: 'M 150 10 C 250 5, 290 30, 280 60 C 270 90, 180 95, 100 90 C 20 85, 10 50, 30 20 C 50 -10, 100 5, 150 15',
    viewBox: '0 0 300 100',
  },
};

export function TextScribble({
  children,
  type = 'underline',
  playOnMount = true,
  trigger = false,
  duration = '0.5s',
  delay = '0s',
  color = 'var(--app-blue)',
  className = '',
  style,
}: TextScribbleProps) {
  const [key, setKey] = useState(0);
  const pathId = useId();

  useEffect(() => {
    if (trigger || playOnMount) {
      setKey(prev => prev + 1);
    }
  }, [trigger, playOnMount]);

  const preset = PRESETS[type];

  return (
    <span
      className={`text-scribble-container ${className}`}
      style={{
        ...style,
        '--scribble-duration': duration,
        '--scribble-delay': delay,
        '--scribble-color': color,
      } as React.CSSProperties}
      data-text-scribble
      key={key} // Force re-render/animation on trigger
    >
      <span className="text-scribble-content">{children}</span>
      <svg
        className="text-scribble-svg"
        viewBox={preset.viewBox}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          id={`scribble-${pathId}`}
          className="text-scribble-path"
          d={preset.d}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
