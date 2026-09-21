import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MentionAutocomplete, findMentionTrigger, applyMention, rankMentionCandidates } from '../src/components/MentionAutocomplete';

describe('MentionAutocomplete pure functions', () => {
  it('findMentionTrigger finds trigger', () => {
    expect(findMentionTrigger('hi @ab', 6)).toEqual({ start: 3, query: 'ab' });
    expect(findMentionTrigger('a@b', 3)).toBeNull();
    expect(findMentionTrigger('@', 1)).toEqual({ start: 0, query: '' });
  });

  it('findMentionTrigger rejects over 32 chars', () => {
    const longQuery = 'a'.repeat(40);
    expect(findMentionTrigger(`@${longQuery}`, 41)).toBeNull();
  });

  it('applyMention inserts correctly', () => {
    expect(applyMention('hi @ab', { start: 3, query: 'ab' }, 6, 'Ada')).toEqual({
      text: 'hi @Ada ',
      caret: 8,
    });
  });

  it('rankMentionCandidates filters and sorts', () => {
    const c1 = { id: '@a:e', name: 'Zebra' };
    const c2 = { id: '@b:e', name: 'Bot', agentLabel: 'Agent' };
    const c3 = { id: '@c:e', name: 'Alpha' };
    const c4 = { id: '@d:e', name: 'ZebraBot', agentLabel: 'Agent' };

    const ranked = rankMentionCandidates([c1, c2, c3, c4], '');
    // Agents first, then alpha
    expect(ranked[0].name).toBe('Bot');
    expect(ranked[1].name).toBe('ZebraBot');
    expect(ranked[2].name).toBe('Alpha');
    expect(ranked[3].name).toBe('Zebra');

    const filtered = rankMentionCandidates([c1, c2, c3, c4], 'zeb');
    expect(filtered.length).toBe(2);
    expect(filtered[0].name).toBe('ZebraBot');
    expect(filtered[1].name).toBe('Zebra');
  });
});

describe('MentionAutocomplete component', () => {
  const candidates = [
    { id: '@a:e', name: 'Alice' },
    { id: '@b:e', name: 'Bob' },
  ];

  it('renders null when trigger is null or candidates empty', () => {
    const { container, rerender } = render(
      <MentionAutocomplete trigger={null} candidates={candidates} activeIndex={0} onActiveIndexChange={() => {}} onPick={() => {}} />
    );
    expect(container.firstChild).toBeNull();

    rerender(
      <MentionAutocomplete trigger={{ start: 0, query: '' }} candidates={[]} activeIndex={0} onActiveIndexChange={() => {}} onPick={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders listbox with options and aria attributes', () => {
    render(
      <MentionAutocomplete trigger={{ start: 0, query: '' }} candidates={candidates} activeIndex={0} onActiveIndexChange={() => {}} onPick={() => {}} />
    );
    
    const listbox = screen.getByRole('listbox');
    expect(listbox.getAttribute('aria-label')).toBe('Mention someone');

    const options = screen.getAllByRole('option');
    expect(options.length).toBe(2);
    expect(options[0].getAttribute('aria-selected')).toBe('true');
    expect(options[1].getAttribute('aria-selected')).toBe('false');
    expect(options[0].id).toBe('mention-opt-0');
  });

  it('renders eyebrow when agent is present', () => {
    const { rerender, container } = render(
      <MentionAutocomplete trigger={{ start: 0, query: '' }} candidates={candidates} activeIndex={0} onActiveIndexChange={() => {}} onPick={() => {}} />
    );
    expect(container.querySelector('[data-mentioneyebrow]')).toBeNull();

    rerender(
      <MentionAutocomplete trigger={{ start: 0, query: '' }} candidates={[{...candidates[0], agentLabel: 'AI'}]} activeIndex={0} onActiveIndexChange={() => {}} onPick={() => {}} />
    );
    expect(container.querySelector('[data-mentioneyebrow]')).toBeTruthy();
  });

  it('calls onPick with preventDefault on mousedown', () => {
    const onPick = vi.fn();
    render(
      <MentionAutocomplete trigger={{ start: 0, query: '' }} candidates={candidates} activeIndex={0} onActiveIndexChange={() => {}} onPick={onPick} />
    );
    
    const option = screen.getAllByRole('option')[0];
    
    // click alone doesn't trigger onPick
    fireEvent.click(option);
    expect(onPick).not.toHaveBeenCalled();

    // mousedown triggers onPick and preventDefault
    const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() });
    fireEvent(option, event);
    
    expect(onPick).toHaveBeenCalledWith(candidates[0]);
    expect(event.preventDefault).toHaveBeenCalled();
  });
});
