import type { TextareaHTMLAttributes, ReactNode } from 'react';
import './TextArea.css';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label?: ReactNode;
  error?: ReactNode;
  hint?: ReactNode;
}

/** Multi-line text input; same label / hint / error wiring as TextField. */
export function TextArea({ id, label, error, hint, disabled, className = '', rows = 3, ...rest }: TextAreaProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className={className} data-textarea="" data-invalid={error ? '' : undefined} data-disabled={disabled ? '' : undefined}>
      {label && <label htmlFor={id}>{label}</label>}
      <textarea
        id={id}
        rows={rows}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...rest}
      />
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
