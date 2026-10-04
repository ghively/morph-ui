import './TextField.css';
import { fieldIds, useFieldId, FieldNotes, type TextFieldProps } from './forms.shared';

/**
 * Standard single-line text input with label / hint / error wiring.
 * For full probe states use FormField directly.
 */
export function TextField({ id: idProp, label, error, hint, disabled, className = '', ...rest }: TextFieldProps) {
  const id = useFieldId(idProp);
  const ids = fieldIds(id, hint, error);
  return (
    <div className={className} data-textfield="" {...ids.root} data-disabled={disabled ? '' : undefined}>
      {label && <label htmlFor={id}>{label}</label>}
      <input id={id} disabled={disabled} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} {...rest} />
      <FieldNotes ids={ids} hint={hint} error={error} attr="data-fieldhint" />
    </div>
  );
}

export type { TextFieldProps } from './forms.shared';
