/** Shared types, hooks + helpers for the CHAT & MESSAGE components (polish batch, 2026-10). Not exported from the package index. */
import { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo, type KeyboardEvent, type DragEvent, type ReactNode, type RefObject } from 'react';
import { formatTimeLabel } from './messageFormat';

/* ── shared bits ─────────────────────────────────────────────────────────── */
export const activate = (fn?: () => void) => (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn?.(); } };
export const plural = (n: number, one: string, many: string) => n + ' ' + (n === 1 ? one : many);
export const replies = (n: number) => plural(n, 'reply', 'replies');
export const on = (b: unknown) => (b ? '' : undefined);
const EMPTY: never[] = [];

/** Stroke icons (24-unit grid, currentColor). */
export const I = {
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35',
  people: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  x: 'M18 6 6 18M6 6l12 12',
  lock: 'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM7 11V7a5 5 0 0 1 10 0v4',
  chat: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  swap: 'M8 3 4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4',
  pen: 'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z',
  replyTo: 'M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11',
  reply: 'M9 17l-5-5 5-5M20 18v-2a4 4 0 0 0-4-4H4',
  file: 'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM13 2v7h7',
  layers: 'M12 2 2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  smile: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01',
  edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z',
  copy: 'M11 9h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
  panel: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9 3v18',
  save: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z',
  link: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  trash: 'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
};
export const Ico = ({ d, size = 16 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);

/** Mention (`@n`, outranks) → unread count or dot → nothing. */
export function CountBadge({ highlight = 0, unread = 0, dot }: { highlight?: number; unread?: number; dot?: boolean }) {
  if (highlight > 0) return <span className="cm-count" data-count="" data-tone="danger" data-mention="" aria-label={highlight + ' mentions'}>@{highlight}</span>;
  if (unread <= 0) return null;
  return dot
    ? <span className="cm-dot" data-threaddot="" data-live="" role="img" aria-label="Unread replies" />
    : <span className="cm-count" data-count="" aria-label={unread + ' unread'}>{unread}</span>;
}

/* ── message model (owned by MessageTimeline's public surface) ───────────── */
export type MessageKind =
  | 'text' | 'notice' | 'emote' | 'image' | 'video' | 'audio' | 'file'
  | 'sticker' | 'artifact' | 'state' | 'deleted' | 'undecryptable' | 'decrypting';
export type SendState = 'sent' | 'sending' | 'failed';
export interface MessageReaction { key: string; count: number; mine: boolean; senders: string[] }
export interface MessageAttachment { url: string | null; error?: string | null; name: string; mimeType?: string; size?: number; width?: number; height?: number; downloadable?: boolean }
export interface TimelineMessage {
  id: string;
  localId?: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl?: string | null;
  isAgent?: boolean;
  agentLabel?: string;
  agentRole?: string;
  depth?: number;
  mine: boolean;
  ts: number;
  kind: MessageKind;
  html?: string;
  text?: string;
  attachment?: MessageAttachment;
  stateText?: string;
  artifact?: { label: string; degraded?: boolean };
  edited?: boolean;
  deleted?: boolean;
  sendState?: SendState;
  undecryptableReason?: string;
  reactions?: MessageReaction[];
  replyTo?: { id: string; senderName: string; preview: string | null };
  thread?: { count: number; lastSenderName?: string; lastTs?: number; unread?: boolean };
  readers?: { id: string; name: string; avatarUrl?: string | null; isAgent?: boolean }[];
  canEdit?: boolean;
  canDelete?: boolean;
  canOpenAttachmentPanel?: boolean;
  preview?: string;
  systemAlert?: { tone: 'ok' | 'danger' | 'info' | 'warning'; lead: string; live?: boolean };
}
export type AccentSlot = 'blue' | 'cyan' | 'green' | 'gold';
export interface MessageTileActions {
  onReply?: (id: string) => void;
  onEdit?: (id: string) => void;
  onOpenThread?: (id: string) => void;
  onOpenAttachmentPanel?: (id: string) => void;
  onShowSender?: (senderId: string) => void;
  onJumpTo?: (id: string) => void;
  onSave?: (id: string) => void;
  onCopyText?: (id: string) => void;
  onCopyLink?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleReaction?: (id: string, key: string, on: boolean) => void;
  onRetrySend?: (id: string) => void;
  onDiscardSend?: (id: string) => void;
  onConfirm?: (kind: 'delete', message: TimelineMessage) => boolean | Promise<boolean>;
}

/* ── time + accent helpers (public via MessageTimeline) ──────────────────── */
const PALETTE: AccentSlot[] = ['blue', 'cyan', 'green', 'gold'];
/** FNV-1a → stable palette slot per sender. */
export function accentForSender(senderId: string): AccentSlot {
  let h = 0x811c9dc5;
  for (let i = 0; i < senderId.length; i++) { h ^= senderId.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return PALETTE[h % 4]!;
}
/** Hash slot first; on collision take the first free slot (until the palette runs out). */
export function assignAccents(senderIds: Iterable<string>): Map<string, AccentSlot> {
  const map = new Map<string, AccentSlot>(), taken = new Set<AccentSlot>();
  for (const s of Array.from(new Set(senderIds)).sort()) {
    const raw = accentForSender(s);
    const slot = !taken.has(raw) ? raw : PALETTE.find(p => !taken.has(p)) ?? raw;
    map.set(s, slot); taken.add(slot);
  }
  return map;
}
export function sameDay(a: number, b: number): boolean {
  const x = new Date(a), y = new Date(b);
  return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate();
}
export function formatDayLabel(ts: number, now = Date.now()): string {
  if (sameDay(ts, now)) return 'Today';
  if (sameDay(ts, now - 864e5)) return 'Yesterday';
  const sameYear = new Date(ts).getFullYear() === new Date(now).getFullYear();
  return new Date(ts).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: sameYear ? undefined : 'numeric' });
}
export function formatRelative(ts: number | null | undefined, now = Date.now()): string {
  if (!ts) return '—';
  const diff = now - ts;
  if (diff < 45000) return 'just now';
  if (diff < 3600000) return Math.round(diff / 60000) + ' min ago';
  if (diff < 86400000) return Math.round(diff / 3600000) + ' h ago';
  return formatDayLabel(ts, now);
}

