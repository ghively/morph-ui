import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CommandPalette } from '../src/components/CommandPalette';
import { ToolCallCard } from '../src/components/ToolCallCard';
import { StreamingMessage } from '../src/components/StreamingMessage';
import { ModelSelector } from '../src/components/ModelSelector';
import { ContextMeter } from '../src/components/ContextMeter';
import { ApprovalGate } from '../src/components/ApprovalGate';
import { RunTimeline } from '../src/components/RunTimeline';
import { DiffStatPill } from '../src/components/DiffStatPill';
import { AgentCard } from '../src/components/AgentCard';
import { ApprovalInbox } from '../src/components/ApprovalInbox';
import { PlanChecklist } from '../src/components/PlanChecklist';
import { CostMeter } from '../src/components/CostMeter';
import { EvalScoreCard } from '../src/components/EvalScoreCard';
import { HandoffCard } from '../src/components/HandoffCard';
import { AuditLogViewer } from '../src/components/AuditLogViewer';

describe('CommandPalette', () => {
  const cmds = [
    { id: 'a', label: 'Start run', group: 'Actions', run: vi.fn() },
    { id: 'b', label: 'Settings', group: 'System', run: vi.fn() },
  ];
  it('filters, highlights, wraps and runs on Enter', () => {
    const onSelect = vi.fn();
    const { container } = render(<CommandPalette commands={cmds} open onSelect={onSelect} />);
    const input = container.querySelector('[data-command-palette-input]') as HTMLInputElement;
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(container.querySelector('[data-active="true"]')?.textContent).toContain('Settings');
    fireEvent.change(input, { target: { value: 'start' } });
    expect(container.querySelector('mark')?.textContent).toBe('Start');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(cmds[0].run).toHaveBeenCalled();
    expect(onSelect).toHaveBeenCalledWith('a');
  });
  it('renders nothing when closed', () => {
    const { container } = render(<CommandPalette commands={cmds} open={false} />);
    expect(container.firstChild).toBeNull();
  });
});

describe('ToolCallCard', () => {
  it('formats duration and supports controlled expansion', () => {
    const onExpandedChange = vi.fn();
    const { container } = render(<ToolCallCard toolName="t" args={{ a: 1 }} status="running" duration={12840} expanded={false} onExpandedChange={onExpandedChange} />);
    expect(screen.getByText('12.8s')).toBeTruthy();
    fireEvent.click(container.querySelector('[data-tool-call-header]')!);
    expect(onExpandedChange).toHaveBeenCalledWith(true);
    expect(container.querySelector('[data-tool-call-raw-json]')).toBeNull();
  });
  it('shows error excerpt when failed and collapsed', () => {
    const { container } = render(<ToolCallCard toolName="t" args={{}} status="failed" error="boom" />);
    expect(container.querySelector('[data-tool-call-error-excerpt]')?.textContent).toBe('boom');
  });
});

describe('StreamingMessage', () => {
  it('keeps the caret inside the last block while streaming', () => {
    const { container } = render(<StreamingMessage chunks={['Hi **there**']} done={false} />);
    expect(container.querySelector('[data-streaming-message-p] [data-streaming-message-caret]')).toBeTruthy();
    expect(container.querySelector('strong')?.textContent).toBe('there');
  });
  it('renders an unclosed fence as code mid-stream', () => {
    const { container } = render(<StreamingMessage chunks={['x\n\n```bash\npnpm build']} done={false} />);
    expect(container.querySelector('pre[data-lang="bash"] code')?.textContent).toBe('pnpm build');
  });
});

