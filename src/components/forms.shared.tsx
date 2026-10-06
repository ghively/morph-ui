/** Shared hooks + helpers for the FORMS & INPUT components (polish batch, 2026-10). Not exported from the package index. */
import { useState, useRef, useEffect, useId, useMemo, type KeyboardEvent, type ReactNode, type RefObject, type CSSProperties, type ButtonHTMLAttributes, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { activate, cv, initials } from './agentOps.shared';
import { rove } from './ragAnswer.shared';

/* ── shared bits ─────────────────────────────────────────────────────────── */
export { activate, cv, initials, rove };
export const plural = (n: number, w: string) => n.toLocaleString('en-US') + ' ' + w + (n === 1 ? '' : 's');
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const vars = (o: Record<string, string | number>) => Object.fromEntries(Object.entries(o).map(([k, v]) => ['--' + k, v])) as CSSProperties;
/** Local-calendar ISO day, `offset` days back from today (UTC slicing drifts a day near midnight). */
export const isoDay = (offset = 0) => { const d = new Date(); d.setDate(d.getDate() - offset); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const dayN = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return Date.UTC(y!, m! - 1, d!) / 864e5; };
const shiftDay = (iso: string, back: number) => new Date((dayN(iso) - back) * 864e5).toISOString().slice(0, 10);

/** Next enabled index from `from`, stepping `d` and wrapping; -1 when nothing is enabled. */
export function step(n: number, from: number, d: number, ok: (i: number) => boolean = () => true) {
  if (!n) return -1;
  let i = from < 0 ? (d > 0 ? -1 : 0) : from;
  for (let k = 0; k < n; k++) { i = (i + d + n) % n; if (ok(i)) return i; }
  return from;
}
/** Close on a mousedown outside `ref` (and on Escape when `onEscape` is given) while `open`. */
export function useDismiss(ref: RefObject<HTMLElement | null>, open: boolean, close: () => void, onEscape?: () => void) {
  const fns = useRef({ close, onEscape }); fns.current = { close, onEscape };
  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) fns.current.close(); };
    const key = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape' && fns.current.onEscape) fns.current.onEscape(); };
    document.addEventListener('mousedown', down); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('mousedown', down); document.removeEventListener('keydown', key); };
  }, [open, ref]);
}
/** Keep `[data-active]` inside the list in view by scrolling the list only (never the page). */
export function useKeepInView(list: RefObject<HTMLElement | null>, active: number, open = true) {
  useEffect(() => {
    const l = list.current, el = l?.querySelector<HTMLElement>('[data-active]');
    if (l && el && open) scrollIntoList(l, el);
  }, [list, active, open]);
}
function scrollIntoList(list: HTMLElement, el: HTMLElement) {
  const lr = list.getBoundingClientRect(), r = el.getBoundingClientRect();
  if (r.top < lr.top) list.scrollTop -= lr.top - r.top; else if (r.bottom > lr.bottom) list.scrollTop += r.bottom - lr.bottom;
}
/** First case-insensitive match of `query` wrapped in <mark>. */
export function Match({ text, query }: { text: string; query?: string }) {
  const q = (query || '').trim(), i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return <>{text.slice(0, i)}<mark>{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>;
}
export const Chevron = (p: Record<string, string>) => (
  <svg {...p} width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 4.5l3 3 3-3" /></svg>
);

/* ── field wiring (TextField · TextArea · Select) ────────────────────────── */
/** The caller's id, or a stable generated one so label/hint/error wiring always works. */
export function useFieldId(id?: string) {
  const auto = useId();
  return id ?? 'f' + auto.replace(/:/g, '');
}
export function fieldIds(id: string, hint?: ReactNode, error?: ReactNode) {
  const hintId = hint ? id + '-hint' : undefined, errorId = error ? id + '-error' : undefined;
  return { hintId, errorId, describedBy: [hintId, errorId].filter(Boolean).join(' ') || undefined, invalid: error ? true : undefined, root: { 'data-invalid': error ? '' : undefined } };
}
/** Hint (hidden while an error shows) + alert-role error. `attr` is the hint's legacy data hook. */
export function FieldNotes({ ids, hint, error, attr = 'data-hint' }: { ids: ReturnType<typeof fieldIds>; hint?: ReactNode; error?: ReactNode; attr?: 'data-hint' | 'data-fieldhint' }) {
  return (
    <>
      {hint && !error && <div {...{ [attr]: '' }} id={ids.hintId}>{hint}</div>}
      {error && <div data-error="" id={ids.errorId} role="alert">{error}</div>}
    </>
  );
}

/* ── 1 · Accordion ───────────────────────────────────────────────────────── */
export interface AccordionItem { id: string; title: ReactNode; badge?: ReactNode; content: ReactNode; disabled?: boolean }
export interface AccordionProps {
  items: AccordionItem[];
  /** Open on mount. Uncontrolled after that. */
  defaultOpenIds?: string[];
  /** Allow several sections open at once. Default false (single-open). */
  allowMultiple?: boolean;
  className?: string;
}
export function useAccordion({ defaultOpenIds = [], allowMultiple = false }: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);
  const toggle = (id: string) => setOpenIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : allowMultiple ? [...prev, id] : [id]);
  return { isOpen: (id: string) => openIds.includes(id), toggle, onKeyDown: rove('[data-acchead] > button:not(:disabled)') };
}

