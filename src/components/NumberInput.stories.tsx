import { useState } from 'react';
import { NumberInput } from './NumberInput';

export default {
  title: 'NumberInput',
  component: NumberInput,
};

export const Default = () => {
  const [value, setValue] = useState<number | null>(3);
  return (
    <div style={{ maxWidth: 220 }}>
      <NumberInput id="num-replicas" label="Replicas" min={1} max={12} value={value} onChange={setValue} hint="Agent workers per run" />
    </div>
  );
};

export const WithUnitAndBounds = () => {
  const [temp, setTemp] = useState<number | null>(0.7);
  const [share, setShare] = useState<number | null>(62.5);
  const [budget, setBudget] = useState<number | null>(128000);
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 260 }}>
      <NumberInput id="num-share" label="Retrieval share" unit="%" min={0} max={100} step={0.5} precision={1} value={share} onChange={setShare} />
      <NumberInput id="num-temp" label="Temperature" min={0} max={2} step={0.1} precision={2} value={temp} onChange={setTemp} />
      <NumberInput id="num-budget" label="Token budget" unit="tokens" min={1000} max={200000} step={1000} largeStep={16000} format={(n) => n.toLocaleString('en-US')} value={budget} onChange={setBudget} />
    </div>
  );
};

export const Error = () => {
  const [value, setValue] = useState<number | null>(0);
  return (
    <div style={{ maxWidth: 220 }}>
      <NumberInput id="num-retries" label="Max retries" min={0} max={10} value={value} onChange={setValue} error={value === 0 ? 'At least one retry is required' : undefined} />
    </div>
  );
};

export const Disabled = () => (
  <div style={{ display: 'grid', gap: 16, maxWidth: 220 }}>
    <NumberInput id="num-disabled" label="Concurrency" min={1} max={8} value={4} onChange={() => {}} disabled hint="Locked by workspace policy" />
    <NumberInput id="num-readonly" label="Seats in plan" value={25} onChange={() => {}} readOnly />
  </div>
);

export const Small = () => {
  const [value, setValue] = useState<number | null>(2);
  return (
    <div style={{ maxWidth: 180 }}>
      <NumberInput id="num-qty" label="Quantity" size="sm" min={0} max={99} value={value} onChange={setValue} />
    </div>
  );
};
