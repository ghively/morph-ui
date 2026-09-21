import type { InputHTMLAttributes, ReactNode } from 'react';
import './TextField.css';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'size'> {
  id: string;
  /** Visible label. Omit only when `aria-label` is given instead. */
  label?: ReactNode;
  /** Error text; sets invalid styling, `aria-invalid`, and announces via `role="alert"`. */
  error?: ReactNode;
  hint?: ReactNode;
}

/**
 * Standard single-line text input with label / hint / error wiring.
 * For full probe states use FormField directly.
 */
export function TextField({ id, label, error, hint, disabled, className = '', ...rest }: TextFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className={className} data-textfield="" data-invalid={error ? '' : undefined} data-disabled={disabled ? '' : undefined}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
      />
      {hint && !error && (
        <div data-fieldhint="" id={hintId}>
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
