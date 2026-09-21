import type { CSSProperties, ReactNode } from 'react';
import './TextSpectrum.css';

export interface TextSpectrumProps {
  /** The content to apply the spectrum effect to */
  children: ReactNode;
  /** Speed of the spectrum animation (e.g. '8s') */
  duration?: string;
  /** Colors for the spectrum gradient */
  colors?: string[];
  className?: string;
  style?: CSSProperties;
}

export function TextSpectrum({
  children,
  duration = '8s',
  colors = [
    'var(--app-blue)',
    'var(--color-success)',
    'var(--color-warning)',
    'var(--color-error)',
    'var(--app-blue)' // Loop back to start for smooth endless loop
  ],
  className = '',
  style,
}: TextSpectrumProps) {
  const gradientStops = colors.join(', ');

  return (
    <span
      className={`text-spectrum ${className}`}
      style={{
        ...style,
        '--spectrum-duration': duration,
        backgroundImage: `linear-gradient(90deg, ${gradientStops})`,
      } as React.CSSProperties}
      data-text-spectrum
    >
      {children}
    </span>
  );
}
