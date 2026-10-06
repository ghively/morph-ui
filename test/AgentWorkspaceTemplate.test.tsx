import { describe, it, expect } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { AgentWorkspaceTemplate } from '../src/templates/AgentWorkspaceTemplate';

describe('AgentWorkspaceTemplate', () => {
  it('renders the workspace landmarks and panes', () => {
    const { container } = render(<AgentWorkspaceTemplate />);
    expect(container.querySelectorAll('main').length).toBe(1);
    expect(container.querySelectorAll('h1').length).toBe(1);
    expect(container.querySelector('h1')!.textContent).toBe('Ship the 2.4 release notes');
    expect(screen.getByRole('navigation', { name: 'Conversations' })).toBeTruthy();
    expect(screen.getByRole('complementary', { name: 'Run context' })).toBeTruthy();
    expect(screen.getByRole('log', { name: 'Conversation messages' })).toBeTruthy();
    expect(container.querySelectorAll('[data-tool-call-card]').length).toBe(3);
    expect(container.querySelector('[data-streaming-message]')).not.toBeNull();
    expect(container.querySelectorAll('[data-cite]').length).toBe(3);
    expect(container.querySelector('[data-model-selector]')).not.toBeNull();
    expect(container.querySelector('[data-context-meter]')).not.toBeNull();
    expect(container.querySelector('[data-plan]')).not.toBeNull();
    expect(container.querySelector('[data-approval-gate]')).not.toBeNull();
  });

  it('approving the gate starts the pending tool call and unblocks the plan', () => {
    const { container } = render(<AgentWorkspaceTemplate />);
    const pending = () => container.querySelector('[data-tool-call-card][data-status="pending"]');
    expect(pending()).not.toBeNull();
    fireEvent.click(screen.getByText('Approve'));
    expect(pending()).toBeNull();
    expect(container.querySelector('[data-tool-call-card][data-status="running"]')).not.toBeNull();
    expect(container.querySelector('[data-planstep][data-state="blocked"]')).toBeNull();
  });

  it('filters the conversation list and toggles a collapsed pane', () => {
    const { container } = render(<AgentWorkspaceTemplate />);
    fireEvent.change(screen.getByLabelText('Filter conversations'), { target: { value: 'safari' } });
    const names = Array.from(container.querySelectorAll('.convs-name')).map(n => n.textContent);
    expect(names).toEqual(['Flaky e2e on Safari']);
    const toggle = screen.getByRole('button', { name: 'Run context' });
    fireEvent.click(toggle);
    expect(container.querySelector('[data-agent-workspace]')!.getAttribute('data-pane')).toBe('ctx');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
  });

  it('renders the empty new-conversation state and a starter prompt fills the composer', () => {
    const { container } = render(
      <AgentWorkspaceTemplate entries={[]} plan={[]} approval={null} conversations={[]} models={[]} />,
    );
    expect(container.querySelector('h1')!.textContent).toBe('New conversation');
    expect(container.querySelector('[role="log"]')).toBeNull();
    expect(container.querySelector('[data-approval-gate]')).toBeNull();
    fireEvent.click(screen.getByText('Find flaky tests in the last 20 CI runs'));
    const ta = container.querySelector('textarea')!;
    expect(ta.value).toBe('Find flaky tests in the last 20 CI runs');
  });

  it('sending from the composer appends a message to the log', () => {
    const { container } = render(<AgentWorkspaceTemplate />);
    const ta = container.querySelector('textarea')!;
    fireEvent.change(ta, { target: { value: 'Looks good' } });
    fireEvent.keyDown(ta, { key: 'Enter' });
    const tiles = container.querySelectorAll('[data-msg][data-turn="user"]');
    expect(tiles[tiles.length - 1]!.textContent).toContain('Looks good');
  });
});
