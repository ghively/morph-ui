import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Direction,
  MatrixEvent,
  MatrixEventEvent,
  RoomEvent,
  RoomMemberEvent,
  RoomStateEvent,
  ThreadEvent,
  type Room,
  type Thread,
} from "matrix-js-sdk";
import { useClient, useConnection } from "../../app/context";
import { useShell } from "../../app/shell/ShellContext";
import { navigate } from "../../app/routes";
import { useEventVersion } from "../../matrix/hooks";
import { mainTimeline, previewText, threadTimeline } from "../../matrix/timeline";
import { displayNameFor } from "../../matrix/rooms";
import { agentProfileInRoom } from "../../agent/profile";
import { Timeline } from "./Timeline";
import { Composer } from "./Composer";
import type { TileActions } from "./EventTile";
import { Avatar, Empty, useToast } from "../../components/primitives";
import { toggleSaved } from "../library/saved";

export function ConversationPane({ roomId, threadId, eventId, secondary }: { roomId: string; threadId: string | null; eventId: string | null; secondary?: boolean }) {
  const client = useClient();
  const room = client.getRoom(roomId);
  useEventVersion(client, ["Room", "Room.myMembership"]);
  if (!room || room.getMyMembership() === "leave") return <NotJoined roomId={roomId} />;
  if (room.getMyMembership() === "invite") return <Invite room={room} />;
  return <Conversation key={`${roomId}|${threadId ?? ""}`} room={room} threadId={threadId} eventId={eventId} secondary={!!secondary} />;
}

