import { render, act } from '@testing-library/react';
import { createRef } from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { CardDeckReveal } from '../src/components/CardDeckReveal';
import { TerminalEmulator, type TerminalEmulatorRef } from '../src/components/TerminalEmulator';

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

describe('CardDeckReveal timers', () => {
  it('leaves no pending animation timer after unmount', () => {
    vi.useFakeTimers();
    const { container, unmount } = render(<CardDeckReveal cards={['a', 'b', 'c']} autoAdvanceInterval={0} />);
    act(() => { (container.firstChild as HTMLElement).click(); });
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('TerminalEmulator clear()', () => {
  it('drops a line that was mid-typing when cleared', async () => {
    vi.useFakeTimers();
    const ref = createRef<TerminalEmulatorRef>();
    const { container } = render(<TerminalEmulator ref={ref} typingSpeed={10} />);
    act(() => { ref.current!.writeLine('deploying service'); });
    await act(async () => { await vi.advanceTimersByTimeAsync(50); });
    act(() => { ref.current!.clear(); });
    await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
    expect(container.textContent).not.toContain('deploying service');
  });

  it('still writes lines after a clear', async () => {
    vi.useFakeTimers();
    const ref = createRef<TerminalEmulatorRef>();
    const { container } = render(<TerminalEmulator ref={ref} typingSpeed={1} />);
    act(() => { ref.current!.clear(); ref.current!.writeLine('ok'); });
    await act(async () => { await vi.advanceTimersByTimeAsync(100); });
    expect(container.textContent).toContain('ok');
  });
});
