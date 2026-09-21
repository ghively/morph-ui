import './AuroraGlowCard.css';

export interface AuroraGlowCardProps {
  children: React.ReactNode;
  active?: boolean;
  intensity?: number;
  glowColor1?: string;
  glowColor2?: string;
  glowColor3?: string;
  className?: string;
}

export function AuroraGlowCard({
  children,
  active = true,
  intensity = 1,
  glowColor1 = 'var(--app-blue)',
  glowColor2 = 'var(--color-info-text)',
  glowColor3 = 'var(--app-faint)',
  className = ''
}: AuroraGlowCardProps) {
  return (
    <div 
      className={`aurora-glow-card ${className}`} 
      data-aurora-glow-card=""
      data-active={active ? "true" : "false"}
      style={{
        '--aurora-intensity': intensity,
        '--aurora-color-1': glowColor1,
        '--aurora-color-2': glowColor2,
        '--aurora-color-3': glowColor3,
      } as React.CSSProperties}
    >
      <div className="aurora-glow-card-border" aria-hidden="true" />
      <div className="aurora-glow-card-content">
        {children}
      </div>
    </div>
  );
}
