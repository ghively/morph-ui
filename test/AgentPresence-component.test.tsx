import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AgentPresence } from '../src/components/AgentPresence';

describe('AgentPresence', () => {
  it('renders correctly', () => {
    render(<AgentPresence state="idle" label="Agent idle" />);
    const el = document.querySelectorAll('.agent-presence')[document.querySelectorAll('.agent-presence').length - 1] as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.getAttribute('aria-label')).toBe('Agent idle');
    expect(el.classList.contains('agent-presence-idle')).toBe(true);
  });

  it('renders all states', () => {
    const states = ['offline', 'idle', 'available', 'listening', 'thinking', 'streaming', 'speaking', 'tool-use', 'error', 'success'] as const;
    const { rerender } = render(<AgentPresence state="idle" />);
    
    for (const state of states) {
      rerender(<AgentPresence state={state} />);
      const el = document.querySelectorAll('.agent-presence')[document.querySelectorAll('.agent-presence').length - 1] as HTMLElement;
      expect(el.classList.contains(`agent-presence-${state}`)).toBe(true);
    }
  });

  it('uses default aria-label if not provided', () => {
    render(<AgentPresence state="thinking" />);
    const el = document.querySelectorAll('.agent-presence')[document.querySelectorAll('.agent-presence').length - 1] as HTMLElement;
    expect(el.getAttribute('aria-label')).toBe('Agent is thinking');
  });
});