/* ── 1 · ConversationList ────────────────────────────────────────────────── */
export interface ConversationSummary {
  id: string;
  name: string;
  /** Rendered before the name; the source uses '# ' for non-direct. */
  prefix?: string;
  alias?: string | null;
  direct?: boolean;
  encrypted?: boolean;
  unread?: number;
  /** Mention/highlight count — outranks `unread`. */
  highlight?: number;
}
export interface ConversationGroup {
  id: string;
  label: string;
  conversations: ConversationSummary[];
  /** Present ⇒ the group offers a "Browse <label>" affordance. */
  collectionId?: string | null;
}
export interface ConversationInvite { id: string; name: string }
export interface ConversationListProps {
  groups: ConversationGroup[];
  invites?: ConversationInvite[];
  activeId?: string | null;
  filter: string;
  onFilterChange: (v: string) => void;
  onSelect: (id: string) => void;
  onAcceptInvite?: (id: string) => void;
  onDeclineInvite?: (id: string) => void;
  onBrowse?: (collectionId?: string | null) => void;
  onCreate?: () => void;
  /** Applies `[data-fade]` to every fadeable element (the rail-embedded variant). */
  fade?: boolean;
  filterPlaceholder?: string;         // default 'Filter conversations'
  /**
   * When true (default), the list itself narrows to conversations whose name or alias contains `filter`
   * (case-insensitive, trimmed); groups keep their order and groups left empty by the filter are hidden.
   * Set false when the host filters `groups` itself (e.g. server-side or fuzzy search).
   */
  filterLocally?: boolean;
  className?: string;
}

