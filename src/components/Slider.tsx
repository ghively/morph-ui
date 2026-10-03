import './Slider.css';
import { pctOf, vars, type SliderProps } from './forms.shared';

/** Native range input, styled with a fill track and live value readout. */
export function Slider({ id, label, min, max, step = 1, value, onChange, formatValue = v => String(v), disabled, className = '' }: SliderProps) {
  const text = formatValue(value);
  return (
    <div className={className} data-slider="" data-disabled={disabled ? '' : undefined}>
      <div data-sliderhead="">
        {label && <label htmlFor={id}>{label}</label>}
        <output htmlFor={id} data-slideroutput="">{text}</output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} disabled={disabled} aria-valuetext={text} onChange={e => onChange(Number(e.target.value))} data-slidertrack="" style={vars({ 'morph-fill-pct': pctOf(value, min, max) + '%' })} />
      <div data-sliderscale="" aria-hidden="true"><span>{formatValue(min)}</span><span>{formatValue(max)}</span></div>
    </div>
  );
}

export type { SliderProps } from './forms.shared';
