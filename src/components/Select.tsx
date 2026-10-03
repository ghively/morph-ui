import './Select.css';
import { fieldIds, FieldNotes, Chevron, type SelectProps } from './forms.shared';

/** Native-select dropdown: keyboard, screen-reader, and mobile friendly by default. */
export function Select({ id, label, options, placeholder, error, hint, disabled, className = '', ...rest }: SelectProps) {
  const ids = fieldIds(id, hint, error);
  return (
    <div className={className} data-select="" {...ids.root} data-disabled={disabled ? '' : undefined}>
      {label && <label htmlFor={id}>{label}</label>}
      <span data-selectwrap="">
        <select id={id} disabled={disabled} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} {...rest}>
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map(o => <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>)}
        </select>
        <Chevron data-chevron="" />
      </span>
      <FieldNotes ids={ids} hint={hint} error={error} />
    </div>
  );
}

export type { SelectOption, SelectProps } from './forms.shared';
