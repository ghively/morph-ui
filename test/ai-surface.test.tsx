import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { Combobox } from '../src/components/Combobox';
import { MultiSelect } from '../src/components/MultiSelect';
import { DropdownMenu } from '../src/components/DropdownMenu';
import { Drawer } from '../src/components/Drawer';
import { Slider } from '../src/components/Slider';
import { ConfirmDialog } from '../src/components/ConfirmDialog';
import { TreeView } from '../src/components/TreeView';
import { Breadcrumbs } from '../src/components/Breadcrumbs';
import { FileDropzone } from '../src/components/FileDropzone';
import { SearchField } from '../src/components/SearchField';
import { FilterBar } from '../src/components/FilterBar';
import { DateRangePicker } from '../src/components/DateRangePicker';
import { NotificationCenter } from '../src/components/NotificationCenter';
import type { Notification } from '../src/components/NotificationCenter';

describe('Combobox', () => {
  const OPTIONS = [
    { value: 'a', label: 'Atlas Large' },
    { value: 'b', label: 'Atlas Mini' },
  ];

  it('filters by typing and commits on Enter', () => {
    const onChange = vi.fn();
    render(<Combobox id="cb" label="Model" options={OPTIONS} value={null} onChange={onChange} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'mini' } });
    expect(screen.getByRole('option', { name: 'Atlas Mini' })).toBeTruthy();
    expect(screen.queryByRole('option', { name: 'Atlas Large' })).toBeNull();
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith('b');
  });
});

describe('MultiSelect', () => {
  it('adds via Enter and removes chips', () => {
    function Controlled() {
      const [values, setValues] = useState<string[]>([]);
      return (
        <MultiSelect
          id="ms"
          label="Depts"
          options={[
            { value: 'sales', label: 'Sales' },
            { value: 'hr', label: 'People Ops' },
          ]}
          values={values}
          onChange={setValues}
        />
      );
    }
    render(<Controlled />);
    const input = screen.getByLabelText('Depts search');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'sales' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('Sales')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Remove Sales' }));
    expect(screen.queryByRole('button', { name: 'Remove Sales' })).toBeNull();
  });
});

describe('DropdownMenu', () => {
  it('picks an action and closes', () => {
    const onPick = vi.fn();
    render(
      <DropdownMenu
        trigger={<button type="button">Open</button>}
        sections={[{ title: 'Export', items: [{ id: 'csv', label: 'CSV' }] }]}
        onPick={onPick}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'CSV' }));
    expect(onPick).toHaveBeenCalledWith('csv');
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('checkbox items toggle without closing', () => {
    const onToggle = vi.fn();
    render(
      <DropdownMenu
        trigger={<button type="button">Cols</button>}
        sections={[{ items: [{ id: 'dept', label: 'Department' }] }]}
        checkedIds={[]}
        onToggle={onToggle}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Cols' }));
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'Department' }));
    expect(onToggle).toHaveBeenCalledWith('dept', true);
    expect(screen.getByRole('menu')).toBeTruthy();
  });
});

