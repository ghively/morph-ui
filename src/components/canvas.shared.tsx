/**
 * Shared types + helpers for the Canvas/Artifact surface batch (2026-10).
 * Not exported from the package index; components re-export their prop types.
 */
import { useState } from 'react';

/* ── identity (same person → same colour everywhere) ─────────────────────── */
/** Up to two initials, ignoring parenthetical asides; matches agentOps initials. */
export const initials = (name: string) => {
  const words = (s: string) => s.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const core = words(name.replace(/\([^)]*\)|\[[^\]]*\]|\{[^}]*\}/g, ' '));
  return (core.length ? core : words(name)).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
};
/** Stable 1–6 slot for a person → `--series-N`. */
export const identityHue = (key: string) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 0x01000193);
  return ((h >>> 0) % 6) + 1;
};
export const hueVar = (n: number) => `var(--series-${Math.min(6, Math.max(1, Math.round(n)))})`;

/* ── time formatting ─────────────────────────────────────────────────────── */
export const fmtRel = (iso?: string, now?: string) => {
  if (!iso) return '';
  const t = new Date(iso).getTime(), n = now ? new Date(now).getTime() : Date.now();
  const d = n - t;
  if (isNaN(d)) return '';
  if (d < 0) return 'just now';
  const m = Math.round(d / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + 'm ago';
  const h = Math.round(m / 60);
  if (h < 24) return h + 'h ago';
  const days = Math.round(h / 24);
  if (days < 7) return days + 'd ago';
  return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' });
};
export const fmtClock = (iso?: string) =>
  iso ? new Date(iso).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' }) : '';

/* ── controlled / uncontrolled zoom ──────────────────────────────────────── */
export const clampZoom = (v: number, min = 0.25, max = 4) => Math.min(max, Math.max(min, v));
export const snapZoom = (v: number) => Math.round(v * 100) / 100;
/** Returns [zoom, setZoom] resolving the controlled prop over internal state. */
export function useZoom(zoom?: number, defaultZoom = 1, onChange?: (z: number) => void) {
  const [inner, setInner] = useState(defaultZoom);
  const value = zoom !== undefined ? zoom : inner;
  const set = (next: number) => {
    const z = snapZoom(clampZoom(next));
    if (z === value) return;
    if (zoom === undefined) setInner(z);
    onChange?.(z);
  };
  return [value, set] as const;
}

/* ── artifact kinds ──────────────────────────────────────────────────────── */
export type ArtifactKind = 'doc' | 'sheet' | 'code' | 'image' | 'board';
export const ARTIFACT_KIND_ICON: Record<ArtifactKind, string> = {
  doc: 'file',
  sheet: 'dashboard',
  code: 'edit',
  image: 'artifacts',
  board: 'workspace',
};
export const ARTIFACT_KIND_LABEL: Record<ArtifactKind, string> = {
  doc: 'Document',
  sheet: 'Sheet',
  code: 'Code',
  image: 'Image',
  board: 'Board',
};

/* ── collaborator presence model ─────────────────────────────────────────── */
export interface Collaborator {
  id: string;
  name: string;
  /** Cursor position in canvas content coordinates; omit when not on the canvas. */
  x?: number;
  y?: number;
  /** 1–6 series slot; derived from `id` when omitted. */
  hue?: number;
}

/* ── shared cursor/presence glyphs (pure SVG, currentColor) ──────────────── */
export function CursorGlyph({ color }: { color?: string }) {
  return (
    <svg viewBox="0 0 12 16" width="12" height="16" aria-hidden="true" focusable="false">
      <path d="M1 1l9 9h-4.6L1 15z" fill={color ?? 'var(--app-text)'} stroke="rgba(0,0,0,.35)" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

/** Small inline presence dot used by rails and clusters. */
export function Dot({ className = '' }: { className?: string }) {
  return <i className={className} aria-hidden="true" />;
}

export const activate = (fn?: () => void) => (e: { key: string; preventDefault(): void }) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn?.();
  }
};

