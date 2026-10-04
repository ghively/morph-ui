import './TextArea.css';
import { fieldIds, useFieldId, FieldNotes, type TextAreaProps } from './forms.shared';

/** Multi-line text input; same label / hint / error wiring as TextField. */
export function TextArea({ id: idProp, label, error, hint, disabled, className = '', rows = 3, ...rest }: TextAreaProps) {
  const id = useFieldId(idProp);
  const ids = fieldIds(id, hint, error);
  const len = typeof rest.value === 'string' ? rest.value.length : undefined;
  return (
    <div className={className} data-textarea="" {...ids.root} data-disabled={disabled ? '' : undefined}>
      {label && <label htmlFor={id}>{label}</label>}
      <textarea id={id} rows={rows} disabled={disabled} aria-invalid={ids.invalid} aria-describedby={ids.describedBy} {...rest} />
      {rest.maxLength != null && len != null && <span data-textareacount="" data-full={len >= rest.maxLength ? '' : undefined} aria-hidden="true">{len + ' / ' + rest.maxLength}</span>}
      <FieldNotes ids={ids} hint={hint} error={error} />
    </div>
  );
}

export type { TextAreaProps } from './forms.shared';
