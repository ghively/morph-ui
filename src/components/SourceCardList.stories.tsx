import { useState } from 'react';
import { SourceCardList } from './SourceCardList';

const SOURCES = [
  {
    id: 's1',
    title: 'March refund policy update',
    excerpt: 'Effective March 3, digital-goods refunds extend from 14 to 30 days when the account is in good standing…',
    department: 'Support',
    score: 0.91,
    url: '#',
  },
  {
    id: 's2',
    title: 'Billing queue weekly review',
    excerpt: 'Refund-tagged tickets grew 8% WoW; 61% cite the extended window as the reason for contact…',
    department: 'Support',
    score: 0.84,
  },
  {
    id: 's3',
    title: 'Q1 revenue recognition note',
    excerpt: 'Extended refund windows shift recognized revenue timing for annual plans…',
    department: 'Finance',
    score: 0.62,
  },
];

export default {
  title: 'SourceCardList',
  component: SourceCardList,
};

export const Default = () => {
  const [activeId, setActiveId] = useState('s1');
  return <SourceCardList sources={SOURCES} activeId={activeId} onSelect={setActiveId} />;
};

export const Compact = () => <SourceCardList sources={SOURCES} compact />;

export const Empty = () => <SourceCardList sources={[]} />;
