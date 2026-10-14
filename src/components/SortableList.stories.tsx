import { SortableList } from './SortableList';

const ITEMS = [
  { id: 's1', content: 'Freeze corpus snapshot', meta: 'owner · Priya' },
  { id: 's2', content: 'Rebuild vector index', meta: 'est. 5h' },
  { id: 's3', content: 'Run eval sweep', meta: '220 cases' },
  { id: 's4', content: 'Write cutover runbook', meta: 'docs' },
  { id: 's5', content: 'Notify #ops', meta: 'last' },
];

export default {
  title: 'SortableList',
  component: SortableList,
};

export const Default = () => (
  <div style={{ maxWidth: 480 }}>
    <SortableList items={ITEMS} label="Cutover checklist" />
  </div>
);

export const WithoutHandles = () => (
  <div style={{ maxWidth: 480 }}>
    <SortableList items={ITEMS} handles={false} />
  </div>
);

export const Controlled = () => (
  <div style={{ maxWidth: 480 }}>
    <SortableList items={ITEMS} controlledOrder={['s3', 's1', 's5', 's2', 's4']} onReorder={() => {}} />
  </div>
);
