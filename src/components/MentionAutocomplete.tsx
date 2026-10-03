import './MentionAutocomplete.css';
import { useRef } from 'react';
import { InitialsAvatar } from './InitialsAvatar';
import { useActiveInView, type MentionAutocompleteProps } from './chatmsg.shared';

export function MentionAutocomplete({ trigger, candidates, activeIndex, onActiveIndexChange, onPick, groupLabel = 'Agents & people', label = 'Mention someone', className = '' }: MentionAutocompleteProps) {
  const ref = useRef<HTMLDivElement>(null);
  useActiveInView(ref, activeIndex);
  if (!trigger || !candidates.length) return null;
  return (
    <div ref={ref} className={'mention ' + className} data-pop="" data-menu="" id="mention-list" role="listbox" aria-label={label}>
      {candidates.some(c => c.agentLabel) && <div className="mention-eyebrow" data-mentioneyebrow="">{groupLabel}</div>}
      {candidates.map((c, i) => (
        <button key={c.id} id={'mention-opt-' + i} type="button" className="mention-item" data-mentionitem="" role="option" aria-selected={i === activeIndex}
          onMouseEnter={() => i !== activeIndex && onActiveIndexChange(i)} onMouseDown={e => { e.preventDefault(); onPick(c); }}>
          <InitialsAvatar name={c.name} src={c.avatarUrl} agent={!!c.agentLabel} size="sm" className="mention-avatar" />
          <span className="mention-name" data-strong="">{c.name}</span>
          {c.agentLabel && <span className="mention-tag" data-tag="" data-solid="">{c.agentLabel}</span>}
          <span className="mention-id" data-mentionnum="">{c.id}</span>
        </button>
      ))}
    </div>
  );
}

export { findMentionTrigger, applyMention, rankMentionCandidates } from './chatmsg.shared';
export type { MentionCandidate, MentionTrigger, MentionAutocompleteProps } from './chatmsg.shared';
