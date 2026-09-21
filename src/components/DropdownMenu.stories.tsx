import { useState } from 'react';
import { DropdownMenu } from './DropdownMenu';
import { Button } from './Button';

export default {
  title: 'DropdownMenu',
  component: DropdownMenu,
};

export const Actions = () => (
  <DropdownMenu
    trigger={<Button size="sm">Export ▾</Button>}
    sections={[
      {
        title: 'Format',
        items: [
          { id: 'csv', label: 'CSV', hint: 'rows' },
          { id: 'pdf', label: 'PDF report', hint: 'styled' },
        ],
      },
      {
        items: [{ id: 'delete', label: 'Delete view', danger: true }],
      },
    ]}
    onPick={(id) => window.alert(`picked ${id}`)}
  />
);

export const CheckboxItems = () => {
  const [checked, setChecked] = useState<string[]>(['fresh']);
  return (
    <DropdownMenu
      trigger={<Button size="sm">Columns ▾</Button>}
      label="Visible columns"
      sections={[
        {
          items: [
            { id: 'fresh', label: 'Freshness' },
            { id: 'dept', label: 'Department' },
            { id: 'tokens', label: 'Tokens' },
          ],
        },
      ]}
      checkedIds={checked}
      onToggle={(id, next) => setChecked((c) => (next ? [...c, id] : c.filter((x) => x !== id)))}
    />
  );
};