/** Case-insensitive name/alias match used by ConversationList's local filter. Empty query keeps every group as-is. */
export function filterConversationGroups(groups: ConversationGroup[], query: string): ConversationGroup[] {
  const q = query.trim().toLowerCase();
  if (!q) return groups;
  const hit = (c: ConversationSummary) => c.name.toLowerCase().includes(q) || !!c.alias?.toLowerCase().includes(q);
  return groups.map(g => ({ ...g, conversations: g.conversations.filter(hit) })).filter(g => g.conversations.length > 0);
}

/* ── 2 · MentionAutocomplete ─────────────────────────────────────────────── */
export interface MentionCandidate {
  id: string;
  name: string;
  avatarUrl?: string | null;
  /** Non-null marks an agent and sorts it first; the string is the badge label. */
  agentLabel?: string | null;
}
export interface MentionTrigger {
  /** Index in the text where the '@' sits. */
  start: number;
  /** Text typed after the '@'. */
  query: string;
}
export interface MentionAutocompleteProps {
  /** Null hides the popover. */
  trigger: MentionTrigger | null;
  candidates: MentionCandidate[];
  activeIndex: number;
  onActiveIndexChange: (i: number) => void;
  onPick: (candidate: MentionCandidate) => void;
  /** Group eyebrow, shown only when at least one candidate is an agent. */
  groupLabel?: string;                // default 'Agents & people'
  label?: string;                     // aria-label, default 'Mention someone'
  className?: string;
}
/** Pure: finds an active '@' trigger in `text` at `caret`, or null. */
export function findMentionTrigger(text: string, caret: number): MentionTrigger | null {
  const m = /(^|\s)@([^\s@]{0,32})$/.exec(text.slice(0, caret));
  return m ? { start: caret - m[2]!.length - 1, query: m[2]! } : null;
}
/** Pure: applies a pick, returning the new text and the caret position. */
export function applyMention(text: string, trigger: MentionTrigger, caret: number, name: string): { text: string; caret: number } {
  return { text: text.slice(0, trigger.start) + '@' + name + ' ' + text.slice(caret), caret: trigger.start + name.length + 2 };
}
/** Pure: filter + agent-first sort + cap. */
export function rankMentionCandidates(candidates: MentionCandidate[], query: string, limit: number = 8): MentionCandidate[] {
  const q = query.toLowerCase();
  return candidates
    .filter(c => !q || c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q))
    .sort((a, b) => Number(!!b.agentLabel) - Number(!!a.agentLabel) || a.name.localeCompare(b.name))
    .slice(0, limit);
}
/** Keeps the active option in view while arrowing through a long list. */
export function useActiveInView(listRef: RefObject<HTMLElement | null>, index: number) {
  useEffect(() => { listRef.current?.querySelector<HTMLElement>('[data-mentionitem][aria-selected="true"]')?.scrollIntoView?.({ block: 'nearest' }); }, [listRef, index]);
}

