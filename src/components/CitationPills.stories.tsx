import { useState } from 'react';
import { CitationPills } from './CitationPills';

export default {
  title: 'CitationPills',
  component: CitationPills,
};

const CITES = [{ id: 's1' }, { id: 's2' }, { id: 's3' }];

export const Default = () => {
  const [activeId, setActiveId] = useState<string | undefined>('s2');
  return (
    <p style={{ fontSize: 14, maxWidth: 520 }}>
      Refund requests rose 8% after the March policy change
      <CitationPills citations={CITES} activeId={activeId} onSelect={setActiveId} /> driven mainly by the billing
      queue.<CitationPills citations={[]} />
    </p>
  );
};
