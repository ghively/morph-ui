import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LiquidNavMenu } from '../src/components/LiquidNavMenu';

describe('LiquidNavMenu', () => {
  const mockActions = [
    { id: '1', label: 'Action 1', icon: <span>1</span>, onClick: vi.fn() },
    { id: '2', label: 'Action 2', icon: <span>2</span>, onClick: vi.fn() },
  ];

  it('renders trigger button and actions', () => {
    render(<LiquidNavMenu actions={mockActions} />);
    
    expect(screen.getByRole('button', { name: 'Menu' })).toBeDefined();
    // Actions should be present in the DOM but hidden by CSS
    expect(screen.getByRole('menuitem', { name: 'Action 1' })).toBeDefined();
    expect(screen.getByRole('menuitem', { name: 'Action 2' })).toBeDefined();
  });

  it('toggles menu state on trigger click', () => {
    render(<LiquidNavMenu actions={mockActions} />);
    const trigger = screen.getByRole('button', { name: 'Menu' });
    
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('calls action onClick and closes menu', () => {
    render(<LiquidNavMenu actions={mockActions} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
    
    const action = screen.getByRole('menuitem', { name: 'Action 1' });
    fireEvent.click(action);
    
    expect(mockActions[0].onClick).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Menu' }).getAttribute('aria-expanded')).toBe('false');
  });

  it('closes menu on escape key', () => {
    render(<LiquidNavMenu actions={mockActions} />);
    
    const trigger = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});
