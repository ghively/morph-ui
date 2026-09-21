import './HandoffCard.css';

export interface HandoffCardProps {
  to: string;
  reason: string;
  /** What the human needs to decide or do. */
  needed?: string;
  summary?: string[];
  urgency?: 'routine' | 'soon' | 'now';
  onAccept?: () => void;
  className?: string;
}

/** Agent → human handoff: who it's for, why, and what they must do. */
export function HandoffCard({ to, reason, needed, summary = [], urgency = 'routine', onAccept, className = '' }: HandoffCardProps) {
  return (
    <div className={className} data-handoff="" data-urgency={urgency}>
      <div data-handoffhead="">
        <span data-handoffkicker="">Handoff · {urgency === 'now' ? 'needs you now' : urgency === 'soon' ? 'needs you soon' : 'whenever'}</span>
        <span data-handoffto="">→ {to}</span>
      </div>
      <p data-handoffreason="">{reason}</p>
      {summary.length > 0 && (
        <ul data-handoffsummary="">
          {summary.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      )}
      {needed && <p data-handoffneeded="">Needed: {needed}</p>}
      {onAccept && (
        <button type="button" data-handoffaccept="" onClick={onAccept}>
          Take over
        </button>
      )}
    </div>
  );
}
