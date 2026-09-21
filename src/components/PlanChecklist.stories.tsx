import { PlanChecklist } from './PlanChecklist';

export default {
  title: 'PlanChecklist',
  component: PlanChecklist,
};

export const Default = () => (
  <div style={{ maxWidth: 420 }}>
    <PlanChecklist
      label="Q3 summary run"
      steps={[
        { id: 's1', label: 'Pull ticket deltas', detail: '1,204 rows', state: 'done' },
        { id: 's2', label: 'Aggregate by department', detail: '4 groups', state: 'done' },
        { id: 's3', label: 'Draft stakeholder summary', detail: 'streaming…', state: 'active' },
        { id: 's4', label: 'Finance sign-off', detail: 'waiting on approval', state: 'blocked' },
        { id: 's5', label: 'Publish to #results', state: 'todo' },
      ]}
    />
  </div>
);
