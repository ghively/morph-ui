import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThreadList } from '../src/components/ThreadList';

describe('ThreadList', () => {
  it('main row is active when activeId is null', () => {
    const { container } = render(
      <ThreadList
        label="Threads"
        activeId={null}
        onSelect={() => {}}
        onSelectMain={() => {}}
        threads={[{ id: 't1', title: 'A', replyCount: 1 }]}
      />
    );
    
    const rows = container.querySelectorAll('[data-threadrow]');
    expect(rows[0].getAttribute('data-on')).toBe('true');
    expect(rows[0].querySelector('button')?.getAttribute('aria-current')).toBe('page');
    
    expect(rows[1].getAttribute('data-on')).toBe('false');
    expect(rows[1].querySelector('button')?.getAttribute('aria-current')).toBeNull();
  });

  it('thread row is active when its id matches activeId', () => {
    const { container } = render(
      <ThreadList
        label="Threads"
        activeId="t1"
        onSelect={() => {}}
        onSelectMain={() => {}}
        threads={[{ id: 't1', title: 'A', replyCount: 1 }]}
      />
    );
    
    const rows = container.querySelectorAll('[data-threadrow]');
    expect(rows[0].getAttribute('data-on')).toBe('false');
    
    expect(rows[1].getAttribute('data-on')).toBe('true');
    expect(rows[1].querySelector('button')?.getAttribute('aria-current')).toBe('page');
  });

  it('eyebrow reads correctly based on thread count', () => {
    const { getByText, rerender } = render(
      <ThreadList
        label="Threads"
        activeId={null}
        onSelect={() => {}}
        onSelectMain={() => {}}
        threads={[]}
      />
    );
    expect(getByText('0 threads')).toBeTruthy();

    rerender(
      <ThreadList
        label="Threads"
        activeId={null}
        onSelect={() => {}}
        onSelectMain={() => {}}
        threads={[{ id: 't1', title: 'A', replyCount: 1 }]}
      />
    );
    expect(getByText('1 thread')).toBeTruthy();

    rerender(
      <ThreadList
        label="Threads"
        activeId={null}
        onSelect={() => {}}
        onSelectMain={() => {}}
        threads={[{ id: 't1', title: 'A', replyCount: 1 }, { id: 't2', title: 'B', replyCount: 1 }]}
      />
    );
    expect(getByText('2 threads')).toBeTruthy();
  });

  it('title falls back to "Thread"', () => {
    const { getByTitle } = render(
      <ThreadList
        label="Threads"
        activeId={null}
        onSelect={() => {}}
        onSelectMain={() => {}}
        threads={[{ id: 't1', title: '', replyCount: 1 }]}
      />
    );
    expect(getByTitle('Thread')).toBeTruthy();
  });

  it('pluralizes replies', () => {
    const { getByText: _g } = render(
      <ThreadList
        label="Threads"
        activeId={null}
        onSelect={() => {}}
        onSelectMain={() => {}}
        threads={[
          { id: 't1', title: 'A', replyCount: 1 },
          { id: 't2', title: 'B', replyCount: 2 }
        ]}
      />
    );
    
    // We can search for the text content ignoring exact node bounds
    const metas = screen.getAllByText(/repl/);
    expect(metas[0].textContent).toContain('1 reply');
    expect(metas[1].textContent).toContain('2 replies');
  });

  it('badges render correctly (highlight > unread)', () => {
    const { container } = render(
      <ThreadList
        label="Threads"
        activeId={null}
        onSelect={() => {}}
        onSelectMain={() => {}}
        threads={[
          { id: 't1', title: 'A', replyCount: 1, highlight: 2, unread: 5 },
          { id: 't2', title: 'B', replyCount: 1, unread: 3 }
        ]}
      />
    );
    
    const highlight = container.querySelector('[data-count]');
    expect(highlight?.textContent).toBe('@2');
    
    const unreadDot = container.querySelector('[data-dot][data-live]');
    expect(unreadDot?.getAttribute('aria-label')).toBe('Unread replies');
    expect(unreadDot?.textContent).toBe(''); // it's a dot, no number
  });

  it('onPromote renders action and works', () => {
    const onPromote = vi.fn();
    const { container, rerender } = render(
      <ThreadList
        label="Threads"
        activeId={null}
        onSelect={() => {}}
        onSelectMain={() => {}}
        onPromote={onPromote}
        threads={[{ id: 't1', title: 'A', replyCount: 1 }]}
      />
    );
    
    const actBtn = container.querySelector('[data-threadacts] button') as HTMLButtonElement;
    expect(actBtn).toBeTruthy();
    
    fireEvent.click(actBtn);
    expect(onPromote).toHaveBeenCalledWith('t1');

    rerender(
      <ThreadList
        label="Threads"
        activeId={null}
        onSelect={() => {}}
        onSelectMain={() => {}}
        threads={[{ id: 't1', title: 'A', replyCount: 1 }]}
      />
    );
    expect(container.querySelector('[data-threadacts]')).toBeNull();
  });

  it('selection callbacks', () => {
    const onSelect = vi.fn();
    const onSelectMain = vi.fn();
    const { getByText, getByTitle } = render(
      <ThreadList
        label="Threads"
        activeId={null}
        onSelect={onSelect}
        onSelectMain={onSelectMain}
        threads={[{ id: 't1', title: 'A', replyCount: 1 }]}
      />
    );

    fireEvent.click(getByText('Main timeline'));
    expect(onSelectMain).toHaveBeenCalled();
    
    fireEvent.click(getByTitle('A'));
    expect(onSelect).toHaveBeenCalledWith('t1');
  });

  it('empty state', () => {
    const { container, getByText } = render(
      <ThreadList
        label="Threads"
        activeId={null}
        onSelect={() => {}}
        onSelectMain={() => {}}
        threads={[]}
      />
    );
    
    expect(getByText('Start a thread from any message — agents answer inside it.')).toBeTruthy();
    expect(container.querySelector('[data-threadlink]')).toBeNull();
  });
});
