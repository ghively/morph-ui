import './GroundingBadge.css';

export type GroundingVerdict = 'grounded' | 'partial' | 'ungrounded';

export interface GroundingBadgeProps {
  verdict: GroundingVerdict;
  /** e.g. "4 of 5 claims cited". Rendered next to the verdict. */
  detail?: string;
  className?: string;
}

/** Per-answer grounding verdict. Ungrounded answers are never subtle. */
export function GroundingBadge({ verdict, detail, className = '' }: GroundingBadgeProps) {
  const label = verdict === 'grounded' ? 'Grounded' : verdict === 'partial' ? 'Partially grounded' : 'Ungrounded';
  return (
    <span className={className} data-grounding="" data-verdict={verdict} role="status">
      <span data-groundingdot="" aria-hidden="true" />
      {label}
      {detail && <span data-groundingdetail="">· {detail}</span>}
    </span>
  );
}
