import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DataTable } from '../src/components/DataTable';
import { KpiCard } from '../src/components/KpiCard';
import { BarChart } from '../src/components/BarChart';
import { LineChart } from '../src/components/LineChart';
import { DonutChart } from '../src/components/DonutChart';

type SourceRow = {
  source: string;
  chunks: number;
};

const ROWS: SourceRow[] = [
  { source: 'CRM', chunks: 48 },
  { source: 'Tickets', chunks: 120 },
  { source: 'Filings', chunks: 9 },
];

const COLUMNS = [
  { key: 'source', header: 'Source', sortable: true },
  { key: 'chunks', header: 'Chunks', align: 'right' as const, sortable: true },
];

describe('DataTable', () => {
  it('renders rows and caption', () => {
    const { container } = render(
      <DataTable<SourceRow> caption="Sources" columns={COLUMNS} rows={ROWS} rowKey={(r) => r.source} />,
    );
    expect(container.querySelector('caption')?.textContent).toBe('Sources');
    expect(container.querySelectorAll('tbody tr').length).toBe(3);
  });

  it('sorts ascending then descending on header clicks', () => {
    const onSortChange = vi.fn();
    const { container } = render(
      <DataTable<SourceRow> columns={COLUMNS} rows={ROWS} rowKey={(r) => r.source} onSortChange={onSortChange} />,
    );
    const btn = screen.getByRole('button', { name: 'Sort by Chunks' });
    const firstCell = () => container.querySelector('tbody tr td')?.textContent;

    fireEvent.click(btn);
    expect(firstCell()).toBe('Filings');
    expect(onSortChange).toHaveBeenCalledWith('chunks', 'asc');

    fireEvent.click(btn);
    expect(firstCell()).toBe('Tickets');
    expect(onSortChange).toHaveBeenCalledWith('chunks', 'desc');
  });

  it('respects default sort and renders rich cells', () => {
    const { container } = render(
      <DataTable<SourceRow>
        columns={[{ key: 'source', header: 'Source', sortable: true, render: (r) => <strong>{r.source}</strong> }]}
        rows={ROWS}
        rowKey={(r) => r.source}
        defaultSortKey="source"
      />,
    );
    expect(container.querySelector('th')?.getAttribute('aria-sort')).toBe('ascending');
    expect(container.querySelector('tbody strong')?.textContent).toBe('CRM');
  });

  it('empty rows show the empty text spanning all columns', () => {
    const { container } = render(
      <DataTable<SourceRow> columns={COLUMNS} rows={[]} rowKey={(r) => r.source} emptyText="Nothing indexed yet." />,
    );
    const cell = container.querySelector('[data-emptycell]');
    expect(cell?.textContent).toBe('Nothing indexed yet.');
    expect(cell?.getAttribute('colspan')).toBe('2');
  });
});

describe('KpiCard', () => {
  it('renders value, delta tone, and sparkline', () => {
    const { container } = render(
      <KpiCard label="Queries" value="1,284" delta="12% up" deltaDirection="up" spark={[1, 2, 3]} />,
    );
    expect(screen.getByText('1,284')).toBeTruthy();
    const delta = container.querySelector('[data-kpidelta]');
    expect(delta?.getAttribute('data-tone')).toBe('good');
    expect(container.querySelector('[data-kpispark] path')).toBeTruthy();
  });

  it('deltaTone override wins (up-is-bad metrics)', () => {
    const { container } = render(
      <KpiCard label="Churn" value="17" delta="4 more" deltaDirection="up" deltaTone="bad" />,
    );
    expect(container.querySelector('[data-kpidelta]')?.getAttribute('data-tone')).toBe('bad');
  });
});

describe('BarChart', () => {
  it('renders one bar per datum with values as text', () => {
    const { container } = render(
      <BarChart
        label="By dept"
        data={[
          { label: 'Sales', value: 10 },
          { label: 'HR', value: 5 },
        ]}
      />,
    );
    expect(container.querySelectorAll('[data-bar]').length).toBe(2);
    expect(screen.getByText('10')).toBeTruthy();
    expect(container.querySelector('[role="img"]')?.getAttribute('aria-label')).toContain('Sales: 10');
  });

  it('empty data announces itself', () => {
    const { container } = render(<BarChart data={[]} label="By dept" />);
    expect(container.querySelector('[data-barempty]')).toBeTruthy();
  });
});

describe('LineChart', () => {
  it('plots one dot per value with titled points', () => {
    const { container } = render(<LineChart values={[3, 7, 5]} labels={['a', 'b', 'c']} label="Trend" />);
    expect(container.querySelectorAll('[data-linedot]').length).toBe(3);
    expect(container.querySelector('[role="img"]')?.getAttribute('aria-label')).toContain('b: 7');
  });

  it('single point does not crash path math', () => {
    const { container } = render(<LineChart values={[42]} label="One" />);
    expect(container.querySelectorAll('[data-linedot]').length).toBe(1);
  });
});

describe('DonutChart', () => {
  it('renders segments plus a text legend', () => {
    const { container } = render(
      <DonutChart
        label="Share"
        segments={[
          { label: 'A', value: 70 },
          { label: 'B', value: 30 },
        ]}
      />,
    );
    expect(container.querySelectorAll('[data-donutseg]').length).toBe(2);
    expect(screen.getByText('A')).toBeTruthy();
    expect(screen.getByText('30')).toBeTruthy();
    expect(container.querySelector('[data-donutcenter]')).toBeTruthy();
  });
});
