import './DateRangePicker.css';
import { useDateRange, plural, type DateRangePickerProps } from './forms.shared';

/** From/to date range with quick presets. Native date inputs: free calendar + mobile support. */
export function DateRangePicker(props: DateRangePickerProps) {
  const d = useDateRange(props);
  const { id, value, activePresetId, label = 'Date range', className = '' } = props;
  return (
    <div className={className} data-daterange="" data-invalid={d.invalid ? '' : undefined}>
      <div data-daterangepills="" role="group" aria-label={label + ' presets'}>
        {d.presets.map(p => (
          <button key={p.id} type="button" data-preset="" data-on={p.id === activePresetId ? '' : undefined} aria-pressed={p.id === activePresetId} onClick={() => d.pick(p)}>{p.label}</button>
        ))}
        {d.days !== undefined && <span data-datespan="" aria-live="polite">{plural(d.days, 'day')}</span>}
      </div>
      <div data-datefields="">
        <label>
          <span>From</span>
          <input id={id + '-from'} type="date" value={value.from} max={d.cap} aria-invalid={d.invalid || undefined} aria-describedby={d.invalid ? id + '-error' : undefined} onChange={e => d.set({ from: e.target.value })} />
        </label>
        <span data-datetosep="" aria-hidden="true">→</span>
        <label>
          <span>To</span>
          <input id={id + '-to'} type="date" value={value.to} max={d.cap} aria-invalid={d.invalid || undefined} aria-describedby={d.invalid ? id + '-error' : undefined} onChange={e => d.set({ to: e.target.value })} />
        </label>
      </div>
      {d.invalid && <div data-dateerror="" id={id + '-error'} role="alert">Start date must be before end date.</div>}
    </div>
  );
}

export type { DateRange, DateRangePreset, DateRangePickerProps } from './forms.shared';
