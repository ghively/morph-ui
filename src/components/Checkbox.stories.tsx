import { useState } from 'react';
import { Checkbox } from './Checkbox';

export default {
  title: 'Checkbox',
  component: Checkbox,
};

export const Default = () => {
  const [checked, setChecked] = useState(false);
  return <Checkbox id="rag-live" label="Live refresh (5s)" checked={checked} onChange={setChecked} />;
};

export const Indeterminate = () => {
  const [checked, setChecked] = useState(true);
  return <Checkbox id="rag-depts" label="All departments (3 of 5)" checked={checked} onChange={setChecked} indeterminate />;
};

export const Disabled = () => <Checkbox id="rag-locked" label="Archived sources" checked={false} onChange={() => {}} disabled />;
