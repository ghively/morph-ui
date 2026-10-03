import './AuditLogViewer.css';
import { cv, AUDIT_C, AUDIT_LABEL, type AuditLogViewerProps } from './agentOps.shared';

export function AuditLogViewer({ events, emptyText = 'No events recorded.', className = '' }: AuditLogViewerProps) {
  if (events.length === 0) return <div className={'audit-log audit-log-empty ' + className} data-audit="" data-empty="">{emptyText}</div>;
  return (
    <ol className={'audit-log ' + className} data-audit="">
      {events.map(e => {
        const lv = e.level ?? 'info';
        return (
          <li key={e.id} className="audit-log-ev" data-auditevent="" data-level={lv} style={cv(AUDIT_C[lv])}>
            <span className="audit-log-time" data-audittime="">{e.time}</span>
            <span className="audit-log-mk" data-auditmarker="" aria-hidden="true" />
            <span className="audit-log-body" data-auditbody="">
              <span className="audit-log-line" data-auditline=""><strong>{e.actor}</strong>{' ' + e.event}{lv !== 'info' && <span className="audit-log-lv">{AUDIT_LABEL[lv].toLowerCase()}</span>}</span>
              {e.detail && <span className="audit-log-detail" data-auditdetail="">{e.detail}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export type { AuditLevel, AuditEvent, AuditLogViewerProps } from './agentOps.shared';
