
import './LineFillText.css';

export interface LineFillTextProps {
  text: string;
  fillDelay?: string;
  className?: string;
}

export function LineFillText({ text, fillDelay = 'var(--d3)', className = '' }: LineFillTextProps) {
  return (
    <div 
      className={`line-fill-text-container ${className}`} 
      data-line-fill-text
      style={{ '--fill-delay': fillDelay } as React.CSSProperties}
    >
      <svg className="line-fill-text-svg" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid meet">
        <text
          className="line-fill-text-stroke"
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {text}
        </text>
        <text
          className="line-fill-text-fill"
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {text}
        </text>
      </svg>
    </div>
  );
}
