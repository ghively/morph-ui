import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ClientEvent, RoomEvent } from "matrix-js-sdk";
import { useClient } from "../../app/context";
import { useShell } from "../../app/shell/ShellContext";
import { Avatar, Empty, Seg, Sheet, SheetHead, Switch, useToast } from "../../components/primitives";
import { I } from "../../components/icons";
import { useEventVersion } from "../../matrix/hooks";
import { groupRooms } from "../../matrix/rooms";
import {
  describeDirectoryError,
  describeHierarchyError,
  describeJoinError,
  describeKnockError,
  directoryEntries,
  hierarchyEntries,
  joinAction,
  joinStateFor,
  localSpaceEntries,
  memberLabel,
  parseRoomTarget,
  resolveRoomTarget,
  topicSnippet,
  type DirectoryRoom,
  type RoomEntry,
} from "./directory";

export type BrowseTab = "spaces" | "directory" | "address";

interface ListState {
  status: "idle" | "loading" | "done";
  entries: RoomEntry[];
  next: string | undefined;
  error: string | null;
  /** True when the list came from local state because the server refused. */
  degraded: boolean;
}

const EMPTY_LIST: ListState = { status: "idle", entries: [], next: undefined, error: null, degraded: false };
const PAGE = 40;

/**
 * Browse rooms — the surface that was missing: the rooms a space holds, the
 * homeserver's public directory, and the address bar for everything neither
 * lists. Invites live here too, because an invite is just a room you have
 * already been told about.
 */
