import { useEffect, useMemo, useState } from "react";
import { ClientEvent, EventType, RoomEvent, type MatrixEvent } from "matrix-js-sdk";
import { useClient } from "../../app/context";
import { useShell } from "../../app/shell/ShellContext";
import { navigate } from "../../app/routes";
import { useEventVersion } from "../../matrix/hooks";
import { displayNameFor } from "../../matrix/rooms";
import { useGateway } from "../../agent/useGateway";
import type { GatewayDelegation, GatewayDelivery } from "../../agent/gateway";
import { Empty, NotConfigured } from "../../components/primitives";
import { relativeTime } from "../../matrix/timeline";

type Tab = "rooms" | "security" | "gateway";

interface AuditRow {
  roomId: string;
  ev: MatrixEvent;
  kind: string;
  text: string;
  tone: "danger" | "warn" | undefined;
}

/**
 * Honest audit: only what Matrix and the gateway can actually attest, from
 * loaded history. Matrix is not an enterprise audit log and this view says so.
 */
export function AuditScreen() {
  const client = useClient();
  const shell = useShell();
  const gateway = useGateway();
  const [tab, setTab] = useState<Tab>("rooms");
  const v = useEventVersion(client, [ClientEvent.Room, RoomEvent.Timeline, RoomEvent.Redaction]);

  const rows = useMemo(() => {
    const out: AuditRow[] = [];
    let undecryptable = 0;
    for (const room of client.getRooms()) {
      if (room.getMyMembership() !== "join") continue;
      for (const ev of room.getLiveTimeline().getEvents()) {
        const who = displayNameFor(room, ev.getSender() ?? "", client);
        const t = ev.getType();
        if (ev.isDecryptionFailure()) undecryptable++;
        if (ev.isRedacted()) {
          const by = ev.getUnsigned().redacted_because?.sender;
          out.push({ roomId: room.roomId, ev, kind: "Redaction", text: `${by ? displayNameFor(room, by, client) : "Someone"} deleted a message from ${who}`, tone: "warn" });
        } else if (t === EventType.RoomMember) {
          const m = ev.getContent().membership;
          if ((m === "leave" && ev.getSender() !== ev.getStateKey()) || m === "ban")
            out.push({ roomId: room.roomId, ev, kind: m === "ban" ? "Ban" : "Removal", text: `${who} ${m === "ban" ? "banned" : "removed"} ${displayNameFor(room, ev.getStateKey() ?? "", client)}${ev.getContent().reason ? ` — ${ev.getContent().reason}` : ""}`, tone: "danger" });
        } else if (t === EventType.RoomPowerLevels) {
          out.push({ roomId: room.roomId, ev, kind: "Permissions", text: `${who} changed power levels`, tone: undefined });
        } else if (t === EventType.RoomEncryption) {
          out.push({ roomId: room.roomId, ev, kind: "Encryption", text: `${who} enabled end-to-end encryption`, tone: undefined });
        } else if (t === EventType.RoomJoinRules || t === EventType.RoomHistoryVisibility) {
          out.push({ roomId: room.roomId, ev, kind: "Access", text: `${who} changed ${t === EventType.RoomJoinRules ? "who can join" : "history visibility"}`, tone: undefined });
        }
      }
    }
    out.sort((a, b) => b.ev.getTs() - a.ev.getTs());
    return { out, undecryptable };
  }, [client, v]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div data-sec="green" data-screen="" style={{ display: "flex", flexDirection: "column", overflow: "hidden", height: "100%" }}>
      <div data-toolrail="">
        <div data-tabstrip="" role="tablist" aria-label="Audit section">
          <button type="button" data-tab="" role="tab" aria-selected={tab === "rooms"} onClick={() => setTab("rooms")}>Room events<span data-count="">{rows.out.length}</span></button>
          <button type="button" data-tab="" role="tab" aria-selected={tab === "security"} onClick={() => setTab("security")}>Security</button>
          <button type="button" data-tab="" role="tab" aria-selected={tab === "gateway"} onClick={() => setTab("gateway")}>Gateway</button>
        </div>
        <span data-meta="" data-hidenarrow="" style={{ marginLeft: "auto" }}>From loaded history only</span>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: "18px var(--gut) 26px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          {tab === "rooms" ? (
            <div data-card="" data-pad="none">
              <div data-rows="" data-gap="flush" role="list">
                {rows.out.map((r) => (
                  <div key={(r.ev.getId() ?? "") + r.kind} data-row="" data-state="" role="listitem" style={{ cursor: "pointer" }} onClick={() => shell.openRoom(r.roomId, { eventId: r.ev.getId() })}>
                    <span data-dot="" data-tone={r.tone} />
                    <div data-fill="">
                      <div data-strong="">{r.text}</div>
                      <div data-meta="">{client.getRoom(r.roomId)?.name} · {relativeTime(r.ev.getTs())}</div>
                    </div>
                    <span data-tag="">{r.kind}</span>
                  </div>
                ))}
                <Empty title="Nothing to report">No redactions, removals, bans or permission changes in loaded history.</Empty>
              </div>
            </div>
          ) : tab === "security" ? (
            <div data-card="" data-pad="none">
              <div data-rows="" data-gap="flush">
                <div data-row="">
                  <span data-dot="" data-tone={rows.undecryptable ? "warn" : "ok"} />
                  <div data-fill="">
                    <div data-strong="">{rows.undecryptable} undecryptable message{rows.undecryptable === 1 ? "" : "s"} in loaded history</div>
                    <div data-meta="">Restore key backup or verify this session in Workspace → Security.</div>
                  </div>
                  <button data-btn="" data-state="" onClick={() => navigate({ screen: "workspace", tab: "security" })}>Open security</button>
                </div>
              </div>
            </div>
          ) : (
            <GatewayAudit configured={gateway.configured} />
          )}
        </div>
      </div>
    </div>
  );
}

