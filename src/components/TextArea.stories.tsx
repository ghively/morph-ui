import { useState } from 'react';
import { TextArea } from './TextArea';

export default {
  title: 'TextArea',
  component: TextArea,
};

export const Default = () => {
  const [value, setValue] = useState('');
  return (
    <TextArea
      id="rag-notes"
      label="Analyst notes"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Add context for this dashboard…"
      hint="Saved with the current view."
    />
  );
};

export const Error = () => (
  <TextArea id="rag-notes-err" label="Analyst notes" defaultValue="x" error="Notes must be at least 10 characters." />
);
