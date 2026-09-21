import { useEffect, useMemo, useRef, useState } from "react";
import type { MatrixEvent } from "matrix-js-sdk";
import { useClient } from "../../app/context";
import { useShell } from "../../app/shell/ShellContext";
import { navigate } from "../../app/routes";
import { usePrefs } from "../../app/prefs";
import { groupRooms, openDirectMessage } from "../../matrix/rooms";
import { agentDirectory, runtimeLabel } from "../../agent/profile";
import { previewText } from "../../matrix/timeline";
import { Sheet } from "../../components/primitives";
import { I } from "../../components/icons";

interface Row {
  id: string;
  group: string;
  label: string;
  hint?: string;
  run: () => void;
}

type ServerState = { state: "idle" } | { state: "loading" } | { state: "done"; results: { roomId: string; ev: MatrixEvent }[] } | { state: "error"; message: string };

export function Palette({ initial, onClose }: { initial: string; onClose: () => void }) {
  const client = useClient();
  const shell = useShell();
  const { prefs, setPref } = usePrefs();
  const [q, setQ] = useState(initial);
  const [active, setActive] = useState(0);
  const [users, setUsers] = useState<{ user_id: string; display_name?: string }[]>([]);
  const [server, setServer] = useState<ServerState>({ state: "idle" });
  const listRef = useRef<HTMLDivElement>(null);
  const term = q.trim();

  // People: the homeserver's user directory (debounced).
  useEffect(() => {
    if (term.length < 2) return setUsers([]);
    const t = window.setTimeout(() => void client.searchUserDirectory({ term, limit: 8 }).then((r) => setUsers(r.results), () => setUsers([])), 250);
    return () => window.clearTimeout(t);
  }, [client, term]);

  // Messages: Matrix server-side search. It cannot see encrypted rooms, and says so.
  useEffect(() => {
    if (term.length < 3) return setServer({ state: "idle" });
    setServer({ state: "loading" });
    let live = true;
    const t = window.setTimeout(() => {
      client.searchRoomEvents({ term }).then(
        (res) => {
          if (!live) return;
          const results = res.results
            .map((r) => r.context.getEvent())
            .filter((ev): ev is MatrixEvent => !!ev && !!ev.getRoomId())
            .slice(0, 8)
            .map((ev) => ({ roomId: ev.getRoomId()!, ev }));
          setServer({ state: "done", results });
        },
        (e: { errcode?: string; message?: string }) => live && setServer({ state: "error", message: e.errcode === "M_UNRECOGNIZED" ? "This homeserver doesn't support server-side search." : `Server search failed: ${e.message ?? "unknown error"}` }),
      );
    }, 400);
    return () => {
      live = false;
      window.clearTimeout(t);
    };
  }, [client, term]);

  const rows: Row[] = useMemo(() => {
    const f = term.toLowerCase();
    const out: Row[] = [];
    const commands: Row[] = [
      { id: "c-new", group: "Commands", label: "New room", hint: "create", run: () => shell.openCreateRoom() },
      { id: "c-space", group: "Commands", label: "New space", hint: "create", run: () => shell.openCreateRoom({ space: true }) },
      { id: "c-browse", group: "Commands", label: "Browse rooms", hint: "spaces & directory", run: () => shell.openBrowse() },
      { id: "c-join", group: "Commands", label: "Join a room by address", hint: "#room:server", run: () => shell.openBrowse({ tab: "address" }) },
      { id: "c-agents", group: "Commands", label: "Go to Agents", hint: "section", run: () => navigate({ screen: "agents" }) },
      { id: "c-notes", group: "Commands", label: "Go to Notes", hint: "section", run: () => navigate({ screen: "notes" }) },
      { id: "c-ws", group: "Commands", label: "Go to Workspace", hint: "section", run: () => navigate({ screen: "workspace" }) },
      { id: "c-sec", group: "Commands", label: "Security & verification", hint: "workspace", run: () => navigate({ screen: "workspace", tab: "security" }) },
      { id: "c-lib", group: "Commands", label: "Open Library", hint: "section", run: () => navigate({ screen: "library" }) },
      { id: "c-audit", group: "Commands", label: "Open Audit", hint: "section", run: () => navigate({ screen: "audit" }) },
      { id: "c-admin", group: "Commands", label: "Open Admin", hint: "section", run: () => navigate({ screen: "admin" }) },
      { id: "c-prov", group: "Commands", label: "Telemetry, Models, Evaluations", hint: "providers", run: () => navigate({ screen: "providers" }) },
      { id: "c-theme", group: "Commands", label: `Switch to ${prefs.theme === "dark" ? "light" : "dark"} theme`, hint: "appearance", run: () => setPref("theme", prefs.theme === "dark" ? "light" : "dark") },
      { id: "c-rooms", group: "Commands", label: "Toggle the rooms sidebar", hint: "⌘/", run: () => shell.toggleRooms() },
      { id: "c-threads", group: "Commands", label: "Toggle the thread drawer", run: () => shell.toggleLeft() },
      { id: "c-settings", group: "Commands", label: "Settings", hint: "preferences", run: () => shell.openSettings() },
    ];
    out.push(...commands.filter((c) => !f || c.label.toLowerCase().includes(f) || (c.hint ?? "").toLowerCase().includes(f)).slice(0, f ? 6 : 15));
    const rooms = groupRooms(client, term).groups.flatMap((g) => g.rooms);
    const seen = new Set<string>();
    for (const r of rooms) {
      if (seen.has(r.roomId)) continue;
      seen.add(r.roomId);
      out.push({ id: `r-${r.roomId}`, group: "Rooms", label: r.name, hint: r.alias ?? (r.isDm ? "direct message" : "room"), run: () => shell.openRoom(r.roomId) });
      if (seen.size >= 6) break;
    }
    const dir = agentDirectory(client);
    const people = new Map<string, { name: string; hint: string }>();
    for (const [uid, a] of dir) {
      const name = client.getUser(uid)?.displayName ?? uid;
      if (!f || name.toLowerCase().includes(f) || uid.includes(f) || a.profile.capabilities.some((c) => c.toLowerCase().includes(f))) people.set(uid, { name, hint: `agent · ${runtimeLabel(a.profile.runtime)}` });
    }
    for (const u of users) if (!people.has(u.user_id)) people.set(u.user_id, { name: u.display_name ?? u.user_id, hint: u.user_id });
    for (const [uid, p] of [...people].slice(0, 6))
      out.push({ id: `p-${uid}`, group: "Agents & people", label: p.name, hint: p.hint, run: () => void openDirectMessage(client, uid, { encrypted: !dir.has(uid) }).then((rid) => shell.openRoom(rid)) });
    if (f) {
      let n = 0;
      for (const room of client.getRooms()) {
        for (const t of room.getThreads()) {
          const text = previewText(t.rootEvent, 120);
          if (text.toLowerCase().includes(f) && n < 5) {
            n++;
            out.push({ id: `t-${t.id}`, group: "Threads", label: text, hint: room.name, run: () => shell.openThread(room.roomId, t.id) });
          }
        }
      }
    }
    if (server.state === "done")
      for (const r of server.results)
        out.push({ id: `m-${r.ev.getId()}`, group: "Messages", label: previewText(r.ev, 120), hint: client.getRoom(r.roomId)?.name ?? r.roomId, run: () => shell.openRoom(r.roomId, { eventId: r.ev.getId() }) });
    return out;
  }, [term, client, users, server, shell, prefs.theme, setPref]);

  useEffect(() => setActive(0), [term]);
  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const choose = (r: Row | undefined) => {
    if (!r) return;
    onClose();
    r.run();
  };

  let lastGroup = "";
  return (
    <Sheet label="Search and commands" onClose={onClose}>
      <div style={{ flex: "none", display: "flex", alignItems: "center", gap: "var(--s4)", padding: "var(--s5) var(--s6)" }}>
        {I.search()}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search rooms, agents, threads, messages — or run a command"
          style={{ flex: 1, minWidth: 0, border: 0, background: "transparent", color: "var(--app-text)", fontSize: "var(--t-input)", outline: "none" }}
          aria-label="Search rooms, agents, threads, messages or commands"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={rows[active] ? `pal-${active}` : undefined}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, rows.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              choose(rows[active]);
            }
          }}
        />
        <span data-kbd="">esc</span>
      </div>
      <div ref={listRef} data-rows="" id="palette-list" role="listbox" aria-label="Results" style={{ flex: 1, overflow: "auto", padding: "var(--s3)", maxHeight: "60vh" }}>
        {rows.map((r, i) => {
          const head = r.group !== lastGroup ? (
            <div key={`h-${r.group}`} data-eyebrow="" style={{ margin: "var(--s2) var(--s3)" }} role="presentation">
              {r.group}
            </div>
          ) : null;
          lastGroup = r.group;
          return [
            head,
            <button key={r.id} id={`pal-${i}`} data-idx={i} data-palrow="" data-state="" data-on={String(i === active)} role="option" aria-selected={i === active} onClick={() => choose(r)} onMouseEnter={() => setActive(i)}>
              <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.label}</span>
              {r.hint ? <span data-palhint="">{r.hint}</span> : null}
            </button>,
          ];
        })}
        {term.length >= 3 ? (
          <div data-meta="" style={{ padding: "var(--s3)" }} role="status">
            {server.state === "loading" ? "Searching messages on your homeserver…" : server.state === "error" ? server.message : server.state === "done" && !server.results.length ? "No message matches on the server." : null}
            {server.state !== "loading" ? " Server search covers unencrypted rooms only." : null}
          </div>
        ) : null}
        {!rows.length ? (
          <div data-empty="">
            <div data-eyebrow="">Nothing matches</div>
            <div>Try a room name, an agent, or “new”.</div>
          </div>
        ) : null}
      </div>
    </Sheet>
  );
}
