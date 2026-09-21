import { ClientEvent, RoomEvent, UserEvent } from "matrix-js-sdk";
import { useClient } from "../context";
import { navigate, type Screen } from "../routes";
import { useShell } from "./ShellContext";
import { usePrefs } from "../prefs";
import { useTheme } from "../../theme/context";
import { Wordmark } from "../brand";
import { AgentPresence } from "../../components/AgentPresence";
import { I } from "../../components/icons";
import { Avatar } from "../../components/primitives";
import { useEventVersion } from "../../matrix/hooks";

const NAV: { screen: Screen; label: string; icon: () => React.ReactNode }[] = [
  { screen: "chat", label: "Chats", icon: () => I.chats() },
  { screen: "notes", label: "Notes", icon: () => I.notes() },
  { screen: "workspace", label: "Workspace", icon: () => I.workspace() },
  { screen: "agents", label: "Agents", icon: () => I.agents() },
];

export function Dock({ screen }: { screen: Screen }) {
  const client = useClient();
  const { brand } = useTheme();
  const shell = useShell();
  const { prefs, setPref } = usePrefs();
  const me = client.getSafeUserId();
  const user = client.getUser(me);
  useEventVersion(user, [UserEvent.DisplayName, UserEvent.AvatarUrl]);
  useEventVersion(client, [ClientEvent.Sync, RoomEvent.Name]);
  const navIndex = NAV.findIndex((n) => n.screen === screen);
  const myName = user?.displayName || me.replace(/^@/, "").split(":")[0]!;

  return (
    <div data-dockzone="" role="navigation" aria-label="Sections">
      <div style={{ display: "flex", alignItems: "center", height: 56, flex: "none", padding: "0 var(--dock-pad)", gap: 0 }}>
        <span data-markwell="">
          <span data-mark="" style={{ width: 24, height: 24, color: "var(--app-rail-text)" }} />
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Wordmark brand={brand} /><AgentPresence size="xs" state={client.getSyncState() === "SYNCING" ? "available" : "offline"} label="Global agent presence" /></div>
        <button
          data-fade=""
          data-iconbtn=""
          onClick={() => setPref("pinned", !prefs.pinned)}
          title={prefs.pinned ? "Unpin the dock" : "Pin the dock open"}
          aria-label={prefs.pinned ? "Unpin the dock" : "Pin the dock open"}
          aria-pressed={prefs.pinned}
          style={{ marginLeft: "auto", width: 30, height: 30, borderRadius: "var(--r-ctl)", color: "var(--app-rail-faint)" }}
        >
          {I.pin()}
        </button>
      </div>
      <div style={{ padding: "0 var(--dock-pad) 12px" }}>
        <button data-dockitem="" data-primary="" data-state="" onClick={() => shell.openCreateRoom()} title="New room" aria-label="New room">
          {I.plus()}
          <span data-lb="">New room</span>
        </button>
      </div>
      <div data-navgroup="" data-nav={navIndex < 0 ? "none" : String(navIndex)} style={{ ["--nav-i" as string]: navIndex < 0 ? 0 : navIndex, position: "relative", margin: "0 var(--dock-pad)", padding: "var(--s1) 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--s1)" } as React.CSSProperties}>
        <div data-ind="" />
        {NAV.map((n) => (
          <button
            key={n.screen}
            data-dockitem=""
            data-state=""
            data-on={String(screen === n.screen)}
            aria-current={screen === n.screen ? "page" : undefined}
            title={n.label}
            aria-label={n.label}
            onClick={() => navigate({ screen: n.screen, roomId: n.screen === "chat" ? (localStorage.getItem("chatuimorph.lastRoom") ?? undefined) : undefined })}
          >
            {n.icon()}
            <span data-lb="">{n.label}</span>
          </button>
        ))}
      </div>
      {/* The rail no longer carries the room list — it is the frame's second
          track now (RoomsPanel). What is left here is the spring that keeps
          the account group on the floor; folded, the bar has no floor to keep
          and the spring says so on itself (ADR-0062). */}
      <div data-fold="shed" style={{ flex: "1 1 auto", minHeight: 0 }} aria-hidden="true" />
      <div style={{ flex: "none", padding: "12px var(--dock-pad) 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--s4)" }}>
        <button data-dockitem="" data-state="" onClick={() => shell.openDashboard()} title="Dashboard — audit, library, admin, providers" aria-label="Dashboard">
          {I.dashboard()}
          <span data-lb="">Dashboard</span>
        </button>
        <button data-dockitem="" data-state="" onClick={() => shell.openPalette()} title="Search & commands — ⌘K" aria-label="Search and commands">
          {I.search()}
          <span data-lb="">Search &amp; commands</span>
        </button>
        <button data-dockitem="" data-state="" data-fold="shed" onClick={() => setPref("theme", prefs.theme === "dark" ? "light" : "dark")} title="Toggle theme" aria-label="Toggle theme">
          {I.theme()}
          <span data-lb="">{prefs.theme === "dark" ? "Light" : "Dark"} theme</span>
        </button>
        <button data-dockitem="" data-state="" onClick={() => shell.openSettings()} title="Settings" aria-label="Settings">
          <span data-ic="" style={{ display: "contents" }}>
            <Avatar client={client} name={myName} mxc={user?.avatarUrl} />
          </span>
          <span data-lb="" style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
            {myName}
            <span style={{ fontSize: "var(--t-num)", fontWeight: 400, color: "var(--app-rail-faint)" }}>{brand.organizationLabel ?? me}</span>
          </span>
        </button>
      </div>
    </div>
  );
}
