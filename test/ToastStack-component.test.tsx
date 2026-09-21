import { render, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ToastProvider, useToast } from '../src/components/ToastStack';

describe('ToastStack', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders [data-osd] with hidden=true when empty', () => {
    const { container } = render(
      <ToastProvider>
        <div />
      </ToastProvider>
    );

    const osd = container.querySelector('[data-osd]');
    expect(osd).toBeTruthy();
    expect(osd!.hasAttribute('hidden')).toBe(true);
  });

  it('renders a toast and unhides container', () => {
    const TestComponent = () => {
      const toast = useToast();
      return (
        <button onClick={() => toast('Saved', 'note')}>Toast</button>
      );
    };

    const { container, getByText } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const btn = getByText('Toast');
    act(() => { btn.click(); });

    const osd = container.querySelector('[data-osd]');
    expect(osd!.hasAttribute('hidden')).toBe(false);

    const item = container.querySelector('[data-osditem]');
    expect(item).toBeTruthy();
    expect(item!.textContent).toContain('Saved');
    expect(item!.getAttribute('data-tone')).toBeNull();

    const note = container.querySelector('[data-num][data-meta]');
    expect(note).toBeTruthy();
    expect(note!.textContent).toBe('note');
  });

  it('supports tone', () => {
    const TestComponent = () => {
      const toast = useToast();
      return (
        <button onClick={() => toast('Error', undefined, 'danger')}>Toast</button>
      );
    };

    const { container, getByText } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => { getByText('Toast').click(); });
    const item = container.querySelector('[data-osditem]');
    expect(item!.getAttribute('data-tone')).toBe('danger');
  });

  it('keeps at most 3 toasts by default', () => {
    const TestComponent = () => {
      const toast = useToast();
      return (
        <button onClick={() => {
          toast('T1');
          toast('T2');
          toast('T3');
          toast('T4');
        }}>Toast</button>
      );
    };

    const { container, getByText } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => { getByText('Toast').click(); });
    
    const items = container.querySelectorAll('[data-osditem]');
    expect(items.length).toBe(3);
    // It should keep the latest ones: T2, T3, T4
    expect(items[0]!.textContent).toContain('T2');
    expect(items[2]!.textContent).toContain('T4');
  });

  it('auto-dismisses after duration', () => {
    const TestComponent = () => {
      const toast = useToast();
      return (
        <button onClick={() => toast('Saved')}>Toast</button>
      );
    };

    const { container, getByText } = render(
      <ToastProvider duration={1000}>
        <TestComponent />
      </ToastProvider>
    );

    act(() => { getByText('Toast').click(); });
    expect(container.querySelectorAll('[data-osditem]').length).toBe(1);

    act(() => {
      vi.advanceTimersByTime(1100);
    });

    expect(container.querySelectorAll('[data-osditem]').length).toBe(0);
    expect(container.querySelector('[data-osd]')!.hasAttribute('hidden')).toBe(true);
  });

  it('useToast returns a no-op function outside provider', () => {
    let didThrow = false;
    const TestComponent = () => {
      const toast = useToast();
      try {
        toast('Wont crash');
      } catch {
        didThrow = true;
      }
      return null;
    };

    render(<TestComponent />);
    expect(didThrow).toBe(false);
  });

  it('does not have id collisions in same tick', () => {
    const TestComponent = () => {
      const toast = useToast();
      return (
        <button onClick={() => {
          toast('A');
          toast('B');
        }}>Toast</button>
      );
    };

    const { container, getByText } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => { getByText('Toast').click(); });
    
    const items = container.querySelectorAll('[data-osditem]');
    expect(items.length).toBe(2);
    // Keys shouldn't collide, react would complain, but we can verify nodes
    expect(items[0]!.textContent).toContain('A');
    expect(items[1]!.textContent).toContain('B');
  });
});
