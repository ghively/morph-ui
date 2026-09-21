import { useState } from 'react';
import { Stepper } from './Stepper';

const STEPS = [
  { id: 'scope', label: 'Scope', hint: 'pick sources' },
  { id: 'prompt', label: 'Prompt', hint: 'set template' },
  { id: 'review', label: 'Review', hint: 'check output' },
  { id: 'publish', label: 'Publish', hint: 'go live' },
];

export default {
  title: 'Stepper',
  component: Stepper,
};

export const Default = () => {
  const [current, setCurrent] = useState(2);
  return <Stepper steps={STEPS} current={current} onGo={setCurrent} label="Connect a source" />;
};
