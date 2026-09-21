import type { ReactNode } from 'react';
import './FormField.css';

export type FieldProbe = 'idle' | 'checking' | 'ok' | 'fail';

export interface FormFieldProps {
  /** Used for `htmlFor` and, when the child is a bare element, injected as its `id`. */
  id: string;
  label: string;
  children: ReactNode;
  /** Rendered in `[data-hint]`; a node so callers can embed `[data-num]` spans (Login does). */
  hint?: ReactNode;
  /** Drives `[data-hint][data-probe]` and `aria-live="polite"` on the hint. */
  probe?: FieldProbe;
  /** Marks the field invalid; the caller still sets `aria-invalid` on its own input. */
  invalid?: boolean;
  className?: string;
}

export function FormField({
  id,
  label,
  children,
  hint,
  probe,
  invalid,
  className = ''
}: FormFieldProps) {
  const showHint = hint !== undefined || probe !== undefined;

  return (
    <div className={className} data-formfield="" data-invalid={invalid ? "" : undefined}>
      <label htmlFor={id}>{label}</label>
      {children}
      {showHint && (
        <div data-hint="" data-meta="" data-probe={probe} aria-live="polite">
          {hint}
        </div>
      )}
    </div>
  );
}
