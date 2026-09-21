import { Spinner } from './Spinner';

export default {
  title: 'Spinner',
  component: Spinner,
};

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
    <Spinner size="sm" label="Loading small" />
    <Spinner size="md" label="Loading medium" />
    <Spinner size="lg" label="Loading large" />
  </div>
);
