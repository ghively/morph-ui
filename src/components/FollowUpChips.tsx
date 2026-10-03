import './FollowUpChips.css';
import { useFollowUps, type FollowUpChipsProps } from './ragAnswer.shared';

export function FollowUpChips(props: FollowUpChipsProps) {
  const f = useFollowUps(props);
  if (f.empty) return null;
  return (
    <div className={'follow-ups ' + (props.className || '')} data-followups="">
      <div className="follow-ups-label">{f.label}</div>
      <ul className="follow-ups-list" aria-label={f.label} onKeyDown={f.onKeyDown}>
        {f.items.map(it => (
          <li key={it.key}>
            <button type="button" className="follow-ups-row" data-followup="" onClick={it.pick}>
              <span className="follow-ups-p" aria-hidden="true">&gt;</span>
              <span className="follow-ups-text">{it.text}</span>
              <span className="follow-ups-enter" aria-hidden="true">↵</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export type { FollowUpChipsProps } from './ragAnswer.shared';