/* ── 2 · Button ──────────────────────────────────────────────────────────── */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, announces busy state, and blocks clicks. */
  loading?: boolean;
}

/* ── 3 · Checkbox ────────────────────────────────────────────────────────── */
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children' | 'onChange'> {
  id: string;
  label: ReactNode;
  checked: boolean;
  onChange: (next: boolean) => void;
  /** Tri-state dash; implies checked for assistive tech via aria-checked="mixed". */
  indeterminate?: boolean;
}

/* ── 4 · Combobox ────────────────────────────────────────────────────────── */
export interface ComboboxOption { value: string; label: string; hint?: string }
export interface ComboboxProps {
  id: string;
  label?: string;
  options: ComboboxOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  /** Async search hook; when set, typing calls it instead of local filtering. */
  onSearch?: (query: string) => void;
  searching?: boolean;
  disabled?: boolean;
  className?: string;
}
export function useCombobox({ options, value, onChange, onSearch }: ComboboxProps) {
  const [query, setQ] = useState('');
  const [typed, setTyped] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null), listRef = useRef<HTMLUListElement>(null);
  const selected = options.find(o => o.value === value) ?? null;
  // Focus pre-fills the selected label; only filter once the user actually types.
  const filtered = useMemo(() => { const q = query.trim().toLowerCase(); return onSearch || !typed || !q ? options : options.filter(o => o.label.toLowerCase().includes(q)); }, [options, query, typed, onSearch]);
  useDismiss(wrapRef, open, () => setOpen(false));
  useKeepInView(listRef, active, open);
  const show = () => { if (open) return; setQ(selected?.label ?? ''); setTyped(false); setActive(Math.max(0, options.findIndex(o => o.value === value))); setOpen(true); };
  const commit = (v: string | null) => { onChange(v); setQ(options.find(o => o.value === v)?.label ?? ''); setTyped(false); setOpen(false); };
  const setQuery = (v: string) => { setQ(v); setTyped(true); setActive(0); setOpen(true); onSearch?.(v); };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const n = filtered.length;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (!open) show(); else setActive(a => step(n, a, e.key === 'ArrowDown' ? 1 : -1)); }
    else if (e.key === 'Enter') { const o = filtered[active]; if (open && o) { e.preventDefault(); commit(o.value); } }
    else if (e.key === 'Escape') { if (open) { e.preventDefault(); setOpen(false); setQ(selected?.label ?? ''); } }
    else if (e.key === 'Tab') setOpen(false);
  };
  const optId = (i: number) => listId + '-' + i;
  return { query, typed, open, show, active, setActive, filtered, selected, commit, setQuery, onKeyDown, wrapRef, listRef, listId, optId, activeId: open && filtered[active] ? optId(active) : undefined };
}

