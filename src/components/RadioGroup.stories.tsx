import { useState } from 'react';
import { RadioGroup } from './RadioGroup';

const WINDOWS = [
  { value: '24h', label: 'Last 24 hours', hint: 'Best for incident review' },
  { value: '7d', label: 'Last 7 days', hint: 'Default for team dashboards' },
  { value: '30d', label: 'Last 30 days', hint: 'Trend analysis' },
];

export default {
  title: 'RadioGroup',
  component: RadioGroup,
};

export const Default = () => {
  const [value, setValue] = useState('7d');
  return <RadioGroup name="rag-window" label="Time window" options={WINDOWS} value={value} onChange={setValue} />;
};

export const Horizontal = () => {
  const [value, setValue] = useState('24h');
  return <RadioGroup name="rag-window-h" options={WINDOWS} value={value} onChange={setValue} orientation="horizontal" />;
};
