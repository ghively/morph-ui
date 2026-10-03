/** Shared hooks + helpers for the LAYOUT_NAV components (polish batch, 2026-10). Not exported from the package index. */
import { useState, useRef, useEffect, useMemo, useCallback, useInsertionEffect } from 'react';
import type { ReactNode, CSSProperties, PointerEvent as ReactPointerEvent } from 'react';

/* ── shared bits ─────────────────────────────────────────────────────────── */
export const cv = (c: string) => ({ ['--c' as string]: c }) as CSSProperties;
export const uid = () => 'm' + Math.random().toString(36).slice(2, 8);

/* ── AppFrame ────────────────────────────────────────────────────────────── */
export type FrameWidth = 'phone' | 'tablet' | 'desk';
export type DrawerState = false | true | 'wide';
export interface AppFrameProps { children: ReactNode; bare?: boolean; accent?: string; left?: DrawerState; sidebar?: boolean; edge?: boolean; folded?: boolean; offline?: boolean; theme?: 'dark' | 'light'; themeId?: string; density?: 'comfortable' | 'compact'; reduceMotion?: boolean; pinned?: boolean; turns?: string; glass?: string; radius?: string; dock?: string; tokenOverrides?: Record<string, string>; style?: CSSProperties; className?: string; }
export interface Columns { sidebar: boolean; drawer: boolean; }
export interface ColumnPrefs { sidebarOpen: boolean; drawerOpen: boolean; }
export const FOLD_BP = 720;
export const TAB_BP = 1100;
export const FOLD_QUERY = `(max-width:${FOLD_BP}px)`;
export const TAB_QUERY = `(max-width:${TAB_BP}px)`;
export function widthClass(px: number): FrameWidth { if (px <= FOLD_BP) return 'phone'; if (px <= TAB_BP) return 'tablet'; return 'desk'; }
export function overlays(width: FrameWidth): { sidebar: boolean; drawer: boolean; edge: boolean } { return { sidebar: width === 'phone', drawer: width !== 'desk', edge: width !== 'desk' }; }
export function initialColumns(prefs: ColumnPrefs, width: FrameWidth): Columns { if (width === 'phone') return { sidebar: false, drawer: false }; if (width === 'tablet') return { sidebar: prefs.sidebarOpen, drawer: false }; return { sidebar: prefs.sidebarOpen, drawer: prefs.drawerOpen }; }
export function onWidthChange(current: Columns, prefs: ColumnPrefs, from: FrameWidth, to: FrameWidth): Columns { if (from === to) return current; if (to === 'phone') return { sidebar: false, drawer: false }; if (to === 'tablet') return { sidebar: current.sidebar || (from === 'phone' ? prefs.sidebarOpen : false), drawer: false }; return { sidebar: current.sidebar || prefs.sidebarOpen, drawer: current.drawer || prefs.drawerOpen }; }
export function remember(width: FrameWidth, column: keyof Columns): boolean { if (width === 'desk') return true; if (width === 'tablet') return column === 'sidebar'; return false; }
export function escapeTarget(s: Columns & { edge: boolean; width: FrameWidth }): 'edge' | 'drawer' | 'sidebar' | null { const o = overlays(s.width); if (s.edge && o.edge) return 'edge'; if (s.drawer) return 'drawer'; if (s.sidebar) return 'sidebar'; return null; }
export function drawerTrack(open: boolean, hasContent: boolean): DrawerState { if (!open) return false; return hasContent ? 'wide' : true; }
export function currentWidth(): FrameWidth { if (typeof window === "undefined" || typeof window.matchMedia !== "function") return 'desk'; if (window.matchMedia(FOLD_QUERY).matches) return 'phone'; if (window.matchMedia(TAB_QUERY).matches) return 'tablet'; return 'desk'; }
export interface UseColumnLayoutOptions { prefs: ColumnPrefs; onPrefChange?: (key: keyof ColumnPrefs, value: boolean) => void; }
export interface ColumnLayout { width: FrameWidth; columns: Columns; setColumn: (column: keyof Columns, force?: boolean) => void; overlays: { sidebar: boolean; drawer: boolean; edge: boolean }; }
export function useColumnLayout(opts: UseColumnLayoutOptions): ColumnLayout {
  const [width, setWidth] = useState<FrameWidth>(currentWidth);
  const [columns, setColumns] = useState<Columns>(() => initialColumns(opts.prefs, currentWidth()));
  const colPrefsRef = useRef(opts.prefs); colPrefsRef.current = opts.prefs;
  const onPrefChangeRef = useRef(opts.onPrefChange); onPrefChangeRef.current = opts.onPrefChange;
  const widthRef = useRef(width); widthRef.current = width;
  const columnsRef = useRef(columns); columnsRef.current = columns;
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const qFold = window.matchMedia(FOLD_QUERY), qTab = window.matchMedia(TAB_QUERY);
    const on = () => {
      const next = currentWidth(), from = widthRef.current;
      if (from === next) return;
      widthRef.current = next; setWidth(next);
      setColumns((c) => onWidthChange(c, colPrefsRef.current, from, next));
    };
    qFold.addEventListener("change", on); qTab.addEventListener("change", on);
    return () => { qFold.removeEventListener("change", on); qTab.removeEventListener("change", on); };
  }, []);
  const setColumn = (column: keyof Columns, force?: boolean) => {
    const c = columnsRef.current, open = typeof force === "boolean" ? force : !c[column];
    if (open === c[column]) return;
    if (remember(widthRef.current, column)) onPrefChangeRef.current?.(column === 'sidebar' ? 'sidebarOpen' : 'drawerOpen', open);
    setColumns({ ...c, [column]: open });
  };
  return { width, columns, setColumn, overlays: overlays(width) };
}
export function useStalled(trying: boolean, settled: boolean, timeoutMs: number = 10000): boolean {
  const [stalled, setStalled] = useState(false);
  useEffect(() => {
    if (settled || !trying) { setStalled(false); return; }
    const t = window.setTimeout(() => setStalled(true), timeoutMs);
    return () => window.clearTimeout(t);
  }, [trying, settled, timeoutMs]);
  return stalled;
}
export type TokenSet = Readonly<Record<string, string>>;
export function isSafeTokenName(name: string): boolean { return /^--[a-z0-9][a-z0-9-]*$/i.test(name); }
export function isSafeTokenValue(value: string): boolean {
  if (!value || value.length > 32768) return false;
  if (/[{}<>;@\\]/.test(value)) return false;
  if (/\/\*/.test(value) || /\*\//.test(value)) return false;
  const urlMatches = value.match(/url\((['"]?)(.*?)\1\)/g);
  if (urlMatches) {
    for (const match of urlMatches) {
      const url = match.match(/url\((['"]?)(.*?)\1\)/)![2]!;
      if (!url.startsWith('data:image/') && !url.startsWith('/')) return false;
      if (url.startsWith('//')) return false;
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
  return `${selector}{${pairs.map(([k, v]) => `${k}:${v};`).join('')}}`;
}
export function themeCss(id: string, tokens: TokenSet, dark?: TokenSet, light?: TokenSet): string {
  if (!/^[a-z0-9-]+$/i.test(id)) return '';
  return `${block(`[data-frame][data-theme-id="${id}"]`, safeTokens(tokens))}${block(`+[data-theme="dark"]`, safeTokens(dark))}${block(`+[data-theme="light"]`, safeTokens(light))}`;
}
export interface ThemeTokensProps { id: string; tokens: TokenSet; dark?: TokenSet; light?: TokenSet; fontStack?: string; elementId?: string; }
export function ThemeTokens({ id, tokens, dark, light, fontStack, elementId = 'morph-ui-theme-tokens' }: ThemeTokensProps) {
  useInsertionEffect(() => {
    let el = document.getElementById(elementId) as HTMLStyleElement | null;
    if (!el) { el = document.createElement('style'); el.id = elementId; el.setAttribute('data-theme-tokens', ''); document.head.appendChild(el); }
    let css = themeCss(id, tokens, dark, light);
    if (fontStack && !/[{}<>;@\\]|\/\*/.test(fontStack)) css += `\n[data-frame][data-theme-id="${id}"]{--font-sans:${fontStack};}`;
    if (el.textContent !== css) el.textContent = css;
  }, [id, tokens, dark, light, fontStack, elementId]);
  return null;
}

/* ── Breadcrumbs ─────────────────────────────────────────────────────────── */
export interface Crumb { label: string; href?: string; onClick?: () => void; }
export interface BreadcrumbsProps { trail: Crumb[]; maxVisible?: number; label?: string; className?: string; }
export function useBreadcrumbs(trail: Crumb[], maxVisible = 4) {
  const collapsed = trail.length > maxVisible;
  const shown = collapsed ? [trail[0]!, '__gap' as const, ...trail.slice(-(maxVisible - 1))] : trail;
  return { collapsed, shown };
}

/* ── Card ────────────────────────────────────────────────────────────────── */
export interface CardProps { children: ReactNode; title?: ReactNode; subtitle?: ReactNode; actions?: ReactNode; className?: string; }

/* ── DetailsPanel ────────────────────────────────────────────────────────── */
export interface ProfileBadge { id: string; label: string; solid?: boolean; }
export interface ProfileCardProps { title: ReactNode; identifier?: ReactNode; description?: ReactNode; avatar?: ReactNode; status?: { text: ReactNode; tone?: 'ok' | 'warn' | 'danger' }; badges?: ProfileBadge[]; toggles?: { id: string; label: string; on: boolean; onChange: (next: boolean) => void }[]; chips?: string[]; note?: ReactNode; eyebrow?: ReactNode; className?: string; }
export interface DetailsPanelProps { kind: string; context?: string; onBack?: () => void; backLabel?: string; onClose: () => void; closeLabel?: string; icon?: ReactNode; label: string; children: ReactNode; className?: string; }

/* ── Divider ─────────────────────────────────────────────────────────────── */
export interface DividerProps { label?: ReactNode; orientation?: 'horizontal' | 'vertical'; className?: string; }

/* ── Drawer ──────────────────────────────────────────────────────────────── */
export type DrawerSize = 'sm' | 'md' | 'lg';
export interface DrawerProps { open: boolean; onClose: () => void; label: string; title?: ReactNode; actions?: ReactNode; children: ReactNode; size?: DrawerSize; dismissOnScrimClick?: boolean; dismissOnEscape?: boolean; className?: string; }
export function useDrawer(open: boolean, dismissOnEscape: boolean, onClose: () => void) {
  const panelRef = useRef<HTMLDivElement>(null);
  const prevFocus = useRef<Element | null>(null);
  useEffect(() => {
    if (!open) return;
    prevFocus.current = document.activeElement;
    const panel = panelRef.current;
    const first = panel?.querySelector<HTMLElement>("a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex='-1'])");
    (first ?? panel)?.focus();
    return () => { if (prevFocus.current && 'focus' in prevFocus.current) (prevFocus.current as HTMLElement).focus?.(); };
  }, [open]);
  useEffect(() => {
    if (!open || !dismissOnEscape) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); }
      else if (e.key === 'Tab' && panelRef.current) {
        const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex='-1'])")).filter(x => x.offsetParent !== null);
        if (!items.length) return;
        const first = items[0]!, last = items[items.length - 1]!;
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open, dismissOnEscape, onClose]);
  return { panelRef };
}

/* ── EmptyState ──────────────────────────────────────────────────────────── */
export interface EmptyStateProps { title: string; children?: ReactNode; action?: ReactNode; framed?: boolean; icon?: ReactNode; live?: boolean; className?: string; style?: CSSProperties; }

/* ── FloatingDock ────────────────────────────────────────────────────────── */
export interface DockItem { id: string; label: string; icon: ReactNode; onClick?: () => void; }
export interface FloatingDockProps { items: DockItem[]; className?: string; horizontal?: boolean; baseItemSize?: number; maxItemSize?: number; magnificationRange?: number; }
export function useFloatingDock(horizontal = true, baseItemSize = 48, maxItemSize = 80, magnificationRange = 200) {
  const dockRef = useRef<HTMLDivElement>(null);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);
  const [bouncingItemId, setBouncingItemId] = useState<string | null>(null);
  const handlePointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => setPointerPos({ x: e.clientX, y: e.clientY }), []);
  const handlePointerLeave = () => setPointerPos(null);
  const handleItemClick = (item: DockItem) => {
    setBouncingItemId(item.id);
    if (item.onClick) item.onClick();
    setTimeout(() => setBouncingItemId(null), 1000);
  };
  const calculateScale = (el: HTMLButtonElement | null) => {
    if (!pointerPos || !el) return 1;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return 1;
    const itemCenterX = rect.left + rect.width / 2, itemCenterY = rect.top + rect.height / 2;
    const distance = horizontal ? Math.abs(pointerPos.x - itemCenterX) : Math.abs(pointerPos.y - itemCenterY);
    if (distance > magnificationRange) return 1;
    return Math.max(1, 1 + ((maxItemSize / baseItemSize) - 1) * Math.cos((distance / magnificationRange) * (Math.PI / 2)));
  };
  return { dockRef, pointerPos, bouncingItemId, handlePointerMove, handlePointerLeave, handleItemClick, calculateScale };
}

/* ── ModalSurface ────────────────────────────────────────────────────────── */
export type ModalPlacement = 'bottom-sheet' | 'center' | 'top-drawer';
export interface ModalSurfaceTab { id: string; label: string; }
export interface ModalSurfaceProps { label: string; onClose: () => void; children: ReactNode; placement?: ModalPlacement; width?: number; height?: number | string; title?: string; tabs?: ModalSurfaceTab[]; activeTab?: string; onTabChange?: (id: string) => void; dismissOnScrimClick?: boolean; dismissOnEscape?: boolean; className?: string; }
export function useModalSurface(dismissOnEscape: boolean, onClose: () => void) {
  const panelRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<Element | null>(null);
  useEffect(() => {
    prevFocusRef.current = document.activeElement;
    if (panelRef.current) {
      const first = panelRef.current.querySelector<HTMLElement>("a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex='-1'])");
      if (first) first.focus(); else panelRef.current.focus();
    }
    return () => { if (prevFocusRef.current && 'focus' in prevFocusRef.current) (prevFocusRef.current as HTMLElement).focus?.(); };
  }, []);
  useEffect(() => {
    if (!dismissOnEscape) return;
    const onKey = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); onClose(); } };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [dismissOnEscape, onClose]);
  useEffect(() => {
    const onTabKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex='-1'])")).filter(x => x.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0]!, last = focusable[focusable.length - 1]!;
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
      else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
    };
    document.addEventListener('keydown', onTabKey);
    return () => document.removeEventListener('keydown', onTabKey);
  }, []);
  return { panelRef };
}

/* ── NavigationRail ──────────────────────────────────────────────────────── */
export interface RailNavItem { id: string; label: string; icon: ReactNode; }
export interface RailFooterItem { id: string; label: string; icon: ReactNode; title?: string; shedWhenFolded?: boolean; onSelect: () => void; }
export interface NavigationRailProps { items: RailNavItem[]; activeId?: string | null; onSelect: (id: string) => void; primaryAction?: { label: string; icon?: ReactNode; onSelect: () => void }; footerItems?: RailFooterItem[]; account?: { name: string; secondary?: string; avatar: ReactNode; onSelect: () => void; label?: string; }; brand?: { name: string; ornament?: ReactNode; badge?: ReactNode }; pinned?: boolean; onPinnedChange?: (next: boolean) => void; label?: string; className?: string; }
export interface BrandWordmarkProps { name: string; className?: string; }
export function useBrandWordmark(name: string) {
  const [first, ...rest] = name.split(/(?=[A-Z][a-z])/);
  return { first, rest: rest.length > 0 ? rest.join("") : null };
}

/* ── Pagination ──────────────────────────────────────────────────────────── */
export interface PaginationProps { page: number; totalPages: number; onPageChange: (page: number) => void; siblingCount?: number; label?: string; className?: string; }
export function pageWindow(page: number, totalPages: number, siblingCount: number): (number | 'gap')[] {
  const pages = new Set<number>([1, totalPages]);
  for (let p = page - siblingCount; p <= page + siblingCount; p++) if (p >= 1 && p <= totalPages) pages.add(p);
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | 'gap')[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) out.push('gap');
    out.push(p);
    prev = p;
  }
  return out;
}

