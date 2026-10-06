import './InitialsAvatar.css';
import { initials, identityHue, cssUrl } from './agentOps.shared';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface InitialsAvatarProps {
  /** Display name; initials are derived from it. Required even when `src` is set (alt/fallback). */
  name: string;
  /** Resolved image URL. Undefined/null/'' → initials only. The component never fetches. */
  src?: string | null;
  /** Agent avatars render as a rounded tile (`data-avatar=""`), people as a circle (`data-avatar="user"`). */
  agent?: boolean;
  /** Animated activity ring (`data-ring`). */
  working?: boolean;
  /** Omit for the default medium. */
  size?: AvatarSize;
  /** Stable key for the person's colour (e.g. a user id). Defaults to `name`. */
  colorKey?: string;
  /** Accessible name. When set the avatar is an image (`role="img"`); omitted, it's decorative. */
  label?: string;
  className?: string;
}

export function InitialsAvatar({ name, src, agent, working, size, colorKey, label, className = '' }: InitialsAvatarProps) {
  const style = src ? {
    backgroundImage: cssUrl(src),
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "transparent"
  } : undefined;

  return (
    <span
      className={('morph-avatar ' + className).trim()}
      data-avatar={agent ? "" : "user"}
      data-hue={agent ? undefined : identityHue(colorKey ?? name)}
      data-ring={working ? "" : undefined}
      data-size={size}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
      title={label}
      style={style}
    >
      {initials(name || '')}
    </span>
  );
}
