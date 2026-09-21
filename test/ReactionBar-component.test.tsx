import { describe, test, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ReactionBar } from '../src/components/ReactionBar';

describe('ReactionBar', () => {
  test('renders null when empty and hideWhenEmpty is true', () => {
    const { container } = render(<ReactionBar reactions={[]} onToggle={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders group when empty and hideWhenEmpty is false', () => {
    const { container } = render(<ReactionBar reactions={[]} onToggle={() => {}} hideWhenEmpty={false} />);
    const group = container.querySelector('[role="group"]');
    expect(group).toBeTruthy();
  });

  test('renders chips correctly', () => {
    const reactions = [
      { key: '👍', count: 2, mine: true, senders: ['Alice', 'Bob'] },
      { key: '👀', count: 1, mine: false, senders: ['Charlie'] },
    ];
    const { container } = render(<ReactionBar reactions={reactions} onToggle={() => {}} />);
    const chips = container.querySelectorAll('[data-chip]');
    expect(chips.length).toBe(2);

    expect(chips[0]?.getAttribute('data-on')).toBe('true');
    expect(chips[0]?.getAttribute('aria-pressed')).toBe('true');
    expect(chips[0]?.getAttribute('aria-label')).toBe('👍 2, including you');
    expect(chips[0]?.getAttribute('title')).toBe('Alice, Bob');
    expect(chips[0]?.querySelector('[data-num]')?.textContent).toBe('2');

    expect(chips[1]?.getAttribute('data-on')).toBe('false');
    expect(chips[1]?.getAttribute('aria-pressed')).toBe('false');
    expect(chips[1]?.getAttribute('aria-label')).toBe('👀 1');
    expect(chips[1]?.getAttribute('title')).toBe('Charlie');
    expect(chips[1]?.querySelector('[data-num]')?.textContent).toBe('1');
  });

  test('calls onToggle on click', () => {
    const reactions = [{ key: '👍', count: 1, mine: true, senders: ['Alice'] }];
    const onToggle = vi.fn();
    const { container } = render(<ReactionBar reactions={reactions} onToggle={onToggle} />);
    const chip = container.querySelector('[data-chip]');
    if (chip) fireEvent.click(chip);
    expect(onToggle).toHaveBeenCalledWith('👍', true);
  });
});