describe('ModelSelector', () => {
  const models = [
    { id: 'a', label: 'A', vendor: 'V', contextWindow: 1000, enabled: true },
    { id: 'b', label: 'B', vendor: 'V', contextWindow: 2000, enabled: false },
    { id: 'c', label: 'C', vendor: 'V', contextWindow: 3000, enabled: true },
  ];
  it('skips disabled models with arrow keys', () => {
    const onSelect = vi.fn();
    const { container } = render(<ModelSelector models={models} selectedId="a" onSelect={onSelect} defaultOpen />);
    const root = container.querySelector('[data-model-selector]')!;
    fireEvent.keyDown(root, { key: 'ArrowDown' });
    fireEvent.keyDown(root, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith('c');
  });
});

describe('meters', () => {
  it('ContextMeter levels', () => {
    const { container } = render(<ContextMeter used={190} total={200} />);
    expect(container.querySelector('[data-context-meter]')?.getAttribute('data-level')).toBe('danger');
  });
  it('CostMeter warnAt + over', () => {
    const { container, rerender } = render(<CostMeter spent={4.5} budget={5} />);
    expect(container.querySelector('[data-cost]')?.getAttribute('data-level')).toBe('warn');
    rerender(<CostMeter spent={6} budget={5} />);
    expect(screen.getByRole('alert')).toBeTruthy();
  });
});

describe('ApprovalGate', () => {
  it('shows the outcome after resolving', () => {
    const onResolve = vi.fn();
    render(<ApprovalGate title="t" description="d" riskLevel="medium" actionSummary="x" onResolve={onResolve} />);
    fireEvent.change(screen.getByLabelText('Comment'), { target: { value: 'ok' } });
    fireEvent.click(screen.getByText('Approve'));
    expect(onResolve).toHaveBeenCalledWith(true, 'ok');
    expect(screen.getByRole('status').textContent).toContain('Approved');
  });
});

describe('RunTimeline', () => {
  it('computes durations against now', () => {
    render(<RunTimeline now="2026-01-01T00:00:10Z" steps={[{ id: 'a', label: 'a', status: 'running', startedAt: '2026-01-01T00:00:00Z' }]} />);
    expect(screen.getByText('10s')).toBeTruthy();
  });
});

describe('small surfaces', () => {
  it('DiffStatPill keeps data hooks', () => {
    const { container } = render(<DiffStatPill added={3} removed={1} fileName="src/a.ts" />);
    expect(container.querySelector('[data-diff-stat-num="added"]')?.textContent).toBe('+3');
  });
  it('AgentCard falls back to initials and acts as a button', () => {
    const onFocus = vi.fn();
    render(<AgentCard name="claude-gh-ai" status="working" onFocus={onFocus} />);
    expect(screen.getByText('CG')).toBeTruthy();
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(onFocus).toHaveBeenCalled();
  });
  it('ApprovalInbox sorts by risk and fires after the exit animation', () => {
    vi.useFakeTimers();
    const onApprove = vi.fn();
    const { container } = render(<ApprovalInbox onApprove={onApprove} requests={[{ id: 'l', title: 'low', risk: 'low' }, { id: 'h', title: 'high', risk: 'high' }]} />);
    expect(container.querySelector('[data-approval]')?.getAttribute('data-risk')).toBe('high');
    fireEvent.click(screen.getByLabelText('Approve: high'));
    act(() => { vi.runAllTimers(); });
    expect(onApprove).toHaveBeenCalledWith('h');
    vi.useRealTimers();
  });
  it('PlanChecklist progress', () => {
    render(<PlanChecklist steps={[{ id: 'a', label: 'a', state: 'done' }, { id: 'b', label: 'b', state: 'todo' }]} />);
    expect(screen.getByLabelText('1 of 2 steps done')).toBeTruthy();
  });
  it('EvalScoreCard overall + delta', () => {
    render(<EvalScoreCard title="q" dimensions={[{ name: 'x', score: 80, target: 85 }]} />);
    expect(screen.getByLabelText('Overall score 80 of 100')).toBeTruthy();
    expect(screen.getByText('−5')).toBeTruthy();
  });
  it('HandoffCard accept', () => {
    const onAccept = vi.fn();
    render(<HandoffCard to="Priya" reason="r" urgency="now" onAccept={onAccept} />);
    fireEvent.click(screen.getByText('Take over'));
    expect(onAccept).toHaveBeenCalled();
  });
  it('AuditLogViewer empty state', () => {
    render(<AuditLogViewer events={[]} />);
    expect(screen.getByText('No events recorded.')).toBeTruthy();
  });
});
