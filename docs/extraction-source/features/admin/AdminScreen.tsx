import { useEffect, useState } from "react";
import { ClientEvent, KnownMembership, type Room } from "matrix-js-sdk";
import { useClient } from "../../app/context";
import { useEventVersion } from "../../matrix/hooks";
import { useGateway } from "../../agent/useGateway";
import { NotConfigured, useToast } from "../../components/primitives";
import { displayNameFor } from "../../matrix/rooms";

/**
 * Admin shows real controls only where the signed-in user actually has them:
 * room moderation where your power level allows it. Server-wide administration
 * is reported as a capability, never faked.
 */
export function AdminScreen() {
  const client = useClient();
  const gateway = useGateway();
  const [serverAdmin, setServerAdmin] = useState<boolean | null>(null);
  const [caps, setCaps] = useState<Record<string, unknown> | null>(null);
  const [upload, setUpload] = useState<number | null>(null);
  useEventVersion(client, [ClientEvent.Room]);
  useEffect(() => {
    void client.isSynapseAdministrator().then(setServerAdmin, () => setServerAdmin(false));
    void client.getCapabilities().then((c) => setCaps(c as Record<string, unknown>), () => setCaps({}));
    void client.getMediaConfig(true).then((m) => setUpload(m["m.upload.size"] ?? null), () => setUpload(null));
  }, [client]);
  const me = client.getSafeUserId();
  const moderated = client.getRooms().filter((r) => r.getMyMembership() === "join" && !r.isSpaceRoom() && r.currentState.hasSufficientPowerLevelFor("kick", r.getMember(me)?.powerLevel ?? 0));

  return (
    <div data-sec="green" data-screen="" style={{ display: "flex", flexDirection: "column", overflow: "auto", height: "100%", padding: "18px var(--gut) 26px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", gap: "var(--s5)" }}>
        <div data-eyebrow="">Homeserver</div>
        <div data-card="" data-pad="none">
          <div data-rows="" data-gap="flush">
            <div data-row="">
              <span data-dot="" data-tone={serverAdmin ? "ok" : undefined} />
              <div data-fill="">
                <div data-strong="">{serverAdmin === null ? "Checking server administrator status…" : serverAdmin ? "You are a server administrator" : "You are not a server administrator"}</div>
                <div data-meta="">Server-wide administration stays in your homeserver's own admin tooling; ChatUIMorph does not duplicate it.</div>
              </div>
            </div>
            <div data-row="">
              <div data-fill="">
                <div data-strong="">Capabilities</div>
                <div data-meta="">
                  {caps === null
                    ? "…"
                    : Object.keys(caps).length
                      ? Object.entries(caps)
                          .map(([k, v]) => `${k.replace(/^m\./, "")}: ${typeof v === "object" && v && "enabled" in v ? String((v as { enabled: unknown }).enabled) : "yes"}`)
                          .join(" · ")
                      : "None advertised"}
                </div>
              </div>
            </div>
            <div data-row="">
              <div data-fill="">
                <div data-strong="">Upload limit</div>
                <div data-meta="">{upload ? `${Math.round(upload / 1048576)} MB` : "Not advertised"}</div>
              </div>
            </div>
          </div>
        </div>
        <div data-eyebrow="">Agent Gateway</div>
        {gateway.configured ? (
          <div data-card="" data-pad="none">
            <div data-rows="" data-gap="flush">
              {(gateway.status?.agents ?? []).map((a) => (
                <div key={a.slug} data-row="">
                  <span data-dot="" data-tone={a.health?.ok ? "ok" : "danger"} />
                  <div data-fill="">
                    <div data-strong="">{a.displayName ?? a.slug}</div>
                    <div data-meta="">{a.matrixUserId} · {a.runtime} · {a.enabled ? "enabled" : "disabled"}{a.health?.detail ? ` · ${a.health.detail}` : ""}</div>
                  </div>
                </div>
              ))}
              {gateway.error ? <div data-row=""><div data-meta="">Unreachable: {gateway.error}</div></div> : null}
            </div>
            <div data-meta="" style={{ padding: "var(--s3) var(--s5)" }}>Provisioning is done through the gateway's authenticated API (Hermes / automation), never from the browser.</div>
          </div>
        ) : (
          <NotConfigured title="Agent Gateway not configured">Configure <span data-num="">gatewayUrl</span> to see backend health here.</NotConfigured>
        )}
        <div data-eyebrow="">Rooms you moderate · {moderated.length}</div>
        {moderated.length ? moderated.map((r) => <Moderate key={r.roomId} room={r} />) : <NotConfigured title="No moderation rights">You don't hold kick/ban power in any joined room.</NotConfigured>}
      </div>
    </div>
  );
}

function Moderate({ room }: { room: Room }) {
  const client = useClient();
  const toast = useToast();
  const me = client.getSafeUserId();
  const myPl = room.getMember(me)?.powerLevel ?? 0;
  const members = room.getMembers().filter((m) => m.userId !== me && (m.membership === KnownMembership.Join || m.membership === KnownMembership.Ban || m.membership === KnownMembership.Invite));
  const act = (label: string, p: Promise<unknown>) => void p.then(() => toast(label, room.name), (e: Error) => toast(`${label} failed`, e.message, "danger"));
  return (
    <details data-card="">
      <summary data-strong="" style={{ cursor: "pointer" }}>{room.name} <span data-meta="">· {members.length} others</span></summary>
      <div data-rows="" style={{ marginTop: "var(--s3)" }}>
        {members.map((m) => (
          <div key={m.userId} data-row="">
            <div data-fill="">
              <div data-strong="">{displayNameFor(room, m.userId, client)}</div>
              <div data-meta="">{m.userId} · {m.membership} · power {m.powerLevel}</div>
            </div>
            {m.membership === KnownMembership.Ban ? (
              <button data-btn="" data-state="" onClick={() => act("Unbanned", client.unban(room.roomId, m.userId))}>Unban</button>
            ) : m.powerLevel < myPl ? (
              <>
                <button data-btn="" data-state="" onClick={() => { const reason = window.prompt(`Remove ${m.name}? Reason (optional)`); if (reason !== null) act("Removed", client.kick(room.roomId, m.userId, reason || undefined)); }}>Remove</button>
                <button data-btn="" data-state="" data-tone="danger" onClick={() => { const reason = window.prompt(`Ban ${m.name}? Reason (optional)`); if (reason !== null) act("Banned", client.ban(room.roomId, m.userId, reason || undefined)); }}>Ban</button>
              </>
            ) : null}
          </div>
        ))}
      </div>
    </details>
  );
}
