import { useState, useMemo } from 'react';
import './CodeDiffViewer.css';

export interface DiffLine {
  type: 'add' | 'del' | 'ctx' | 'meta';
  text: string;
}

export interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  /** Context text after the @@ range (usually the enclosing function). */
  header?: string;
  lines: DiffLine[];
}

export type CodeDiffView = 'unified' | 'split';

export interface CodeDiffViewerProps {
  diff?: string;
  hunks?: DiffHunk[];
  fileName?: string;
  wrap?: boolean;
  maxHeight?: string | number;
  /** Initial layout; the header toggle switches it. Defaults to split. */
  view?: CodeDiffView;
  /** Hide the unified/split toggle. */
  hideViewToggle?: boolean;
  className?: string;
}

interface NumberedLine extends DiffLine { o?: number; n?: number }

export function parseUnifiedDiff(raw: string): DiffHunk[] {
  const hunks: DiffHunk[] = [];
  let cur: DiffHunk | null = null;
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@ ?(.*)$/);
    if (m) {
      cur = { oldStart: +m[1], oldLines: m[2] ? +m[2] : 1, newStart: +m[3], newLines: m[4] ? +m[4] : 1, header: m[5] || undefined, lines: [] };
      hunks.push(cur);
      continue;
    }
    if (!cur) continue;
    if (line.startsWith('+')) cur.lines.push({ type: 'add', text: line.slice(1) });
    else if (line.startsWith('-')) cur.lines.push({ type: 'del', text: line.slice(1) });
    else if (line.startsWith(' ')) cur.lines.push({ type: 'ctx', text: line.slice(1) });
    else if (line.startsWith('\\')) cur.lines.push({ type: 'meta', text: line });
    else if (line !== '') cur = null;
  }
  if (!hunks.length) throw new Error('Invalid diff format');
  return hunks;
}

/** Pair del/add runs into side-by-side rows. */
function toSplit(lines: NumberedLine[]) {
  const rows: { l?: NumberedLine; r?: NumberedLine }[] = [];
  for (let i = 0; i < lines.length;) {
    const l = lines[i];
    if (l.type === 'ctx' || l.type === 'meta') { rows.push({ l, r: l }); i++; continue; }
    const dels: NumberedLine[] = [], adds: NumberedLine[] = [];
    while (lines[i]?.type === 'del') dels.push(lines[i++]);
    while (lines[i]?.type === 'add') adds.push(lines[i++]);
    for (let k = 0; k < Math.max(dels.length, adds.length); k++) rows.push({ l: dels[k], r: adds[k] });
  }
  return rows;
}

const MARK = { add: '+', del: '-', ctx: ' ', meta: '' };

export function CodeDiffViewer({ diff, hunks: propHunks, fileName, wrap = false, maxHeight, view: initialView = 'split', hideViewToggle = false, className = '' }: CodeDiffViewerProps) {
  const [view, setView] = useState<CodeDiffView>(initialView);
  const { hunks, error, add, del } = useMemo(() => {
    let parsed: DiffHunk[] | null = null, err: string | null = null;
    try { parsed = propHunks || (diff ? parseUnifiedDiff(diff) : null); if (!parsed) err = 'No diff provided'; }
    catch (e) { err = e instanceof Error ? e.message : String(e); }
    let a = 0, d = 0;
    const numbered = (parsed || []).map(h => {
      let o = h.oldStart, n = h.newStart;
      return {
        ...h,
        lines: h.lines.map((l): NumberedLine => {
          if (l.type === 'add') { a++; return { ...l, n: n++ }; }
          if (l.type === 'del') { d++; return { ...l, o: o++ }; }
          if (l.type === 'ctx') return { ...l, o: o++, n: n++ };
          return l;
        }),
      };
    });
    return { hunks: numbered, error: err, add: a, del: d };
  }, [diff, propHunks]);

  const slash = fileName ? fileName.lastIndexOf('/') : -1;
  const dir = fileName && slash >= 0 ? fileName.slice(0, slash + 1) : '';
  const base = fileName ? fileName.slice(slash + 1) : '';

  return (
    <div className={`cdv-container ${error ? 'cdv-error is-error' : ''} ${className}`.trim()}>
      {(fileName || !error) && (
        <div className="cdv-head">
          <span className="cdv-path">{dir && <span className="cdv-dir">{dir}</span>}<b className="cdv-header">{base || 'diff'}</b></span>
          {!error && <span className="cdv-stat"><em className="a">+{add}</em><em className="d">−{del}</em></span>}
          {!error && !hideViewToggle && (
            <span className="cdv-seg" role="radiogroup" aria-label="Diff layout">
              {(['unified', 'split'] as const).map(v => (
                <button key={v} type="button" role="radio" aria-checked={view === v} className={view === v ? 'is-on' : ''} onClick={() => setView(v)}>{v}</button>
              ))}
            </span>
          )}
        </div>
      )}
      {error ? (
        <div className="cdv-err cdv-error-message">Error parsing diff: {error}</div>
      ) : (
        <div className="cdv-scroll" style={{ maxHeight }}>
          {hunks.map((h, hi) => (
            <div key={hi} className="cdv-hunk">
              <div className="cdv-hh cdv-hunk-header">
                <span>@@ -{h.oldStart},{h.oldLines} +{h.newStart},{h.newLines} @@</span>
                {h.header && <em>{h.header}</em>}
              </div>
              {view === 'unified' ? (
                <div className={`cdv-grid is-uni ${wrap ? 'is-wrap cdv-wrap' : ''}`}>
                  {h.lines.map((l, li) => (
                    <div key={li} className={`cdv-ln cdv-row cdv-row-${l.type} is-${l.type}`}>
                      <span className="cdv-n cdv-line-num">{l.o ?? ''}</span>
                      <span className="cdv-n cdv-line-num">{l.n ?? ''}</span>
                      <span className="cdv-mk">{MARK[l.type]}</span>
                      <code>{l.text || ' '}</code>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`cdv-grid is-split ${wrap ? 'is-wrap cdv-wrap' : ''}`}>
                  {toSplit(h.lines).map((r, ri) => (
                    <div key={ri} className="cdv-pair">
                      <div className={`cdv-ln ${r.l ? `cdv-row-${r.l.type} is-${r.l.type}` : 'is-void'}`}>
                        <span className="cdv-n">{r.l?.o ?? ''}</span><span className="cdv-mk">{r.l ? MARK[r.l.type] : ''}</span><code>{r.l?.text ?? ''}</code>
                      </div>
                      <div className={`cdv-ln ${r.r ? `cdv-row-${r.r.type} is-${r.r.type}` : 'is-void'}`}>
                        <span className="cdv-n">{r.r?.n ?? ''}</span><span className="cdv-mk">{r.r ? MARK[r.r.type] : ''}</span><code>{r.r?.text ?? ''}</code>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
