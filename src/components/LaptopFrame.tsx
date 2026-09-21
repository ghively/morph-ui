import type { ReactNode } from 'react';
import './LaptopFrame.css';

export interface LaptopFrameProps {
  children: ReactNode;
  className?: string;
  animateOpen?: boolean;
}

export function LaptopFrame({ children, className = '', animateOpen = true }: LaptopFrameProps) {
  return (
    <div className={`laptop-frame-wrapper ${animateOpen ? 'animate-open' : ''} ${className}`} data-laptop-frame>
      <div className="laptop-screen-lid">
        <div className="laptop-bezel">
          <div className="laptop-camera"></div>
          <div className="laptop-screen">
            {children}
          </div>
        </div>
        <div className="laptop-lid-bottom-curve"></div>
      </div>
      <div className="laptop-base">
        <div className="laptop-keyboard-recess"></div>
        <div className="laptop-trackpad"></div>
        <div className="laptop-thumb-notch"></div>
      </div>
      <div className="laptop-base-bottom"></div>
    </div>
  );
}
