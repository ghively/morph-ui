import { InitialsAvatar } from './InitialsAvatar';
import './TypingIndicator.css';

export interface TypingParticipant {
  id: string;
  name: string;
  avatarUrl?: string | null;
  isAgent?: boolean;
}

export interface TypingIndicatorProps {
  participants: TypingParticipant[];
  singularLabel?: string;
  agentSingularLabel?: string;
  pluralLabel?: string;
  className?: string;
}

export function TypingIndicator({
  participants,
  singularLabel = 'is typing',
  agentSingularLabel = 'is working',
  pluralLabel = 'are typing',
  className = ''
}: TypingIndicatorProps) {
  
  let verb = '';
  if (participants.length === 1) {
    verb = participants[0]!.isAgent ? agentSingularLabel : singularLabel;
  } else if (participants.length > 1) {
    verb = pluralLabel;
  }
  
  const names = participants.map(p => p.name).join(', ');
  const first = participants[0];

  return (
    <div data-collapse="" data-open={String(participants.length > 0)} aria-live="polite" className={className}>
      <div>
        {participants.length > 0 && (
          <div data-turn="assistant" data-typingrow="" style={{ alignItems: "center", padding: "0 24px var(--s1)", maxWidth: 828, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
            {first?.avatarUrl ? (
              <img src={first.avatarUrl} alt="" className="typing-avatar-img" data-ring="" />
            ) : (
              <InitialsAvatar name={first?.name ?? ''} agent={first?.isAgent} working className="typing-avatar" />
            )}
            <div data-typing="">
              <i />
              <i />
              <i />
              <span style={{ marginLeft: "var(--s2)", fontSize: "var(--t-ctl)", color: "var(--app-faint)" }}>
                {names} {verb}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