function Conversation({ room, threadId, eventId, secondary }: { room: Room; threadId: string | null; eventId: string | null; secondary: boolean }) {
  const client = useClient();
  const conn = useConnection();
  const shell = useShell();
  const toast = useToast();
  const [replyTo, setReplyTo] = useState<MatrixEvent | null>(null);
  const [editing, setEditing] = useState<MatrixEvent | null>(null);
  const [rootEv, setRootEv] = useState<MatrixEvent | null>(() => (threadId ? (room.findEventById(threadId) ?? null) : null));
  const thread: Thread | null = threadId ? room.getThread(threadId) : null;

  const version = useEventVersion(room, [
    RoomEvent.Timeline,
    RoomEvent.LocalEchoUpdated,
    RoomEvent.Redaction,
    RoomEvent.Receipt,
    RoomEvent.TimelineReset,
    RoomEvent.UnreadNotifications,
    ThreadEvent.New,
    ThreadEvent.Update,
    ThreadEvent.NewReply,
    RoomStateEvent.Events,
    MatrixEventEvent.Replaced,
    MatrixEventEvent.RelationsCreated,
    MatrixEventEvent.Decrypted,
    RoomMemberEvent.Typing,
  ]);
  const threadV1 = useEventVersion(thread, [RoomEvent.Timeline, RoomEvent.TimelineReset, ThreadEvent.Update, ThreadEvent.NewReply, RoomEvent.Receipt]);
  const threadV2 = useEventVersion(thread?.timelineSet, [RoomEvent.Timeline, RoomEvent.TimelineReset]);
  const threadVersion = threadV1 + threadV2;
  useEventVersion(client, [RoomMemberEvent.Typing]);

  // Deep link into a thread whose root is not loaded yet: fetch it.
  useEffect(() => {
    if (!threadId || rootEv) return;
    let live = true;
    client
      .fetchRoomEvent(room.roomId, threadId)
      .then((raw) => {
        if (!live) return;
        const ev = new MatrixEvent(raw);
        setRootEv(room.findEventById(threadId) ?? ev);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [client, room, threadId, rootEv]);

  // Threads are paginated lazily by the SDK; make sure the first page is there.
  // After a restore from the IndexedDB sync cache, matrix-js-sdk 42 can leave a
  // thread whose live timeline is empty while its replies sit in a detached
  // timeline, so pagination adds nothing. Fetch the thread's relations and
  // resolve them to the SDK's own event objects (keeps edits/reactions live).
  const [restored, setRestored] = useState<MatrixEvent[]>([]);
  const threadEmpty = !!thread && thread.length > 0 && !thread.liveTimeline.getEvents().some((e) => e.getId() !== thread.id);
  useEffect(() => {
    if (!thread) return;
    if (!thread.initialEventsFetched) {
      void client.paginateEventTimeline(thread.liveTimeline, { backwards: true, limit: 50 }).catch(() => {});
      return;
    }
    if (!threadEmpty) return;
    let live = true;
    client
      .fetchRelations(room.roomId, thread.id, "m.thread", null, { dir: Direction.Backward, limit: 100 })
      .then((res) => {
        if (!live) return;
        const evs = res.chunk.map((raw) => room.findEventById(raw.event_id!) ?? new MatrixEvent(raw));
        setRestored(evs.reverse());
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [client, room, thread, threadEmpty, threadVersion]);

  const events = useMemo(() => {
    if (!threadId) return mainTimeline(room);
    if (thread) {
      const tl = threadTimeline(room, thread);
      if (!restored.length) return tl;
      const byId = new Map<string, MatrixEvent>();
      for (const e of [...restored, ...tl]) byId.set(e.getId() ?? e.getTxnId() ?? "", e);
      const root = room.findEventById(thread.id) ?? rootEv;
      if (root?.getId()) byId.set(root.getId()!, root);
      return [...byId.values()].sort((a, b) => (a.status ? 1 : 0) - (b.status ? 1 : 0) || a.getTs() - b.getTs());
    }
    const root = rootEv ?? room.findEventById(threadId);
    const pending = room.getPendingEvents().filter((e) => e.threadRootId === threadId);
    return root ? [root, ...pending] : pending;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room, thread, threadId, rootEv, version, threadVersion, restored]);

  // Read receipts: mark the newest event read while this conversation is on screen and focused.
  const lastSent = useRef<string | null>(null);
  useEffect(() => {
    const last = [...events].reverse().find((e) => e.getId() && !e.status && e.getSender() !== client.getSafeUserId());
    if (!last || last.getId() === lastSent.current || conn.phase !== "ready") return;
    const send = () => {
      if (document.visibilityState !== "visible") return;
      lastSent.current = last.getId()!;
      void client.sendReadReceipt(last).catch(() => (lastSent.current = null));
    };
    send();
    document.addEventListener("visibilitychange", send);
    return () => document.removeEventListener("visibilitychange", send);
  }, [events, client, conn.phase]);

  const me = client.getSafeUserId();
  const actions: TileActions = useMemo(
    () => ({
      reply: (ev) => {
        setEditing(null);
        setReplyTo(ev);
      },
      edit: (ev) => {
        setReplyTo(null);
        setEditing(ev);
      },
      openThread: (ev) => shell.openThread(room.roomId, ev.getId()!),
      openArtifact: (ev) => shell.openArtifact(room.roomId, ev),
      showUser: (userId) => shell.openDetails(room.roomId, userId),
      jumpTo: (id) => navigate({ roomId: room.roomId, threadId, eventId: id }),
      save: (ev) =>
        void toggleSaved(client, { roomId: room.roomId, eventId: ev.getId()!, preview: previewText(ev, 160) }).then(
          (on) => toast(on ? "Saved to library" : "Removed from library", previewText(ev, 40)),
          (e: Error) => toast("Couldn't save", e.message, "danger"),
        ),
    }),
    [shell, room.roomId, threadId, client, toast],
  );

  const editLast = useCallback(() => {
    const own = [...events].reverse().find((e) => e.getSender() === me && e.getType() === "m.room.message" && !e.isRedacted() && !e.status && !e.getContent().url);
    if (own) setEditing(own);
  }, [events, me]);

  const typing = room.getMembers().filter((m) => m.typing && m.userId !== me);
  const offline = conn.phase === "offline" || conn.phase === "reconnecting";

  return (
    <div data-screen="" data-conversation={threadId ? "thread" : "room"} style={{ display: "flex", flexDirection: "column", overflow: "hidden", color: "var(--app-text)", height: "100%" }}>
      {threadId && !secondary ? (
        <div data-threadbar="">
          <button data-btn="text" data-state="" onClick={() => shell.closeThread()}>
            ← {room.name}
          </button>
          <span data-meta="">{thread ? `${thread.length} repl${thread.length === 1 ? "y" : "ies"}` : "New thread"}</span>
        </div>
      ) : null}
      {events.length === 0 ? (
        <div style={{ flex: 1, display: "grid", placeItems: "center" }}>
          <Empty title={threadId ? "Loading thread" : "No messages yet"}>{threadId ? "Fetching the thread from your homeserver…" : `Say hello in ${room.name}. Mention an agent with @ to put it to work.`}</Empty>
        </div>
      ) : (
        <Timeline client={client} room={room} thread={thread} events={events} highlight={eventId} actions={actions} version={version + threadVersion} label={threadId ? "Thread messages" : `Messages in ${room.name}`} />
      )}
      <div data-collapse="" data-open={String(typing.length > 0)} aria-live="polite">
        <div>
          {typing.length ? (
            <div data-turn="assistant" data-typingrow="" style={{ alignItems: "center", padding: "0 24px var(--s1)", maxWidth: 828, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
              <Avatar client={client} name={typing[0]!.name} mxc={typing[0]!.getMxcAvatarUrl()} agent={!!agentProfileInRoom(room, typing[0]!.userId)} working />
              <div data-typing="">
                <i />
                <i />
                <i />
                <span style={{ marginLeft: "var(--s2)", fontSize: "var(--t-ctl)", color: "var(--app-faint)" }}>
                  {typing.map((m) => displayNameFor(room, m.userId, client)).join(", ")} {typing.length === 1 ? (agentProfileInRoom(room, typing[0]!.userId) ? "is working" : "is typing") : "are typing"}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <Composer
        client={client}
        room={room}
        threadId={threadId}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        editing={editing}
        onCancelEdit={() => setEditing(null)}
        onEditLast={editLast}
        offline={offline}
        primary={!secondary}
      />
    </div>
  );
}

function Invite({ room }: { room: Room }) {
  const client = useClient();
  const toast = useToast();
  const inviter = room.getDMInviter() ?? room.currentState.getStateEvents("m.room.member", client.getSafeUserId())?.getSender();
  return (
    <div style={{ flex: 1, display: "grid", placeItems: "center" }}>
      <Empty
        title={`Invitation to ${room.name}`}
        action={
          <div style={{ display: "flex", gap: "var(--s2)" }}>
            <button data-btn="fill" data-state="" onClick={() => void client.joinRoom(room.roomId).catch((e: Error) => toast("Couldn't join", e.message, "danger"))}>
              Join
            </button>
            <button data-btn="" data-state="" onClick={() => void client.leave(room.roomId)}>
              Decline
            </button>
          </div>
        }
      >
        {inviter ? `${inviter} invited you.` : "You were invited."}
      </Empty>
    </div>
  );
}

function NotJoined({ roomId }: { roomId: string }) {
  const client = useClient();
  const toast = useToast();
  return (
    <div style={{ flex: 1, display: "grid", placeItems: "center" }}>
      <Empty
        title="Not in this room"
        action={
          <button data-btn="fill" data-state="" onClick={() => void client.joinRoom(roomId).catch((e: Error) => toast("Couldn't join", e.message, "danger"))}>
            Try to join
          </button>
        }
      >
        <span data-num="">{roomId}</span> isn't one of your rooms, or hasn't synced yet.
      </Empty>
    </div>
  );
}
