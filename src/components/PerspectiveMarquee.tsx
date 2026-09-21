import { useEffect, useState } from 'react';
import './PerspectiveMarquee.css';

export interface PerspectiveMarqueeRow {
  id: string;
  images: { id: string; src: string; alt: string }[];
  direction?: 'left' | 'right';
  speed?: number; // Duration in seconds, default is 30
}

export interface PerspectiveMarqueeProps {
  rows: PerspectiveMarqueeRow[];
  className?: string;
  'data-testid'?: string;
}

export function PerspectiveMarquee({
  rows,
  className = '',
  'data-testid': testId,
}: PerspectiveMarqueeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <div
      className={`perspective-marquee ${className}`}
      data-testid={testId}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="3D Perspective Image Marquee"
    >
      <div className="perspective-marquee-scene">
        {rows.map((row) => (
          <div
            key={row.id}
            className="perspective-marquee-row-wrapper"
          >
            <div
              className={`perspective-marquee-row direction-${row.direction || 'left'}`}
              style={{
                animationDuration: `${row.speed || 30}s`,
                animationPlayState: reducedMotion ? 'paused' : isHovered ? 'paused' : 'running',
              }}
            >
              {/* Double the images to create infinite scroll effect */}
              {[...row.images, ...row.images].map((img, idx) => (
                <div key={`${row.id}-${img.id}-${idx}`} className="perspective-marquee-item">
                  <img src={img.src} alt={img.alt} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
