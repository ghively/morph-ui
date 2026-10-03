import { forwardRef } from 'react';
import './AppFrame.css';
import type { AppFrameProps } from './layout.shared';

export const AppFrame = forwardRef<HTMLDivElement, AppFrameProps>(function AppFrame({
  children, bare, accent = "blue", left, sidebar, edge, folded, offline, theme = "dark", themeId, density, reduceMotion, pinned, turns = "peruser", glass = "full", radius = "default", dock = "rail", tokenOverrides, style, className = ""
}, ref) {
  const mergedStyle = { ...tokenOverrides, fontFamily: "var(--font-sans,Arial,Helvetica,sans-serif)", fontSize: "var(--t-lead)", lineHeight: 1.5, ...style };
  return (
    <div ref={ref} data-frame="" data-theme={theme} data-theme-id={themeId} data-turns={turns} data-glass={glass} data-density={density} data-radius={radius} data-sec={accent} data-right={String(!!edge)} data-left={left === "wide" ? "wide" : String(!!left)} data-sidebar={String(!!sidebar)} data-folded={String(!!folded)} data-pinned={String(!!pinned)} data-dock={dock} data-fuse="off" data-offline={String(!!offline)} data-motion={reduceMotion ? "reduce" : "full"} style={mergedStyle} className={className}>
      {bare ? (
        <div data-inner="" style={{ gridColumn: "1 / -1", margin: "0 var(--gap)" }}>
          <div data-pane="" role="main" data-sec={accent} style={{ display: "flex", flexDirection: "column" }}>{children}</div>
        </div>
      ) : children}
    </div>
  );
});
export type { FrameWidth, DrawerState, AppFrameProps, Columns, ColumnPrefs, UseColumnLayoutOptions, ColumnLayout, TokenSet, ThemeTokensProps } from './layout.shared';
export { FOLD_BP, TAB_BP, FOLD_QUERY, TAB_QUERY, widthClass, overlays, initialColumns, onWidthChange, remember, escapeTarget, drawerTrack, currentWidth, useColumnLayout, useStalled, isSafeTokenName, isSafeTokenValue, safeTokens, themeCss, ThemeTokens } from './layout.shared';
