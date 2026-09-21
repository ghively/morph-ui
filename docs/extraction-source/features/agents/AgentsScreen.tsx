import { useEffect, useMemo, useState } from "react";
import { ClientEvent, RoomEvent, RoomStateEvent, ThreadEvent, UserEvent, type MatrixClient } from "matrix-js-sdk";
import { useClient } from "../../app/context";
import { useShell } from "../../app/shell/ShellContext";
import { navigate } from "../../app/routes";
import { useEventVersion } from "../../matrix/hooks";
import { agentDirectory, runtimeLabel, type DirectoryAgent } from "../../agent/profile";
import { useGateway } from "../../agent/useGateway";
import type { GatewayDelegation, GatewayDelivery } from "../../agent/gateway";
import { displayNameFor, openDirectMessage } from "../../matrix/rooms";
import { previewText, relativeTime } from "../../matrix/timeline";
import { Avatar, Empty, NotConfigured, useToast } from "../../components/primitives";
import { I } from "../../components/icons";

type Tab = "agents" | "threads" | "gateway";

interface ActiveThread {
  roomId: string;
  threadId: string;
  title: string;
  agents: string[];
  lastTs: number;
}

/** Recent activity and active threads per agent, from loaded Matrix timelines only. */
function activity(client: MatrixClient, agents: Set<string>) {
  const last = new Map<string, number>();
  const threads: ActiveThread[] = [];
  for (const room of client.getRooms()) {
    if (room.getMyMembership() !== "join") continue;
    for (const ev of room.getLiveTimeline().getEvents()) {
      const s = ev.getSender();
      if (s && agents.has(s)) last.set(s, Math.max(last.get(s) ?? 0, ev.getTs()));
    }
    for (const t of room.getThreads()) {
      const involved = new Set<string>();
      for (const ev of [t.rootEvent, ...t.events]) {
        const s = ev?.getSender();
        if (s && agents.has(s)) {
          involved.add(s);
          last.set(s, Math.max(last.get(s) ?? 0, ev!.getTs()));
        }
        for (const m of (ev?.getContent()["m.mentions"] as { user_ids?: string[] } | undefined)?.user_ids ?? []) if (agents.has(m)) involved.add(m);
      }
      if (involved.size) threads.push({ roomId: room.roomId, threadId: t.id, title: previewText(t.rootEvent, 80) || "Thread", agents: [...involved], lastTs: t.replyToEvent?.getTs() ?? t.rootEvent?.getTs() ?? 0 });
    }
  }
  threads.sort((a, b) => b.lastTs - a.lastTs);
  return { last, threads };
}

