import './AuditLogViewer.css';

export type AuditLevel = 'info' | 'action' | 'warning' | 'denied';

export interface AuditEvent {
  id: string;
  time: string;
  actor: string;
  event: string;
  detail?: string;
  level?: AuditLevel;
}

export interface AuditLogViewerProps {
  events: AuditEvent[];
  emptyText?: string;
  className?: string;
}

/** Immutable-looking trail: who did what, when. Newest first. */
export function AuditLogViewer({ events, emptyText = 'No events recorded.', className = '' }: AuditLogViewerProps) {
  if (events.length === 0) {
    return (
      <div className={className} data-audit="" data-empty="">
        {emptyText}
      </div>
    );
  }
  return (
    <ol className={className} data-audit="">
      {events.map((e) => (
        <li key={e.id} data-auditevent="" data-level={e.level ?? 'info'}>
          <span data-audittime="">{e.time}</span>
          <span data-auditmarker="" aria-hidden="true" />
          <span data-auditbody="">
            <span data-auditline="">
              <strong>{e.actor}</strong> · {e.event}
            </span>
            {e.detail && <span data-auditdetail="">{e.detail}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}
