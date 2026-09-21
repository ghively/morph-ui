import { useEffect, useMemo, useState } from "react";
import type { RuntimeConfig } from "../config";
import { ClientManager } from "../matrix/client";
import { completeSsoIfPresent } from "../matrix/auth";
import { loadSession } from "../matrix/session";
import { AppContext, useApp, useConnection } from "./context";
import { Login } from "./Login";
import { Shell } from "./shell/Shell";
import { Frame } from "./shell/Frame";
import { ToastProvider } from "../components/primitives";
import { PrefsProvider } from "./prefs";
import { ThemeProvider } from "../theme/context";

// One Matrix client per browser profile (spec §6): the manager is a module
// singleton, so React StrictMode's double effects can't create a second one.
let singleton: ClientManager | null = null;
let creating: Promise<ClientManager> | null = null;
let booted: Promise<string | null> | null = null;

async function boot(m: ClientManager, config: RuntimeConfig): Promise<string | null> {
  try {
    if (import.meta.env.VITE_FIXTURE_MODE === "true" && config.fixtureMode) {
      await (m as unknown as { boot(s: string): Promise<void> }).boot(new URLSearchParams(window.location.search).get("state") ?? "room");
      return null;
    }
    const sso = await completeSsoIfPresent();
    if (sso) await m.loginWith(sso.homeserverUrl, sso.res);
    else await m.restore();
    return null;
  } catch (e) {
    return e instanceof Error ? e.message : String(e);
  }
}

async function createManager(config: RuntimeConfig): Promise<ClientManager> {
  if (import.meta.env.VITE_FIXTURE_MODE === "true" && config.fixtureMode) {
    // Deterministic fixture data — only in a VITE_FIXTURE_MODE=true build (spec §8).
    const { FixtureManager } = await import("../fixtures/manager");
    return new FixtureManager();
  }
  return new ClientManager();
}

export function App({ config }: { config: RuntimeConfig }) {
  const [manager, setManager] = useState<ClientManager | null>(singleton);
  const [bootError, setBootError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    void (async () => {
      if (!creating) creating = createManager(config).then((m) => (singleton = m));
      const m = await creating;
      if (live) setManager(m);
      if (!booted) booted = boot(m, config);
      const err = await booted;
      if (live && err) setBootError(err);
    })();
    const unload = () => singleton?.stop();
    window.addEventListener("pagehide", unload);
    return () => {
      live = false;
      window.removeEventListener("pagehide", unload);
    };
  }, [config]);

  const ctx = useMemo(() => (manager ? { manager, config } : null), [manager, config]);
  if (!ctx) return null;
  return (
    <AppContext.Provider value={ctx}>
      <PrefsProvider>
        <ThemeProvider>
          <ToastProvider>
            <Root bootError={bootError} />
          </ToastProvider>
        </ThemeProvider>
      </PrefsProvider>
    </AppContext.Provider>
  );
}

function Root({ bootError }: { bootError: string | null }) {
  const { manager } = useApp();
  const conn = useConnection();
  if (conn.phase === "logged_out") {
    return (
      <Frame bare>
        <Login initialError={bootError} />
      </Frame>
    );
  }
  if (conn.phase === "locked") {
    return (
      <Frame bare>
        <Centered title="Open in another tab" text="ChatUIMorph keeps exactly one Matrix connection per browser profile. Close the other tab, or move the session here.">
          <button
            data-btn="fill"
            data-state=""
            onClick={() => {
              const s = loadSession();
              if (s) void manager.start(s, { steal: true });
            }}
          >
            Use here
          </button>
        </Centered>
      </Frame>
    );
  }
  if (conn.phase === "fatal" && !manager.client) {
    return (
      <Frame bare>
        <Centered title="Couldn't start" text={conn.error ?? "The Matrix client failed to start."}>
          <button data-btn="" data-state="" onClick={() => window.location.reload()}>
            Reload
          </button>
          <button data-btn="text" data-state="" onClick={() => void manager.logout()}>
            Sign out
          </button>
        </Centered>
      </Frame>
    );
  }
  if (!manager.client) {
    return (
      <Frame bare>
        <Centered title="Starting" text="Opening your encrypted local store…" busy />
      </Frame>
    );
  }
  return <Shell />;
}

export function Centered({ title, text, busy, children }: { title: string; text: string; busy?: boolean; children?: React.ReactNode }) {
  return (
    <div style={{ flex: 1, display: "grid", placeItems: "center", padding: "var(--s6)" }}>
      <div data-empty="" role={busy ? "status" : undefined} aria-live="polite">
        <div data-tile="">{busy ? <span data-dot="" data-live="" /> : <span data-dot="" />}</div>
        <div data-eyebrow="">{title}</div>
        <div style={{ maxWidth: 420 }}>{text}</div>
        {children ? <div style={{ display: "flex", gap: "var(--s2)", marginTop: "var(--s3)" }}>{children}</div> : null}
      </div>
    </div>
  );
}
