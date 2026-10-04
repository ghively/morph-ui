import { EmptyState } from '../../src/components/EmptyState';
import { Button } from '../../src/components/Button';

export const Default = () => (
  <EmptyState title="No items" action={<Button size="sm" variant="primary">Add a source</Button>}>
    This corpus has no indexed documents yet. Connect a source to start retrieval.
  </EmptyState>
);

export const Framed = () => (
  <EmptyState title="Not configured" framed action={<Button size="sm">Open settings</Button>}>
    Connect a vector store to enable semantic search for this workspace.
  </EmptyState>
);
