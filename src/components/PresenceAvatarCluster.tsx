import './PresenceAvatarCluster.css';
import { useState } from 'react';
import type { Collaborator } from './canvas.shared';
import { initials, identityHue, hueVar } from './canvas.shared';

export type { Collaborator } from './canvas.shared';

export interface PresenceAvatarClusterProps {
  /** Live collaborators. */
  collaborators: Collaborator[];
  /** Avatars shown before the +N chip. */
  max?: number;
  /** "N online" tooltip/aria text override. */
  label?: string;
  className?: string;
}

/**
 * Floating cluster of live-collaborator avatars with overlap. Each avatar is
 * coloured from the person's stable `--series-N` identity hue; overflow folds
 * into a +N chip. Hovering (or focusing) expands the roster with names.
 */
export function PresenceAvatarCluster({ collaborators, max = 4, label, className = '' }: PresenceAvatarClusterProps) {
  const [open, setOpen] = useState(false);
  const shown = collaborators.slice(0, max);
  const rest = collaborators.slice(max);
  const count = collaborators.length;

  return (
    <div
      className={`cv-presence ${open ? 'is-open' : ''} ${className}`}
      data-presence-cluster=""
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="cv-presence-trigger"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={label ?? `${count} ${count === 1 ? 'collaborator' : 'collaborators'} online`}
        onClick={() => setOpen((v) => !v)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {shown.map((c) => (
          <span
            key={c.id}
            className="cv-presence-avatar"
            data-hue={c.hue ?? identityHue(c.id)}
            data-collaborator-id={c.id}
            style={{ ['--cc' as string]: hueVar(c.hue ?? identityHue(c.id)) }}
          >
            {initials(c.name)}
          </span>
        ))}
        {rest.length > 0 && <span className="cv-presence-more" data-presence-more="">+{rest.length}</span>}
      </button>

      {open && count > 0 && (
        <ul className="cv-presence-roster" data-presence-roster="">
          {collaborators.map((c) => (
            <li key={c.id} style={{ ['--cc' as string]: hueVar(c.hue ?? identityHue(c.id)) }}>
              <span className="cv-presence-avatar" data-hue={c.hue ?? identityHue(c.id)}>
                {initials(c.name)}
              </span>
              <span className="cv-presence-name">{c.name}</span>
              <i className="cv-presence-live" role="img" aria-label="Online" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
