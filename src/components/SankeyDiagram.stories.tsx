import { SankeyDiagram } from './SankeyDiagram';

export default {
  title: 'SankeyDiagram',
  component: SankeyDiagram,
};

export const Default = () => (
  <SankeyDiagram
    label="Retrieval traffic flow (requests per day)"
    height={280}
    nodes={[
      { id: 'web', label: 'Web app' },
      { id: 'api', label: 'API' },
      { id: 'embed', label: 'Embed' },
      { id: 'rerank', label: 'Rerank' },
      { id: 'store', label: 'Vector store' },
      { id: 'cache', label: 'Cache' },
      { id: 'miss', label: 'Disk' },
    ]}
    links={[
      { source: 'web', target: 'embed', value: 4200 },
      { source: 'api', target: 'embed', value: 2600 },
      { source: 'embed', target: 'cache', value: 3100 },
      { source: 'embed', target: 'rerank', value: 3700 },
      { source: 'cache', target: 'store', value: 3100 },
      { source: 'rerank', target: 'store', value: 3700 },
      { source: 'store', target: 'miss', value: 900 },
    ]}
  />
);

export const BudgetFlow = () => (
  <SankeyDiagram
    label="Monthly budget allocation (dollars)"
    formatValue={(v) => `$${v}`}
    height={240}
    nodes={[
      { id: 'budget', label: 'Budget' },
      { id: 'models', label: 'Models' },
      { id: 'infra', label: 'Infra' },
      { id: 'gpu', label: 'GPU rent' },
      { id: 'api', label: 'API spend' },
    ]}
    links={[
      { source: 'budget', target: 'models', value: 700 },
      { source: 'budget', target: 'infra', value: 300 },
      { source: 'models', target: 'gpu', value: 450 },
      { source: 'models', target: 'api', value: 250 },
    ]}
  />
);
