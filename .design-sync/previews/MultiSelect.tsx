import { useState } from 'react';
import { MultiSelect } from '../../src/components/MultiSelect';

const DEPTS = [
  { value: 'sales', label: 'Sales' },
  { value: 'support', label: 'Support' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'finance', label: 'Finance' },
  { value: 'hr', label: 'People Ops' },
];

export const Default = () => {
  const [values, setValues] = useState<string[]>(['support', 'sales']);
  return (
    <div style={{ maxWidth: 420 }}>
      <MultiSelect id="rag-ms" label="Departments" options={DEPTS} values={values} onChange={setValues} placeholder="Add department…" />
    </div>
  );
};
