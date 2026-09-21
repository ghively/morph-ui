import { memo, useState } from "react";
import { EventType, MsgType, type MatrixClient, type MatrixEvent, type Room } from "matrix-js-sdk";
import { MessageBody } from "./MessageBody";
import { agentProfileInRoom, agentMessageMeta, runtimeLabel, systemNotice } from "../../agent/profile";
import { displayNameFor } from "../../matrix/rooms";
import { canRedact, formatTime, isEdited, isMediaMessage, isMessage, previewText, reactionsFor, replyTargetId, sendState } from "../../matrix/timeline";
import { Avatar, useToast } from "../../components/primitives";
import { I } from "../../components/icons";
import { redact, retrySend, cancelSend, toggleReaction } from "../../matrix/messages";
import { uiArtifactLabel, uiArtifactOf } from "../../artifacts/uiArtifact";
import { AgentActivityCapsule } from "../../components/AgentActivityCapsule";

export interface TileActions {
  reply(ev: MatrixEvent): void;
  edit(ev: MatrixEvent): void;
  openThread(ev: MatrixEvent): void;
  openArtifact(ev: MatrixEvent): void;
  showUser(userId: string): void;
  jumpTo(eventId: string): void;
  save(ev: MatrixEvent): void;
}

const QUICK = ["👍", "❤️", "😂", "🎉", "👀", "✅"];

function stateLine(client: MatrixClient, room: Room, ev: MatrixEvent): string | null {
  const who = displayNameFor(room, ev.getSender() ?? "", client);
  const c = ev.getContent();
  const prev = ev.getPrevContent();
  switch (ev.getType()) {
    case EventType.RoomCreate:
      return `${who} created the room`;
    case EventType.RoomName:
      return `${who} named the room “${c.name ?? ""}”`;
    case EventType.RoomTopic:
      return `${who} set the topic: ${c.topic ?? ""}`;
    case EventType.RoomEncryption:
      return `${who} turned on end-to-end encryption`;
    case EventType.RoomMember: {
      const target = displayNameFor(room, ev.getStateKey() ?? "", client);
      const m = c.membership;
      const pm = prev.membership;
      if (m === "join" && pm === "join") return null; // profile change noise
      if (m === "join") return `${target} joined`;
      if (m === "invite") return `${who} invited ${target}`;
      if (m === "leave") return ev.getSender() === ev.getStateKey() ? `${target} left` : `${who} removed ${target}${c.reason ? `: ${c.reason}` : ""}`;
      if (m === "ban") return `${who} banned ${target}${c.reason ? `: ${c.reason}` : ""}`;
      return null;
    }
  }
  return null;
}