/* ── 5 · DateRangePicker ─────────────────────────────────────────────────── */
export interface DateRange { from: string; to: string }
export interface DateRangePreset { id: string; label: string; range: DateRange }
export interface DateRangePickerProps {
  id: string;
  value: DateRange;
  onChange: (next: DateRange) => void;
  presets?: DateRangePreset[];
  activePresetId?: string;
  onPresetChange?: (id: string | null) => void;
  label?: string;
  max?: string;
  className?: string;
}
export const defaultPresets = (today = isoDay(0)): DateRangePreset[] => [7, 30, 90].map(n => ({ id: n + 'd', label: n + 'd', range: { from: shiftDay(today, n), to: today } }));
export function useDateRange({ value, onChange, presets, onPresetChange, max }: DateRangePickerProps) {
  const today = isoDay(0);
  const list = useMemo(() => presets ?? defaultPresets(today), [presets, today]);
  const invalid = value.from && value.to ? value.from > value.to : false;
  const days = value.from && value.to && !invalid ? dayN(value.to) - dayN(value.from) + 1 : undefined;
  const set = (patch: Partial<DateRange>) => { onPresetChange?.(null); onChange({ ...value, ...patch }); };
  const pick = (p: DateRangePreset) => { onPresetChange?.(p.id); onChange(p.range); };
  return { presets: list, invalid, days, set, pick, cap: max ?? today };
}

/* ── 6 · DropdownMenu ────────────────────────────────────────────────────── */
export interface MenuItem { id: string; label: ReactNode; hint?: string; danger?: boolean; disabled?: boolean }
export interface MenuSection { title?: string; items: MenuItem[] }
export interface DropdownMenuProps {
  /** Trigger element (usually a Button). */
  trigger: ReactNode;
  sections: MenuSection[];
  onPick?: (id: string) => void;
  /** Checkbox-style toggle items; omitted ids render as plain actions. */
  checkedIds?: string[];
  onToggle?: (id: string, next: boolean) => void;
  label?: string;
  align?: 'left' | 'right';
  className?: string;
}
const ITEM = '[data-menuitem]:not(:disabled)';
export function useMenu({ onPick, checkedIds, onToggle }: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null), popRef = useRef<HTMLDivElement>(null), trigRef = useRef<HTMLSpanElement>(null);
  const refocus = () => trigRef.current?.querySelector<HTMLElement>('button, [href], [tabindex]')?.focus({ preventScroll: true });
  const close = (back = false) => { setOpen(false); if (back) refocus(); };
  useDismiss(wrapRef, open, () => close(), () => close(true));
  useEffect(() => { if (open) popRef.current?.querySelector<HTMLElement>(ITEM)?.focus({ preventScroll: true }); }, [open]);
  const fire = (item: MenuItem) => {
    if (item.disabled) return;
    if (checkedIds && onToggle) onToggle(item.id, !checkedIds.includes(item.id));
    else { onPick?.(item.id); close(true); }
  };
  const roving = rove(ITEM);
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => { if (e.key === 'Tab') close(); else roving(e); };
  const onTriggerKey = (e: KeyboardEvent) => { if (!open && e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); } };
  return { open, toggle: () => setOpen(o => !o), fire, onKeyDown, onTriggerKey, wrapRef, popRef, trigRef, isChecked: (id: string) => !!checkedIds?.includes(id) };
}

/* ── 7 · FilterBar ───────────────────────────────────────────────────────── */
export interface ActiveFilter { id: string; label: string }
export interface FilterBarProps { filters: ActiveFilter[]; onRemove?: (id: string) => void; onClearAll?: () => void; resultCount?: number; className?: string }
export function useFilterBar({ filters, onRemove }: FilterBarProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  // After a chip goes, hand focus to its neighbour (or the clear button) instead of dropping it on <body>.
  const remove = (id: string, i: number) => {
    onRemove?.(id);
    setTimeout(() => {
      const root = rowRef.current?.closest('[data-filterbar]'), btns = root?.querySelectorAll<HTMLElement>('[data-filterchip] button');
      const next = btns?.length ? btns[Math.min(i, btns.length - 1)] : root?.querySelector<HTMLElement>('[data-filterclear]');
      next?.focus({ preventScroll: true });
    }, 0);
  };
  return { rowRef, remove, onKeyDown: rove('[data-filterchip] button'), count: filters.length };
}

