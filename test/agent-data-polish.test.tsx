import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AgentPresence } from '../src/components/AgentPresence';
import { AgentActivityCapsule } from '../src/components/AgentActivityCapsule';
import { GenerativePlaceholder } from '../src/components/GenerativePlaceholder';
import { ContextSwitcher } from '../src/components/ContextSwitcher';

describe('AgentPresence', () => {
  it('exposes state via role, label and data attribute', () => {
    const { container } = render(<AgentPresence state="tool-use" />);
    expect(screen.getByRole('status').getAttribute('aria-label')).toBe('Agent is tool-use');
    expect(container.querySelector('[data-state="tool-use"]')).toBeTruthy();
  });
  it('renders an equalizer for live states and glyphs for outcomes', () => {
    const { container, rerender } = render(<AgentPresence state="streaming" />);
    expect(container.querySelectorAll('.agent-presence-bars i').length).toBe(3);
    rerender(<AgentPresence state="success" />);
    expect(container.querySelector('.agent-presence-glyph')).toBeTruthy();
  });
  it('shows a visible label when asked', () => {
    render(<AgentPresence state="thinking" showLabel label="Planning" />);
    expect(screen.getByText('Planning')).toBeTruthy();
  });
});

describe('AgentActivityCapsule', () => {
  const steps = [{ label: 'Read file', status: 'done' as const }, { label: 'Run tests', status: 'active' as const }];

  it('toggles open and fires callbacks', () => {
    const onExpand = vi.fn(), onCollapse = vi.fn();
    const { container } = render(<AgentActivityCapsule agent="Hermes" activity="Refactor" steps={steps} onExpand={onExpand} onCollapse={onCollapse} />);
    const head = screen.getByRole('button', { expanded: false });
    fireEvent.click(head);
    expect(onExpand).toHaveBeenCalledTimes(1);
    expect(container.querySelector('.agent-activity.is-open')).toBeTruthy();
    fireEvent.click(head);
    expect(onCollapse).toHaveBeenCalledTimes(1);
  });
  it('normalises progress and shows percent', () => {
    render(<AgentActivityCapsule agent="Hermes" activity="Refactor" progress={45} />);
    expect(screen.getByText('45')).toBeTruthy();
  });
  it('infers step status from strings and run status', () => {
    const { container } = render(<AgentActivityCapsule status="failed" agent="Atlas" activity="Deploy" details={['build', 'ssh refused']} defaultExpanded />);
    expect(container.querySelectorAll('.agent-activity-step.is-done').length).toBe(1);
    expect(container.querySelectorAll('.agent-activity-step.is-failed').length).toBe(1);
  });
  it('maps the legacy state prop and wires approval actions', () => {
    const onApprove = vi.fn();
    render(<AgentActivityCapsule state="awaiting-user" agent="Hermes" activity="Migrate" steps={['Apply']} onApprove={onApprove} />);
    expect(screen.getByText('Needs approval')).toBeTruthy();
    fireEvent.click(screen.getByText(/Approve/));
    expect(onApprove).toHaveBeenCalled();
  });
});

describe('GenerativePlaceholder', () => {
  it.each(['text', 'conversation', 'card', 'artifact', 'table', 'graph', 'agent'] as const)('renders %s', variant => {
    const { container } = render(<GenerativePlaceholder variant={variant} />);
    expect(screen.getByRole('progressbar').getAttribute('aria-busy')).toBe('true');
    expect(container.querySelectorAll('.gen-placeholder-b').length).toBeGreaterThan(3);
  });
});

describe('ContextSwitcher', () => {
  const options = [{ value: 'a', label: 'Alpha', description: 'first' }, { value: 'b', label: 'Beta' }, 'Gamma'];

  it('opens, selects with the mouse and closes', () => {
    const onChange = vi.fn();
    render(<ContextSwitcher current="a" options={options} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('true');
    fireEvent.click(screen.getByText('Beta'));
    expect(onChange).toHaveBeenCalledWith('b');
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('false');
  });
  it('supports keyboard navigation', () => {
    const onChange = vi.fn();
    render(<ContextSwitcher current="a" options={options} onChange={onChange} />);
    const trig = screen.getByRole('button');
    fireEvent.keyDown(trig, { key: 'ArrowDown' });
    fireEvent.keyDown(trig, { key: 'ArrowDown' });
    fireEvent.keyDown(trig, { key: 'ArrowDown' });
    fireEvent.keyDown(trig, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith('Gamma');
  });
});
