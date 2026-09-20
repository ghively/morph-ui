import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TokenPills } from '../src/components/TokenPills';

describe('TokenPills', () => {
  const options = [
    { id: '1', label: 'One' },
    { id: '2', label: 'Two' },
    { id: '3', label: 'Three' },
  ];

  it('renders correctly', () => {
    const { container } = render(
      <TokenPills options={options} selectedIds={['2']} onChange={() => {}} />
    );
    const pills = container.querySelectorAll('.token-pill');
    expect(pills.length).toBe(3);
    
    expect(pills[0]?.getAttribute('aria-pressed')).toBe('false');
    expect(pills[1]?.getAttribute('aria-pressed')).toBe('true');
    expect(pills[1]?.hasAttribute('data-on')).toBe(true);
    expect(pills[2]?.getAttribute('aria-pressed')).toBe('false');
  });

  it('handles multi-selection clicks', () => {
    const onChange = vi.fn();
    const { container } = render(
      <TokenPills options={options} selectedIds={['1']} onChange={onChange} multiSelect={true} />
    );
    
    const pills = container.querySelectorAll('.token-pill');
    
    // Select a new one
    fireEvent.click(pills[1] as Element);
    expect(onChange).toHaveBeenCalledWith(['1', '2']);
    
    // Deselect existing
    fireEvent.click(pills[0] as Element);
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('handles single-selection clicks', () => {
    const onChange = vi.fn();
    const { container } = render(
      <TokenPills options={options} selectedIds={['1']} onChange={onChange} multiSelect={false} />
    );
    
    const pills = container.querySelectorAll('.token-pill');
    
    // Select a new one
    fireEvent.click(pills[1] as Element);
    expect(onChange).toHaveBeenCalledWith(['2']);
  });

  it('supports keyboard navigation', () => {
    const onChange = vi.fn();
    const { container } = render(
      <TokenPills options={options} selectedIds={[]} onChange={onChange} />
    );
    
    const pills = container.querySelectorAll('.token-pill');
    const firstPill = pills[0] as HTMLElement;
    
    firstPill.focus();
    expect(document.activeElement).toBe(firstPill);

    // Press right arrow
    fireEvent.keyDown(firstPill, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(pills[1]);

    // Press enter to toggle
    fireEvent.keyDown(pills[1] as Element, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith(['2']);
    
    // Press left arrow
    fireEvent.keyDown(pills[1] as Element, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(pills[0]);
  });
});
