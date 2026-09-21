import { RoomEvent, RoomStateEvent } from "matrix-js-sdk";
import { useClient, useConnection } from "../context";
import type { Route } from "../routes";
import type { RightPanel } from "./ShellContext";
import { useShell } from "./ShellContext";
import { useTheme } from "../../theme/context";
import { useEventVersion } from "../../matrix/hooks";
import { previewText } from "../../matrix/timeline";
import { AgentPresence } from "../../components/AgentPresence";
import { I } from "../../components/icons";

const TITLES: Record<string, [string, string]> = {
  agents: ["Agents", "Matrix identities marked as agents"],
  workspace: ["Workspace", "Homeserver, identity, spaces and security"],
  notes: ["Notes", "Private notes in your Matrix account data"],
  library: ["Library", "Pinned, saved and shared"],
  audit: ["Audit", "What Matrix and the gateway can actually attest"],
  admin: ["Admin", "Server and gateway capabilities"],
  devcomponents: ["Reference Lab", "Component dev environment"],
  providers: ["Providers", "Telemetry · Models · Evaluations"],
};

const PHASE: Record<string, { tone: string; label: string }> = {
  ready: { tone: "ok", label: "Connected" },
  syncing: { tone: "warn", label: "Catching up" },
  connecting: { tone: "warn", label: "Connecting" },
  starting: { tone: "warn", label: "Starting" },
  reconnecting: { tone: "warn", label: "Reconnecting" },
  offline: { tone: "danger", label: "Offline" },
  auth_expired: { tone: "danger", label: "Signed out" },
  fatal: { tone: "danger", label: "Error" },
};

export function PaneHead({ route, leftOpen, right }: { route: Route; leftOpen: boolean; right: RightPanel }) {
  const client = useClient();
  const conn = useConnection();
  const shell = useShell();
  const { brand } = useTheme();
  const room = route.roomId ? client.getRoom(route.roomId) : null;
  useEventVersion(room, [RoomEvent.Name, RoomStateEvent.Events]);
  const isChat = route.screen === "chat";
  let title = brand.productName;
  let sub = "Choose a room";
  if (isChat && room) {
    const thread = route.threadId ? room.getThread(route.threadId) : null;
    title = route.threadId ? previewText(thread?.rootEvent ?? room.findEventById(route.threadId), 70) || "Thread" : room.name;
    const members = room.getJoinedMemberCount();
    sub = route.threadId ? `Thread in ${room.name}` : `${members} member${members === 1 ? "" : "s"}${room.hasEncryptionStateEvent() ? " · end-to-end encrypted" : ""}`;
  } else if (!isChat) {
    [title, sub] = TITLES[route.screen] ?? [title, sub];
  }
  const phase = PHASE[conn.phase] ?? { tone: "warn", label: conn.phase };
  const hs = (() => {
    try {
      return new URL(client.getHomeserverUrl()).host;
    } catch {
      return client.getHomeserverUrl();
    }
  })();

  return (
    <div data-panehead="">
      {isChat && route.threadId ? (
        <button data-iconbtn="" onClick={() => shell.closeThread()} aria-label="Back to room timeline" title="Back to room timeline">
          {I.back()}
        </button>
      ) : (
        <span data-mark="" style={{ width: 20, height: 20, opacity: 0.9, color: "var(--app-text)" }} />
      )}
      <div style={{ minWidth: 0, flex: 1, paddingRight: "var(--s2)" }}>
        <h1 data-swap="title" style={{ fontSize: "var(--t-title)", fontWeight: 700, letterSpacing: "var(--tk-snug)", lineHeight: 1.25, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0 }}>
          {title}
        </h1>
        <div data-swap="sub" style={{ fontSize: "var(--t-num)", lineHeight: 1.25, color: "var(--app-faint)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {room?.hasEncryptionStateEvent() && isChat ? <span style={{ marginRight: 4 }}>{I.lock(10)}</span> : null}
          {sub}
        </div>
      </div>
      <div data-headmeta="" data-hidenarrow="" data-tone={phase.tone} role="status" aria-live="polite" aria-label={`Connection: ${phase.label}`} data-connection={conn.phase}>
        <span data-num="">{hs}</span>
        <AgentPresence size="xs" state={conn.phase === "ready" ? "available" : conn.phase === "offline" || conn.phase === "fatal" ? "error" : "idle"} />
        <span data-meta="">{phase.label}</span>
      </div>
      <div data-headcluster="">
        <button data-hb="" onClick={() => shell.openPalette()} title="Search & commands — ⌘K" aria-label="Search and commands">
          {I.search(15)}
          <span data-hbl="" style={{ fontFamily: "var(--app-mono)" }}>
            ⌘K
          </span>
        </button>
        {isChat ? (
          <button data-hb="" data-on={String(shell.rooms)} aria-pressed={shell.rooms} aria-expanded={shell.rooms} aria-controls="shell-rooms" onClick={() => shell.toggleRooms()} title="Rooms — ⌘/" aria-label={shell.rooms ? "Hide rooms" : "Show rooms"}>
            {I.chats()}
            <span data-hbl="">Rooms</span>
          </button>
        ) : null}
        {isChat ? (
          <button data-hb="" data-on={String(leftOpen)} aria-pressed={leftOpen} aria-expanded={leftOpen} aria-controls="shell-threads" onClick={() => shell.toggleLeft()} title="Threads" aria-label={leftOpen ? "Hide threads" : "Show threads"}>
            {I.threads()}
            <span data-hbl="">Threads</span>
          </button>
        ) : null}
        {isChat && room ? (
          <button
            data-hb=""
            data-on={String(right?.kind === "details")}
            aria-pressed={right?.kind === "details"}
            onClick={() => (right?.kind === "details" ? shell.closeRight() : shell.openDetails(room.roomId, null))}
            title="Members & room details"
            aria-label="Members and room details"
          >
            {I.people()}
            <span data-hbl="">Members</span>
          </button>
        ) : null}
        {isChat && right?.kind === "artifact" ? (
          <button data-hb="" data-on="true" aria-pressed="true" onClick={() => shell.closeRight()} title="Close artifact" aria-label="Close artifact">
            {I.artifacts()}
            <span data-hbl="">Artifact</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
