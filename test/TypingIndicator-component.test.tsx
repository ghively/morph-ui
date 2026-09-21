import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TypingIndicator } from '../src/components/TypingIndicator';

describe('TypingIndicator', () => {
  test('empty state', () => {
    const { container } = render(<TypingIndicator participants={[]} />);
    const wrap = container.querySelector('[data-collapse]');
    expect(wrap).toBeTruthy();
    expect(wrap?.getAttribute('data-open')).toBe('false');
    expect(container.querySelector('[data-typingrow]')).toBeNull();
  });

  test('one non-agent participant', () => {
    const { container } = render(<TypingIndicator participants={[{ id: '1', name: 'Alice' }]} />);
    expect(container.querySelector('[data-collapse]')?.getAttribute('data-open')).toBe('true');
    expect(container.querySelector('[data-typingrow]')).toBeTruthy();
    
    const dots = container.querySelectorAll('[data-typing] i');
    expect(dots.length).toBe(3);
    
    expect(container.textContent).toContain('Alice is typing');
    
    const avatar = container.querySelector('[data-ring]');
    expect(avatar).toBeTruthy();
  });

  test('one agent participant', () => {
    const { container } = render(<TypingIndicator participants={[{ id: '2', name: 'Bot', isAgent: true }]} />);
    expect(container.textContent).toContain('Bot is working');
  });

  test('multiple participants', () => {
    const { container } = render(<TypingIndicator participants={[
      { id: '1', name: 'Alice' },
      { id: '2', name: 'Bob' }
    ]} />);
    expect(container.textContent).toContain('Alice, Bob are typing');
  });
});
