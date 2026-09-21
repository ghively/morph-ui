import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ToggleSwitch } from '../src/components/ToggleSwitch';

describe('ToggleSwitch', () => {
  it('role="switch" and aria-checked track on prop', () => {
    const { container, rerender } = render(<ToggleSwitch on={true} onChange={() => {}} label="Enable feature" />);
    const button = container.firstChild as HTMLButtonElement;
    
    expect(button.getAttribute('role')).toBe('switch');
    expect(button.getAttribute('aria-checked')).toBe('true');
    
    rerender(<ToggleSwitch on={false} onChange={() => {}} label="Enable feature" />);
    expect(button.getAttribute('aria-checked')).toBe('false');
  });

  it('data-on is the string "true" / "false"', () => {
    const { container, rerender } = render(<ToggleSwitch on={true} onChange={() => {}} label="Enable feature" />);
    const button = container.firstChild as HTMLButtonElement;
    expect(button.getAttribute('data-on')).toBe('true');
    
    rerender(<ToggleSwitch on={false} onChange={() => {}} label="Enable feature" />);
    expect(button.getAttribute('data-on')).toBe('false');
  });

  it('click fires onChange with negation, does not change state directly', () => {
    const handleChange = vi.fn();
    const { container } = render(<ToggleSwitch on={false} onChange={handleChange} label="Enable feature" />);
    const button = container.firstChild as HTMLButtonElement;
    
    fireEvent.click(button);
    expect(handleChange).toHaveBeenCalledWith(true);
    expect(button.getAttribute('data-on')).toBe('false'); // state didn't change because it is controlled
  });

  it('aria-label equals label prop', () => {
    const { container } = render(<ToggleSwitch on={true} onChange={() => {}} label="My Custom Label" />);
    const button = container.firstChild as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('My Custom Label');
  });

  it('disabled -> click does not call onChange', () => {
    const handleChange = vi.fn();
    const { container } = render(<ToggleSwitch on={false} onChange={handleChange} label="Enable feature" disabled />);
    const button = container.firstChild as HTMLButtonElement;
    
    expect(button.disabled).toBe(true);
    fireEvent.click(button);
    expect(handleChange).not.toHaveBeenCalled();
  });
});