/* ── 8 · FormField ───────────────────────────────────────────────────────── */
export type FieldProbe = 'idle' | 'checking' | 'ok' | 'fail';
export interface FormFieldProps {
  /** Used for `htmlFor` and, when the child is a bare element, injected as its `id`. */
  id: string;
  label: string;
  children: ReactNode;
  /** Rendered in `[data-hint]`; a node so callers can embed `[data-num]` spans (Login does). */
  hint?: ReactNode;
  /** Drives `[data-hint][data-probe]` and `aria-live="polite"` on the hint. */
  probe?: FieldProbe;
  /** Marks the field invalid; the caller still sets `aria-invalid` on its own input. */
  invalid?: boolean;
  className?: string;
}
export const PROBE_C = { idle: 'var(--state-idle)', checking: 'var(--state-live)', ok: 'var(--state-ok)', fail: 'var(--state-error)' };

/* ── 9 · MentionAutocomplete ─────────────────────────────────────────────── */
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
/** Pure: finds an active '@' trigger in `text` at `caret`, or null. Exported. */
export function findMentionTrigger(text: string, caret: number): MentionTrigger | null {
  const m = /(^|\s)@([^\s@]{0,32})$/.exec(text.slice(0, caret));
  return m ? { start: caret - m[2]!.length - 1, query: m[2]! } : null;
}
/** Pure: applies a pick, returning the new text and the caret position. Exported. */
export function applyMention(text: string, trigger: MentionTrigger, caret: number, name: string): { text: string; caret: number } {
  return { text: text.slice(0, trigger.start) + '@' + name + ' ' + text.slice(caret), caret: trigger.start + name.length + 2 };
}
/** Pure: filter + agent-first sort + cap. Exported. */
export function rankMentionCandidates(candidates: MentionCandidate[], query: string, limit: number = 8): MentionCandidate[] {
  const q = query.toLowerCase();
  return candidates
    .filter(c => !q || c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q))
    .sort((a, b) => Number(!!b.agentLabel) - Number(!!a.agentLabel) || a.name.localeCompare(b.name))
    .slice(0, limit);
}

/* ── 10 · MultiSelect ────────────────────────────────────────────────────── */
export interface MultiSelectOption { value: string; label: string }
export interface MultiSelectProps {
  id: string;
  label?: string;
  options: MultiSelectOption[];
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}
export function useMultiSelect({ options, values, onChange, disabled }: MultiSelectProps) {
  const [query, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null), listRef = useRef<HTMLUListElement>(null), inputRef = useRef<HTMLInputElement>(null);
  const filtered = useMemo(() => { const sel = new Set(values), q = query.trim().toLowerCase(); return options.filter(o => !sel.has(o.value) && o.label.toLowerCase().includes(q)); }, [options, values, query]);
  const at = Math.min(active, Math.max(0, filtered.length - 1));
  useDismiss(wrapRef, open, () => setOpen(false));
  useKeepInView(listRef, at, open);
  const add = (v: string) => { onChange([...values, v]); setQ(''); };
  const remove = (v: string) => onChange(values.filter(x => x !== v));
  const labelOf = (v: string) => options.find(o => o.value === v)?.label ?? v;
  const setQuery = (v: string) => { setQ(v); setActive(0); setOpen(true); };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && query === '' && values.length > 0) remove(values[values.length - 1]!);
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (!open) setOpen(true); else setActive(step(filtered.length, at, e.key === 'ArrowDown' ? 1 : -1)); }
    else if (e.key === 'Escape') setOpen(false);
    else if (e.key === 'Tab') setOpen(false);
    else if (e.key === 'Enter' && filtered[at]) { e.preventDefault(); add(filtered[at].value); }
  };
  const openBox = () => { if (disabled) return; setOpen(true); inputRef.current?.focus({ preventScroll: true }); };
  const optId = (i: number) => listId + '-' + i;
  return { query, setQuery, open, setOpen, active: at, setActive, filtered, add, remove, labelOf, onKeyDown, openBox, wrapRef, listRef, inputRef, listId, optId, activeId: open && filtered[at] ? optId(at) : undefined };
}

/* ── 11 · RadioGroup ─────────────────────────────────────────────────────── */
export interface RadioOption { value: string; label: ReactNode; hint?: ReactNode; disabled?: boolean }
export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (next: string) => void;
  label?: ReactNode;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  className?: string;
}

