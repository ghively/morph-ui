import type { ReactNode } from 'react';
import './Divider.css';

export interface DividerProps {
  /** Optional centered caption. Omit for a plain rule. */
  label?: ReactNode;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

/** Thematic break between dashboard sections. */
export function Divider({ label, orientation = 'horizontal', className = '' }: DividerProps) {
  return (
    <div className={className} data-divider="" data-orientation={orientation} role="separator" aria-orientation={orientation}>
      {label && <span data-dividerlabel="">{label}</span>}
    </div>
  );
}
