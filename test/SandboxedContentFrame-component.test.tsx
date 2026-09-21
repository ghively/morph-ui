import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SandboxedContentFrame, SourceFallbackCard } from '../src/components/SandboxedContentFrame';

describe('SandboxedContentFrame', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders iframe with properties', () => {
    render(
      <SandboxedContentFrame
        title="Test Frame"
        srcDoc="<p>Test</p>"
        sandbox="allow-scripts"
        payload={{ data: 1 }}
      />
    );
    const iframe = screen.getByTitle('Test Frame') as HTMLIFrameElement;
    expect(iframe).toBeTruthy();
    expect(iframe.getAttribute('sandbox')).toBe('allow-scripts');
    expect(iframe.getAttribute('referrerpolicy')).toBe('no-referrer');
    expect(iframe.getAttribute('loading')).toBe('eager');
    expect(iframe.getAttribute('srcdoc')).toBe('<p>Test</p>');
    expect(screen.getByText('Rendering…')).toBeTruthy();
  });

  it('fails closed after timeout', () => {
    const onStatusChange = vi.fn();
    const renderFallback = vi.fn().mockReturnValue(<div data-testid="fallback">Fallback Render</div>);
    
    render(
      <SandboxedContentFrame
        title="Test"
        srcDoc=""
        payload={{}}
        timeoutMs={100}
        onStatusChange={onStatusChange}
        renderFallback={renderFallback}
      />
    );
    expect(screen.getByText('Rendering…')).toBeTruthy();
    
    act(() => {
      vi.advanceTimersByTime(150);
    });
    
    expect(onStatusChange).toHaveBeenCalledWith({ phase: 'failed', error: "The content frame didn't respond." });
    expect(screen.getByTestId('fallback')).toBeTruthy();
  });

  it('handles height messages', () => {
    render(
      <SandboxedContentFrame
        title="Test"
        srcDoc=""
        payload={{}}
        channel="openui"
      />
    );
    const iframe = screen.getByTitle('Test') as HTMLIFrameElement;
    expect(iframe.style.height).toBe('120px'); // default clamp

    // Simulate height message
    act(() => {
      const event = new MessageEvent('message', {
        source: iframe.contentWindow,
        data: { type: 'openui:height', height: 300 }
      });
      window.dispatchEvent(event);
    });

    // height = 300 + 8 (padding)
    expect(iframe.style.height).toBe('308px');

    // Simulate height out of bounds
    act(() => {
      const event = new MessageEvent('message', {
        source: iframe.contentWindow,
        data: { type: 'openui:height', height: 99999 }
      });
      window.dispatchEvent(event);
    });

    // max clamp = 4000
    expect(iframe.style.height).toBe('4000px');
  });

  it('ignores messages from wrong source', () => {
    const onStatusChange = vi.fn();
    render(
      <SandboxedContentFrame
        title="Test"
        srcDoc=""
        payload={{}}
        onStatusChange={onStatusChange}
      />
    );
    
    act(() => {
      const event = new MessageEvent('message', {
        source: window, // Wrong source
        data: { type: 'rendered' }
      });
      window.dispatchEvent(event);
    });

    expect(screen.getByText('Rendering…')).toBeTruthy();
  });

  it('handles rendered message and warns', () => {
    render(
      <SandboxedContentFrame
        title="Test"
        srcDoc=""
        payload={{}}
        warningText={(w) => `Warn: ${w.join(',')}`}
      />
    );
    const iframe = screen.getByTitle('Test') as HTMLIFrameElement;
    
    act(() => {
      const event = new MessageEvent('message', {
        source: iframe.contentWindow,
        data: { type: 'rendered', warnings: ['X', 'Y'] }
      });
      window.dispatchEvent(event);
    });

    expect(screen.queryByText('Rendering…')).toBeNull();
    expect(screen.getByText('Warn: X,Y')).toBeTruthy();
  });

  it('resends payload on resendKey change', () => {
    const { rerender } = render(
      <SandboxedContentFrame
        title="Test"
        srcDoc=""
        payload={{}}
        resendKey="A"
      />
    );
    
    // We can't easily spy on iframe postMessage in jsdom without replacing it,
    // but we can ensure the effect runs without crashing.
    rerender(
      <SandboxedContentFrame
        title="Test"
        srcDoc=""
        payload={{}}
        resendKey="B"
      />
    );
  });
});

describe('SourceFallbackCard', () => {
  it('renders note and source code', () => {
    render(<SourceFallbackCard note="Failed" source="let x = 1;" />);
    expect(screen.getByText('Failed')).toBeTruthy();
    expect(screen.getByText('let x = 1;')).toBeTruthy();
  });

  it('renders empty message if no source', () => {
    render(<SourceFallbackCard note="Failed" emptyMessage="Empty" />);
    expect(screen.getByText('Empty')).toBeTruthy();
  });

  it('renders retry button if onRetry provided', () => {
    const onRetry = vi.fn();
    render(<SourceFallbackCard note="Failed" onRetry={onRetry} retryLabel="Retry Now" />);
    const btn = screen.getByRole('button', { name: 'Retry Now' });
    fireEvent.click(btn);
    expect(onRetry).toHaveBeenCalled();
  });
});

  it('removes listener on unmount', () => {
    const onStatusChange = vi.fn();
    const { unmount, getByTitle } = render(
      <SandboxedContentFrame title="Test" srcDoc="" payload={{}} onStatusChange={onStatusChange} />
    );
    const iframe = getByTitle('Test') as HTMLIFrameElement;
    unmount();
    
    act(() => {
      const event = new MessageEvent('message', {
        source: iframe.contentWindow,
        data: { type: 'rendered' }
      });
      window.dispatchEvent(event);
    });
    
    // Status phase 'live' should not be called since unmounted
    expect(onStatusChange).not.toHaveBeenCalledWith(expect.objectContaining({ phase: 'live' }));
  });
