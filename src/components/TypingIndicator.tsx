import './TypingIndicator.css';
import { InitialsAvatar } from './InitialsAvatar';
import { typingLine, type TypingIndicatorProps } from './chatmsg.shared';

export function TypingIndicator({ participants, singularLabel = 'is typing', agentSingularLabel = 'is working', pluralLabel = 'are typing', className = '' }: TypingIndicatorProps) {
  const first = participants[0];
  return (
    <div className={'typing ' + className} data-collapse="" data-open={String(!!first)} aria-live="polite">
      <div className="typing-in">
        {first && (
          <div className="typing-row" data-turn="assistant" data-typingrow="">
            <InitialsAvatar name={first.name} src={first.avatarUrl} agent={first.isAgent} working className="typing-avatar" />
            <div className="typing-dots" data-typing="" data-agent={first.isAgent ? '' : undefined}>
              <i /><i /><i />
              <span className="typing-text">{typingLine(participants, singularLabel, agentSingularLabel, pluralLabel)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export type { TypingParticipant, TypingIndicatorProps } from './chatmsg.shared';
