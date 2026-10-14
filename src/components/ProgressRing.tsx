import type { ReactNode } from 'react';
import './ProgressRing.css';
import { toTone, type ToneInput } from '../tone';

export type ProgressRingSize = 'sm' | 'md' | 'lg' | 'xl';
export type ProgressRingTone = ToneInput;

export interface ProgressRingProps {
  /** 0–100 (values outside are clamped). Omit for an indeterminate ring. */
  value?: number;
  /** Center label; the ring draws its own padding around it. */
  label?: ReactNode;
  /** Small caption under the center label, e.g. "uploaded". */
  sublabel?: ReactNode;
  size?: ProgressRingSize;
  tone?: ProgressRingTone;
  /** Accessible name. Defaults to the label when it is a string. */
  name?: string;
  className?: string;
}

const SIZES: Record<ProgressRingSize, number> = { sm: 40, md: 64, lg: 96, xl: 128 };

/**
 * Determinate or indeterminate circular progress with a center label — the ring
 * counterpart of ProgressBar. Provenance: original morph-ui design (2026-10).
 */
export function ProgressRing({
  value,
  label,
  sublabel,
  size = 'md',
  tone = 'default',
  name,
  className = '',
}: ProgressRingProps) {
  const px = SIZES[size];
  const stroke = size === 'sm' ? 3 : size === 'md' ? 4 : 6;
  const indeterminate = value === undefined;
  const clamped = indeterminate ? undefined : Math.min(100, Math.max(0, value));
  const r = (px - stroke) / 2;
  const C = 2 * Math.PI * r;
  const pct = clamped === undefined ? 0 : clamped / 100;

  return (
    <div
      className={className}
      data-ring=""
      data-size={size}
      data-indeterminate={indeterminate ? '' : undefined}
      data-tone={((t) => (t === 'neutral' || t === 'info' ? 'default' : t))(toTone(tone))}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      aria-label={name ?? (typeof label === 'string' ? label : indeterminate ? 'Loading' : 'Progress')}
      style={{ '--ring-size': `${px}px` } as React.CSSProperties}
    >
      <svg width={px} height={px} viewBox={`0 0 ${px} ${px}`} aria-hidden="true" data-ringsvg="">
        {/* track */}
        <circle data-ringtrack="" cx={px / 2} cy={px / 2} r={r} fill="none" strokeWidth={stroke} />
        {!indeterminate && (
          <circle
            data-ringvalue=""
            cx={px / 2}
            cy={px / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - pct)}
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
          />
        )}
      </svg>
      {indeterminate && (
        <svg
          className="ring-indet"
          width={px}
          height={px}
          viewBox={`0 0 ${px} ${px}`}
          aria-hidden="true"
          data-ringindetsvg=""
        >
          <circle
            data-ringarc=""
            cx={px / 2}
            cy={px / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${C * 0.22} ${C * 0.78}`}
          />
        </svg>
      )}
      {(label !== undefined || sublabel !== undefined) && (
        <div data-ringlabel="">
          {label !== undefined && <span data-ringtext="">{label}</span>}
          {sublabel !== undefined && <span data-ringsub="">{sublabel}</span>}
        </div>
      )}
    </div>
  );
}
