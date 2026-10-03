import './SegmentedControl.css';
import { useSegmented, type SegmentedControlProps } from './forms.shared';

export function SegmentedControl<T extends string>(props: SegmentedControlProps<T>) {
  const s = useSegmented(props);
  const { value, options, onChange, label, className = '' } = props;
  return (
    <div className={className} data-seg="" role="radiogroup" aria-label={label} onKeyDown={s.onKeyDown} style={s.thumb}>
      {s.idx >= 0 && <span data-segthumb="" aria-hidden="true" />}
      {options.map((o, i) => (
        <button key={o.value} type="button" data-segbtn="" data-on={String(o.value === value)} role="radio" aria-checked={o.value === value} tabIndex={s.tab(i)} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export type { SegmentedControlOption, SegmentedControlProps } from './forms.shared';
