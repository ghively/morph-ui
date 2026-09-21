import { useEffect } from "react";
import { NotificationCountType, RoomEvent, ThreadEvent, type Room, type Thread } from "matrix-js-sdk";
import { useClient } from "../context";
import type { Route } from "../routes";
import { useShell } from "./ShellContext";
import { useEventVersion } from "../../matrix/hooks";
import { displayNameFor } from "../../matrix/rooms";
import { previewText, relativeTime } from "../../matrix/timeline";
import { I } from "../../components/icons";
import { ConversationPane } from "../../features/chat/ConversationPane";

/**
 * The thread drawer — the frame's third track, between the rooms rail and the
 * conversation.
 *
 * It holds the open room's Matrix threads, and it *shows* the one you pick:
 * the drawer widens (`data-left="wide"`) and a conversation renders inside it.
 * That replaced the second pane — a thread no longer splits the hole, and
 * "Open in main pane" below is the one affordance that promotes it.
 */
export function LeftPanel({ open, route }: { open: boolean; route: Route }) {
  const client = useClient();
  const shell = useShell();
  const room = route.roomId ? client.getRoom(route.roomId) : null;
  const drawer = shell.drawerThread && shell.drawerThread.roomId === route.roomId ? shell.drawerThread : null;
  return (
    <div data-leftpanel="" data-slot="left" data-open={String(open)} data-sec="blue" aria-hidden={!open} inert={!open ? true : undefined}>
      <div style={{ height: "var(--h-bar)", flex: "none", display: "flex", alignItems: "center", gap: "var(--s3)", padding: "0 var(--s2) 0 var(--s2)" }}>
        {drawer ? (
          <button data-iconbtn="" onClick={() => shell.closeDrawerThread()} title="Back to threads" aria-label="Back to the thread list">
            {I.back()}
          </button>
        ) : (
          <div data-tile="" style={{ width: 26, height: 26, marginLeft: "var(--s3)" }}>
            {I.threads(14)}
          </div>
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div data-strong="" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{drawer ? "Thread" : "Threads"}</div>
          <div style={{ fontSize: "var(--t-meta)", color: "var(--app-rail-faint)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{room ? room.name : "No room open"}</div>
        </div>
        {drawer ? (
          <button
            data-iconbtn=""
            onClick={() => shell.openThread(drawer.roomId, drawer.threadId, { main: true })}
            title="Open in main pane"
            aria-label="Open this thread in the main pane"
            style={{ color: "var(--app-rail-dim)" }}
          >
            {I.swap()}
          </button>
        ) : null}
        <button data-iconbtn="" onClick={() => shell.toggleLeft(false)} title="Close threads" aria-label="Close threads" aria-expanded={open} aria-controls="shell-threads" style={{ color: "var(--app-rail-dim)" }}>
          {I.close()}
        </button>
      </div>
      <div id="shell-threads" style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {drawer && room ? (
          <ConversationPane key={`${drawer.roomId}|${drawer.threadId}`} roomId={drawer.roomId} threadId={drawer.threadId} eventId={null} secondary />
        ) : room ? (
          <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: "var(--s1) 0 var(--s4)", display: "flex", flexDirection: "column" }}>
            <ThreadList room={room} activeThread={route.threadId} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ThreadList({ room, activeThread }: { room: Room; activeThread: string | null }) {
  const client = useClient();
  const shell = useShell();
  useEventVersion(room, [ThreadEvent.New, ThreadEvent.Update, ThreadEvent.NewReply, ThreadEvent.Delete, RoomEvent.UnreadNotifications, RoomEvent.Timeline]);
  useEffect(() => {
    void room.fetchRoomThreads().catch(() => {});
  }, [room]);
  const threads = [...room.getThreads()].sort((a, b) => lastTs(b) - lastTs(a));
  return (
    <div data-rows="" style={{ display: "flex", flexDirection: "column" }} role="list" aria-label={`Threads in ${room.name}`}>
      <div style={{ padding: "0 var(--s3)", marginTop: "var(--s3)" }} role="listitem">
        <div data-threadrow="" data-on={String(!activeThread)}>
          <button data-state="" onClick={() => shell.openRoom(room.roomId)} aria-current={!activeThread ? "page" : undefined}>
            Room timeline
          </button>
        </div>
      </div>
      <div data-eyebrow="" style={{ margin: "var(--s5) var(--s5) var(--s2)" }}>
        {threads.length} thread{threads.length === 1 ? "" : "s"}
      </div>
      {threads.map((t) => {
        const unread = room.getThreadUnreadNotificationCount(t.id, NotificationCountType.Total);
        const hl = room.getThreadUnreadNotificationCount(t.id, NotificationCountType.Highlight);
        const last = t.replyToEvent ?? t.rootEvent;
        const title = previewText(t.rootEvent, 64) || "Thread";
        return (
          <div key={t.id} style={{ padding: "0 var(--s3)" }} role="listitem">
            <div data-threadrow="" data-on={String(activeThread === t.id)} data-threadlink="">
              <button data-state="" onClick={() => shell.openThread(room.roomId, t.id)} aria-current={activeThread === t.id ? "page" : undefined} title={title}>
                <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</span>
                <span data-meta="" style={{ display: "block", fontWeight: 400 }}>
                  {t.length} repl{t.length === 1 ? "y" : "ies"} · {last?.getSender() ? displayNameFor(room, last.getSender()!, client) : ""} · {relativeTime(lastTs(t))}
                </span>
              </button>
              {hl > 0 ? (
                <span data-count="" data-tone="danger" aria-label={`${hl} mentions`}>
                  @{hl}
                </span>
              ) : unread > 0 ? (
                <span data-dot="" data-live="" aria-label="Unread replies" style={{ width: 7, height: 7, marginRight: 8 }} />
              ) : null}
              <span data-threadacts="">
                <button data-iconbtn="" title="Open in main pane" aria-label="Open this thread in the main pane" onClick={() => shell.openThread(room.roomId, t.id, { main: true })}>
                  {I.swap(13)}
                </button>
              </span>
            </div>
          </div>
        );
      })}
      {!threads.length ? (
        <div data-meta="" style={{ padding: "var(--s2) var(--s5)" }}>
          Start a thread from any message — agents answer inside it.
        </div>
      ) : null}
    </div>
  );
}

function lastTs(t: Thread): number {
  return t.replyToEvent?.getTs() ?? t.rootEvent?.getTs() ?? 0;
}
