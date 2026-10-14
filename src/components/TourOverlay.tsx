import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import './TourOverlay.css';
import { OnboardingSpotlight, type SpotlightTarget } from './OnboardingSpotlight';

export interface TourStep {
  id: string;
  /** Ref or CSS selector of the element this step highlights. */
  target: SpotlightTarget;
  title: ReactNode;
  body?: ReactNode;
}

export interface TourOverlayProps {
  steps: TourStep[];
  open?: boolean;
  /** Index of the active step (uncontrolled by default). */
  step?: number;
  onStepChange?: (index: number) => void;
  /** Fires with the last completed index (Next on the final step). */
  onFinish?: () => void;
  /** Fires on Skip or Escape. */
  onSkip?: () => void;
  nextLabel?: string;
  backLabel?: string;
  skipLabel?: string;
  finishLabel?: string;
  /** Show the Skip control. Default true. */
  skippable?: boolean;
  /** Accessible name. Default "Tour". */
  label?: string;
  className?: string;
}

/**
 * Multi-step product tour: a sequence of spotlight steps with dot indicators,
 * Back/Next and keyboard navigation (←/→ move, Escape skips). Each step
 * highlights and frames its target; the final Next finishes the tour.
 * Provenance: original morph-ui design (2026-10).
 */
export function TourOverlay({
  steps,
  open = true,
  step: stepProp,
  onStepChange,
  onFinish,
  onSkip,
  nextLabel = 'Next',
  backLabel = 'Back',
  skipLabel = 'Skip tour',
  finishLabel = 'Finish',
  skippable = true,
  label = 'Tour',
  className = '',
}: TourOverlayProps) {
  const [idxState, setIdxState] = useState(0);
  const idx = stepProp ?? idxState;
  const n = steps.length;
  const safe = Math.min(n - 1, Math.max(0, idx));
  const cur = steps[safe];
  const last = safe === n - 1;

  const go = useCallback(
    (i: number) => {
      const next = Math.min(n - 1, Math.max(0, i));
      if (stepProp === undefined) setIdxState(next);
      onStepChange?.(next);
    },
    [n, stepProp, onStepChange],
  );

  const next = useCallback(() => {
    if (last) onFinish?.();
    else go(safe + 1);
  }, [last, onFinish, go, safe]);

  const back = useCallback(() => go(safe - 1), [go, safe]);

  const skip = useCallback(() => onSkip?.(), [onSkip]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        back();
      } else if (e.key === 'Escape') {
        e.stopPropagation();
        skip();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, next, back, skip]);

  if (!open || !cur) return null;

  return (
    <div className={className} data-tour="" aria-label={label}>
      <OnboardingSpotlight
        target={cur.target}
        open={open}
        title={cur.title}
        step={safe + 1}
        of={n}
        label={`${label}, step ${safe + 1} of ${n}`}
        onNext={next}
        onSkip={skip}
        nextLabel={last ? finishLabel : nextLabel}
        skipLabel={skipLabel}
      >
        {cur.body}
        <div data-tourdots="" role="tablist" aria-label={`${label} steps`} onClick={(e) => e.stopPropagation()}>
          {steps.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              data-tourdot=""
              data-on={i === safe ? '' : undefined}
              data-done={i < safe ? '' : undefined}
              aria-selected={i === safe}
              aria-label={`Step ${i + 1}: ${typeof s.title === 'string' ? s.title : s.id}`}
              tabIndex={i === safe ? 0 : -1}
              onClick={() => go(i)}
            />
          ))}
        </div>
        {(safe > 0 || !skippable) && (
          <div data-tournav="">
            {safe > 0 && (
              <button type="button" data-tourback="" onClick={back}>
                {backLabel}
              </button>
            )}
            {!skippable && <span data-tourhint="">Esc to exit</span>}
          </div>
        )}
      </OnboardingSpotlight>
    </div>
  );
}
