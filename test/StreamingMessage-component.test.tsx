import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StreamingMessage } from '../src/components/StreamingMessage';

describe('StreamingMessage', () => {
  it('renders chunks incrementally', () => {
    const { rerender } = render(<StreamingMessage chunks={['Hello']} done={false} />);
    expect(screen.getByText('Hello')).toBeTruthy();
    
    // Caret should be present when not done
    expect(document.querySelector('[data-streaming-message-caret]')).toBeTruthy();

    rerender(<StreamingMessage chunks={['Hello', ' world!']} done={true} />);
    expect(screen.getByText('Hello world!')).toBeTruthy();
    
    // Caret should disappear when done
    expect(document.querySelector('[data-streaming-message-caret]')).toBeNull();
  });

  it('parses inline markdown (bold, italic, code)', () => {
    render(<StreamingMessage chunks={['**bold** *italic* `code`']} done={true} />);
    
    const boldEl = screen.getByText('bold');
    expect(boldEl.tagName.toLowerCase()).toBe('strong');

    const italicEl = screen.getByText('italic');
    expect(italicEl.tagName.toLowerCase()).toBe('em');

    const codeEl = screen.getByText('code');
    expect(codeEl.tagName.toLowerCase()).toBe('code');
  });

  it('parses code blocks', () => {
    const text = '```javascript\nconsole.log("hello");\n```';
    render(<StreamingMessage chunks={[text]} done={true} />);
    
    const preEl = document.querySelector('[data-streaming-message-codeblock]');
    expect(preEl).toBeTruthy();
    expect(screen.getByText('console.log("hello");')).toBeTruthy();
  });
});
