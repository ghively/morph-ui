import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { TerminalEmulator, type TerminalEmulatorRef } from '../src/components/TerminalEmulator';
import { createRef } from 'react';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe('TerminalEmulator', () => {
  it('renders initial lines', () => {
    const lines = [
      { id: '1', text: 'init system...', isCommand: false },
      { id: '2', text: 'npm start', isCommand: true },
    ];
    render(<TerminalEmulator initialLines={lines} />);
    
    expect(screen.getByText('init system...')).toBeTruthy();
    expect(screen.getByText('npm start')).toBeTruthy();
  });

  it('exposes writeLine and clear via ref', async () => {
    const ref = createRef<TerminalEmulatorRef>();
    render(<TerminalEmulator ref={ref} typingSpeed={1} />); // Fast typing for test

    await act(async () => {
      ref.current?.writeLine('hello world', true);
      // Wait for typing to complete
      await new Promise(r => setTimeout(r, 50));
    });

    expect(screen.getByText('hello world')).toBeTruthy();

    act(() => {
      ref.current?.clear();
    });

    const el = screen.queryByText('hello world');
    expect(el).toBeNull();
  });

  it('respects reduced motion (instant text)', async () => {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const ref = createRef<TerminalEmulatorRef>();
    render(<TerminalEmulator ref={ref} typingSpeed={1000} />); // Very slow, would timeout if not instant

    await act(async () => {
      ref.current?.writeLine('instant text', false);
      // We don't need to wait for typing because it's instant
      await new Promise(r => setTimeout(r, 0));
    });

    expect(screen.getByText('instant text')).toBeTruthy();
  });
});