export function BrowseRooms({ tab: initialTab = "spaces", spaceId, onClose }: { tab?: BrowseTab; spaceId?: string | null; onClose: () => void }) {
  const client = useClient();
  const shell = useShell();
  const toast = useToast();
  const [nonce, setNonce] = useState(0);
  // Membership changes here and in the room list are the same events.
  useEventVersion(client, [ClientEvent.Room, RoomEvent.MyMembership]);
  const spaces = groupRooms(client).spaces;
  const [tab, setTab] = useState<BrowseTab>(initialTab);
  const [path, setPath] = useState<string[]>(() => (spaceId ? [spaceId] : spaces[0] ? [spaces[0].roomId] : []));
  const [suggestedOnly, setSuggestedOnly] = useState(false);
  const [space, setSpace] = useState<ListState>(EMPTY_LIST);
  const [dir, setDir] = useState<ListState>(EMPTY_LIST);
  const [query, setQuery] = useState("");
  /** Per-row failures stay on the row that caused them. */
  const [rowError, setRowError] = useState<Record<string, string>>({});
  const [busyRoom, setBusyRoom] = useState<string | null>(null);

  const current = path[path.length - 1] ?? null;

  /* Space children: the homeserver's hierarchy view, with local state as the
     honest fallback when it refuses (the error is shown, never swallowed). */
  useEffect(() => {
    if (tab !== "spaces" || !current) return;
    let live = true;
    setSpace({ ...EMPTY_LIST, status: "loading" });
    client.getRoomHierarchy(current, PAGE, 1, suggestedOnly).then(
      (res) => live && setSpace({ status: "done", entries: hierarchyEntries(res.rooms as DirectoryRoom[], current), next: res.next_batch, error: null, degraded: false }),
      (e: unknown) => {
        if (!live) return;
        const room = client.getRoom(current);
        const local = room ? localSpaceEntries(room, client) : [];
        setSpace({ status: "done", entries: suggestedOnly ? local.filter((x) => x.suggested) : local, next: undefined, error: describeHierarchyError(e), degraded: true });
      },
    );
    return () => {
      live = false;
    };
  }, [client, current, suggestedOnly, tab, nonce]);

  /* Public directory, debounced. An empty term lists the whole directory. */
  useEffect(() => {
    if (tab !== "directory") return;
    let live = true;
    setDir({ ...EMPTY_LIST, status: "loading" });
    const term = query.trim();
    const t = window.setTimeout(() => {
      client.publicRooms({ limit: PAGE, ...(term ? { filter: { generic_search_term: term } } : {}) }).then(
        (res) => live && setDir({ status: "done", entries: directoryEntries(res), next: res.next_batch, error: null, degraded: false }),
        (e: unknown) => live && setDir({ status: "done", entries: [], next: undefined, error: describeDirectoryError(e), degraded: false }),
      );
    }, term ? 300 : 0);
    return () => {
      live = false;
      window.clearTimeout(t);
    };
  }, [client, query, tab, nonce]);

  const loadMore = useCallback(async () => {
    try {
      if (tab === "spaces" && current && space.next) {
        const res = await client.getRoomHierarchy(current, PAGE, 1, suggestedOnly, space.next);
        setSpace((s) => ({ ...s, entries: [...s.entries, ...hierarchyEntries(res.rooms as DirectoryRoom[], current)], next: res.next_batch }));
      } else if (tab === "directory" && dir.next) {
        const term = query.trim();
        const res = await client.publicRooms({ limit: PAGE, since: dir.next, ...(term ? { filter: { generic_search_term: term } } : {}) });
        setDir((s) => ({ ...s, entries: [...s.entries, ...directoryEntries(res)], next: res.next_batch }));
      }
    } catch (e) {
      toast("Couldn't load more", describeJoinError(e), "danger");
    }
  }, [client, current, dir.next, query, space.next, suggestedOnly, tab, toast]);

  const enterSpace = useCallback((roomId: string) => {
    setTab("spaces");
    setPath((p) => (p.includes(roomId) ? p.slice(0, p.indexOf(roomId) + 1) : [...p, roomId]));
  }, []);

  const act = useCallback(
    async (entry: RoomEntry, kind: "open" | "join" | "accept" | "knock") => {
      setRowError((m) => ({ ...m, [entry.roomId]: "" }));
      if (kind === "open") {
        if (entry.isSpace) return enterSpace(entry.roomId);
        onClose();
        return shell.openRoom(entry.roomId);
      }
      setBusyRoom(entry.roomId);
      try {
        if (kind === "knock") {
          await client.knockRoom(entry.roomId, { viaServers: entry.via });
          toast("Asked to join", entry.name);
        } else {
          await client.joinRoom(entry.roomId, { viaServers: entry.via });
          if (entry.isSpace) enterSpace(entry.roomId);
          else {
            onClose();
            shell.openRoom(entry.roomId);
          }
        }
      } catch (e) {
        setRowError((m) => ({ ...m, [entry.roomId]: kind === "knock" ? describeKnockError(e) : describeJoinError(e, entry) }));
      } finally {
        setBusyRoom(null);
        setNonce((n) => n + 1);
      }
    },
    [client, enterSpace, onClose, shell, toast],
  );

  const list = tab === "spaces" ? space : dir;

  return (
    <Sheet label="Browse rooms" onClose={onClose} width={640} height={620}>
      <SheetHead title="Browse rooms" onClose={onClose} />
      <div style={{ flex: "none", padding: "0 var(--s6) var(--s4)", display: "flex", alignItems: "center", gap: "var(--s4)", flexWrap: "wrap" }}>
        <Seg
          value={tab}
          onChange={setTab}
          label="Where to look for rooms"
          options={[
            { value: "spaces", label: "Spaces" },
            { value: "directory", label: "Directory" },
            { value: "address", label: "By address" },
          ]}
        />
        {tab === "spaces" && current ? (
          <label style={{ display: "flex", alignItems: "center", gap: "var(--s2)", marginLeft: "auto", fontSize: "var(--t-meta)", color: "var(--app-dim)" }}>
            Suggested only
            <Switch on={suggestedOnly} onChange={setSuggestedOnly} label="Show suggested rooms only" />
          </label>
        ) : null}
      </div>

      {tab === "spaces" ? <SpaceBar spaces={spaces} path={path} setPath={setPath} client={client} /> : null}
      {tab === "directory" ? (
        <div style={{ flex: "none", padding: "0 var(--s6) var(--s4)" }}>
          <div data-searchcap="" style={{ maxWidth: "none" }}>
            {I.search(14)}
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${client.getDomain() ?? "the homeserver"}'s public rooms`} aria-label="Search public rooms" style={{ flex: 1, minWidth: 0, border: 0, outline: "none", background: "transparent", color: "var(--app-text)", fontSize: "var(--t-ctl)" }} />
          </div>
        </div>
      ) : null}

      <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: "0 var(--s6) var(--s6)" }}>
        {tab === "address" ? (
          <JoinByAddress onClose={onClose} />
        ) : (
          <>
            {list.error ? (
              <div data-alert="" data-tone={list.degraded ? "warn" : "danger"} role="alert" style={{ marginBottom: "var(--s4)" }}>
                <div>
                  {list.error}
                  {list.degraded ? " Showing the rooms this space lists locally instead — names and member counts may be missing." : null}
                </div>
              </div>
            ) : null}
            {tab === "spaces" && !spaces.length ? (
              <Empty title="No spaces yet">You're not in a space. Try the directory, or join one by address.</Empty>
            ) : list.status === "loading" ? (
              <div data-meta="" role="status" style={{ padding: "var(--s5)" }}>
                Loading rooms…
              </div>
            ) : list.entries.length ? (
              <>
                <div data-card="" data-pad="none">
                  <div data-rows="" data-gap="flush" role="list" aria-label={tab === "spaces" ? "Rooms in this space" : "Public rooms"}>
                    {list.entries.map((e) => (
                      <EntryRow key={e.roomId} entry={e} busy={busyRoom === e.roomId} error={rowError[e.roomId] || null} onAct={act} />
                    ))}
                  </div>
                </div>
                {list.next ? (
                  <button data-btn="" data-state="" onClick={() => void loadMore()} style={{ marginTop: "var(--s4)" }}>
                    Show more
                  </button>
                ) : null}
              </>
            ) : (
              <Empty title={tab === "spaces" ? (suggestedOnly ? "Nothing suggested here" : "This space has no rooms") : "No public rooms"}>
                {tab === "spaces" ? "Rooms added to this space will show up here." : query.trim() ? "Nothing on this homeserver matches that." : "This homeserver publishes no rooms. Try a space, or join by address."}
              </Empty>
            )}
          </>
        )}
      </div>
    </Sheet>
  );
}

