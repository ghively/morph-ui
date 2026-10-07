import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OpsDashboardTemplate, demoOpsDashboard } from '../src/templates/OpsDashboardTemplate';

describe('OpsDashboardTemplate', () => {
  it('renders the page landmarks and a single h1', () => {
    const { container } = render(<OpsDashboardTemplate pageSize={2} />);
    expect(container.querySelectorAll('main').length).toBe(1);
    const h1s = container.querySelectorAll('h1');
    expect(h1s.length).toBe(1);
    expect(h1s[0]!.textContent).toBe(demoOpsDashboard.title);
    expect(container.querySelector('nav[aria-label="Breadcrumb"]')).toBeTruthy();
    expect(container.querySelector('nav[aria-label="Incident pages"]')).toBeTruthy();
    expect(container.querySelector('aside[aria-label="Service health and audit trail"]')).toBeTruthy();
    expect(container.querySelector('[role="search"] input[type="search"]')).toBeTruthy();
    expect(container.querySelectorAll('[data-daterange] input[type="date"]').length).toBe(2);
  });

  it('renders four KPIs, the charts and the side cards', () => {
    const { container } = render(<OpsDashboardTemplate />);
    expect(container.querySelectorAll('[data-kpi]').length).toBe(4);
    expect(container.querySelector('[data-linechart]')).toBeTruthy();
    expect(container.querySelector('[data-gauge]')).toBeTruthy();
    expect(container.querySelectorAll('.metric-sparkline').length).toBe(2);
    expect(container.querySelector('[role="list"][aria-label="Service health"]')).toBeTruthy();
    expect(container.querySelectorAll('[data-auditevent]').length).toBe(demoOpsDashboard.audit.length);
  });

  it('fixes the date inputs to maxDate (never derived from the clock)', () => {
    const { container } = render(<OpsDashboardTemplate />);
    const inputs = container.querySelectorAll<HTMLInputElement>('[data-daterange] input[type="date"]');
    inputs.forEach((i) => expect(i.max).toBe(demoOpsDashboard.maxDate));
    const on = container.querySelector('[data-preset][aria-pressed="true"]');
    expect(on?.textContent).toBe('7d');
  });

  it('paginates the incident table with status badges', () => {
    const { container } = render(<OpsDashboardTemplate pageSize={4} />);
    const table = container.querySelector('table');
    expect(table).toBeTruthy();
    expect(table!.querySelector('caption')?.textContent).toBe('Recent incidents');
    // "Hide resolved" filter leaves 4 open incidents → one page.
    expect(table!.querySelectorAll('tbody tr').length).toBe(4);
    expect(table!.textContent).not.toContain('Resolved');
    expect(table!.querySelector('[data-badge][data-tone="danger"]')).toBeTruthy();

    // Remove the filter: 9 incidents, 3 pages.
    fireEvent.click(container.querySelector('button[aria-label="Remove filter Hide resolved"]')!);
    expect(container.querySelectorAll('nav[aria-label="Incident pages"] button[aria-label^="Page "]').length).toBe(3);
    fireEvent.click(container.querySelector('button[aria-label="Page 3"]')!);
    expect(container.querySelector('button[aria-current="page"]')?.textContent).toBe('3');
    expect(container.querySelectorAll('tbody tr').length).toBe(1);
  });

  it('filters by search and shows an EmptyState with no matches', () => {
    const { container } = render(<OpsDashboardTemplate />);
    const search = container.querySelector<HTMLInputElement>('#ops-dash-search')!;
    fireEvent.change(search, { target: { value: 'webhooks' } });
    expect(container.querySelectorAll('tbody tr').length).toBe(1);
    fireEvent.change(search, { target: { value: 'no-such-thing' } });
    expect(container.querySelector('table')).toBeNull();
    expect(container.querySelector('[data-emptyeyebrow]')?.textContent).toBe('No incidents match');
    const reset = Array.from(container.querySelectorAll('button')).find((b) => b.textContent === 'Reset filters')!;
    fireEvent.click(reset);
    expect(container.querySelectorAll('tbody tr').length).toBe(4);
  });

  it('renders with empty data', () => {
    const { container } = render(
      <OpsDashboardTemplate kpis={[]} incidents={[]} services={[]} audit={[]} filters={[]} latency={[]} errorRate={{ labels: [], values: [] }} />,
    );
    expect(container.querySelector('main')).toBeTruthy();
    expect(container.querySelector('table')).toBeNull();
    expect(container.textContent).toContain('No incidents in this window');
    expect(container.textContent).toContain('No actions recorded today.');
    expect(container.querySelector('[data-filternone]')).toBeTruthy();
  });

  it('shows a spinner and skeletons while loading', () => {
    const { container } = render(<OpsDashboardTemplate loading />);
    expect(container.querySelector('[role="status"]')?.textContent).toBe('Loading incidents');
    expect(container.querySelectorAll('[data-skeleton-wrapper][aria-busy="true"]').length).toBeGreaterThan(0);
    expect(container.querySelector('table')).toBeNull();
  });
});
