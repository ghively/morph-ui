import type { ReactNode, CSSProperties } from 'react';
import { forwardRef, useState, useEffect, useRef, useInsertionEffect } from 'react';
import './AppFrame.css';

export type FrameWidth = 'phone' | 'tablet' | 'desk';
export type DrawerState = false | true | 'wide';

export interface AppFrameProps {
  children: ReactNode;
  bare?: boolean;
  accent?: string;
  left?: DrawerState;
  sidebar?: boolean;
  edge?: boolean;
  folded?: boolean;
  offline?: boolean;
  theme?: 'dark' | 'light';
  themeId?: string;
  density?: 'comfortable' | 'compact';
  reduceMotion?: boolean;
  pinned?: boolean;
  turns?: string;
  glass?: string;
  radius?: string;
  dock?: string;
  tokenOverrides?: Record<string, string>;
  style?: CSSProperties;
  className?: string;
}

export interface Columns { sidebar: boolean; drawer: boolean; }
export interface ColumnPrefs { sidebarOpen: boolean; drawerOpen: boolean; }

export const FOLD_BP = 720;
export const TAB_BP = 1100;
export const FOLD_QUERY = `(max-width:${FOLD_BP}px)`;
export const TAB_QUERY = `(max-width:${TAB_BP}px)`;

export function widthClass(px: number): FrameWidth {
  if (px <= FOLD_BP) return 'phone';
  if (px <= TAB_BP) return 'tablet';
  return 'desk';
}

export function overlays(width: FrameWidth): { sidebar: boolean; drawer: boolean; edge: boolean } {
  return {
    sidebar: width === 'phone',
    drawer: width !== 'desk',
    edge: width !== 'desk'
  };
}

export function initialColumns(prefs: ColumnPrefs, width: FrameWidth): Columns {
  if (width === 'phone') return { sidebar: false, drawer: false };
  if (width === 'tablet') return { sidebar: prefs.sidebarOpen, drawer: false };
  return { sidebar: prefs.sidebarOpen, drawer: prefs.drawerOpen };
}

export function onWidthChange(current: Columns, prefs: ColumnPrefs, from: FrameWidth, to: FrameWidth): Columns {
  if (from === to) return current;
  if (to === 'phone') return { sidebar: false, drawer: false };
  if (to === 'tablet') return { sidebar: current.sidebar || (from === 'phone' ? prefs.sidebarOpen : false), drawer: false };
  return { sidebar: current.sidebar || prefs.sidebarOpen, drawer: current.drawer || prefs.drawerOpen };
}

export function remember(width: FrameWidth, column: keyof Columns): boolean {
  if (width === 'desk') return true;
  if (width === 'tablet') return column === 'sidebar';
  return false;
}

export function escapeTarget(s: Columns & { edge: boolean; width: FrameWidth }): 'edge' | 'drawer' | 'sidebar' | null {
  const o = overlays(s.width);
  if (s.edge && o.edge) return 'edge';
  if (s.drawer) return 'drawer';
  if (s.sidebar) return 'sidebar';
  return null;
}

export function drawerTrack(open: boolean, hasContent: boolean): DrawerState {
  if (!open) return false;
  return hasContent ? 'wide' : true;
}

export function currentWidth(): FrameWidth {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return 'desk';
  if (window.matchMedia(FOLD_QUERY).matches) return 'phone';
  if (window.matchMedia(TAB_QUERY).matches) return 'tablet';
  return 'desk';
}

export interface UseColumnLayoutOptions {
  prefs: ColumnPrefs;
  onPrefChange?: (key: keyof ColumnPrefs, value: boolean) => void;
}

export interface ColumnLayout {
  width: FrameWidth;
  columns: Columns;
  setColumn: (column: keyof Columns, force?: boolean) => void;
  overlays: { sidebar: boolean; drawer: boolean; edge: boolean };
}

export function useColumnLayout(opts: UseColumnLayoutOptions): ColumnLayout {
  const [width, setWidth] = useState<FrameWidth>(currentWidth);
  const [columns, setColumns] = useState<Columns>(() => initialColumns(opts.prefs, currentWidth()));

  const colPrefsRef = useRef(opts.prefs);
  colPrefsRef.current = opts.prefs;
  const onPrefChangeRef = useRef(opts.onPrefChange);
  onPrefChangeRef.current = opts.onPrefChange;
  const widthRef = useRef(width);
  widthRef.current = width;
  const columnsRef = useRef(columns);
  columnsRef.current = columns;

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const qFold = window.matchMedia(FOLD_QUERY);
    const qTab = window.matchMedia(TAB_QUERY);
    const on = () => {
      const next = currentWidth();
      const from = widthRef.current;
      if (from === next) return;
      widthRef.current = next;
      setWidth(next);
      setColumns((c) => onWidthChange(c, colPrefsRef.current, from, next));
    };
    qFold.addEventListener("change", on);
    qTab.addEventListener("change", on);
    return () => {
      qFold.removeEventListener("change", on);
      qTab.removeEventListener("change", on);
    };
  }, []);

  const setColumn = (column: keyof Columns, force?: boolean) => {
    const c = columnsRef.current;
    const open = typeof force === "boolean" ? force : !c[column];
    if (open === c[column]) return;
    if (remember(widthRef.current, column)) {
      onPrefChangeRef.current?.(column === 'sidebar' ? 'sidebarOpen' : 'drawerOpen', open);
    }
    setColumns({ ...c, [column]: open });
  };

  return {
    width,
    columns,
    setColumn,
    overlays: overlays(width),
  };
}

