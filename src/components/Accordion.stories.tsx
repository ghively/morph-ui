import { Accordion } from './Accordion';
import { Badge } from './Badge';

export default {
  title: 'Accordion',
  component: Accordion,
};

const ITEMS = [
  {
    id: 'sales',
    title: 'Sales',
    badge: <Badge size="sm" tone="success">fresh</Badge>,
    content: 'CRM + call transcripts. Last indexed 4 minutes ago. 12,408 chunks.',
  },
  {
    id: 'support',
    title: 'Support',
    badge: <Badge size="sm" tone="warn">stale</Badge>,
    content: 'Ticket archive. Last indexed 6 hours ago. Retry scheduled.',
  },
  {
    id: 'finance',
    title: 'Finance',
    badge: <Badge size="sm" tone="info">12 docs</Badge>,
    content: 'Quarterly filings and expense policies. Read-only scope.',
  },
];

export const Single = () => <Accordion items={ITEMS} defaultOpenIds={['sales']} />;

export const Multiple = () => <Accordion items={ITEMS} allowMultiple defaultOpenIds={['sales', 'finance']} />;
