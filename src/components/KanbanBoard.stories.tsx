import { KanbanBoard } from './KanbanBoard';

const COLUMNS = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'doing', title: 'In flight', wipLimit: 2 },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

const CARDS = [
  { id: 'c1', title: 'Re-index support corpus', meta: 'est. 2h · Priya', tone: 'info' as const },
  { id: 'c2', title: 'Fix citation dedupe', meta: 'bug · Atlas', tone: 'danger' as const },
  { id: 'c3', title: 'Ship eval harness', meta: 'est. 5h · Ren' },
  { id: 'c4', title: 'Write runbook', meta: 'docs · Mara', tone: 'success' as const },
  { id: 'c5', title: 'Cost alerts', meta: 'est. 1h · Ren', tone: 'warn' as const },
];

export default {
  title: 'KanbanBoard',
  component: KanbanBoard,
};

export const Default = () => (
  <div style={{ maxWidth: 900 }}>
    <KanbanBoard
      label="Delivery board"
      columns={COLUMNS}
      cards={CARDS}
      defaultPlacements={{ c1: 'backlog', c2: 'doing', c3: 'doing', c4: 'review', c5: 'backlog' }}
    />
  </div>
);

export const WipOverLimit = () => (
  <div style={{ maxWidth: 720 }}>
    <KanbanBoard
      columns={COLUMNS}
      cards={CARDS}
      defaultPlacements={{ c1: 'doing', c2: 'doing', c3: 'doing', c4: 'done', c5: 'backlog' }}
    />
  </div>
);

export const EmptyColumn = () => (
  <div style={{ maxWidth: 720 }}>
    <KanbanBoard
      columns={[{ id: 'todo', title: 'To do' }, { id: 'later', title: 'Later' }]}
      cards={[{ id: 'x', title: 'Only card' }]}
    />
  </div>
);
