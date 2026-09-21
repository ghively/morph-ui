import { useState } from 'react';
import { Select } from './Select';

const DEPARTMENTS = [
  { value: 'sales', label: 'Sales' },
  { value: 'support', label: 'Support' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'finance', label: 'Finance' },
  { value: 'hr', label: 'People Ops', disabled: true },
];

export default {
  title: 'Select',
  component: Select,
};

export const Default = () => {
  const [value, setValue] = useState('');
  return (
    <Select
      id="rag-dept"
      label="Department"
      options={DEPARTMENTS}
      placeholder="Choose a department…"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      hint="Scopes every tile on this dashboard."
    />
  );
};

export const Error = () => (
  <Select id="rag-dept-err" label="Department" options={DEPARTMENTS} value="" onChange={() => {}} error="Pick a department to continue." />
);
