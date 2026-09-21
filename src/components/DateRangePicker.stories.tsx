import { useState } from 'react';
import { DateRangePicker } from './DateRangePicker';
import type { DateRange } from './DateRangePicker';

export default {
  title: 'DateRangePicker',
  component: DateRangePicker,
};

export const Default = () => {
  const [range, setRange] = useState<DateRange>({ from: '', to: '' });
  const [preset, setPreset] = useState<string | null>(null);
  return (
    <div style={{ maxWidth: 340 }}>
      <DateRangePicker id="rag-range" value={range} onChange={setRange} activePresetId={preset ?? undefined} onPresetChange={setPreset} />
      <p style={{ fontSize: 12, opacity: 0.7 }}>
        {range.from || range.to ? `${range.from || '?'} → ${range.to || '?'}` : 'Pick a preset or custom range.'}
      </p>
    </div>
  );
};
