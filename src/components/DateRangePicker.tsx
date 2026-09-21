import './DateRangePicker.css';

export interface DateRange {
  from: string;
  to: string;
}

export interface DateRangePreset {
  id: string;
  label: string;
  range: DateRange;
}

export interface DateRangePickerProps {
  id: string;
  value: DateRange;
  onChange: (next: DateRange) => void;
  presets?: DateRangePreset[];
  activePresetId?: string;
  onPresetChange?: (id: string | null) => void;
  label?: string;
  max?: string;
  className?: string;
}

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

const DEFAULT_PRESETS: DateRangePreset[] = [
  { id: '7d', label: '7d', range: { from: isoDaysAgo(7), to: isoDaysAgo(0) } },
  { id: '30d', label: '30d', range: { from: isoDaysAgo(30), to: isoDaysAgo(0) } },
  { id: '90d', label: '90d', range: { from: isoDaysAgo(90), to: isoDaysAgo(0) } },
];

/** From/to date range with quick presets. Native date inputs: free calendar + mobile support. */
export function DateRangePicker({
  id,
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  activePresetId,
  onPresetChange,
  label = 'Date range',
  max,
  className = '',
}: DateRangePickerProps) {
  const today = isoDaysAgo(0);
  const invalid = value.from && value.to ? value.from > value.to : false;

  const set = (patch: Partial<DateRange>) => {
    onPresetChange?.(null);
    onChange({ ...value, ...patch });
  };

  return (
    <div className={className} data-daterange="">
      <div data-daterangepills="" role="group" aria-label={`${label} presets`}>
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            data-preset=""
            data-on={p.id === activePresetId ? '' : undefined}
            aria-pressed={p.id === activePresetId}
            onClick={() => {
              onPresetChange?.(p.id);
              onChange(p.range);
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div data-datefields="">
        <label>
          <span>From</span>
          <input
            id={`${id}-from`}
            type="date"
            value={value.from}
            max={max ?? today}
            aria-invalid={invalid || undefined}
            onChange={(e) => set({ from: e.target.value })}
          />
        </label>
        <span data-datetosep="" aria-hidden="true">
          →
        </span>
        <label>
          <span>To</span>
          <input
            id={`${id}-to`}
            type="date"
            value={value.to}
            max={max ?? today}
            aria-invalid={invalid || undefined}
            onChange={(e) => set({ to: e.target.value })}
          />
        </label>
      </div>
      {invalid && (
        <div data-dateerror="" role="alert">
          Start date must be before end date.
        </div>
      )}
    </div>
  );
}
