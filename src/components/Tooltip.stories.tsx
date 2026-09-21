import { Tooltip } from './Tooltip';
import { Button } from './Button';
import { Badge } from './Badge';

export default {
  title: 'Tooltip',
  component: Tooltip,
};

export const Default = () => (
  <div style={{ display: 'flex', gap: 12, paddingTop: 40 }}>
    <Tooltip content="Rebuilds the vector index for every connected source.">
      <Button size="sm">Reindex</Button>
    </Tooltip>
    <Tooltip content="Cosine similarity cutoff for retrieved passages." placement="bottom">
      <Badge tone="info">threshold 0.72</Badge>
    </Tooltip>
  </div>
);
