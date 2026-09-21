import { createElement } from 'react';
import type { ReactElement } from 'react';
import './GlyphIcon.css';

export type GlyphName =
  | 'plus' | 'chats' | 'notes' | 'workspace' | 'agents' | 'dashboard' | 'search' | 'theme'
  | 'close' | 'pin' | 'split' | 'threads' | 'artifacts' | 'share' | 'swap'
  | 'chevronLeft' | 'chevronDown' | 'trash' | 'send' | 'attach' | 'reply' | 'thread'
  | 'edit' | 'react' | 'copy' | 'lock' | 'file' | 'bookmark' | 'link' | 'people'
  | 'back' | 'more' | 'settings' | 'bell' | 'shield';

export interface GlyphIconProps {
  name: GlyphName;
  /** Defaults to the per-glyph size the source set. */
  size?: number;
  className?: string;
}

// Wrapper for creating standardized icons matching source behavior
const S = (
  sizeOverride: number | undefined,
  defaultSize: number,
  sw: number,
  d: string,
  cap: boolean,
  extra: ReactElement | null = null
) => {
  const s = sizeOverride ?? defaultSize;
  const props: Record<string, any> = {
    width: s,
    height: s,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: sw,
    "aria-hidden": "true",
    focusable: "false"
  };
  
  if (cap) {
    props.strokeLinecap = "round";
    props.strokeLinejoin = "round";
  }

  return createElement("svg", props, createElement("path", { d }), extra);
};

