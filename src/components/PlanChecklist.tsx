import './PlanChecklist.css';

export type PlanStepState = 'done' | 'active' | 'todo' | 'blocked';

export interface PlanStep {
  id: string;
  label: string;
  detail?: string;
  state: PlanStepState;
}

export interface PlanChecklistProps {
  steps: PlanStep[];
  label?: string;
  className?: string;
}

/** Agent plan readout: what ran, what's running, what's stuck. */
export function PlanChecklist({ steps, label = 'Plan', className = '' }: PlanChecklistProps) {
  const done = steps.filter((s) => s.state === 'done').length;
  return (
    <div className={className} data-plan="">
      <div data-planhead="">
        <span>{label}</span>
        <span data-planprogress="" aria-label={`${done} of ${steps.length} steps done`}>
          {done}/{steps.length}
        </span>
      </div>
      <ol data-planlist="">
        {steps.map((s) => (
          <li key={s.id} data-planstep="" data-state={s.state}>
            <span data-planmarker="" aria-hidden="true">
              {s.state === 'done' ? (
                <svg width="11" height="11" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1.5 5.5l2.5 2.5 4.5-5.5" />
                </svg>
              ) : s.state === 'blocked' ? (
                '!'
              ) : s.state === 'active' ? (
                <span data-planpulse="" />
              ) : (
                <span data-plantodo="" />
              )}
            </span>
            <span data-plantext="">
              <span data-planlabel="">{s.label}</span>
              {s.detail && <span data-plandetail="">{s.detail}</span>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
