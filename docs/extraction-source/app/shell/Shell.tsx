import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ClientEvent, RoomEvent, type MatrixEvent } from "matrix-js-sdk";
import { useClient, useConnection } from "../context";
import { useTheme } from "../../theme/context";
import { navigate, parseHash, useRoute, type Screen } from "../routes";
import { usePrefs } from "../prefs";
import { Frame } from "./Frame";
import { Dock } from "./Dock";
import { LeftPanel } from "./LeftPanel";
import { RoomsPanel } from "./RoomsPanel";
import { PaneHead } from "./PaneHead";
import { MENTION_EVENT, ShellCtx, type DrawerThread, type MentionDetail, type RightPanel, type ShellApi } from "./ShellContext";
import { drawerState, escapeTarget, initialColumns, onWidthChange, overlays, remember, FOLD_QUERY, TAB_QUERY, type Columns, type Width } from "./columns";
import { ChatScreen } from "../../features/chat/ChatScreen";
import { ArtifactPanel } from "../../features/chat/ArtifactPanel";
import { DetailsPanel } from "../../features/chat/DetailsPanel";
import { Palette } from "../../features/search/Palette";
import { SettingsSheet } from "../../features/settings/SettingsSheet";
import { CreateRoomDialog } from "../../features/chat/CreateRoomDialog";
import { useEventVersion } from "../../matrix/hooks";
import { useNotifications } from "../../matrix/notifications";
import { usePushBridge } from "../../push/usePush";
import { I } from "../../components/icons";

// Non-chat screens load on first visit (perf: the entry bundle carries the
// chat surface only). Chat stays eager — it is the landing screen.
const AgentsScreen = lazy(() => import("../../features/agents/AgentsScreen").then((m) => ({ default: m.AgentsScreen })));
const WorkspaceScreen = lazy(() => import("../../features/workspace/WorkspaceScreen").then((m) => ({ default: m.WorkspaceScreen })));
const NotesScreen = lazy(() => import("../../features/notes/NotesScreen").then((m) => ({ default: m.NotesScreen })));
const LibraryScreen = lazy(() => import("../../features/library/LibraryScreen").then((m) => ({ default: m.LibraryScreen })));
const AuditScreen = lazy(() => import("../../features/audit/AuditScreen").then((m) => ({ default: m.AuditScreen })));
const AdminScreen = lazy(() => import("../../features/admin/AdminScreen").then((m) => ({ default: m.AdminScreen })));
const ProvidersScreen = lazy(() => import("../../features/admin/ProvidersScreen").then((m) => ({ default: m.ProvidersScreen })));
const DevComponents = lazy(() => import("./DevComponents").then((m) => ({ default: m.DevComponents })));
// The dashboard drawer re-hosts the audit/library/admin/providers screens —
// lazy so those (and their deps) stay out of the entry chunk.
const Dashboard = lazy(() => import("./Dashboard").then((m) => ({ default: m.Dashboard })));
const BrowseRooms = lazy(() => import("../../features/discover/BrowseRooms").then((m) => ({ default: m.BrowseRooms })));

function ScreenFallback() {
  return (
    <div style={{ flex: 1, display: "grid", placeItems: "center" }}>
      <div data-empty="" role="status" aria-live="polite">
        <div data-tile="">
          <span data-dot="" data-live="" />
        </div>
        <div data-eyebrow="">Loading…</div>
      </div>
    </div>
  );
}

const SECS: Record<Screen, string> = { chat: "blue", agents: "blue", notes: "gold", library: "gold", workspace: "cyan", providers: "cyan", admin: "green", audit: "green", devcomponents: "green" };

/** The viewport class, read once from the stylesheet's own two breakpoints. */
function currentWidth(): Width {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return "desk";
  if (window.matchMedia(FOLD_QUERY).matches) return "phone";
  if (window.matchMedia(TAB_QUERY).matches) return "tablet";
  return "desk";
}

/** Connection phases that are still trying. A spinner on one of these needs a deadline. */
const TRYING = new Set(["starting", "connecting", "syncing", "reconnecting"]);
const STALL_MS = 10_000;

