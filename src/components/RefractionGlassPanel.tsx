import { type ReactNode, useId } from 'react';
import './RefractionGlassPanel.css';

export interface RefractionGlassPanelProps {
  children: ReactNode;
  displacementScale?: number; // amount of warping
  className?: string;
  'data-testid'?: string;
}

export function RefractionGlassPanel({
  children,
  displacementScale = 15,
  className = '',
  'data-testid': testId,
}: RefractionGlassPanelProps) {
  const filterId = useId();
  
  return (
    <div
      className={`refraction-glass-panel ${className}`}
      data-testid={testId}
    >
      <svg className="refraction-glass-svg">
        <defs>
          <filter id={filterId} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="2"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              in="noise"
              result="coloredNoise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="coloredNoise"
              scale={displacementScale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displacement"
            />
          </filter>
        </defs>
      </svg>
      
      <div 
        className="refraction-glass-backdrop" 
        style={{ filter: `url(#${filterId})` }}
      />
      <div className="refraction-glass-overlay" />
      
      <div className="refraction-glass-content">
        {children}
      </div>
    </div>
  );
}
