import { forwardRef, type ReactNode } from "react";
import { brandStyle } from "../brand";
import { usePrefs } from "../prefs";
import { useTheme } from "../../theme/context";

export interface FrameProps {
  bare?: boolean;
  sec?: string;
  /**
   * The thread drawer's track: closed, its list width, or wide enough to hold
   * a conversation. Three values, one track, so the widening is the frame's
   * own transition (app/shell/columns.ts, `drawerState`).
   */
  left?: boolean | "wide";
  /** The rooms sidebar's track. */
  rooms?: boolean;
  right?: boolean;
  folded?: boolean;
  offline?: boolean;
  children: ReactNode;
}

/**
 * Who wears the accent. Per-participant colour is the answer (Gene,
 * 2026-09-19) and therefore the default: a frame with no `?bubble=` is
 * `peruser`, and `matrix/timeline.ts` gives every sender their own slot.
 *
 * The switch stays for comparison, not for configuration — it is a query
 * param, never a preference, so it is read once at module load, never stored,
 * and never re-rendered. `legacy` is the escape hatch back to the original
 * one-accent design and is deliberately claimed by no rule in app.css: the
 * base `[data-turn="user"] > [data-bubble]` is the original, so naming a
 * value nothing overrides *is* the way to see it. `calm`, `flip` and
 * `neutral` are the three candidates this decision retired, kept reachable
 * so the pick can be re-examined without resurrecting them from git.
 */
const TURN_VARIANTS = ["legacy", "calm", "flip", "neutral", "peruser"] as const;
const DEFAULT_TURNS = "peruser";
export const turnVariant: string = (() => {
  if (typeof window === "undefined") return DEFAULT_TURNS;
  const v = new URLSearchParams(window.location.search).get("bubble");
  return TURN_VARIANTS.find((t) => t === v) ?? DEFAULT_TURNS;
})();

/** [data-frame] — the one layout primitive (docs/01-frame-and-layout.md). */
export const Frame = forwardRef<HTMLDivElement, FrameProps>(function Frame({ bare, sec = "blue", left, rooms, right, folded, offline, children }, ref) {
  const { prefs } = usePrefs();
  const { theme, brand } = useTheme();
  const accent = brand.accent ?? sec;
  return (
    <div
      ref={ref}
      data-frame=""
      data-theme={prefs.theme}
      data-theme-id={theme.id}
      data-turns={turnVariant}
      data-glass="full"
      data-density={prefs.density}
      data-radius="default"
      data-sec={accent}
      data-right={String(!!right)}
      data-left={left === "wide" ? "wide" : String(!!left)}
      data-rooms={String(!!rooms)}
      data-folded={String(!!folded)}
      data-pinned={String(prefs.pinned)}
      data-dock="rail"
      data-fuse="off"
      data-offline={String(!!offline)}
      data-motion={prefs.reduceMotion ? "reduce" : "full"}
      style={{ ...brandStyle(brand), fontFamily: "var(--font-sans,Arial,Helvetica,sans-serif)", fontSize: "var(--t-lead)", lineHeight: 1.5 }}
    >
      {bare ? (
        <div data-inner="" style={{ gridColumn: "1 / -1", margin: "0 var(--gap)" }}>
          <div data-pane="" role="main" data-sec={accent} style={{ display: "flex", flexDirection: "column" }}>
            {children}
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
});
