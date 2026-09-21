import './MentionAutocomplete.css';

export interface MentionCandidate {
  id: string;
  name: string;
  avatarUrl?: string | null;
  /** Non-null marks an agent and sorts it first; the string is the badge label. */
  agentLabel?: string | null;
}

export interface MentionTrigger {
  /** Index in the text where the '@' sits. */
  start: number;
  /** Text typed after the '@'. */
  query: string;
}

export interface MentionAutocompleteProps {
  /** Null hides the popover. */
  trigger: MentionTrigger | null;
  candidates: MentionCandidate[];
  activeIndex: number;
  onActiveIndexChange: (i: number) => void;
  onPick: (candidate: MentionCandidate) => void;
  /** Group eyebrow, shown only when at least one candidate is an agent. */
  groupLabel?: string;                // default 'Agents & people'
  label?: string;                     // aria-label, default 'Mention someone'
  className?: string;
}

/** Pure: finds an active '@' trigger in `text` at `caret`, or null. Exported. */
export function findMentionTrigger(text: string, caret: number): MentionTrigger | null {
  const m = /(^|\s)@([^\s@]{0,32})$/.exec(text.slice(0, caret));
  if (m) {
    return {
      start: caret - m[2]!.length - 1,
      query: m[2]!,
    };
  }
  return null;
}

/** Pure: applies a pick, returning the new text and the caret position. Exported. */
export function applyMention(
  text: string, trigger: MentionTrigger, caret: number, name: string
): { text: string; caret: number } {
  const newText = `${text.slice(0, trigger.start)}@${name} ${text.slice(caret)}`;
  const newCaret = trigger.start + name.length + 2;
  return { text: newText, caret: newCaret };
}

/** Pure: filter + agent-first sort + cap. Exported. */
export function rankMentionCandidates(
  candidates: MentionCandidate[], query: string, limit: number = 8
): MentionCandidate[] {
  const q = query.toLowerCase();
  const filtered = candidates.filter(
    (c) => !q || c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
  );
  filtered.sort(
    (a, b) => Number(!!b.agentLabel) - Number(!!a.agentLabel) || a.name.localeCompare(b.name)
  );
  return filtered.slice(0, limit);
}

export function MentionAutocomplete({
  trigger,
  candidates,
  activeIndex,
  onPick,
  groupLabel = 'Agents & people',
  label = 'Mention someone',
}: MentionAutocompleteProps) {
  if (!trigger || candidates.length === 0) return null;

  const hasAgent = candidates.some((c) => !!c.agentLabel);

  return (
    <div
      data-pop=""
      data-menu=""
      id="mention-list"
      role="listbox"
      aria-label={label}
      style={{
        position: 'absolute',
        left: 'var(--s5)',
        bottom: 'calc(100% + 6px)',
        width: 320,
        maxWidth: 'calc(100% - 2 * var(--s5))',
        padding: 'var(--s2)',
        zIndex: 5,
      }}
    >
      {hasAgent && (
        <div data-eyebrow="" style={{ margin: 'var(--s1) var(--s2)' }}>
          {groupLabel}
        </div>
      )}
      {candidates.map((c, i) => (
        <button
          key={c.id}
          id={`mention-opt-${i}`}
          type="button"
          data-menuitem=""
          role="option"
          aria-selected={i === activeIndex}
          onMouseDown={(e) => {
            e.preventDefault();
            onPick(c);
          }}
        >
          {/* Avatar simulation using div, since no standard Avatar provided in shared dependencies */}
          <div data-avatar="" data-size="sm" style={{ 
              width: 24, height: 24, borderRadius: '50%', background: 'var(--app-faint)', flex: 'none', 
              backgroundImage: c.avatarUrl ? `url(${c.avatarUrl})` : undefined, backgroundSize: 'cover'
            }} />
          <span data-strong="">{c.name}</span>
          {c.agentLabel && (
            <span data-tag="" data-solid="">
              {c.agentLabel}
            </span>
          )}
          <span
            data-num=""
            style={{
              marginLeft: 'auto',
              color: 'var(--app-faint)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {c.id}
          </span>
        </button>
      ))}
    </div>
  );
}
