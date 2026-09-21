import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import { MessageContent } from '../src/components/MessageContent';

describe('MessageContent', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  test('deleted', () => {
    const { container } = render(<MessageContent kind="deleted" />);
    const el = container.querySelector('[data-redacted]');
    expect(el?.textContent).toBe('Message deleted');
  });

  test('undecryptable', () => {
    const { container } = render(<MessageContent kind="undecryptable" undecryptableReason="OLM_UNKNOWN_MESSAGE_INDEX" />);
    const el = container.querySelector('[data-undecryptable]');
    expect(el?.getAttribute('role')).toBe('note');
    expect(el?.textContent).toContain('(olm unknown message index)');
  });

  test('decrypting', () => {
    const { container } = render(<MessageContent kind="decrypting" />);
    expect(container.textContent).toBe('Decrypting…');
  });

  test('prose text escaping and linkifying', () => {
    const text = 'see https://example.com/a. ok <script>x</script>';
    const { container } = render(<MessageContent kind="text" text={text} />);
    
    // No script element injected
    expect(container.querySelector('script')).toBeNull();
    // Literal text present
    expect(container.textContent).toContain('<script>x</script>');
    
    const a = container.querySelector('a');
    expect(a).toBeTruthy();
    expect(a?.getAttribute('href')).toBe('https://example.com/a');
    expect(a?.getAttribute('target')).toBe('_blank');
    expect(a?.getAttribute('rel')).toBe('noopener noreferrer nofollow');
  });

  test('prose html untrusted', () => {
    const { container } = render(<MessageContent kind="text" html="<b>bold</b>" htmlIsTrusted={false} text="fallback" />);
    expect(container.querySelector('b')).toBeNull();
    expect(container.textContent).toContain('fallback');
  });

  test('prose html trusted', () => {
    const { container } = render(<MessageContent kind="text" html="<b>bold</b>" htmlIsTrusted={true} />);
    expect(container.querySelector('b')).toBeTruthy();
  });

  test('mention pill click', () => {
    const html = '<a data-pill href="#/u/@a:b">a</a>';
    const onMentionSelect = vi.fn();
    const { container, unmount } = render(
      <MessageContent kind="text" html={html} htmlIsTrusted={true} onMentionSelect={onMentionSelect} />
    );
    
    const a = container.querySelector('a');
    let defaultPrevented = false;
    if (a) {
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      a.dispatchEvent(clickEvent);
      defaultPrevented = clickEvent.defaultPrevented;
    }
    expect(onMentionSelect).toHaveBeenCalledWith('@a:b');
    expect(defaultPrevented).toBe(true);

    unmount();
    // After unmount it shouldn't be handled (if we could trigger it realistically)
  });

  test('code block enhancement', () => {
    const html = '<pre><code data-lang="ts">x</code></pre>';
    const onCopyCode = vi.fn();
    
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });

    const { container, rerender } = render(
      <MessageContent kind="text" html={html} htmlIsTrusted={true} onCopyCode={onCopyCode} />
    );

    const codeWrappers = container.querySelectorAll('[data-code]');
    expect(codeWrappers.length).toBe(1);

    const num = codeWrappers[0]?.querySelector('[data-num]');
    expect(num?.textContent).toBe('ts');

    const copyBtn = codeWrappers[0]?.querySelector('button');
    expect(copyBtn?.textContent).toBe('Copy');

    if (copyBtn) fireEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('x');
    expect(copyBtn?.textContent).toBe('Copied');
    
    act(() => {
      vi.advanceTimersByTime(1400);
    });
    expect(copyBtn?.textContent).toBe('Copy');

    // Rerender same html to check idempotence
    rerender(<MessageContent kind="text" html={html} htmlIsTrusted={true} onCopyCode={onCopyCode} />);
    expect(container.querySelectorAll('[data-code]').length).toBe(1);
  });

  test('image', () => {
    const att = { url: null, error: 'boom', name: 'img' };
    const { container, rerender } = render(<MessageContent kind="image" attachment={att} />);
    expect(container.textContent).toContain('boom');
    
    rerender(<MessageContent kind="image" attachment={{ url: 'foo.png', name: 'img' }} />);
    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('foo.png');
  });

  test('file and downloadable', () => {
    const onDownload = vi.fn();
    const att = { name: 'f.txt', size: 2048, downloadable: true, url: '' };
    const { container } = render(<MessageContent kind="file" attachment={att} onDownload={onDownload} />);
    
    expect(container.textContent).toContain('2 KB');
    const btn = container.querySelectorAll('button');
    expect(btn.length).toBe(2);
    
    fireEvent.click(btn[1]!);
    expect(onDownload).toHaveBeenCalled();
  });

  test('audio with url', () => {
    const att = { name: 'a.mp3', url: 'a.mp3' };
    const { container } = render(<MessageContent kind="audio" attachment={att} />);
    const audio = container.querySelector('audio');
    expect(audio?.getAttribute('preload')).toBe('metadata');
  });
});
