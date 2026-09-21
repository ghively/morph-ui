import { useState } from 'react';
import { ConfirmDialog } from './ConfirmDialog';
import { Button } from './Button';

export default {
  title: 'ConfirmDialog',
  component: ConfirmDialog,
};

export const Danger = () => {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState('No action taken.');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
