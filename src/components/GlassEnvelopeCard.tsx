import { useState } from 'react';
import type { ReactNode, KeyboardEvent as ReactKeyboardEvent } from 'react';
import './GlassEnvelopeCard.css';

export interface GlassEnvelopeCardProps {
  envelopeContent: ReactNode;
  cards: ReactNode[];
  className?: string;
}

export function GlassEnvelopeCard({
  envelopeContent,
  cards,
  className = ''
}: GlassEnvelopeCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div 
      className={`glass-envelope-card ${className} ${isOpen ? 'is-open' : ''} ${isHovered && !isOpen ? 'is-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsOpen(!isOpen)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      data-testid="glass-envelope-card"
      role="button"
      aria-expanded={isOpen}
    >
      <div className="glass-envelope-back"></div>
      
      <div className="glass-envelope-cards">
        {cards.map((card, index) => {
          const total = cards.length;
          const offset = index - (total - 1) / 2;
          
          let style = {};
          if (isOpen) {
            style = {
              transform: `translateY(-120px) translateX(${offset * 20}px) rotate(${offset * 10}deg) scale(1.1)`,
              zIndex: 10 + index
            };
          } else if (isHovered) {
            style = {
              transform: `translateY(-30px) translateX(${offset * 15}px) rotate(${offset * 5}deg)`,
              zIndex: 10 + index
            };
          } else {
            style = {
              transform: `translateY(0) translateX(0) rotate(0)`,
              zIndex: 10 + index
            };
          }

          return (
            <div 
              key={index} 
              className="glass-envelope-inner-card"
              style={style}
              data-testid={`glass-envelope-inner-card-${index}`}
            >
              {card}
            </div>
          );
        })}
      </div>

      <div className="glass-envelope-front">
        <div className="glass-envelope-content">
          {envelopeContent}
        </div>
      </div>
    </div>
  );
}
