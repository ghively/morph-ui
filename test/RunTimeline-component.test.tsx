import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RunTimeline } from '../src/components/RunTimeline';
import type { RunTimelineStep } from '../src/components/RunTimeline';

describe('RunTimeline', () => {
  const steps: RunTimelineStep[] = [
    { id: '1', label: 'Initialization', status: 'succeeded', startedAt: '2026-01-01T10:00:00Z' },
    { id: '2', label: 'Processing Data', status: 'running', detail: 'Processing chunk 1 of 5' },
    { id: '3', label: 'Finalization', status: 'pending' }
  ];

  it('renders steps with correct statuses', () => {
    const { container } = render(<RunTimeline steps={steps} />);
    
    expect(screen.getByText('Initialization')).toBeTruthy();
    expect(screen.getByText('Processing Data')).toBeTruthy();
    expect(screen.getByText('Finalization')).toBeTruthy();
    
    const stepEls = container.querySelectorAll('[data-run-timeline-step]');
    expect(stepEls[0].getAttribute('data-status')).toBe('succeeded');
    expect(stepEls[1].getAttribute('data-status')).toBe('running');
    expect(stepEls[2].getAttribute('data-status')).toBe('pending');
  });

  it('renders time when provided', () => {
    render(<RunTimeline steps={steps} />);
    // Note: timezone differences in CI might format differently, just check if something rendered in the time slot
    expect(document.querySelector('[data-run-timeline-time]')).toBeTruthy();
  });

  it('renders details', () => {
    render(<RunTimeline steps={steps} />);
    expect(screen.getByText('Processing chunk 1 of 5')).toBeTruthy();
  });

  it('applies dense mode', () => {
    const { container } = render(<RunTimeline steps={steps} dense />);
    const timeline = container.querySelector('[data-run-timeline]');
    expect(timeline?.getAttribute('data-dense')).toBe('true');
  });
});
