import { RetrievalInspector } from './RetrievalInspector';

export default {
  title: 'RetrievalInspector',
  component: RetrievalInspector,
};

export const Default = () => (
  <RetrievalInspector
    threshold={0.7}
    chunks={[
      {
        id: 'c1',
        title: 'March refund policy update',
        excerpt: 'Digital-goods refunds extend from 14 to 30 days when the account is in good standing…',
        score: 0.91,
        department: 'Support',
        tokens: 1840,
      },
      {
        id: 'c2',
        title: 'Billing queue weekly review',
        excerpt: 'Refund-tagged tickets grew 8% WoW; 61% cite the extended window…',
        score: 0.84,
        department: 'Support',
        tokens: 2210,
      },
      {
        id: 'c3',
        title: '2019 archive migration note',
        excerpt: 'Legacy ticket IDs were remapped during the 2019 migration…',
        score: 0.41,
        department: 'Engineering',
        tokens: 620,
      },
    ]}
  />
);

export const Empty = () => <RetrievalInspector chunks={[]} />;
