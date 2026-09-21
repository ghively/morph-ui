import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../src/components/Button';
import { TextField } from '../src/components/TextField';
import { TextArea } from '../src/components/TextArea';
import { Select } from '../src/components/Select';
import { Checkbox } from '../src/components/Checkbox';
import { RadioGroup } from '../src/components/RadioGroup';
import { Badge } from '../src/components/Badge';
import { Card } from '../src/components/Card';
import { Divider } from '../src/components/Divider';
import { Tabs } from '../src/components/Tabs';
import { Tooltip } from '../src/components/Tooltip';
import { Accordion } from '../src/components/Accordion';
import { ProgressBar } from '../src/components/ProgressBar';
import { Spinner } from '../src/components/Spinner';
import { Pagination } from '../src/components/Pagination';

describe('Button', () => {
  it('fires onClick and renders variant/size hooks', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Button variant="primary" size="lg" onClick={onClick}>
        Save
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn.getAttribute('data-variant')).toBe('primary');
    expect(btn.getAttribute('data-size')).toBe('lg');
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledOnce();
    expect(container.querySelector('[data-loading]')).toBeNull();
  });

  it('loading blocks clicks and announces busy', () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Saving
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'Saving' }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.getAttribute('aria-busy')).toBe('true');
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('TextField', () => {
  it('controlled input updates and wires label', () => {
    const onChange = vi.fn();
    render(<TextField id="q" label="Query" value="abc" onChange={onChange} hint="Search everything" />);
    const input = screen.getByLabelText('Query') as HTMLInputElement;
    expect(input.value).toBe('abc');
    expect(input.getAttribute('aria-describedby')).toContain('q-hint');
    fireEvent.change(input, { target: { value: 'abcd' } });
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('error sets invalid and announces via alert', () => {
    render(<TextField id="q2" label="Query" error="Too short" />);
    const input = screen.getByLabelText('Query');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('alert').textContent).toBe('Too short');
  });
});

describe('TextArea', () => {
  it('renders rows and hint', () => {
    render(<TextArea id="notes" label="Notes" rows={5} hint="Saved with view" />);
    const area = screen.getByLabelText('Notes') as HTMLTextAreaElement;
    expect(area.rows).toBe(5);
    expect(area.getAttribute('aria-describedby')).toContain('notes-hint');
  });
});

describe('Select', () => {
  const OPTIONS = [
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'People Ops', disabled: true },
  ];

  it('selects an option and shows placeholder first', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Select id="dept" label="Department" options={OPTIONS} placeholder="Choose…" value="" onChange={onChange} />,
    );
    const select = screen.getByLabelText('Department') as HTMLSelectElement;
    expect(container.querySelector('option[disabled]')?.textContent).toBe('Choose…');
    fireEvent.change(select, { target: { value: 'sales' } });
    expect(onChange).toHaveBeenCalledOnce();
  });
});

describe('Checkbox', () => {
  it('toggles and reports mixed state', () => {
    const onChange = vi.fn();
    const { rerender } = render(<Checkbox id="live" label="Live" checked={false} onChange={onChange} />);
    const box = screen.getByRole('checkbox', { name: 'Live' }) as HTMLInputElement;
    fireEvent.click(box);
    expect(onChange).toHaveBeenCalledWith(true);

    rerender(<Checkbox id="live" label="Live" checked onChange={onChange} indeterminate />);
    expect(screen.getByRole('checkbox', { name: 'Live' }).getAttribute('aria-checked')).toBe('mixed');
    expect((screen.getByRole('checkbox', { name: 'Live' }) as HTMLInputElement).indeterminate).toBe(true);
  });
});

describe('RadioGroup', () => {
  it('selects an option by value', () => {
    const onChange = vi.fn();
    render(
      <RadioGroup
        name="win"
        label="Window"
        value="7d"
        onChange={onChange}
        options={[
          { value: '24h', label: 'Day' },
          { value: '7d', label: 'Week' },
        ]}
      />,
    );
    const radios = screen.getAllByRole('radio');
    expect(radios.length).toBe(2);
    expect((radios[1] as HTMLInputElement).checked).toBe(true);
    fireEvent.click(radios[0]!);
    expect(onChange).toHaveBeenCalledWith('24h');
  });
});

