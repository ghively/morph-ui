import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { toTone, statusHook } from '../src/tone';
import { Badge } from '../src/components/Badge';
import { AlertBanner } from '../src/components/AlertBanner';
import { ProgressBar } from '../src/components/ProgressBar';
import { KpiCard } from '../src/components/KpiCard';
import { StatusRowList } from '../src/components/StatusRowList';

describe('toTone', () => {
  it('maps aliases onto the canonical vocabulary', () => {
    expect(toTone('ok')).toBe('success');
    expect(toTone('good')).toBe('success');
    expect(toTone('warning')).toBe('warn');
    expect(toTone('bad')).toBe('danger');
    expect(toTone('error')).toBe('danger');
    expect(toTone('default')).toBe('neutral');
    expect(toTone(undefined, 'info')).toBe('info');
    expect(toTone('danger')).toBe('danger');
  });
  it('statusHook keeps the legacy ok/warn/danger hooks', () => {
    expect(statusHook('success')).toBe('ok');
    expect(statusHook('ok')).toBe('ok');
    expect(statusHook('warning')).toBe('warn');
    expect(statusHook('info')).toBeUndefined();
  });
});

describe('components accept the shared vocabulary', () => {
  it('Badge normalizes aliases', () => {
    render(<Badge tone="ok">Healthy</Badge>);
    expect(screen.getByText('Healthy').closest('[data-badge]')!.getAttribute('data-tone')).toBe('success');
  });
  it('AlertBanner styles success and keeps legacy warn', () => {
    const { container, rerender } = render(<AlertBanner tone="success">Saved</AlertBanner>);
    expect(container.querySelector('[data-alert]')!.getAttribute('data-tone')).toBe('success');
    rerender(<AlertBanner tone="warning">Slow</AlertBanner>);
    expect(container.querySelector('[data-alert]')!.getAttribute('data-tone')).toBe('warn');
    rerender(<AlertBanner tone="info">FYI</AlertBanner>);
    expect(container.querySelector('[data-alert]')!.hasAttribute('data-tone')).toBe(false);
  });
  it('ProgressBar maps neutral to its default hook', () => {
    const { container } = render(<ProgressBar value={0.4} label="Sync" tone="neutral" />);
    expect(container.querySelector('[data-tone]')!.getAttribute('data-tone')).toBe('default');
  });
  it('KpiCard accepts canonical deltaTone', () => {
    const { container } = render(<KpiCard label="Churn" value="17" delta="+4" deltaDirection="up" deltaTone="danger" />);
    expect(container.querySelector('[data-kpidelta]')!.getAttribute('data-tone')).toBe('bad');
  });
  it('StatusRowList maps success to the ok dot', () => {
    const { container } = render(<StatusRowList rows={[{ id: '1', title: 'API', dot: true, tone: 'success' }]} />);
    expect(container.querySelector('[data-statusdot]')!.getAttribute('data-tone')).toBe('ok');
  });
});
