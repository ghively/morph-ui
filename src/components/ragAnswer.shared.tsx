/* Shared hooks + types for the RAG_ANSWER set (polish lane B, shipped from explore/rag-answer). */
import { useState, useRef, useMemo, type CSSProperties, type KeyboardEvent, type ChangeEvent } from 'react';

/* ── shared bits ─────────────────────────────────────────────────────────── */
export const demoBtn: CSSProperties = { all: 'unset', cursor: 'pointer', justifySelf: 'start', padding: '6px 12px', borderRadius: 8, fontSize: 12, color: 'var(--app-text)', border: '1px solid var(--app-line)', background: 'color-mix(in srgb, var(--app-text) 6%, transparent)' };
export const cv = (c: string) => ({ ['--c' as string]: c }) as CSSProperties;
export const fmtK = (n: number) => n >= 1e6 ? (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M' : n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n);
const uid = () => 'r' + Math.random().toString(36).slice(2, 8);
export const useUid = () => useRef(uid()).current;

/** Arrow / Home / End move focus between `sel` items inside the handler's element. */
export function rove(sel: string) {
  return (e: KeyboardEvent<HTMLElement>) => {
    const fwd = e.key === 'ArrowRight' || e.key === 'ArrowDown', back = e.key === 'ArrowLeft' || e.key === 'ArrowUp';
    if (!fwd && !back && e.key !== 'Home' && e.key !== 'End') return;
    const items = Array.from(e.currentTarget.querySelectorAll(sel)) as HTMLElement[];
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (i < 0 || !items.length) return;
    e.preventDefault();
    const n = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : (i + (fwd ? 1 : -1) + items.length) % items.length;
    items[n]!.focus({ preventScroll: true });
  };
}

export const GROUND_C = { grounded: 'var(--state-ok)', partial: 'var(--state-warn)', ungrounded: 'var(--state-error)' };
export const STAGE_C = { done: 'var(--state-ok)', active: 'var(--state-live)', todo: 'var(--state-idle)' };
export const LEVEL_C = { ok: 'var(--state-live)', warn: 'var(--state-warn)', danger: 'var(--state-error)' };
const SERIES = ['var(--series-1)', 'var(--series-2)', 'var(--series-3)', 'var(--series-4)', 'var(--series-5)', 'var(--series-6)'];

/* ── 1 · CitationPills ───────────────────────────────────────────────────── */
export interface Citation { id: string; index?: number; title?: string }
export interface CitationPillsProps { citations: Citation[]; activeId?: string; onSelect?: (id: string) => void; className?: string }
export function useCitations({ citations, activeId, onSelect }: CitationPillsProps) {
  return {
    empty: citations.length === 0,
    onKeyDown: rove('[data-cite]'),
    items: citations.map((c, i) => {
      const n = c.index ?? i + 1, active = c.id === activeId;
      return {
        key: c.id, n, active, title: c.title,
        btn: { type: 'button' as const, 'data-cite': '', 'data-active': active ? '' : undefined, 'aria-label': 'Source ' + n + (c.title ? ': ' + c.title : ''), 'aria-pressed': onSelect ? active : undefined, onClick: () => onSelect?.(c.id) },
      };
    }),
  };
}

/* ── 2 · SourceCardList ──────────────────────────────────────────────────── */
export interface SourceCard { id: string; title: string; excerpt: string; url?: string; department?: string; score?: number }
export interface SourceCardListProps { sources: SourceCard[]; activeId?: string; onSelect?: (id: string) => void; compact?: boolean; emptyText?: string; className?: string }
const hostOf = (u: string) => { try { return new URL(u).host; } catch { return u; } };
export function useSources({ sources, activeId, onSelect, emptyText = 'No sources retrieved.' }: SourceCardListProps) {
  return {
    empty: sources.length === 0, emptyText, onKeyDown: rove('[data-sourcebtn]'),
    rows: sources.map((s, i) => ({ ...s, n: i + 1, active: s.id === activeId, pct: s.score == null ? undefined : Math.round(s.score * 100), host: s.url ? hostOf(s.url) : undefined, select: () => onSelect?.(s.id) })),
  };
}

/* ── 3 · RetrievalInspector ──────────────────────────────────────────────── */
export interface RetrievedChunk { id: string; title: string; excerpt: string; score: number; department?: string; tokens?: number }
export interface RetrievalInspectorProps { chunks: RetrievedChunk[]; threshold?: number; formatScore?: (s: number) => string; title?: string; defaultExpanded?: string[]; className?: string }
export function useRetrieval({ chunks, threshold = 0.7, formatScore = s => s.toFixed(2), title = 'Retrieved chunks', defaultExpanded = [] }: RetrievalInspectorProps) {
  const [open, setOpen] = useState<string[]>(defaultExpanded);
  const id = useUid();
  const ranked = useMemo(() => [...chunks].sort((a, b) => b.score - a.score), [chunks]);
  const rows = ranked.map((c, i) => ({
    ...c, rank: i + 1, below: c.score < threshold, pct: Math.round(c.score * 100), fmt: formatScore(c.score), open: open.includes(c.id),
    toggle: () => setOpen(o => o.includes(c.id) ? o.filter(x => x !== c.id) : [...o, c.id]),
    btn: { type: 'button' as const, 'aria-expanded': open.includes(c.id), 'aria-controls': id + '-' + c.id },
    bodyId: id + '-' + c.id,
  }));
  const above = rows.filter(r => !r.below).length;
  return { rows, above, below: rows.length - above, title, thFmt: formatScore(threshold), thPct: Math.round(threshold * 100), tokens: rows.filter(r => !r.below).reduce((s, r) => s + (r.tokens || 0), 0), empty: rows.length === 0, onKeyDown: rove('[data-chunkbtn]') };
}

/* ── 4 · GroundingBadge ──────────────────────────────────────────────────── */
export type GroundingVerdict = 'grounded' | 'partial' | 'ungrounded';
export interface GroundingBadgeProps { verdict: GroundingVerdict; detail?: string; cited?: number; total?: number; className?: string }
export const GROUND_LABEL = { grounded: 'Grounded', partial: 'Partially grounded', ungrounded: 'Ungrounded' };
export function useGrounding({ verdict, detail, cited, total }: GroundingBadgeProps) {
  const has = total != null && total > 0;
  const c = has ? Math.min(Math.max(0, cited ?? 0), total!) : 0;
  const d = detail ?? (has ? c + ' of ' + total + ' claims cited' : undefined);
  return { label: GROUND_LABEL[verdict], color: GROUND_C[verdict], detail: d, has, cited: c, total: has ? total! : 0, ratio: has ? c / total! : 1, aria: GROUND_LABEL[verdict] + (d ? ', ' + d : '') };
}

/* ── 5 · StreamingStageIndicator ─────────────────────────────────────────── */
export type RagStage = 'searching' | 'reading' | 'drafting';
export interface StreamingStageIndicatorProps { stage?: RagStage; streaming?: boolean; stages?: [string, string, string]; doneLabel?: string; className?: string }
const ORDER: RagStage[] = ['searching', 'reading', 'drafting'];
export function useStages({ stage, streaming = true, stages = ['Searching', 'Reading', 'Drafting'], doneLabel }: StreamingStageIndicatorProps) {
  const settled = !streaming;
  const current = settled ? 3 : stage ? Math.max(0, ORDER.indexOf(stage)) : 0;
  const items = ORDER.map((k, i) => ({ key: k, label: stages[i], n: i + 1, state: (i < current ? 'done' : i === current ? 'active' : 'todo') as 'done' | 'active' | 'todo' }));
  return { hidden: settled && !doneLabel, settled, doneLabel, items, current, label: settled ? doneLabel || 'Done' : stages[current], aria: settled ? doneLabel || 'Done' : 'Working: ' + stages[current] + '…' };
}

/* ── 6 · ContextAttributionList ──────────────────────────────────────────── */
export interface AttributionEntry { source: string; tokens: number; department?: string }
export interface ContextAttributionListProps { entries: AttributionEntry[]; budget?: number; title?: string; className?: string }
export function useAttribution({ entries, budget, title = 'Context usage' }: ContextAttributionListProps) {
  const total = entries.reduce((s, e) => s + e.tokens, 0);
  const max = Math.max(1, ...entries.map(e => e.tokens));
  const used = budget ? total / budget : undefined;
  const level: keyof typeof LEVEL_C = used == null ? 'ok' : used >= 0.95 ? 'danger' : used >= 0.8 ? 'warn' : 'ok';
  const rows = [...entries].sort((a, b) => b.tokens - a.tokens).map((e, i) => ({
    ...e, color: SERIES[i % SERIES.length], share: total ? e.tokens / total : 0, sharePct: total ? Math.round((e.tokens / total) * 100) : 0,
    w: Math.max(2, (e.tokens / max) * 100), seg: budget ? (e.tokens / budget) * 100 : total ? (e.tokens / total) * 100 : 0,
  }));
  return { rows, total, budget, title, used, usedPct: used == null ? undefined : Math.round(used * 100), free: budget ? Math.max(0, budget - total) : undefined, level, levelColor: LEVEL_C[level], empty: entries.length === 0 };
}

/* ── 7 · AnswerFeedback ──────────────────────────────────────────────────── */
export interface FeedbackSubmit { rating: 'up' | 'down'; reasons: string[]; correction: string }
export interface AnswerFeedbackProps { reasons?: string[]; onSubmit?: (f: FeedbackSubmit) => void; prompt?: string; className?: string }
export const DEFAULT_REASONS = ['Wrong department', 'Stale source', 'Missing citation', 'Too vague', 'Hallucinated detail'];
export function useFeedback({ reasons = DEFAULT_REASONS, onSubmit, prompt = 'Rate this answer' }: AnswerFeedbackProps) {
  const [rating, setR] = useState<'up' | 'down' | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [correction, setCorrection] = useState('');
  const [sent, setSent] = useState<FeedbackSubmit | null>(null);
  const id = useUid();
  const setRating = (r: 'up' | 'down') => { setR(cur => (cur === r ? null : r)); if (r === 'up') setPicked([]); };
  const toggle = (r: string) => setPicked(p => (p.includes(r) ? p.filter(x => x !== r) : [...p, r]));
  const submit = () => { if (!rating) return; const f = { rating, reasons: rating === 'down' ? picked : [], correction: correction.trim() }; onSubmit?.(f); setSent(f); };
  return { reasons, prompt, rating, setRating, picked, toggle, correction, setCorrection, submit, sent, id, sendLabel: rating === 'up' ? 'Send' : picked.length ? 'Report · ' + picked.length : 'Report' };
}
export const Thumb = ({ down }: { down?: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={down ? { transform: 'scaleY(-1)' } : undefined}>
    <path d="M5 7v6H2.5v-6H5zm1 6h6.2a1.5 1.5 0 001.5-1.2l1-4.6a1.5 1.5 0 00-1.5-1.7H9.5l.6-2.8a1.4 1.4 0 00-2.7-.7L6 7z" />
  </svg>
);

/* ── 8 · FollowUpChips ───────────────────────────────────────────────────── */
export interface FollowUpChipsProps { suggestions: string[]; onPick?: (s: string) => void; label?: string; className?: string }
export function useFollowUps({ suggestions, onPick, label = 'Follow up' }: FollowUpChipsProps) {
  return { label, empty: suggestions.length === 0, onKeyDown: rove('[data-followup]'), items: suggestions.map((s, i) => ({ key: s, text: s, n: i + 1, pick: () => onPick?.(s) })) };
}

/* ── 9 · VariablePromptInput ─────────────────────────────────────────────── */
export interface VariablePromptInputProps { id: string; label?: string; template: string; onTemplateChange?: (t: string) => void; values?: Record<string, string>; onValuesChange?: (v: Record<string, string>) => void; onRun?: (filled: string, values: Record<string, string>) => void; runLabel?: string; readOnlyTemplate?: boolean; className?: string }
const SLOT = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g;
export function useVarPrompt(p: VariablePromptInputProps) {
  const { template, values, onValuesChange, onTemplateChange, readOnlyTemplate, onRun, runLabel = 'Run', label = 'Prompt', id } = p;
  const [inner, setInner] = useState<Record<string, string>>({});
  const live = values ?? inner;
  const setLive = onValuesChange ?? setInner;
  const { slots, segments } = useMemo(() => {
    const slots: string[] = [], segments: { text: string; slot?: string }[] = [];
    let last = 0;
    for (const m of template.matchAll(SLOT)) {
      if (m.index > last) segments.push({ text: template.slice(last, m.index) });
      segments.push({ text: m[0], slot: m[1] });
      if (!slots.includes(m[1]!)) slots.push(m[1]!);
      last = m.index + m[0].length;
    }
    if (last < template.length) segments.push({ text: template.slice(last) });
    return { slots, segments };
  }, [template]);
  const filled = (n: string) => !!(live[n] && live[n]!.trim());
  const preview = segments.map(s => (s.slot ? (filled(s.slot) ? live[s.slot] : s.text) : s.text)).join('');
  const missing = slots.filter(n => !filled(n));
  return {
    id, label, slots, live, missing, preview, runLabel, canRun: !!onRun && missing.length === 0, hasRun: !!onRun,
    set: (n: string, v: string) => setLive({ ...live, [n]: v }),
    segs: segments.map((s, i) => ({ key: i, text: s.slot ? (filled(s.slot) ? live[s.slot]! : s.slot) : s.text, slot: s.slot, filled: s.slot ? filled(s.slot) : undefined })),
    run: () => onRun?.(preview, live),
    textarea: { id: id + '-template', value: template, readOnly: readOnlyTemplate || !onTemplateChange, onChange: onTemplateChange ? (e: ChangeEvent<HTMLTextAreaElement>) => onTemplateChange(e.target.value) : undefined, rows: 3, spellCheck: false },
  };
}
