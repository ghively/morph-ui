import './PlanChecklist.css';
import { usePlan, cv, PLAN_C, PLAN_LABEL, type PlanChecklistProps } from './agentOps.shared';

export function PlanChecklist({ steps, label = 'Plan', className = '' }: PlanChecklistProps) {
  const p = usePlan(steps);
  return (
    <div className={'plan-checklist ' + className} data-plan="">
      <div className="plan-checklist-head" data-planhead="">
        <b>{label}</b>
        <span data-planprogress="" aria-label={p.done + ' of ' + p.total + ' steps done'}>{p.done + '/' + p.total}</span>
      </div>
      <div className="plan-checklist-seg" aria-hidden="true">{steps.map(s => <i key={s.id} data-state={s.state} style={cv(PLAN_C[s.state])} />)}</div>
      <ol className="plan-checklist-list" data-planlist="">
        {steps.map((s, i) => (
          <li key={s.id} className="plan-checklist-step" data-planstep="" data-state={s.state} style={cv(PLAN_C[s.state])}>
            <span className="plan-checklist-num" data-planmarker="" aria-hidden="true">{s.state === 'done' ? '✓' : String(i + 1)}</span>
            <span className="plan-checklist-text" data-plantext=""><span data-planlabel="">{s.label}</span>{s.detail && <span className="plan-checklist-detail" data-plandetail="">{s.detail}</span>}</span>
            <span className="plan-checklist-tag">{PLAN_LABEL[s.state]}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export type { PlanStepState, PlanStep, PlanChecklistProps } from './agentOps.shared';
