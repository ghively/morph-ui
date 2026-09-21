import { useState } from 'react';
import { Drawer } from './Drawer';
import { Button } from './Button';
import { RetrievalInspector } from './RetrievalInspector';

export default {
  title: 'Drawer',
  component: Drawer,
};

export const Default = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Inspect retrieval</Button>
      <Drawer open={open} onClose={() => setOpen(false)} label="Retrieval inspector" title="Why this answer?">
        <RetrievalInspector
          chunks={[
            { id: 'c1', title: 'March refund policy update', excerpt: 'Digital-goods refunds extend…', score: 0.91 },
            { id: 'c2', title: 'Billing queue weekly review', excerpt: 'Refund-tagged tickets grew…', score: 0.84 },
          ]}
        />
      </Drawer>
    </>
  );
};
