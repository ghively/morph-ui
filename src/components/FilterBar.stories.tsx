import { useState } from 'react';
import { FilterBar } from './FilterBar';

const ALL = [
  { id: 'dept-support', label: 'Support' },
  { id: 'fresh', label: 'Fresh only' },
  { id: 'win-7d', label: 'Last 7 days' },
];

export default {
  title: 'FilterBar',
  component: FilterBar,
};

export const Default = () => {
  const [filters, setFilters] = useState(ALL);
  return (
    <FilterBar
      filters={filters}
      resultCount={1284}
      onRemove={(id) => setFilters((f) => f.filter((x) => x.id !== id))}
      onClearAll={() => setFilters([])}
    />
  );
};

export const Empty = () => <FilterBar filters={[]} resultCount={184020} />;
