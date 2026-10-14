import './LiveCursors.css';
import type { Collaborator } from './canvas.shared';
import { initials, identityHue, hueVar, CursorGlyph } from './canvas.shared';

export type { Collaborator } from './canvas.shared';

export interface LiveCursorsProps {
  /** Live collaborators; those with x/y render a cursor. */
  collaborators?: Collaborator[];
  /** Canvas content size in the same coordinates as cursor x/y. */
  contentWidth?: number;
  contentHeight?: number;
  className?: string;
}

/**
 * Standalone remote-cursor layer. Absolutely positioned over a canvas region
 * (its parent establishes the coordinate space); renders one labeled pointer
 * per collaborator carrying an x/y, coloured from that person's `--series-N`
 * identity hue. Purely presentational — it never intercepts pointer events.
 */
export function LiveCursors({ collaborators = [], contentWidth = 1, contentHeight = 1, className = '' }: LiveCursorsProps) {
  const live = collaborators.filter((c) => typeof c.x === 'number' && typeof c.y === 'number');
  return (
    <div className={`cv-live-cursors ${className}`} data-live-cursors="" aria-hidden="true">
      {live.map((c) => {
        const hue = c.hue ?? identityHue(c.id);
        const left = `${(Math.max(0, Math.min(1, (c.x as number) / Math.max(1, contentWidth)))) * 100}%`;
        const top = `${(Math.max(0, Math.min(1, (c.y as number) / Math.max(1, contentHeight)))) * 100}%`;
        return (
          <div
            key={c.id}
            className="cv-live-cursor"
            data-cursor-id={c.id}
            style={{ left, top, ['--cc' as string]: hueVar(hue) }}
          >
            <CursorGlyph color="var(--cc)" />
            <span className="cv-live-cursor-tag">{c.name}</span>
          </div>
        );
      })}
    </div>
  );
}

/** Initials for a collaborator (exported for reuse by canvas surfaces). */
export const collaboratorInitials = initials;
