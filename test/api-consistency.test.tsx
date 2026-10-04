import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ToggleSwitch } from '../src/components/ToggleSwitch';
import { TextField } from '../src/components/TextField';
import { TextArea } from '../src/components/TextArea';
import { Select } from '../src/components/Select';

describe('ToggleSwitch state props', () => {
  it('accepts checked as an alias for on', () => {
    const onChange = vi.fn();
    render(<ToggleSwitch checked label="Sound" onChange={onChange} />);
    const sw = screen.getByRole('switch', { name: 'Sound' });
    expect(sw.getAttribute('aria-checked')).toBe('true');
    fireEvent.click(sw);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('prefers on over checked and defaults to off', () => {
    const { rerender } = render(<ToggleSwitch on={false} checked label="A" onChange={() => {}} />);
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('false');
    rerender(<ToggleSwitch label="A" onChange={() => {}} />);
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('false');
  });
});

describe('form fields without an id', () => {
  it('TextField wires label, hint and error to a generated id', () => {
    render(<TextField label="Email" hint="Work address" />);
    const input = screen.getByLabelText('Email');
    expect(input.id).toMatch(/\S/);
    expect(input.getAttribute('aria-describedby')).toBe(input.id + '-hint');
  });

  it('TextArea and Select get distinct generated ids', () => {
    render(<>
      <TextArea label="Notes" />
      <Select label="Region" options={[{ value: 'eu', label: 'EU' }]} />
    </>);
    const a = screen.getByLabelText('Notes'), b = screen.getByLabelText('Region');
    expect(a.id).toMatch(/\S/);
    expect(b.id).toMatch(/\S/);
    expect(a.id).not.toBe(b.id);
  });

  it('keeps an explicit id', () => {
    render(<TextField id="email" label="Email" />);
    expect(screen.getByLabelText('Email').id).toBe('email');
  });
});
