import { useState } from 'react';
import { Combobox } from './Combobox';

const MODELS = [
  { value: 'm1', label: 'Atlas Large', hint: 'best quality' },
  { value: 'm2', label: 'Atlas Mini', hint: 'fast + cheap' },
  { value: 'm3', label: 'Atlas Coder', hint: 'code + tools' },
  { value: 'm4', label: 'Atlas Longctx', hint: '1M window' },
];

export default {
  title: 'Combobox',
  component: Combobox,
};

export const Default = () => {
  const [value, setValue] = useState<string | null>('m2');
  return (
    <div style={{ maxWidth: 320 }}>
      <Combobox id="rag-model" label="Answer model" options={MODELS} value={value} onChange={setValue} placeholder="Search models…" />
      <p style={{ fontSize: 12, opacity: 0.7 }}>Selected: {value ?? 'none'}</p>
    </div>
  );
};
