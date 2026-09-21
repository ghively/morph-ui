import { useState } from 'react';
import { SearchField } from './SearchField';

export default {
  title: 'SearchField',
  component: SearchField,
};

export const Default = () => {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);
  return (
    <div style={{ maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <SearchField id="rag-search" value={value} onChange={setValue} onSubmit={setSubmitted} placeholder="Search tickets, docs, people…" debounceMs={150} />
      {submitted !== null && <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>Submitted: {submitted || '(empty)'}</p>}
    </div>
  );
};
