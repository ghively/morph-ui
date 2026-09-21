import './CitationPills.css';

export interface Citation {
  /** Source id; clicking a pill selects it (e.g. highlights the source card). */
  id: string;
  /** 1-based marker number. Defaults to position in the array. */
  index?: number;
}

export interface CitationPillsProps {
  citations: Citation[];
  activeId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

/** Inline [1] [2] markers rendered after an answer; pair with SourceCardList. */
export function CitationPills({ citations, activeId, onSelect, className = '' }: CitationPillsProps) {
  if (citations.length === 0) return null;
  return (
    <span className={className} data-citations="" aria-label="Citations">
      {citations.map((c, i) => {
        const n = c.index ?? i + 1;
        const active = c.id === activeId;
        return (
          <button
            key={c.id}
            type="button"
            data-cite=""
            data-active={active ? '' : undefined}
            aria-label={`Source ${n}`}
            aria-pressed={onSelect ? active : undefined}
            onClick={() => onSelect?.(c.id)}
          >
            {n}
          </button>
        );
      })}
    </span>
  );
}
