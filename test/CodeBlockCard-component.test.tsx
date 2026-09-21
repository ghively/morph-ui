import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import { CodeBlockCard } from '../src/components/CodeBlockCard';

describe('CodeBlockCard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  test('renders basic code block', () => {
    const { container } = render(<CodeBlockCard code="console.log(1);" />);
    const root = container.querySelector('[data-code]');
    expect(root).toBeTruthy();
    
    const head = container.querySelector('[data-codehead]');
    expect(head).toBeTruthy();
    
    const num = head?.querySelector('[data-num]');
    expect(num?.textContent).toBe('text');
    
    const pre = container.querySelector('pre');
    expect(pre?.textContent).toBe('console.log(1);');
    // Code should be text child, no tags injected inside pre
    expect(pre?.innerHTML).toBe('console.log(1);');
  });

  test('headLabel overrides language', () => {
    const { container } = render(<CodeBlockCard code="1" language="js" headLabel="javascript" />);
    const num = container.querySelector('[data-num]');
    expect(num?.textContent).toBe('javascript');
  });

  test('copy button and feedback', () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
    
    const onCopy = vi.fn();
    const { container } = render(<CodeBlockCard code="x" copyFeedbackMs={1400} onCopy={onCopy} copyAriaLabel="Copy me" />);
    
    const copyBtn = container.querySelector('button');
    expect(copyBtn?.getAttribute('aria-label')).toBe('Copy me');
    expect(copyBtn?.textContent).toBe('Copy');
    
    if (copyBtn) fireEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('x');
    expect(onCopy).toHaveBeenCalledWith('x');
    expect(copyBtn?.textContent).toBe('Copied');
    
    act(() => {
      vi.advanceTimersByTime(1400);
    });
    
    expect(copyBtn?.textContent).toBe('Copy');
  });

  test('headEnd renders correctly', () => {
    const { container } = render(<CodeBlockCard code="x" headEnd={<span data-custom>custom</span>} />);
    expect(container.querySelector('[data-custom]')).toBeTruthy();
  });
});
