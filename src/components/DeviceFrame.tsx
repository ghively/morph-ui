import type { ReactNode } from 'react';
import './DeviceFrame.css';

export interface DeviceFrameProps {
  children: ReactNode;
  width?: string | number;
  className?: string;
  showNotch?: boolean;
}

export function DeviceFrame({ 
  children, 
  width = 300, 
  className = '',
  showNotch = true
}: DeviceFrameProps) {
  const containerStyle = {
    ...(typeof width === 'number' ? { width: `${width}px` } : { width })
  } as React.CSSProperties;

  return (
    <div 
      className={`device-frame-container ${className}`} 
      data-device-frame
    >
      <div className="device-frame-bezel" style={containerStyle}>
        {showNotch && <div className="device-frame-notch" aria-hidden="true" />}
        <div className="device-frame-screen" role="region" aria-label="Device Screen">
          {children}
        </div>
      </div>
    </div>
  );
}
