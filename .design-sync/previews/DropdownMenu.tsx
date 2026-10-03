import { useEffect, useRef, useState, type ReactNode } from 'react';
import { DropdownMenu } from '../../src/components/DropdownMenu';
import { Button } from '../../src/components/Button';

// DropdownMenu has no `defaultOpen`; open it once on mount through its own
// trigger so the static card shows the menu, not just the button.
function OpenOnMount({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    ref.current?.querySelector<HTMLElement>('[data-dropdowntrigger]')?.click();
  }, []);
  return <div ref={ref} style={{ minHeight: 220 }}>{children}</div>;
}

export const Actions = () => (
  <OpenOnMount>
    <DropdownMenu
      trigger={<Button size="sm">Export ▾</Button>}
      sections={[
        {
          title: 'Format',
          items: [
            { id: 'csv', label: 'CSV', hint: 'rows' },
            { id: 'pdf', label: 'PDF report', hint: 'styled' },
            { id: 'json', label: 'JSON', hint: 'raw' },
          ],
        },
        {
          items: [{ id: 'delete', label: 'Delete view', danger: true }],
        },
      ]}
      onPick={() => {}}
    />
  </OpenOnMount>
);

export const CheckboxItems = () => {
  const [checked, setChecked] = useState<string[]>(['fresh', 'dept']);
  return (
    <OpenOnMount>
      <DropdownMenu
        trigger={<Button size="sm">Columns ▾</Button>}
        label="Visible columns"
        sections={[
          {
            title: 'Visible columns',
            items: [
              { id: 'fresh', label: 'Freshness' },
              { id: 'dept', label: 'Department' },
              { id: 'tokens', label: 'Tokens' },
              { id: 'owner', label: 'Owner' },
            ],
          },
        ]}
        checkedIds={checked}
        onToggle={(id, next) => setChecked((c) => (next ? [...c, id] : c.filter((x) => x !== id)))}
      />
    </OpenOnMount>
  );
};
