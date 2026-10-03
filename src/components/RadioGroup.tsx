import './RadioGroup.css';
import type { RadioGroupProps } from './forms.shared';

/** Fieldset + native radios. One of the options must read as the label for the group. */
export function RadioGroup({ name, options, value, onChange, label, orientation = 'vertical', disabled, className = '' }: RadioGroupProps) {
  return (
    <fieldset className={className} data-radiogroup="" data-orientation={orientation} disabled={disabled}>
      {label && <legend>{label}</legend>}
      {options.map(o => {
        const id = name + '-' + o.value, off = o.disabled || disabled;
        return (
          <span key={o.value} data-radio="" data-disabled={off ? '' : undefined}>
            <input id={id} type="radio" name={name} value={o.value} checked={value === o.value} disabled={off} onChange={() => onChange(o.value)} />
            <label htmlFor={id}>
              <span data-radiolabel="">{o.label}</span>
              {o.hint && <span data-radiohint="">{o.hint}</span>}
            </label>
          </span>
        );
      })}
    </fieldset>
  );
}

export type { RadioOption, RadioGroupProps } from './forms.shared';
