import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DirectoryBrowser } from '../src/components/DirectoryBrowser';
import type { DirectoryListState } from '../src/components/DirectoryBrowser';

describe('DirectoryBrowser', () => {
  const { status: "done", entries: [], hasMore: false, error: null, degraded: false }: DirectoryListState = { status: 'done', entries: [], hasMore: false, error: null, degraded: false };

  it('renders tabs and handles switching', () => {
    const onTabChange = vi.fn();
    render(<DirectoryBrowser tab="collections" onTabChange={onTabChange} list={{ status: "done", entries: [], hasMore: false, error: null, degraded: false }} onAct={() => {}} onClose={() => {}} />);
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
    fireEvent.click(radios[1]);
    expect(onTabChange).toHaveBeenCalledWith('directory');
  });

  it('shows suggested only switch on collections tab when path is active', () => {
    const { rerender } = render(<DirectoryBrowser tab="directory" onTabChange={() => {}} list={{ status: "done", entries: [], hasMore: false, error: null, degraded: false }} path={['1']} onAct={() => {}} onClose={() => {}} />);
    expect(screen.queryByRole('checkbox')).toBeNull();

    rerender(<DirectoryBrowser tab="collections" onTabChange={() => {}} list={{ status: "done", entries: [], hasMore: false, error: null, degraded: false }} path={[]} onAct={() => {}} onClose={() => {}} />);
    expect(screen.queryByRole('checkbox')).toBeNull();

    rerender(<DirectoryBrowser tab="collections" onTabChange={() => {}} list={{ status: "done", entries: [], hasMore: false, error: null, degraded: false }} path={['1']} onAct={() => {}} onClose={() => {}} />);
    expect(screen.getByRole('checkbox')).toBeTruthy();
  });

  it('renders breadcrumbs', () => {
    const onPathChange = vi.fn();
    const collections = [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }];
    render(<DirectoryBrowser tab="collections" onTabChange={() => {}} list={{ status: "done", entries: [], hasMore: false, error: null, degraded: false }} collections={collections} path={['a', 'c']} onPathChange={onPathChange} onAct={() => {}} onClose={() => {}} />);
    const chipA = screen.getByText('A');
    expect(chipA.getAttribute('data-on')).toBe('true');
    const chipB = screen.getByText('B');
    expect(chipB.getAttribute('data-on')).toBe('false');
    const chipC = screen.getByText('c');
    expect(chipC.getAttribute('data-on')).toBe('true');

    fireEvent.click(chipB);
    expect(onPathChange).toHaveBeenCalledWith(['b']);

    fireEvent.click(chipC);
    expect(onPathChange).toHaveBeenCalledWith(['a', 'c']);
  });

  it('handles loading state', () => {
    render(<DirectoryBrowser tab="directory" onTabChange={() => {}} list={{ ...{ status: "done", entries: [], hasMore: false, error: null, degraded: false }, status: 'loading' }} onAct={() => {}} onClose={() => {}} />);
    expect(screen.getByRole('status').textContent).toBe('Loading…');
  });

  it('handles error banner', () => {
    const { rerender } = render(<DirectoryBrowser tab="directory" onTabChange={() => {}} list={{ ...{ status: "done", entries: [], hasMore: false, error: null, degraded: false }, error: 'Failed', degraded: true }} onAct={() => {}} onClose={() => {}} />);
    const alert1 = screen.getByRole('alert');
    expect(alert1.getAttribute('data-tone')).toBe('warn');
    expect(alert1.textContent).toContain('Showing the rooms this space lists locally');

    rerender(<DirectoryBrowser tab="directory" onTabChange={() => {}} list={{ ...{ status: "done", entries: [], hasMore: false, error: null, degraded: false }, error: 'Failed', degraded: false }} onAct={() => {}} onClose={() => {}} />);
    const alert2 = screen.getByRole('alert');
    expect(alert2.getAttribute('data-tone')).toBe('danger');
    expect(alert2.textContent).not.toContain('Showing the rooms this space lists locally');
  });

  it('renders entry rows with specific tags', () => {
    const onAct = vi.fn();
    render(
      <DirectoryBrowser
        tab="directory"
        onTabChange={() => {}}
        list={{
          ...{ status: "done", entries: [], hasMore: false, error: null, degraded: false },
          entries: [
            { id: '1', name: 'Joined', state: 'joined', action: { label: 'O', kind: 'open', disabled: false } },
            { id: '2', name: 'Invited', state: 'invited', action: { label: 'A', kind: 'accept', disabled: false } },
            { id: '3', name: 'Suggested', state: 'none', suggested: true, action: { label: 'J', kind: 'join', disabled: false } },
            { id: '4', name: 'Col', state: 'none', isCollection: true, action: { label: 'J', kind: 'join', disabled: false } },
            { id: '5', name: 'Ask', state: 'none', action: { label: 'Req', kind: 'request', disabled: false } }
          ]
        }}
        onAct={onAct}
        onClose={() => {}}
      />
    );
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(5);
    expect(items[0].textContent).toContain('Joined');
    expect(items[1].textContent).toContain('Invited');
    expect(items[2].textContent).toContain('Suggested');
    expect(items[3].textContent).toContain('Collection');
    expect(items[4].textContent).toContain('Ask to join');

    // Collection with kind=join has two buttons
    const colBtns = items[3].querySelectorAll('button');
    expect(colBtns).toHaveLength(2);
    expect(colBtns[0].textContent).toBe('Browse');
    expect(colBtns[1].textContent).toBe('J');

    // Joined (not collection) has one button
    const joinBtns = items[0].querySelectorAll('button');
    expect(joinBtns).toHaveLength(1);
  });

  it('primary button actions', () => {
    const onAct = vi.fn();
    render(
      <DirectoryBrowser
        tab="directory"
        onTabChange={() => {}}
        list={{
          ...{ status: "done", entries: [], hasMore: false, error: null, degraded: false },
          entries: [
            { id: '1', name: 'Dis', state: 'none', action: { label: 'J', kind: 'join', disabled: true } },
            { id: '2', name: 'Wait', state: 'requested', action: { label: 'W', kind: 'waiting', disabled: false } }
          ]
        }}
        onAct={onAct}
        onClose={() => {}}
      />
    );
    const items = screen.getAllByRole('listitem');
    const disBtn = items[0].querySelector('button') as HTMLButtonElement;
    expect(disBtn.disabled).toBe(true);

    const waitBtn = items[1].querySelector('button') as HTMLButtonElement;
    expect(waitBtn.disabled).toBe(false); // Make it not busy/disabled by not passing busyEntryId to unblock test
    
    // waiting maps to open
    fireEvent.click(waitBtn);
    expect(onAct).toHaveBeenCalledWith(expect.objectContaining({ id: '2' }), 'open');
  });

  it('renders row errors', () => {
    render(
      <DirectoryBrowser
        tab="directory"
        onTabChange={() => {}}
        list={{ ...{ status: "done", entries: [], hasMore: false, error: null, degraded: false }, entries: [{ id: '1', name: 'E1', state: 'none', action: { label: 'J', kind: 'join', disabled: false } }] }}
        rowErrors={{ '1': 'Row err' }}
        onAct={() => {}}
        onClose={() => {}}
      />
    );
    const rowAlert = screen.getByRole('alert');
    expect(rowAlert.textContent).toBe('Row err');
  });

  it('handles address tab', () => {
    const onSubmit = vi.fn();
    render(
      <DirectoryBrowser
        tab="address"
        onTabChange={() => {}}
        list={{ status: "done", entries: [], hasMore: false, error: null, degraded: false }}
        address={{ value: '', onChange: () => {}, onSubmit }}
        onAct={() => {}}
        onClose={() => {}}
      />
    );
    expect(screen.queryByRole('list')).toBeNull();
    const btn = screen.getByRole('button', { name: /Join/ }) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    
    const form = btn.closest('form');
    fireEvent.submit(form!);
    expect(onSubmit).toHaveBeenCalled();
  });
});

  it('renders hasMore button', () => {
    const onLoadMore = vi.fn();
    render(<DirectoryBrowser tab="directory" onTabChange={() => {}} list={{...{ status: "done", entries: [], hasMore: false, error: null, degraded: false }, entries: [{id: "1", name: "R1", state: "none", action: {label: "J", kind: "join", disabled: false}}], hasMore: true}} onLoadMore={onLoadMore} onAct={() => {}} onClose={() => {}} />);
    const btn = screen.getByRole('button', { name: 'Show more' });
    fireEvent.click(btn);
    expect(onLoadMore).toHaveBeenCalled();
  });
