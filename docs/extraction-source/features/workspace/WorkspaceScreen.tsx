import { useEffect, useState } from "react";
import { ClientEvent, RoomStateEvent, UserEvent } from "matrix-js-sdk";
import { useApp, useClient, useConnection } from "../../app/context";
import { navigate } from "../../app/routes";
import { useShell } from "../../app/shell/ShellContext";
import { useEventVersion } from "../../matrix/hooks";
import { groupRooms } from "../../matrix/rooms";
import { useGateway } from "../../agent/useGateway";
import { NotConfigured, useToast } from "../../components/primitives";
import { SecurityPanel } from "./SecurityPanel";

type Tab = "connection" | "spaces" | "security" | "account";

export function WorkspaceScreen({ tab: initial }: { tab: string | null }) {
  const [tab, setTab] = useState<Tab>((["connection", "spaces", "security", "account"] as Tab[]).includes(initial as Tab) ? (initial as Tab) : "connection");
  const go = (t: Tab) => {
    setTab(t);
    navigate({ screen: "workspace", tab: t }, { replace: true });
  };
  return (
    <div data-sec="cyan" data-screen="" style={{ display: "flex", flexDirection: "column", overflow: "hidden", height: "100%" }}>
      <div data-toolrail="">
        <div data-tabstrip="" role="tablist" aria-label="Workspace section">
          {(["connection", "spaces", "security", "account"] as Tab[]).map((t) => (
            <button key={t} type="button" data-tab="" role="tab" aria-selected={tab === t} onClick={() => go(t)}>
              {t[0]!.toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: "18px var(--gut) 26px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }} role="tabpanel">
          {tab === "connection" ? <Connection /> : tab === "spaces" ? <Spaces /> : tab === "security" ? <SecurityPanel /> : <Account />}
        </div>
      </div>
    </div>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div data-row="">
      <div data-fill="">
        <div data-meta="">{k}</div>
        <div data-strong="" style={{ overflowWrap: "anywhere" }}>{v}</div>
      </div>
    </div>
  );
}

function Connection() {
  const client = useClient();
  const conn = useConnection();
  const { config } = useApp();
  const gateway = useGateway();
  const [versions, setVersions] = useState<string[] | null>(null);
  useEffect(() => {
    void client.getVersions().then((v) => setVersions(v.versions.slice(-3)), () => setVersions([]));
  }, [client]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--s5)" }}>
      <div data-card="" data-pad="none">
        <div data-rows="" data-gap="flush">
          <KV k="Homeserver" v={<span data-num="">{client.getHomeserverUrl()}</span>} />
          <KV k="Signed in as" v={<span data-num="">{client.getSafeUserId()}</span>} />
          <KV k="Session" v={<span data-num="">{client.getDeviceId()}</span>} />
          <KV k="Sync" v={`${conn.phase}${conn.error ? ` — ${conn.error}` : ""}`} />
          <KV k="Spec versions" v={versions === null ? "…" : versions.join(", ") || "unknown"} />
        </div>
      </div>
      <div data-eyebrow="">Agent Gateway</div>
      {gateway.configured ? (
        <div data-card="" data-pad="none">
          <div data-rows="" data-gap="flush">
            <KV k="Read API" v={<span data-num="">{config.gatewayUrl}</span>} />
            <KV k="Status" v={gateway.error ? `Unreachable — ${gateway.error}` : gateway.status ? `OK · v${gateway.status.gateway.version} · ${gateway.status.agents.length} agents` : "Checking…"} />
          </div>
        </div>
      ) : (
        <NotConfigured title="No gateway configured">
          Agents on native Matrix adapters (like Hermes) work without it. Set <span data-num="">gatewayUrl</span> in config.json to see Letta/HTTP agent health here.
        </NotConfigured>
      )}
    </div>
  );
}

function Spaces() {
  const client = useClient();
  const shell = useShell();
  useEventVersion(client, [ClientEvent.Room, RoomStateEvent.Events]);
  const { groups, spaces } = groupRooms(client);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--s4)" }}>
      <div style={{ display: "flex", gap: "var(--s2)" }}>
        <button data-btn="fill" data-state="" onClick={() => shell.openCreateRoom({ space: true })}>New space</button>
        <button data-btn="" data-state="" onClick={() => shell.openCreateRoom()}>New room</button>
      </div>
      {!spaces.length ? (
        <NotConfigured title="No spaces yet">
          Spaces organise rooms in the dock — for example <em>AI Team</em> with General, Life, Career and Homelab. Create one, then add rooms to it.
        </NotConfigured>
      ) : null}
      {groups.map((g) => (
        <div key={g.id} data-card="" data-pad="none">
          <div data-eyebrow="" style={{ padding: "var(--s4) var(--s5) var(--s2)" }}>
            {g.label}
            {g.spaceId ? (
              <button data-btn="text" data-state="" data-push="" onClick={() => shell.openCreateRoom({ spaceId: g.spaceId })}>
                Add room
              </button>
            ) : null}
          </div>
          <div data-rows="" data-gap="flush">
            {g.rooms.map((r) => (
              <div key={r.roomId} data-row="" data-state="" style={{ cursor: "pointer" }} onClick={() => shell.openRoom(r.roomId)}>
                <div data-fill="">
                  <div data-strong="">{r.name}</div>
                  <div data-meta="">{r.alias ?? r.roomId}{r.encrypted ? " · encrypted" : ""}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Account() {
  const client = useClient();
  const { manager } = useApp();
  const toast = useToast();
  const user = client.getUser(client.getSafeUserId());
  useEventVersion(user, [UserEvent.DisplayName]);
  const [name, setName] = useState(user?.displayName ?? "");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--s5)", maxWidth: 560 }}>
      <form
        data-card=""
        data-pad="roomy"
        onSubmit={(e) => {
          e.preventDefault();
          void client.setDisplayName(name.trim()).then(() => toast("Display name saved", name.trim()), (err: Error) => toast("Couldn't save", err.message, "danger"));
        }}
        style={{ display: "flex", flexDirection: "column", gap: "var(--s3)" }}
      >
        <div data-formfield="">
          <label htmlFor="dn">Display name</label>
          <input id="dn" data-field="" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
        </div>
        <button data-btn="" data-state="" style={{ alignSelf: "flex-start" }}>Save</button>
      </form>
      <div data-card="" data-pad="roomy">
        <div data-eyebrow="">Sign out</div>
        <p data-meta="">Signs this session out on the homeserver and deletes the local message cache and encryption keys from this browser. Set up key backup first if you use encrypted rooms.</p>
        <button data-btn="" data-state="" data-tone="danger" onClick={() => void manager.logout()}>
          Sign out
        </button>
      </div>
    </div>
  );
}
