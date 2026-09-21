import { useState, useRef, useEffect, useId } from 'react';
import './AnimatedMediaTabs.css';

export interface MediaTabItem {
  id: string;
  tabLabel: string;
  imageUrl: string;
  imageAlt?: string;
  title: string;
  description: string;
}

export interface AnimatedMediaTabsProps {
  items: MediaTabItem[];
  defaultSelectedId?: string;
  className?: string;
}

export function AnimatedMediaTabs({ items, defaultSelectedId, className = '' }: AnimatedMediaTabsProps) {
  const [selectedId, setSelectedId] = useState<string>(
    defaultSelectedId || (items.length > 0 ? items[0].id : '')
  );
  
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0, width: 0, opacity: 0
  });

  const tabListRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  useEffect(() => {
    if (!tabListRef.current) return;
    const selectedTab = tabListRef.current.querySelector(`[data-tab-id="${selectedId}"]`) as HTMLElement;
    if (selectedTab) {
      setIndicatorStyle({
        left: selectedTab.offsetLeft,
        width: selectedTab.offsetWidth,
        opacity: 1
      });
    }
  }, [selectedId, items]);

  if (!items || items.length === 0) return null;

  return (
    <div className={`animated-media-tabs ${className}`} data-animated-media-tabs="">
      <div className="animated-media-tabs-list" role="tablist" ref={tabListRef}>
        <div 
          className="animated-media-tabs-indicator"
          style={{
            transform: `translateX(${indicatorStyle.left}px)`,
            width: `${indicatorStyle.width}px`,
            opacity: indicatorStyle.opacity
          }}
          aria-hidden="true"
        />
        {items.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <button
              key={item.id}
              data-tab-id={item.id}
              className="animated-media-tabs-tab"
              role="tab"
              aria-selected={isSelected}
              aria-controls={`panel-${baseId}-${item.id}`}
              id={`tab-${baseId}-${item.id}`}
              onClick={() => setSelectedId(item.id)}
              data-selected={isSelected ? "true" : "false"}
            >
              {item.tabLabel}
            </button>
          );
        })}
      </div>

      <div className="animated-media-tabs-deck">
        {items.map((item, index) => {
          const isSelected = item.id === selectedId;
          // compute a simple depth for stacking
          const selectedIndex = items.findIndex(i => i.id === selectedId);
          let offset = index - selectedIndex;
          if (offset < 0) offset += items.length;
          
          return (
            <div
              key={item.id}
              id={`panel-${baseId}-${item.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${baseId}-${item.id}`}
              className="animated-media-tabs-card"
              data-selected={isSelected ? "true" : "false"}
              style={{
                zIndex: items.length - offset,
                '--card-offset': offset
              } as React.CSSProperties}
            >
              <div className="animated-media-tabs-card-inner">
                <div className="animated-media-tabs-image-wrapper">
                  <img src={item.imageUrl} alt={item.imageAlt || item.title} className="animated-media-tabs-image" />
                </div>
                <div className="animated-media-tabs-footer">
                  <h3 className="animated-media-tabs-title">{item.title}</h3>
                  <p className="animated-media-tabs-description">{item.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