export function Shell() {
  const client = useClient();
  const conn = useConnection();
  const { brand } = useTheme();
  const { prefs, setPref } = usePrefs();
  const route = useRoute();
  const [width, setWidth] = useState<Width>(currentWidth);
  const [columns, setColumns] = useState<Columns>(() => initialColumns(prefs, currentWidth()));
  const [drawerThread, setDrawerThread] = useState<DrawerThread | null>(null);
  const [right, setRight] = useState<RightPanel>(null);
  const [palette, setPalette] = useState<string | null>(null);
  const [settings, setSettings] = useState<string | null>(null);
  const [dash, setDash] = useState<string | null>(null);
  const [createRoom, setCreateRoom] = useState<{ spaceId?: string | null; space?: boolean } | null>(null);
  const [browse, setBrowse] = useState<{ spaceId?: string | null; tab?: "spaces" | "directory" | "address" } | null>(null);
  useEventVersion(client, [ClientEvent.Room, RoomEvent.Name]);
  useNotifications(client, route);
  usePushBridge(client);

  // Latest-value refs, so the media listener and the column writer are stable
  // for the life of the shell and the context object below does not churn.
  const colPrefsRef = useRef({ roomsOpen: prefs.roomsOpen, threadsOpen: prefs.threadsOpen });
  colPrefsRef.current = { roomsOpen: prefs.roomsOpen, threadsOpen: prefs.threadsOpen };
  const setPrefRef = useRef(setPref);
  setPrefRef.current = setPref;
  const widthRef = useRef(width);
  widthRef.current = width;
  const columnsRef = useRef(columns);
  columnsRef.current = columns;

  // One listener per breakpoint; the columns follow the width, and a width
  // that closes a column never writes that away as a preference.
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const queries = [window.matchMedia(FOLD_QUERY), window.matchMedia(TAB_QUERY)];
    const on = () => {
      const next = currentWidth();
      const from = widthRef.current;
      if (from === next) return;
      widthRef.current = next;
      setWidth(next);
      setColumns((c) => onWidthChange(c, colPrefsRef.current, from, next));
    };
    for (const q of queries) q.addEventListener("change", on);
    return () => {
      for (const q of queries) q.removeEventListener("change", on);
    };
  }, []);

  // A thread belongs to a room: leave the room and the drawer drops it.
  useEffect(() => {
    setDrawerThread((t) => (t && t.roomId !== route.roomId ? null : t));
  }, [route.roomId]);

  // Land in the most recent room when the route names none.
  useEffect(() => {
    if (route.screen !== "chat" || route.roomId || !conn.hasSynced) return;
    const last = localStorage.getItem("chatuimorph.lastRoom");
    if (last && client.getRoom(last)?.getMyMembership() === "join") navigate({ roomId: last }, { replace: true });
  }, [route.screen, route.roomId, conn.hasSynced, client]);
  useEffect(() => {
    if (route.roomId) localStorage.setItem("chatuimorph.lastRoom", route.roomId);
  }, [route.roomId]);

  // #/?tab=browse opens room discovery — a deep link a fixture build, a
  // bookmark or an onboarding message can hand you.
  useEffect(() => {
    if (route.screen === "chat" && route.tab === "browse") setBrowse({});
  }, [route.screen, route.tab]);
  const closeBrowse = useCallback(() => {
    setBrowse(null);
    if (parseHash(window.location.hash).tab === "browse") navigate({ roomId: route.roomId ?? undefined }, { replace: true });
  }, [route.roomId]);

  const setColumn = useCallback((column: keyof Columns, force?: boolean) => {
    const c = columnsRef.current;
    const open = typeof force === "boolean" ? force : !c[column];
    if (open === c[column]) return;
    // Only a toggle at a width where this is a *column* is a preference; a
    // phone dismissing a sheet must not erase the desk's layout (columns.ts).
    if (remember(widthRef.current, column)) setPrefRef.current(column === "rooms" ? "roomsOpen" : "threadsOpen", open);
    setColumns({ ...c, [column]: open });
  }, []);

  const ov = overlays(width);
  const api: ShellApi = useMemo(
    () => ({
      folded: width === "phone",
      width,
      rooms: columns.rooms,
      threads: columns.threads,
      drawerThread,
      openRoom: (roomId, opts) => {
        navigate({ roomId, eventId: opts?.eventId });
        setDrawerThread(null);
        setColumns((c) => ({ rooms: ov.rooms ? false : c.rooms, threads: ov.threads ? false : c.threads }));
      },
      // Threads open in the drawer. `main` is the one affordance that promotes
      // one into the conversation pane — it replaced the second pane outright.
      openThread: (roomId, threadId, opts) => {
        if (opts?.main) {
          navigate({ roomId, threadId, eventId: opts.eventId });
          setDrawerThread(null);
          if (ov.threads) setColumns((c) => ({ ...c, threads: false }));
          return;
        }
        if (route.roomId !== roomId || route.threadId) navigate({ roomId });
        setDrawerThread({ roomId, threadId });
        setColumns((c) => ({ rooms: ov.rooms ? false : c.rooms, threads: true }));
      },
      closeDrawerThread: () => setDrawerThread(null),
      closeThread: () => route.roomId && navigate({ roomId: route.roomId }),
      openArtifact: (roomId: string, ev: MatrixEvent) => setRight({ kind: "artifact", roomId, eventId: ev.getId()! }),
      openDetails: (roomId, userId) => setRight({ kind: "details", roomId, userId }),
      closeRight: () => setRight(null),
      toggleLeft: (force) => setColumn("threads", force),
      toggleRooms: (force) => setColumn("rooms", force),
      openPalette: (q = "") => setPalette(q),
      openSettings: (tab = "general") => setSettings(tab),
      openDashboard: (tab = "audit") => setDash(tab),
      openCreateRoom: (opts = {}) => setCreateRoom(opts),
      openBrowse: (opts = {}) => setBrowse(opts),
      mention: (userId, name) => window.dispatchEvent(new CustomEvent<MentionDetail>(MENTION_EVENT, { detail: { userId, name } })),
    }),
    [width, columns.rooms, columns.threads, drawerThread, route.roomId, route.threadId, ov.rooms, ov.threads, setColumn],
  );

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((p) => (p === null ? "" : null));
      } else if (mod && e.key === "/") {
        e.preventDefault();
        setColumn("rooms");
      } else if (e.key === "Escape") {
        // One level per press, outermost first (columns.ts).
        const target = escapeTarget({ ...columns, right: !!right, width });
        if (!target) return;
        e.preventDefault();
        if (target === "right") setRight(null);
        else setColumn(target, false);
      }
    },
    [columns, right, width, setColumn],
  );
  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  const screen = route.screen;
  const offline = conn.phase === "offline" || conn.phase === "reconnecting";
  const stalled = useStalled(conn.phase, conn.hasSynced);
  const showLeft = screen === "chat" && columns.threads;
  const showRooms = screen === "chat" && columns.rooms;

  let body: React.ReactNode;
  switch (screen) {
    case "agents":
      body = <AgentsScreen />;
      break;
    case "workspace":
      body = <WorkspaceScreen tab={route.tab} />;
      break;
    case "notes":
      body = <NotesScreen />;
      break;
    case "library":
      body = <LibraryScreen />;
      break;
    case "audit":
      body = <AuditScreen />;
      break;
    case "devcomponents":
      body = <DevComponents />;
      break;
    case "admin":
      body = <AdminScreen />;
      break;
    case "providers":
      body = <ProvidersScreen />;
      break;
    default:
      body = <ChatScreen route={route} />;
  }

  return (
    <ShellCtx.Provider value={api}>
      <Frame sec={SECS[screen]} left={drawerState(showLeft, !!drawerThread)} rooms={showRooms} right={!!right} folded={width === "phone"} offline={offline}>
        <Dock screen={screen} />
        <div data-leftzone="">
          <button data-scrimhit="" onClick={() => setColumn("rooms", false)} aria-label="Close rooms" tabIndex={-1} />
          <RoomsPanel open={showRooms} />
        </div>
        <div data-leftzone="" role="complementary" aria-label="Threads">
          <button data-scrimhit="" onClick={() => setColumn("threads", false)} aria-label="Close threads" tabIndex={-1} />
          <LeftPanel open={showLeft} route={route} />
        </div>
        <div data-inner="">
          <div data-pane="" role="main" data-sec={brand.accent ?? SECS[screen]}>
            <PaneHead route={route} leftOpen={showLeft} right={right} />
            {offline || stalled ? <ConnectionBanner phase={conn.phase} host={hostOf(client.getHomeserverUrl())} /> : null}
            <div data-slot="pane">
              <Suspense fallback={<ScreenFallback />}>{body}</Suspense>
            </div>
          </div>
        </div>
        <div data-edgezone="" role="complementary" aria-label="Panels">
          <button data-scrimhit="" onClick={() => setRight(null)} aria-label="Close panel" tabIndex={-1} />
          <button data-edgehandle="" onClick={() => route.roomId && setRight({ kind: "details", roomId: route.roomId, userId: null })} title="Open room details" aria-label="Open room details">
            {I.chevronLeft()}
          </button>
          <div data-edgepanel="" data-slot="edge" data-open={String(right?.kind === "artifact")} data-sec="cyan">
            {right?.kind === "artifact" ? <ArtifactPanel roomId={right.roomId} eventId={right.eventId} /> : null}
          </div>
          <div data-edgepanel="" data-slot="edge" data-open={String(right?.kind === "details")} data-sec="gold">
            {right?.kind === "details" ? <DetailsPanel roomId={right.roomId} userId={right.userId} /> : null}
          </div>
        </div>
        {/* The sheets are children of the frame, not siblings of it: every
            --s*, --r-*, --t-* and every theme token is declared on [data-frame]
            and on [data-theme-id], so a modal rendered outside one lost its
            padding, its corners AND its light/dark tone. They are
            position:fixed, so being inside changes no geometry (T-703). */}
        {palette !== null ? <Palette initial={palette} onClose={() => setPalette(null)} /> : null}
        {settings !== null ? <SettingsSheet tab={settings} onTab={setSettings} onClose={() => setSettings(null)} /> : null}
        {dash !== null ? (
          <Suspense fallback={null}>
            <Dashboard tab={dash} onTab={setDash} onClose={() => setDash(null)} />
          </Suspense>
        ) : null}
        {createRoom ? <CreateRoomDialog {...createRoom} onClose={() => setCreateRoom(null)} /> : null}
        {browse ? (
          <Suspense fallback={null}>
            <BrowseRooms {...browse} onClose={closeBrowse} />
          </Suspense>
        ) : null}
      </Frame>
    </ShellCtx.Provider>
  );
}

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