/** Joined spaces, plus the trail of sub-spaces you have stepped into. */
function SpaceBar({ spaces, path, setPath, client }: { spaces: { roomId: string; name: string }[]; path: string[]; setPath: (p: string[]) => void; client: ReturnType<typeof useClient> }) {
  if (!spaces.length) return null;
  const root = path[0] ?? null;
  const trail = path.slice(1);
  return (
    <div style={{ flex: "none", padding: "0 var(--s6) var(--s4)", display: "flex", alignItems: "center", gap: "var(--s2)", flexWrap: "wrap" }}>
      {spaces.map((s) => (
        <button key={s.roomId} data-chip="" data-state="" data-on={String(root === s.roomId)} aria-pressed={root === s.roomId} onClick={() => setPath([s.roomId])}>
          {s.name}
        </button>
      ))}
      {trail.map((id, i) => (
        <span key={id} style={{ display: "inline-flex", alignItems: "center", gap: "var(--s2)" }}>
          <span data-meta="" aria-hidden="true">
            /
          </span>
          <button data-chip="" data-state="" data-on={String(i === trail.length - 1)} aria-pressed={i === trail.length - 1} onClick={() => setPath(path.slice(0, i + 2))}>
            {client.getRoom(id)?.name ?? id}
          </button>
        </span>
      ))}
    </div>
  );
}

