import type { CSSProperties } from 'react';
import './Slider.css';

export interface SliderProps {
  id: string;
  label?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (next: number) => void;
  formatValue?: (value: number) => string;
  disabled?: boolean;
  className?: string;
}

/** Native range input, styled with a fill track and live value readout. */
export function Slider({ id, label, min, max, step = 1, value, onChange, formatValue = (v) => String(v), disabled, className = '' }: SliderProps) {
  const pct = max === min ? 0 : ((Math.min(max, Math.max(min, value)) - min) / (max - min)) * 100;
  return (
    <div className={className} data-slider="">
      <div data-sliderhead="">
        {label && <label htmlFor={id}>{label}</label>}
        <output htmlFor={id} data-slideroutput="">
          {formatValue(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-valuetext={formatValue(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        data-slidertrack=""
        style={{ '--morph-fill-pct': `${pct}%` } as CSSProperties}
      />
    </div>
  );
}
