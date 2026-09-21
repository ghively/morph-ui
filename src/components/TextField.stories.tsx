import { useState } from 'react';
import { TextField } from './TextField';

export default {
  title: 'TextField',
  component: TextField,
};

export const Default = () => {
  const [value, setValue] = useState('');
  return (
    <TextField
      id="rag-query"
      label="Query"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Ask about Q3 revenue…"
      hint="Searches across all connected departments."
    />
  );
};

export const Error = () => (
  <TextField id="rag-query-err" label="Query" defaultValue="" placeholder="Ask anything…" error="Enter at least 3 characters." />
);

export const Disabled = () => <TextField id="rag-query-off" label="Query" value="Locked" disabled />;
