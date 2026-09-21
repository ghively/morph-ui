import type { ReactNode } from 'react';
import './InfiniteMarquee.css';

export interface InfiniteMarqueeProps {
  children: ReactNode;
  speed?: string;
  gap?: string;
  className?: string;
}

export function InfiniteMarquee({ 
  children, 
  speed, 
  gap, 
  className = '' 
}: InfiniteMarqueeProps) {
  const customStyles = {
    ...(speed ? { '--marquee-speed': speed } : {}),
    ...(gap ? { '--marquee-gap': gap } : {})
  } as React.CSSProperties;

  return (
    <div 
      className={`infinite-marquee-container ${className}`} 
      style={Object.keys(customStyles).length > 0 ? customStyles : undefined}
      data-infinite-marquee
    >
      <div className="infinite-marquee-track">
        {/* Original Content */}
        <div className="infinite-marquee-content">
          {children}
        </div>
        {/* Duplicated Content for Seamless Loop */}
        <div className="infinite-marquee-content" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
