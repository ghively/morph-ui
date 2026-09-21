import { useRef, useState, useEffect } from 'react';
import './ColorArchiveScroll.css';

export interface ArchiveItem {
  id: string;
  color: string;
  title: string;
  previewImage?: string;
  description?: string;
}

export interface ColorArchiveScrollProps {
  items: ArchiveItem[];
  className?: string;
}

export function ColorArchiveScroll({ items, className = '' }: ColorArchiveScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || items.length === 0) return;
      
      const container = containerRef.current;
      const scrollLeft = container.scrollLeft;
      const itemWidth = container.clientWidth * 0.8; // Approx width of one item + gap
      
      // Calculate active index based on scroll position
      let index = Math.round(scrollLeft / itemWidth);
      index = Math.max(0, Math.min(index, items.length - 1));
      
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [activeIndex, items.length]);

  const activeColor = items[activeIndex]?.color || 'var(--app-bg)';

  return (
    <div 
      className={`color-archive-scroll-container ${className}`} 
      data-color-archive-scroll=""
      style={{ '--active-bg-color': activeColor } as React.CSSProperties}
    >
      <div className="color-archive-scroll-background" aria-hidden="true" />
      
      <div className="color-archive-scroll-viewport" ref={containerRef}>
        <div className="color-archive-scroll-track">
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div 
                key={item.id} 
                className="color-archive-scroll-item"
                data-active={isActive ? "true" : "false"}
              >
                <div className="color-archive-scroll-card">
                  {item.previewImage && (
                    <div className="color-archive-scroll-preview">
                       <img src={item.previewImage} alt={item.title} draggable="false" />
                    </div>
                  )}
                  <div className="color-archive-scroll-content">
                    <h3 className="color-archive-scroll-title" style={{ color: item.color }}>
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="color-archive-scroll-desc">{item.description}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
