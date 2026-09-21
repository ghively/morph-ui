import { useState } from 'react';
import { TreeView } from './TreeView';

const NODES = [
  {
    id: 'support',
    label: 'Support',
    meta: '120k',
    children: [
      { id: 'tickets', label: 'Ticket archive', meta: '118k' },
      { id: 'macros', label: 'Macros', meta: '2k' },
    ],
  },
  {
    id: 'sales',
    label: 'Sales',
    meta: '48k',
    children: [
      { id: 'crm', label: 'CRM notes', meta: '41k' },
      { id: 'calls', label: 'Call transcripts', meta: '7k' },
    ],
  },
  { id: 'finance', label: 'Finance', meta: '9k' },
];

export default {
  title: 'TreeView',
  component: TreeView,
};

export const Default = () => {
  const [selectedId, setSelectedId] = useState<string | undefined>('tickets');
  return (
    <div style={{ maxWidth: 300 }}>
      <TreeView nodes={NODES} selectedId={selectedId} onSelect={setSelectedId} defaultExpandedIds={['support']} label="Corpus browser" />
    </div>
  );
};
