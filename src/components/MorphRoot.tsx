import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import './MorphRoot.css';

export interface MorphRootProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Fill the viewport (min-height: 100vh). Use on the outermost app root. */
  fill?: boolean;
  /** Inner padding in px. Defaults to 0 so app shells can run edge to edge. */
  padding?: number;
  /** Base-token overrides applied on this frame, e.g. `{ '--app-blue': '#7c5cff' }`. */
  tokens?: Record<`--${string}`, string | number>;
  className?: string;
  style?: CSSProperties;
}

/**
 * The required root for every Morph UI surface. It applies the frame layer
 * (`.morph-frame`): dark surface, ink, type, and the `[data-btn]`/`[data-chip]`/…
 * primitive styles that components rely on. Without it, components render
 * unstyled on the browser default surface. Put it once around the whole app.
 */
export function MorphRoot({ children, fill = false, padding = 0, tokens, className = '', style, ...rest }: MorphRootProps) {
  return (
    <div
      {...rest}
      className={('morph-frame ' + className).trim()}
      data-morph-frame=""
      data-fill={fill ? '' : undefined}
      style={{ ...(tokens as CSSProperties), ...(padding ? { padding } : {}), ...style }}
    >
      {children}
    </div>
  );
}
