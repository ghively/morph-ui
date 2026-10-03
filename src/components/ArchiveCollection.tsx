import { useMemo, type KeyboardEvent, type CSSProperties } from 'react';
import './ArchiveCollection.css';

export interface ArchiveEntry {
  id: string;
  date: string; // ISO string
  title: string;
  summary?: string;
  tags?: string[];
}

export interface ArchiveCollectionProps {
  entries: ArchiveEntry[];
  groupBy?: 'month' | 'none';
  filter?: string;
  onSelectEntry?: (id: string) => void;
  emptyMessage?: string;
  /** Highlights the matching entry. */
  selectedId?: string;
  className?: string;
}

const tagTone = (t: string) => `var(--series-${(Array.from(t).reduce((a, c) => a + c.charCodeAt(0), 0) % 6) + 1})`;

export function ArchiveCollection({ entries, groupBy = 'month', filter = '', onSelectEntry, emptyMessage = 'No entries found', selectedId, className = '' }: ArchiveCollectionProps) {
  const groups = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const list = q
      ? entries.filter(e => e.title.toLowerCase().includes(q) || e.summary?.toLowerCase().includes(q) || e.tags?.some(t => t.toLowerCase().includes(q)))
      : entries;
    const out: { key: string; label: string; items: ArchiveEntry[] }[] = [];
    for (const e of list) {
      const d = new Date(e.date);
      const key = groupBy === 'none' ? 'all' : `${d.getFullYear()}-${d.getMonth()}`;
      let g = out.find(x => x.key === key);
      if (!g) { g = { key, label: groupBy === 'none' ? 'All' : d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }), items: [] }; out.push(g); }
      g.items.push(e);
    }
    return out;
  }, [entries, groupBy, filter]);

  const activate = (id: string) => (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectEntry?.(id); }
  };

  if (!groups.length) {
    return (
      <div className={`archive-collection ${className}`.trim()} data-archive-collection="" data-testid="archive-collection">
        <div className="archive-empty" data-archive-empty="">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={`archive-collection ${className}`.trim()} data-archive-collection="" data-testid="archive-collection">
      {groups.map(g => (
        <section key={g.key} className="archive-group" data-archive-group="">
          {groupBy === 'month' && <div className="archive-gh" data-archive-group-header="">{g.label}<span>{g.items.length}</span></div>}
          <div className="archive-rail">
            {g.items.map(e => {
              const d = new Date(e.date);
              return (
                <div
                  key={e.id}
                  className={`archive-entry ${selectedId === e.id ? 'is-sel' : ''}`}
                  data-archive-entry=""
                  role="button"
                  tabIndex={0}
                  aria-pressed={selectedId != null ? selectedId === e.id : undefined}
                  data-testid={`archive-entry-${e.id}`}
                  onClick={() => onSelectEntry?.(e.id)}
                  onKeyDown={activate(e.id)}
                >
                  <div className="archive-date" data-archive-entry-date="">
                    <b>{d.getDate()}</b>
                    <span>{d.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                  </div>
                  <span className="archive-node" aria-hidden="true" />
                  <div className="archive-card" data-archive-entry-content="">
                    <div className="archive-title" data-archive-entry-title="">{e.title}</div>
                    {e.summary && <p className="archive-sum" data-archive-entry-summary="">{e.summary}</p>}
                    {e.tags && e.tags.length > 0 && (
                      <div className="archive-tags" data-archive-entry-tags="">
                        {e.tags.map(t => <span key={t} data-archive-entry-tag="" style={{ ['--tc' as string]: tagTone(t) } as CSSProperties}>{t}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
