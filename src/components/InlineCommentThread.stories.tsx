import { InlineCommentThread } from './InlineCommentThread';

const NOW = '2026-03-12T10:30:00Z';

export default { title: 'InlineCommentThread', component: InlineCommentThread };

const base = {
  author: 'Maya',
  at: '2026-03-12T10:12:00Z',
  body: 'This claim needs the retention study behind it before we ship the brief.',
  now: NOW,
};

export const Unresolved = () => (
  <InlineCommentThread
    {...base}
    subject="…retention improved 34% after the redesign…"
    replies={[
      { id: 'r1', author: 'Gene', at: '2026-03-12T10:18:00Z', body: 'Study is in the appendix — linking it here.' },
      { id: 'r2', author: 'Riya', at: '2026-03-12T10:24:00Z', body: 'Appendix link works. Good to resolve.' },
    ]}
  />
);

export const Resolved = () => (
  <InlineCommentThread
    {...base}
    subject="…retention improved 34% after the redesign…"
    replies={[{ id: 'r1', author: 'Gene', at: '2026-03-12T10:18:00Z', body: 'Linked the study in the appendix.' }]}
    resolved
  />
);

export const Bare = () => <InlineCommentThread author="Gene" at="2026-03-12T09:40:00Z" body="First pass at the intro." now={NOW} />;
