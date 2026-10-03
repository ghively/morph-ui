import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConversationList } from '../src/components/ConversationList';
import { MentionAutocomplete } from '../src/components/MentionAutocomplete';
import { MessageComposer } from '../src/components/MessageComposer';
import { MessageContent } from '../src/components/MessageContent';
import { MessageTile } from '../src/components/MessageTile';
import { MessageTimeline, type TimelineMessage } from '../src/components/MessageTimeline';
import { ReactionBar } from '../src/components/ReactionBar';
import { ThreadList } from '../src/components/ThreadList';
import { TypingIndicator } from '../src/components/TypingIndicator';
import { buildTimelineRows, typingLine, threadMeta, defaultThreadTime } from '../src/components/chatmsg.shared';

const T0 = new Date(2026, 9, 2, 12, 0).getTime();
const msg = (id: string, over: Partial<TimelineMessage> = {}): TimelineMessage => ({ id, senderId: 'u1', senderName: 'Ada', mine: false, ts: T0, kind: 'text', text: 'hi', preview: 'hi', sendState: 'sent', ...over });

describe('buildTimelineRows', () => {
  it('adds day separators, folds long state runs and marks continuations', () => {
    const rows = buildTimelineRows([
      msg('a'),
      msg('b', { ts: T0 + 1000 }),
      msg('s1', { kind: 'state', ts: T0 + 2000 }), msg('s2', { kind: 'state', ts: T0 + 3000 }), msg('s3', { kind: 'state', ts: T0 + 4000 }),
      msg('c', { ts: T0 + 864e5 }),
    ], 300000, 3, T0);
    expect(rows.map(r => r.type)).toEqual(['day', 'msg', 'msg', 'fold', 'day', 'msg']);
    expect(rows[1]).toMatchObject({ continuation: false });
    expect(rows[2]).toMatchObject({ continuation: true });
    expect(rows[3]).toMatchObject({ type: 'fold', run: expect.arrayContaining([expect.objectContaining({ id: 's2' })]) });
    expect(rows[0]).toMatchObject({ label: 'Today' });
  });
  it('leaves short state runs unfolded and never continues across them', () => {
    const rows = buildTimelineRows([msg('a'), msg('s', { kind: 'state', ts: T0 + 1 }), msg('b', { ts: T0 + 2 })], 300000, 3, T0);
    expect(rows.map(r => r.type)).toEqual(['day', 'msg', 'msg', 'msg']);
    expect(rows[3]).toMatchObject({ continuation: false });
  });
  it('renders a folded run inside <details> in the timeline', () => {
    const { container } = render(<MessageTimeline label="L" messages={[msg('s1', { kind: 'state', stateText: 'x' }), msg('s2', { kind: 'state', stateText: 'y' }), msg('s3', { kind: 'state', stateText: 'z' })]} />);
    expect(container.querySelector('[data-stategroup] summary')?.textContent).toBe('3 group changes');
    expect(container.querySelectorAll('[data-stategroup] [data-stateline]').length).toBe(3);
  });
});

