import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { NumberInput, type NumberInputProps } from '../src/components/NumberInput';

type Partial = Omit<NumberInputProps, 'value' | 'onChange' | 'label'> & { initial?: number | null; label?: string; spy?: (v: number | null) => void };
function Harness({ initial = 5, label = 'Qty', spy, ...rest }: Partial) {
  const [value, setValue] = useState<number | null>(initial);
  return <NumberInput label={label} value={value} onChange={v => { spy?.(v); setValue(v); }} {...rest} />;
}
const field = () => screen.getByRole('spinbutton') as HTMLInputElement;

describe('NumberInput', () => {
  it('renders the spinbutton with label and aria attributes', () => {
    render(<Harness id="q" min={0} max={10} unit="pcs" />);
    const input = screen.getByLabelText('Qty');
    expect(input).toBe(field());
    expect(input.getAttribute('inputmode')).toBe('decimal');
    expect(input.getAttribute('aria-valuenow')).toBe('5');
    expect(input.getAttribute('aria-valuemin')).toBe('0');
    expect(input.getAttribute('aria-valuemax')).toBe('10');
    expect(input.getAttribute('aria-valuetext')).toBe('5 pcs');
    const root = input.closest('[data-numberinput]')!;
    expect(root.querySelector('[data-numstep="dec"]')!.getAttribute('tabindex')).toBe('-1');
    expect(screen.getByRole('button', { name: 'Decrease Qty' }).getAttribute('data-numstep')).toBe('dec');
    expect(screen.getByRole('button', { name: 'Increase Qty' }).getAttribute('data-numstep')).toBe('inc');
  });

  it('steps with arrows, Shift+Arrow, PageUp/Down and jumps with Home/End', () => {
    render(<Harness initial={50} min={0} max={100} step={1} />);
    const input = field();
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input.value).toBe('51');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input.value).toBe('49');
    fireEvent.keyDown(input, { key: 'ArrowUp', shiftKey: true });
    expect(input.value).toBe('59');
    fireEvent.keyDown(input, { key: 'PageDown' });
    expect(input.value).toBe('49');
    fireEvent.keyDown(input, { key: 'PageUp' });
    expect(input.value).toBe('59');
    fireEvent.keyDown(input, { key: 'End' });
    expect(input.getAttribute('aria-valuenow')).toBe('100');
    fireEvent.keyDown(input, { key: 'Home' });
    expect(input.getAttribute('aria-valuenow')).toBe('0');
  });

  it('honours a custom largeStep and clamps stepping at the bounds', () => {
    render(<Harness initial={95} min={0} max={100} largeStep={25} />);
    const input = field();
    fireEvent.keyDown(input, { key: 'PageUp' });
    expect(input.value).toBe('100');
    fireEvent.keyDown(input, { key: 'PageDown' });
    expect(input.value).toBe('75');
  });

  it('disables the step buttons at the bounds', () => {
    render(<Harness initial={9} min={0} max={10} />);
    const inc = screen.getByRole('button', { name: 'Increase Qty' });
    const dec = screen.getByRole('button', { name: 'Decrease Qty' });
    expect((inc as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(inc);
    expect(field().value).toBe('10');
    expect((inc as HTMLButtonElement).disabled).toBe(true);
    fireEvent.keyDown(field(), { key: 'Home' });
    expect((dec as HTMLButtonElement).disabled).toBe(true);
    expect((inc as HTMLButtonElement).disabled).toBe(false);
  });

  it('lets typing stay free until blur, then parses and clamps', () => {
    const spy = vi.fn();
    render(<Harness initial={5} min={0} max={100} spy={spy} />);
    const input = field();
    fireEvent.change(input, { target: { value: '15' } });
    expect(input.value).toBe('15');
    expect(spy).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: '150' } });
    fireEvent.blur(input);
    expect(spy).toHaveBeenLastCalledWith(100);
    expect(input.value).toBe('100');
  });

  it('commits on Enter and clamps below min', () => {
    render(<Harness initial={5} min={1} max={10} />);
    const input = field();
    fireEvent.change(input, { target: { value: '-4' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input.value).toBe('1');
    expect(input.getAttribute('aria-valuenow')).toBe('1');
  });

  it('reverts invalid text to the last value without calling onChange', () => {
    const spy = vi.fn();
    render(<Harness initial={7} spy={spy} />);
    const input = field();
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.blur(input);
    expect(input.value).toBe('7');
    expect(spy).not.toHaveBeenCalled();
  });

  it('commits null for empty text', () => {
    const spy = vi.fn();
    render(<Harness initial={7} spy={spy} />);
    const input = field();
    fireEvent.change(input, { target: { value: '  ' } });
    fireEvent.blur(input);
    expect(spy).toHaveBeenLastCalledWith(null);
    expect(input.value).toBe('');
    expect(input.hasAttribute('aria-valuenow')).toBe(false);
  });

  it('rounds to precision on commit and on stepping', () => {
    const spy = vi.fn();
    render(<Harness initial={0.2} min={0} max={1} step={0.1} precision={2} spy={spy} unit="%" />);
    const input = field();
    expect(input.value).toBe('0.20');
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(spy).toHaveBeenLastCalledWith(0.3);
    expect(input.value).toBe('0.30');
    fireEvent.change(input, { target: { value: '0.4567 %' } });
    fireEvent.blur(input);
    expect(spy).toHaveBeenLastCalledWith(0.46);
    expect(input.getAttribute('aria-valuetext')).toBe('0.46 %');
  });

  it('avoids floating point drift when stepping decimals without precision', () => {
    render(<Harness initial={0.1} step={0.2} />);
    fireEvent.keyDown(field(), { key: 'ArrowUp' });
    expect(field().value).toBe('0.3');
  });

  it('uses format for display and valuetext', () => {
    render(<Harness initial={128000} step={1000} format={n => n.toLocaleString('en-US')} unit="tokens" />);
    expect(field().value).toBe('128,000');
    expect(field().getAttribute('aria-valuetext')).toBe('128,000 tokens');
    fireEvent.change(field(), { target: { value: '64,500' } });
    fireEvent.blur(field());
    expect(field().value).toBe('64,500');
  });

  it('wires hint and error and marks the root invalid', () => {
    const { rerender } = render(<NumberInput id="n" label="Limit" value={1} onChange={() => {}} hint="Per hour" />);
    expect(document.getElementById(field().getAttribute('aria-describedby')!)!.textContent).toBe('Per hour');
    rerender(<NumberInput id="n" label="Limit" value={1} onChange={() => {}} hint="Per hour" error="Too low" />);
    expect(field().getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('alert').textContent).toBe('Too low');
    expect(field().getAttribute('aria-describedby')).toContain('n-error');
    expect(field().closest('[data-numberinput]')!.getAttribute('data-invalid')).toBe('');
  });

  it('blocks stepping when disabled or read-only', () => {
    const spy = vi.fn();
    const { rerender } = render(<NumberInput label="Qty" value={3} onChange={spy} disabled />);
    expect((field() as HTMLButtonElement).disabled).toBe(true);
    expect(field().closest('[data-numberinput]')!.getAttribute('data-disabled')).toBe('');
    expect((screen.getByRole('button', { name: 'Increase Qty' }) as HTMLButtonElement).disabled).toBe(true);
    rerender(<NumberInput label="Qty" value={3} onChange={spy} readOnly />);
    fireEvent.keyDown(field(), { key: 'ArrowUp' });
    expect((screen.getByRole('button', { name: 'Decrease Qty' }) as HTMLButtonElement).disabled).toBe(true);
    expect(spy).not.toHaveBeenCalled();
  });
});
