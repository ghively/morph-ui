import { useMemo, useState } from "react";
import { ClientEvent, EventType, MsgType, RoomEvent, RoomStateEvent, type MatrixEvent } from "matrix-js-sdk";
import { useClient } from "../../app/context";
import { useShell } from "../../app/shell/ShellContext";
import { useEventVersion } from "../../matrix/hooks";
import { formatBytes } from "../../matrix/media";
import { msgtype, previewText, relativeTime } from "../../matrix/timeline";
import { displayNameFor } from "../../matrix/rooms";
import { getSaved, toggleSaved } from "./saved";
import { Empty } from "../../components/primitives";

type Tab = "pinned" | "saved" | "media";

export function LibraryScreen() {
  const client = useClient();
  const shell = useShell();
  const [tab, setTab] = useState<Tab>("pinned");
  const v = useEventVersion(client, [ClientEvent.AccountData, ClientEvent.Room, RoomStateEvent.Events, RoomEvent.Timeline]);

  const pinned = useMemo(() => {
    const out: { roomId: string; eventId: string }[] = [];
    for (const room of client.getRooms()) {
      if (room.getMyMembership() !== "join") continue;
      const ids = room.currentState.getStateEvents(EventType.RoomPinnedEvents, "")?.getContent()?.pinned;
      if (Array.isArray(ids)) for (const id of ids) if (typeof id === "string") out.push({ roomId: room.roomId, eventId: id });
    }
    return out;
  }, [client, v]); // eslint-disable-line react-hooks/exhaustive-deps
  const saved = useMemo(() => getSaved(client), [client, v]); // eslint-disable-line react-hooks/exhaustive-deps
  const media = useMemo(() => {
    const out: { roomId: string; ev: MatrixEvent }[] = [];
    for (const room of client.getRooms()) {
      if (room.getMyMembership() !== "join") continue;
      const evs = [...room.getLiveTimeline().getEvents(), ...room.getThreads().flatMap((t) => t.events)];
      for (const ev of evs) {
        const m = msgtype(ev);
        if ((m === MsgType.Image || m === MsgType.File || m === MsgType.Audio || m === MsgType.Video) && !ev.isRedacted()) out.push({ roomId: room.roomId, ev });
      }
    }
    return out.sort((a, b) => b.ev.getTs() - a.ev.getTs());
  }, [client, v]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div data-sec="gold" data-screen="" style={{ display: "flex", flexDirection: "column", overflow: "hidden", height: "100%" }}>
      <div data-toolrail="">
        <div data-tabstrip="" role="tablist" aria-label="Library section">
          <button type="button" data-tab="" role="tab" aria-selected={tab === "pinned"} onClick={() => setTab("pinned")}>Pinned<span data-count="">{pinned.length}</span></button>
          <button type="button" data-tab="" role="tab" aria-selected={tab === "saved"} onClick={() => setTab("saved")}>Saved<span data-count="">{saved.length}</span></button>
          <button type="button" data-tab="" role="tab" aria-selected={tab === "media"} onClick={() => setTab("media")}>Media &amp; files<span data-count="">{media.length}</span></button>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: "18px var(--gut) 26px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div data-card="" data-pad="none">
            <div data-rows="" data-gap="flush" role="list">
              {tab === "pinned" &&
                pinned.map((p) => {
                  const room = client.getRoom(p.roomId);
                  const ev = room?.findEventById(p.eventId);
                  return (
                    <div key={p.roomId + p.eventId} data-row="" data-state="" role="listitem" style={{ cursor: "pointer" }} onClick={() => shell.openRoom(p.roomId, { eventId: p.eventId })}>
                      <div data-fill="">
                        <div data-strong="">{ev ? previewText(ev, 120) : "Pinned message (not in loaded history)"}</div>
                        <div data-meta="">{room?.name}{ev ? ` · ${displayNameFor(room, ev.getSender() ?? "", client)}` : ""}</div>
                      </div>
                    </div>
                  );
                })}
              {tab === "saved" &&
                saved.map((s) => (
                  <div key={s.eventId} data-row="" data-state="" role="listitem">
                    <div data-fill="" style={{ cursor: "pointer" }} onClick={() => shell.openRoom(s.roomId, { eventId: s.eventId })}>
                      <div data-strong="">{s.preview || "Saved message"}</div>
                      <div data-meta="">{client.getRoom(s.roomId)?.name ?? s.roomId} · saved {relativeTime(s.savedAt)}</div>
                    </div>
                    <button data-btn="text" data-state="" onClick={() => void toggleSaved(client, s)}>Remove</button>
                  </div>
                ))}
              {tab === "media" &&
                media.map(({ roomId, ev }) => {
                  const c = ev.getContent();
                  return (
                    <div key={ev.getId()} data-row="" data-state="" role="listitem" style={{ cursor: "pointer" }} onClick={() => shell.openArtifact(roomId, ev)}>
                      <div data-fill="">
                        <div data-strong="">{String(c.filename ?? c.body ?? "file")}</div>
                        <div data-meta="">{client.getRoom(roomId)?.name} · {formatBytes((c.info as { size?: number } | undefined)?.size)} · {relativeTime(ev.getTs())}</div>
                      </div>
                      <span data-tag="">{msgtype(ev).replace("m.", "")}</span>
                    </div>
                  );
                })}
              <Empty title={tab === "pinned" ? "Nothing pinned" : tab === "saved" ? "Nothing saved" : "No media in loaded history"}>
                {tab === "pinned" ? "Pinned events from your rooms appear here." : tab === "saved" ? "Use the bookmark action on any message." : "Files and images shared in loaded timelines appear here; older history loads as you scroll rooms."}
              </Empty>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
