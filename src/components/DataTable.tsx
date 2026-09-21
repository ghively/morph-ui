import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import './DataTable.css';

export type SortDirection = 'asc' | 'desc';
export type ColumnAlign = 'left' | 'center' | 'right';

export interface DataColumn<TRow> {
  /** Key into the row, used as the default cell value and sort value. */
  key: string;
  header: string;
  align?: ColumnAlign;
  sortable?: boolean;
  /** Custom cell. Receives the full row. */
  render?: (row: TRow) => ReactNode;
}

export interface DataTableProps<TRow> {
  columns: DataColumn<TRow>[];
  rows: TRow[];
  rowKey: (row: TRow, index: number) => string;
  caption?: string;
  emptyText?: string;
  defaultSortKey?: string;
  defaultSortDir?: SortDirection;
  onSortChange?: (key: string, dir: SortDirection) => void;
  className?: string;
}

function comparable(value: unknown): string | number {
  if (typeof value === 'number') return value;
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (value === null || value === undefined) return '';
  return String(value);
}

/**
 * Generic data grid for RAG result sets: department metrics, source lists,
 * retrieval rankings. Sortable columns, sticky header, empty state.
 * Rows are `Record`-shaped; use `render` for rich cells (badges, links).
 */
export function DataTable<TRow extends Record<string, unknown>>({
  columns,
  rows,
  rowKey,
  caption,
  emptyText = 'No rows to show.',
  defaultSortKey,
  defaultSortDir = 'asc',
  onSortChange,
  className = '',
}: DataTableProps<TRow>) {
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey);
  const [sortDir, setSortDir] = useState<SortDirection>(defaultSortDir);

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = comparable(a[sortKey]);
      const bv = comparable(b[sortKey]);
      if (av < bv) return -dir;
      if (av > bv) return dir;
      return 0;
    });
  }, [rows, sortKey, sortDir]);

  const toggleSort = (key: string) => {
    let nextDir: SortDirection = 'asc';
    if (sortKey === key) {
      nextDir = sortDir === 'asc' ? 'desc' : 'asc';
    }
    setSortKey(key);
    setSortDir(nextDir);
    onSortChange?.(key, nextDir);
  };

  return (
    <div className={className} data-tablewrap="">
      <table data-table="">
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {columns.map((col) => {
              const active = sortKey === col.key;
              return (
                <th
                  key={col.key}
                  data-align={col.align ?? 'left'}
                  aria-sort={col.sortable ? (active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none') : undefined}
                >
                  {col.sortable ? (
                    <button type="button" data-sortbtn="" onClick={() => toggleSort(col.key)} aria-label={`Sort by ${col.header}`}>
                      <span>{col.header}</span>
                      <span data-sorticon="" data-dir={active ? sortDir : undefined} aria-hidden="true">
                        {active ? (sortDir === 'asc' ? '▲' : '▼') : '△'}
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={rowKey(row, i)}>
              {columns.map((col) => (
                <td key={col.key} data-align={col.align ?? 'left'}>
                  {col.render ? col.render(row) : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={columns.length} data-emptycell="">
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
