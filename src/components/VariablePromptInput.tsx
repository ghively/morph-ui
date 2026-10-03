import './VariablePromptInput.css';
import { useVarPrompt, type VariablePromptInputProps } from './ragAnswer.shared';

export function VariablePromptInput(props: VariablePromptInputProps) {
  const v = useVarPrompt(props);
  return (
    <div className={'var-prompt ' + (props.className || '')} data-varprompt="">
      <label htmlFor={v.textarea.id} className="var-prompt-label">{v.label}</label>
      <textarea {...v.textarea} className="var-prompt-tpl" data-templatetext="" />
      {v.slots.length > 0 && (
        <div className="var-prompt-fields" role="group" aria-label="Prompt variables">
          {v.slots.map(n => {
            const ok = !v.missing.includes(n);
            return (
              <label key={n} className="var-prompt-field" data-filled={ok ? '' : undefined}>
                <span className="var-prompt-name">{n}</span>
                <input value={v.live[n] ?? ''} onChange={e => v.set(n, e.target.value)} placeholder="—" aria-label={'Value for ' + n} />
                <span className="var-prompt-st" aria-hidden="true">{ok ? 'set' : 'empty'}</span>
              </label>
            );
          })}
        </div>
      )}
      <div className="var-prompt-preview">
        <span className="var-prompt-p" aria-hidden="true">$</span>
        <p className="var-prompt-text" data-varpreview="">{v.segs.map(s => s.slot ? <mark key={s.key} data-filled={s.filled ? '' : undefined}>{s.filled ? s.text : '{{' + s.text + '}}'}</mark> : <span key={s.key}>{s.text}</span>)}</p>
      </div>
      {v.hasRun && (
        <div className="var-prompt-actions">
          <span className="var-prompt-hint">{v.missing.length ? v.missing.length + ' unfilled' : 'ready'}</span>
          <button type="button" className="var-prompt-run" disabled={!v.canRun} onClick={v.run}>{v.runLabel} <span aria-hidden="true">↵</span></button>
        </div>
      )}
    </div>
  );
}

export type { VariablePromptInputProps } from './ragAnswer.shared';
