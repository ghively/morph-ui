import { useState } from 'react';
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react';
import './TreeView.css';

export interface TreeNode {
  id: string;
  label: ReactNode;
  meta?: string;
  children?: TreeNode[];
}

export interface TreeViewProps {
  nodes: TreeNode[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  defaultExpandedIds?: string[];
  label?: string;
  className?: string;
}

interface FlatRow {
  node: TreeNode;
  depth: number;
}

function flatten(list: TreeNode[], expanded: string[], depth = 0, out: FlatRow[] = []): FlatRow[] {
  for (const n of list) {
    out.push({ node: n, depth });
    if (n.children && expanded.includes(n.id)) flatten(n.children, expanded, depth + 1, out);
  }
  return out;
}

/** Keyboard-navigable expanding tree for corpus / department browsing. */
export function TreeView({ nodes, selectedId, onSelect, defaultExpandedIds = [], label = 'Browse', className = '' }: TreeViewProps) {
  const [expanded, setExpanded] = useState<string[]>(defaultExpandedIds);
  const [focusId, setFocusId] = useState<string | null>(null);

  const toggle = (id: string) => setExpanded((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));
  const visible = flatten(nodes, expanded);

  const activate = (node: TreeNode, hasKids: boolean) => {
    setFocusId(node.id);
    if (hasKids) toggle(node.id);
    else onSelect?.(node.id);
  };

  const onKey = (e: KeyboardEvent, index: number, node: TreeNode, hasKids: boolean, isOpen: boolean) => {
    if (e.key === 'ArrowDown' && visible[index + 1]) {
      e.preventDefault();
      setFocusId(visible[index + 1]!.node.id);
    } else if (e.key === 'ArrowUp' && visible[index - 1]) {
      e.preventDefault();
      setFocusId(visible[index - 1]!.node.id);
    } else if (e.key === 'ArrowRight' && hasKids && !isOpen) {
      e.preventDefault();
      toggle(node.id);
    } else if (e.key === 'ArrowLeft' && hasKids && isOpen) {
      e.preventDefault();
      toggle(node.id);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activate(node, hasKids);
    }
  };

  return (
    <div className={className} data-tree="" role="tree" aria-label={label}>
      {visible.map(({ node, depth }, index) => {
        const hasKids = (node.children?.length ?? 0) > 0;
        const isOpen = expanded.includes(node.id);
        const selected = node.id === selectedId;
        const tabbable = focusId === null ? index === 0 : focusId === node.id;
        return (
          <div
            key={node.id}
            role="treeitem"
            aria-expanded={hasKids ? isOpen : undefined}
            aria-selected={selected}
            data-treeitem=""
            data-selected={selected ? '' : undefined}
            tabIndex={tabbable ? 0 : -1}
            ref={focusId === node.id ? (el) => el?.focus() : undefined}
            style={{ '--morph-tree-depth': depth } as CSSProperties}
            onClick={() => activate(node, hasKids)}
            onKeyDown={(e) => onKey(e, index, node, hasKids, isOpen)}
          >
            <span data-treecaret="" aria-hidden="true">
              {hasKids ? (isOpen ? '▾' : '▸') : ''}
            </span>
            <span data-treelabel="">{node.label}</span>
            {node.meta && <span data-treemeta="">{node.meta}</span>}
          </div>
        );
      })}
    </div>
  );
}
