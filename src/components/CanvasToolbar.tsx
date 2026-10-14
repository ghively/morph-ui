import './CanvasToolbar.css';
import { useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { activate } from './canvas.shared';

export type CanvasTool = 'select' | 'pan' | 'pen' | 'eraser' | 'comment';

export interface CanvasToolbarProps {
  /** Currently active tool; omit for an uncontrolled toolbar. */
  tool?: CanvasTool;
  defaultTool?: CanvasTool;
  onToolChange?: (tool: CanvasTool) => void;
  /** Which canvas edge the toolbar floats along. */
  dock?: 'left' | 'right' | 'center';
  /** Restrict the offered tools. Defaults to all five. */
  tools?: CanvasTool[];
  className?: string;
}

const TOOL_META: Record<CanvasTool, { label: string; glyph: string; key: string }> = {
  select: { label: 'Select', glyph: 'M1 1l6 14 2.2-5.8L15 7z', key: 'V' },
  pan: { label: 'Pan', glyph: 'M8 14V2M8 2L4.5 5.5M8 2l3.5 3.5M2 8a6 6 0 0012 0', key: 'H' },
  pen: { label: 'Pen', glyph: 'M10.5 1.5l4 4-8.5 8.5L1 15l1-5z', key: 'P' },
  eraser: { label: 'Eraser', glyph: 'M6 14h9M5.5 13.5L1.5 9.5a1.4 1.4 0 010-2l5-5a1.4 1.4 0 012 0l4 4a1.4 1.4 0 010 2l-5 5a1.4 1.4 0 01-2 0z', key: 'E' },
  comment: { label: 'Comment', glyph: 'M2 3a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H8l-3 3v-3H3a1 1 0 01-1-1z', key: 'C' },
};

/**
 * Floating glass toolbar for canvas tools (select / pan / pen / eraser /
 * comment). Dock on the left or right edge (vertical stack) or center-bottom
 * (horizontal row). One tool is active at a time; the toolbar is a real
 * `role="toolbar"` with roving tabindex and arrow-key navigation.
 */
export function CanvasToolbar({ tool, defaultTool = 'select', onToolChange, dock = 'center', tools, className = '' }: CanvasToolbarProps) {
  const order: CanvasTool[] = tools ?? ['select', 'pan', 'pen', 'eraser', 'comment'];
  const list = order.filter((t) => t in TOOL_META);
  const [inner, setInner] = useState<CanvasTool>(defaultTool);
  const active = tool !== undefined ? tool : inner;
  const pick = (t: CanvasTool) => {
    if (tool === undefined) setInner(t);
    onToolChange?.(t);
  };
  const activeIndex = Math.max(0, list.indexOf(active));
  const onKeyDown = (e: ReactKeyboardEvent) => {
    const forward = dock === 'center' ? 'ArrowRight' : 'ArrowDown';
    const back = dock === 'center' ? 'ArrowLeft' : 'ArrowUp';
    if (e.key === forward || e.key === back) {
      e.preventDefault();
      const next = (activeIndex + (e.key === forward ? 1 : -1) + list.length) % list.length;
      pick(list[next]);
      const btn = containerRef.current?.querySelector<HTMLButtonElement>(`[data-tool="${list[next]}"]`);
      btn?.focus();
    }
  };
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={containerRef}
      className={`cv-toolbar ${dock === 'left' ? 'cv-toolbar-left' : dock === 'right' ? 'cv-toolbar-right' : 'cv-toolbar-center'} ${className}`}
      data-canvas-toolbar=""
      data-dock={dock}
      role="toolbar"
      aria-label="Canvas tools"
      onKeyDown={onKeyDown}
    >
      {list.map((t, i) => {
        const meta = TOOL_META[t];
        const on = t === active;
        return (
          <button
            key={t}
            type="button"
            className="cv-tool-btn"
            data-tool={t}
            data-active={on ? 'true' : 'false'}
            tabIndex={i === activeIndex ? 0 : -1}
            aria-pressed={on}
            onClick={() => pick(t)}
            title={`${meta.label} (${meta.key})`}
            aria-label={`${meta.label} tool`}
          >
            <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d={meta.glyph} />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

/** Keyboard activation helper re-export (internal parity with other groups). */
export const toolbarActivate = activate;
