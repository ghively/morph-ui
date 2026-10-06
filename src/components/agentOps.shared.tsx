/** Shared hooks + helpers for the AGENT_OPS components (polish batch, 2026-10). Not exported from the package index. */
import { useState, useRef, useEffect, useMemo, Fragment, type KeyboardEvent, type ReactNode, type CSSProperties } from 'react';

/* ── shared bits ─────────────────────────────────────────────────────────── */
export const activate = (fn?: () => void) => (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn?.(); } };
export const cv = (c: string) => ({ ['--c' as string]: c }) as CSSProperties;
export const fmtK = (n: number) => n >= 1e6 ? (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M' : n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n);
export const fmtMs = (ms?: number) => {
  if (ms == null || isNaN(ms)) return '';
  if (ms < 1000) return Math.round(ms) + 'ms';
  if (ms < 60000) { const s = (ms / 1000).toFixed(1); return (s.endsWith('.0') ? s.slice(0, -2) : s) + 's'; }
  return Math.floor(ms / 60000) + 'm ' + Math.round((ms % 60000) / 1000) + 's';
};
/** Up to two initials. Parenthetical/bracketed asides ("Priya (Support lead)") are dropped and
 *  tokens are split on any non-letter/number, so punctuation never becomes an initial. */
export const initials = (name: string) => {
  const words = (s: string) => s.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const core = words(name.replace(/\([^)]*\)|\[[^\]]*\]|\{[^}]*\}/g, ' '));
  return (core.length ? core : words(name)).slice(0, 2).map(w => w[0]).join('').toUpperCase();
};
/** Stable 1–6 slot for a person, so the same name always gets the same `--series-N` colour. */
export const identityHue = (key: string) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 0x01000193);
  return ((h >>> 0) % 6) + 1;
};
/** `url()` value safe for any URL, including ones containing quotes or parentheses. */
export const cssUrl = (src: string) => 'url(' + JSON.stringify(src) + ')';
export const blocks = (v: number, of: number, n = 10) => { const k = of <= 0 ? 0 : Math.round(Math.min(1, Math.max(0, v / of)) * n); return '█'.repeat(k) + '░'.repeat(n - k); };
const reduced = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const uid = () => 'm' + Math.random().toString(36).slice(2, 8);

/** SVG progress ring; arc colour = currentColor. */
export function Ring({ value, size = 44, stroke = 4, className = '', children }: { value: number; size?: number; stroke?: number; className?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2, C = 2 * Math.PI * r, h = size / 2;
  return (
    <span className={className} style={{ position: 'relative', display: 'inline-grid', placeItems: 'center', width: size, height: size, flex: 'none' }}>
      <svg width={size} height={size} viewBox={'0 0 ' + size + ' ' + size} style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)', overflow: 'visible' }} aria-hidden="true">
        <circle cx={h} cy={h} r={r} fill="none" stroke="color-mix(in srgb, currentColor 16%, transparent)" strokeWidth={stroke} />
        <circle cx={h} cy={h} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - Math.min(1, Math.max(0, value)))} style={{ transition: 'stroke-dashoffset var(--d3) var(--ease-emph)', filter: 'drop-shadow(0 0 3px currentColor)' }} />
      </svg>
      <span style={{ position: 'relative', color: 'var(--app-text)' }}>{children}</span>
    </span>
  );
}

