import type { ReactNode } from 'react';
import './ProgressBar.css';

export type ProgressTone = 'default' | 'success' | 'warn' | 'danger';

export interface ProgressBarProps {
  /** 0–100 (values outside are clamped). Omit for indeterminate. */
  value?: number;
  label?: ReactNode;
  tone?: ProgressTone;
  className?: string;
}

/** Determinate or indeterminate progress for index runs and long generations. */
export function ProgressBar({ value, label, tone = 'default', className = '' }: ProgressBarProps) {
  const clamped = value === undefined ? undefined : Math.min(100, Math.max(0, value));
  return (
    <div className={className} data-progresswrap="">
      {label && <div data-progresslabel="">{label}</div>}
      <div
        data-progress=""
        data-tone={tone}
        data-indeterminate={clamped === undefined ? '' : undefined}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        aria-label={typeof label === 'string' ? label : 'Progress'}
      >
        <span data-progressfill="" style={clamped === undefined ? undefined : { width: `${clamped}%` }} />
      </div>
    </div>
  );
}
