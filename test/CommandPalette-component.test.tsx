import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CommandPalette } from '../src/components/CommandPalette';

describe('CommandPalette', () => {
  const commands = [
    { id: '1', label: 'Create new agent', run: vi.fn(), group: 'Agents' },
    { id: '2', label: 'View analytics', run: vi.fn(), group: 'Insights' },
    { id: '3', label: 'Settings', run: vi.fn(), group: 'System' },
  ];

  it('renders nothing when not open', () => {
    const { container } = render(<CommandPalette commands={commands} open={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders commands when open', () => {
    render(<CommandPalette commands={commands} open={true} />);
    expect(screen.getByPlaceholderText('Search commands...')).toBeTruthy();
    expect(screen.getByText('Create new agent')).toBeTruthy();
    expect(screen.getByText('View analytics')).toBeTruthy();
    expect(screen.getByText('Settings')).toBeTruthy();
  });

  it('filters commands based on search', () => {
    render(<CommandPalette commands={commands} open={true} />);
    const input = screen.getByPlaceholderText('Search commands...');
    fireEvent.change(input, { target: { value: 'analy' } });
    
    expect(screen.queryByText('Create new agent')).toBeNull();
    expect(screen.getByText('View analytics')).toBeTruthy();
    expect(screen.queryByText('Settings')).toBeNull();
  });

  it('handles keyboard navigation and execution', () => {
    render(<CommandPalette commands={commands} open={true} />);
    const input = screen.getByPlaceholderText('Search commands...');
    
    // First item selected by default
    const firstItem = document.querySelector('[data-command-index="0"]');
    expect(firstItem?.getAttribute('data-active')).toBe('true');

    // Arrow down
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const secondItem = document.querySelector('[data-command-index="1"]');
    expect(secondItem?.getAttribute('data-active')).toBe('true');
    expect(firstItem?.getAttribute('data-active')).toBeNull();

    // Enter to execute
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(commands[1].run).toHaveBeenCalled();
  });

  it('shows empty state when no commands match', () => {
    render(<CommandPalette commands={commands} open={true} />);
    const input = screen.getByPlaceholderText('Search commands...');
    fireEvent.change(input, { target: { value: 'xyz123' } });
    
    expect(screen.getByText('No commands found')).toBeTruthy();
  });
});
