import './InitialsAvatar.css';

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
  className?: string;
}

export function InitialsAvatar({ name, src, agent, working, size, className = '' }: InitialsAvatarProps) {
  // Initials derivation matching matrix/rooms.ts initials() logic
  const initials = (name || '').replace(/[^a-zA-Z0-9\s]/g, '').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();

  const style = src ? {
    backgroundImage: `url(${src})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "transparent"
  } : undefined;

  return (
    <span
      className={className}
      data-avatar={agent ? "" : "user"}
      data-ring={working ? "" : undefined}
      data-size={size}
      aria-hidden="true"
      style={style}
    >
      {initials}
    </span>
  );
}