/**
 * A connecting phase that never resolves. The service worker can serve this
 * shell with no network at all behind it, so "connecting…" is a state the app
 * can sit in forever — it gets a deadline and then says so.
 */
function useStalled(phase: string, hasSynced: boolean): boolean {
  const [stalled, setStalled] = useState(false);
  useEffect(() => {
    if (hasSynced || !TRYING.has(phase)) {
      setStalled(false);
      return;
    }
    const t = window.setTimeout(() => setStalled(true), STALL_MS);
    return () => window.clearTimeout(t);
  }, [phase, hasSynced]);
  return stalled;
}

/**
 * The offline shell state (spec §4). The app shell comes out of the service
 * worker cache whether or not the homeserver is reachable, so the one thing
 * the user must never have to guess is which of the two is missing.
 *
 * It says only that, and says it once: the composer's own offline note (what
 * happens to a message you write now) is the other half and stays where the
 * typing is.
 */
function ConnectionBanner({ phase, host }: { phase: string; host: string }) {
  const offline = phase === "offline";
  return (
    <div style={{ flex: "none", padding: "var(--s2) var(--s5) 0" }}>
      <div data-alert="" data-tone={offline ? "danger" : "warn"} role="status" aria-live="polite">
        <span data-dot="" style={{ width: 8, height: 8, flex: "none" }} />
        <div>
          <strong>{offline ? "Offline" : "Still connecting"}</strong>{" "}
          {offline
            ? `${host} is unreachable. This shell is running from its cache.`
            : `${host} hasn't answered yet. This shell loaded from its cache; your rooms appear as soon as the homeserver responds.`}
        </div>
        <button data-btn="text" data-state="" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    </div>
  );
}
