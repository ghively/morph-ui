import './ArtifactCardGrid.css';
import { useRef } from 'react';
import { fmtRel } from './canvas.shared';
import type { ArtifactKind } from './canvas.shared';

export interface ArtifactCard {
  id: string;
  title: string;
  kind?: ArtifactKind;
  /** ISO timestamp of the last update. */
  updatedAt?: string;
  /** Optional meta line (e.g. "12 sections"); defaults to the kind label. */
  meta?: string;
}

export interface ArtifactCardGridProps {
  artifacts: ArtifactCard[];
  /** Controlled selection. */
  selectedId?: string;
  onSelect?: (id: string) => void;
  /** Open the artifact (double-click on a card, Enter, or its Open action). */
  onOpen?: (id: string) => void;
  /** Reference "now" for relative timestamps. */
  now?: string;
  /** Minimum card width; the grid auto-fills columns. */
  minCardWidth?: number;
  className?: string;
}

export const ARTIFACT_KIND_LABEL: Record<ArtifactKind, string> = {
  doc: 'Document',
  sheet: 'Sheet',
  code: 'Code',
  image: 'Image',
  board: 'Board',
};

const KIND_PATH: Record<ArtifactKind, string> = {
  doc: 'M4 2a1 1 0 011-1h5l4 4v9a1 1 0 01-1 1H5a1 1 0 01-1-1V2zM9 1v5h5M6.5 9h3M6.5 11.5h3',
  sheet: 'M2 2h12v12H2zM2 6h12M2 10h12M6 2v12M10 2v12',
  code: 'M5.5 4L2 8l3.5 4M10.5 4L14 8l-3.5 4',
  image: 'M2 3a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3zM2 11l4-4 3 3 2-2 3 3M6 6v.01',
  board: 'M2 2h5v5H2zM9 2h5v3H9zM9 7h5v7H9zM2 9h5v5H2z',
};

/**
 * Grid of artifact cards. Each card shows a type icon, title, updated-at and
 * an Open action; cards lift with an edge-light + accent glow on hover.
 * Single click selects; double click, Enter or the Open button opens.
 * Arrow keys rove across the grid following the rendered column count.
 */
export function ArtifactCardGrid({ artifacts, selectedId, onSelect, onOpen, now, minCardWidth = 210, className = '' }: ArtifactCardGridProps) {
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const ids = artifacts.map((a) => a.id);

  const focusId = (id?: string) => {
    if (!id) return;
    onSelect?.(id);
    cardRefs.current[id]?.focus();
  };
  const move = (from: string, key: string) => {
    const i = ids.indexOf(from);
    if (i < 0) return;
    // Column count from the rendered offsets (top row = distinct offsets).
    const tops = new Set(ids.map((id) => cardRefs.current[id]?.offsetTop ?? -1));
    const cols = ids.length ? Math.max(1, tops.size) : 1;
    const delta = key === 'ArrowLeft' ? -1 : key === 'ArrowRight' ? 1 : key === 'ArrowDown' ? cols : -cols;
    focusId(ids[(i + delta + ids.length) % ids.length]);
  };

  return (
    <div
      className={`cv-artifact-grid ${className}`}
      data-artifact-grid=""
      role="listbox"
      aria-label="Artifacts"
      style={{ ['--cv-card-min' as string]: `${minCardWidth}px` }}
    >
      {artifacts.map((a) => {
        const kind = a.kind ?? 'doc';
        const selected = a.id === selectedId;
        return (
          <div
            key={a.id}
            className="cv-artifact-card"
            data-artifact-id={a.id}
            data-kind={kind}
            data-selected={selected ? 'true' : 'false'}
            role="option"
            aria-selected={selected}
            ref={(el) => { cardRefs.current[a.id] = el; }}
            onClick={() => { onSelect?.(a.id); }}
            onDoubleClick={() => onOpen?.(a.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); onOpen?.(a.id); }
              else if (e.key === ' ') { e.preventDefault(); onSelect?.(a.id); }
              else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                move(a.id, e.key);
              }
            }}
          >
            <span className="cv-artifact-icon" aria-hidden="true">
              <svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                <path d={KIND_PATH[kind]} />
              </svg>
            </span>
            <span className="cv-artifact-title">{a.title}</span>
            <span className="cv-artifact-meta">
              <span className="cv-artifact-kind">{a.meta ?? ARTIFACT_KIND_LABEL[kind]}</span>
              {a.updatedAt && <time dateTime={a.updatedAt}>{fmtRel(a.updatedAt, now)}</time>}
            </span>
            <span
              className="cv-artifact-open"
              data-artifact-open={a.id}
              onClick={(e) => { e.stopPropagation(); onOpen?.(a.id); }}
            >
              Open
            </span>
          </div>
        );
      })}
    </div>
  );
}
