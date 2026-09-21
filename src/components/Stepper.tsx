import './Stepper.css';

export interface Step {
  id: string;
  label: string;
  hint?: string;
}

export interface StepperProps {
  steps: Step[];
  current: number;
  onGo?: (index: number) => void;
  label?: string;
  className?: string;
}

/** Numbered wizard progress. Completed steps are clickable when onGo is set. */
export function Stepper({ steps, current, onGo, label = 'Progress', className = '' }: StepperProps) {
  const safe = Math.min(steps.length - 1, Math.max(0, current));
  return (
    <ol className={className} data-stepper="" aria-label={label}>
      {steps.map((s, i) => {
        const state = i < safe ? 'done' : i === safe ? 'current' : 'todo';
        const clickable = onGo && i <= safe;
        return (
          <li key={s.id} data-step="" data-state={state} aria-current={i === safe ? 'step' : undefined}>
            <button type="button" data-stepbtn="" disabled={!clickable} onClick={() => clickable && onGo(i)} aria-label={`${s.label} (step ${i + 1} of ${steps.length})`}>
              <span data-stepnum="" aria-hidden="true">
                {state === 'done' ? (
                  <svg width="11" height="11" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1.5 5.5l2.5 2.5 4.5-5.5" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span data-steptext="">
                <span data-steplabel="">{s.label}</span>
                {s.hint && <span data-stephint="">{s.hint}</span>}
              </span>
            </button>
            {i < steps.length - 1 && <span data-stepconnector="" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}
