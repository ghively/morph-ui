import { useState } from 'react';
import { ConfirmDialog } from '../../src/components/ConfirmDialog';
import { Button } from '../../src/components/Button';

export const Danger = () => {
  // Open on mount so the card shows the dialog itself, not just its trigger.
  const [open, setOpen] = useState(true);
  const [result, setResult] = useState('No action taken.');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 420 }}>
      <div>
        <Button
          variant="danger"
          onClick={() => {
            setOpen(true);
            setResult('No action taken.');
          }}
        >
          Delete corpus
        </Button>
      </div>
      <ConfirmDialog
        open={open}
        title="Delete the support corpus?"
        body="184,000 chunks across 3 indexes will be removed. Reindexing takes about 40 minutes."
        confirmLabel="Delete"
        danger
        onConfirm={() => {
          setOpen(false);
          setResult('Corpus deleted (demo).');
        }}
        onCancel={() => setOpen(false)}
      />
      <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>{result}</p>
    </div>
  );
};
