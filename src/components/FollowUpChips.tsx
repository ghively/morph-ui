import './FollowUpChips.css';

export interface FollowUpChipsProps {
  suggestions: string[];
  onPick?: (suggestion: string) => void;
  label?: string;
  className?: string;
}

/** Suggested next questions rendered under an answer. One click, zero typing. */
export function FollowUpChips({ suggestions, onPick, label = 'Follow up', className = '' }: FollowUpChipsProps) {
  if (suggestions.length === 0) return null;
  return (
    <div className={className} data-followups="">
      <span data-followupslabel="">{label}</span>
      <div data-followupchips="" role="group" aria-label={typeof label === 'string' ? label : 'Follow-up questions'}>
        {suggestions.map((s) => (
          <button key={s} type="button" data-followup="" onClick={() => onPick?.(s)}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
