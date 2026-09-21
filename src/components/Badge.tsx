import type { ReactNode } from 'react';
import './Badge.css';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warn' | 'danger';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  size?: BadgeSize;
  className?: string;
}

/** Compact status pill for RAG citations, pipeline states, and department tags. */
export function Badge({ children, tone = 'neutral', size = 'md', className = '' }: BadgeProps) {
  return (
    <span className={className} data-badge="" data-tone={tone} data-size={size}>
      {children}
    </span>
  );
}
