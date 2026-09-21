import { DataTable } from './DataTable';
import { Badge } from './Badge';

export default {
  title: 'DataTable',
  component: DataTable,
};

type SourceRow = {
  source: string;
  department: string;
  chunks: number;
  freshness: string;
  fresh: boolean;
};

const ROWS: SourceRow[] = [
  { source: 'Sales CRM', department: 'Sales', chunks: 48210, freshness: '4m ago', fresh: true },
  { source: 'Ticket archive', department: 'Support', chunks: 120408, freshness: '6h ago', fresh: false },
  { source: 'Q3 filings', department: 'Finance', chunks: 3210, freshness: '22m ago', fresh: true },
  { source: 'Runbooks', department: 'Engineering', chunks: 8944, freshness: '1h ago', fresh: true },
];

export const Default = () => (
  <DataTable<SourceRow>
    caption="Connected sources"
    columns={[
      { key: 'source', header: 'Source', sortable: true },
      { key: 'department', header: 'Department', sortable: true },
      { key: 'chunks', header: 'Chunks', align: 'right', sortable: true },
      {
        key: 'freshness',
        header: 'Freshness',
        sortable: true,
        render: (row) => <Badge tone={row.fresh ? 'success' : 'warn'}>{row.freshness}</Badge>,
      },
    ]}
    rows={ROWS}
    rowKey={(row) => row.source}
    defaultSortKey="chunks"
    defaultSortDir="desc"
  />
);

export const Empty = () => (
  <DataTable<SourceRow>
    columns={[{ key: 'source', header: 'Source' }]}
    rows={[]}
    rowKey={(row) => row.source}
    emptyText="No sources match this filter."
  />
);
