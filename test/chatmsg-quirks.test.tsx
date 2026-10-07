import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessageTimeline, type TimelineMessage } from '../src/components/MessageTimeline';
import { ConversationList } from '../src/components/ConversationList';
import { filterConversationGroups, type ConversationGroup } from '../src/components/chatmsg.shared';

const DAY = 864e5;
const T0 = Date.UTC(2026, 2, 12, 10, 30);
const msg = (id: string, over: Partial<TimelineMessage> = {}): TimelineMessage => ({ id, senderId: 'u1', senderName: 'Ada', mine: false, ts: T0, kind: 'text', text: 'hi ' + id, preview: 'hi', sendState: 'sent', ...over });

describe('MessageTimeline quirks', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renderBody is passed through to every MessageTile', () => {
    const { container } = render(<MessageTimeline label="L" now={T0} messages={[msg('a'), msg('b', { senderId: 'u2' })]}
      renderBody={m => (m.id === 'b' ? <span data-testid="custom">tool call</span> : null)} />);
    expect(screen.getByTestId('custom').textContent).toBe('tool call');
    expect(container.querySelector('.tile-custom[data-eventid="b"]')).toBeTruthy();
    expect(container.textContent).toContain('hi a');
  });

  it('renderMessage can wrap or replace a row and receives the default tile', () => {
    const { container } = render(<MessageTimeline label="L" now={T0} messages={[msg('a'), msg('b', { senderId: 'u2' })]}
      renderMessage={(m, tile) => (m.id === 'b' ? <div data-testid="replaced">answer</div> : <div data-testid="wrap">{tile}</div>)} />);
    const log = container.querySelector('[role="log"]')!;
    expect(log.querySelector('[data-testid="replaced"]')?.textContent).toBe('answer');
    expect(log.querySelector('[data-testid="wrap"] [data-eventid="a"]')).toBeTruthy();
    expect(log.querySelector('[data-eventid="b"]')).toBeNull();
  });

  it('day labels use the now prop instead of the clock', () => {
    const spy = vi.spyOn(Date, 'now');
    render(<MessageTimeline label="L" now={T0 + DAY} messages={[msg('a')]} />);
    expect(screen.getByText('Yesterday')).toBeTruthy();
    expect(spy).not.toHaveBeenCalled();
  });

  it('without now, reads the clock once on mount, not on every render', () => {
    const spy = vi.spyOn(Date, 'now').mockReturnValue(T0);
    const { rerender } = render(<MessageTimeline label="L" messages={[msg('a')]} />);
    const calls = spy.mock.calls.length;
    expect(screen.getByText('Today')).toBeTruthy();
    spy.mockReturnValue(T0 + DAY);
    rerender(<MessageTimeline label="L" messages={[msg('a'), msg('b')]} />);
    expect(spy.mock.calls.length).toBe(calls);
    expect(screen.getByText('Today')).toBeTruthy();
  });
});

const groups: ConversationGroup[] = [
  { id: 'g1', label: 'Agents', conversations: [{ id: 'a', name: 'Research' }, { id: 'b', name: 'Ops', alias: 'Pager duty' }] },
  { id: 'g2', label: 'People', collectionId: 'col', conversations: [{ id: 'c', name: 'Grace' }] },
];

describe('ConversationList filter', () => {
  it('filterConversationGroups matches name and alias case-insensitively and drops empty groups', () => {
    expect(filterConversationGroups(groups, '')).toBe(groups);
    expect(filterConversationGroups(groups, '  PAGER ').map(g => g.conversations.map(c => c.id))).toEqual([['b']]);
    expect(filterConversationGroups(groups, 'r').map(g => g.id)).toEqual(['g1', 'g2']);
  });

  it('narrows rows to matches and hides groups with none', () => {
    const { container } = render(<ConversationList groups={groups} filter="rese" onFilterChange={() => {}} onSelect={() => {}} />);
    expect(screen.getAllByRole('group').map(g => g.getAttribute('aria-label'))).toEqual(['Agents']);
    expect(container.querySelectorAll('[data-threadrow]').length).toBe(1);
    expect(container.textContent).toContain('Research');
  });

  it('shows the no-match empty state when nothing matches', () => {
    render(<ConversationList groups={groups} filter="zzz" onFilterChange={() => {}} onSelect={() => {}} />);
    expect(screen.queryAllByRole('group').length).toBe(0);
    expect(screen.getByText('No conversations match')).toBeTruthy();
  });

  it('filterLocally={false} leaves filtering to the host', () => {
    const { container } = render(<ConversationList groups={groups} filter="zzz" filterLocally={false} onFilterChange={() => {}} onSelect={() => {}} />);
    expect(container.querySelectorAll('[data-threadrow]').length).toBe(3);
  });
});