/* ── state colour maps (all --state-* tokens) ────────────────────────────── */
export const TOOL_C = { pending: 'var(--state-idle)', running: 'var(--state-tool)', succeeded: 'var(--state-ok)', failed: 'var(--state-error)' };
export const RUN_C = { pending: 'var(--state-idle)', running: 'var(--state-live)', succeeded: 'var(--state-ok)', failed: 'var(--state-error)' };
export const RISK_C = { low: 'var(--state-ok)', medium: 'var(--state-warn)', high: 'var(--state-error)' };
export const AGENT_C = { offline: 'var(--state-idle)', idle: 'var(--state-ready)', busy: 'var(--state-wait)', working: 'var(--state-live)' };
export const PLAN_C = { done: 'var(--state-ok)', active: 'var(--state-live)', todo: 'var(--state-idle)', blocked: 'var(--state-error)' };
export const AUDIT_C = { info: 'var(--state-idle)', action: 'var(--state-ok)', warning: 'var(--state-warn)', denied: 'var(--state-error)' };
export const URG_C = { routine: 'var(--state-idle)', soon: 'var(--state-wait)', now: 'var(--state-error)' };
export const TONE_C = { good: 'var(--state-ok)', ok: 'var(--state-warn)', bad: 'var(--state-error)' };
export const LEVEL_C = { ok: 'var(--state-live)', warn: 'var(--state-warn)', danger: 'var(--state-error)' };

/* ── 1 · CommandPalette ──────────────────────────────────────────────────── */
export interface PaletteCommand { id: string; label: string; shortcut?: string; group?: string; icon?: ReactNode; run: () => void; hint?: string; keywords?: string }
export interface PaletteProps {
  commands: PaletteCommand[]; open: boolean; controlled?: boolean; placeholder?: string;
  onSelect?: (id: string) => void; onRecentChange?: (ids: string[]) => void;
  query?: string; onQueryChange?: (q: string) => void; initialQuery?: string; groupOrder?: string[];
  status?: ReactNode; emptyTitle?: string; emptyHint?: ReactNode; onRequestClose?: () => void;
  recentIds?: string[]; maxRecents?: number; className?: string;
}
export function usePalette(p: PaletteProps) {
  const { commands, open, controlled = true, initialQuery = '', groupOrder = [], onRequestClose, recentIds: seed, maxRecents = 5, query: qProp, onQueryChange, onSelect, onRecentChange } = p;
  const [openState, setOpenState] = useState(!!open);
  const isOpen = controlled ? open : openState;
  const [qState, setQState] = useState(initialQuery);
  const query = qProp !== undefined ? qProp : qState;
  const [sel, setSel] = useState(0);
  const [recState, setRecState] = useState<string[]>(seed || []);
  const recents = seed !== undefined ? seed : recState;
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useRef(uid()).current;
  const close = () => { onRequestClose?.(); if (!controlled) setOpenState(false); };
  // Reset only when the palette opens, using the props as they are at that moment.
  const atOpen = useRef({ initialQuery, qProp });
  atOpen.current = { initialQuery, qProp };
  useEffect(() => {
    if (!isOpen) return;
    if (atOpen.current.qProp === undefined) setQState(atOpen.current.initialQuery);
    setSel(0);
    const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 0);
    return () => clearTimeout(t);
  }, [isOpen]);
  const { groups, flat } = useMemo(() => {
    const q = query.trim().toLowerCase();
    const hits = q ? commands.filter(c => (c.label + ' ' + (c.hint || '') + ' ' + (c.keywords || '') + ' ' + (c.group || '')).toLowerCase().includes(q)) : commands;
    const out: { name: string; commands: PaletteCommand[] }[] = [];
    const rec = !q ? (recents.map(id => hits.find(c => c.id === id)).filter(Boolean) as PaletteCommand[]) : [];
    if (rec.length) out.push({ name: 'Recently Used', commands: rec });
    const map = new Map<string, PaletteCommand[]>();
    hits.filter(c => !rec.includes(c)).forEach(c => { const g = c.group || 'Suggestions'; if (!map.has(g)) map.set(g, []); map.get(g)!.push(c); });
    const rank = (n: string) => { const i = groupOrder.indexOf(n); return i < 0 ? 1e9 : i; };
    [...map.keys()].map((n, i) => ({ n, i })).sort((a, b) => rank(a.n) - rank(b.n) || a.i - b.i).forEach(({ n }) => out.push({ name: n, commands: map.get(n)! }));
    return { groups: out, flat: out.flatMap(g => g.commands) };
  }, [commands, query, recents, groupOrder]);
  useEffect(() => {
    const list = listRef.current, el = list?.querySelector<HTMLElement>('[data-command-index="' + sel + '"]');
    if (!list || !el) return;
    const lr = list.getBoundingClientRect(), r = el.getBoundingClientRect(), pad = 30;
    if (r.top < lr.top + pad) list.scrollTop -= lr.top + pad - r.top;
    else if (r.bottom > lr.bottom) list.scrollTop += r.bottom - lr.bottom;
  }, [sel, flat]);
  const setQuery = (v: string) => { if (qProp === undefined) setQState(v); onQueryChange?.(v); setSel(0); };
  const execute = (c: PaletteCommand) => {
    c.run();
    const next = [c.id, ...recents.filter(id => id !== c.id)].slice(0, maxRecents);
    if (seed === undefined) setRecState(next);
    onRecentChange?.(next); onSelect?.(c.id); close();
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const n = flat.length;
    if (e.key === 'ArrowDown') { e.preventDefault(); if (n) setSel(s => (s + 1) % n); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (n) setSel(s => (s - 1 + n) % n); }
    else if (e.key === 'Home' && e.metaKey) { e.preventDefault(); setSel(0); }
    else if (e.key === 'Enter') { e.preventDefault(); if (flat[sel]) execute(flat[sel]); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
  };
  const highlight = (text: string): ReactNode => {
    const s = query.trim(); if (!s) return text;
    const i = text.toLowerCase().indexOf(s.toLowerCase()); if (i < 0) return text;
    return <>{text.slice(0, i)}<mark>{text.slice(i, i + s.length)}</mark>{text.slice(i + s.length)}</>;
  };
  const optId = (c: PaletteCommand) => listId + '-' + c.id;
  return { isOpen, query, setQuery, groups, flat, sel, setSel, onKeyDown, execute, close, inputRef, listRef, listId, optId, activeId: flat[sel] ? optId(flat[sel]) : undefined, highlight, indexOf: (c: PaletteCommand) => flat.indexOf(c) };
}

