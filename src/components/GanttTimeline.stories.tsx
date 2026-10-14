import { GanttTimeline } from './GanttTimeline';
import { addDays, dayFloor } from './dataShell.shared';

const T0 = dayFloor(new Date('2026-10-05T00:00:00').getTime());

const TASKS = [
  { id: 't1', label: 'Corpus freeze', start: T0, end: addDays(T0, 3), progress: 1, tone: 'success' as const, meta: 'Oct 5–8' },
  { id: 't2', label: 'Index rebuild', start: addDays(T0, 3), end: addDays(T0, 8), progress: 0.55, tone: 'info' as const, dependsOn: ['t1'], meta: '5d' },
  { id: 't3', label: 'Eval sweep', start: addDays(T0, 6), end: addDays(T0, 11), progress: 0.2, dependsOn: ['t2'], meta: 'Priya' },
  { id: 't4', label: 'Cutover', start: addDays(T0, 11), end: addDays(T0, 13), tone: 'danger' as const, dependsOn: ['t2', 't3'], meta: 'flag' },
  { id: 't5', label: 'Docs + runbook', start: addDays(T0, 9), end: addDays(T0, 15), tone: 'warn' as const, dependsOn: ['t3'], meta: 'Mara' },
];

export default {
  title: 'GanttTimeline',
  component: GanttTimeline,
};

export const Default = () => (
  <div style={{ maxWidth: 860 }}>
    <GanttTimeline tasks={TASKS} zoom="day" span={16} now={addDays(T0, 7)} label="Re-index plan" />
  </div>
);

export const WeekZoom = () => (
  <div style={{ maxWidth: 860 }}>
    <GanttTimeline tasks={TASKS} zoom="week" span={6} now={addDays(T0, 10)} />
  </div>
);

export const MonthZoom = () => (
  <div style={{ maxWidth: 860 }}>
    <GanttTimeline tasks={TASKS} zoom="month" span={4} now={addDays(T0, 20)} />
  </div>
);