/* ── PaneHeader ──────────────────────────────────────────────────────────── */
export interface PaneHeaderProps { title: ReactNode; subtitle?: ReactNode; subtitlePrefix?: ReactNode; onBack?: () => void; backLabel?: string; ornament?: ReactNode; status?: { label: string; detail?: string; tone?: 'ok' | 'warn' | 'danger'; phase?: 'connecting' | 'live'; indicator?: ReactNode; }; actions?: { id: string; icon: ReactNode; label: string; shortLabel?: string; title?: string; ariaLabel?: string; active?: boolean; controls?: string; onSelect: () => void; }[]; className?: string; }

/* ── SettingsPanel ───────────────────────────────────────────────────────── */
export interface SettingsSection { id: string; label: string; }
export interface SettingsPanelProps { sections: SettingsSection[]; activeSection: string; onSectionChange: (id: string) => void; railTitle?: string; title?: string; onClose?: () => void; closeLabel?: string; tablistLabel?: string; children: ReactNode; className?: string; }
export interface SettingRowProps { heading: ReactNode; description?: ReactNode; children: ReactNode; className?: string; }
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24, m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
export function timeToMinutes(value: string, fallback: number): number {
  if (!value) return fallback;
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return fallback;
  const h = parseInt(match[1]!, 10), m = parseInt(match[2]!, 10);
  if (isNaN(h) || isNaN(m)) return fallback;
  return h * 60 + m;
}
export interface TimeRangeFieldProps { start: number; end: number; onStartChange: (minutes: number) => void; onEndChange: (minutes: number) => void; startLabel?: string; endLabel?: string; className?: string; }
export function usePersistedState<T>(key: string, initial: T): [T, (v: T) => void] {
  const [state, setState] = useState<T>(() => {
    try { const item = window.localStorage.getItem(key); return item === null ? initial : JSON.parse(item) as T; } catch { return initial; }
  });
  const setValue = useCallback((value: T) => {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
    setState(value);
  }, [key]);
  return [state, setValue];
}

