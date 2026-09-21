import { render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StatusRowList, CollapsibleSection } from '../src/components/StatusRowList';

describe('StatusRowList', () => {
  it('renders list container correctly', () => {
    const { container } = render(
      <StatusRowList rows={[]} label="My List" semantics="list" flush />
    );
    const rows = container.querySelector('[data-rows]');
    expect(rows).toBeTruthy();
    expect(rows!.getAttribute('role')).toBe('list');
    expect(rows!.getAttribute('aria-label')).toBe('My List');
    expect(rows!.hasAttribute('data-gap')).toBe(true);
    expect(rows!.getAttribute('data-gap')).toBe('flush');
  });

  it('renders listbox container correctly', () => {
    const { container } = render(
      <StatusRowList rows={[{ id: '1', title: 'R1', selected: true }]} semantics="listbox" />
    );
    const rows = container.querySelector('[data-rows]');
    expect(rows!.getAttribute('role')).toBe('listbox');
    
    const row = container.querySelector('[data-statusrow]');
    expect(row!.tagName.toLowerCase()).toBe('button');
    expect(row!.getAttribute('role')).toBe('option');
    expect(row!.getAttribute('aria-selected')).toBe('true');
    expect(row!.hasAttribute('data-on')).toBe(true);
  });

  it('renders row dot with tone correctly', () => {
    const { container, rerender } = render(
      <StatusRowList rows={[{ id: '1', title: 'R1', dot: true, tone: 'warn' }]} />
    );
    let dot = container.querySelector('[data-statusdot]');
    expect(dot).toBeTruthy();
    expect(dot!.getAttribute('data-tone')).toBe('warn');

    rerender(<StatusRowList rows={[{ id: '1', title: 'R1', dot: true }]} />);
    dot = container.querySelector('[data-statusdot]');
    expect(dot!.getAttribute('data-tone')).toBeNull();

    rerender(<StatusRowList rows={[{ id: '1', title: 'R1' }]} />);
    // Note: dot default behavior in spec: "Omit dot for no dot" wait, the spec says "Omit tone for a neutral dot; omit dot for no dot". Actually the code says `row.dot !== false && row.dot !== undefined`. If omitted, it's undefined -> no dot.
    expect(container.querySelector('[data-statusdot]')).toBeNull();
  });

  it('renders title button if onTitleSelect provided', () => {
    const onTitleSelect = vi.fn();
    const { container } = render(
      <StatusRowList rows={[{ id: '1', title: 'R1', onTitleSelect }]} />
    );
    
    const titleBtn = container.querySelector('[data-linkish]');
    expect(titleBtn).toBeTruthy();
    expect(titleBtn!.tagName.toLowerCase()).toBe('button');
    
    fireEvent.click(titleBtn!);
    expect(onTitleSelect).toHaveBeenCalledTimes(1);
  });

  it('renders badges, chips, and metrics', () => {
    const { container } = render(
      <StatusRowList rows={[{ 
        id: '1', 
        title: 'R1', 
        badges: [{ id: 'b1', label: 'Badge', solid: true }],
        chips: ['Chip1', 'Chip2'],
        metric: { label: 'CPU', value: '50%' }
      }]} />
    );
    
    const badge = container.querySelector('[data-statustag][data-solid]');
    expect(badge).toBeTruthy();
    expect(badge!.textContent).toBe('Badge');

    const chips = container.querySelectorAll('[data-statuschip]');
    expect(chips.length).toBe(2);
    expect(chips[0]!.textContent).toBe('Chip1');

    const metricWrapper = container.querySelector('[data-hidenarrow]');
    expect(metricWrapper).toBeTruthy();
    expect(metricWrapper!.textContent).toContain('CPU');
    expect(metricWrapper!.textContent).toContain('50%');
  });

  it('renders actions and handles busy state', () => {
    const onSelect = vi.fn();
    const { getByText } = render(
      <StatusRowList rows={[{ 
        id: '1', 
        title: 'R1', 
        actions: [
          { id: 'a1', label: 'Act1', onSelect, busy: true, tone: 'danger' },
          { id: 'a2', label: 'Act2', onSelect, disabled: true }
        ]
      }]} />
    );
    
    const a1 = getByText('Act1').closest('button');
    expect(a1!.hasAttribute('data-busy')).toBe(true);
    expect(a1!.getAttribute('data-tone')).toBe('danger');
    expect(a1!.disabled).toBe(true);
    expect(a1!.querySelector('[data-spin]')).toBeTruthy();

    const a2 = getByText('Act2').closest('button');
    expect(a2!.disabled).toBe(true);
  });

  it('handles row activation correctly', () => {
    const onSelect1 = vi.fn();
    const onSelect2 = vi.fn();
    const { container } = render(
      <StatusRowList rows={[
        { id: 'r1', title: 'Row1', onSelect: onSelect1 },
        { id: 'r2', title: 'Row2', onSelect: onSelect2, actions: [{ id: 'a1', label: 'A1', onSelect: vi.fn() }] }
      ]} />
    );
    
    const rows = container.querySelectorAll('[data-statusrow]');
    
    // Row 1: only onSelect -> whole row clickable
    fireEvent.click(rows[0]!);
    expect(onSelect1).toHaveBeenCalledTimes(1);

    // Row 2: onSelect + actions -> row body not clickable, fill is clickable
    fireEvent.click(rows[1]!);
    expect(onSelect2).not.toHaveBeenCalled();

    const fill2 = rows[1]!.querySelector('[data-fill]');
    fireEvent.click(fill2!);
    expect(onSelect2).toHaveBeenCalledTimes(1);
  });

  it('supports keyboard on interactive rows', () => {
    const onSelect = vi.fn();
    const { container } = render(
      <StatusRowList rows={[{ id: '1', title: 'R1', onSelect }]} />
    );
    
    const row = container.querySelector('[data-statusrow]');
    expect(row!.getAttribute('tabindex')).toBe("0");
    
    fireEvent.keyDown(row!, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('renders error', () => {
    const { getByRole } = render(
      <StatusRowList rows={[{ id: '1', title: 'R1', error: 'Failed' }]} />
    );
    const alert = getByRole('alert');
    expect(alert.textContent).toBe('Failed');
  });

  it('handles metaFirst inversion', () => {
    const { container } = render(
      <StatusRowList rows={[{ id: '1', title: 'My Title', meta: 'My Meta', metaFirst: true }]} />
    );
    
    const fill = container.querySelector('[data-fill]');
    const children = Array.from(fill!.children);
    // meta is the first div with data-statusmeta, title is second
    expect(children[0]!.getAttribute('data-statusmeta')).toBe("");
    expect(children[1]!.getAttribute('data-strong')).toBe("");
  });
});

describe('CollapsibleSection', () => {
  it('renders details, summary, and children', () => {
    const { container } = render(
      <CollapsibleSection title="Moderation" meta="5 users" defaultOpen>
        <div id="child">Child</div>
      </CollapsibleSection>
    );

    const details = container.querySelector('details');
    expect(details!.hasAttribute('open')).toBe(true);
    
    const summary = container.querySelector('summary');
    expect(summary!.textContent).toContain('Moderation');
    expect(summary!.textContent).toContain('5 users');
    
    expect(container.querySelector('#child')).toBeTruthy();
  });
});