describe('Badge / Card / Divider', () => {
  it('badge carries tone hook', () => {
    render(<Badge tone="danger">Offline</Badge>);
    expect(document.querySelector('[data-badge]')?.getAttribute('data-tone')).toBe('danger');
  });

  it('card renders header slots', () => {
    render(
      <Card title="Backlog" subtitle="Updated" actions={<button type="button">Go</button>}>
        Body
      </Card>,
    );
    expect(screen.getByText('Backlog')).toBeTruthy();
    expect(screen.getByText('Body')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Go' })).toBeTruthy();
  });

  it('divider is a labelled separator', () => {
    render(<Divider label="Cutoff" />);
    const sep = screen.getByText('Cutoff').closest('[role="separator"]');
    expect(sep?.getAttribute('aria-orientation')).toBe('horizontal');
  });
});

describe('Tabs', () => {
  function Controlled() {
    const [active, setActive] = useState('a');
    return (
      <Tabs
        tabs={[
          { id: 'a', label: 'Alpha' },
          { id: 'b', label: 'Beta', badge: 3 },
        ]}
        activeId={active}
        onTabChange={setActive}
      >
        <p>{active === 'a' ? 'Panel A' : 'Panel B'}</p>
      </Tabs>
    );
  }

  it('switches panels and marks selection', () => {
    render(<Controlled />);
    expect(screen.getByText('Panel A')).toBeTruthy();
    const tabB = screen.getByRole('tab', { name: /Beta/ });
    expect(tabB.getAttribute('aria-selected')).toBe('false');
    fireEvent.click(tabB);
    expect(screen.getByText('Panel B')).toBeTruthy();
    expect(screen.getByRole('tabpanel').getAttribute('aria-labelledby')).toBe('tab-b');
  });

  it('arrow keys move between tabs', () => {
    render(<Controlled />);
    const tabA = screen.getByRole('tab', { name: 'Alpha' });
    fireEvent.keyDown(tabA, { key: 'ArrowRight' });
    expect(screen.getByText('Panel B')).toBeTruthy();
  });
});

describe('Tooltip', () => {
  it('exposes tip text on the wrapper', () => {
    render(
      <Tooltip content="Rebuilds the index">
        <button type="button">Reindex</button>
      </Tooltip>,
    );
    expect(document.querySelector('[data-tooltip]')?.getAttribute('data-tip')).toBe('Rebuilds the index');
  });
});

describe('Accordion', () => {
  const ITEMS = [
    { id: 's', title: 'Sales', content: 'Sales detail' },
    { id: 'f', title: 'Finance', content: 'Finance detail' },
  ];

  it('expands a section on click', () => {
    render(<Accordion items={ITEMS} />);
    expect(screen.queryByText('Sales detail')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Sales' }));
    expect(screen.getByText('Sales detail')).toBeTruthy();
  });

  it('single-open by default', () => {
    render(<Accordion items={ITEMS} defaultOpenIds={['s']} />);
    fireEvent.click(screen.getByRole('button', { name: 'Finance' }));
    expect(screen.queryByText('Sales detail')).toBeNull();
    expect(screen.getByText('Finance detail')).toBeTruthy();
  });

  it('multi when allowMultiple', () => {
    render(<Accordion items={ITEMS} allowMultiple defaultOpenIds={['s']} />);
    fireEvent.click(screen.getByRole('button', { name: 'Finance' }));
    expect(screen.getByText('Sales detail')).toBeTruthy();
    expect(screen.getByText('Finance detail')).toBeTruthy();
  });
});

describe('ProgressBar', () => {
  it('clamps and reports value', () => {
    render(<ProgressBar value={140} label="Indexing" />);
    const bar = screen.getByRole('progressbar', { name: 'Indexing' });
    expect(bar.getAttribute('aria-valuenow')).toBe('100');
  });

  it('omits valuenow when indeterminate', () => {
    render(<ProgressBar label="Waiting" />);
    expect(screen.getByRole('progressbar', { name: 'Waiting' }).hasAttribute('aria-valuenow')).toBe(false);
  });
});

describe('Spinner', () => {
  it('announces via status role', () => {
    render(<Spinner label="Crunching numbers" />);
    expect(screen.getByRole('status').textContent).toBe('Crunching numbers');
  });
});

describe('Pagination', () => {
  it('navigates and disables edges', () => {
    const onPageChange = vi.fn();
    const { rerender } = render(<Pagination page={1} totalPages={5} onPageChange={onPageChange} />);
    expect((screen.getByRole('button', { name: 'Previous page' }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Page 2' }));
    expect(onPageChange).toHaveBeenCalledWith(2);

    rerender(<Pagination page={5} totalPages={5} onPageChange={onPageChange} />);
    expect((screen.getByRole('button', { name: 'Next page' }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByRole('button', { name: 'Page 5' }).getAttribute('aria-current')).toBe('page');
  });

  it('renders nothing for a single page', () => {
    const { container } = render(<Pagination page={1} totalPages={1} onPageChange={() => {}} />);
    expect(container.querySelector('[data-pagination]')).toBeNull();
  });
});