export const glyphs: Record<GlyphName, (size?: number) => ReactElement> = {
  plus: (s) => S(s, 16, 1.9, "M8 3v10M3 8h10", true),
  chats: (s) => S(s, 16, 1.55, "M2 4h12v9a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM4 1v3M12 1v3M5 8h6M5 11h3", true),
  notes: (s) => S(s, 16, 1.55, "M3 3a1 1 0 011-1h6l4 4v9a1 1 0 01-1 1H4a1 1 0 01-1-1V3zM9 2v5h5", true),
  workspace: (s) => S(s, 16, 1.55, "M2 6h12v7a1 1 0 01-1 1H3a1 1 0 01-1-1V6zM4 6V4a1 1 0 011-1h6a1 1 0 011 1v2M8 10v.01", true),
  agents: (s) => S(s, 16, 1.55, "M8 2a3 3 0 013 3v2H5V5a3 3 0 013-3zM2 9a2 2 0 012-2h8a2 2 0 012 2v3a2 2 0 01-2 2H4a2 2 0 01-2-2V9zM5 11v.01M11 11v.01", true),
  dashboard: (s) => S(s, 16, 1.55, "M2 3a1 1 0 011-1h4v6H2V3zM9 2h4a1 1 0 011 1v3H9V2zM2 10h6v4H3a1 1 0 01-1-1v-3zM10 7h4v6a1 1 0 01-1 1h-3V7z", true),
  search: (s) => S(s, 16, 1.55, "M7 12A5 5 0 107 2a5 5 0 000 10z", false, createElement("path", { d: "m10.5 10.5 4 4", strokeLinecap: "round" })),
  theme: (s) => S(s, 16, 1.55, "M8 14A6 6 0 108 2a6 6 0 000 12zM8 2v12", true),
  close: (s) => S(s, 14, 1.8, "M3 3l10 10M13 3L3 13", true),
  pin: (s) => S(s, 15, 1.6, "M8 11v4M5.5 11h5M7 3l1-1 1 1v4l2 3H5l2-3V3z", true),
  split: (s) => S(s, 16, 1.55, "M2 3a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3zM8 2v12", true),
  threads: (s) => S(s, 16, 1.55, "M4 3h8M4 7h8M4 11h5M12 11l2-2M12 11l2 2M10 3v11", true),
  artifacts: (s) => S(s, 16, 1.55, "M8 2L3 5l5 3 5-3-5-3zM3 8l5 3 5-3M3 11l5 3 5-3", true),
  share: (s) => S(s, 16, 1.55, "M8 2v10M4 6l4-4 4 4M2 14h12", true),
  swap: (s) => S(s, 16, 1.55, "M4 11h10M11 8l3 3-3 3M12 5H2M5 2L2 5l3 3", true),
  chevronLeft: (s) => S(s, 12, 2, "M10 2L4 8l6 6", true),
  chevronDown: (s) => S(s, 12, 1.9, "M2 5l6 6 6-6", true),
  trash: (s) => S(s, 12, 1.7, "M2 4h12M5 4V2a1 1 0 011-1h4a1 1 0 011 1v2M4 4v9a1 1 0 001 1h6a1 1 0 001-1V4M7 7v4M9 7v4", true),
  send: (s) => S(s, 16, 1.55, "M2 8l12-6-6 12L7 9 2 8zM7 9l5-5", true),
  attach: (s) => S(s, 16, 1.55, "M14.5 7.5l-6.2 6.2a3.535 3.535 0 11-5-5l6.2-6.2a2.121 2.121 0 113 3l-6.2 6.2a.707.707 0 11-1-1l6.2-6.2", true),
  reply: (s) => S(s, 16, 1.55, "M5 7L2 4l3-3M2 4h8a4 4 0 014 4v7", true),
  thread: (s) => S(s, 16, 1.55, "M4 2v11a1 1 0 001 1h9M11 11l3 3-3 3", true),
  edit: (s) => S(s, 16, 1.55, "M10 2l4 4-9 9H2v-3l8-10zM8 4l4 4", true),
  react: (s) => S(s, 16, 1.55, "M8 15A7 7 0 108 1a7 7 0 000 14zM5.5 6v.01M10.5 6v.01M5.5 10a3 3 0 005 0", true),
  copy: (s) => S(s, 16, 1.55, "M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h9a1 1 0 001-1V8M6 2v4h4M6 2l4 4", true),
  lock: (s) => S(s, 12, 1.7, "M4 6V4a2 2 0 114 0v2M2 6h8a1 1 0 011 1v4a1 1 0 01-1 1H2a1 1 0 01-1-1V7a1 1 0 011-1z", true),
  file: (s) => S(s, 16, 1.55, "M3 2a1 1 0 011-1h5l4 4v9a1 1 0 01-1 1H4a1 1 0 01-1-1V2zM8 1v5h5", true),
  bookmark: (s) => S(s, 16, 1.55, "M3 2a1 1 0 011-1h8a1 1 0 011 1v13l-5-3-5 3V2z", true),
  link: (s) => S(s, 16, 1.55, "M7 11H5a3 3 0 110-6h2M9 5h2a3 3 0 110 6H9M5 8h6", true),
  people: (s) => S(s, 16, 1.55, "M10 5a2 2 0 11-4 0 2 2 0 014 0zM3 14v-1a3 3 0 013-3h4a3 3 0 013 3v1M12 5a2 2 0 110-4 2 2 0 010 4zM11 9a3 3 0 013 3v2", true),
  back: (s) => S(s, 16, 1.55, "M7 2L2 7l5 5M2 7h12", true),
  more: (s) => S(s, 16, 2.2, "M4 8v.01M8 8v.01M12 8v.01", true),
  settings: (s) => S(s, 16, 1.55, "M8 10a2 2 0 100-4 2 2 0 000 4z", false, createElement("path", { d: "M8 2v1.5M8 12.5V14M3.76 3.76l1.06 1.06M11.18 11.18l1.06 1.06M2 8h1.5M12.5 8H14M3.76 12.24l1.06-1.06M11.18 4.82l1.06-1.06", strokeLinecap: "round" })),
  bell: (s) => S(s, 16, 1.55, "M12 11v-4a4 4 0 00-8 0v4l-2 2v1h12v-1l-2-2zM6 14h4a2 2 0 01-4 0z", true),
  shield: (s) => S(s, 16, 1.55, "M8 1l6 3v4.5c0 3.5-2.5 6.5-6 7.5-3.5-1-6-4-6-7.5V4l6-3zM8 1v15", true),
};

export function GlyphIcon({ name, size, className = '' }: GlyphIconProps) {
  const iconThunk = glyphs[name];
  if (!iconThunk) return null; // Safe fallback in case of invalid name passed (if not TS checked)
  const iconElement = iconThunk(size);
  
  if (className) {
      const elementProps = (iconElement as any).props || {};
      const newClassName = `${elementProps.className || ''} ${className}`.trim();
      const children = (iconElement as any).props?.children;
      return createElement("svg", { ...(elementProps), className: newClassName }, children);
  }

  return iconElement;
}
