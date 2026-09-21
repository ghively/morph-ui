import { useEffect, useState } from "react";
import { EventType, RoomMemberEvent, RoomStateEvent, UserEvent, type Room } from "matrix-js-sdk";
import { useClient } from "../../app/context";
import { useShell } from "../../app/shell/ShellContext";
import { useEventVersion } from "../../matrix/hooks";
import { agentDirectory, agentProfileInRoom, runtimeLabel } from "../../agent/profile";
import { useGateway } from "../../agent/useGateway";
import { displayNameFor, openDirectMessage } from "../../matrix/rooms";
import { relativeTime } from "../../matrix/timeline";
import { Avatar, useToast } from "../../components/primitives";
import { I } from "../../components/icons";

export function DetailsPanel({ roomId, userId }: { roomId: string | null; userId: string | null }) {
  const shell = useShell();
  const client = useClient();
  const room = roomId ? client.getRoom(roomId) : null;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }} role="region" aria-label={userId ? "Member details" : "Room details"}>
      <div data-panehead="">
        {userId && room ? (
          <button data-iconbtn="" onClick={() => shell.openDetails(roomId, null)} aria-label="Back to room details">
            {I.back()}
          </button>
        ) : (
          <div data-tile="" style={{ width: 26, height: 26 }}>
            {I.people(14)}
          </div>
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div data-strong="">{userId ? "Member" : "Room"}</div>
          <div data-meta="" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{room?.name ?? ""}</div>
        </div>
        <button data-iconbtn="" onClick={() => shell.closeRight()} aria-label="Close details">
          {I.close()}
        </button>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "var(--s3) var(--s4) var(--s5)" }}>{userId ? <UserDetails room={room} userId={userId} /> : room ? <RoomDetails room={room} /> : null}</div>
    </div>
  );
}

function RoomDetails({ room }: { room: Room }) {
  const client = useClient();
  const shell = useShell();
  const toast = useToast();
  const [invite, setInvite] = useState("");
  useEventVersion(room, [RoomStateEvent.Members, RoomStateEvent.Events, RoomMemberEvent.Membership]);
  // Members are lazy-loaded by sync; the full list is fetched when someone looks at it.
  useEffect(() => {
    void room.loadMembersIfNeeded().catch(() => {});
  }, [room]);
  const members = room.getMembers().filter((m) => m.membership === "join" || m.membership === "invite");
  members.sort((a, b) => Number(!!agentProfileInRoom(room, b.userId)) - Number(!!agentProfileInRoom(room, a.userId)) || a.name.localeCompare(b.name));
  const topic = room.currentState.getStateEvents(EventType.RoomTopic, "")?.getContent()?.topic as string | undefined;
  const fav = "m.favourite" in (room.tags ?? {});
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--s4)" }}>
      <div data-card="">
        <div data-strong="" data-lead="true">{room.name}</div>
        {room.getCanonicalAlias() ? <div data-num="">{room.getCanonicalAlias()}</div> : null}
        {topic ? <div data-meta="" style={{ marginTop: "var(--s2)" }}>{topic}</div> : null}
        <div style={{ display: "flex", gap: "var(--s2)", flexWrap: "wrap", marginTop: "var(--s3)" }}>
          <span data-tag="" data-solid={room.hasEncryptionStateEvent() ? "" : undefined}>
            {room.hasEncryptionStateEvent() ? "End-to-end encrypted" : "Not encrypted"}
          </span>
          <button data-chip="" data-state="" data-on={String(fav)} aria-pressed={fav} onClick={() => void (fav ? client.deleteRoomTag(room.roomId, "m.favourite") : client.setRoomTag(room.roomId, "m.favourite", { order: 0.5 }))}>
            Favourite
          </button>
        </div>
        {room.hasEncryptionStateEvent() ? (
          <div data-meta="" style={{ marginTop: "var(--s2)" }}>
            Gateway agents cannot read encrypted rooms yet — mention them in an unencrypted room.
          </div>
        ) : null}
      </div>
      <div data-eyebrow="">Members · {members.length}</div>
      <div data-rows="" role="list">
        {members.map((m) => {
          const p = agentProfileInRoom(room, m.userId);
          return (
            <div key={m.userId} data-row="" data-state="" role="listitem" style={{ cursor: "pointer" }} onClick={() => shell.openDetails(room.roomId, m.userId)}>
              <Avatar client={client} name={m.name} mxc={m.getMxcAvatarUrl()} agent={!!p} />
              <div data-fill="">
                <div data-strong="">{m.name}</div>
                <div data-meta="">{m.userId}{m.membership === "invite" ? " · invited" : ""}</div>
              </div>
              {p ? <span data-tag="" data-solid="">{runtimeLabel(p.runtime)}</span> : null}
            </div>
          );
        })}
      </div>
      {room.canInvite(client.getSafeUserId()) ? (
        <form
          style={{ display: "flex", gap: "var(--s2)" }}
          onSubmit={(e) => {
            e.preventDefault();
            const uid = invite.trim();
            if (!/^@[^:]+:.+$/.test(uid)) return toast("Enter a full Matrix ID", "@name:server", "danger");
            void client.invite(room.roomId, uid).then(
              () => {
                toast("Invited", uid);
                setInvite("");
              },
              (err: Error) => toast("Invite failed", err.message, "danger"),
            );
          }}
        >
          <input data-field="" value={invite} onChange={(e) => setInvite(e.target.value)} placeholder="@agent_music:server" aria-label="Invite by Matrix ID" />
          <button data-btn="" data-state="" type="submit">
            Invite
          </button>
        </form>
      ) : null}
      <button
        data-btn="text"
        data-state=""
        data-tone="danger"
        onClick={() => {
          if (window.confirm(`Leave ${room.name}?`)) void client.leave(room.roomId).then(() => shell.closeRight());
        }}
      >
        Leave room
      </button>
    </div>
  );
}

