import { useRef } from 'react';
import './MentionAutocomplete.css';
import { useKeepInView, initials, Match, type MentionAutocompleteProps } from './forms.shared';

export function MentionAutocomplete({ trigger, candidates, activeIndex, onActiveIndexChange, onPick, groupLabel = 'Agents & people', label = 'Mention someone', className = '' }: MentionAutocompleteProps) {
  const listRef = useRef<HTMLDivElement>(null);
  useKeepInView(listRef, activeIndex, !!trigger);
  if (!trigger || candidates.length === 0) return null;
  const hasAgent = candidates.some(c => !!c.agentLabel);
  return (
    <div className={('mention-pop ' + className).trim()} data-pop="" data-menu="" id="mention-list" role="listbox" aria-label={label} ref={listRef}>
      {hasAgent && <div data-mentioneyebrow="" aria-hidden="true">{groupLabel}</div>}
      {candidates.map((c, i) => (
        <button key={c.id} id={'mention-opt-' + i} type="button" tabIndex={-1} data-mentionitem="" data-agent={c.agentLabel ? '' : undefined} data-active={i === activeIndex ? '' : undefined}
          role="option" aria-selected={i === activeIndex} onMouseDown={e => { e.preventDefault(); onPick(c); }} onMouseEnter={() => { if (i !== activeIndex) onActiveIndexChange(i); }}>
          <span data-avatar="" data-size="sm" aria-hidden="true" style={c.avatarUrl ? { backgroundImage: 'url(' + JSON.stringify(c.avatarUrl) + ')' } : undefined}>{c.avatarUrl ? null : initials(c.name)}</span>
          <span data-strong=""><Match text={c.name} query={trigger.query} /></span>
          {c.agentLabel && <span data-tag="" data-solid="">{c.agentLabel}</span>}
          <span data-mentionnum="">{c.id}</span>
        </button>
      ))}
    </div>
  );
}

export { findMentionTrigger, applyMention, rankMentionCandidates } from './forms.shared';
export type { MentionCandidate, MentionTrigger, MentionAutocompleteProps } from './forms.shared';
