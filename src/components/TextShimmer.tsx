import type { CSSProperties, ReactNode } from 'react';
import './TextShimmer.css';

export interface TextShimmerProps {
  /** The content to apply the shimmer effect to */
  children: ReactNode;
  /** Speed of the shimmer animation (e.g. '2s') */
  duration?: string;
  /** The angle of the shimmer gradient (e.g. '60deg') */
  angle?: string;
  /** Primary text color */
  color?: string;
  /** Shimmer highlight color */
  shimmerColor?: string;
  className?: string;
  style?: CSSProperties;
}

export function TextShimmer({
  children,
  duration = '2s',
  angle = '60deg',
  color = 'var(--app-faint)',
  shimmerColor = 'var(--app-text)',
  className = '',
  style,
}: TextShimmerProps) {
  return (
    <span
      className={`text-shimmer ${className}`}
      style={{
        ...style,
        '--shimmer-duration': duration,
        '--shimmer-angle': angle,
        '--shimmer-color': color,
        '--shimmer-highlight': shimmerColor,
      } as React.CSSProperties}
      data-text-shimmer
    >
      {children}
    </span>
  );
}
