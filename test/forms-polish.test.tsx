import { render, screen, fireEvent, act } from '@testing-library/react';
import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { Accordion } from '../src/components/Accordion';
import { Button } from '../src/components/Button';
import { Checkbox } from '../src/components/Checkbox';
import { Combobox } from '../src/components/Combobox';
import { DateRangePicker } from '../src/components/DateRangePicker';
import { DropdownMenu } from '../src/components/DropdownMenu';
import { FilterBar } from '../src/components/FilterBar';
import { FormField } from '../src/components/FormField';
import { MentionAutocomplete } from '../src/components/MentionAutocomplete';
import { MultiSelect } from '../src/components/MultiSelect';
import { RadioGroup } from '../src/components/RadioGroup';
import { SearchField } from '../src/components/SearchField';
import { SegmentedControl } from '../src/components/SegmentedControl';
import { Select } from '../src/components/Select';
import { Slider } from '../src/components/Slider';
import { TextArea } from '../src/components/TextArea';
import { TextField } from '../src/components/TextField';

const localDay = (d = new Date()) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

describe('Accordion', () => {
  it('arrow keys rove between enabled headers', () => {
    render(<Accordion items={[{ id: 'a', title: 'A', content: 'a' }, { id: 'b', title: 'B', content: 'b', disabled: true }, { id: 'c', title: 'C', content: 'c' }]} />);
    const a = screen.getByRole('button', { name: 'A' });
    a.focus();
    fireEvent.keyDown(a, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'C' }));
    fireEvent.keyDown(document.activeElement!, { key: 'Home' });
    expect(document.activeElement).toBe(a);
  });
});

describe('Button', () => {
  it('keeps variant hooks and shows the spinner while loading', () => {
    const { container } = render(<Button variant="danger" loading>Delete</Button>);
    const btn = screen.getByRole('button', { name: 'Delete' });
    expect(btn.getAttribute('data-variant')).toBe('danger');
    expect(btn.getAttribute('aria-disabled')).toBe('true');
    expect(container.querySelector('[data-btnspinner]')).toBeTruthy();
  });
});

describe('Checkbox', () => {
  it('passes native attributes through', () => {
    render(<Checkbox id="c" label="Live" checked={false} onChange={() => {}} name="live" required />);
    const box = screen.getByRole('checkbox', { name: 'Live' }) as HTMLInputElement;
    expect(box.name).toBe('live');
    expect(box.required).toBe(true);
  });
});

