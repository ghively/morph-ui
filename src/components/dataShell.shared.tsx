/**
 * Shared hooks + helpers for the DATA_SHELL components (batch, 2026-10). Not
 * exported from the package index; the components re-export what consumers
 * need. Conventions follow agentOps.shared: local accent `--c`, reduced-motion
 * guards, pointer-capture drag, tabular-nums.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react';

/** Set a local accent custom property from a token or series value. */
export const cv = (c: string) => ({ ['--c' as string]: c }) as CSSProperties;

export const reducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** position:fixed resolves against the nearest transformed/filtered ancestor. */
export function fixedOrigin(el: HTMLElement | null): { x: number; y: number } {
  for (let n = el?.parentElement; n && n !== document.documentElement; n = n.parentElement) {
    const cs = getComputedStyle(n);
    if (
      cs.transform !== 'none' || cs.filter !== 'none' || cs.perspective !== 'none' ||
      (cs.backdropFilter && cs.backdropFilter !== 'none') ||
      /paint|layout|strict|content/.test(cs.contain || '') || /transform|filter/.test(cs.willChange || '')
    ) {
      const r = n.getBoundingClientRect();
      return { x: r.left - n.scrollLeft, y: r.top - n.scrollTop };
    }
  }
  return { x: 0, y: 0 };
}

/**
 * One pointer-drag loop with pointer capture, shared by KanbanBoard and
 * SortableList. Callers get `active` (dragging id), and handlers to spread onto
 * the drag handle/card. `onMove` receives the last pointer position while the
 * drag is live; drop ends the drag.
 */
export interface PointerDragState<T = string> {
  active: T | null;
  bind: (id: T) => {
    onPointerDown: (e: ReactPointerEvent<HTMLElement>) => void;
    onPointerMove: (e: ReactPointerEvent<HTMLElement>) => void;
    onPointerUp: (e: ReactPointerEvent<HTMLElement>) => void;
    onPointerCancel: (e: ReactPointerEvent<HTMLElement>) => void;
  };
  cancel: () => void;
}

export function usePointerDrag<T extends string>(
  onDrop: (id: T, pos: { x: number; y: number }) => void,
  onMove?: (id: T, pos: { x: number; y: number }) => void,
): PointerDragState<T> {
  const [active, setActive] = useState<T | null>(null);
  const activeRef = useRef<T | null>(null);
  const downRef = useRef<{ x: number; y: number } | null>(null);

  const end = useCallback(() => {
    activeRef.current = null;
    downRef.current = null;
    setActive(null);
  }, []);

  const bind = useCallback(
    (id: T) => ({
      onPointerDown: (e: ReactPointerEvent<HTMLElement>) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.currentTarget.setPointerCapture?.(e.pointerId);
        downRef.current = { x: e.clientX, y: e.clientY };
        activeRef.current = id;
        setActive(id);
      },
      onPointerMove: (e: ReactPointerEvent<HTMLElement>) => {
        if (activeRef.current !== id) return;
        onMove?.(id, { x: e.clientX, y: e.clientY });
      },
      onPointerUp: (e: ReactPointerEvent<HTMLElement>) => {
        if (activeRef.current !== id) return;
        e.currentTarget.releasePointerCapture?.(e.pointerId);
        onDrop(id, { x: e.clientX, y: e.clientY });
        end();
      },
      onPointerCancel: () => {
        if (activeRef.current !== id) return;
        end();
      },
    }),
    [onDrop, onMove, end],
  );

  return { active, bind, cancel: end };
}

/** Roving-index keyboard nav for list-shaped components. Returns the handler. */
export function roveKeys(onMove: (delta: number, e: KeyboardEvent) => void) {
  return (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); onMove(1, e); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); onMove(-1, e); }
  };
}

/** Fires once per pointerdown→pointerup pair without dragging (small slop). */
export function wasClick(down: { x: number; y: number } | null, up: { x: number; y: number }) {
  if (!down) return false;
  return Math.abs(down.x - up.x) < 4 && Math.abs(down.y - up.y) < 4;
}

/* ── dates (UTC-day math so stories and tests stay deterministic) ─────────── */

export const DAY = 86_400_000;

/** Midnight-local of the given time. */
export function dayFloor(t: number): number {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Midnight-local `days` days after `t`. */
export function addDays(t: number, days: number): number {
  const d = new Date(t);
  d.setDate(d.getDate() + days);
  return d.getTime();
}

/** Day-of-week offset from `weekStartsOn` (0 Sun, 1 Mon). */
export function dowShift(dow: number, weekStartsOn: 0 | 1): number {
  return (dow - weekStartsOn + 7) % 7;
}

/** n months later, clamping overflow days (Jan 31 + 1mo → Feb 28). */
export function addMonthsSafe(t: number, n: number): number {
  const d = new Date(t);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, last));
  return d.getTime();
}

/** "October 2026" style label for a month. */
export function monthLabel(d: Date): string {
  return d.toLocaleDateString([], { month: 'long', year: 'numeric' });
}

/* ── misc ─────────────────────────────────────────────────────────────────── */

export function useForceUpdate() {
  const [, set] = useState(0);
  return useCallback(() => set((n) => n + 1), []);
}

/** Observe an element's content-box size (jsdom-safe: falls back to a no-op). */
export function useElementSize(
  ref: RefObject<HTMLElement | null>,
  onSize: (w: number, h: number) => void,
): void {
  const cb = useRef(onSize);
  cb.current = onSize;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    cb.current(el.clientWidth, el.clientHeight);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const box = entry.contentRect;
        cb.current(Math.round(box.width), Math.round(box.height));
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
}
