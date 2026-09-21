import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import './SandboxedContentFrame.css';

export type FrameStatus =
  | { phase: 'loading' }
  | { phase: 'live'; warnings: string[] }
  | { phase: 'failed'; error: string };

export interface FrameProtocol {
  ready: string;
  rendered: string;
  height: string;
  error: string;
  render: string;
}

export interface SandboxedContentFrameProps {
  srcDoc: string;
  sandbox?: string;
  payload: unknown;
  resendKey?: string | number;
  timeoutMs?: number;
  title: string;
  protocol?: Partial<FrameProtocol>;
  channel?: string;
  minHeight?: number;
  maxHeight?: number;
  heightPadding?: number;
  onStatusChange?: (status: FrameStatus) => void;
  renderFallback?: (error: string, retry: () => void) => ReactNode;
  note?: ReactNode;
  warningText?: (warnings: string[]) => ReactNode;
  className?: string;
}

export interface SourceFallbackCardProps {
  note: string;
  source?: string;
  sourceLabel?: string;
  onRetry?: () => void;
  retryLabel?: string;
  emptyMessage?: ReactNode;
  className?: string;
}

export function SourceFallbackCard(props: SourceFallbackCardProps) {
  const {
    note,
    source,
    sourceLabel = 'artifact',
    onRetry,
    retryLabel = 'Try rendering again',
    emptyMessage = 'No source was included.',
    className
  } = props;

  return (
    <div data-sandboxcontent="fallback" style={{ display: "flex", flexDirection: "column", gap: "var(--s4)", minWidth: 0 }} className={className}>
      <div data-alert="" data-tone="warn" role="note">
        <span data-dot="" />
        <div>{note}</div>
      </div>
      {source ? (
        <div data-code="">
          <div data-codehead="">
            <span data-num="">{sourceLabel} source</span>
            <button
              data-btn="text"
              data-state=""
              style={{ marginLeft: "auto", padding: "3px var(--s3)", fontSize: "var(--t-meta)" }}
              onClick={() => void navigator.clipboard?.writeText(source)}
              aria-label="Copy source"
            >
              Copy
            </button>
          </div>
          <pre>{source}</pre>
        </div>
      ) : (
        <span data-meta="">{emptyMessage}</span>
      )}
      {onRetry ? (
        <button data-btn="" data-state="" onClick={onRetry} style={{ alignSelf: "flex-start" }}>
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}

export function SandboxedContentFrame(props: SandboxedContentFrameProps) {
  const {
    srcDoc,
    sandbox = 'allow-scripts',
    payload,
    resendKey,
    timeoutMs = 6000,
    title,
    protocol = {},
    channel = '',
    minHeight = 120,
    maxHeight = 4000,
    heightPadding = 8,
    onStatusChange,
    renderFallback,
    note = "Sandboxed · no network, no access to your session",
    warningText = (warnings) => `This content uses components this client doesn't have: ${warnings.join(", ")}. They're shown as placeholders.`,
    className
  } = props;

  const [status, setStatusInner] = useState<FrameStatus>({ phase: 'loading' });
  const [height, setHeight] = useState(minHeight);
  const [run, setRun] = useState(0);
  const ref = useRef<HTMLIFrameElement>(null);

  const setStatus = useCallback((s: FrameStatus) => {
    setStatusInner(s);
    onStatusChange?.(s);
  }, [onStatusChange]);

  const p_ready = (channel ? channel + ':' : '') + (protocol.ready || 'ready');
  const p_rendered = (channel ? channel + ':' : '') + (protocol.rendered || 'rendered');
  const p_height = (channel ? channel + ':' : '') + (protocol.height || 'height');
  const p_error = (channel ? channel + ':' : '') + (protocol.error || 'error');
  const p_render = (channel ? channel + ':' : '') + (protocol.render || 'render');

  const clampHeight = useCallback((h: number) => {
    return Math.max(minHeight, Math.min(maxHeight, Math.ceil(h) + heightPadding));
  }, [minHeight, maxHeight, heightPadding]);

  const sendRef = useRef<() => void>(() => {});
  sendRef.current = () => {
    const win = ref.current?.contentWindow;
    if (!win) return;
    // targetOrigin "*" is required: a frame sandboxed without allow-same-origin
    // has an opaque origin that cannot be named. The message still goes only to
    // this one frame's window, never to any other document.
    win.postMessage({ type: p_render, ...((payload as Record<string, unknown>) || {}) }, '*');
  };
  const send = useCallback(() => sendRef.current(), []);

  useEffect(() => {
    setStatus({ phase: 'loading' });
    const onMessage = (e: MessageEvent) => {
      if (e.source !== ref.current?.contentWindow) return;
      const msg = e.data;
      if (!msg || typeof msg !== 'object') return;

      if (msg.type === p_ready) send();
      else if (msg.type === p_rendered) {
        const warnings = Array.isArray(msg.warnings) ? msg.warnings : [];
        setStatus({ phase: 'live', warnings });
        if (typeof msg.height === 'number') setHeight(clampHeight(msg.height));
      } else if (msg.type === p_height) {
        if (typeof msg.height === 'number') setHeight(clampHeight(msg.height));
      } else if (msg.type === p_error) {
        setStatus({ phase: 'failed', error: String(msg.error ?? "The content could not be rendered.") });
      }
    };

    window.addEventListener('message', onMessage);

    const timer = window.setTimeout(() => {
      setStatusInner((s) => {
        if (s.phase === 'loading') {
          const next: FrameStatus = { phase: 'failed', error: "The content frame didn't respond." };
          onStatusChange?.(next);
          return next;
        }
        return s;
      });
    }, timeoutMs);

    send();

    return () => {
      window.removeEventListener('message', onMessage);
      window.clearTimeout(timer);
    };
  }, [send, run, timeoutMs, clampHeight, p_ready, p_rendered, p_height, p_error, setStatus, onStatusChange]);

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    send();
  }, [resendKey, send]);

  if (status.phase === 'failed') {
    if (renderFallback) {
      return <>{renderFallback(status.error, () => setRun((v) => v + 1))}</>;
    }
    return (
      <SourceFallbackCard
        note={`This content didn't render: ${status.error} Showing the source instead.`}
        onRetry={() => setRun((v) => v + 1)}
      />
    );
  }

  return (
    <div data-sandboxcontent="live" style={{ display: "flex", flexDirection: "column", gap: "var(--s3)", minWidth: 0 }} className={className}>
      <iframe
        key={run}
        ref={ref}
        title={title}
        data-sandboxframe=""
        sandbox={sandbox}
        srcDoc={srcDoc}
        referrerPolicy="no-referrer"
        loading="eager"
        onLoad={send}
        style={{ width: "100%", height, border: "0", background: "transparent", colorScheme: "normal", display: "block" }}
      />
      {status.phase === 'loading' ? <span data-meta="">Rendering…</span> : null}
      {status.phase === 'live' && status.warnings.length > 0 ? (
        <span data-meta="">{warningText(status.warnings)}</span>
      ) : null}
      <span data-meta="">{note}</span>
    </div>
  );
}
