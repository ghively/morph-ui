import { useRef, useEffect } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import './Checkbox.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children' | 'onChange'> {
  id: string;
  label: ReactNode;
  checked: boolean;
  onChange: (next: boolean) => void;
  /** Tri-state dash; implies checked for assistive tech via aria-checked="mixed". */
  indeterminate?: boolean;
}

/** Real native checkbox, styled. Always pairs with a visible label. */
export function Checkbox({ id, label, checked, onChange, indeterminate = false, disabled, className = '', ...rest }: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <span className={className} data-checkbox="" data-disabled={disabled ? '' : undefined}>
      <input
        ref={inputRef}
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-checked={indeterminate ? 'mixed' : undefined}
        onChange={(e) => onChange(e.target.checked)}
        {...rest}
      />
      <label htmlFor={id}>{label}</label>
    </span>
  );
}
