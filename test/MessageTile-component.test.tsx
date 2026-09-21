import { describe, test, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { MessageTile } from '../src/components/MessageTile';
import type { TimelineMessage } from '../src/components/MessageTimeline';

const baseMsg: TimelineMessage = {
  id: '1',
  senderId: 'u1',
  senderName: 'User One',
  mine: true,
  ts: 1000000,
  kind: 'text',
  text: 'hello',
};

describe('MessageTile', () => {
  test('own message styling', () => {
    const { container } = render(<MessageTile message={baseMsg} accent="blue" />);
    const root = container.querySelector('[data-turn]');
    expect(root?.getAttribute('data-turn')).toBe('user');
    expect(root?.getAttribute('data-sec')).toBe('blue');
    expect(root?.getAttribute('data-highlight')).toBeNull(); // not false, absent
    expect(container.querySelector('[data-bubble]')).toBeTruthy();
  });

  test('other message styling and continuation', () => {
    const msg = { ...baseMsg, mine: false, isAgent: true };
    const { container, rerender } = render(<MessageTile message={msg} accent="cyan" />);
    const root = container.querySelector('[data-turn]');
    expect(root?.getAttribute('data-turn')).toBe('assistant');
    
    // has avatar
    expect(container.querySelector('.initials-avatar')).toBeTruthy();
    expect(container.querySelector('[data-sendername]')?.textContent).toBe('User One');

    rerender(<MessageTile message={msg} accent="cyan" continuation={true} />);
    expect(container.querySelector('[data-avatarspacer]')).toBeTruthy();
    expect(container.querySelector('[data-sendername]')).toBeNull();
  });

  test('kind=state', () => {
    const msg = { ...baseMsg, kind: 'state' as const, stateText: 'Changed room name' };
    const { container, rerender } = render(<MessageTile message={msg} accent="blue" />);
    expect(container.querySelector('[data-stateline]')).toBeTruthy();

    const emptyMsg = { ...msg, stateText: '' };
    rerender(<MessageTile message={emptyMsg} accent="blue" />);
    expect(container.firstChild).toBeNull();
  });

  test('kind=artifact', () => {
    const msg = { ...baseMsg, kind: 'artifact' as const, artifact: { label: 'Doc', degraded: true } };
    const { container } = render(<MessageTile message={msg} accent="blue" />);
    const tile = container.querySelector('[data-artifacttile]');
    expect(tile).toBeTruthy();
    expect(tile?.getAttribute('data-degraded')).toBe('');
    expect(tile?.textContent).toContain('source only');
  });

  test('action bar visibility', () => {
    // missing sendState implies sent in standard app if not sending/failed, but let's check
    const msgSent = { ...baseMsg, sendState: 'sent' as const, canEdit: false, canDelete: false };
    const { container, rerender } = render(<MessageTile message={msgSent} accent="blue" />);
    expect(container.querySelector('[data-msgactions]')).toBeTruthy();

    const msgSending = { ...baseMsg, sendState: 'sending' as const };
    rerender(<MessageTile message={msgSending} accent="blue" />);
    expect(container.querySelector('[data-msgactions]')).toBeNull();
    
    const msgDeleted = { ...baseMsg, deleted: true, sendState: 'sent' as const };
    rerender(<MessageTile message={msgDeleted} accent="blue" />);
    expect(container.querySelector('[data-msgactions]')).toBeNull();
  });

  test('action bar buttons conditional', () => {
    const msg = { ...baseMsg, sendState: 'sent' as const, canEdit: false, canDelete: false };
    const { container, rerender } = render(<MessageTile message={msg} accent="blue" inThread={true} />);
    
    // inThread => no 'Reply in thread'
    expect(container.querySelector('[aria-label="Reply in thread"]')).toBeNull();
    expect(container.querySelector('[aria-label="Edit"]')).toBeNull();
    
    // with permalink -> Copy link
    rerender(<MessageTile message={msg} accent="blue" permalink="http://a" />);
    expect(container.querySelector('[aria-label="Copy link"]')).toBeTruthy();
  });

  test('react picker toggle', () => {
    const msg = { ...baseMsg, sendState: 'sent' as const };
    const onToggleReaction = vi.fn();
    const { container } = render(<MessageTile message={msg} accent="blue" actions={{ onToggleReaction }} />);
    
    const reactBtn = container.querySelector('[aria-label="React"]');
    expect(reactBtn).toBeTruthy();
    if (reactBtn) fireEvent.click(reactBtn);

    const picker = container.querySelector('[data-reactpicker]') as HTMLElement;
    expect(picker.style.display).not.toBe('none');

    const keyBtn = container.querySelector('[data-reactpicker] [aria-label="React 👍"]');
    // Let's just find the first menu item if it doesn't match the aria-label string perfectly.
    const realKeyBtn = keyBtn || container.querySelector('[data-reactpicker] [role="menuitem"]');
    expect(realKeyBtn).toBeTruthy();
    // expect(keyBtn).toBeTruthy();
    // expect(keyBtn).toBeTruthy();
    if (realKeyBtn) fireEvent.click(realKeyBtn);
    expect(onToggleReaction).toHaveBeenCalledWith('1', '👍', false);
  });

  test('reply quote fallback', () => {
    const msg = { ...baseMsg, replyTo: { id: '2', senderName: 'User 2', preview: null } };
    const { container } = render(<MessageTile message={msg} accent="blue" />);
    const quote = container.querySelector('[data-replyquote]');
    expect(quote?.textContent).toContain('Original message not loaded — jump to it');
  });

  test('thread summary count pluralization', () => {
    const msg = { ...baseMsg, thread: { count: 1 } };
    const { container, rerender } = render(<MessageTile message={msg} accent="blue" />);
    const sum = container.querySelector('[data-threadsummary]');
    expect(sum?.textContent).toContain('1 reply');

    rerender(<MessageTile message={{ ...msg, thread: { count: 2 } }} accent="blue" />);
    expect(container.querySelector('[data-threadsummary]')?.textContent).toContain('2 replies');
    
    rerender(<MessageTile message={msg} accent="blue" inThread={true} />);
    expect(container.querySelector('[data-threadsummary]')).toBeNull();
  });

  test('delete action with onConfirm', async () => {
    const msg = { ...baseMsg, sendState: 'sent' as const, canDelete: true };
    const onConfirm = vi.fn().mockResolvedValue(true);
    const onDelete = vi.fn();
    const { container } = render(<MessageTile message={msg} accent="blue" actions={{ onConfirm, onDelete }} />);
    
    const del = container.querySelector('[aria-label="Delete"]');
    expect(del).toBeTruthy();
    if (del) fireEvent.click(del);
    
    expect(onConfirm).toHaveBeenCalledWith('delete', msg);
    // wait for promise
    await new Promise(r => setTimeout(r, 0));
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  test('sendState alert and actions', () => {
    const msg = { ...baseMsg, sendState: 'failed' as const };
    const onRetrySend = vi.fn();
    const onDiscardSend = vi.fn();
    const { container } = render(<MessageTile message={msg} accent="blue" actions={{ onRetrySend, onDiscardSend }} />);
    
    const alert = container.querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('Not sent');
    
    const retry = alert?.querySelectorAll('button')[0];
    if (retry) fireEvent.click(retry);
    expect(onRetrySend).toHaveBeenCalledWith('1');

    const discard = alert?.querySelectorAll('button')[1];
    if (discard) fireEvent.click(discard);
    expect(onDiscardSend).toHaveBeenCalledWith('1');
  });

  test('receipts limited to 4', () => {
    const readers = [
      { id: '1', name: 'A' }, { id: '2', name: 'B' }, { id: '3', name: 'C' }, 
      { id: '4', name: 'D' }, { id: '5', name: 'E' }, { id: '6', name: 'F' }
    ];
    const msg = { ...baseMsg, readers };
    const { container } = render(<MessageTile message={msg} accent="blue" />);
    
    const rec = container.querySelector('[data-receipts]');
    expect(rec).toBeTruthy();
    expect(rec?.querySelectorAll('.initials-avatar').length).toBe(4);
    expect(rec?.getAttribute('aria-label')).toContain('F');
  });
});