/* ── 12 · SearchField ────────────────────────────────────────────────────── */
export interface SearchFieldProps {
  id: string;
  value: string;
  onChange: (next: string) => void;
  onSubmit?: (query: string) => void;
  label?: string;
  placeholder?: string;
  /** Debounce ms applied before onChange fires. 0 = immediate. */
  debounceMs?: number;
  disabled?: boolean;
  className?: string;
}
/** Local draft so typing shows instantly while `onChange` is debounced; external `value` changes win. */
export function useSearch({ value, onChange, onSubmit, debounceMs = 0 }: SearchFieldProps) {
  const [draft, setDraft] = useState(value);
  const [seen, setSeen] = useState(value);
  if (value !== seen) { setSeen(value); setDraft(value); }
  const timer = useRef<number | null>(null), cb = useRef(onChange); cb.current = onChange;
  const cancel = () => { if (timer.current) { window.clearTimeout(timer.current); timer.current = null; } };
  useEffect(() => cancel, []);
  const type = (next: string) => {
    setDraft(next);
    if (debounceMs <= 0) { onChange(next); return; }
    cancel(); timer.current = window.setTimeout(() => { timer.current = null; cb.current(next); }, debounceMs);
  };
  const clear = () => { cancel(); setDraft(''); onChange(''); };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSubmit) { e.preventDefault(); if (timer.current) { cancel(); onChange(draft); } onSubmit(draft); }
    else if (e.key === 'Escape' && draft) { e.preventDefault(); clear(); }
  };
  return { draft, type, clear, onKeyDown, pending: draft !== value };
}

/* ── 13 · SegmentedControl ───────────────────────────────────────────────── */
export interface SegmentedControlOption<T extends string> { value: T; label: string }
export interface SegmentedControlProps<T extends string = string> {
  value: T;
  options: SegmentedControlOption<T>[];
  onChange: (next: T) => void;
  /** Accessible name for the radiogroup. */
  label: string;
  className?: string;
}
/** Radio-group keys: arrows / Home / End move the selection and the focus together. */
export function useSegmented<T extends string>({ value, options, onChange }: SegmentedControlProps<T>) {
  const idx = options.findIndex(o => o.value === value), n = options.length;
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    const to = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : d ? step(n, idx, d) : -1;
    if (to < 0 || !n) return;
    e.preventDefault();
    if (to !== idx) onChange(options[to]!.value);
    e.currentTarget.querySelectorAll<HTMLElement>('[data-segbtn]')[to]?.focus({ preventScroll: true });
  };
  return { idx, onKeyDown, tab: (i: number) => (i === (idx < 0 ? 0 : idx) ? 0 : -1), thumb: vars({ i: idx, n: Math.max(1, n) }) };
}

/* ── 14 · Select ─────────────────────────────────────────────────────────── */
export interface SelectOption { value: string; label: string; disabled?: boolean }
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  /** Optional; a stable id is generated when omitted. */
  id?: string;
  label?: ReactNode;
  options: SelectOption[];
  /** Shown as the disabled first option when no value is set. */
  placeholder?: string;
  error?: ReactNode;
  hint?: ReactNode;
}

/* ── 15 · Slider ─────────────────────────────────────────────────────────── */
export interface SliderProps {
  id: string;
  label?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (next: number) => void;
  formatValue?: (value: number) => string;
  disabled?: boolean;
  className?: string;
}
export const pctOf = (v: number, min: number, max: number) => max === min ? 0 : clamp01((v - min) / (max - min)) * 100;

/* ── 16 · TextArea ───────────────────────────────────────────────────────── */
export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Optional; a stable id is generated when omitted. */
  id?: string;
  label?: ReactNode;
  error?: ReactNode;
  hint?: ReactNode;
}

/* ── 17 · TextField ──────────────────────────────────────────────────────── */
export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'children' | 'size'> {
  /** Optional; a stable id is generated when omitted. */
  id?: string;
  /** Visible label. Omit only when `aria-label` is given instead. */
  label?: ReactNode;
  /** Error text; sets invalid styling, `aria-invalid`, and announces via `role="alert"`. */
  error?: ReactNode;
  hint?: ReactNode;
}
