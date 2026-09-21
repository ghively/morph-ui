import type { ReactNode } from 'react';
import './RadioGroup.css';

export interface RadioOption {
  value: string;
  label: ReactNode;
  hint?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (next: string) => void;
  label?: ReactNode;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  className?: string;
}

/** Fieldset + native radios. One of the options must read as the label for the group. */
export function RadioGroup({
  name,
  options,
  value,
  onChange,
  label,
  orientation = 'vertical',
  disabled,
  className = '',
}: RadioGroupProps) {
  return (
    <fieldset className={className} data-radiogroup="" data-orientation={orientation} disabled={disabled}>
      {label && <legend>{label}</legend>}
      {options.map((opt) => {
        const id = `${name}-${opt.value}`;
        return (
          <span key={opt.value} data-radio="" data-disabled={opt.disabled || disabled ? '' : undefined}>
            <input
              id={id}
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              disabled={opt.disabled || disabled}
              onChange={() => onChange(opt.value)}
            />
            <label htmlFor={id}>
              <span data-radiolabel="">{opt.label}</span>
              {opt.hint && <span data-radiohint="">{opt.hint}</span>}
            </label>
          </span>
        );
      })}
    </fieldset>
  );
}