describe('MessageTile', () => {
  it('sender name calls onShowSender', () => {
    const onShowSender = vi.fn();
    const { container } = render(<MessageTile message={msg('1')} accent="blue" actions={{ onShowSender }} />);
    fireEvent.click(container.querySelector('[data-sendername]')!);
    expect(onShowSender).toHaveBeenCalledWith('u1');
  });
  it('reaction picker is state-driven: opens, closes on Escape and after a pick', () => {
    const onToggleReaction = vi.fn();
    const { container } = render(<MessageTile message={msg('1')} accent="blue" actions={{ onToggleReaction }} quickReactions={['👍', '🎉']} />);
    const react = container.querySelector('[aria-label="React"]')!;
    expect(container.querySelector('[data-reactpicker]')).toBeNull();
    fireEvent.click(react);
    expect(react.getAttribute('aria-expanded')).toBe('true');
    const picker = container.querySelector('[data-reactpicker]')!;
    expect(document.activeElement?.getAttribute('aria-label')).toBe('React 👍');
    fireEvent.keyDown(picker, { key: 'ArrowRight' });
    expect(document.activeElement?.getAttribute('aria-label')).toBe('React 🎉');
    fireEvent.keyDown(picker, { key: 'Escape' });
    expect(container.querySelector('[data-reactpicker]')).toBeNull();
    expect(react.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(react);
    fireEvent.click(react);
    fireEvent.click([...container.querySelectorAll('[role="menuitem"]')].find(b => b.getAttribute('aria-label') === 'React 🎉')!);
    expect(onToggleReaction).toHaveBeenCalledWith('1', '🎉', false);
    expect(container.querySelector('[data-reactpicker]')).toBeNull();
  });
  it('delete waits for onConfirm', async () => {
    const onDelete = vi.fn();
    const { container } = render(<MessageTile message={msg('1', { canDelete: true })} accent="blue" actions={{ onDelete, onConfirm: () => Promise.resolve(false) }} />);
    fireEvent.click(container.querySelector('[aria-label="Delete"]')!);
    await Promise.resolve();
    expect(onDelete).not.toHaveBeenCalled();
  });
  it('renderBody short-circuits the default body', () => {
    render(<MessageTile message={msg('1')} accent="blue" renderBody={() => <em>custom</em>} />);
    expect(screen.getByText('custom').tagName).toBe('EM');
  });
});

describe('MessageContent', () => {
  it('pill clicks use the latest handler without rebuilding code chrome', () => {
    const first = vi.fn(), second = vi.fn();
    const html = '<a data-pill href="#/u/@a:b">a</a><pre><code>x</code></pre>';
    const { container, rerender } = render(<MessageContent kind="text" html={html} htmlIsTrusted onMentionSelect={first} />);
    rerender(<MessageContent kind="text" html={html} htmlIsTrusted onMentionSelect={second} />);
    fireEvent.click(container.querySelector('a[data-pill]')!);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith('@a:b');
    expect(container.querySelectorAll('[data-code]').length).toBe(1);
  });
  it('escapes and linkifies plain text', () => {
    const { container } = render(<MessageContent kind="text" text={'<b>x</b> https://e.x/a.\nnext'} />);
    expect(container.querySelector('b')).toBeNull();
    expect(container.querySelector('a')?.getAttribute('href')).toBe('https://e.x/a');
    expect(container.querySelector('br')).toBeTruthy();
  });
});

describe('MentionAutocomplete', () => {
  const candidates = [{ id: '@a', name: 'Ada', agentLabel: 'AI' }, { id: '@b', name: 'Bo' }];
  it('applies className and syncs the active option on hover', () => {
    const onActiveIndexChange = vi.fn();
    const { container } = render(<MentionAutocomplete trigger={{ start: 0, query: '' }} candidates={candidates} activeIndex={0} onActiveIndexChange={onActiveIndexChange} onPick={() => {}} className="host" />);
    expect(container.querySelector('[role="listbox"]')?.classList.contains('host')).toBe(true);
    fireEvent.mouseEnter(screen.getAllByRole('option')[1]!);
    expect(onActiveIndexChange).toHaveBeenCalledWith(1);
  });
});

describe('MessageComposer', () => {
  const base = { draft: { text: '', mentions: [] }, onDraftChange: () => {}, onSend: () => {}, placeholder: 'Write', autoFocus: false };
  it('Escape closes the mention list without cancelling the reply context', () => {
    const onCancel = vi.fn();
    const onDraftChange = vi.fn();
    const { container, getByRole } = render(<MessageComposer {...base} onDraftChange={onDraftChange} mentionCandidates={[{ id: '@a', name: 'Ada' }]} context={{ mode: 'reply', preview: 'p', onCancel }} />);
    const ta = getByRole('combobox') as HTMLTextAreaElement;
    fireEvent.change(ta, { target: { value: '@a' } });
    expect(container.querySelector('[role="listbox"]')).toBeTruthy();
    fireEvent.keyDown(ta, { key: 'Escape' });
    expect(container.querySelector('[role="listbox"]')).toBeNull();
    expect(onCancel).not.toHaveBeenCalled();
  });
  it('picks a mention with Enter and records it in the draft', () => {
    const onDraftChange = vi.fn();
    const onSend = vi.fn();
    const { getByRole, rerender } = render(<MessageComposer {...base} onDraftChange={onDraftChange} onSend={onSend} mentionCandidates={[{ id: '@a', name: 'Ada' }]} />);
    const ta = getByRole('combobox') as HTMLTextAreaElement;
    fireEvent.change(ta, { target: { value: 'hi @A' } });
    rerender(<MessageComposer {...base} draft={{ text: 'hi @A', mentions: [] }} onDraftChange={onDraftChange} onSend={onSend} mentionCandidates={[{ id: '@a', name: 'Ada' }]} />);
    ta.setSelectionRange(5, 5);
    fireEvent.keyDown(ta, { key: 'Enter' });
    expect(onSend).not.toHaveBeenCalled();
    expect(onDraftChange).toHaveBeenLastCalledWith({ text: 'hi @Ada ', mentions: [{ id: '@a', name: 'Ada' }] });
  });
  it('only shows the drop hint when attachments are accepted', () => {
    const { container, rerender } = render(<MessageComposer {...base} />);
    fireEvent.dragOver(container.firstChild as Element);
    expect(container.querySelector('.composer-drop')).toBeNull();
    rerender(<MessageComposer {...base} onAttach={() => {}} />);
    fireEvent.dragOver(container.firstChild as Element);
    expect(container.querySelector('.composer-drop')).toBeTruthy();
  });
});

describe('lists + small parts', () => {
  it('ThreadList meta joins replies, sender and the relative-time default', () => {
    expect(defaultThreadTime(undefined)).toBe('');
    expect(threadMeta({ id: 't', title: 'x', replyCount: 1, lastSenderName: 'Ada' }, () => '')).toBe('1 reply · Ada');
    const { container } = render(<ThreadList label="Threads" threads={[{ id: 't', title: '', replyCount: 3, lastTs: Date.now() }]} onSelect={() => {}} onSelectMain={() => {}} />);
    expect(container.querySelector('[data-threadlink] [data-threadmeta]')?.textContent).toBe('3 replies · just now');
  });
  it('ConversationList keeps className and marks mentions over unread', () => {
    const { container } = render(<ConversationList className="host" filter="" onFilterChange={() => {}} onSelect={() => {}} groups={[{ id: 'g', label: 'G', conversations: [{ id: 'c', name: 'c', unread: 4, highlight: 1 }] }]} />);
    expect(container.querySelector('nav')?.classList.contains('host')).toBe(true);
    expect(container.querySelector('[data-count]')?.textContent).toBe('@1');
    expect(container.querySelectorAll('[data-count]').length).toBe(1);
  });
  it('ReactionBar keeps className and can render empty', () => {
    const { container } = render(<ReactionBar className="host" reactions={[]} onToggle={() => {}} hideWhenEmpty={false} />);
    expect(container.querySelector('[data-reactions].host')).toBeTruthy();
  });
  it('typingLine picks the right verb', () => {
    expect(typingLine([], 'a', 'b', 'c')).toBe('');
    expect(typingLine([{ id: '1', name: 'Bot', isAgent: true }], 'is typing', 'is working', 'are typing')).toBe('Bot is working');
    expect(typingLine([{ id: '1', name: 'A' }, { id: '2', name: 'B' }], 'is typing', 'is working', 'are typing')).toBe('A, B are typing');
    const { container } = render(<TypingIndicator participants={[{ id: '1', name: 'Bot', isAgent: true, avatarUrl: 'x.png' }]} />);
    expect(container.querySelector('[data-typing][data-agent]')).toBeTruthy();
    expect(container.querySelector('[data-ring]')).toBeTruthy();
  });
});

describe('MessageContent kind flip', () => {
  it('wires pill clicks once a decrypting message becomes prose', () => {
    const onMentionSelect = vi.fn();
    const html = '<a data-pill href="#/u/@a:b">a</a>';
    const { container, rerender } = render(<MessageContent kind="decrypting" html={html} htmlIsTrusted onMentionSelect={onMentionSelect} />);
    rerender(<MessageContent kind="text" html={html} htmlIsTrusted onMentionSelect={onMentionSelect} />);
    fireEvent.click(container.querySelector('a[data-pill]')!);
    expect(onMentionSelect).toHaveBeenCalledWith('@a:b');
  });
});
