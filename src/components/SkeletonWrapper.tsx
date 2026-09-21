import type { ReactNode, CSSProperties } from 'react';
import './SkeletonWrapper.css';

export interface SkeletonWrapperProps {
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function SkeletonWrapper({ 
  children, 
  isLoading = true,
  className = '',
  style
}: SkeletonWrapperProps) {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div 
      data-skeleton-wrapper 
      aria-busy="true" 
      aria-hidden="true"
      className={className}
      style={style}
    >
      {children}
    </div>
  );
}