function GatewayAudit({ configured }: { configured: boolean }) {
  const gateway = useGateway();
  const client = useClient();
  const [d, setD] = useState<GatewayDelegation[]>([]);
  const [f, setF] = useState<GatewayDelivery[]>([]);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    if (!gateway.client) return;
    Promise.all([gateway.client.delegations(100), gateway.client.deliveries("failed", 100)]).then(
      ([a, b]) => {
        setD(a.filter((x) => x.status !== "invoked"));
        setF(b);
      },
      (e: Error) => setErr(e.message),
    );
  }, [gateway.client]);
  if (!configured) return <NotConfigured title="Agent Gateway not configured">Blocked delegations and failed deliveries are recorded by the gateway; configure <span data-num="">gatewayUrl</span> to see them.</NotConfigured>;
  if (err) return <NotConfigured title="Gateway unreachable">{err}</NotConfigured>;
  const n = (u: string) => client.getUser(u)?.displayName ?? u;
  return (
    <div data-card="" data-pad="none">
      <div data-rows="" data-gap="flush" role="list">
        {d.map((x, i) => (
          <div key={`d${i}`} data-row="" role="listitem">
            <span data-dot="" data-tone="danger" />
            <div data-fill="">
              <div data-strong="">{n(x.sourceMatrixUserId)} → {n(x.targetMatrixUserId)} stopped: {x.status.replace(/_/g, " ")}</div>
              <div data-meta="">{client.getRoom(x.roomId)?.name ?? x.roomId} · depth {x.depth} · {new Date(x.createdAt).toLocaleString()}</div>
            </div>
          </div>
        ))}
        {f.map((x) => (
          <div key={x.matrixEventId + x.targetMatrixUserId} data-row="" role="listitem">
            <span data-dot="" data-tone="warn" />
            <div data-fill="">
              <div data-strong="">Delivery to {n(x.targetMatrixUserId)} failed after {x.attempts} attempts</div>
              <div data-meta="">{x.lastError ?? ""}</div>
            </div>
          </div>
        ))}
        <Empty title="Clean">No blocked delegations or failed deliveries.</Empty>
      </div>
    </div>
  );
}
