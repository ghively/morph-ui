import type { ReactNode } from 'react';
import './MultiStepProgress.css';

export type MultiStepState = 'complete' | 'current' | 'pending' | 'error';

export interface MultiStep {
  id: string;
  label: string;
  /** Derived from position when omitted. */
  state?: MultiStepState;
  /** Trailing meta, e.g. a duration. */
  hint?: string;
}

export interface MultiStepProgressProps {
  steps: MultiStep[];
  /** Index of the current step. States are derived from it when not given. */
  current?: number;
  /** Accessible name for the track. Default "Progress". */
  label?: string;
  className?: string;
}

const ICON: Record<'complete' | 'error', ReactNode> = {
  complete: (
    <svg width="11" height="11" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1.5 5.5l2.5 2.5 4.5-5.5" />
    </svg>
  ),
  error: (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M2 2l6 6M8 2l-6 6" />
    </svg>
  ),
};

/**
 * Labeled horizontal stage track (pipeline view): numbered nodes joined by a
 * progress rail, one current step, checkmarks behind it. Complements Stepper
 * (wizard navigation) — this one is a read-only report. Provenance: original
 * morph-ui design (2026-10).
 */
export function MultiStepProgress({ steps, current, label = 'Progress', className = '' }: MultiStepProgressProps) {
  const n = steps.length;
  const cur = current === undefined ? steps.findIndex((s) => s.state === 'current') : Math.min(n - 1, Math.max(0, current));
  const stateOf = (s: MultiStep, i: number): MultiStepState =>
    s.state ?? (i < cur ? 'complete' : i === cur ? 'current' : 'pending');

  return (
    <ol className={className} data-msteps="" aria-label={label}>
      {steps.map((s, i) => {
        const st = stateOf(s, i);
        return (
          <li
            key={s.id}
            data-mstep=""
            data-state={st}
            aria-current={st === 'current' ? 'step' : undefined}
          >
            <span data-mnode="" aria-hidden="true">
              {st === 'complete' ? ICON.complete : st === 'error' ? ICON.error : i + 1}
            </span>
            <span data-mtext="">
              <span data-mlabel="">{s.label}</span>
              {s.hint && (
                <span data-mhint="">{s.hint}</span>
              )}
            </span>
            {i < n - 1 && <span data-mrail="" data-lit={i < cur ? '' : undefined} aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}