describe('Combobox', () => {
  const OPTS = [{ value: 'a', label: 'Atlas Large' }, { value: 'b', label: 'Atlas Mini' }, { value: 'c', label: 'Coder' }];
  it('opens on the full list with the selection active, wraps, highlights and escapes', () => {
    const onChange = vi.fn();
    render(<Combobox id="cb" label="Model" options={OPTS} value="b" onChange={onChange} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(input.getAttribute('aria-activedescendant')).toBe(screen.getByRole('option', { name: 'Atlas Mini' }).id);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input.getAttribute('aria-activedescendant')).toBe(screen.getByRole('option', { name: 'Atlas Large' }).id);
    fireEvent.change(input, { target: { value: 'atl' } });
    expect(document.querySelector('[data-combolist] mark')?.textContent).toBe('Atl');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
    expect((input as HTMLInputElement).value).toBe('Atlas Mini');
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('DateRangePicker', () => {
  it('default presets end on the local today and the span is counted inclusively', () => {
    const onChange = vi.fn();
    render(<DateRangePicker id="dr" value={{ from: '2026-09-01', to: '2026-09-10' }} onChange={onChange} />);
    expect(screen.getByText('10 days')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '7d' }));
    expect(onChange.mock.calls[0]![0].to).toBe(localDay());
  });
  it('links the error to both inputs', () => {
    render(<DateRangePicker id="dr" value={{ from: '2026-09-10', to: '2026-09-01' }} onChange={() => {}} />);
    expect(document.getElementById('dr-from')!.getAttribute('aria-describedby')).toBe('dr-error');
    expect(screen.getByRole('alert').id).toBe('dr-error');
  });
});

describe('DropdownMenu', () => {
  const sections = [{ items: [{ id: 'x', label: 'Off', disabled: true }, { id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta' }] }];
  it('focuses the first enabled item, roves, and Escape returns focus to the trigger', () => {
    render(<DropdownMenu trigger={<button type="button">Open</button>} sections={sections} />);
    const trig = screen.getByRole('button', { name: 'Open' });
    expect(trig.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(trig);
    expect(trig.getAttribute('aria-haspopup')).toBe('menu');
    expect(trig.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Alpha' }));
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Beta' }));
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Alpha' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(trig);
  });
  it('closes on an outside mousedown', () => {
    render(<div><DropdownMenu trigger={<button type="button">Open</button>} sections={sections} /><p>outside</p></div>);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    fireEvent.mouseDown(screen.getByText('outside'));
    expect(screen.queryByRole('menu')).toBeNull();
  });
});

describe('FilterBar', () => {
  it('formats large counts and moves focus to the next chip after a removal', () => {
    vi.useFakeTimers();
    function Controlled() {
      const [f, setF] = useState([{ id: 'a', label: 'Support' }, { id: 'b', label: 'Finance' }]);
      return <FilterBar filters={f} resultCount={1284} onRemove={id => setF(x => x.filter(y => y.id !== id))} />;
    }
    render(<Controlled />);
    expect(screen.getByText('1,284 results')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Remove filter Support' }));
    act(() => { vi.runAllTimers(); });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Remove filter Finance' }));
    vi.useRealTimers();
  });
});

describe('FormField', () => {
  it('shows a probe dot for live probes only', () => {
    const { container, rerender } = render(<FormField id="f" label="Server" probe="checking" hint="Checking…"><input id="f" /></FormField>);
    expect(container.querySelector('[data-hint] [data-probedot]')).toBeTruthy();
    rerender(<FormField id="f" label="Server" probe="idle" hint="Idle"><input id="f" /></FormField>);
    expect(container.querySelector('[data-probedot]')).toBeNull();
  });
});

describe('MentionAutocomplete', () => {
  it('applies className, highlights the query, falls back to initials and reports hover', () => {
    const onActive = vi.fn();
    const { container } = render(
      <MentionAutocomplete trigger={{ start: 0, query: 'ad' }} candidates={[{ id: '@x:e', name: 'Grace Hopper' }, { id: '@y:e', name: 'Ada Lovelace', agentLabel: 'AI' }]} activeIndex={0} onActiveIndexChange={onActive} onPick={() => {}} className="host" />,
    );
    const list = screen.getByRole('listbox');
    expect(list.classList.contains('host')).toBe(true);
    expect(container.querySelector('[data-avatar]')!.textContent).toBe('GH');
    expect(container.querySelector('mark')!.textContent).toBe('Ad');
    fireEvent.mouseEnter(screen.getAllByRole('option')[1]!);
    expect(onActive).toHaveBeenCalledWith(1);
  });
});

describe('MultiSelect', () => {
  it('arrow keys pick which option Enter adds', () => {
    const onChange = vi.fn();
    render(<MultiSelect id="ms" label="Depts" options={[{ value: 's', label: 'Sales' }, { value: 'h', label: 'People' }]} values={[]} onChange={onChange} />);
    const input = screen.getByRole('combobox', { name: 'Depts search' });
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input.getAttribute('aria-activedescendant')).toBe(screen.getByRole('option', { name: 'People' }).id);
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith(['h']);
  });
});

describe('RadioGroup', () => {
  it('a disabled group disables every radio', () => {
    render(<RadioGroup name="w" value="a" onChange={() => {}} disabled options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} />);
    screen.getAllByRole('radio').forEach(r => expect((r as HTMLInputElement).disabled).toBe(true));
  });
});

describe('SearchField', () => {
  it('shows typing immediately, debounces onChange, and Enter flushes', () => {
    vi.useFakeTimers();
    const onChange = vi.fn(), onSubmit = vi.fn();
    render(<SearchField id="s" value="" onChange={onChange} onSubmit={onSubmit} debounceMs={300} />);
    const input = screen.getByLabelText('Search') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'ref' } });
    expect(input.value).toBe('ref');
    expect(onChange).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(300); });
    expect(onChange).toHaveBeenCalledWith('ref');
    fireEvent.change(input, { target: { value: 'refund' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenLastCalledWith('refund');
    expect(onSubmit).toHaveBeenCalledWith('refund');
    act(() => { vi.runAllTimers(); });
    expect(onChange).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });
  it('Escape clears and external value changes win', () => {
    const onChange = vi.fn();
    const { rerender } = render(<SearchField id="s" value="abc" onChange={onChange} />);
    fireEvent.keyDown(screen.getByLabelText('Search'), { key: 'Escape' });
    expect(onChange).toHaveBeenCalledWith('');
    rerender(<SearchField id="s" value="xyz" onChange={onChange} />);
    expect((screen.getByLabelText('Search') as HTMLInputElement).value).toBe('xyz');
  });
});

describe('SegmentedControl', () => {
  it('arrows move the selection with wrap; only the checked radio is tabbable', () => {
    const onChange = vi.fn();
    render(<SegmentedControl value="a" options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }, { value: 'c', label: 'C' }]} onChange={onChange} label="Pick" />);
    const radios = screen.getAllByRole('radio');
    expect(radios.map(r => r.tabIndex)).toEqual([0, -1, -1]);
    fireEvent.keyDown(radios[0]!, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenCalledWith('c');
    expect(document.activeElement).toBe(radios[2]);
    fireEvent.keyDown(radios[0]!, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith('b');
  });
});

describe('Select', () => {
  it('error replaces the hint and is described', () => {
    render(<Select id="d" label="Dept" options={[{ value: 'a', label: 'A' }]} hint="Pick one" error="Required" />);
    const sel = screen.getByLabelText('Dept');
    expect(sel.getAttribute('aria-describedby')).toBe('d-hint d-error');
    expect(screen.queryByText('Pick one')).toBeNull();
    expect(screen.getByRole('alert').textContent).toBe('Required');
  });
});

describe('Slider', () => {
  it('renders a formatted min/max scale and clamps the fill', () => {
    const { container } = render(<Slider id="sl" label="Cut" min={0} max={1} value={2} onChange={() => {}} formatValue={v => v.toFixed(1)} />);
    expect(container.querySelector('[data-sliderscale]')!.textContent).toBe('0.01.0');
    expect((screen.getByLabelText('Cut') as HTMLInputElement).style.getPropertyValue('--morph-fill-pct')).toBe('100%');
  });
});

describe('TextArea', () => {
  it('counts characters against maxLength when controlled', () => {
    const { container } = render(<TextArea id="t" label="Notes" value="hello" maxLength={5} onChange={() => {}} />);
    const count = container.querySelector('[data-textareacount]')!;
    expect(count.textContent).toBe('5 / 5');
    expect(count.hasAttribute('data-full')).toBe(true);
  });
});

describe('TextField', () => {
  it('keeps the data-fieldhint hook and lets callers override describedby', () => {
    const { container } = render(<TextField id="q" label="Q" hint="Help" aria-describedby="mine" />);
    expect(container.querySelector('[data-fieldhint]')!.id).toBe('q-hint');
    expect(screen.getByLabelText('Q').getAttribute('aria-describedby')).toBe('mine');
  });
});
