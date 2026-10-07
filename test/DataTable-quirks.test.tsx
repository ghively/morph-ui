import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataTable } from '../src/components/DataTable';

type Row = { name: string; count: number };
const ROWS: Row[] = [{ name: 'A', count: 1 }, { name: 'B', count: 2 }];
const COLUMNS = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'count', header: 'Count', align: 'right' as const },
];

describe('DataTable caption', () => {
  it('captionHidden keeps the caption as the table accessible name but marks it hidden', () => {
    const { container } = render(
      <DataTable<Row> caption="Incidents" captionHidden columns={COLUMNS} rows={ROWS} rowKey={(r) => r.name} />,
    );
    const caption = container.querySelector('caption')!;
    expect(caption.textContent).toBe('Incidents');
    expect(caption.hasAttribute('data-captionhidden')).toBe(true);
    expect(screen.getByRole('table', { name: 'Incidents' })).toBeTruthy();
  });

  it('caption stays visible by default', () => {
    const { container } = render(
      <DataTable<Row> caption="Incidents" columns={COLUMNS} rows={ROWS} rowKey={(r) => r.name} />,
    );
    expect(container.querySelector('caption')!.hasAttribute('data-captionhidden')).toBe(false);
  });
});

describe('DataTable headers', () => {
  it('sortable and plain headers render in the same header row; only sortable ones get a sort button', () => {
    const { container } = render(<DataTable<Row> columns={COLUMNS} rows={ROWS} rowKey={(r) => r.name} />);
    const ths = container.querySelectorAll('thead th');
    expect(ths[0]!.querySelector('[data-sortbtn]')).toBeTruthy();
    expect(ths[0]!.getAttribute('aria-sort')).toBe('none');
    expect(ths[1]!.querySelector('[data-sortbtn]')).toBeNull();
    expect(ths[1]!.hasAttribute('aria-sort')).toBe(false);
  });
});
