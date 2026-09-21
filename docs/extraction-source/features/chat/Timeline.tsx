import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Direction, type MatrixClient, type MatrixEvent, type Room, type Thread } from "matrix-js-sdk";
import { EventTile, type TileActions } from "./EventTile";
import { accentFor, accentMap, formatDay, isMessage, sameDay } from "../../matrix/timeline";

const GROUP_MS = 5 * 60_000;

export function Timeline({
  client,
  room,
  thread,
  events,
  highlight,
  actions,
  version,
  label,
}: {
  client: MatrixClient;
  room: Room;
  thread: Thread | null;
  events: MatrixEvent[];
  highlight: string | null;
  actions: TileActions;
  version: number;
  label: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const atBottom = useRef(true);
  const [loading, setLoading] = useState(false);
  const [exhausted, setExhausted] = useState(false);
  const prevHeight = useRef<number | null>(null);

  const loadOlder = useCallback(async () => {
    if (loading || exhausted) return;
    setLoading(true);
    prevHeight.current = scroller.current?.scrollHeight ?? null;
    try {
      let more: boolean;
      if (thread) more = await client.paginateEventTimeline(thread.liveTimeline, { backwards: true, limit: 30 });
      else {
        await client.scrollback(room, 30);
        more = room.getLiveTimeline().getPaginationToken(Direction.Backward) !== null;
      }
      if (!more) setExhausted(true);
    } catch {
      /* offline — the button stays */
    } finally {
      setLoading(false);
    }
  }, [client, room, thread, loading, exhausted]);

  // Keep the reading position when older history is prepended; follow the bottom otherwise.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    if (prevHeight.current !== null) {
      el.scrollTop += el.scrollHeight - prevHeight.current;
      prevHeight.current = null;
    } else if (atBottom.current && !highlight) {
      el.scrollTop = el.scrollHeight;
    }
  }, [events.length, version, highlight]);

  // Jump-to-event: scroll the target into view once it is loaded, paginating back to find it.
  const jumpTries = useRef(0);
  useEffect(() => {
    jumpTries.current = 0;
  }, [highlight]);
  useEffect(() => {
    if (!highlight) return;
    const el = scroller.current?.querySelector<HTMLElement>(`[data-eventid="${CSS.escape(highlight)}"]`);
    if (el) {
      el.scrollIntoView({ block: "center" });
      el.focus({ preventScroll: true });
      return;
    }
    if (jumpTries.current < 8 && !exhausted) {
      jumpTries.current++;
      void loadOlder();
    }
  }, [highlight, events.length, exhausted, loadOlder]);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    atBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (el.scrollTop < 120) void loadOlder();
  };

  // Every sender wears one of the stylesheet's four [data-sec] slots. Built
  // here rather than in the tile because de-colliding needs the whole room at
  // once, and unconditionally because per-participant colour is the design
  // now, not a mode — what ?bubble= selects is what app.css *does* with the
  // slot, never whether a sender has one. accentFor is the floor: a sender
  // the map somehow missed still gets their own global accent, never none.
  const accents = useMemo(() => accentMap(events.map((e) => e.getSender() ?? "")), [events]);
  const slotFor = (sender: string) => accents.get(sender) ?? accentFor(sender);

  let prev: MatrixEvent | null = null;
  const rows: React.ReactNode[] = [];
  // Runs of three or more room-state changes (joins, invites, renames) fold into one line.
  const runs = new Map<string, MatrixEvent[]>();
  for (let i = 0; i < events.length; ) {
    let j = i;
    while (j < events.length && !isMessage(events[j]!)) j++;
    if (j - i >= 3) runs.set(events[i]!.getId() ?? String(i), events.slice(i, j));
    i = j === i ? i + 1 : j;
  }
  const folded = new Set<string>();
  for (const run of runs.values()) for (const e of run.slice(1)) folded.add(e.getId() ?? "");
  for (const ev of events) {
    if (folded.has(ev.getId() ?? "-")) continue;
    const run = runs.get(ev.getId() ?? "-");
    if (run) {
      if (!prev || !sameDay(prev.getTs(), ev.getTs())) {
        rows.push(
          <div key={`day-${ev.getTs()}`} data-daysep="" role="separator">
            <span data-eyebrow="">{formatDay(ev.getTs())}</span>
          </div>,
        );
      }
      rows.push(
        <details key={`run-${ev.getId()}`} data-stategroup="">
          <summary data-meta="">{run.length} room changes</summary>
          {run.map((e) => (
            <EventTile key={e.getId() ?? e.getTxnId()} client={client} room={room} ev={e} continuation={false} inThread={false} highlighted={false} actions={actions} version={version} accent={slotFor(e.getSender() ?? "")} />
          ))}
        </details>,
      );
      prev = run[run.length - 1]!;
      continue;
    }
    const ts = ev.getTs();
    if (!prev || !sameDay(prev.getTs(), ts)) {
      rows.push(
        <div key={`day-${ts}`} data-daysep="" role="separator">
          <span data-eyebrow="">{formatDay(ts)}</span>
        </div>,
      );
    }
    const continuation = !!prev && isMessage(prev) && isMessage(ev) && prev.getSender() === ev.getSender() && ts - prev.getTs() < GROUP_MS && !prev.isRedacted() && sameDay(prev.getTs(), ts);
    rows.push(
      <EventTile
        key={ev.getId() ?? ev.getTxnId()}
        client={client}
        room={room}
        ev={ev}
        continuation={continuation}
        inThread={!!thread || (!!ev.threadRootId && ev.threadRootId !== ev.getId())}
        highlighted={highlight === ev.getId()}
        actions={actions}
        version={version}
        accent={slotFor(ev.getSender() ?? "")}
      />,
    );
    prev = ev;
  }

  return (
    <div ref={scroller} onScroll={onScroll} style={{ flex: 1, overflow: "auto", padding: "26px 24px var(--s6)" }} data-scroller="">
      <div data-turnlist="" role="log" aria-label={label} aria-live="off" style={{ maxWidth: 780, margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--s5)" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {exhausted ? (
            <span data-meta="">Beginning of {thread ? "thread" : "room history"}</span>
          ) : (
            <button data-btn="text" data-state="" data-busy={String(loading)} onClick={() => void loadOlder()} style={{ position: "relative" }}>
              Load earlier
              <i data-spin="" aria-hidden="true" />
            </button>
          )}
        </div>
        {rows}
      </div>
    </div>
  );
}
