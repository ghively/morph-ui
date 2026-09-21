import { useMemo, useState } from 'react';
import './VariablePromptInput.css';

export interface VariablePromptInputProps {
  id: string;
  label?: string;
  /** Template with {{variable}} slots. Editing the template re-derives the fields. */
  template: string;
  onTemplateChange?: (next: string) => void;
  values?: Record<string, string>;
  onValuesChange?: (next: Record<string, string>) => void;
  onRun?: (filled: string, values: Record<string, string>) => void;
  runLabel?: string;
  readOnlyTemplate?: boolean;
  className?: string;
}

const SLOT = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g;

function slotsOf(template: string): string[] {
  const found: string[] = [];
  let m: RegExpExecArray | null;
  SLOT.lastIndex = 0;
  while ((m = SLOT.exec(template)) !== null) {
    if (!found.includes(m[1]!)) found.push(m[1]!);
  }
  return found;
}

function fill(template: string, values: Record<string, string>): string {
  return template.replace(SLOT, (_whole, name: string) => values[name] ?? `{{${name}}}`);
}

/** Prompt composer: {{variables}} in the template become fill-in fields with live preview. */
export function VariablePromptInput({
  id,
  label = 'Prompt',
  template,
  onTemplateChange,
  values,
  onValuesChange,
  onRun,
  runLabel = 'Run',
  readOnlyTemplate,
  className = '',
}: VariablePromptInputProps) {
  const [innerValues, setInnerValues] = useState<Record<string, string>>({});
  const live = values ?? innerValues;
  const setLive = onValuesChange ?? setInnerValues;

  const slots = useMemo(() => slotsOf(template), [template]);
  const preview = useMemo(() => fill(template, live), [template, live]);

  return (
    <div className={className} data-varprompt="">
      <label htmlFor={`${id}-template`}>{label}</label>
      <textarea
        id={`${id}-template`}
        data-templatetext=""
        value={template}
        readOnly={readOnlyTemplate || !onTemplateChange}
        onChange={onTemplateChange ? (e) => onTemplateChange(e.target.value) : undefined}
        rows={4}
        spellCheck={false}
      />
      {slots.length > 0 && (
        <div data-varfields="" role="group" aria-label="Prompt variables">
          {slots.map((name) => (
            <label key={name} data-varfield="">
              <span data-varname="">{name}</span>
              <input
                value={live[name] ?? ''}
                onChange={(e) => setLive({ ...live, [name]: e.target.value })}
                placeholder={`Enter ${name}…`}
                aria-label={`Value for ${name}`}
              />
            </label>
          ))}
        </div>
      )}
      <div data-varpreview="" aria-label="Filled prompt preview">
        {preview}
      </div>
      {onRun && (
        <div data-varactions="">
          <button type="button" data-varrun="" onClick={() => onRun(preview, live)}>
            {runLabel}
          </button>
        </div>
      )}
    </div>
  );
}
