import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePrefs } from "../../app/prefs";
import { useTheme } from "../../theme/context";
import { ARTIFACT_SANDBOX, artifactFrameSrcdoc, frameMessage, readBridgedTokens } from "../../artifacts/openui/frame";
import { uiArtifactFallbackNote, uiArtifactLabel, type UiArtifact } from "../../artifacts/uiArtifact";

/** How long the frame gets to report a successful render before we fall back. */
const RENDER_TIMEOUT_MS = 6000;

type Status = { phase: "loading" } | { phase: "live"; unknown: string[] } | { phase: "failed"; error: string };

/**
 * Renders a UI artifact. Interactive when — and only when — the envelope is one
 * this client understands *and* the sandboxed frame reports a successful
 * render. Every other path (bad version, unknown kind, malformed content,
 * unparseable source, a frame that never answers) lands on the same read-only
 * fallback: title, a note saying why, and the raw source in a code card.
 */
export function UiArtifactView({ artifact }: { artifact: UiArtifact }) {
  if (!artifact.renderable) return <UiArtifactFallback artifact={artifact} note={uiArtifactFallbackNote(artifact)} />;
  return <UiArtifactFrame artifact={artifact} />;
}

function UiArtifactFrame({ artifact }: { artifact: UiArtifact }) {
  const { prefs } = usePrefs();
  const themeId = useTheme().theme.id;
  const ref = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<Status>({ phase: "loading" });
  const [height, setHeight] = useState(240);
  // A new artifact (or a deliberate re-run) gets a brand new frame: remounting
  // is how we guarantee no state from a previous artifact survives.
  const [run, setRun] = useState(0);
  const srcdoc = useMemo(() => artifactFrameSrcdoc(), []);

  // The frame is told what to draw over postMessage, never through its HTML.
  const sendRef = useRef<() => void>(() => {});
  sendRef.current = () => {
    const win = ref.current?.contentWindow;
    if (!win) return;
    // targetOrigin "*" is required: a frame sandboxed without allow-same-origin
    // has an opaque origin that cannot be named. The message still goes only to
    // this one frame's window, never to any other document.
    win.postMessage(
      // Read tokens off the frame element: app.css scopes the --sec* accent
      // roles per [data-sec], so the artifact inherits the pane's accent.
      { type: "openui:render", source: artifact.source, theme: prefs.theme, tokens: readBridgedTokens(ref.current ?? document.documentElement) },
      "*",
    );
  };
  const send = useCallback(() => sendRef.current(), []);

  useEffect(() => {
    setStatus({ phase: "loading" });
    const onMessage = (e: MessageEvent) => {
      const msg = frameMessage(e, ref.current);
      if (!msg) return;
      if (msg.type === "openui:ready") send();
      else if (msg.type === "openui:rendered") {
        setStatus({ phase: "live", unknown: Array.isArray(msg.unknown) ? msg.unknown : [] });
        if (typeof msg.height === "number") setHeight(clampHeight(msg.height));
      } else if (msg.type === "openui:height") {
        if (typeof msg.height === "number") setHeight(clampHeight(msg.height));
      } else if (msg.type === "openui:error") {
        setStatus({ phase: "failed", error: String(msg.error ?? "The artifact could not be rendered.") });
      }
    };
    window.addEventListener("message", onMessage);
    // Fail closed: a frame that never reports a successful render is treated as
    // a failed one, so a hung or blocked artifact still shows its source.
    const timer = window.setTimeout(() => {
      setStatus((s) => (s.phase === "loading" ? { phase: "failed", error: "The artifact frame didn't respond." } : s));
    }, RENDER_TIMEOUT_MS);
    send();
    return () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(timer);
    };
  }, [send, artifact.source, run]);

  // Re-send on theme change so a live artifact follows the app's theme.
  const firstTheme = useRef(true);
  useEffect(() => {
    if (firstTheme.current) {
      firstTheme.current = false;
      return;
    }
    send();
  }, [prefs.theme, themeId, send]);

  if (status.phase === "failed") {
    return <UiArtifactFallback artifact={artifact} note={`This artifact didn't render: ${status.error} Showing the source instead.`} onRetry={() => setRun((v) => v + 1)} />;
  }

  return (
    <div data-uiartifact="live" style={{ display: "flex", flexDirection: "column", gap: "var(--s3)", minWidth: 0 }}>
      <iframe
        key={run}
        ref={ref}
        title={`Interactive artifact: ${uiArtifactLabel(artifact)}`}
        data-artifactframe=""
        sandbox={ARTIFACT_SANDBOX}
        srcDoc={srcdoc}
        referrerPolicy="no-referrer"
        loading="eager"
        onLoad={send}
        style={{ width: "100%", height, border: "0", background: "transparent", colorScheme: "normal", display: "block" }}
      />
      {status.phase === "loading" ? <span data-meta="">Rendering…</span> : null}
      {status.phase === "live" && status.unknown.length ? (
        <span data-meta="">This artifact uses components this client doesn't have: {status.unknown.join(", ")}. They're shown as placeholders.</span>
      ) : null}
      <span data-meta="">Sandboxed · no network, no access to your session</span>
    </div>
  );
}

const clampHeight = (h: number) => Math.max(120, Math.min(4000, Math.ceil(h) + 8));

/** The one safe view every failure path lands on. */
export function UiArtifactFallback({ artifact, note, onRetry }: { artifact: UiArtifact; note: string; onRetry?: () => void }) {
  const source = artifact.source;
  return (
    <div data-uiartifact="fallback" style={{ display: "flex", flexDirection: "column", gap: "var(--s4)", minWidth: 0 }}>
      <div data-alert="" data-tone="warn" role="note">
        <span data-dot="" />
        <div>{note}</div>
      </div>
      {source ? (
        <div data-code="">
          <div data-codehead="">
            <span data-num="">{artifact.kind || "artifact"} source</span>
            <button
              data-btn="text"
              data-state=""
              style={{ marginLeft: "auto", padding: "3px var(--s3)", fontSize: "var(--t-meta)" }}
              onClick={() => void navigator.clipboard?.writeText(source)}
              aria-label="Copy artifact source"
            >
              Copy
            </button>
          </div>
          <pre>{source}</pre>
        </div>
      ) : (
        <span data-meta="">No source was included in this artifact.</span>
      )}
      {onRetry ? (
        <button data-btn="" data-state="" onClick={onRetry} style={{ alignSelf: "flex-start" }}>
          Try rendering again
        </button>
      ) : null}
    </div>
  );
}
