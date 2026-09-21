import { useRef, useState } from 'react';
import type { ReactNode, MouseEvent as ReactMouseEvent } from 'react';
import './MagneticButton.css';

export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

export function MagneticButton({
  children,
  variant = 'primary',
  className = '',
  disabled = false,
  onMouseMove,
  onMouseLeave,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: ReactMouseEvent<HTMLButtonElement>) => {
    if (disabled || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Magnetic pull ratio
    setPosition({ x: x * 0.3, y: y * 0.3 });
    onMouseMove?.(e);
  };

  const handleMouseLeave = (e: ReactMouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    setPosition({ x: 0, y: 0 });
    onMouseLeave?.(e);
  };

  return (
    <button
      ref={buttonRef}
      className={`magnetic-button ${className}`}
      data-variant={variant}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      {...props}
    >
      <span className="magnetic-button-glow-container">
        <span className="magnetic-button-glow-layer-1" />
        <span className="magnetic-button-glow-layer-2" />
      </span>
      <span className="magnetic-button-shine" />
      <span className="magnetic-button-content">{children}</span>
    </button>
  );
}
