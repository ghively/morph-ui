import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import './OnboardingSpotlight.css';

export type SpotlightTarget = RefObject<HTMLElement | null> | string;

export interface OnboardingSpotlightProps {
  /** Element to highlight: a ref or a CSS selector resolved on the owner document. */
  target: SpotlightTarget;
  title: ReactNode;
  /** Coach body text. */
  children?: ReactNode;
  /** Show it. Default true. */
  open?: boolean;
  onNext?: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  skipLabel?: string;
  /** "2 of 5" counter; omit to hide. */
  step?: number;
  of?: number;
  /** Accessible name. Default "Guided tip". */
  label?: string;
  /** Extra breathing room around the target in px. Default 8. */
  pad?: number;
  className?: string;
}

interface Rect { x: number; y: number; w: number; h: number }

const ZERO: Rect = { x: 0, y: 0, w: 0, h: 0 };

function resolve(target: SpotlightTarget): HTMLElement | null {
  if (typeof target === 'string') {
    return typeof document !== 'undefined' ? document.querySelector<HTMLElement>(target) : null;
  }
  return target.current ?? null;
}

/**
 * Single-step onboarding highlight: dims the surface, frames the target with a
 * pulsing ring, and floats a coach tooltip with next/skip actions. Escape skips.
 * TourOverlay strings several of these into a sequence. Provenance: original
 * morph-ui design (2026-10).
 */
export function OnboardingSpotlight({
  target,
  title,
  children,
  open = true,
  onNext,
  onSkip,
  nextLabel = 'Next',
  skipLabel = 'Skip',
  step,
  of,
  label = 'Guided tip',
  pad = 8,
  className = '',
}: OnboardingSpotlightProps) {
  const [rect, setRect] = useState<Rect>(ZERO);
  const [below, setBelow] = useState(true);
  const tipRef = useRef<HTMLDivElement>(null);

  const measure = useCallback(() => {
    const el = resolve(target);
    if (!el) return;
    const r = el.getBoundingClientRect();
    setRect({ x: r.left, y: r.top, w: r.width, h: r.height });
    setBelow(r.top + r.height / 2 < (typeof window !== 'undefined' ? window.innerHeight / 2 : 1e9));
  }, [target]);

  useLayoutEffect(() => {
    if (!open) return;
    measure();
    const onMove = () => measure();
    window.addEventListener('resize', onMove);
    window.addEventListener('scroll', onMove, true);
    return () => {
      window.removeEventListener('resize', onMove);
      window.removeEventListener('scroll', onMove, true);
    };
  }, [open, measure, target]);

  useEffect(() => {
    if (!open) return;
    tipRef.current?.focus({ preventScroll: true });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onSkip?.();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open, onSkip]);

  if (!open) return null;

  const counter = step !== undefined && of !== undefined ? `${step} of ${of}` : null;

  return (
    <div className={className} data-spotlight="" data-below={below ? '' : undefined} aria-label={label}>
      <div data-spotscrim="" aria-hidden="true" />
      <div
        data-spothole=""
        aria-hidden="true"
        style={{
          left: rect.x - pad,
          top: rect.y - pad,
          width: rect.w + pad * 2,
          height: rect.h + pad * 2,
        }}
      />
      <div
        ref={tipRef}
        data-spotip=""
        role="dialog"
        aria-modal="false"
        aria-label={typeof title === 'string' ? title : label}
        tabIndex={-1}
        style={
          below
            ? { top: rect.y + rect.h + pad + 12 }
            : { bottom: (typeof window !== 'undefined' ? window.innerHeight : 0) - rect.y + pad + 12 }
        }
      >
        {counter && (
          <span data-spotstep="">{counter}</span>
        )}
        <div data-spottitle="">{title}</div>
        {children && <div data-spotbody="">{children}</div>}
        <div data-spotactions="">
          <button type="button" data-spotskip="" onClick={onSkip}>
            {skipLabel}
          </button>
          <button type="button" data-spotnext="" onClick={onNext}>
            {nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
