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

/** `today` anchors the default presets and the input cap, so the presets never depend on the clock. */
export const AnchoredToday = () => {
  const [range, setRange] = useState<DateRange>({ from: '2026-03-05', to: '2026-03-12' });
  const [preset, setPreset] = useState<string | null>('7d');
  return (
    <div style={{ maxWidth: 340 }}>
      <DateRangePicker id="rag-range-anchored" today="2026-03-12" value={range} onChange={setRange} activePresetId={preset ?? undefined} onPresetChange={setPreset} />
    </div>
  );
};
