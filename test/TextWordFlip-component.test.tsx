import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TextWordFlip } from '../src/components/TextWordFlip';

describe('TextWordFlip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders words and switches them over time', () => {
    const words = ['Fast', 'Secure', 'Reliable'];
    render(<TextWordFlip words={words} interval={1000} />);
    
    // Check initial state
    const firstWord = screen.getByText('Fast', { selector: '.text-word-flip-word' });
    expect(firstWord.classList.contains('is-entering')).toBe(true);

    const secondWord = screen.getByText('Secure', { selector: '.text-word-flip-word' });
    expect(secondWord.classList.contains('is-hidden')).toBe(true);

    // Advance timer
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Check state after one interval
    expect(firstWord.classList.contains('is-leaving')).toBe(true);
    expect(secondWord.classList.contains('is-entering')).toBe(true);
  });

  it('handles empty words array gracefully', () => {
    const { container } = render(<TextWordFlip words={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('handles single word without timer', () => {
    render(<TextWordFlip words={['Only']} />);
    const word = screen.getByText('Only', { selector: '.text-word-flip-word' });
    expect(word.classList.contains('is-entering')).toBe(true);

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    // Shouldn't change
    expect(word.classList.contains('is-entering')).toBe(true);
  });
});
