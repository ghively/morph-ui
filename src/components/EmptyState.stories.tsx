import { EmptyState } from './EmptyState';
import { Button } from './Button';
import { GlyphIcon } from './GlyphIcon';

export default {
  title: 'EmptyState',
  component: EmptyState,
};

export const Default = () => <EmptyState title="No items" />;
export const Framed = () => <EmptyState title="Not configured" framed />;

export const WithActionAndIcon = () => (
  <EmptyState title="No conversations yet" icon={<GlyphIcon name="chats" size={18} />} action={<Button>Start a chat</Button>}>
    Messages you send or receive will show up here.
  </EmptyState>
);

export const Live = () => (
  <EmptyState title="Indexing sources" live>
    Results will appear as documents finish indexing.
  </EmptyState>
);