export const EventTile = memo(function EventTile({
  client,
  room,
  ev,
  continuation,
  inThread,
  highlighted,
  actions,
  version,
  accent,
}: {
  client: MatrixClient;
  room: Room;
  ev: MatrixEvent;
  continuation: boolean;
  inThread: boolean;
  highlighted: boolean;
  actions: TileActions;
  version: number;
  /**
   * The sender's [data-sec] slot. It is the stylesheet's existing
   * section-accent vocabulary, so marking the turn with it re-points --sec for
   * the whole subtree — the name, the avatar and the bubble — from one
   * attribute. Always present: Timeline derives it from the sender id, and
   * app.css decides what a slot looks like.
   */
  accent: string;
}) {
  void version; // re-render key for aggregated relations (edits/reactions/receipts)
  const toast = useToast();
  const me = client.getSafeUserId();
  const [picker, setPicker] = useState(false);
  const sender = ev.getSender() ?? "";
  const id = ev.getId() ?? ev.getTxnId() ?? "";

  // A UI artifact event isn't a message — it draws as a compact tile that opens
  // the right pane, the same affordance images and files use.
  const artifact = uiArtifactOf(ev);
  if (artifact) {
    const label = uiArtifactLabel(artifact);
    const fromMe = sender === me;
    const tile = (
      <button type="button" data-artifacttile="" data-degraded={artifact.renderable ? undefined : ""} onClick={() => actions.openArtifact(ev)} aria-label={`Open UI artifact ${label} in the artifact panel`}>
        {I.artifacts(13)}
        <span data-strong="">UI artifact</span>
        <span data-ell="">{label}</span>
        {artifact.renderable ? null : <span data-tag="">source only</span>}
      </button>
    );
    const time = (
      <div data-msgmeta="">
        <span data-num="">{formatTime(ev.getTs())}</span>
      </div>
    );
    if (fromMe) {
      return (
        <div data-turn="user" data-sec={accent} data-eventid={ev.getId()} data-highlight={highlighted ? "" : undefined} data-msg="" tabIndex={0} aria-label={`You: UI artifact ${label}`} key={id}>
          <div data-attach="">{tile}</div>
          {time}
        </div>
      );
    }
    return (
      <div
        data-turn="assistant"
        data-sec={accent}
        data-eventid={ev.getId()}
        data-sender={sender}
        data-agent={agentProfileInRoom(room, sender)?.runtime}
        data-continuation={continuation ? "" : undefined}
        data-highlight={highlighted ? "" : undefined}
        data-msg=""
        tabIndex={0}
        aria-label={`${displayNameFor(room, sender, client)}: UI artifact ${label}`}
        key={id}
      >
        {continuation ? <span data-avatarspacer="" aria-hidden="true" /> : <Avatar client={client} name={displayNameFor(room, sender, client)} mxc={room.getMember(sender)?.getMxcAvatarUrl()} agent={!!agentProfileInRoom(room, sender)} />}
        <div data-body="">
          {tile}
          {time}
        </div>
      </div>
    );
  }

  if (!isMessage(ev)) {
    const line = stateLine(client, room, ev);
    if (!line) return null;
    return (
      <div data-stateline="" data-eventid={ev.getId()}>
        <span data-meta="">{line}</span>
      </div>
    );
  }

  const agentMeta = agentMessageMeta(ev);
  if (agentMeta && ev.getContent().msgtype === "m.notice" && (ev.getContent().body as string).startsWith("Action:")) {
    const parts = (ev.getContent().body as string).split("\n");
    const action = parts[0]?.replace("Action: ", "") ?? "Action";
    const isError = parts.some(p => p.toLowerCase().includes("error") || p.toLowerCase().includes("failed"));
    return (
      <div data-eventid={ev.getId()} style={{ padding: "8px 0" }}>
        <AgentActivityCapsule 
          state={isError ? "failed" : "completed"} 
          agent={displayNameFor(room, sender, client)} 
          activity={action} 
          details={parts.slice(1)} 
          onExpand={() => {}} 
          onCollapse={() => {}} 
        />
      </div>
    );
  }

  const sys = systemNotice(ev);
  if (sys) {
    return (
      <div data-eventid={ev.getId()} data-system={sys.kind} style={{ maxWidth: 780, width: "100%" }}>
        <div data-alert="" data-tone={sys.kind === "backend_retrying" ? "warn" : "danger"} role="note">
          <span data-dot="" data-live={sys.kind === "backend_retrying" ? "" : undefined} />
          <div>
            <strong>{sys.kind === "loop_guard" ? "Loop guard" : sys.kind === "depth_limit" ? "Delegation limit" : sys.kind === "rate_limit" ? "Rate limit" : sys.kind === "delivery_failed" ? "Delivery failed" : sys.kind === "backend_retrying" ? "Agent unavailable" : "Gateway"}</strong>{" "}
            {String(ev.getContent().body ?? "")}
          </div>
          <span data-num="" data-meta="">
            {formatTime(ev.getTs())}
          </span>
        </div>
      </div>
    );
  }

  const mine = sender === me;
  const profile = agentProfileInRoom(room, sender);
  const isAgent = !!profile;
  const name = displayNameFor(room, sender, client);
  const member = room.getMember(sender);
  const st = sendState(ev);
  const reactions = ev.getId() ? reactionsFor(room, ev, me) : [];
  const replyId = replyTargetId(ev);
  const replyEv = replyId ? room.findEventById(replyId) : null;
  const thread = !inThread && ev.getId() ? room.getThread(ev.getId()!) : null;
  const readers = ev.getId() ? (ev.getThread() ?? room).getUsersReadUpTo(ev).filter((u) => u !== me && u !== sender) : [];
  const editable = mine && ev.getType() === EventType.RoomMessage && !isMediaMessage(ev) && !ev.isRedacted() && st === "sent";
  const redactable = st === "sent" && canRedact(room, ev, me);
  const artifactable = isMediaMessage(ev) || /<pre|```/.test(String(ev.getContent().formatted_body ?? ev.getContent().body ?? ""));

  const bar = st === "sent" && !ev.isRedacted() && (
    <div data-msgactions="" role="toolbar" aria-label="Message actions">
      <button data-iconbtn="" onClick={() => setPicker((v) => !v)} aria-label="React" aria-expanded={picker} title="React">
        {I.react()}
      </button>
      <button data-iconbtn="" onClick={() => actions.reply(ev)} aria-label="Reply" title="Reply">
        {I.reply()}
      </button>
      {!inThread ? (
        <button data-iconbtn="" onClick={() => actions.openThread(ev)} aria-label="Reply in thread" title="Reply in thread">
          {I.thread()}
        </button>
      ) : null}
      {editable ? (
        <button data-iconbtn="" onClick={() => actions.edit(ev)} aria-label="Edit" title="Edit">
          {I.edit()}
        </button>
      ) : null}
      <button
        data-iconbtn=""
        onClick={() => {
          void navigator.clipboard?.writeText(String(ev.getContent().body ?? ""));
          toast("Copied", "message");
        }}
        aria-label="Copy text"
        title="Copy text"
      >
        {I.copy()}
      </button>
      {artifactable ? (
        <button data-iconbtn="" onClick={() => actions.openArtifact(ev)} aria-label="Open in artifact panel" title="Open artifact">
          {I.artifacts(14)}
        </button>
      ) : null}
      <button data-iconbtn="" onClick={() => actions.save(ev)} aria-label="Save to library" title="Save to library">
        {I.bookmark()}
      </button>
      <button
        data-iconbtn=""
        onClick={() => {
          const url = `${window.location.origin}${window.location.pathname}#/room/${encodeURIComponent(room.roomId)}${ev.threadRootId && ev.threadRootId !== ev.getId() ? `/thread/${encodeURIComponent(ev.threadRootId)}` : ""}?event=${encodeURIComponent(ev.getId()!)}`;
          void navigator.clipboard?.writeText(url);
          toast("Link copied", "jump-to-event");
        }}
        aria-label="Copy link to message"
        title="Copy link"
      >
        {I.link()}
      </button>
      {redactable ? (
        <button
          data-iconbtn=""
          data-tone="danger"
          onClick={() => {
            if (window.confirm("Delete this message for everyone?")) void redact(client, room.roomId, ev).catch((e: Error) => toast("Couldn't delete", e.message, "danger"));
          }}
          aria-label="Delete message"
          title="Delete"
        >
          {I.trash(13)}
        </button>
      ) : null}
    </div>
  );

  const pickerEl = picker && (
    <div data-reactpicker="" role="menu" aria-label="Pick a reaction">
      {QUICK.map((k) => (
        <button
          key={k}
          role="menuitem"
          data-iconbtn=""
          onClick={() => {
            setPicker(false);
            const existing = reactions.find((r) => r.key === k)?.mine ?? null;
            void toggleReaction(client, room, ev, k, existing).catch((e: Error) => toast("Reaction failed", e.message, "danger"));
          }}
          aria-label={`React ${k}`}
        >
          {k}
        </button>
      ))}
    </div>
  );

  const quote = replyId && (
    <button type="button" data-replyquote="" onClick={() => actions.jumpTo(replyId)} aria-label="Jump to the replied message">
      <span data-strong="">{replyEv ? displayNameFor(room, replyEv.getSender() ?? "", client) : "Reply"}</span>
      <span>{replyEv ? previewText(replyEv, 120) : "Original message not loaded — jump to it"}</span>
    </button>
  );

  const body = <MessageBody client={client} ev={ev} onPill={actions.showUser} onOpenArtifact={() => actions.openArtifact(ev)} />;

  const reactionRow = reactions.length ? (
    <div data-reactions="" role="group" aria-label="Reactions">
      {reactions.map((r) => (
        <button
          key={r.key}
          data-chip=""
          data-state=""
          data-on={String(!!r.mine)}
          aria-pressed={!!r.mine}
          title={r.senders.map((s) => displayNameFor(room, s, client)).join(", ")}
          onClick={() => void toggleReaction(client, room, ev, r.key, r.mine).catch((e: Error) => toast("Reaction failed", e.message, "danger"))}
          aria-label={`${r.key} ${r.count}${r.mine ? ", including you" : ""}`}
        >
          {r.key}
          <span data-num="">{r.count}</span>
        </button>
      ))}
    </div>
  ) : null;

  const threadSummary = thread && thread.length > 0 && (
    <button type="button" data-threadsummary="" onClick={() => actions.openThread(ev)} aria-label={`Open thread, ${thread.length} repl${thread.length === 1 ? "y" : "ies"}`}>
      {I.thread(13)}
      <span data-strong="">
        {thread.length} repl{thread.length === 1 ? "y" : "ies"}
      </span>
      {thread.replyToEvent ? (
        <span data-meta="">
          last by {displayNameFor(room, thread.replyToEvent.getSender() ?? "", client)} · {formatTime(thread.replyToEvent.getTs())}
        </span>
      ) : null}
      {room.getThreadUnreadNotificationCount(thread.id) > 0 ? <span data-dot="" data-live="" aria-label="unread" style={{ width: 6, height: 6 }} /> : null}
    </button>
  );

  const meta = (
    <div data-msgmeta="">
      <span data-num="">{formatTime(ev.getTs())}</span>
      {isEdited(ev) ? <span data-meta="">(edited)</span> : null}
      {st === "sending" ? <span data-meta="" data-sendstate="sending">Sending…</span> : null}
      {st === "failed" ? (
        <span data-sendstate="failed" role="alert" style={{ display: "inline-flex", alignItems: "center", gap: "var(--s2)" }}>
          <span style={{ color: "var(--danger-ink)", fontWeight: 700 }}>Not sent</span>
          <button data-btn="text" data-state="" onClick={() => void retrySend(client, room, ev)}>
            Retry
          </button>
          <button data-btn="text" data-state="" onClick={() => cancelSend(client, ev)}>
            Discard
          </button>
        </span>
      ) : null}
      {readers.length ? (
        <span data-avatars="" data-receipts="" aria-label={`Seen by ${readers.map((u) => displayNameFor(room, u, client)).join(", ")}`} title={`Seen by ${readers.map((u) => displayNameFor(room, u, client)).join(", ")}`}>
          {readers.slice(0, 4).map((u) => (
            <Avatar key={u} client={client} name={displayNameFor(room, u, client)} mxc={room.getMember(u)?.getMxcAvatarUrl()} agent={!!agentProfileInRoom(room, u)} size="sm" />
          ))}
        </span>
      ) : null}
    </div>
  );

  if (mine) {
    return (
      <div data-turn="user" data-sec={accent} data-eventid={ev.getId()} data-txn={ev.getTxnId()} data-highlight={highlighted ? "" : undefined} data-msg="" tabIndex={0} data-sendstate={st} aria-label={`You: ${previewText(ev, 200)}`} key={id}>
        {quote}
        {isMediaMessage(ev) || ev.isRedacted() ? <div data-attach="">{body}</div> : <div data-bubble="">{body}</div>}
        {reactionRow}
        {threadSummary}
        {meta}
        {bar}
        {pickerEl}
      </div>
    );
  }

  return (
    <div
      data-turn="assistant"
      data-sec={accent}
      data-eventid={ev.getId()}
      data-sender={sender}
      data-agent={isAgent ? profile!.runtime : undefined}
      data-continuation={continuation ? "" : undefined}
      data-highlight={highlighted ? "" : undefined}
      data-msg=""
      tabIndex={0}
      aria-label={`${name}${isAgent ? " (agent)" : ""}: ${previewText(ev, 200)}`}
    >
      {continuation ? <span data-avatarspacer="" aria-hidden="true" /> : <Avatar client={client} name={name} mxc={member?.getMxcAvatarUrl()} agent={isAgent} />}
      <div data-body="">
        {!continuation ? (
          <div style={{ display: "flex", alignItems: "center", gap: "var(--s3)", flexWrap: "wrap" }}>
            <button type="button" data-strong="" data-sendername="" onClick={() => actions.showUser(sender)}>
              {name}
            </button>
            {isAgent ? (
              <span data-chip="" data-solid="" data-tone="ok" data-agentbadge="">
                <span data-dot="" style={{ width: 5, height: 5 }} />
                <span data-num="">{runtimeLabel(profile!.runtime)}</span>
              </span>
            ) : null}
            {isAgent && profile!.role ? <span data-tag="">{profile!.role}</span> : null}
            {agentMeta?.depth ? <span data-tag="" title="Agent-to-agent delegation depth">↳ depth {agentMeta.depth}</span> : null}
            {ev.getContent().msgtype === MsgType.Notice && !isAgent ? <span data-tag="">notice</span> : null}
          </div>
        ) : null}
        {quote}
        {body}
        {reactionRow}
        {threadSummary}
        {meta}
      </div>
      {bar}
      {pickerEl}
    </div>
  );
});
