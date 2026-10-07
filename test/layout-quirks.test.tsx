import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';

import { Tabs } from '../src/components/Tabs';
import { Pagination } from '../src/components/Pagination';

const TABS = [
  { id: 'a', label: 'A' },
  { id: 'b', label: 'B', disabled: true },
  { id: 'c', label: 'C' },
  { id: 'd', label: 'D' },
];

function Controlled({ orientation }: { orientation?: 'horizontal' | 'vertical' }) {
  const [active, setActive] = useState('a');
  return <Tabs tabs={TABS} activeId={active} onTabChange={setActive} orientation={orientation}><p>panel {active}</p></Tabs>;
}

const tab = (name: string) => screen.getByRole('tab', { name });

describe('Tabs orientation', () => {
  it('defaults to horizontal and sets aria-orientation on the tablist', () => {
    const { container } = render(<Controlled />);
    expect(screen.getByRole('tablist').getAttribute('aria-orientation')).toBe('horizontal');
    expect(container.querySelector('[data-tabs]')?.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('horizontal tabs move with Left/Right and ignore Up/Down', () => {
    render(<Controlled />);
    fireEvent.keyDown(tab('A'), { key: 'ArrowRight' });
    expect(tab('C').getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(tab('C'));
    fireEvent.keyDown(tab('C'), { key: 'ArrowDown' });
    expect(tab('C').getAttribute('aria-selected')).toBe('true');
    fireEvent.keyDown(tab('C'), { key: 'ArrowLeft' });
    expect(tab('A').getAttribute('aria-selected')).toBe('true');
  });

  it('vertical tabs set aria-orientation and move with Up/Down, not Left/Right', () => {
    const { container } = render(<Controlled orientation="vertical" />);
    expect(screen.getByRole('tablist').getAttribute('aria-orientation')).toBe('vertical');
    expect(container.querySelector('[data-tabs]')?.getAttribute('data-orientation')).toBe('vertical');
    fireEvent.keyDown(tab('A'), { key: 'ArrowRight' });
    expect(tab('A').getAttribute('aria-selected')).toBe('true');
    fireEvent.keyDown(tab('A'), { key: 'ArrowDown' });
    expect(tab('C').getAttribute('aria-selected')).toBe('true');
    fireEvent.keyDown(tab('C'), { key: 'ArrowUp' });
    expect(tab('A').getAttribute('aria-selected')).toBe('true');
    fireEvent.keyDown(tab('A'), { key: 'ArrowUp' });
    expect(tab('D').getAttribute('aria-selected')).toBe('true');
  });

  it('Home/End select and focus the first/last enabled tab in both orientations', () => {
    for (const orientation of ['horizontal', 'vertical'] as const) {
      const { unmount } = render(<Controlled orientation={orientation} />);
      fireEvent.keyDown(tab('A'), { key: 'End' });
      expect(tab('D').getAttribute('aria-selected')).toBe('true');
      expect(document.activeElement).toBe(tab('D'));
      fireEvent.keyDown(tab('D'), { key: 'Home' });
      expect(tab('A').getAttribute('aria-selected')).toBe('true');
      expect(document.activeElement).toBe(tab('A'));
      unmount();
    }
  });
});

describe('Pagination showSinglePage', () => {
  it('renders nothing for a single page by default', () => {
    const { container } = render(<Pagination page={1} totalPages={1} onPageChange={vi.fn()} />);
    expect(container.querySelector('[data-pagination]')).toBeNull();
  });

  it('renders a disabled pager for a single page when showSinglePage is set', () => {
    const onPageChange = vi.fn();
    render(<Pagination page={1} totalPages={1} onPageChange={onPageChange} showSinglePage label="Results" />);
    const nav = screen.getByRole('navigation', { name: 'Results' });
    expect(nav).toBeTruthy();
    expect((screen.getByLabelText('Previous page') as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByLabelText('Next page') as HTMLButtonElement).disabled).toBe(true);
    const current = screen.getByLabelText('Page 1');
    expect(current.getAttribute('aria-current')).toBe('page');
    fireEvent.click(current);
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('treats zero pages as one page when showSinglePage is set', () => {
    const { container } = render(<Pagination page={1} totalPages={0} onPageChange={vi.fn()} showSinglePage />);
    expect(container.querySelectorAll('button[aria-label^="Page "]').length).toBe(1);
  });
});
