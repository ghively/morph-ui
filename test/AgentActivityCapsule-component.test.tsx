import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AgentActivityCapsule } from '../src/components/AgentActivityCapsule';

describe('AgentActivityCapsule', () => {
  it('renders collapsed state', () => {
    render(<AgentActivityCapsule state="collapsed" agent="Gregory" activity="Thinking" count={2} />);
    const el = screen.getByRole('button');
    expect(el).toBeTruthy();
    expect(el.getAttribute('aria-expanded')).toBe('false');
    expect(screen.getByText('Gregory')).toBeTruthy();
    expect(screen.getByText('Thinking')).toBeTruthy();
    expect(screen.getByText('2 tools')).toBeTruthy();
  });

  it('renders expanded state and details', () => {
    render(<AgentActivityCapsule state="expanded" agent="Gregory" activity="Thinking" details={["Detail 1", "Detail 2"]} />);
    const el = screen.getByRole('button');
    expect(el.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Detail 1')).toBeTruthy();
    expect(screen.getByText('Detail 2')).toBeTruthy();
  });

  it('handles click expansion and collapse', () => {
    const onExpand = vi.fn();
    const onCollapse = vi.fn();
    const { rerender } = render(<AgentActivityCapsule state="collapsed" agent="Gregory" activity="Thinking" onExpand={onExpand} onCollapse={onCollapse} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(onExpand).toHaveBeenCalled();

    rerender(<AgentActivityCapsule state="expanded" agent="Gregory" activity="Thinking" onExpand={onExpand} onCollapse={onCollapse} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onCollapse).toHaveBeenCalled();
  });
});