/* ── 2 · ToolCallCard ────────────────────────────────────────────────────── */
export type ToolStatus = 'pending' | 'running' | 'succeeded' | 'failed';
export interface ToolCallProps { toolName: string; args: Record<string, unknown>; status: ToolStatus; duration?: number; result?: unknown; error?: string; defaultExpanded?: boolean; expanded?: boolean; onExpandedChange?: (v: boolean) => void; className?: string }
export const TOOL_LABEL = { pending: 'Queued', running: 'Running', succeeded: 'Done', failed: 'Failed' };
export const TOOL_GLYPH = { pending: '·', running: '', succeeded: '✓', failed: '✕' };
export const argText = (v: unknown, max = 24) => {
  const s = v === null ? 'null' : Array.isArray(v) ? '[' + v.length + ']' : typeof v === 'object' ? '{…}' : typeof v === 'string' ? v : String(v);
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
};
export function useToolCall(p: ToolCallProps) {
  const [inner, setInner] = useState(!!p.defaultExpanded);
  const open = p.expanded ?? inner;
  const toggle = () => { const v = !open; if (p.expanded === undefined) setInner(v); p.onExpandedChange?.(v); };
  const entries = Object.entries(p.args);
  const json = useMemo(() => {
    const d: Record<string, unknown> = { args: p.args };
    if (p.result !== undefined) d.result = p.result;
    if (p.error !== undefined) d.error = p.error;
    return JSON.stringify(d, null, 2);
  }, [p.args, p.result, p.error]);
  const head = { role: 'button', tabIndex: 0, 'aria-expanded': open, onClick: toggle, onKeyDown: activate(toggle) };
  return { open, toggle, entries, chips: entries.slice(0, 3).map(([k, v]) => ({ key: k, value: argText(v) })), more: Math.max(0, entries.length - 3), json, head, dur: fmtMs(p.duration), label: TOOL_LABEL[p.status], color: TOOL_C[p.status] };
}
/** Syntax-tinted JSON: spans carry data-j = k | s | n | b. */
export function JsonView({ text, className = '' }: { text: string; className?: string }) {
  const out: ReactNode[] = []; const re = /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;
  let last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const kind = m[1] ? (m[2] ? 'k' : 's') : m[3] ? 'b' : 'n';
    out.push(<span key={m.index} data-j={kind}>{m[0]}</span>); last = m.index + m[0].length;
  }
  out.push(text.slice(last));
  return <pre className={className} data-tool-call-raw-json="">{out}</pre>;
}

