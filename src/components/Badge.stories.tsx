import { Badge } from './Badge';

export default {
  title: 'Badge',
  component: Badge,
};

export const Tones = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <Badge>Draft</Badge>
    <Badge tone="info">Indexed</Badge>
    <Badge tone="success">Fresh · 2m ago</Badge>
    <Badge tone="warn">Stale · 6h ago</Badge>
    <Badge tone="danger">Source offline</Badge>
  </div>
);

export const Small = () => (
  <div style={{ display: 'flex', gap: 8 }}>
    <Badge size="sm">Sales</Badge>
    <Badge size="sm" tone="info">
      Finance
    </Badge>
  </div>
);
