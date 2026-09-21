import { useCallback, useEffect, useState } from "react";
import { useClient, useConnection } from "../../app/context";
import { restoreWithRecoveryKey, securityStatus, setupRecovery, type SecurityStatus } from "../../matrix/crypto";
import { CryptoEvent, VerificationPhase, VerificationRequestEvent, VerifierEvent, type ShowSasCallbacks, type VerificationRequest } from "matrix-js-sdk/lib/crypto-api/index.js";
import { useToast } from "../../components/primitives";

export function SecurityPanel() {
  const client = useClient();
  const conn = useConnection();
  const toast = useToast();
  const [status, setStatus] = useState<SecurityStatus | null>(null);
  const [devices, setDevices] = useState<{ device_id: string; display_name?: string; last_seen_ts?: number }[]>([]);
  const [pw, setPw] = useState("");
  const [recoveryKey, setRecoveryKey] = useState<string | null>(null);
  const [restoreKey, setRestoreKey] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = useCallback(() => {
    void securityStatus(client).then(setStatus);
    void client.getDevices().then((r) => setDevices(r.devices), () => setDevices([]));
  }, [client]);
  useEffect(refresh, [refresh]);

  const run = async (label: string, fn: () => Promise<void>) => {
    setBusy(label);
    try {
      await fn();
    } catch (e) {
      toast(`${label} failed`, (e as Error).message, "danger");
    } finally {
      setBusy(null);
      refresh();
    }
  };

  if (conn.cryptoError || (status && !status.available)) {
    return (
      <div data-alert="" data-tone="danger" role="alert">
        <span data-dot="" />
        <div>
          <strong>Encryption is unavailable in this session.</strong> {conn.cryptoError ?? "The Rust crypto module did not initialise."} Unencrypted rooms keep working; encrypted messages will show as undecryptable.
        </div>
      </div>
    );
  }
  const row = (label: string, ok: boolean | null, text: string) => (
    <div data-row="" key={label}>
      <span data-dot="" data-tone={ok === null ? undefined : ok ? "ok" : "warn"} />
      <div data-fill="">
        <div data-strong="">{label}</div>
        <div data-meta="">{text}</div>
      </div>
    </div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--s5)" }}>
      <div data-card="" data-pad="none">
        <div data-rows="" data-gap="flush">
          {row("This session", status?.deviceVerified ?? null, status ? `${status.deviceId ?? "?"} · ${status.deviceVerified ? "verified" : "not verified"}${status.identityKey ? ` · ${status.identityKey.slice(0, 12)}…` : ""}` : "Checking…")}
          {row("Cross-signing", status?.crossSigningReady ?? null, status?.crossSigningReady ? "Ready" : "Not set up on this session")}
          {row("Secret storage", status?.secretStorageReady ?? null, status?.secretStorageReady ? "Ready — recovery key protects your keys" : "Not set up")}
          {row("Key backup", status ? !!status.backupVersion && status.backupTrusted !== false : null, status?.backupVersion ? `Version ${status.backupVersion}${status.backupTrusted === false ? " · not trusted by this session" : ""}` : "Off — message keys only live on your devices")}
        </div>
      </div>
      <Verify onDone={refresh} />
      {!status?.secretStorageReady ? (
        <div data-card="" data-pad="roomy">
          <div data-eyebrow="">Set up recovery</div>
          <p data-meta="">Creates cross-signing keys, secret storage and server-side key backup. Your password confirms the change.</p>
          <form
            style={{ display: "flex", gap: "var(--s2)" }}
            onSubmit={(e) => {
              e.preventDefault();
              void run("Recovery setup", async () => {
                const k = await setupRecovery(client, pw);
                setPw("");
                setRecoveryKey(k);
              });
            }}
          >
            <input data-field="" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Account password" aria-label="Account password" autoComplete="current-password" required />
            <button data-btn="fill" data-state="" disabled={busy !== null}>Set up</button>
          </form>
        </div>
      ) : (
        <div data-card="" data-pad="roomy">
          <div data-eyebrow="">Restore with recovery key</div>
          <p data-meta="">Verifies this session and restores message keys from backup.</p>
          <form
            style={{ display: "flex", gap: "var(--s2)" }}
            onSubmit={(e) => {
              e.preventDefault();
              void run("Restore", async () => {
                const r = await restoreWithRecoveryKey(client, restoreKey);
                setRestoreKey("");
                toast("Keys restored", `${r.imported} sessions`);
              });
            }}
          >
            <input data-field="" value={restoreKey} onChange={(e) => setRestoreKey(e.target.value)} placeholder="EsTc …" aria-label="Recovery key" autoComplete="off" spellCheck={false} required />
            <button data-btn="fill" data-state="" disabled={busy !== null}>Restore</button>
          </form>
        </div>
      )}
      {recoveryKey ? (
        <div data-alert="" role="alert">
          <span data-dot="" />
          <div>
            <strong>Save your recovery key now — it is shown once.</strong>
            <div data-num="" style={{ userSelect: "all", marginTop: "var(--s2)", wordBreak: "break-all" }}>{recoveryKey}</div>
          </div>
          <button data-btn="text" data-state="" onClick={() => void navigator.clipboard?.writeText(recoveryKey)}>Copy</button>
          <button data-btn="text" data-state="" onClick={() => setRecoveryKey(null)}>Done</button>
        </div>
      ) : null}
      <div data-eyebrow="">Sessions · {devices.length}</div>
      <div data-card="" data-pad="none">
        <div data-rows="" data-gap="flush">
          {devices.map((d) => (
            <div key={d.device_id} data-row="">
              <span data-dot="" data-tone={d.device_id === client.getDeviceId() ? "ok" : undefined} />
              <div data-fill="">
                <div data-strong="">{d.display_name ?? d.device_id}{d.device_id === client.getDeviceId() ? " (this session)" : ""}</div>
                <div data-meta="">
                  <span data-num="">{d.device_id}</span>
                  {d.last_seen_ts ? ` · last seen ${new Date(d.last_seen_ts).toLocaleString()}` : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Interactive SAS (emoji) verification with another of your sessions, both directions. */
function Verify({ onDone }: { onDone: () => void }) {
  const client = useClient();
  const toast = useToast();
  const [req, setReq] = useState<VerificationRequest | null>(null);
  const [sas, setSas] = useState<ShowSasCallbacks | null>(null);
  const [phase, setPhase] = useState<VerificationPhase | null>(null);

  useEffect(() => {
    const onReq = (r: VerificationRequest) => {
      if (r.isSelfVerification) setReq(r);
    };
    client.on(CryptoEvent.VerificationRequestReceived, onReq);
    return () => {
      client.off(CryptoEvent.VerificationRequestReceived, onReq);
    };
  }, [client]);

  useEffect(() => {
    if (!req) return;
    const onChange = async () => {
      setPhase(req.phase);
      if (req.phase === VerificationPhase.Ready && req.initiatedByMe) {
        const v = await req.startVerification("m.sas.v1");
        v.on(VerifierEvent.ShowSas, setSas);
        void v.verify().then(
          () => {
            toast("Session verified");
            onDone();
          },
          () => {},
        );
      }
      if (req.phase === VerificationPhase.Started && !req.initiatedByMe && req.verifier) {
        req.verifier.on(VerifierEvent.ShowSas, setSas);
        void req.verifier.verify().then(() => {
          toast("Session verified");
          onDone();
        }, () => {});
      }
      if (req.phase === VerificationPhase.Done || req.phase === VerificationPhase.Cancelled) {
        setSas(null);
        window.setTimeout(() => setReq(null), 1200);
      }
    };
    req.on(VerificationRequestEvent.Change, onChange);
    void onChange();
    return () => {
      req.off(VerificationRequestEvent.Change, onChange);
    };
  }, [req, toast, onDone]);

  const crypto = client.getCrypto();
  if (!crypto) return null;
  return (
    <div data-card="" data-pad="roomy" aria-live="polite">
      <div data-eyebrow="">Verify with another session</div>
      {!req ? (
        <>
          <p data-meta="">Compare emoji with one of your other signed-in Matrix clients.</p>
          <button data-btn="" data-state="" onClick={() => void crypto.requestOwnUserVerification().then(setReq, (e: Error) => toast("Couldn't start", e.message, "danger"))}>
            Start verification
          </button>
        </>
      ) : sas ? (
        <>
          <p data-meta="">Confirm the other session shows the same emoji, in the same order.</p>
          <div style={{ display: "flex", gap: "var(--s3)", flexWrap: "wrap", margin: "var(--s3) 0" }}>
            {(sas.sas.emoji ?? []).map(([emoji, name], i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 56 }}>
                <span style={{ fontSize: 28 }} aria-hidden="true">{emoji}</span>
                <span data-meta="">{name}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "var(--s2)" }}>
            <button data-btn="fill" data-state="" onClick={() => void sas.confirm()}>They match</button>
            <button data-btn="" data-state="" onClick={() => sas.mismatch()}>They don't match</button>
          </div>
        </>
      ) : (
        <>
          <p data-meta="">
            {phase === VerificationPhase.Requested && !req.initiatedByMe ? "Another session wants to verify." : phase === VerificationPhase.Done ? "Verified." : phase === VerificationPhase.Cancelled ? "Cancelled." : "Waiting for your other session…"}
          </p>
          <div style={{ display: "flex", gap: "var(--s2)" }}>
            {phase === VerificationPhase.Requested && !req.initiatedByMe ? (
              <button data-btn="fill" data-state="" onClick={() => void req.accept()}>Accept</button>
            ) : null}
            <button data-btn="" data-state="" onClick={() => void req.cancel()}>Cancel</button>
          </div>
        </>
      )}
    </div>
  );
}
