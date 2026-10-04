import type { StoryDefault, Story } from '@ladle/react';
import { ToastProvider, useToast } from './ToastStack';
import { Button } from './Button';

export default {
  title: 'ToastStack',
} satisfies StoryDefault;

const Toaster = () => {
  const toast = useToast();
  
  return (
    <div style={{ display: 'flex', gap: 'var(--s2)', flexWrap: 'wrap' }}>
      <Button variant="secondary" size="sm" onClick={() => toast('Changes saved')}>Basic</Button>
      <Button variant="secondary" size="sm" onClick={() => toast('Draft created', '4s ago')}>With Meta</Button>
      <Button variant="secondary" size="sm" onClick={() => toast('Connection restored', undefined, 'ok')}>Success</Button>
      <Button variant="danger" size="sm" onClick={() => toast('Failed to save', 'Err 500', 'danger')}>Error</Button>
    </div>
  );
};

export const Interactive: Story = () => (
  <ToastProvider>
    <div style={{ padding: '20px' }}>
      <p style={{ margin: '0 0 var(--s3)', color: 'var(--app-dim)' }}>Click the buttons below to spawn toasts.</p>
      <Toaster />
    </div>
  </ToastProvider>
);
