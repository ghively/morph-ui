import { useState } from 'react';
import { TokenPills, type TokenPillOption } from './TokenPills';

const options: TokenPillOption[] = [
  { id: 'planning', label: 'Planning', count: 4 },
  { id: 'coding', label: 'Coding', count: 12 },
  { id: 'review', label: 'Review', count: 3 },
  { id: 'deploy', label: 'Deploy', count: 1 },
  { id: 'postmortem', label: 'Postmortem', disabled: true },
];

export const Default = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>(['coding']);
  return <TokenPills options={options.map(({ id, label }) => ({ id, label }))} selectedIds={selectedIds} onChange={setSelectedIds} multiSelect={false} ariaLabel="Session phase" />;
};

export const MultiSelectWithCounts = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>(['coding', 'review']);
  return <TokenPills options={options} selectedIds={selectedIds} onChange={setSelectedIds} ariaLabel="Session phases" />;
};
