import './FormField.css';
import { cv, PROBE_C, type FormFieldProps } from './forms.shared';

export function FormField({ id, label, children, hint, probe, invalid, className = '' }: FormFieldProps) {
  const showHint = hint !== undefined || probe !== undefined;
  return (
    <div className={className} data-formfield="" data-invalid={invalid ? '' : undefined} style={cv(invalid ? PROBE_C.fail : PROBE_C[probe ?? 'idle'])}>
      <label htmlFor={id}>{label}</label>
      {children}
      {showHint && (
        <div data-hint="" data-meta="" data-probe={probe} aria-live="polite">
          {probe && probe !== 'idle' && <i data-probedot="" aria-hidden="true" />}
          {hint}
        </div>
      )}
    </div>
  );
}

export type { FormFieldProps, FieldProbe } from './forms.shared';
