import { Spinner } from '../../src/components/Spinner';

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    <Spinner size="sm" label="Loading small" />
    <Spinner size="md" label="Loading medium" />
    <Spinner size="lg" label="Loading large" />
  </div>
);
