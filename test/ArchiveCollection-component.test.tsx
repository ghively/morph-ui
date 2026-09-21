import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ArchiveCollection } from '../src/components/ArchiveCollection';

describe('ArchiveCollection', () => {
  const entries = [
    {
      id: '1',
      date: '2026-09-15T10:00:00Z',
      title: 'First Entry',
      summary: 'This is the first summary',
      tags: ['alpha', 'beta']
    },
    {
      id: '2',
      date: '2026-09-16T12:00:00Z',
      title: 'Second Entry',
      summary: 'Another summary here',
      tags: ['gamma']
    },
    {
      id: '3',
      date: '2026-10-01T08:00:00Z',
      title: 'October Entry',
      summary: 'This is an entry in October',
      tags: ['beta']
    }
  ];

  it('renders entries grouped by month with group headers', () => {
    render(<ArchiveCollection entries={entries} />);
    
    // Should have 2 month headers (September 2026, October 2026)
    const headers = document.querySelectorAll('[data-archive-group-header]');
    expect(headers.length).toBe(2);
    expect(headers[0].textContent).toContain('September 2026');
    expect(headers[1].textContent).toContain('October 2026');

    // Should have 3 entries
    expect(screen.getByText('First Entry')).toBeTruthy();
    expect(screen.getByText('Second Entry')).toBeTruthy();
    expect(screen.getByText('October Entry')).toBeTruthy();
  });

  it('filter prop narrows rendered rows (match on title and tag)', () => {
    const { rerender } = render(<ArchiveCollection entries={entries} filter="second" />);
    
    // Match on title
    expect(screen.queryByText('First Entry')).toBeNull();
    expect(screen.getByText('Second Entry')).toBeTruthy();
    expect(screen.queryByText('October Entry')).toBeNull();

    // Match on tag 'beta' (entries 1 and 3)
    rerender(<ArchiveCollection entries={entries} filter="beta" />);
    expect(screen.getByText('First Entry')).toBeTruthy();
    expect(screen.queryByText('Second Entry')).toBeNull();
    expect(screen.getByText('October Entry')).toBeTruthy();
  });

  it('empty-after-filter shows emptyMessage', () => {
    render(<ArchiveCollection entries={entries} filter="xyz123" emptyMessage="Nothing found" />);
    
    expect(screen.queryByText('First Entry')).toBeNull();
    expect(screen.getByText('Nothing found')).toBeTruthy();
  });

  it('row click + Enter both fire onSelectEntry with the entry id', () => {
    const onSelectEntry = vi.fn();
    render(<ArchiveCollection entries={entries} onSelectEntry={onSelectEntry} />);
    
    const row1 = screen.getByTestId('archive-entry-1');
    fireEvent.click(row1);
    expect(onSelectEntry).toHaveBeenCalledWith('1');

    const row2 = screen.getByTestId('archive-entry-2');
    fireEvent.keyDown(row2, { key: 'Enter', code: 'Enter' });
    expect(onSelectEntry).toHaveBeenCalledWith('2');
    
    fireEvent.keyDown(row2, { key: ' ', code: 'Space' });
    expect(onSelectEntry).toHaveBeenCalledWith('2');
  });

  it('tags render as chips', () => {
    render(<ArchiveCollection entries={entries} />);
    
    expect(screen.getByText('alpha')).toBeTruthy();
    expect(screen.getAllByText('beta').length).toBe(2);
    expect(screen.getByText('gamma')).toBeTruthy();
    
    const tagEl = screen.getByText('alpha');
    expect(tagEl.hasAttribute('data-archive-entry-tag')).toBeTruthy();
  });
});
