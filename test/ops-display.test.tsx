import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { ApprovalInbox } from '../src/components/ApprovalInbox';
import { PlanChecklist } from '../src/components/PlanChecklist';
import { CostMeter } from '../src/components/CostMeter';
import { EvalScoreCard } from '../src/components/EvalScoreCard';
import { HandoffCard } from '../src/components/HandoffCard';
import { AuditLogViewer } from '../src/components/AuditLogViewer';
import { Stepper } from '../src/components/Stepper';
import { AvatarStack } from '../src/components/AvatarStack';
import { GaugeChart } from '../src/components/GaugeChart';
import { FunnelChart } from '../src/components/FunnelChart';
import { ShortcutHelp } from '../src/components/ShortcutHelp';

describe('ApprovalInbox', () => {
  it('sorts high risk first and decides', () => {
    const onApprove = vi.fn();
    const onReject = vi.fn();
    const { container } = render(
      <ApprovalInbox
        requests={[
          { id: 'low', title: 'Retry sync', risk: 'low' },
          { id: 'high', title: 'Drop index', risk: 'high' },
        ]}
        onApprove={onApprove}
        onReject={onReject}
      />,
    );
    expect(container.querySelector('[data-approval] [data-approvaltitle]')?.textContent).toBe('Drop index');
    fireEvent.click(screen.getByRole('button', { name: 'Approve: Drop index' }));
    expect(onApprove).toHaveBeenCalledWith('high');
    fireEvent.click(screen.getByRole('button', { name: 'Reject: Retry sync' }));
    expect(onReject).toHaveBeenCalledWith('low');
  });

  it('empty state', () => {
    render(<ApprovalInbox requests={[]} />);
    expect(screen.getByText('Nothing waiting on you.')).toBeTruthy();
  });
});

describe('PlanChecklist', () => {
  it('counts done steps', () => {
    render(
      <PlanChecklist
        steps={[
          { id: 'a', label: 'Pull', state: 'done' },
          { id: 'b', label: 'Draft', state: 'active' },
          { id: 'c', label: 'Blocked by approval', state: 'blocked' },
        ]}
      />,
    );
    expect(screen.getByLabelText('1 of 3 steps done')).toBeTruthy();
  });
});

describe('CostMeter', () => {
  it('flags over-budget with an alert', () => {
    const usd = (v: number) => `$${v.toFixed(2)}`;
    render(<CostMeter spent={6.2} budget={5} formatValue={usd} />);
    expect(screen.getByRole('alert').textContent).toContain('$1.20 over budget');
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('5');
  });
});

describe('EvalScoreCard', () => {
  it('averages dimensions when overall omitted', () => {
    render(
      <EvalScoreCard
        title="Quality"
        dimensions={[
          { name: 'Grounded', score: 90, target: 85 },
          { name: 'Tone', score: 70 },
        ]}
      />,
    );
    expect(screen.getByLabelText('Overall score 80 of 100')).toBeTruthy();
  });
});

describe('HandoffCard', () => {
  it('accepts the handoff', () => {
    const onAccept = vi.fn();
    render(<HandoffCard to="Priya" reason="Unsure about grandfathering." needed="Approve draft." urgency="now" onAccept={onAccept} />);
    fireEvent.click(screen.getByRole('button', { name: 'Take over' }));
    expect(onAccept).toHaveBeenCalledOnce();
  });
});

describe('AuditLogViewer', () => {
  it('renders trail newest first as given', () => {
    const { container } = render(
      <AuditLogViewer events={[{ id: 'e1', time: '09:41', actor: 'Priya', event: 'approved deletion', level: 'action' }]} />,
    );
    expect(container.querySelector('[data-auditevent]')?.getAttribute('data-level')).toBe('action');
    expect(container.querySelector('[data-auditline]')?.textContent).toContain('approved deletion');
  });
});

describe('Stepper', () => {
  it('navigates back to completed steps', () => {
    const onGo = vi.fn();
    function Controlled() {
      const [cur, setCur] = useState(2);
      return (
        <Stepper
          steps={[{ id: 'a', label: 'Scope' }, { id: 'b', label: 'Prompt' }, { id: 'c', label: 'Review' }]}
          current={cur}
          onGo={(i) => { setCur(i); onGo(i); }}
        />
      );
    }
    render(<Controlled />);
    expect(screen.getByText('Review').closest('li')?.getAttribute('aria-current')).toBe('step');
    fireEvent.click(screen.getByRole('button', { name: /Scope \(step 1 of 3\)/ }));
    expect(onGo).toHaveBeenCalledWith(0);
    expect(screen.getByText('Scope').closest('li')?.getAttribute('aria-current')).toBe('step');
  });
});

describe('AvatarStack', () => {
  it('overflows with +N and names everyone', () => {
    render(
      <AvatarStack
        max={2}
        people={[{ name: 'Priya Nair' }, { name: 'Tom Becker' }, { name: 'June Park' }]}
      />,
    );
    expect(screen.getByText('+1')).toBeTruthy();
    expect(screen.getByRole('group').getAttribute('aria-label')).toContain('June Park');
  });
});

describe('GaugeChart', () => {
  it('announces value as text', () => {
    const { container } = render(
      <GaugeChart label="SLA" value={94} centerLabel="94%" zones={[{ upTo: 90, tone: 'ok' }, { upTo: 100, tone: 'good' }]} />,
    );
    expect(container.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('SLA: 94%');
  });
});

describe('FunnelChart', () => {
  it('shows drop-off between stages', () => {
    render(
      <FunnelChart stages={[{ label: 'Queries', value: 1000 }, { label: 'Resolved', value: 400 }]} />,
    );
    expect(screen.getByText('−60%')).toBeTruthy();
    expect(screen.getByText('400')).toBeTruthy();
  });
});

describe('ShortcutHelp', () => {
  it('renders kbd chips', () => {
    const { container } = render(
      <ShortcutHelp groups={[{ title: 'Lab', shortcuts: [{ keys: ['⌘', 'K'], action: 'Focus query' }] }]} />,
    );
    expect(container.querySelectorAll('kbd').length).toBe(2);
    expect(screen.getByText('Focus query')).toBeTruthy();
  });
});
