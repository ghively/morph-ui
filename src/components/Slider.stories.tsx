import { useState } from 'react';
import { Slider } from './Slider';

export default {
  title: 'Slider',
  component: Slider,
};

export const Threshold = () => {
  const [value, setValue] = useState(0.72);
  return (
    <div style={{ maxWidth: 320 }}>
      <Slider id="rag-threshold" label="Similarity cutoff" min={0.5} max={0.95} step={0.01} value={value} onChange={setValue} formatValue={(v) => v.toFixed(2)} />
      <p style={{ fontSize: 12, opacity: 0.7 }}>Chunks below {value.toFixed(2)} are excluded from answers.</p>
    </div>
  );
};
