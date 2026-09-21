import { useClient } from "../context";
import { useShell } from "./ShellContext";
import { I } from "../../components/icons";
import { RoomNav } from "./RoomNav";

/**
 * The rooms sidebar — the frame's second track.
 *
 * It is the same primitive as the thread drawer ([data-leftzone] >
 * [data-leftpanel]); the slot it declares is what puts it in track 2 at
 * --rooms-w rather than track 3 (src/app.css, "THE FRAME"). The room list
 * itself is unchanged — RoomNav moved out of the dock and into here, so the
 * rail is a rail again and rooms are always visible.
 */
export function RoomsPanel({ open }: { open: boolean }) {
  const client = useClient();
  const shell = useShell();
  const host = (() => {
    try {
      return new URL(client.getHomeserverUrl()).host;
    } catch {
      return client.getHomeserverUrl();
    }
  })();
  return (
    <div data-leftpanel="" data-slot="drawer" data-open={String(open)} data-sec="blue" aria-hidden={!open} inert={!open ? true : undefined}>
      <div style={{ height: "var(--h-bar)", flex: "none", display: "flex", alignItems: "center", gap: "var(--s3)", padding: "0 var(--s2) 0 var(--s5)" }}>
        <div data-tile="" style={{ width: 26, height: 26 }}>
          {I.chats(14)}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div data-strong="">Rooms</div>
          <div style={{ fontSize: "var(--t-meta)", color: "var(--app-rail-faint)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{host}</div>
        </div>
        <button data-iconbtn="" onClick={() => shell.toggleRooms(false)} title="Collapse rooms — ⌘/" aria-label="Collapse rooms" aria-expanded={open} aria-controls="shell-rooms" style={{ color: "var(--app-rail-dim)" }}>
          {I.close()}
        </button>
      </div>
      <div id="shell-rooms" style={{ flex: 1, minHeight: 0, overflow: "auto", padding: "0 0 var(--s4)", display: "flex", flexDirection: "column" }}>
        <RoomNav />
      </div>
    </div>
  );
}