function UserDetails({ room, userId }: { room: Room | null; userId: string }) {
  const client = useClient();
  const shell = useShell();
  const toast = useToast();
  const gateway = useGateway();
  const user = client.getUser(userId);
  useEventVersion(user, [UserEvent.Presence, UserEvent.DisplayName]);
  const dir = agentDirectory(client).get(userId);
  const profile = (room && agentProfileInRoom(room, userId)) ?? dir?.profile ?? null;
  const name = displayNameFor(room, userId, client);
  const gw = gateway.status?.agents.find((a) => a.matrixUserId === userId);
  const member = room?.getMember(userId);
  const presence = user?.presence && user.presence !== "offline" ? user.presence : user?.presence === "offline" ? "offline" : "unknown";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--s4)" }}>
      <div data-card="" style={{ display: "flex", gap: "var(--s4)", alignItems: "center" }}>
        <Avatar client={client} name={name} mxc={member?.getMxcAvatarUrl() ?? user?.avatarUrl} agent={!!profile} size="lg" />
        <div style={{ minWidth: 0 }}>
          <div data-strong="" data-lead="true">{name}</div>
          <div data-num="" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{userId}</div>
          <div data-meta="">
            <span data-dot="" data-tone={presence === "online" ? "ok" : presence === "unavailable" ? "warn" : undefined} style={{ width: 6, height: 6, display: "inline-block", marginRight: 6 }} />
            {presence === "unknown" ? "Presence unknown" : presence}
            {user?.lastActiveAgo ? ` · active ${relativeTime(Date.now() - user.lastActiveAgo)}` : ""}
          </div>
        </div>
      </div>
      {profile ? (
        <div data-card="">
          <div data-eyebrow="">Agent</div>
          <div style={{ display: "flex", gap: "var(--s2)", flexWrap: "wrap", margin: "var(--s3) 0" }}>
            <span data-tag="" data-solid="">{runtimeLabel(profile.runtime)}</span>
            {profile.role ? <span data-tag="">{profile.role}</span> : null}
          </div>
          {profile.capabilities.length ? (
            <div style={{ display: "flex", gap: "var(--s1)", flexWrap: "wrap" }}>
              {profile.capabilities.map((c) => (
                <span key={c} data-chip="">{c}</span>
              ))}
            </div>
          ) : (
            <div data-meta="">No capabilities published.</div>
          )}
          <div data-meta="" style={{ marginTop: "var(--s3)" }}>
            {gw ? (gw.health?.ok ? "Backend healthy (Agent Gateway)" : `Backend unhealthy: ${gw.health?.detail ?? "unknown"}`) : gateway.configured ? "Not routed by the Agent Gateway (native Matrix agent)." : "Agent Gateway not configured — health unavailable."}
          </div>
        </div>
      ) : (
        <div data-meta="">A Matrix user. No agent profile has been published for this identity.</div>
      )}
      <div style={{ display: "flex", gap: "var(--s2)", flexWrap: "wrap" }}>
        {userId !== client.getSafeUserId() ? (
          <button
            data-btn="fill"
            data-state=""
            onClick={async () => {
              try {
                shell.openRoom(await openDirectMessage(client, userId, { encrypted: !profile }));
              } catch (e) {
                toast("Couldn't open a DM", (e as Error).message, "danger");
              }
            }}
          >
            Message
          </button>
        ) : null}
        {room && member?.membership === "join" ? (
          <button data-btn="" data-state="" onClick={() => shell.mention(userId, name)}>
            Mention
          </button>
        ) : null}
      </div>
    </div>
  );
}
