import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { TreeTable } from '../src/components/TreeTable';

type Row = { name: string; n: number };

const ROWS = [
  {
    id: 'a',
    data: { name: 'Alpha', n: 3 } as Row,
    children: [
      { id: 'a1', data: { name: 'Alpha kid 1', n: 2 } as Row },
      { id: 'a2', data: { name: 'Alpha kid 2', n: 1 } as Row },
    ],
  },
  { id: 'b', data: { name: 'Beta', n: 5 } as Row },
];

const COLUMNS = [
  { key: 'name', header: 'Name' },
  { key: 'n', header: 'N', align: 'right' as const },
];

describe('TreeTable', () => {
  it('renders only roots when collapsed and children after expanding', () => {
    const { container } = render(<TreeTable<Row> columns={COLUMNS} rows={ROWS} />);
    expect(container.querySelectorAll('[data-treetable-row]')).toHaveLength(2);
    const toggle = screen.getByRole('button', { name: 'Expand Alpha' });
    fireEvent.click(toggle);
    expect(container.querySelectorAll('[data-treetable-row]')).toHaveLength(4);
    expect(screen.getByText('Alpha kid 1')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Collapse Alpha' }));
    expect(container.querySelectorAll('[data-treetable-row]')).toHaveLength(2);
  });

  it('leaf rows render a disabled toggle', () => {
    render(<TreeTable<Row> columns={COLUMNS} rows={ROWS} />);
    expect(screen.getByText('Beta')).toBeTruthy();
    const betaRow = screen.getByText('Beta').closest('tr')!;
    const btn = betaRow.querySelector('[data-treetable-toggle]') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('sorts siblings within each level without flattening structure', () => {
    const { container } = render(
      <TreeTable<Row> columns={COLUMNS} rows={ROWS} defaultExpandedIds={['a']} />,
    );
    const names = () =>
      Array.from(container.querySelectorAll('[data-treetable-row]')).map((r) => r.querySelector('[data-treetable-cell]')!.textContent);
    expect(names()).toEqual(['Alpha', 'Alpha kid 1', 'Alpha kid 2', 'Beta']);

    fireEvent.click(screen.getByRole('button', { name: 'Sort by N' }));
    expect(names()[0]).toBe('Alpha'); // Alpha(3) < Beta(5) at root; kids 1 < 2
    expect(names()[1]).toBe('Alpha kid 2');
    fireEvent.click(screen.getByRole('button', { name: 'Sort by N' })); // desc
    expect(names()[0]).toBe('Beta');
    expect(names()[1]).toBe('Alpha');
    expect(names()[2]).toBe('Alpha kid 1');
  });

  it('reports sort and expanded changes', () => {
    const onSortChange = vi.fn();
    const onExpandedChange = vi.fn();
    const { container } = render(
      <TreeTable<Row> columns={COLUMNS} rows={ROWS} onSortChange={onSortChange} onExpandedChange={onExpandedChange} />,
    );
    const sortBtns = container.querySelectorAll('[data-treetable-sort]');
    fireEvent.click(sortBtns[0]!);
    expect(onSortChange).toHaveBeenCalledWith('name', 'asc');
    fireEvent.click(screen.getByRole('button', { name: 'Expand Alpha' }));
    expect(onExpandedChange).toHaveBeenCalledWith(['a']);
  });

  it('aria-sort follows the active column', () => {
    const { container } = render(<TreeTable<Row> columns={COLUMNS} rows={ROWS} defaultSortKey="n" defaultSortDir="desc" />);
    const ths = container.querySelectorAll('thead th');
    expect(ths[0]!.getAttribute('aria-sort')).toBe('none');
    expect(ths[1]!.getAttribute('aria-sort')).toBe('descending');
  });

  it('shows the empty state', () => {
    render(<TreeTable<Row> columns={COLUMNS} rows={[]} emptyText="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeTruthy();
  });
});
