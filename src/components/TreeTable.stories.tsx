import { TreeTable } from './TreeTable';

type CostRow = { name: string; requests: number; spend: number; owner: string };

const ROWS = [
  {
    id: 'rag',
    data: { name: 'RAG pipeline', requests: 48_210, spend: 612.4, owner: 'Priya' } as CostRow,
    children: [
      {
        id: 'rag-index',
        data: { name: 'Indexing', requests: 4_120, spend: 118.9, owner: 'Atlas' } as CostRow,
        children: [
          { id: 'rag-index-embed', data: { name: 'Embeddings', requests: 1_804, spend: 62.1, owner: 'Atlas' } as CostRow },
          { id: 'rag-index-chunk', data: { name: 'Chunking', requests: 2_316, spend: 56.8, owner: 'Atlas' } as CostRow },
        ],
      },
      { id: 'rag-answer', data: { name: 'Answering', requests: 44_090, spend: 493.5, owner: 'Priya' } as CostRow },
    ],
  },
  {
    id: 'ops',
    data: { name: 'Agent ops', requests: 12_004, spend: 288.2, owner: 'Ren' } as CostRow,
    children: [
      { id: 'ops-runs', data: { name: 'Nightly runs', requests: 8_440, spend: 201.7, owner: 'Ren' } as CostRow },
      { id: 'ops-tools', data: { name: 'Tool calls', requests: 3_564, spend: 86.5, owner: 'Atlas' } as CostRow },
    ],
  },
  { id: 'chat', data: { name: 'Chat surface', requests: 96_502, spend: 344.0, owner: 'Mara' } as CostRow },
];

const COLUMNS = [
  { key: 'name', header: 'Service', sortable: true },
  { key: 'requests', header: 'Requests', align: 'right' as const, sortable: true },
  { key: 'spend', header: 'Spend (USD)', align: 'right' as const, sortable: true },
  { key: 'owner', header: 'Owner', sortable: true },
];

export default {
  title: 'TreeTable',
  component: TreeTable,
};

export const Default = () => (
  <div style={{ maxWidth: 640 }}>
    <TreeTable<CostRow>
      caption="Spend by service"
      columns={COLUMNS}
      rows={ROWS}
      defaultExpandedIds={['rag']}
      rowMeta={(_n, descendants) => (descendants > 0 ? `${descendants} below` : undefined)}
    />
  </div>
);

export const FullyCollapsed = () => (
  <div style={{ maxWidth: 640 }}>
    <TreeTable<CostRow> columns={COLUMNS} rows={ROWS} />
  </div>
);

export const SortedBySpend = () => (
  <div style={{ maxWidth: 640 }}>
    <TreeTable<CostRow>
      columns={COLUMNS}
      rows={ROWS}
      defaultExpandedIds={['rag', 'rag-index', 'ops']}
      defaultSortKey="spend"
      defaultSortDir="desc"
    />
  </div>
);
