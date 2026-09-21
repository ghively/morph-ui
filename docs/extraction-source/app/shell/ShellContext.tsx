import { createContext, useContext } from "react";
import type { MatrixEvent } from "matrix-js-sdk";
import type { Width } from "./columns";

export type RightPanel = { kind: "artifact"; roomId: string; eventId: string } | { kind: "details"; roomId: string | null; userId: string | null } | null;

/** The thread the drawer is showing, if any. It always belongs to the open room. */
export interface DrawerThread {
  roomId: string;
  threadId: string;
}

export interface ShellApi {
  /** ≤ --fold-bp: one column, every rail is a sheet over it. */
  folded: boolean;
  /** ≤ --tab-bp: the thread drawer and the right edge overlay rather than displace. */
  width: Width;
  /** Is the rooms sidebar open. */
  rooms: boolean;
  /** Is the thread drawer open. */
  threads: boolean;
  /** The thread the drawer is showing, or null for its list. */
  drawerThread: DrawerThread | null;
  openRoom(roomId: string, opts?: { eventId?: string }): void;
  /**
   * Open a thread. By default it opens *in the drawer*, which is where threads
   * live now; `main` promotes it to the conversation pane instead — the
   * explicit affordance that replaced the retired second pane.
   */
  openThread(roomId: string, threadId: string, opts?: { main?: boolean; eventId?: string }): void;
  /** Back out of the thread the drawer is showing, to its list. */
  closeDrawerThread(): void;
  closeThread(): void;
  openArtifact(roomId: string, ev: MatrixEvent): void;
  openDetails(roomId: string | null, userId: string | null): void;
  closeRight(): void;
  /** The thread drawer. */
  toggleLeft(force?: boolean): void;
  /** The rooms sidebar — ⌘/. */
  toggleRooms(force?: boolean): void;
  openPalette(query?: string): void;
  openSettings(tab?: string): void;
  openDashboard(tab?: string): void;
  openCreateRoom(opts?: { spaceId?: string | null; space?: boolean }): void;
  openBrowse(opts?: { spaceId?: string | null; tab?: "spaces" | "directory" | "address" }): void;
  /** Insert an @mention into the composer of the conversation currently on screen. */
  mention(userId: string, name: string): void;
}

export const ShellCtx = createContext<ShellApi | null>(null);
export function useShell(): ShellApi {
  const v = useContext(ShellCtx);
  if (!v) throw new Error("ShellCtx missing");
  return v;
}

export const MENTION_EVENT = "chatuimorph:mention";
export interface MentionDetail {
  userId: string;
  name: string;
}
