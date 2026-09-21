import type { SelectHTMLAttributes, ReactNode } from 'react';
import './Select.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  id: string;
  label?: ReactNode;
  options: SelectOption[];
  /** Shown as the disabled first option when no value is set. */
  placeholder?: string;
  error?: ReactNode;
  hint?: ReactNode;
}

/** Native-select dropdown: keyboard, screen-reader, and mobile friendly by default. */
export function Select({ id, label, options, placeholder, error, hint, disabled, className = '', ...rest }: SelectProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className={className} data-select="" data-invalid={error ? '' : undefined} data-disabled={disabled ? '' : undefined}>
      {label && <label htmlFor={id}>{label}</label>}
      <span data-selectwrap="">
        <select id={id} disabled={disabled} aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...rest}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg data-chevron="" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 4.5l3 3 3-3" />
        </svg>
      </span>
      {hint && !error && (
        <div data-hint="" id={hintId}>
          {hint}
        </div>
      )}
      {error && (
        <div data-error="" id={errorId} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
