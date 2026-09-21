import { EmptyState } from './EmptyState';

export default {
  title: 'EmptyState',
  component: EmptyState,
};

export const Default = () => <EmptyState title="No items" />;
export const Framed = () => <EmptyState title="Not configured" framed />;
