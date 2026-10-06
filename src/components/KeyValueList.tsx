import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { toTone, type ToneInput } from '../tone';
import './KeyValueList.css';

/** One key → value pair. */
export interface KeyValueItem {
  /** Stable key; falls back to the row index. */
  id?: string;
  /** The key, rendered in the `<dt>`. */
  label: ReactNode;
  /** The value, rendered in the `<dd>`. */
  value: ReactNode;
  /** Secondary note under the value (units, source, last-changed…). */
  hint?: ReactNode;
  /** Colours the value through a local `--c`; aliases (ok, warning, error…) are normalized. */
  tone?: ToneInput;
  /** Render the value in the mono face with tabular numerals (ids, hashes, versions, IPs). */
  mono?: boolean;
  /** When set, a copy button writes this string to the clipboard. */
  copyable?: string;
}

export type KeyValueLayout = 'stacked' | 'inline' | 'grid';

export interface KeyValueListProps {
  /** The pairs to render, in order. */
  items: KeyValueItem[];
  /** `inline` (default): label left, value right. `stacked`: label above value. `grid`: responsive cards of pairs. */
  layout?: KeyValueLayout;
  /** Preferred column count for `grid`; columns still collapse on narrow containers. Default 3. */
  columns?: number;
  /** Tighter row padding and smaller type. */
  dense?: boolean;
  /** Hairline between rows. Defaults to true for `inline`, false otherwise. */
  dividers?: boolean;
  /** Accessible name for the list; also rendered as a visible caption unless `hideLabel`. */
  label?: ReactNode;
  /** Keep `label` as the accessible name only, without the visible caption. */
  hideLabel?: boolean;
  /** Shown instead of the list when `items` is empty. Default "Nothing to show." */
  empty?: ReactNode;
  /** Extra class on the root. */
  className?: string;
}

const COPIED_MS = 1400;

const plain = (n: ReactNode): string | undefined =>
  typeof n === 'string' || typeof n === 'number' ? String(n) : undefined;

function CopyGlyph({ done }: { done: boolean }) {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" focusable="false">
      {done ? (
        <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <>
          <rect x="5.5" y="5.5" width="8" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10.5 3.5v-.5a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </>
      )}
    </svg>
  );
}

/**
 * KeyValueList — a description list of key → value pairs for detail panes,
 * settings summaries and metadata blocks. Renders a real `<dl>` with one
 * `<div>` per row wrapping its `<dt>` and `<dd>`. Values can be toned, set in
 * mono with tabular numerals, and copied to the clipboard with a transient
 * "Copied" confirmation. Three layouts: inline rows, stacked label-over-value,
 * and a responsive grid of pair cards.
 *
 * Provenance: original morph-ui design (2026-10).
 */
export function KeyValueList({
  items,
  layout = 'inline',
  columns = 3,
  dense = false,
  dividers,
  label,
  hideLabel = false,
  empty = 'Nothing to show.',
  className = '',
}: KeyValueListProps) {
  const captionId = useId();
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const showDividers = dividers ?? layout === 'inline';
  const labelText = plain(label);
  const visibleCaption = label != null && label !== false && !hideLabel;

  const copy = (key: string, text: string) => {
    const clip = typeof navigator !== 'undefined' ? navigator.clipboard : undefined;
    if (!clip?.writeText) return;
    const done = () => {
      setCopied(key);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(null), COPIED_MS);
    };
    try {
      void Promise.resolve(clip.writeText(text)).then(done, () => {});
    } catch {
      /* clipboard refused synchronously; leave the button idle */
    }
  };

  const style = layout === 'grid' ? ({ '--kv-cols': Math.max(1, Math.round(columns)) } as CSSProperties) : undefined;

  return (
    <div
      className={`kvlist ${className}`.trim()}
      data-kvlist=""
      data-layout={layout}
      data-dense={dense ? '' : undefined}
      data-dividers={showDividers ? '' : undefined}
      style={style}
    >
      {visibleCaption && (
        <div className="kvlist-caption" id={captionId}>
          {label}
        </div>
      )}
      {items.length === 0 ? (
        <div className="kvlist-empty" data-kvempty="">
          {empty}
        </div>
      ) : (
        <dl
          className="kvlist-dl"
          aria-labelledby={visibleCaption ? captionId : undefined}
          aria-label={!visibleCaption ? labelText : undefined}
        >
          {items.map((item, i) => {
            const key = item.id ?? String(i);
            const tone = item.tone ? toTone(item.tone) : undefined;
            const isCopied = copied === key;
            const name = plain(item.label) ?? plain(item.value) ?? item.copyable;
            return (
              <div key={key} className="kvlist-row" data-kvrow="" data-tone={tone}>
                <dt className="kvlist-key">{item.label}</dt>
                <dd className="kvlist-val">
                  <span className="kvlist-main">
                    <span className="kvlist-text" data-mono={item.mono ? '' : undefined}>
                      {item.value}
                    </span>
                    {item.copyable != null && (
                      <button
                        type="button"
                        className="kvlist-copy"
                        data-copied={isCopied ? '' : undefined}
                        aria-label={`Copy ${name}`}
                        title={isCopied ? 'Copied' : 'Copy'}
                        onClick={() => copy(key, item.copyable as string)}
                      >
                        <CopyGlyph done={isCopied} />
                        {isCopied && <span className="kvlist-copied">Copied</span>}
                      </button>
                    )}
                  </span>
                  {item.hint != null && <span className="kvlist-hint">{item.hint}</span>}
                </dd>
              </div>
            );
          })}
        </dl>
      )}
    </div>
  );
}
