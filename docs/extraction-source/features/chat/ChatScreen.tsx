import { ClientEvent, RoomEvent } from "matrix-js-sdk";
import { useClient, useConnection } from "../../app/context";
import type { Route } from "../../app/routes";
import { useShell } from "../../app/shell/ShellContext";
import { useEventVersion } from "../../matrix/hooks";
import { groupRooms } from "../../matrix/rooms";
import { agentDirectory, runtimeLabel } from "../../agent/profile";
import { ConversationPane } from "./ConversationPane";
import { openDirectMessage } from "../../matrix/rooms";
import { useToast } from "../../components/primitives";

export function ChatScreen({ route }: { route: Route }) {
  if (route.roomId) return <ConversationPane key={`${route.roomId}|${route.threadId ?? ""}`} roomId={route.roomId} threadId={route.threadId} eventId={route.eventId} />;
  return <Launcher />;
}

/** No room open: the design's launcher, populated from live Matrix state only. */
function Launcher() {
  const client = useClient();
  const conn = useConnection();
  const shell = useShell();
  const toast = useToast();
  useEventVersion(client, [ClientEvent.Room, RoomEvent.Timeline, ClientEvent.Sync]);
  const me = client.getUser(client.getSafeUserId());
  const name = me?.displayName ?? client.getSafeUserId().replace(/^@/, "").split(":")[0];
  const recent = groupRooms(client)
    .groups.flatMap((g) => g.rooms)
    .sort((a, b) => b.lastTs - a.lastTs)
    .filter((r, i, a) => a.findIndex((x) => x.roomId === r.roomId) === i)
    .slice(0, 4);
  const agents = [...agentDirectory(client).values()].slice(0, 4);

  return (
    <div data-screen="" style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "calc(var(--s6) + var(--s1))", height: "100%" }}>
      <div style={{ width: "100%", maxWidth: 740 }}>
        <div data-enter="" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--s6)", marginBottom: "calc(var(--s6) + var(--s2))" }}>
          <div data-grow="" style={{ width: 66, height: 66, borderRadius: "var(--r-xl)", background: "linear-gradient(145deg,var(--ai),var(--ai-strong) 55%,var(--ai-deep))", display: "grid", placeItems: "center", boxShadow: "0 16px 42px var(--ai-glow),inset 0 1px 0 var(--hi)", position: "relative", overflow: "hidden" }}>
            <span data-sheen="" />
            <span data-mark="" style={{ width: 36, height: 36, color: "var(--on-accent)" }} />
          </div>
          <div style={{ fontSize: "var(--t-hero)", fontWeight: 700, letterSpacing: "var(--tk-display)", textAlign: "center" }}>Where should we start, {name}?</div>
          <div style={{ fontSize: "var(--t-title)", color: "var(--app-dim)", textAlign: "center", maxWidth: 470, marginTop: "calc(-1 * var(--s2))" }}>
            {conn.hasSynced ? "Open a room, or mention an agent in a thread to put it to work." : "Syncing your rooms from the homeserver…"}
          </div>
        </div>
        {recent.length ? (
          <>
            <div data-eyebrow="" style={{ justifyContent: "center", marginBottom: "var(--s3)" }}>
              Recent rooms
            </div>
            <div data-stagger="" data-enter="3" style={{ display: "flex", flexWrap: "wrap", gap: "var(--s2)", justifyContent: "center" }}>
              {recent.map((r) => (
                <button key={r.roomId} data-chip="" data-state="" onClick={() => shell.openRoom(r.roomId)} style={{ padding: "var(--s3) var(--s5)", fontSize: "var(--t-ctl)", cursor: "pointer" }}>
                  {r.isDm ? "" : "# "}
                  {r.name}
                </button>
              ))}
            </div>
          </>
        ) : null}
        {agents.length ? (
          <>
            <div data-eyebrow="" style={{ justifyContent: "center", margin: "var(--s6) 0 var(--s3)" }}>
              Message an agent
            </div>
            <div data-stagger="" style={{ display: "flex", flexWrap: "wrap", gap: "var(--s2)", justifyContent: "center" }}>
              {agents.map((a) => (
                <button
                  key={a.userId}
                  data-chip=""
                  data-state=""
                  onClick={async () => {
                    try {
                      shell.openRoom(await openDirectMessage(client, a.userId, { encrypted: false }));
                    } catch (e) {
                      toast("Couldn't open a DM", (e as Error).message, "danger");
                    }
                  }}
                  style={{ padding: "var(--s3) var(--s5)", fontSize: "var(--t-ctl)", cursor: "pointer" }}
                >
                  {client.getUser(a.userId)?.displayName ?? a.userId}
                  <span data-tag="" data-solid="">
                    {runtimeLabel(a.profile.runtime)}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : null}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "var(--s6)", gap: "var(--s2)" }}>
          <button data-btn="fill" data-state="" onClick={() => shell.openCreateRoom()}>
            New room
          </button>
          <button data-btn="" data-state="" onClick={() => shell.openPalette()}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
