import './ReactionBar.css';
import type { ReactionBarProps } from './chatmsg.shared';

export function ReactionBar({ reactions, onToggle, label = 'Reactions', hideWhenEmpty = true, className = '' }: ReactionBarProps) {
  if (!reactions.length && hideWhenEmpty) return null;
  return (
    <div className={'reactions ' + className} data-reactions="" role="group" aria-label={label}>
      {reactions.map(r => (
        <button key={r.key} type="button" className="reactions-chip" data-chip="" data-state="" data-on={String(!!r.mine)} aria-pressed={!!r.mine}
          title={r.senders.join(', ')} aria-label={r.key + ' ' + r.count + (r.mine ? ', including you' : '')} onClick={() => onToggle(r.key, !!r.mine)}>
          {r.key}
          <span className="reactions-n" data-num="">{r.count}</span>
        </button>
      ))}
    </div>
  );
}

export type { ReactionBarProps } from './chatmsg.shared';
