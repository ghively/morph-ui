import './TreeTable.css';
import { useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

export type TreeSortDir = 'asc' | 'desc';

export interface TreeTableColumn<TRow> {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  /** Value used for sorting. Defaults to `row[key]`. */
  sortValue?: (row: TRow) => string | number;
  /** Custom cell renderer. Defaults to `String(row[key] ?? '')`. */
  render?: (row: TRow) => ReactNode;
}

export interface TreeTableRow<TRow> {
  id: string;
  /** Child rows; flattened by expand state. */
  children?: TreeTableRow<TRow>[];
  data: TRow;
}

export interface TreeTableProps<TRow = Record<string, unknown>> {
  columns: TreeTableColumn<TRow>[];
  rows: TreeTableRow<TRow>[];
  /** Keys of rows expanded by default (any depth). */
  defaultExpandedIds?: string[];
  defaultSortKey?: string;
  defaultSortDir?: TreeSortDir;
  onSortChange?: (key: string, dir: TreeSortDir) => void;
  onExpandedChange?: (ids: string[]) => void;
  rowMeta?: (row: TreeTableRow<TRow>, totalDescendants: number) => ReactNode;
  caption?: string;
  emptyText?: string;
  className?: string;
}

interface FlatRow<TRow> {
  node: TreeTableRow<TRow>;
  depth: number;
  hasChildren: boolean;
  descendants: number;
}

function countDescendants<TRow>(node: TreeTableRow<TRow>): number {
  let n = 0;
  for (const c of node.children ?? []) n += 1 + countDescendants(c);
  return n;
}

/** Depth-first flatten of visible rows, optionally sorting siblings. */
function flatten<TRow extends Record<string, unknown>>(
  rows: TreeTableRow<TRow>[],
  expanded: Set<string>,
  columns: TreeTableColumn<TRow>[],
  sortKey: string | undefined,
  sortDir: TreeSortDir,
  depth: number,
  out: FlatRow<TRow>[],
): FlatRow<TRow>[] {
  const sorted = sortSiblings(rows, columns, sortKey, sortDir);
  for (const node of sorted) {
    const kids = node.children ?? [];
    out.push({ node, depth, hasChildren: kids.length > 0, descendants: countDescendants(node) });
    if (kids.length && expanded.has(node.id)) {
      flatten(kids, expanded, columns, sortKey, sortDir, depth + 1, out);
    }
  }
  return out;
}

function sortSiblings<TRow extends Record<string, unknown>>(
  rows: TreeTableRow<TRow>[],
  columns: TreeTableColumn<TRow>[],
  key: string | undefined,
  dir: TreeSortDir,
) {
  if (!key) return rows;
  const col = columns.find((c) => c.key === key);
  const dirMul = dir === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const av = comparable(col?.sortValue ? col.sortValue(a.data) : a.data[key]);
    const bv = comparable(col?.sortValue ? col.sortValue(b.data) : b.data[key]);
    if (av < bv) return -dirMul;
    if (av > bv) return dirMul;
    return a.id.localeCompare(b.id);
  });
}

function comparable(v: unknown): string | number {
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (v == null) return '';
  return String(v);
}

/**
 * TreeTable — hierarchical rows with expand/collapse carets and column sort
 * (siblings sort within each level; structure preserved). Complements DataTable
 * (flat) and TreeView (labels only) with a grid layout for both.
 */
export function TreeTable<TRow extends Record<string, unknown>>({
  columns,
  rows,
  defaultExpandedIds = [],
  defaultSortKey,
  defaultSortDir = 'asc',
  onSortChange,
  onExpandedChange,
  rowMeta,
  caption,
  emptyText = 'No rows.',
  className = '',
}: TreeTableProps<TRow>) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(defaultExpandedIds));
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey);
  const [sortDir, setSortDir] = useState<TreeSortDir>(defaultSortDir);

  const visible = useMemo(
    () => flatten(rows, expanded, columns, sortKey, sortDir, 0, []),
    [rows, expanded, columns, sortKey, sortDir],
  );

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      onExpandedChange?.(Array.from(next));
      return next;
    });
  };

  const toggleSort = (key: string) => {
    const nextDir: TreeSortDir = sortKey === key && sortDir === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDir(nextDir);
    onSortChange?.(key, nextDir);
  };

  return (
    <div className={className} data-treetable="">
      <table data-treetable-table="">
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {columns.map((col) => {
              const active = sortKey === col.key;
              const sortable = col.sortable !== false;
              return (
                <th
                  key={col.key}
                  data-align={col.align ?? 'left'}
                  aria-sort={sortable ? (active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none') : undefined}
                >
                  {sortable ? (
                    <button type="button" data-treetable-sort="" aria-label={`Sort by ${col.header}`} onClick={() => toggleSort(col.key)}>
                      <span>{col.header}</span>
                      <span data-treetable-caret="" data-dir={active ? sortDir : undefined} aria-hidden="true">▾</span>
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
          {visible.map(({ node, depth, hasChildren, descendants }) => {
            const isOpen = expanded.has(node.id);
            return (
              <tr key={node.id} data-treetable-row="" data-depth={depth} data-open={isOpen || undefined}>
                {columns.map((col, i) => {
                  const first = i === 0;
                  return (
                    <td key={col.key} data-align={col.align ?? 'left'} style={first ? ({ '--tt-depth': depth } as CSSProperties) : undefined}>
                      {first && (
                        <button
                          type="button"
                          data-treetable-toggle=""
                          data-kids={hasChildren ? '' : undefined}
                          data-open={isOpen || undefined}
                          aria-expanded={hasChildren ? isOpen : undefined}
                          aria-label={hasChildren ? `${isOpen ? 'Collapse' : 'Expand'} ${String(node.data[col.key] ?? node.id)}` : `No children for ${String(node.data[col.key] ?? node.id)}`}
                          disabled={!hasChildren}
                          onClick={() => hasChildren && toggle(node.id)}
                        >
                          <span aria-hidden="true">{hasChildren ? (isOpen ? '▾' : '▸') : '·'}</span>
                        </button>
                      )}
                      <span data-treetable-cell="">
                        {col.render ? col.render(node.data) : String(node.data[col.key] ?? '')}
                      </span>
                      {first && rowMeta && <span data-treetable-meta="">{rowMeta(node, descendants)}</span>}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {visible.length === 0 && (
            <tr>
              <td colSpan={columns.length} data-treetable-empty="">{emptyText}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
