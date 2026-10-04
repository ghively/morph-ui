import { MorphRoot } from './MorphRoot';
import { Button } from './Button';
import { Badge } from './Badge';

export default {
  title: 'MorphRoot',
  component: MorphRoot,
};

export const Default = () => (
  <MorphRoot padding={24}>
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button variant="primary">Deploy agent</Button>
      <Button>Cancel</Button>
      <Badge tone="success">Healthy</Badge>
    </div>
  </MorphRoot>
);

export const ThemedAccent = () => (
  <MorphRoot padding={24} tokens={{ '--app-blue': '#9b7bff' }}>
    <Button variant="primary">Accent overridden on this frame</Button>
  </MorphRoot>
);
