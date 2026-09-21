import { ContextAttributionList } from './ContextAttributionList';

export default {
  title: 'ContextAttributionList',
  component: ContextAttributionList,
};

export const Default = () => (
  <ContextAttributionList
    budget={128000}
    entries={[
      { source: 'Ticket archive', tokens: 18400, department: 'Support' },
      { source: 'Sales CRM notes', tokens: 9200, department: 'Sales' },
      { source: 'Q3 filings', tokens: 4100, department: 'Finance' },
      { source: 'Runbooks', tokens: 1800, department: 'Engineering' },
    ]}
  />
);
