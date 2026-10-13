import { CalendarBoard } from './CalendarBoard';
import { dayFloor } from './dataShell.shared';

const NOW = new Date('2026-10-13T12:00:00').getTime();
const D = (day: number) => dayFloor(new Date(2026, 9, day, 12).getTime());

const EVENTS = [
  { id: 'e1', title: 'Index rebuild', at: D(6), tone: 'info' as const, meta: '2h' },
  { id: 'e2', title: 'Eval review', at: D(13), tone: 'success' as const, meta: 'Priya' },
  { id: 'e3', title: 'Cutover window', at: D(22), tone: 'danger' as const, meta: 'flag' },
  { id: 'e4', title: 'Docs due', at: D(22), tone: 'warn' as const },
  { id: 'e5', title: '1:1 Ren', at: D(28) },
  { id: 'e6', title: 'Retro', at: D(29), tone: 'success' as const },
];

export default {
  title: 'CalendarBoard',
  component: CalendarBoard,
};

export const Default = () => (
  <div style={{ maxWidth: 760 }}>
    <CalendarBoard events={EVENTS} now={NOW} label="Team calendar" />
  </div>
);

export const DenseDay = () => (
  <div style={{ maxWidth: 760 }}>
    <CalendarBoard
      now={NOW}
      events={[
        ...EVENTS,
        { id: 'e7', title: 'On-call swap', at: D(13) },
        { id: 'e8', title: 'Budget sync', at: D(13), tone: 'warn' as const },
      ]}
    />
  </div>
);

export const NoDrag = () => (
  <div style={{ maxWidth: 760 }}>
    <CalendarBoard events={EVENTS} now={NOW} draggable={false} />
  </div>
);
