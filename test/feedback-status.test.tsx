import { render, screen, fireEvent, act } from '@testing-library/react';
import { useRef, useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { ProgressRing } from '../src/components/ProgressRing';
import { MultiStepProgress } from '../src/components/MultiStepProgress';
import { OnboardingSpotlight } from '../src/components/OnboardingSpotlight';
import { TourOverlay } from '../src/components/TourOverlay';
import { ErrorState } from '../src/components/ErrorState';
import { SyncStatusIndicator } from '../src/components/SyncStatusIndicator';
import { QuotaMeter } from '../src/components/QuotaMeter';
import { RateLimitNotice } from '../src/components/RateLimitNotice';
import { HealthCheckPanel } from '../src/components/HealthCheckPanel';
import { MaintenanceMode } from '../src/components/MaintenanceMode';

/* ── ProgressRing ─────────────────────────────────────────────────────────── */

describe('ProgressRing', () => {
  it('renders a determinate ring with value and center label', () => {
    const { container } = render(<ProgressRing value={68} label="68%" sublabel="indexed" />);
    const ring = container.querySelector('[data-ring]');
    expect(ring).toBeTruthy();
    expect(ring!.getAttribute('role')).toBe('progressbar');
    expect(ring!.getAttribute('aria-valuenow')).toBe('68');
    expect(ring!.hasAttribute('data-indeterminate')).toBe(false);
    expect(ring!.querySelector('[data-ringvalue]')).toBeTruthy();
    expect(ring!.querySelector('[data-ringtext]')!.textContent).toBe('68%');
    expect(ring!.querySelector('[data-ringsub]')!.textContent).toBe('indexed');
  });

  it('goes indeterminate without a value and drops the value arc', () => {
    const { container } = render(<ProgressRing />);
    const ring = container.querySelector('[data-ring]');
    expect(ring!.hasAttribute('data-indeterminate')).toBe(true);
    expect(ring!.getAttribute('aria-valuenow')).toBeNull();
    expect(ring!.querySelector('[data-ringvalue]')).toBeNull();
    expect(ring!.querySelector('[data-ringarc]')).toBeTruthy();
  });

  it('clamps out-of-range values', () => {
    const { container } = render(<ProgressRing value={140} />);
    expect(container.querySelector('[data-ring]')!.getAttribute('aria-valuenow')).toBe('100');
  });

  it('scales and tones', () => {
    const { container } = render(<ProgressRing value={10} size="xl" tone="success" />);
    const ring = container.querySelector('[data-ring]');
    expect(ring!.getAttribute('data-size')).toBe('xl');
    expect(ring!.getAttribute('data-tone')).toBe('success');
    const svg = ring!.querySelector('[data-ringsvg]') as SVGSVGElement;
    expect(svg.getAttribute('width')).toBe('128');
  });
});

/* ── MultiStepProgress ────────────────────────────────────────────────────── */

describe('MultiStepProgress', () => {
  const steps = [
    { id: 'a', label: 'Fetch' },
    { id: 'b', label: 'Parse' },
    { id: 'c', label: 'Embed' },
    { id: 'd', label: 'Index' },
  ];

  it('derives complete/current/pending from current index', () => {
    const { container } = render(<MultiStepProgress steps={steps} current={1} />);
    const rows = container.querySelectorAll('[data-mstep]');
    expect(rows).toHaveLength(4);
    expect(rows[0]!.getAttribute('data-state')).toBe('complete');
    expect(rows[1]!.getAttribute('data-state')).toBe('current');
    expect(rows[1]!.getAttribute('aria-current')).toBe('step');
    expect(rows[2]!.getAttribute('data-state')).toBe('pending');
    expect(container.querySelectorAll('[data-mrail][data-lit]')).toHaveLength(1);
  });

  it('honors an explicit error state and hint text', () => {
    const { container } = render(
      <MultiStepProgress
        current={0}
        steps={[
          { id: 'a', label: 'Connect', state: 'error', hint: 'refused' },
          { id: 'b', label: 'Next' },
        ]}
      />,
    );
    const rows = container.querySelectorAll('[data-mstep]');
    expect(rows[0]!.getAttribute('data-state')).toBe('error');
    expect(rows[1]!.getAttribute('data-state')).toBe('pending');
    expect(container.querySelector('[data-mhint]')!.textContent).toBe('refused');
  });

  it('marks everything complete at the last step', () => {
    const { container } = render(<MultiStepProgress steps={steps} current={3} />);
    expect(container.querySelectorAll('[data-mstep][data-state="complete"]')).toHaveLength(3);
    expect(container.querySelectorAll('[data-mstep][data-state="current"]')).toHaveLength(1);
  });
});

/* ── OnboardingSpotlight ──────────────────────────────────────────────────── */

describe('OnboardingSpotlight', () => {
  it('frames the target and renders coach content', () => {
    const { container } = render(
      <>
        <button type="button">Go</button>
        <OnboardingSpotlight
          target="button"
          step={2}
          of={5}
          title="Press go"
          onNext={() => {}}
          onSkip={() => {}}
        >
          Body copy here.
        </OnboardingSpotlight>,
      </>,
    );
    expect(container.querySelector('[data-spotlight]')).toBeTruthy();
    const hole = container.querySelector('[data-spothole]') as HTMLElement;
    expect(hole.style.left).not.toBe('');
    expect(container.querySelector('[data-spotstep]')!.textContent).toBe('2 of 5');
    expect(container.querySelector('[data-spottitle]')!.textContent).toBe('Press go');
    expect(container.querySelector('[data-spotbody]')!.textContent).toBe('Body copy here.');
    expect(screen.getByRole('button', { name: 'Next' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Skip' })).toBeTruthy();
  });

  it('next and skip fire; Escape skips', () => {
    const onNext = vi.fn();
    const onSkip = vi.fn();
    render(
      <>
        <button type="button">Go</button>
        <OnboardingSpotlight target="button" title="T" onNext={onNext} onSkip={onSkip} />
      </>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onNext).toHaveBeenCalledOnce();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onSkip).toHaveBeenCalledOnce();
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <OnboardingSpotlight target="button" title="T" open={false} />,
    );
    expect(container.querySelector('[data-spotlight]')).toBeNull();
  });
});

/* ── TourOverlay ──────────────────────────────────────────────────────────── */

function TourDemo({ step: stepProp, ...rest }: { step?: number; onStepChange?: (i: number) => void; onFinish?: () => void; onSkip?: () => void }) {
  const btn = useRef<HTMLButtonElement>(null);
  const [step, setStep] = useState(stepProp ?? 0);
  return (
    <>
      <button ref={btn} type="button">Target</button>
      <TourOverlay
        open
        step={stepProp ?? step}
        onStepChange={(i) => { setStep(i); rest.onStepChange?.(i); }}
        onFinish={rest.onFinish}
        onSkip={rest.onSkip}
        steps={[
          { id: 'a', target: btn, title: 'First' },
          { id: 'b', target: btn, title: 'Second' },
          { id: 'c', target: btn, title: 'Third' },
        ]}
      />
    </>
  );
}

describe('TourOverlay', () => {
  it('renders one dot per step with the current one active', () => {
    const { container } = render(<TourDemo step={1} />);
    const dots = container.querySelectorAll('[data-tourdot]');
    expect(dots).toHaveLength(3);
    expect(dots[1]!.hasAttribute('data-on')).toBe(true);
    expect(dots[0]!.hasAttribute('data-done')).toBe(true);
    expect(dots[1]!.getAttribute('aria-selected')).toBe('true');
  });

  it('advances on Next, jumps on dot click, goes back', () => {
    const onStepChange = vi.fn();
    const { container } = render(<TourDemo onStepChange={onStepChange} />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Next' })[0]!);
    expect(onStepChange).toHaveBeenLastCalledWith(1);
    fireEvent.click(container.querySelectorAll('[data-tourdot]')[2]!);
    expect(onStepChange).toHaveBeenLastCalledWith(2);
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(onStepChange).toHaveBeenLastCalledWith(1);
  });

  it('keyboard: ArrowRight advances, ArrowLeft backs, Escape skips', () => {
    const onFinish = vi.fn();
    const onSkip = vi.fn();
    render(<TourDemo step={0} onFinish={onFinish} onSkip={onSkip} />);
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onSkip).toHaveBeenCalledOnce();
  });

  it('the final step finishes instead of advancing', () => {
    const onFinish = vi.fn();
    render(<TourDemo step={2} onFinish={onFinish} />);
    expect(screen.getByRole('button', { name: 'Finish' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Finish' }));
    expect(onFinish).toHaveBeenCalledOnce();
  });

  it('hides when closed', () => {
    const btn = { current: document.createElement('button') };
    const { container } = render(
      <TourOverlay open={false} steps={[{ id: 'a', target: btn, title: 'X' }]} />,
    );
    expect(container.querySelector('[data-tour]')).toBeNull();
  });
});

/* ── ErrorState ───────────────────────────────────────────────────────────── */

describe('ErrorState', () => {
  it('renders title, body, code tag and retry action', () => {
    const { container } = render(
      <ErrorState
        title="Couldn't load the dashboard"
        code="503"
        action={<button type="button">Try again</button>}
        details={'GET /api\n→ 503'}
      >
        The metrics service didn't respond.
      </ErrorState>,
    );
    expect(container.querySelector('[data-errorstate]')!.getAttribute('role')).toBe('alert');
    expect(container.querySelector('[data-errtitle]')!.textContent).toBe("Couldn't load the dashboard");
    expect(container.querySelector('[data-errcode]')!.textContent).toBe('503');
    expect(container.querySelector('[data-errbody]')!.textContent).toContain('metrics service');
    expect(screen.getByRole('button', { name: 'Try again' })).toBeTruthy();
  });

  it('hides the details block when omitted, shows it when given', () => {
    const { container, rerender } = render(<ErrorState title="T" />);
    expect(container.querySelector('[data-errdetails]')).toBeNull();
    rerender(<ErrorState title="T" details="boom" detailsLabel="Stack" />);
    const d = container.querySelector('[data-errdetails]') as HTMLDetailsElement;
    expect(d).toBeTruthy();
    expect(d.querySelector('summary')!.textContent).toBe('Stack');
    expect(d.querySelector('[data-errpre]')!.textContent).toBe('boom');
  });
});

/* ── SyncStatusIndicator ──────────────────────────────────────────────────── */

describe('SyncStatusIndicator', () => {
  it.each([['idle', 'Synced'], ['syncing', 'Syncing'], ['offline', 'Offline'], ['conflict', 'Conflict']] as const)(
    'renders %s with its default label and status hook',
    (status, label) => {
      const { container } = render(<SyncStatusIndicator status={status} />);
      const pill = container.querySelector('[data-sync]');
      expect(pill!.getAttribute('data-status')).toBe(status);
      expect(pill!.getAttribute('role')).toBe('status');
      expect(pill!.querySelector('[data-synclabel]')!.textContent).toBe(label);
    },
  );

  it('shows custom label and meta', () => {
    const { container } = render(<SyncStatusIndicator status="syncing" label="Uploading" meta="12 changes" />);
    expect(container.querySelector('[data-synclabel]')!.textContent).toBe('Uploading');
    expect(container.querySelector('[data-syncmeta]')!.textContent).toBe('12 changes');
  });

  it('swaps the icon per status', () => {
    const { container } = render(<SyncStatusIndicator status="syncing" />);
    expect(container.querySelector('[data-syncorbit]')).toBeTruthy();
    expect(container.querySelector('[data-syncicon] svg')).toBeTruthy();
  });
});

/* ── QuotaMeter ───────────────────────────────────────────────────────────── */

describe('QuotaMeter', () => {
  it('shows ok below the warn threshold', () => {
    const { container } = render(<QuotaMeter label="API credits" used={42} limit={100} unit="credits" />);
    const q = container.querySelector('[data-quota]');
    expect(q!.getAttribute('data-level')).toBe('ok');
    expect(q!.getAttribute('aria-valuenow')).toBe('42');
    expect(q!.querySelector('[data-quotapct]')!.textContent).toBe('42%');
    expect(q!.querySelector('[data-quotavalues]')!.textContent).toContain('42 of 100 credits');
    expect(q!.querySelector('[data-quotaalert]')).toBeNull();
  });

  it('warns at the threshold and alarms over the limit', () => {
    const { container } = render(<QuotaMeter used={87} limit={100} />);
    expect(container.querySelector('[data-quota]')!.getAttribute('data-level')).toBe('warn');
    const over = render(<QuotaMeter used={120} limit={100} unit="seats" />);
    const oq = over.container.querySelector('[data-quota]')!;
    expect(oq.getAttribute('data-level')).toBe('over');
    expect(oq.getAttribute('aria-valuenow')).toBe('120');
    expect(oq.querySelector('[data-quotaalert]')!.getAttribute('role')).toBe('alert');
    expect(oq.querySelector('[data-quotaalert]')!.textContent).toContain('20 seats over limit');
  });

  it('caps the fill at 100% and marks the warn threshold', () => {
    const { container } = render(<QuotaMeter used={300} limit={100} warnAt={0.8} />);
    const fill = container.querySelector('[data-quotafill]') as HTMLElement;
    expect(fill.style.width).toBe('100%');
    expect(container.querySelector('[data-quotamark]')).toBeTruthy();
  });
});

/* ── RateLimitNotice ──────────────────────────────────────────────────────── */

describe('RateLimitNotice', () => {
  it('counts down from retryAfter and flips to ready', () => {
    vi.useFakeTimers();
    const onRetry = vi.fn();
    const { container } = render(<RateLimitNotice retryAfter={2} subject="Search" onRetry={onRetry} />);
    expect(container.querySelector('[data-rlcount]')!.textContent).toBe('2s');
    act(() => { vi.advanceTimersByTime(1000); });
    expect(container.querySelector('[data-rlcount]')!.textContent).toBe('1s');
    const retry = screen.getByRole('button', { name: 'Retry' }) as HTMLButtonElement;
    expect(retry.disabled).toBe(true);
    act(() => { vi.advanceTimersByTime(1000); });
    expect(container.querySelector('[data-ratelimit]')!.hasAttribute('data-ready')).toBe(true);
    expect((screen.getByRole('button', { name: 'Retry' }) as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });

  it('renders immediately ready with retryAfter 0', () => {
    const { container } = render(<RateLimitNotice retryAfter={0} onRetry={() => {}} />);
    expect(container.querySelector('[data-ratelimit]')!.hasAttribute('data-ready')).toBe(true);
    expect(container.querySelector('[data-rltext]')!.textContent).toContain('retry now');
  });

  it('supports a controlled remaining value and reset time', () => {
    const { container } = render(<RateLimitNotice retryAfter={0} remaining={95} resetAt="14:32 UTC" />);
    expect(container.querySelector('[data-rltimer]')!.textContent).toBe('1:35');
    expect(container.querySelector('[data-rlreset]')!.textContent).toContain('14:32 UTC');
  });
});

/* ── HealthCheckPanel ─────────────────────────────────────────────────────── */

describe('HealthCheckPanel', () => {
  const services = [
    { id: 'api', name: 'Gateway API', status: 'ok' as const, latency: [42, 38, 51, 44], uptime: 0.9998 },
    { id: 'db', name: 'Primary database', status: 'degraded' as const, latency: [12, 220, 310, 240], note: 'Failover running' },
    { id: 'mail', name: 'Outbound mail', status: 'down' as const, latency: [120, 1450, 1380], latencyNow: 1380 },
  ];

  it('renders a row per service with status hook, sparkline and latency', () => {
    const { container } = render(<HealthCheckPanel services={services} />);
    const rows = container.querySelectorAll('[data-hcprow]');
    expect(rows).toHaveLength(3);
    expect(rows[0]!.getAttribute('data-status')).toBe('ok');
    expect(rows[1]!.getAttribute('data-status')).toBe('degraded');
    expect(rows[2]!.getAttribute('data-status')).toBe('down');
    expect(rows[0]!.querySelector('.hcp-line')).toBeTruthy();
    // latencyNow wins when given; otherwise derived from the last sample
    expect(rows[1]!.querySelector('[data-hcplat]')!.textContent).toBe('240ms');
    expect(rows[2]!.querySelector('[data-hcplat]')!.textContent).toBe('1.38s');
  });

  it('summarizes attention needed vs all operational', () => {
    const { container } = render(<HealthCheckPanel services={services} />);
    expect(container.querySelector('[data-hcpsum]')!.textContent).toContain('2 of 3 need attention');
    const ok = render(
      <HealthCheckPanel services={[{ id: 'a', name: 'Edge', status: 'ok', latency: [1, 2] }]} />,
    );
    expect(ok.container.querySelector('[data-hcp]')!.hasAttribute('data-all-ok')).toBe(true);
    expect(ok.container.querySelector('[data-hcpsum]')!.textContent).toContain('All 1 operational');
  });

  it('status dots expose their meaning to assistive tech', () => {
    render(<HealthCheckPanel services={services} />);
    expect(screen.getByRole('img', { name: 'Operational' })).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Down' })).toBeTruthy();
  });
});

/* ── MaintenanceMode ──────────────────────────────────────────────────────── */

describe('MaintenanceMode', () => {
  it('counts down hours:minutes:seconds', () => {
    vi.useFakeTimers();
    const { container } = render(<MaintenanceMode untilSeconds={3661} />);
    expect(container.querySelector('[data-maintcount]')!.textContent).toBe('1:01:01');
    act(() => { vi.advanceTimersByTime(1000); });
    expect(container.querySelector('[data-maintcount]')!.textContent).toBe('1:01:00');
    vi.useRealTimers();
  });

  it('reveals the back action only once the timer clears', () => {
    vi.useFakeTimers();
    const onBack = vi.fn();
    const { container } = render(<MaintenanceMode untilSeconds={1} onBack={onBack} />);
    expect(container.querySelector('[data-maintback]')).toBeNull();
    act(() => { vi.advanceTimersByTime(1100); });
    expect(container.querySelector('[data-maintenance]')!.hasAttribute('data-back')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Back to work' }));
    expect(onBack).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });

  it('subscribes with the entered email', () => {
    const onSubscribe = vi.fn();
    render(<MaintenanceMode untilSeconds={60} onSubscribe={onSubscribe} />);
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'dev@team.com' } });
    fireEvent.submit(screen.getByLabelText('Email address').closest('form')!);
    expect(onSubscribe).toHaveBeenCalledWith('dev@team.com');
  });

  it('can render inline (not fullscreen) with a custom title', () => {
    const { container } = render(
      <MaintenanceMode fullscreen={false} title="Index rebuild">Rebuilding.</MaintenanceMode>,
    );
    const m = container.querySelector('[data-maintenance]')!;
    expect(m.hasAttribute('data-fullscreen')).toBe(false);
    expect(m.querySelector('[data-mainttitle]')!.textContent).toBe('Index rebuild');
    expect(m.querySelector('[data-mainttimer]')).toBeNull();
  });
});
