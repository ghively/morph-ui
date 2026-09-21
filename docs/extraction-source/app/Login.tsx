import { useEffect, useState, type FormEvent } from "react";
import { useApp } from "./context";
import { useTheme } from "../theme/context";
import { getLoginFlows, passwordLogin, resolveHomeserver, startSso, type LoginFlows } from "../matrix/auth";

export function Login({ initialError }: { initialError?: string | null }) {
  const { manager, config } = useApp();
  const { brand } = useTheme();
  const [hs, setHs] = useState(config.defaultHomeserver ?? "");
  const [resolved, setResolved] = useState<string | null>(null);
  const [flows, setFlows] = useState<LoginFlows | null>(null);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [probe, setProbe] = useState<"idle" | "checking" | "ok" | "fail">("idle");

  useEffect(() => {
    if (!hs.trim()) {
      setFlows(null);
      setResolved(null);
      setProbe("idle");
      return;
    }
    let live = true;
    setProbe("checking");
    const t = window.setTimeout(async () => {
      try {
        const url = await resolveHomeserver(hs);
        const f = await getLoginFlows(url);
        if (!live) return;
        setResolved(url);
        setFlows(f);
        setProbe("ok");
        setError(null);
      } catch {
        if (!live) return;
        setResolved(null);
        setFlows(null);
        setProbe("fail");
      }
    }, 350);
    return () => {
      live = false;
      window.clearTimeout(t);
    };
  }, [hs]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const url = resolved ?? (await resolveHomeserver(hs));
      const res = await passwordLogin(url, user, password);
      setPassword("");
      await manager.loginWith(url, res);
    } catch (err) {
      const e2 = err as { errcode?: string; message?: string };
      setError(
        e2.errcode === "M_FORBIDDEN"
          ? "Wrong username or password."
          : e2.errcode === "M_LIMIT_EXCEEDED"
            ? "Too many attempts — wait a moment and try again."
            : `Couldn't sign in: ${e2.message ?? "homeserver unreachable"}`,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "calc(var(--s6) + var(--s1))" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div data-enter="" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--s6)", marginBottom: "calc(var(--s6) + var(--s2))" }}>
          <div data-grow="" style={{ width: 66, height: 66, borderRadius: "var(--r-xl)", background: "linear-gradient(145deg,var(--ai),var(--ai-strong) 55%,var(--ai-deep))", display: "grid", placeItems: "center", boxShadow: "0 16px 42px var(--ai-glow),inset 0 1px 0 var(--hi)", position: "relative", overflow: "hidden" }}>
            <span data-sheen="" />
            <span data-mark="" style={{ width: 36, height: 36, color: "var(--on-accent)" }} />
          </div>
          <h1 style={{ fontSize: "var(--t-hero)", fontWeight: 700, letterSpacing: "var(--tk-display)", textAlign: "center", margin: 0 }}>Sign in to {brand.productName}</h1>
          <div style={{ fontSize: "var(--t-title)", color: "var(--app-dim)", textAlign: "center", marginTop: "calc(-1 * var(--s2))" }}>
            Your AI team lives on your Matrix homeserver.
          </div>
        </div>
        <form onSubmit={submit} data-card="" data-pad="roomy" style={{ display: "flex", flexDirection: "column", gap: "var(--s5)" }} aria-label="Sign in">
          <div data-formfield="">
            <label htmlFor="hs">Homeserver</label>
            <input id="hs" data-field="" value={hs} onChange={(e) => setHs(e.target.value)} placeholder="matrix.example.org" autoComplete="url" required aria-invalid={probe === "fail"} />
            <div data-hint="" data-meta="" data-probe={probe} aria-live="polite">
              {probe === "ok" && resolved ? (
                <>Connecting to <span data-num="">{resolved}</span></>
              ) : probe === "checking" ? (
                "Finding your homeserver…"
              ) : probe === "fail" ? (
                <>
                  Couldn’t reach <span data-num="">{hs.trim()}</span> — check the address, or paste the full URL (e.g. https://host).
                </>
              ) : (
                "A server name or URL"
              )}
            </div>
          </div>
          {flows?.password !== false ? (
            <>
              <div data-formfield="">
                <label htmlFor="user">Username</label>
                <input id="user" data-field="" value={user} onChange={(e) => setUser(e.target.value)} autoComplete="username" required />
              </div>
              <div data-formfield="">
                <label htmlFor="pw">Password</label>
                <input id="pw" data-field="" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
              </div>
              <button type="submit" data-btn="fill" data-state="" data-busy={String(busy)} aria-busy={busy} disabled={busy} style={{ position: "relative" }}>
                Sign in
                <i data-spin="" aria-hidden="true" />
              </button>
            </>
          ) : null}
          {flows && !flows.password && !flows.sso ? (
            <div data-alert="" data-tone="danger" role="alert">
              <span data-dot="" />
              <div>This server doesn’t offer password or single sign-on login.</div>
            </div>
          ) : null}
          {flows?.sso && resolved ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--s2)" }}>
              <div data-eyebrow="">Or continue with</div>
              {flows.sso.map((p) => (
                <button key={p.id || "sso"} type="button" data-btn="" data-state="" onClick={() => startSso(resolved, p.id)}>
                  {p.name}
                </button>
              ))}
            </div>
          ) : null}
          {error ? (
            <div data-alert="" data-tone="danger" role="alert">
              <span data-dot="" />
              <div>{error}</div>
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}