function EntryRow({ entry, busy, error, onAct }: { entry: RoomEntry; busy: boolean; error: string | null; onAct: (e: RoomEntry, kind: "open" | "join" | "accept" | "knock") => void | Promise<void> }) {
  const client = useClient();
  const state = joinStateFor(client, entry.roomId);
  const action = joinAction(state, entry);
  const topic = topicSnippet(entry.topic);
  const members = memberLabel(entry.memberCount);
  const meta = [entry.alias, members].filter(Boolean).join(" · ");
  return (
    <div data-row="" role="listitem" data-size="lg" style={{ alignItems: "flex-start" }}>
      <Avatar client={client} name={entry.name} mxc={entry.avatarUrl} size="lg" />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--s2)", minWidth: 0 }}>
          <span data-strong="" data-ell="" style={{ minWidth: 0 }}>
            {entry.name}
          </span>
          {entry.isSpace ? <span data-tag="">Space</span> : null}
          {entry.suggested ? <span data-tag="" data-solid="">Suggested</span> : null}
          {state === "invite" ? <span data-tag="" data-solid="">Invited</span> : null}
          {state === "join" ? <span data-tag="">Joined</span> : null}
          {entry.joinRule === "knock" && state === "none" ? <span data-tag="">Ask to join</span> : null}
        </div>
        {meta ? (
          <div data-meta="" data-ell="">
            {meta}
          </div>
        ) : null}
        {topic ? (
          <div data-meta="" style={{ marginTop: "var(--seam)", color: "var(--app-dim)" }}>
            {topic}
          </div>
        ) : null}
        {error ? (
          <div data-meta="" role="alert" style={{ marginTop: "var(--s2)", color: "var(--danger-ink)" }}>
            {error}
          </div>
        ) : null}
      </div>
      {entry.isSpace && action.kind !== "open" ? (
        <button data-btn="" data-state="" onClick={() => void onAct(entry, "open")} style={{ flex: "none" }} aria-label={`Browse ${entry.name}`}>
          Browse
        </button>
      ) : null}
      <button
        data-btn={action.kind === "open" ? undefined : "accent"}
        data-state=""
        data-busy={String(busy)}
        disabled={action.disabled || busy}
        onClick={() => void onAct(entry, action.kind === "waiting" ? "open" : action.kind)}
        style={{ position: "relative", flex: "none" }}
        aria-label={`${action.label} ${entry.name}`}
      >
        {action.label}
        <i data-spin="" aria-hidden="true" />
      </button>
    </div>
  );
}

/** The escape hatch: a room nobody lists, joined by the address you were given. */
function JoinByAddress({ onClose }: { onClose: () => void }) {
  const client = useClient();
  const shell = useShell();
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const target = parseRoomTarget(value);
    if (target.kind === "invalid") return setError(target.reason);
    setBusy(true);
    try {
      const { roomId, via } = await resolveRoomTarget(client, target);
      if (joinStateFor(client, roomId) !== "join") await client.joinRoom(roomId, { viaServers: via });
      onClose();
      shell.openRoom(roomId);
    } catch (err) {
      setError(describeJoinError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "var(--s4)" }}>
      <div data-formfield="">
        <label htmlFor="br-address">Room address</label>
        <input id="br-address" data-field="" value={value} onChange={(ev) => setValue(ev.target.value)} placeholder="#general:example.org" autoComplete="off" spellCheck={false} />
      </div>
      <div data-meta="">An alias (#room:server), a room ID (!id:server), or a matrix.to link. Private rooms still need an invite — you'll be told if this one does.</div>
      {error ? (
        <div data-alert="" data-tone="danger" role="alert">
          <div>{error}</div>
        </div>
      ) : null}
      <button type="submit" data-btn="fill" data-state="" data-busy={String(busy)} disabled={busy || !value.trim()} style={{ position: "relative", alignSelf: "flex-start" }}>
        Join room
        <i data-spin="" aria-hidden="true" />
      </button>
    </form>
  );
}