/* ── SidePanel ───────────────────────────────────────────────────────────── */
export interface SidePanelProps { open: boolean; slot: 'drawer' | 'left'; accent?: string; title: string; subtitle?: string; icon?: ReactNode; onBack?: () => void; backLabel?: string; headerAction?: { icon: ReactNode; label: string; title?: string; onSelect: () => void }; onClose: () => void; closeLabel?: string; closeTitle?: string; bodyId?: string; bodyOverflow?: 'auto' | 'hidden'; headerPadding?: string; iconMargin?: string; bodyPadding?: string; children: ReactNode; className?: string; }

/* ── SkeletonWrapper ─────────────────────────────────────────────────────── */
export interface SkeletonWrapperProps { children: ReactNode; isLoading?: boolean; className?: string; style?: CSSProperties; }

/* ── Tabs ────────────────────────────────────────────────────────────────── */
export interface TabItem { id: string; label: ReactNode; badge?: ReactNode; disabled?: boolean; }
export interface TabsProps { tabs: TabItem[]; activeId: string; onTabChange: (id: string) => void; children?: ReactNode; label?: string; className?: string; }
export function useTabs(tabs: TabItem[], onTabChange: (id: string) => void) {
  const listRef = useRef<HTMLDivElement>(null);
  const enabledIds = useMemo(() => tabs.filter((t) => !t.disabled).map((t) => t.id), [tabs]);
  const move = (fromId: string, delta: 1 | -1) => {
    const idx = enabledIds.indexOf(fromId);
    if (idx === -1) return;
    const next = enabledIds[(idx + delta + enabledIds.length) % enabledIds.length]!;
    onTabChange(next);
    listRef.current?.querySelector<HTMLElement>(`[data-tabid="${CSS.escape(next)}"]`)?.focus();
  };
  const onKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); move(id, 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); move(id, -1); }
    else if (e.key === 'Home') { e.preventDefault(); if (enabledIds[0]) onTabChange(enabledIds[0]); }
    else if (e.key === 'End') { e.preventDefault(); const last = enabledIds[enabledIds.length - 1]; if (last) onTabChange(last); }
  };
  return { listRef, onKeyDown };
}

/* ── Tooltip ─────────────────────────────────────────────────────────────── */
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
export interface TooltipProps { content: ReactNode; children: ReactNode; placement?: TooltipPlacement; className?: string; }
