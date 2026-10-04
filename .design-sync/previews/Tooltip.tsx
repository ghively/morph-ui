import { useEffect, useRef } from 'react';
import { Tooltip } from '../../src/components/Tooltip';
import { Button } from '../../src/components/Button';
import { Badge } from '../../src/components/Badge';

// Content is passed as a node (not a bare string) so the tip renders through
// [data-tipbody]; a string content sets data-tip on the wrapper, which collides
// with the frame's own [data-tip] tooltip styling (see learnings/wave2.md).
export const Default = () => {
  const ref = useRef<HTMLDivElement>(null);
  // Focus the first trigger so the :focus-within tooltip is visible in a static capture.
  useEffect(() => {
    ref.current?.querySelector('button')?.focus();
  }, []);
  return (
    <div ref={ref} style={{ display: 'flex', gap: 12, padding: '120px 24px 24px', alignItems: 'center' }}>
      <Tooltip content={<>Rebuilds the vector index for every connected source.</>}>
        <Button size="sm">Reindex all sources</Button>
      </Tooltip>
      <Tooltip content={<>Cosine similarity cutoff for retrieved passages.</>} placement="bottom">
        <Badge tone="info">threshold 0.72</Badge>
      </Tooltip>
    </div>
  );
};
