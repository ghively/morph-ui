import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ContextSwitcher } from '../src/components/ContextSwitcher';

describe('ContextSwitcher', () => {
  it('renders and opens correctly', () => {
    const options = ['Option 1', 'Option 2'];
    render(<ContextSwitcher current="Option 1" options={options} />);
    
    const trigger = screen.getByRole('button');
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('listbox')).toBeTruthy();
  });

  it('handles selection via keyboard and click', () => {
    const options = ['Option 1', 'Option 2'];
    const onChange = vi.fn();
    render(<ContextSwitcher current="Option 1" options={options} onChange={onChange} />);
    
    // Open menu
    fireEvent.click(screen.getByRole('button'));
    
    const items = screen.getAllByRole('option');
    expect(items).toHaveLength(2);
    
    // Select via click
    fireEvent.click(items[1]!);
    expect(onChange).toHaveBeenCalledWith('Option 2');
    
    // Reopen menu
    fireEvent.click(screen.getByRole('button'));
    
    // Select via Enter key
    const newItems = screen.getAllByRole('option');
    fireEvent.keyDown(newItems[0]!, { key: 'Enter', code: 'Enter' });
    expect(onChange).toHaveBeenCalledWith('Option 1');
  });
});
