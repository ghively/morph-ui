import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SegmentedControl } from '../src/components/SegmentedControl';

describe('SegmentedControl', () => {
  const options = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' }
  ];

  it('renders one role="radio" per option in order', () => {
    const { container } = render(
      <SegmentedControl value="dark" options={options} onChange={() => {}} label="Theme" />
    );
    const group = container.querySelector('[role="radiogroup"]');
    expect(group).toBeTruthy();
    
    const radios = container.querySelectorAll('[role="radio"]');
    expect(radios.length).toBe(3);
    expect(radios[0]!.textContent).toBe('Light');
    expect(radios[1]!.textContent).toBe('Dark');
    expect(radios[2]!.textContent).toBe('System');
  });

  it('exactly one has aria-checked="true" and data-on="true"', () => {
    const { container } = render(
      <SegmentedControl value="dark" options={options} onChange={() => {}} label="Theme" />
    );
    const checked = container.querySelectorAll('[aria-checked="true"]');
    const on = container.querySelectorAll('[data-on="true"]');
    
    expect(checked.length).toBe(1);
    expect(on.length).toBe(1);
    
    expect(checked[0]!.textContent).toBe('Dark');
    expect(on[0]!.textContent).toBe('Dark');
  });

  it('clicking a non-selected option calls onChange with that value', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <SegmentedControl value="dark" options={options} onChange={handleChange} label="Theme" />
    );
    const lightRadio = container.querySelectorAll('[role="radio"]')[0] as HTMLButtonElement;
    
    fireEvent.click(lightRadio);
    expect(handleChange).toHaveBeenCalledWith('light');
  });

  it('role="radiogroup" carries aria-label', () => {
    const { container } = render(
      <SegmentedControl value="dark" options={options} onChange={() => {}} label="Theme Selection" />
    );
    const group = container.querySelector('[role="radiogroup"]');
    expect(group!.getAttribute('aria-label')).toBe('Theme Selection');
  });
});
