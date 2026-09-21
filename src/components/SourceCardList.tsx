import './SourceCardList.css';

export interface SourceCard {
  id: string;
  title: string;
  excerpt: string;
  url?: string;
  department?: string;
  /** 0–1 relevance; renders a meter when present. */
  score?: number;
}

export interface SourceCardListProps {
  sources: SourceCard[];
  activeId?: string;
  onSelect?: (id: string) => void;
  /** Compact rows for drawers and side panels. */
  compact?: boolean;
  emptyText?: string;
  className?: string;
}

/** Retrieved-document cards: the landing target for CitationPills. */
export function SourceCardList({
  sources,
  activeId,
  onSelect,
  compact,
  emptyText = 'No sources retrieved.',
  className = '',
}: SourceCardListProps) {
  if (sources.length === 0) {
    return (
      <div className={className} data-sourcecards="" data-empty="">
        {emptyText}
      </div>
    );
  }
  return (
    <ol className={className} data-sourcecards="" data-compact={compact ? '' : undefined}>
      {sources.map((s, i) => {
        const active = s.id === activeId;
        return (
          <li key={s.id} data-sourcecard="" data-active={active ? '' : undefined} value={i + 1}>
            <button type="button" data-sourcebtn="" onClick={() => onSelect?.(s.id)} aria-current={active || undefined}>
              <span data-sourcetitle="">{s.title}</span>
              {!compact && <span data-sourceexcerpt="">{s.excerpt}</span>}
              <span data-sourcemeta="">
                {s.department && <span data-sourcedept="">{s.department}</span>}
                {s.score !== undefined && (
                  <span data-sourcescore="" role="img" aria-label={`Relevance ${Math.round(s.score * 100)} percent`}>
                    <span data-scorescale="">
                      <span data-scorefill="" style={{ width: `${Math.round(s.score * 100)}%` }} />
                    </span>
                    {Math.round(s.score * 100)}%
                  </span>
                )}
                {s.url && (
                  <a href={s.url} onClick={(e) => e.stopPropagation()} data-sourcelink="">
                    Open
                  </a>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
