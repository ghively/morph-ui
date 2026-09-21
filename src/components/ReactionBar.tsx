import './ReactionBar.css';
import type { MessageReaction } from './MessageTimeline';

export interface ReactionBarProps {
  reactions: MessageReaction[];
  onToggle: (key: string, currentlyMine: boolean) => void;
  label?: string;
  hideWhenEmpty?: boolean;
  className?: string;
}

export function ReactionBar({
  reactions,
  onToggle,
  label = 'Reactions',
  hideWhenEmpty = true,
  className = ''
}: ReactionBarProps) {
  if (reactions.length === 0 && hideWhenEmpty) {
    return null;
  }

  return (
    <div data-reactions="" role="group" aria-label={label} className={className}>
      {reactions.map((r) => (
        <button
          key={r.key}
          data-chip=""
          data-state=""
          data-on={String(!!r.mine)}
          aria-pressed={!!r.mine}
          title={r.senders.join(', ')}
          aria-label={`${r.key} ${r.count}${r.mine ? ', including you' : ''}`}
          onClick={() => onToggle(r.key, !!r.mine)}
        >
          {r.key}
          <span data-num="">{r.count}</span>
        </button>
      ))}
    </div>
  );
}
