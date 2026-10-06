import './AvatarStack.css';
import { initials, identityHue, cssUrl } from './agentOps.shared';

export interface StackPerson {
  name: string;
  src?: string | null;
  agent?: boolean;
}

export interface AvatarStackProps {
  people: StackPerson[];
  /** Avatars shown before the +N overflow. Default 4. */
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
}

/** Overlapping contributor row with a +N overflow pill. Names survive via title tooltips. */
export function AvatarStack({ people, max = 4, size = 'md', className = '' }: AvatarStackProps) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <span className={className} data-avatarstack="" data-size={size} role="group" aria-label={`${people.length} contributors: ${people.map((p) => p.name).join(', ')}`}>
      {shown.map((p) => (
        <span
          key={p.name}
          data-stackavatar=""
          data-agent={p.agent ? '' : undefined}
          data-hue={p.agent ? undefined : identityHue(p.name)}
          title={p.name}
          style={p.src ? { backgroundImage: cssUrl(p.src), backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' } : undefined}
          aria-hidden="true"
        >
          {initials(p.name)}
        </span>
      ))}
      {extra > 0 && (
        <span data-stackmore="" title={people.slice(max).map((p) => p.name).join(', ')}>
          +{extra}
        </span>
      )}
    </span>
  );
}