export function AgentsScreen() {
  const client = useClient();
  const shell = useShell();
  const toast = useToast();
  const gateway = useGateway();
  const [tab, setTab] = useState<Tab>("agents");
  const [q, setQ] = useState("");
  const v = useEventVersion(client, [ClientEvent.Room, ClientEvent.Sync, RoomStateEvent.Events, RoomEvent.Timeline, ThreadEvent.New, ThreadEvent.NewReply, UserEvent.Presence]);

  const dir = useMemo(() => agentDirectory(client), [client, v]); // eslint-disable-line react-hooks/exhaustive-deps
  // Gateway-provisioned agents that have not published a profile into any room we share still count.
  const agents: DirectoryAgent[] = useMemo(() => {
    const out = new Map(dir);
    for (const a of gateway.status?.agents ?? []) {
      if (!out.has(a.matrixUserId))
        out.set(a.matrixUserId, { userId: a.matrixUserId, profile: { kind: "agent", runtime: a.runtime, slug: a.slug, role: a.role, capabilities: a.capabilities ?? [], version: 1 }, rooms: [], updatedAt: 0 });
    }
    return [...out.values()];
  }, [dir, gateway.status]);
  const act = useMemo(() => activity(client, new Set(agents.map((a) => a.userId))), [client, agents, v]); // eslint-disable-line react-hooks/exhaustive-deps

  const f = q.trim().toLowerCase();
  const nameOf = (uid: string) => client.getUser(uid)?.displayName ?? gateway.status?.agents.find((a) => a.matrixUserId === uid)?.displayName ?? displayNameFor(null, uid);
  const shown = agents
    .filter((a) => !f || nameOf(a.userId).toLowerCase().includes(f) || a.userId.includes(f) || (a.profile.role ?? "").toLowerCase().includes(f) || a.profile.capabilities.some((c) => c.toLowerCase().includes(f)))
    .sort((a, b) => (act.last.get(b.userId) ?? 0) - (act.last.get(a.userId) ?? 0) || nameOf(a.userId).localeCompare(nameOf(b.userId)));

  return (
    <div data-sec="blue" data-screen="" style={{ display: "flex", flexDirection: "column", overflow: "hidden", height: "100%" }}>
      <div data-toolrail="">
        <div data-tabstrip="" role="tablist" aria-label="Agents section">
          <button type="button" data-tab="" role="tab" aria-selected={tab === "agents"} onClick={() => setTab("agents")}>
            Agents<span data-count="">{agents.length}</span>
          </button>
          <button type="button" data-tab="" role="tab" aria-selected={tab === "threads"} onClick={() => setTab("threads")}>
            Active threads<span data-count="">{act.threads.length}</span>
          </button>
          <button type="button" data-tab="" role="tab" aria-selected={tab === "gateway"} onClick={() => setTab("gateway")}>
            Gateway
          </button>
        </div>
        <div data-focusring="" data-search="" data-searchcap="">
          {I.search(14)}
          <input placeholder="Search agents, roles, capabilities" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1, minWidth: 0, border: 0, outline: "none", background: "transparent", color: "var(--app-text)", fontSize: "var(--t-ctl)" }} aria-label="Search agents" />
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "var(--s3)", flex: "none" }}>
          {gateway.status ? (
            <div data-chip="" data-solid="" data-tone={gateway.status.queue.failed ? "danger" : "ok"} data-hidenarrow="">
              <span data-dot="" data-live="" style={{ width: 5, height: 5 }} />
              {gateway.status.queue.pending} queued · {gateway.status.queue.failed} failed
            </div>
          ) : null}
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: "18px var(--gut) 26px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          {tab === "agents" ? (
            <div data-card="" data-pad="none">
              <div data-rows="" data-stagger="" data-gap="flush" role="list" aria-label="Agents">
                {shown.map((a) => {
                  const gw = gateway.status?.agents.find((g) => g.matrixUserId === a.userId);
                  const user = client.getUser(a.userId);
                  const presence = user?.presence;
                  const tone = gw ? (gw.health?.ok ? "ok" : "danger") : presence === "online" ? "ok" : presence === "unavailable" ? "warn" : undefined;
                  const statusText = gw ? (gw.health?.ok ? "backend healthy" : "backend unhealthy") : presence && presence !== "offline" ? presence : presence === "offline" ? "offline" : "status unknown";
                  const name = nameOf(a.userId);
                  const threads = act.threads.filter((t) => t.agents.includes(a.userId));
                  return (
                    <div key={a.userId} data-row="" data-size="lg" data-state="" role="listitem" data-agentrow={a.userId}>
                      <Avatar client={client} name={name} mxc={user?.avatarUrl} agent />
                      <div data-fill="">
                        <div style={{ display: "flex", alignItems: "center", gap: "var(--s2)", flexWrap: "wrap" }}>
                          <button type="button" data-strong="" data-lead="true" data-linkish="" onClick={() => shell.openDetails(a.rooms[0] ?? null, a.userId)}>
                            {name}
                          </button>
                          <span data-tag="" data-solid="">{runtimeLabel(a.profile.runtime)}</span>
                          {a.profile.role ? <span data-tag="">{a.profile.role}</span> : null}
                          <span data-meta="" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <span data-dot="" data-tone={tone} data-live={tone === "ok" ? "" : undefined} style={{ width: 6, height: 6 }} />
                            {statusText}
                          </span>
                        </div>
                        <div data-num="" style={{ color: "var(--app-faint)" }}>{a.userId}</div>
                        {a.profile.capabilities.length ? (
                          <div style={{ display: "flex", gap: "var(--s1)", flexWrap: "wrap", marginTop: "var(--s2)" }}>
                            {a.profile.capabilities.map((c) => (
                              <span key={c} data-chip="">{c}</span>
                            ))}
                          </div>
                        ) : null}
                        <div data-meta="" style={{ marginTop: "var(--s2)" }}>
                          {a.rooms.length} shared room{a.rooms.length === 1 ? "" : "s"} · {threads.length} active thread{threads.length === 1 ? "" : "s"}
                          {a.rooms.length ? ` · ${a.rooms.slice(0, 3).map((r) => client.getRoom(r)?.name ?? r).join(", ")}` : ""}
                        </div>
                      </div>
                      <div data-hidenarrow="" style={{ fontSize: "var(--t-small)", color: "var(--app-faint)", flex: "none", textAlign: "right" }}>
                        <div>Last active</div>
                        <div data-num="">{relativeTime(act.last.get(a.userId))}</div>
                      </div>
                      <div style={{ display: "flex", gap: "var(--s2)", flex: "none" }}>
                        <button
                          data-btn="accent"
                          data-state=""
                          style={{ height: 30, fontSize: "var(--t-small)" }}
                          onClick={async () => {
                            try {
                              shell.openRoom(await openDirectMessage(client, a.userId, { encrypted: false }));
                            } catch (e) {
                              toast("Couldn't open a DM", (e as Error).message, "danger");
                            }
                          }}
                        >
                          Message
                        </button>
                        {a.rooms[0] ? (
                          <button
                            data-btn=""
                            data-state=""
                            style={{ height: 30, fontSize: "var(--t-small)" }}
                            onClick={() => {
                              navigate({ roomId: a.rooms[0] });
                              window.setTimeout(() => shell.mention(a.userId, name), 60);
                            }}
                            aria-label={`Mention ${name} in ${client.getRoom(a.rooms[0])?.name ?? "a shared room"}`}
                          >
                            Mention
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
                <Empty title={f ? "No agents match" : "No agents yet"}>
                  {f ? "Try a different name, role or capability." : "Agents appear here when they publish a dev.chatuimorph.agent.profile into a room you share, or when the Agent Gateway reports them. Provision one with the gateway API."}
                </Empty>
              </div>
            </div>
          ) : null}
          {tab === "threads" ? (
            <div data-card="" data-pad="none">
              <div data-rows="" data-gap="flush" role="list" aria-label="Active agent threads">
                {act.threads.map((t) => (
                  <div key={t.threadId} data-row="" data-state="" role="listitem" style={{ cursor: "pointer" }} onClick={() => shell.openThread(t.roomId, t.threadId)}>
                    <div data-tile="">{I.thread()}</div>
                    <div data-fill="">
                      <div data-strong="">{t.title}</div>
                      <div data-meta="">
                        {client.getRoom(t.roomId)?.name} · {t.agents.map(nameOf).join(", ")}
                      </div>
                    </div>
                    <span data-num="" style={{ color: "var(--app-faint)" }}>{relativeTime(t.lastTs)}</span>
                  </div>
                ))}
                <Empty title="No agent threads">Mention an agent in a room — its reply starts a thread you'll see here.</Empty>
              </div>
            </div>
          ) : null}
          {tab === "gateway" ? <GatewayTab /> : null}
        </div>
      </div>
    </div>
  );
}

function GatewayTab() {
  const gateway = useGateway();
  const client = useClient();
  const [delegations, setDelegations] = useState<GatewayDelegation[] | null>(null);
  const [failures, setFailures] = useState<GatewayDelivery[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    if (!gateway.client) return;
    let live = true;
    Promise.all([gateway.client.delegations(50), gateway.client.deliveries("all", 50)]).then(
      ([d, f]) => live && (setDelegations(d), setFailures(f)),
      (e: Error) => live && setErr(e.message),
    );
    return () => {
      live = false;
    };
  }, [gateway.client]);
  if (!gateway.configured)
    return (
      <NotConfigured title="Agent Gateway not configured">
        Set <span data-num="">gatewayUrl</span> in config.json to see backend health, delegations and delivery retries. Agents still work — this view just can't see their backends.
      </NotConfigured>
    );
  if (err || gateway.error) return <NotConfigured title="Gateway unreachable">{err ?? gateway.error}</NotConfigured>;
  const name = (u: string) => client.getUser(u)?.displayName ?? u;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--s5)" }}>
      <div data-card="">
        <div data-eyebrow="">Gateway</div>
        <div data-meta="" style={{ marginTop: "var(--s2)" }}>
          Version <span data-num="">{gateway.status?.gateway.version ?? "—"}</span> · up since {gateway.status ? new Date(gateway.status.gateway.startedAt).toLocaleString() : "—"} · {gateway.status?.queue.pending ?? 0} pending · {gateway.status?.queue.running ?? 0} running ·{" "}
          {gateway.status?.queue.failed ?? 0} failed
        </div>
      </div>
      <div data-eyebrow="">Delegations</div>
      <div data-card="" data-pad="none">
        <div data-rows="" data-gap="flush">
          {(delegations ?? []).map((d, i) => (
            <div key={i} data-row="">
              <span data-dot="" data-tone={d.status === "invoked" ? "ok" : "danger"} />
              <div data-fill="">
                <div data-strong="">
                  {name(d.sourceMatrixUserId)} → {name(d.targetMatrixUserId)}
                </div>
                <div data-meta="">
                  {client.getRoom(d.roomId)?.name ?? d.roomId} · depth {d.depth} · {new Date(d.createdAt).toLocaleString()}
                </div>
              </div>
              <span data-tag="" data-solid="" data-tone={d.status === "invoked" ? "ok" : "danger"}>
                {d.status.replace(/_/g, " ")}
              </span>
            </div>
          ))}
          <Empty title="No delegations yet">Invocations appear here when someone mentions a gateway agent.</Empty>
        </div>
      </div>
      <div data-eyebrow="">Deliveries</div>
      <div data-card="" data-pad="none">
        <div data-rows="" data-gap="flush">
          {(failures ?? []).map((d) => (
            <div key={d.matrixEventId + d.targetMatrixUserId} data-row="">
              <span data-dot="" data-tone={d.status === "done" ? "ok" : d.status === "failed" ? "danger" : "warn"} />
              <div data-fill="">
                <div data-strong="">{name(d.targetMatrixUserId)}</div>
                <div data-meta="">
                  {d.attempts} attempt{d.attempts === 1 ? "" : "s"}
                  {d.lastError ? ` · ${d.lastError}` : ""}
                </div>
              </div>
              <span data-tag="" data-solid="">{d.status}</span>
            </div>
          ))}
          <Empty title="No deliveries recorded" />
        </div>
      </div>
    </div>
  );
}
