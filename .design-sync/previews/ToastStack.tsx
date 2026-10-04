import { useEffect, useRef } from 'react';
import { ToastProvider, useToast } from '../../src/components/ToastStack';
import { Button } from '../../src/components/Button';

const Toaster = () => {
  const toast = useToast();
  const seeded = useRef(false);

  // Seed a realistic stack so the static capture shows toasts, not just triggers.
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    toast('Draft saved', '4s ago');
    toast('Connection restored', undefined, 'ok');
    toast('Failed to sync refund #4821', 'Err 500', 'danger');
  }, [toast]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
      <Button size="sm" onClick={() => toast('Changes saved')}>Basic</Button>
      <Button size="sm" onClick={() => toast('Draft created', '4s ago')}>With meta</Button>
      <Button size="sm" onClick={() => toast('Connection restored', undefined, 'ok')}>Success</Button>
      <Button size="sm" variant="danger" onClick={() => toast('Failed to save', 'Err 500', 'danger')}>Error</Button>
    </div>
  );
};

export const Interactive = () => (
  // transform makes this box the containing block for the stack's position:fixed,
  // so the toasts land inside the preview cell instead of the viewport edge.
  // Triggers sit in a left column because the frame centres the stack as a top drawer.
  <div style={{ position: 'relative', height: 230, transform: 'translateZ(0)', overflow: 'hidden' }}>
    <ToastProvider duration={600000}>
      <div style={{ padding: '20px' }}>
        <Toaster />
      </div>
    </ToastProvider>
  </div>
);