/* ── 3 · MessageComposer ─────────────────────────────────────────────────── */
export interface ComposerMention { id: string; name: string }
export interface ComposerDraft { text: string; mentions: ComposerMention[] }
export interface UploadProgress { name: string; pct: number }
export interface ComposerReplyContext {
  /** 'reply' | 'edit'. */
  mode: 'reply' | 'edit';
  /** Name shown in the chip (reply mode). */
  senderName?: string;
  /** Preview line beside the chip. */
  preview: string;
  onCancel: () => void;
}
export interface MessageComposerProps {
  draft: ComposerDraft;
  onDraftChange: (next: ComposerDraft) => void;
  onSend: (draft: ComposerDraft) => void | Promise<void>;
  placeholder: string;
  /** No permission to post — disables the input and shows the placeholder as the reason. */
  disabled?: boolean;
  /** Renders the offline banner above the composer. */
  offline?: boolean;
  offlineMessage?: ReactNode;
  /** Reply or edit chip row. */
  context?: ComposerReplyContext | null;
  /** Enter sends (Shift+Enter newline) vs Cmd/Ctrl+Enter sends. */
  sendOnEnter?: boolean;                  // default true
  /** ArrowUp on an empty draft. */
  onEditLast?: () => void;
  /** Files dropped or attached. */
  onAttach?: (files: File[] | FileList) => void | Promise<void>;
  uploads?: UploadProgress[];
  /** Throttled typing signal; called at most once per `typingThrottleMs`. */
  onTyping?: (active: boolean) => void;
  typingThrottleMs?: number;              // default 3000
  /** Focus the textarea on mount / when `focusKey` changes. Skipped when `autoFocus` is false. */
  autoFocus?: boolean;
  focusKey?: string;
  /** Max autosize height in px. Default 240. */
  maxHeight?: number;
  /** Rendered inside the composer shell, above the popover layer (mention list slot). */
  overlay?: ReactNode;
  /** Forwarded to the textarea so a parent can drive selection/caret. */
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  /** Caret position reported on every change, for mention detection. */
  onCaretChange?: (text: string, caret: number) => void;
  className?: string;
  /**
   * Host provides these to populate the mention list when a trigger is active.
   * If not provided or empty, the internal MentionAutocomplete won't show.
   */
  mentionCandidates?: MentionCandidate[];
}
export function useComposer(p: MessageComposerProps) {
  const { draft, onDraftChange, onSend, context = null, sendOnEnter = true, onEditLast, onAttach, onTyping, typingThrottleMs = 3000, autoFocus = true, focusKey, maxHeight = 240, onKeyDown, onCaretChange, mentionCandidates = EMPTY } = p;
  const ownRef = useRef<HTMLTextAreaElement>(null);
  const ta = p.textareaRef || ownRef;
  const [over, setOver] = useState(false);
  const [trigger, setTrigger] = useState<MentionTrigger | null>(null);
  const [acIndex, setAcIndex] = useState(0);
  const lastTyping = useRef(0);
  const raf = useRef(0);

  useLayoutEffect(() => {
    const el = ta.current; if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px';
  }, [draft.text, maxHeight, ta]);
  // Skip on narrow screens so opening a conversation doesn't raise the phone keyboard.
  useEffect(() => {
    if (!autoFocus || !ta.current || window.matchMedia?.('(max-width:720px)').matches) return;
    ta.current.focus({ preventScroll: true });
  }, [focusKey, autoFocus, ta]);
  useEffect(() => { if (context?.mode === 'reply') ta.current?.focus(); }, [context?.mode, ta]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const ranked = useMemo(() => (trigger && mentionCandidates.length ? rankMentionCandidates(mentionCandidates, trigger.query) : EMPTY), [trigger, mentionCandidates]);
  const pick = useCallback((c: MentionCandidate) => {
    const el = ta.current; if (!trigger || !el) return;
    const r = applyMention(draft.text, trigger, el.selectionStart ?? draft.text.length, c.name);
    onDraftChange({ text: r.text, mentions: [...draft.mentions.filter(m => m.id !== c.id), { id: c.id, name: c.name }] });
    setTrigger(null);
    raf.current = requestAnimationFrame(() => { ta.current?.setSelectionRange(r.caret, r.caret); ta.current?.focus(); });
  }, [trigger, draft, onDraftChange, ta]);

  const send = () => { onTyping?.(false); lastTyping.current = 0; void onSend(draft); };
  const change = (text: string) => {
    onDraftChange({ ...draft, text });
    if (ta.current) {
      const caret = ta.current.selectionStart ?? text.length;
      onCaretChange?.(text, caret);
      const t = findMentionTrigger(text, caret);
      setTrigger(t); if (t) setAcIndex(0);
    }
    const now = Date.now();
    if (text && onTyping && now - lastTyping.current > typingThrottleMs) { lastTyping.current = now; onTyping(true); }
  };
  const keyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const n = ranked.length;
    if (n) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setAcIndex(i => (i + 1) % n); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setAcIndex(i => (i - 1 + n) % n); return; }
      if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); pick(ranked[acIndex] ?? ranked[0]!); return; }
      if (e.key === 'Escape') { e.preventDefault(); setTrigger(null); return; }
    }
    if (e.key === 'Escape' && context) { context.onCancel(); return; }
    if (e.key === 'ArrowUp' && !draft.text && context?.mode !== 'edit') { e.preventDefault(); onEditLast?.(); return; }
    // The IME `isComposing` guard is mandatory: Enter that commits a composition must not send.
    const sendKey = e.key === 'Enter' && (sendOnEnter ? !e.shiftKey && !e.nativeEvent.isComposing : e.metaKey || e.ctrlKey);
    if (sendKey) { e.preventDefault(); send(); return; }
    onKeyDown?.(e);
  };
  const drop = {
    onDragOver: (e: DragEvent) => { e.preventDefault(); setOver(true); },
    onDragLeave: (e: DragEvent) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(false); },
    onDrop: (e: DragEvent) => { e.preventDefault(); setOver(false); if (e.dataTransfer.files.length && onAttach) void onAttach(Array.from(e.dataTransfer.files)); },
  };
  return { ta, over, drop, trigger, acIndex, setAcIndex, ranked, pick, send, change, keyDown, ready: draft.text.trim().length > 0 || !!context };
}