export function useStalled(trying: boolean, settled: boolean, timeoutMs: number = 10000): boolean {
  const [stalled, setStalled] = useState(false);
  useEffect(() => {
    if (settled || !trying) {
      setStalled(false);
      return;
    }
    const t = window.setTimeout(() => setStalled(true), timeoutMs);
    return () => window.clearTimeout(t);
  }, [trying, settled, timeoutMs]);
  return stalled;
}

export type TokenSet = Readonly<Record<string, string>>;

export function isSafeTokenName(name: string): boolean {
  return /^--[a-z0-9][a-z0-9-]*$/i.test(name);
}

export function isSafeTokenValue(value: string): boolean {
  if (!value || value.length > 32768) return false;
  if (/[{}<>;@\\]/.test(value)) return false;
  if (/\/\*/.test(value) || /\*\//.test(value)) return false;
  
  // url() restriction
  const urlMatches = value.match(/url\((['"]?)(.*?)\1\)/g);
  if (urlMatches) {
    for (const match of urlMatches) {
      const url = match.match(/url\((['"]?)(.*?)\1\)/)![2]!;
      if (!url.startsWith('data:image/') && !url.startsWith('/')) {
        return false;
      }
      if (url.startsWith('//')) {
         return false; // prevent protocol-relative
      }
    }
  }
  return true;
}

export function safeTokens(tokens: TokenSet | undefined): [string, string][] {
  if (!tokens) return [];
  return Object.entries(tokens).filter(([k, v]) => isSafeTokenName(k) && isSafeTokenValue(v));
}

function block(selector: string, pairs: [string, string][]): string {
  if (!pairs.length) return '';
  const lines = pairs.map(([k, v]) => `${k}:${v};`);
  return `${selector}{${lines.join('')}}`;
}

export function themeCss(id: string, tokens: TokenSet, dark?: TokenSet, light?: TokenSet): string {
  if (!/^[a-z0-9-]+$/i.test(id)) return '';
  const base = safeTokens(tokens);
  const d = safeTokens(dark);
  const l = safeTokens(light);
  
  const b1 = block(`[data-frame][data-theme-id="${id}"]`, base);
  const b2 = block(`+[data-theme="dark"]`, d);
  const b3 = block(`+[data-theme="light"]`, l);
  return `${b1}${b2}${b3}`;
}

export interface ThemeTokensProps {
  id: string;
  tokens: TokenSet;
  dark?: TokenSet;
  light?: TokenSet;
  fontStack?: string;
  elementId?: string;
}

export function ThemeTokens({ id, tokens, dark, light, fontStack, elementId = 'morph-ui-theme-tokens' }: ThemeTokensProps) {
  useInsertionEffect(() => {
    let el = document.getElementById(elementId) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement('style');
      el.id = elementId;
      el.setAttribute('data-theme-tokens', '');
      document.head.appendChild(el);
    }
    let css = themeCss(id, tokens, dark, light);
    if (fontStack && !/[{}<>;@\\]|\/\*/.test(fontStack)) {
      css += `\n[data-frame][data-theme-id="${id}"]{--font-sans:${fontStack};}`;
    }
    if (el.textContent !== css) {
      el.textContent = css;
    }
  }, [id, tokens, dark, light, fontStack, elementId]);

  return null;
}

export const AppFrame = forwardRef<HTMLDivElement, AppFrameProps>(function AppFrame({
  children,
  bare,
  accent = "blue",
  left,
  sidebar,
  edge,
  folded,
  offline,
  theme = "dark",
  themeId,
  density,
  reduceMotion,
  pinned,
  turns = "peruser",
  glass = "full",
  radius = "default",
  dock = "rail",
  tokenOverrides,
  style,
  className = ""
}, ref) {
  const mergedStyle = {
    ...tokenOverrides,
    fontFamily: "var(--font-sans,Arial,Helvetica,sans-serif)",
    fontSize: "var(--t-lead)",
    lineHeight: 1.5,
    ...style
  };

  return (
    <div
      ref={ref}
      data-frame=""
      data-theme={theme}
      data-theme-id={themeId}
      data-turns={turns}
      data-glass={glass}
      data-density={density}
      data-radius={radius}
      data-sec={accent}
      data-right={String(!!edge)}
      data-left={left === "wide" ? "wide" : String(!!left)}
      data-sidebar={String(!!sidebar)}
      data-folded={String(!!folded)}
      data-pinned={String(!!pinned)}
      data-dock={dock}
      data-fuse="off"
      data-offline={String(!!offline)}
      data-motion={reduceMotion ? "reduce" : "full"}
      style={mergedStyle}
      className={className}
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
