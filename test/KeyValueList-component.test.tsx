import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { KeyValueList, type KeyValueItem } from '../src/components/KeyValueList';

const items: KeyValueItem[] = [
  { id: 'host', label: 'Hostname', value: 'edge-01', mono: true, copyable: 'edge-01.internal' },
  { id: 'health', label: 'Health', value: 'Healthy', tone: 'ok', hint: 'probe 12s ago' },
  { id: 'region', label: 'Region', value: 'eu-west' },
];

const originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

function mockClipboard(writeText: (s: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
}

afterEach(() => {
  vi.useRealTimers();
  if (originalClipboard) Object.defineProperty(navigator, 'clipboard', originalClipboard);
  else delete (navigator as unknown as Record<string, unknown>).clipboard;
});

describe('KeyValueList', () => {
  it('renders a dl with div rows wrapping dt/dd', () => {
    const { container } = render(<KeyValueList items={items} />);
    const dl = container.querySelector('dl')!;
    expect(dl).toBeTruthy();
    const rows = dl.querySelectorAll(':scope > div[data-kvrow]');
    expect(rows).toHaveLength(3);
    rows.forEach((row) => {
      expect(row.querySelector(':scope > dt')).toBeTruthy();
      expect(row.querySelector(':scope > dd')).toBeTruthy();
    });
    expect(rows[0].querySelector('dt')!.textContent).toBe('Hostname');
    expect(rows[1].querySelector('dd')!.textContent).toContain('Healthy');
    expect(rows[1].querySelector('dd')!.textContent).toContain('probe 12s ago');
  });

  it('defaults to the inline layout with dividers and supports stacked/grid', () => {
    const { container, rerender } = render(<KeyValueList items={items} />);
    const root = container.querySelector('[data-kvlist]') as HTMLElement;
    expect(root.getAttribute('data-layout')).toBe('inline');
    expect(root.hasAttribute('data-dividers')).toBe(true);

    rerender(<KeyValueList items={items} layout="stacked" />);
    expect(root.getAttribute('data-layout')).toBe('stacked');
    expect(root.hasAttribute('data-dividers')).toBe(false);

    rerender(<KeyValueList items={items} layout="grid" columns={4} dense dividers />);
    expect(root.getAttribute('data-layout')).toBe('grid');
    expect(root.style.getPropertyValue('--kv-cols')).toBe('4');
    expect(root.hasAttribute('data-dense')).toBe(true);
    expect(root.hasAttribute('data-dividers')).toBe(true);
  });

  it('normalizes tone onto the row hook and marks mono values', () => {
    const { container } = render(<KeyValueList items={items} />);
    const rows = container.querySelectorAll('[data-kvrow]');
    expect(rows[0].hasAttribute('data-tone')).toBe(false);
    expect(rows[1].getAttribute('data-tone')).toBe('success');
    expect(rows[0].querySelector('[data-mono]')).toBeTruthy();
    expect(rows[2].querySelector('[data-mono]')).toBeNull();
  });

  it('uses label as a visible caption and accessible name', () => {
    const { rerender } = render(<KeyValueList items={items} label="Server details" />);
    const dl = document.querySelector('dl')!;
    const captionId = dl.getAttribute('aria-labelledby')!;
    expect(document.getElementById(captionId)!.textContent).toBe('Server details');

    rerender(<KeyValueList items={items} label="Server details" hideLabel />);
    const dl2 = document.querySelector('dl')!;
    expect(dl2.getAttribute('aria-label')).toBe('Server details');
    expect(document.querySelector('.kvlist-caption')).toBeNull();
  });

  it('copies the copyable string and shows a transient Copied state', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn(() => Promise.resolve());
    mockClipboard(writeText);
    render(<KeyValueList items={items} />);
    const btn = screen.getByRole('button', { name: 'Copy Hostname' });
    await act(async () => {
      fireEvent.click(btn);
    });
    expect(writeText).toHaveBeenCalledWith('edge-01.internal');
    expect(btn.hasAttribute('data-copied')).toBe(true);
    expect(btn.textContent).toContain('Copied');
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(btn.hasAttribute('data-copied')).toBe(false);
  });

  it('does not throw when navigator.clipboard is unavailable', () => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
    render(<KeyValueList items={items} />);
    const btn = screen.getByRole('button', { name: 'Copy Hostname' });
    expect(() => fireEvent.click(btn)).not.toThrow();
    expect(btn.hasAttribute('data-copied')).toBe(false);
  });

  it('only renders copy buttons for copyable rows', () => {
    render(<KeyValueList items={items} />);
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('renders the empty state instead of a dl', () => {
    const { container, rerender } = render(<KeyValueList items={[]} />);
    expect(container.querySelector('dl')).toBeNull();
    expect(container.querySelector('[data-kvempty]')!.textContent).toBe('Nothing to show.');
    rerender(<KeyValueList items={[]} empty="No metadata." className="extra" />);
    expect(container.querySelector('[data-kvempty]')!.textContent).toBe('No metadata.');
    expect(container.querySelector('[data-kvlist]')!.classList.contains('extra')).toBe(true);
  });
});
