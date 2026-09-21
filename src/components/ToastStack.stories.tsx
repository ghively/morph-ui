import type { StoryDefault, Story } from '@ladle/react';
import { ToastProvider, useToast } from './ToastStack';

export default {
  title: 'ToastStack',
} satisfies StoryDefault;

const Toaster = () => {
  const toast = useToast();
  
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button onClick={() => toast('Changes saved')}>Basic</button>
      <button onClick={() => toast('Draft created', '4s ago')}>With Meta</button>
      <button onClick={() => toast('Connection restored', undefined, 'ok')}>Success</button>
      <button onClick={() => toast('Failed to save', 'Err 500', 'danger')}>Error</button>
    </div>
  );
};

export const Interactive: Story = () => (
  <ToastProvider>
    <div style={{ padding: '20px' }}>
      <p>Click the buttons below to spawn toasts.</p>
      <Toaster />
    </div>
  </ToastProvider>
);
