import { Card } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';

export default {
  title: 'Card',
  component: Card,
};

export const Default = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
    <Card title="Support backlog" subtitle="Updated 4m ago" actions={<Badge tone="warn">312 open</Badge>}>
      Unanswered tickets grew 8% week over week, driven by the billing queue.
    </Card>
    <Card
      title="Index health"
      subtitle="All departments"
      actions={
        <Button size="sm" variant="ghost">
          Reindex
        </Button>
      }
    >
      41 of 43 sources fresh. Two stale sources are scheduled for retry.
    </Card>
  </div>
);

export const Bare = () => <Card>Body-only card with no header.</Card>;