/* ── 3 · StreamingMessage ────────────────────────────────────────────────── */
export interface StreamProps { chunks: string[]; done: boolean; label?: string; className?: string }
function inline(text: string) {
  return text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g).filter(Boolean).map((t, k) => {
    if (t.startsWith('**') && t.endsWith('**') && t.length > 4) return <strong key={k}>{t.slice(2, -2)}</strong>;
    if (t.startsWith('`') && t.endsWith('`') && t.length > 2) return <code key={k} data-streaming-message-inline-code="">{t.slice(1, -1)}</code>;
    if (t.startsWith('*') && t.endsWith('*') && t.length > 2) return <em key={k}>{t.slice(1, -1)}</em>;
    return <Fragment key={k}>{t}</Fragment>;
  });
}
/** Same markdown-lite contract as src (p / strong / em / code / fenced pre), plus an open fence renders as code while streaming. */
export function renderMd(text: string, caret?: ReactNode) {
  const parts = text.split(/(```[\s\S]*?(?:```|$))/g).filter(Boolean);
  return parts.map((b, i) => {
    const lastPart = i === parts.length - 1;
    if (b.startsWith('```')) {
      const closed = b.length > 5 && b.endsWith('```');
      const lines = b.slice(3, closed ? -3 : undefined).split('\n');
      const lang = (lines[0] || '').trim();
      return <pre key={i} data-streaming-message-codeblock="" data-lang={lang || 'text'}><code data-lang={lang}>{lines.slice(1).join('\n').replace(/\n$/, '')}</code>{lastPart && !closed && caret}</pre>;
    }
    const paras = b.split(/\n\n+/).filter(s => s.trim());
    return paras.map((s, j) => <p key={i + '-' + j} data-streaming-message-p="">{inline(s)}{lastPart && j === paras.length - 1 && caret}</p>);
  });
}
export function useStream({ chunks, done }: StreamProps) {
  const text = useMemo(() => chunks.join(''), [chunks]);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const endsInBlock = /```[^`]*$/.test(text) && (text.match(/```/g) || []).length % 2 === 1;
  return { text, words, done, endsInBlock };
}

/* ── 4 · ModelSelector ───────────────────────────────────────────────────── */
export interface ModelInfo { id: string; label: string; vendor: string; contextWindow: number; tags?: string[]; enabled: boolean }
export interface ModelSelectorProps { models: ModelInfo[]; selectedId?: string; onSelect: (id: string) => void; placeholder?: string; defaultOpen?: boolean; className?: string }
export function useModelSelector({ models, selectedId, onSelect, defaultOpen = false }: ModelSelectorProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [query, setQ] = useState('');
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null), listRef = useRef<HTMLDivElement>(null), searchRef = useRef<HTMLInputElement>(null);
  const listId = useRef(uid()).current;
  const showSearch = models.length > 8;
  const filtered = useMemo(() => { const q = query.trim().toLowerCase(); return q ? models.filter(m => (m.label + ' ' + m.vendor + ' ' + (m.tags || []).join(' ')).toLowerCase().includes(q)) : models; }, [models, query]);
  const maxCtx = Math.max(1, ...models.map(m => m.contextWindow));
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, [open]);
  // Seed the highlight and focus only when the menu opens, from the props at that moment.
  const atOpen = useRef({ models, selectedId, showSearch });
  atOpen.current = { models, selectedId, showSearch };
  useEffect(() => {
    if (!open) return;
    const { models: ms, selectedId: sel, showSearch: search } = atOpen.current;
    setQ('');
    const i = ms.findIndex(m => m.id === sel);
    setActive(i >= 0 ? i : ms.findIndex(m => m.enabled));
    if (!search) return;
    const t = setTimeout(() => searchRef.current?.focus({ preventScroll: true }), 0);
    return () => clearTimeout(t);
  }, [open]);
  useEffect(() => {
    const list = listRef.current, el = list?.querySelector<HTMLElement>('[data-index="' + active + '"]');
    if (!list || !el) return;
    const lr = list.getBoundingClientRect(), r = el.getBoundingClientRect();
    if (r.top < lr.top) list.scrollTop -= lr.top - r.top; else if (r.bottom > lr.bottom) list.scrollTop += r.bottom - lr.bottom;
  }, [active, open]);
  const step = (d: number) => setActive(prev => {
    const n = filtered.length; if (!n) return -1;
    let i = prev < 0 ? (d > 0 ? -1 : 0) : prev;
    for (let k = 0; k < n; k++) { i = (i + d + n) % n; if (filtered[i].enabled) return i; }
    return prev;
  });
  const pick = (m?: ModelInfo) => { if (m && m.enabled) { onSelect(m.id); setOpen(false); } };
  const onKeyDown = (e: KeyboardEvent) => {
    if (!open) { if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); } return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); step(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); step(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); pick(filtered[active]); }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
    else if (e.key === 'Tab') setOpen(false);
  };
  const setQuery = (v: string) => { setQ(v); setActive(0); };
  return { open, toggle: () => setOpen(o => !o), query, setQuery, filtered, active, setActive, onKeyDown, rootRef, listRef, searchRef, listId, showSearch, selected: models.find(m => m.id === selectedId), pick, maxCtx };
}

/* ── 5 · ContextMeter ────────────────────────────────────────────────────── */
export interface ContextMeterProps { used: number; total: number; label?: string; breakdown?: { label: string; value: number }[]; className?: string }
export function useMeter({ used, total }: { used: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.max(0, (used / total) * 100)) : 0;
  const level = (pct >= 95 ? 'danger' : pct >= 80 ? 'warn' : 'ok') as 'ok' | 'warn' | 'danger';
  return { pct, level, left: Math.max(0, total - used), color: LEVEL_C[level], pctText: Math.round(pct) + '%' };
}
export const SEG_C = ['var(--series-2)', 'var(--series-3)', 'var(--series-4)', 'var(--series-1)', 'var(--series-5)'];

/* ── 6 · ApprovalGate ────────────────────────────────────────────────────── */
export interface ApprovalGateProps { title: string; description: string; riskLevel: 'low' | 'medium' | 'high'; actionSummary: string; onResolve: (approved: boolean, comment?: string) => void; className?: string }
export const RISK_LABEL = { low: 'Low risk', medium: 'Medium risk', high: 'High risk' };
export function useGate({ riskLevel, onResolve }: ApprovalGateProps) {
  const [decision, setDecision] = useState<null | 'approved' | 'denied'>(null);
  const [comment, setComment] = useState('');
  const resolve = (ok: boolean) => { if (decision) return; setDecision(ok ? 'approved' : 'denied'); onResolve(ok, comment.trim() || undefined); };
  return { decision, resolved: !!decision, comment, setComment, approve: () => resolve(true), deny: () => resolve(false), showComment: riskLevel !== 'low', color: RISK_C[riskLevel], level: riskLevel === 'high' ? 3 : riskLevel === 'medium' ? 2 : 1 };
}

/* ── 7 · RunTimeline ─────────────────────────────────────────────────────── */
export interface RunStep { id: string; label: string; status: ToolStatus; startedAt?: string; endedAt?: string; detail?: string }
export interface RunTimelineProps { steps: RunStep[]; dense?: boolean; now?: string; title?: string; className?: string }
export const RUN_LABEL = { pending: 'Pending', running: 'Running', succeeded: 'Passed', failed: 'Failed' };
export const clock = (iso?: string) => iso ? new Date(iso).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '';
export function useRun({ steps, now }: RunTimelineProps) {
  const ts = (s?: string) => (s ? new Date(s).getTime() : NaN);
  const nowT = now ? ts(now) : Date.now();
  const starts = steps.map(s => ts(s.startedAt)).filter(n => !isNaN(n));
  const t0 = starts.length ? Math.min(...starts) : nowT;
  const rows = steps.map(s => {
    const a = ts(s.startedAt), b = s.status === 'running' ? nowT : ts(s.endedAt);
    const dur = !isNaN(a) && !isNaN(b) ? Math.max(0, b - a) : undefined;
    return { ...s, off: isNaN(a) ? undefined : a - t0, dur, durText: fmtMs(dur), time: clock(s.startedAt), color: RUN_C[s.status] };
  });
  const span = Math.max(1, ...rows.map(r => (r.off != null && r.dur != null ? r.off + r.dur : 0)));
  const done = steps.filter(s => s.status === 'succeeded').length;
  const overall: ToolStatus = steps.some(s => s.status === 'failed') ? 'failed' : steps.some(s => s.status === 'running') ? 'running' : steps.length && done === steps.length ? 'succeeded' : 'pending';
  return { rows, span, done, overall, elapsed: fmtMs(span), color: RUN_C[overall] };
}

/* ── 8 · DiffStatPill ────────────────────────────────────────────────────── */
export interface DiffStatPillProps { added: number; removed: number; max?: number; fileName?: string; className?: string }
export function useDiffStat({ added, removed, max, fileName }: DiffStatPillProps) {
  const total = added + removed;
  const denom = max ? Math.max(total, max) : total || 1;
  const n = total === 0 ? 0 : max ? Math.max(1, Math.round((total / denom) * 5)) : 5;
  const addB = total ? Math.round((n * added) / total) : 0;
  const cells = Array.from({ length: 5 }, (_, i) => (i < addB ? 'add' : i < n ? 'del' : 'none'));
  const slash = fileName ? fileName.lastIndexOf('/') : -1;
  return { total, aW: (added / denom) * 100, rW: (removed / denom) * 100, cells, dir: fileName && slash >= 0 ? fileName.slice(0, slash + 1) : '', base: fileName ? fileName.slice(slash + 1) : '', title: (fileName ? fileName + ' ' : '') + '(+' + added + ' −' + removed + ')' };
}

/* ── 9 · AgentCard ───────────────────────────────────────────────────────── */
export type AgentStatus = 'offline' | 'idle' | 'busy' | 'working';
export interface AgentCardProps { name: string; role?: string; children?: ReactNode; status: AgentStatus; capabilities?: string[]; lastActive?: string; onFocus?: () => void; className?: string }
export const AGENT_LABEL = { offline: 'Offline', idle: 'Idle', busy: 'Busy', working: 'Working' };
export const cardInteractive = (onFocus?: () => void) => onFocus ? { role: 'button', tabIndex: 0, onClick: onFocus, onKeyDown: activate(onFocus) } : {};

/* ── 10 · ApprovalInbox ──────────────────────────────────────────────────── */
export interface ApprovalRequest { id: string; title: string; detail?: string; agent?: string; time?: string; risk?: 'low' | 'medium' | 'high' }
export interface ApprovalInboxProps { requests: ApprovalRequest[]; onApprove?: (id: string) => void; onReject?: (id: string) => void; emptyText?: string; className?: string; title?: string }
const RANK = { high: 0, medium: 1, low: 2 };
export function useInbox({ requests, onApprove, onReject }: ApprovalInboxProps) {
  const sorted = useMemo(() => [...requests].sort((a, b) => RANK[a.risk ?? 'medium'] - RANK[b.risk ?? 'medium']), [requests]);
  const [leaving, setLeaving] = useState<Record<string, 'ok' | 'no'>>({});
  const decide = (id: string, ok: boolean) => {
    if (leaving[id]) return;
    setLeaving(l => ({ ...l, [id]: ok ? 'ok' : 'no' }));
    setTimeout(() => { (ok ? onApprove : onReject)?.(id); setLeaving(l => { const n = { ...l }; delete n[id]; return n; }); }, reduced() ? 0 : 280);
  };
  const counts = { high: 0, medium: 0, low: 0 };
  sorted.forEach(r => { counts[r.risk ?? 'medium']++; });
  return { sorted, leaving, decide, counts };
}

/* ── 11 · PlanChecklist ──────────────────────────────────────────────────── */
export type PlanStepState = 'done' | 'active' | 'todo' | 'blocked';
export interface PlanStep { id: string; label: string; detail?: string; state: PlanStepState }
export interface PlanChecklistProps { steps: PlanStep[]; label?: string; className?: string }
export const PLAN_LABEL = { done: 'Done', active: 'Running', todo: 'Queued', blocked: 'Blocked' };
export const usePlan = (steps: PlanStep[]) => { const done = steps.filter(s => s.state === 'done').length; return { done, total: steps.length, pct: steps.length ? done / steps.length : 0, blocked: steps.some(s => s.state === 'blocked') }; };

/* ── 12 · CostMeter ──────────────────────────────────────────────────────── */
export interface CostMeterProps { spent: number; budget: number; formatValue?: (v: number) => string; label?: string; warnAt?: number; className?: string }
export function useCost({ spent, budget, warnAt = 0.8 }: CostMeterProps) {
  const over = spent > budget;
  const ratio = budget <= 0 ? 0 : spent / budget;
  const level = over ? 'over' : ratio >= warnAt ? 'warn' : 'ok';
  return { over, ratio, pct: Math.min(100, ratio * 100), level, color: over ? 'var(--state-error)' : level === 'warn' ? 'var(--state-warn)' : 'var(--state-ok)', left: Math.max(0, budget - spent), overBy: Math.max(0, spent - budget), aria: { role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': budget, 'aria-valuenow': Math.min(budget, Math.max(0, spent)) } };
}

/* ── 13 · EvalScoreCard ──────────────────────────────────────────────────── */
export interface EvalDimension { name: string; score: number; target?: number }
export interface EvalScoreCardProps { title: string; subtitle?: string; dimensions: EvalDimension[]; overall?: number; className?: string }
export const TONE_LABEL = { good: 'Passing', ok: 'Watch', bad: 'Failing' };
export function useEval({ dimensions, overall }: EvalScoreCardProps) {
  const mean = dimensions.length ? dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length : 0;
  const total = overall ?? Math.round(mean);
  const tone = (total >= 85 ? 'good' : total >= 65 ? 'ok' : 'bad') as 'good' | 'ok' | 'bad';
  const clamp = (n: number) => Math.min(100, Math.max(0, n));
  const rows = dimensions.map(d => ({ ...d, s: clamp(d.score), t: d.target === undefined ? undefined : clamp(d.target), met: d.target === undefined || d.score >= d.target, delta: d.target === undefined ? undefined : d.score - d.target }));
  return { total, tone, color: TONE_C[tone], rows, misses: rows.filter(r => !r.met).length };
}

/* ── 14 · HandoffCard ────────────────────────────────────────────────────── */
export interface HandoffCardProps { to: string; reason: string; needed?: string; summary?: string[]; urgency?: 'routine' | 'soon' | 'now'; onAccept?: () => void; from?: string; className?: string }
export const URG_LABEL = { routine: 'whenever', soon: 'needs you soon', now: 'needs you now' };

/* ── 15 · AuditLogViewer ─────────────────────────────────────────────────── */
export type AuditLevel = 'info' | 'action' | 'warning' | 'denied';
export interface AuditEvent { id: string; time: string; actor: string; event: string; detail?: string; level?: AuditLevel }
export interface AuditLogViewerProps { events: AuditEvent[]; emptyText?: string; className?: string }
export const AUDIT_LABEL = { info: 'INFO', action: 'ACTION', warning: 'WARN', denied: 'DENIED' };
