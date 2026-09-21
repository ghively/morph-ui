import { useState, type ReactNode } from 'react';
import './PricingTierCard.css';

export interface PricingTierCardProps {
  title: string;
  price: string;
  features: ReactNode[];
  highlight?: boolean;
  onToggle?: (active: boolean) => void;
  ctaText?: string;
  className?: string;
}

export function PricingTierCard({ 
  title, 
  price, 
  features, 
  highlight = false,
  onToggle,
  ctaText = 'Subscribe',
  className = '' 
}: PricingTierCardProps) {
  const [isActive, setIsActive] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleToggle = () => {
    const nextState = !isActive;
    setIsActive(nextState);
    onToggle?.(nextState);
  };

  return (
    <div 
      data-pricing-tier-card 
      className={`${className} ${highlight ? 'is-highlight' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-labelledby={`pricing-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      {/* Conic gradient border pseudo-element will animate via CSS */}
      <div className="pricing-content">
        <h3 id={`pricing-title-${title.replace(/\s+/g, '-').toLowerCase()}`} className="pricing-title">
          {title}
        </h3>
        <div className="pricing-price">{price}</div>
        
        <ul className="pricing-features">
          {features.map((feature, idx) => (
            <li key={idx} className="pricing-feature-item">
              {feature}
            </li>
          ))}
        </ul>

        {onToggle && (
          <label className="pricing-toggle">
            <input 
              type="checkbox" 
              checked={isActive} 
              onChange={handleToggle} 
              aria-label={`Toggle ${title} features`}
            />
            <span className="pricing-toggle-slider" />
          </label>
        )}

        <button 
          className={`pricing-cta ${hovered ? 'is-approaching' : ''}`}
        >
          {ctaText}
        </button>
      </div>
    </div>
  );
}
