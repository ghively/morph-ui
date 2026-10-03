import { useRef, useEffect } from 'react';
import './Checkbox.css';
import type { CheckboxProps } from './forms.shared';

/** Real native checkbox, styled. Always pairs with a visible label. */
export function Checkbox({ id, label, checked, onChange, indeterminate = false, disabled, className = '', ...rest }: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (ref.current) ref.current.indeterminate = indeterminate; }, [indeterminate]);
  return (
    <span className={className} data-checkbox="" data-disabled={disabled ? '' : undefined}>
      <input ref={ref} id={id} type="checkbox" checked={checked} disabled={disabled} aria-checked={indeterminate ? 'mixed' : undefined} onChange={e => onChange(e.target.checked)} {...rest} />
      <label htmlFor={id}>{label}</label>
    </span>
  );
}

export type { CheckboxProps } from './forms.shared';