describe('Drawer', () => {
  it('renders dialog, traps Escape, restores nothing fatal on close', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Drawer open onClose={onClose} label="Inspector" title="Why?">
        <p>Body</p>
      </Drawer>,
    );
    expect(screen.getByRole('dialog', { name: 'Inspector' })).toBeTruthy();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();

    rerender(
      <Drawer open={false} label="Inspector" onClose={onClose}>
        <p>Body</p>
      </Drawer>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('Slider', () => {
  it('changes value and formats output', () => {
    const onChange = vi.fn();
    render(<Slider id="sl" label="Cutoff" min={0} max={1} step={0.05} value={0.7} onChange={onChange} formatValue={(v) => v.toFixed(2)} />);
    expect(screen.getByText('0.70')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Cutoff'), { target: { value: '0.8' } });
    expect(onChange).toHaveBeenCalledWith(0.8);
  });
});

describe('ConfirmDialog', () => {
  it('confirms and cancels, focuses confirm', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(<ConfirmDialog open title="Delete?" body="Gone forever." confirmLabel="Delete" danger onConfirm={onConfirm} onCancel={onCancel} />);
    expect(screen.getByRole('alertdialog', { name: 'Delete?' })).toBeTruthy();
    expect(document.activeElement?.textContent).toBe('Delete');
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});

describe('TreeView', () => {
  const NODES = [{ id: 's', label: 'Support', children: [{ id: 't', label: 'Tickets' }] }];

  it('expands and selects leaves', () => {
    const onSelect = vi.fn();
    render(<TreeView nodes={NODES} onSelect={onSelect} label="Corpus" />);
    fireEvent.click(screen.getByRole('treeitem', { name: /Support/ }));
    const leaf = screen.getByRole('treeitem', { name: 'Tickets' });
    fireEvent.click(leaf);
    expect(onSelect).toHaveBeenCalledWith('t');
  });
});

describe('Breadcrumbs', () => {
  it('marks current page and collapses long trails', () => {
    render(
      <Breadcrumbs trail={[{ label: 'Home' }, { label: 'A' }, { label: 'B' }, { label: 'C' }, { label: 'Here' }]} maxVisible={3} />,
    );
    expect(screen.getByText('Here').closest('li')?.getAttribute('aria-current')).toBe('page');
    expect(screen.getByText('…')).toBeTruthy();
  });
});

describe('FileDropzone', () => {
  it('rejects oversize files with an alert', () => {
    const onFiles = vi.fn();
    render(<FileDropzone id="dz" maxSizeBytes={10} onFiles={onFiles} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const big = new File(['x'.repeat(100)], 'big.pdf', { type: 'application/pdf' });
    fireEvent.change(input, { target: { files: [big] } });
    expect(screen.getByRole('alert').textContent).toMatch(/exceeds/);
    expect(onFiles).not.toHaveBeenCalled();
  });
});

describe('SearchField', () => {
  it('submits on Enter and clears', () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    function Controlled() {
      const [v, setV] = useState('abc');
      return <SearchField id="sf" value={v} onChange={(n) => { setV(n); onChange(n); }} onSubmit={onSubmit} />;
    }
    render(<Controlled />);
    fireEvent.keyDown(screen.getByLabelText('Search'), { key: 'Enter' });
    expect(onSubmit).toHaveBeenCalledWith('abc');
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onChange).toHaveBeenCalledWith('');
  });
});

describe('FilterBar', () => {
  it('removes and clears all', () => {
    const onRemove = vi.fn();
    const onClearAll = vi.fn();
    render(
      <FilterBar filters={[{ id: 'a', label: 'Support' }]} resultCount={12} onRemove={onRemove} onClearAll={onClearAll} />,
    );
    expect(screen.getByText('12 results')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Remove filter Support' }));
    expect(onRemove).toHaveBeenCalledWith('a');
    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(onClearAll).toHaveBeenCalledOnce();
  });
});

describe('DateRangePicker', () => {
  it('flags inverted ranges and applies presets', () => {
    const onChange = vi.fn();
    function Controlled() {
      const [v, setV] = useState({ from: '2026-09-10', to: '2026-09-01' });
      return <DateRangePicker id="dr" value={v} onChange={(n) => { setV(n); onChange(n); }} activePresetId={undefined} onPresetChange={() => {}} />;
    }
    render(<Controlled />);
    expect(screen.getByRole('alert').textContent).toMatch(/before end date/);
    fireEvent.click(screen.getByRole('button', { name: '7d' }));
    expect(onChange).toHaveBeenCalledOnce();
    const next = onChange.mock.calls[0]![0] as { from: string; to: string };
    expect(next.from <= next.to).toBe(true);
  });
});

describe('NotificationCenter', () => {
  it('badges unread, marks all read, dismisses', () => {
    function Controlled() {
      const [items, setItems] = useState<Notification[]>([
        { id: 'n1', title: 'Indexed', tone: 'success' },
        { id: 'n2', title: 'Stale', tone: 'warn', read: true },
      ]);
      return (
        <NotificationCenter
          notifications={items}
          onMarkAllRead={() => setItems((ns) => ns.map((n) => ({ ...n, read: true })))}
          onDismiss={(id) => setItems((ns) => ns.filter((n) => n.id !== id))}
        />
      );
    }
    render(<Controlled />);
    expect(screen.getByText('1')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Mark all read' }));
    expect(screen.queryByText('1')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss Stale' }));
    expect(screen.queryByText('Stale')).toBeNull();
  });
});
