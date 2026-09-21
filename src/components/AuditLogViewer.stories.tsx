import { AuditLogViewer } from './AuditLogViewer';

export default {
  title: 'AuditLogViewer',
  component: AuditLogViewer,
};

export const Default = () => (
  <div style={{ maxWidth: 520 }}>
    <AuditLogViewer
      events={[
        { id: 'e1', time: '09:41', actor: 'Priya', event: 'approved corpus deletion', detail: 'corpus:support-2019', level: 'action' },
        { id: 'e2', time: '09:38', actor: 'Atlas', event: 'requested approval', detail: 'action:delete_corpus scope:3 indexes', level: 'warning' },
        { id: 'e3', time: '09:12', actor: 'Atlas', event: 'was denied email send', detail: 'policy:outbound-unapproved', level: 'denied' },
        { id: 'e4', time: '08:57', actor: 'system', event: 'nightly digest finished', level: 'info' },
      ]}
    />
  </div>
);
