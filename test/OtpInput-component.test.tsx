import { useState } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OtpInput } from '../src/components/OtpInput';

const cells = (c: HTMLElement) => Array.from(c.querySelectorAll<HTMLInputElement>('[data-otpcell]'));

function Controlled({ initial = '', ...rest }: { initial?: string; onComplete?: (c: string) => void; alphanumeric?: boolean; length?: number }) {
  const [v, setV] = useState(initial);
  return <><OtpInput label="Code" value={v} onChange={setV} {...rest} /><output data-testid="out">{v}</output></>;
}

describe('OtpInput', () => {
  it('renders one labelled input per cell inside a labelled group', () => {
    const { container } = render(<OtpInput label="Verification code" hint="Check your SMS" id="otp" />);
    const group = screen.getByRole('group', { name: 'Verification code' });
    expect(group.getAttribute('aria-describedby')).toBe('otp-hint');
    const cs = cells(container);
    expect(cs).toHaveLength(6);
    expect(cs[0]!.getAttribute('aria-label')).toBe('Digit 1 of 6');
    expect(cs[5]!.getAttribute('aria-label')).toBe('Digit 6 of 6');
    expect(cs[0]!.getAttribute('autocomplete')).toBe('one-time-code');
    expect(cs[1]!.getAttribute('autocomplete')).toBe('off');
    expect(cs[0]!.getAttribute('inputmode')).toBe('numeric');
    expect(container.querySelector('[data-otp]')).toBeTruthy();
  });

  it('marks the root invalid and points the group at the error', () => {
    const { container } = render(<OtpInput label="Code" id="c" error="Wrong code" hint="ignored" />);
    expect(container.querySelector('[data-otp]')!.hasAttribute('data-invalid')).toBe(true);
    expect(screen.getByRole('group').getAttribute('aria-describedby')).toBe('c-error');
    expect(screen.getByRole('alert').textContent).toBe('Wrong code');
    expect(cells(container)[0]!.getAttribute('aria-invalid')).toBe('true');
  });

  it('typing fills a cell and advances focus', () => {
    const { container } = render(<Controlled />);
    const cs = cells(container);
    cs[0]!.focus();
    fireEvent.change(cs[0]!, { target: { value: '4' } });
    expect(screen.getByTestId('out').textContent).toBe('4');
    expect(document.activeElement).toBe(cs[1]);
    expect(cs[0]!.hasAttribute('data-filled')).toBe(true);
    expect(cs[1]!.hasAttribute('data-filled')).toBe(false);
    fireEvent.change(cs[1]!, { target: { value: '2' } });
    expect(screen.getByTestId('out').textContent).toBe('42');
    expect(document.activeElement).toBe(cs[2]);
  });

  it('rejects characters that do not match the pattern', () => {
    const onChange = vi.fn();
    const { container } = render(<OtpInput label="Code" onChange={onChange} />);
    fireEvent.change(cells(container)[0]!, { target: { value: 'a' } });
    expect(onChange).not.toHaveBeenCalled();
    expect(cells(container)[0]!.value).toBe('');
  });

  it('accepts letters when alphanumeric', () => {
    const { container } = render(<Controlled alphanumeric />);
    expect(cells(container)[0]!.getAttribute('inputmode')).toBe('text');
    fireEvent.change(cells(container)[0]!, { target: { value: 'k' } });
    expect(screen.getByTestId('out').textContent).toBe('k');
  });

  it('Backspace on an empty cell moves back and clears the previous cell', () => {
    const { container } = render(<Controlled initial="123" />);
    const cs = cells(container);
    cs[3]!.focus();
    fireEvent.keyDown(cs[3]!, { key: 'Backspace' });
    expect(screen.getByTestId('out').textContent).toBe('12');
    expect(document.activeElement).toBe(cs[2]);
    fireEvent.keyDown(cs[2]!, { key: 'Backspace' });
    expect(screen.getByTestId('out').textContent).toBe('1');
  });

  it('arrow, Home and End keys move between cells', () => {
    const { container } = render(<Controlled initial="1234" />);
    const cs = cells(container);
    cs[2]!.focus();
    fireEvent.keyDown(cs[2]!, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(cs[1]);
    fireEvent.keyDown(cs[1]!, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(cs[2]);
    fireEvent.keyDown(cs[2]!, { key: 'Home' });
    expect(document.activeElement).toBe(cs[0]);
    fireEvent.keyDown(cs[0]!, { key: 'End' });
    expect(document.activeElement).toBe(cs[4]);
  });

  it('pasting a full code into any cell fills every cell and strips invalid characters', () => {
    const onComplete = vi.fn();
    const { container } = render(<Controlled onComplete={onComplete} />);
    const cs = cells(container);
    fireEvent.paste(cs[3]!, { clipboardData: { getData: () => '12-34 56' } });
    expect(screen.getByTestId('out').textContent).toBe('123456');
    expect(cs.map(c => c.value).join('')).toBe('123456');
    expect(onComplete).toHaveBeenCalledWith('123456');
    expect(document.activeElement).toBe(cs[5]);
  });

  it('fires onComplete when the last cell is typed', () => {
    const onComplete = vi.fn();
    const { container } = render(<Controlled initial="12345" onComplete={onComplete} />);
    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.change(cells(container)[5]!, { target: { value: '6' } });
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith('123456');
    expect(container.querySelector('[data-otp]')!.hasAttribute('data-complete')).toBe(true);
  });

  it('follows a controlled value and does not change on its own', () => {
    const onChange = vi.fn();
    const { container, rerender } = render(<OtpInput label="Code" length={4} value="12" onChange={onChange} />);
    expect(cells(container).map(c => c.value)).toEqual(['1', '2', '', '']);
    fireEvent.change(cells(container)[2]!, { target: { value: '3' } });
    expect(onChange).toHaveBeenCalledWith('123');
    expect(cells(container)[2]!.value).toBe('');
    rerender(<OtpInput label="Code" length={4} value="9876" onChange={onChange} />);
    expect(cells(container).map(c => c.value)).toEqual(['9', '8', '7', '6']);
  });

  it('uses defaultValue when uncontrolled and masks with password cells', () => {
    const { container } = render(<OtpInput label="PIN" length={4} defaultValue="12" mask />);
    const cs = cells(container);
    expect(cs[0]!.value).toBe('1');
    expect(cs[0]!.type).toBe('password');
    fireEvent.change(cs[2]!, { target: { value: '3' } });
    expect(cs[2]!.value).toBe('3');
  });
});
