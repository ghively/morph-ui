import { useState } from "react";
import { ClientEvent, RoomEvent, RoomStateEvent } from "matrix-js-sdk";
import { useClient } from "../context";
import { useRoute } from "../routes";
import { useShell } from "./ShellContext";
import { useEventVersion } from "../../matrix/hooks";
import { groupRooms } from "../../matrix/rooms";
import { I } from "../../components/icons";
import { useToast } from "../../components/primitives";

/**
 * Spaces and rooms, in the dock's recent-chats language (src/CpiThreads.dc.html):
 * eyebrow per Space, one thread-row per room, unread and mention counts.
 */
export function RoomNav({ inDock }: { inDock?: boolean }) {
  const client = useClient();
  const route = useRoute();
  const shell = useShell();
  const toast = useToast();
  const [q, setQ] = useState("");
  useEventVersion(client, [ClientEvent.Room, ClientEvent.DeleteRoom, ClientEvent.AccountData, RoomEvent.Timeline, RoomEvent.Name, RoomEvent.MyMembership, RoomEvent.UnreadNotifications, RoomEvent.Tags, RoomStateEvent.Events]);
  const { invites, groups } = groupRooms(client, q);
  const fade = inDock ? { "data-fade": "" } : {};
  const empty = !invites.length && groups.every((g) => !g.rooms.length);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div {...fade} style={{ padding: "var(--s5) var(--s3) var(--seam)", display: "flex", alignItems: "center", gap: "var(--s2)" }}>
        <div data-searchcap="" style={{ maxWidth: "none", height: 30, flex: 1, minWidth: 0 }}>
          {I.search(14)}
          <input
            placeholder="Filter rooms"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ flex: 1, minWidth: 0, border: 0, outline: "none", background: "transparent", color: "var(--app-rail-text)", fontSize: "var(--t-ctl)" }}
            aria-label="Filter rooms"
          />
        </div>
        <button data-iconbtn="" data-push="" onClick={() => shell.openBrowse()} title="Browse rooms — spaces, the directory, or an address" aria-label="Browse rooms" style={{ flex: "none", width: 30, height: 30, color: "var(--app-rail-dim)" }}>
          {I.people(15)}
        </button>
      </div>
      <nav data-rows="" aria-label="Rooms" style={{ display: "flex", flexDirection: "column" }}>
        {invites.length ? (
          <>
            <div {...fade} data-eyebrow="" style={{ margin: "var(--s5) var(--s5) var(--s2)" }}>
              Invites
            </div>
            {invites.map((r) => (
              <div {...fade} key={r.roomId} style={{ padding: "0 var(--s3)" }}>
                <div data-threadrow="" role="presentation">
                  <button
                    data-state=""
                    title={`Join ${r.name}`}
                    onClick={async () => {
                      try {
                        await client.joinRoom(r.roomId);
                        shell.openRoom(r.roomId);
                      } catch (e) {
                        toast("Couldn't join", (e as Error).message, "danger");
                      }
                    }}
                  >
                    {r.name}
                  </button>
                  <span data-tag="" data-solid="">
                    Join
                  </span>
                  <button data-iconbtn="" aria-label={`Decline ${r.name}`} title="Decline" onClick={() => void client.leave(r.roomId)}>
                    {I.close(12)}
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : null}
        {groups.map((g) => (
          <div key={g.id} role="group" aria-label={g.label} style={{ display: "contents" }}>
            <div {...fade} data-eyebrow="" style={{ margin: "var(--s5) var(--s5) var(--s2)" }}>
              {g.label}
            </div>
            {g.rooms.map((r) => {
              const active = route.roomId === r.roomId;
              return (
                <div {...fade} key={r.roomId} style={{ padding: "0 var(--s3)" }}>
                  <div data-threadrow="" data-on={String(active)} role="presentation">
                    <button data-state="" onClick={() => shell.openRoom(r.roomId)} aria-current={active ? "page" : undefined} title={r.alias ?? r.name}>
                      {r.isDm ? "" : "# "}
                      {r.name.replace(/^#/, "")}
                      {r.encrypted ? <span style={{ marginLeft: 6, color: "var(--app-rail-faint)" }} aria-label="encrypted">{I.lock(10)}</span> : null}
                    </button>
                    {r.highlight > 0 ? (
                      <span data-count="" data-tone="danger" aria-label={`${r.highlight} mentions`} data-mention="">
                        @{r.highlight}
                      </span>
                    ) : r.unread > 0 ? (
                      <span data-count="" aria-label={`${r.unread} unread`}>
                        {r.unread}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
            {g.spaceId ? (
              <div {...fade} style={{ padding: "var(--seam) var(--s5) 0" }}>
                {!g.rooms.length ? <div data-meta="">No joined rooms in this space</div> : null}
                <button data-chip="" data-state="" onClick={() => shell.openBrowse({ spaceId: g.spaceId })} title={`Browse rooms in ${g.label}`}>
                  Browse {g.label}
                </button>
              </div>
            ) : null}
          </div>
        ))}
        {empty ? (
          <div {...fade} data-empty="" style={{ padding: "var(--s5) var(--s4) var(--s3)", gap: "var(--s2)" }}>
            <div data-tile="">{I.chats()}</div>
            <div data-eyebrow="">{q ? "No rooms match" : "No rooms yet"}</div>
            <div>{q ? "Try another name." : "Browse what already exists, or start something new."}</div>
            <div style={{ display: "flex", gap: "var(--s2)", flexWrap: "wrap", justifyContent: "center" }}>
              <button data-btn="accent" data-state="" onClick={() => shell.openBrowse()} style={{ height: 30 }}>
                Browse rooms
              </button>
              <button data-btn="" data-state="" onClick={() => shell.openCreateRoom()} style={{ height: 30 }}>
                New room
              </button>
            </div>
          </div>
        ) : null}
      </nav>
    </div>
  );
}
