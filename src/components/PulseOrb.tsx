import './PulseOrb.css';

export type PulseOrbState = 'idle' | 'thinking' | 'speaking';

export interface PulseOrbProps {
  state?: PulseOrbState;
  color?: string;
  size?: number;
  className?: string;
}

export function PulseOrb({ 
  state = 'idle', 
  color = 'var(--app-blue)', 
  size = 100, 
  className = '' 
}: PulseOrbProps) {
  
  return (
    <div 
      className={`pulse-orb ${className}`}
      data-pulse-orb=""
      data-state={state}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        '--orb-color': color
      } as React.CSSProperties}
      role="status"
      aria-label={`AI Status: ${state}`}
    >
      <div className="pulse-orb-ring ring-1" aria-hidden="true" />
      <div className="pulse-orb-ring ring-2" aria-hidden="true" />
      <div className="pulse-orb-ring ring-3" aria-hidden="true" />
      <div className="pulse-orb-core" aria-hidden="true" />
    </div>
  );
}