/* ── 4 · MessageContent ──────────────────────────────────────────────────── */
export interface MessageContentProps {
  kind: MessageKind;
  html?: string;
  text?: string;
  htmlIsTrusted?: boolean;
  attachment?: MessageAttachment;
  undecryptableReason?: string;
  undecryptableHint?: ReactNode;
  onMentionSelect?: (id: string) => void;
  parsePillHref?: (href: string) => string | null;
  onOpen?: () => void;
  onDownload?: () => void;
  onCopyCode?: (code: string) => void;
  className?: string;
}
const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escapeHtml = (s: string) => s.replace(/[&<>"']/g, c => ESC[c]!);
export const linkify = (s: string) => s.replace(/\bhttps?:\/\/[^\s<>"']+[^\s<>"'.,;:!?)\]]/g, u => '<a href="' + u + '" target="_blank" rel="noopener noreferrer nofollow">' + u + '</a>');
/** Plain text → safe HTML: escape, linkify, keep line breaks. */
export const textToHtml = (text?: string) => linkify(escapeHtml(text || '')).replace(/\n/g, '<br>');
/** `…#/room/@id` → `@id` (last path segment after the hash route). */
export function defaultParsePillHref(href: string): string | null {
  const parts = href.split('#/');
  if (parts.length < 2) return null;
  const segs = parts[parts.length - 1]!.split('/');
  return segs[segs.length - 1]!;
}
/**
 * The prose body is injected HTML, so pill clicks and the code-block chrome are wired
 * imperatively. Callbacks are read through a ref: the effect re-runs only when the content changes.
 */
export function useProse(contentKey: string, opts: { onMentionSelect?: (id: string) => void; parsePillHref: (href: string) => string | null; onCopyCode?: (code: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const cb = useRef(opts);
  cb.current = opts;
  useEffect(() => {
    const root = ref.current; if (!root) return;
    const timers: number[] = [];
    const onClick = (e: MouseEvent) => {
      const href = (e.target as HTMLElement).closest('a[data-pill]')?.getAttribute('href');
      const id = href ? cb.current.parsePillHref(href) : null;
      if (id) { e.preventDefault(); cb.current.onMentionSelect?.(id); }
    };
    root.addEventListener('click', onClick);
    root.querySelectorAll('pre').forEach(pre => {
      if (pre.closest('[data-code]')) return;
      const wrap = document.createElement('div'), head = document.createElement('div'), lang = document.createElement('span'), copy = document.createElement('button');
      wrap.setAttribute('data-code', ''); wrap.className = 'msgc-code';
      head.setAttribute('data-codehead', ''); head.className = 'msgc-codehead';
      lang.setAttribute('data-num', ''); lang.textContent = pre.querySelector('code')?.getAttribute('data-lang') || 'text';
      copy.type = 'button'; copy.className = 'msgc-copy'; copy.textContent = 'Copy';
      copy.setAttribute('data-btn', 'text'); copy.setAttribute('data-state', ''); copy.setAttribute('aria-label', 'Copy code');
      copy.onclick = () => {
        const code = pre.textContent || '';
        void navigator.clipboard?.writeText(code);
        cb.current.onCopyCode?.(code);
        copy.textContent = 'Copied'; copy.setAttribute('data-copied', '');
        timers.push(window.setTimeout(() => { copy.textContent = 'Copy'; copy.removeAttribute('data-copied'); }, 1400));
      };
      head.append(lang, copy);
      pre.replaceWith(wrap);
      wrap.append(head, pre);
    });
    return () => { root.removeEventListener('click', onClick); timers.forEach(clearTimeout); };
  }, [contentKey]);
  return ref;
}

/* ── 5 · MessageTile ─────────────────────────────────────────────────────── */
export interface MessageTileProps {
  message: TimelineMessage;
  continuation?: boolean;
  inThread?: boolean;
  highlighted?: boolean;
  accent: AccentSlot;
  timeLabel?: string;
  quickReactions?: string[];
  permalink?: string;
  actions?: MessageTileActions;
  renderBody?: (message: TimelineMessage) => ReactNode;
  className?: string;
}
export const DEFAULT_QUICK_REACTIONS = ['👍', '❤️', '😂', '🎉', '👀', '✅'];
export const ALERT_TONE = { ok: 'info', info: 'info', warning: 'warn', danger: 'danger' } as const;
const ATTACH_KINDS = new Set<MessageKind>(['deleted', 'image', 'video', 'audio', 'file', 'sticker']);
export function useTile(p: MessageTileProps) {
  const { message: m, actions: a, permalink } = p;
  const [picking, setPicking] = useState(false);
  const reactBtn = useRef<HTMLButtonElement>(null);
  const picker = useRef<HTMLDivElement>(null);
  const deleted = !!m.deleted || m.kind === 'deleted';
  const closePicker = (refocus?: boolean) => { setPicking(false); if (refocus) reactBtn.current?.focus(); };
  useEffect(() => { if (picking) picker.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus(); }, [picking]);
  // Roving arrows inside the picker; Escape returns focus to the React button.
  const pickerKey = (e: KeyboardEvent) => {
    const items = Array.from(picker.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []), i = items.indexOf(document.activeElement as HTMLElement), n = items.length;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closePicker(true); }
    else if (n && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { e.preventDefault(); items[(i + (e.key === 'ArrowRight' ? 1 : -1) + n) % n]!.focus(); }
  };
  const copy = (text: string | undefined, done?: (id: string) => void) => { if (!text) return; void navigator.clipboard?.writeText(text); done?.(m.id); };
  return {
    time: p.timeLabel ?? formatTimeLabel(m.ts),
    deleted,
    attach: deleted || ATTACH_KINDS.has(m.kind),
    showActions: m.sendState === 'sent' && !deleted,
    label: m.mine ? 'You: ' + m.preview : m.senderName + (m.isAgent ? ' (agent)' : '') + ': ' + m.preview,
    seenBy: m.readers?.length ? 'Seen by ' + m.readers.map(r => r.name).join(', ') : '',
    picking, reactBtn, picker, pickerKey,
    togglePicker: () => setPicking(v => !v),
    closePicker,
    react: (key: string) => { a?.onToggleReaction?.(m.id, key, false); closePicker(true); },
    copyText: () => copy(m.text, a?.onCopyText),
    copyLink: () => copy(permalink, a?.onCopyLink),
    remove: async () => { if (a?.onConfirm && !(await a.onConfirm('delete', m))) return; a?.onDelete?.(m.id); },
  };
}

/* ── 6 · MessageTimeline ─────────────────────────────────────────────────── */
export interface MessageTimelineProps {
  messages: TimelineMessage[];
  label: string;
  highlightId?: string | null;
  inThread?: boolean;
  onLoadOlder?: () => Promise<boolean>;
  exhausted?: boolean;
  version?: number;
  actions?: MessageTileActions;
  groupWindowMs?: number;
  foldStateRunsAt?: number;
  /**
   * Reference time (ms) for day labels ("Today" / "Yesterday"). When omitted, the clock is read once on mount
   * rather than on every render, so re-renders stay pure and deterministic.
   */
  now?: number;
  /** Passed through to every MessageTile; same contract as `MessageTile.renderBody` (return null/undefined for the default body). */
  renderBody?: (message: TimelineMessage) => ReactNode;
  /**
   * Escape hatch for a whole row: receives the message and the MessageTile the timeline would render, and returns what
   * goes in the log instead (wrap it, replace it with a tool-call card or streamed answer, or return `defaultTile`).
   */
  renderMessage?: (message: TimelineMessage, defaultTile: ReactNode) => ReactNode;
  className?: string;
}
export type TimelineRow =
  | { type: 'day'; key: string; label: string }
  | { type: 'fold'; key: string; run: TimelineMessage[] }
  | { type: 'msg'; key: string; message: TimelineMessage; continuation: boolean };
const keyOf = (m: TimelineMessage) => m.id ?? m.localId;
/** Day separators, folded runs of ≥ `foldAt` state events, and sender continuation within `windowMs`. */
export function buildTimelineRows(messages: TimelineMessage[], windowMs: number, foldAt: number, now = Date.now()): TimelineRow[] {
  const rows: TimelineRow[] = [];
  let prev: TimelineMessage | null = null;
  for (let i = 0; i < messages.length;) {
    const ev = messages[i]!;
    if (!prev || !sameDay(prev.ts, ev.ts)) rows.push({ type: 'day', key: 'day-' + ev.ts, label: formatDayLabel(ev.ts, now) });
    let j = i;
    while (j < messages.length && messages[j]!.kind === 'state') j++;
    if (j - i >= foldAt && j > i) {
      rows.push({ type: 'fold', key: 'run-' + ev.id, run: messages.slice(i, j) });
      prev = messages[j - 1]!; i = j; continue;
    }
    const continuation = !!prev && prev.kind !== 'state' && ev.kind !== 'state' && prev.senderId === ev.senderId && ev.ts - prev.ts < windowMs && !prev.deleted && sameDay(prev.ts, ev.ts);
    rows.push({ type: 'msg', key: keyOf(ev)!, message: ev, continuation });
    prev = ev; i++;
  }
  return rows;
}
export function useTimeline(p: MessageTimelineProps) {
  const { messages, highlightId, onLoadOlder, exhausted = false, version, groupWindowMs = 300000, foldStateRunsAt = 3 } = p;
  const [mountedAt] = useState(() => p.now ?? Date.now());
  const now = p.now ?? mountedAt;
  const scroller = useRef<HTMLDivElement>(null);
  const atBottom = useRef(true);
  const prevHeight = useRef<number | null>(null);
  const jumpTries = useRef(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(exhausted);
  useEffect(() => setDone(exhausted), [exhausted]);

  const loadOlder = useCallback(async () => {
    if (!onLoadOlder || loading || done) return;
    setLoading(true);
    prevHeight.current = scroller.current?.scrollHeight ?? null;
    try { if (!(await onLoadOlder())) setDone(true); }
    catch { /* offline — the button stays */ }
    finally { setLoading(false); }
  }, [onLoadOlder, loading, done]);

  // Prepends keep the viewport anchored; appends follow the tail only when already at the bottom.
  useLayoutEffect(() => {
    const el = scroller.current; if (!el) return;
    if (prevHeight.current !== null) { el.scrollTop += el.scrollHeight - prevHeight.current; prevHeight.current = null; }
    else if (atBottom.current && !highlightId) el.scrollTop = el.scrollHeight;
  }, [messages.length, version, highlightId]);
  useEffect(() => { jumpTries.current = 0; }, [highlightId]);
  // Jump-to: page back (≤ 8 times) until the highlighted event is loaded, then centre + focus it.
  useEffect(() => {
    if (!highlightId) return;
    const el = scroller.current?.querySelector<HTMLElement>('[data-eventid="' + CSS.escape(highlightId) + '"]');
    if (el) { el.scrollIntoView?.({ block: 'center' }); el.focus({ preventScroll: true }); return; }
    if (jumpTries.current < 8 && !done && onLoadOlder) { jumpTries.current++; void loadOlder(); }
  }, [highlightId, messages.length, done, loadOlder, onLoadOlder]);

  const onScroll = () => {
    const el = scroller.current; if (!el) return;
    atBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (el.scrollTop < 120) void loadOlder();
  };
  const accents = useMemo(() => assignAccents(messages.map(m => m.senderId)), [messages]);
  const rows = useMemo(() => buildTimelineRows(messages, groupWindowMs, foldStateRunsAt, now), [messages, groupWindowMs, foldStateRunsAt, now]);
  return { scroller, onScroll, loading, done, loadOlder, rows, accent: (s: string) => accents.get(s) ?? accentForSender(s) };
}

/* ── 7 · ReactionBar ─────────────────────────────────────────────────────── */
export interface ReactionBarProps {
  reactions: MessageReaction[];
  onToggle: (key: string, currentlyMine: boolean) => void;
  label?: string;
  hideWhenEmpty?: boolean;
  className?: string;
}

/* ── 8 · ThreadList ──────────────────────────────────────────────────────── */
export interface ThreadSummary {
  id: string;
  /** Root-message preview; falls back to 'Thread' when empty. */
  title: string;
  replyCount: number;
  lastSenderName?: string;
  lastTs?: number;
  unread?: number;
  /** Mention count — outranks `unread`. */
  highlight?: number;
}
export interface ThreadListProps {
  threads: ThreadSummary[];
  /** Currently-open thread, or null for the main timeline. */
  activeId?: string | null;
  onSelect: (id: string) => void;
  /** The "main timeline" row. */
  onSelectMain: () => void;
  mainLabel?: string;                 // default 'Main timeline'
  /** Promote a thread into the primary pane. Omit to hide the action. */
  onPromote?: (id: string) => void;
  /** Accessible name. */
  label: string;
  /** Pre-formatted relative time per thread; falls back to formatRelative(lastTs). */
  formatTime?: (ts: number | undefined) => string;
  /** Shown when there are no threads. */
  emptyMessage?: ReactNode;
  className?: string;
}
export const defaultThreadTime = (ts?: number) => (ts ? formatRelative(ts) : '');
export const threadMeta = (t: ThreadSummary, fmt: (ts: number | undefined) => string) =>
  [replies(t.replyCount), t.lastSenderName, fmt(t.lastTs)].filter(Boolean).join(' · ');

/* ── 9 · TypingIndicator ─────────────────────────────────────────────────── */
export interface TypingParticipant { id: string; name: string; avatarUrl?: string | null; isAgent?: boolean }
export interface TypingIndicatorProps {
  participants: TypingParticipant[];
  singularLabel?: string;
  agentSingularLabel?: string;
  pluralLabel?: string;
  className?: string;
}
/** "Alice is typing" / "Bot is working" / "Alice, Bob are typing"; '' when nobody is. */
export function typingLine(ps: TypingParticipant[], one: string, agent: string, many: string) {
  if (!ps.length) return '';
  return ps.map(x => x.name).join(', ') + ' ' + (ps.length > 1 ? many : ps[0]!.isAgent ? agent : one);
}
