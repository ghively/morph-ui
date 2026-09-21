import { useMemo, type KeyboardEvent } from 'react';
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
}

export function ArchiveCollection({
  entries,
  groupBy = 'month',
  filter = '',
  onSelectEntry,
  emptyMessage = 'No entries found',
}: ArchiveCollectionProps) {
  
  const filteredEntries = useMemo(() => {
    if (!filter.trim()) return entries;
    const lowerFilter = filter.toLowerCase();
    
    return entries.filter(entry => {
      if (entry.title.toLowerCase().includes(lowerFilter)) return true;
      if (entry.summary && entry.summary.toLowerCase().includes(lowerFilter)) return true;
      if (entry.tags && entry.tags.some(tag => tag.toLowerCase().includes(lowerFilter))) return true;
      return false;
    });
  }, [entries, filter]);

  const groupedEntries = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All': filteredEntries };
    }

    const groups: Record<string, ArchiveEntry[]> = {};
    for (const entry of filteredEntries) {
      const dateObj = new Date(entry.date);
      // Format: "Month Year" e.g., "September 2026"
      const monthYear = dateObj.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(entry);
    }
    return groups;
  }, [filteredEntries, groupBy]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectEntry?.(id);
    }
  };

  if (filteredEntries.length === 0) {
    return (
      <div data-archive-collection="" data-testid="archive-collection">
        <div data-archive-empty="">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div data-archive-collection="" data-testid="archive-collection">
      {Object.entries(groupedEntries).map(([group, groupEntries]) => (
        <div key={group} data-archive-group="">
          {groupBy === 'month' && (
            <div data-archive-group-header="">
              {group}
            </div>
          )}
          {groupEntries.map(entry => (
            <div
              key={entry.id}
              data-archive-entry=""
              role="button"
              tabIndex={0}
              onClick={() => onSelectEntry?.(entry.id)}
              onKeyDown={(e) => handleKeyDown(e, entry.id)}
              data-testid={`archive-entry-${entry.id}`}
            >
              <div data-archive-entry-date="">
                {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </div>
              <div data-archive-entry-content="">
                <div data-archive-entry-title="">{entry.title}</div>
                {entry.summary && (
                  <p data-archive-entry-summary="">{entry.summary}</p>
                )}
                {entry.tags && entry.tags.length > 0 && (
                  <div data-archive-entry-tags="">
                    {entry.tags.map(tag => (
                      <span key={tag} data-archive-entry-tag="">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
