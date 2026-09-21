import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AgentCard } from '../src/components/AgentCard';

describe('AgentCard', () => {
  it('renders basic info correctly', () => {
    render(<AgentCard name="Optimus" role="Code Reviewer" status="idle" />);
    
    expect(screen.getByText('Optimus')).toBeTruthy();
    expect(screen.getByText('Code Reviewer')).toBeTruthy();
    
    // Status text (capitalized)
    expect(screen.getByText('Idle')).toBeTruthy();
  });

  it('renders capabilities', () => {
    render(<AgentCard name="Optimus" status="working" capabilities={['python', 'rust']} />);
    expect(screen.getByText('python')).toBeTruthy();
    expect(screen.getByText('rust')).toBeTruthy();
  });

  it('renders avatar via children', () => {
    render(
      <AgentCard name="Avatar Agent" status="offline">
        <img src="avatar.png" alt="Avatar" />
      </AgentCard>
    );
    expect(screen.getByAltText('Avatar')).toBeTruthy();
  });

  it('handles focus callback', () => {
    const onFocus = vi.fn();
    const { container } = render(<AgentCard name="Agent" status="busy" onFocus={onFocus} />);
    
    const card = container.querySelector('[data-agent-card]');
    expect(card?.getAttribute('role')).toBe('button');
    
    if (card) {
      fireEvent.click(card);
      expect(onFocus).toHaveBeenCalledTimes(1);

      fireEvent.keyDown(card, { key: 'Enter' });
      expect(onFocus).toHaveBeenCalledTimes(2);
    }
  });
});
