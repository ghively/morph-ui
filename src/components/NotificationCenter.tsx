import './NotificationCenter.css';

export type NotificationTone = 'info' | 'success' | 'warn' | 'danger';

export interface Notification {
  id: string;
  title: string;
  body?: string;
  tone?: NotificationTone;
  time?: string;
  read?: boolean;
}

export interface NotificationCenterProps {
  notifications: Notification[];
  onOpen?: (id: string) => void;
  onMarkAllRead?: () => void;
  onDismiss?: (id: string) => void;
  emptyText?: string;
  className?: string;
}

/** Agent-ops inbox: index runs, stale sources, approvals. Unread count doubles as a bell badge. */
export function NotificationCenter({
  notifications,
  onOpen,
  onMarkAllRead,
  onDismiss,
  emptyText = 'All caught up.',
  className = '',
}: NotificationCenterProps) {
  const unread = notifications.filter((n) => !n.read).length;
  return (
    <div className={className} data-notifications="">
      <div data-notificationshead="">
        <span data-notificationstitle="">
          Notifications{unread > 0 && <span data-unreadbadge="">{unread}</span>}
        </span>
        {unread > 0 && (
          <button type="button" data-markread="" onClick={() => onMarkAllRead?.()}>
            Mark all read
          </button>
        )}
      </div>
      {notifications.length === 0 && <div data-notificationsempty="">{emptyText}</div>}
      <ul data-notificationlist="">
        {notifications.map((n) => (
          <li key={n.id} data-notification="" data-tone={n.tone ?? 'info'} data-read={n.read ? '' : undefined}>
            <button type="button" data-notificationbtn="" onClick={() => onOpen?.(n.id)} aria-label={`${n.title}${n.read ? '' : ' (unread)'}`}>
              <span data-notificationdot="" aria-hidden="true" />
              <span data-notificationtext="">
                <span data-notificationtitle="">{n.title}</span>
                {n.body && <span data-notificationbody="">{n.body}</span>}
                {n.time && <span data-notificationtime="">{n.time}</span>}
              </span>
            </button>
            {onDismiss && (
              <button type="button" data-notificationdismiss="" aria-label={`Dismiss ${n.title}`} onClick={() => onDismiss(n.id)}>
                ×
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
