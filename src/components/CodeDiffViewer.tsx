import { useMemo } from 'react';
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
  lines: DiffLine[];
}

export interface CodeDiffViewerProps {
  diff?: string;
  hunks?: DiffHunk[];
  fileName?: string;
  wrap?: boolean;
  maxHeight?: string | number;
}

function parseUnifiedDiff(rawDiff: string): DiffHunk[] {
  const lines = rawDiff.split(/\r?\n/);
  const hunks: DiffHunk[] = [];
  let currentHunk: DiffHunk | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('@@ ')) {
      // @@ -oldStart,oldLines +newStart,newLines @@
      const match = line.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
      if (match) {
        currentHunk = {
          oldStart: parseInt(match[1], 10),
          oldLines: match[2] ? parseInt(match[2], 10) : 1,
          newStart: parseInt(match[3], 10),
          newLines: match[4] ? parseInt(match[4], 10) : 1,
          lines: []
        };
        hunks.push(currentHunk);
      }
      continue;
    }
    
    if (currentHunk) {
      if (line.startsWith('+')) {
        currentHunk.lines.push({ type: 'add', text: line.substring(1) });
      } else if (line.startsWith('-')) {
        currentHunk.lines.push({ type: 'del', text: line.substring(1) });
      } else if (line.startsWith(' ')) {
        currentHunk.lines.push({ type: 'ctx', text: line.substring(1) });
      } else if (line.startsWith('\\')) {
        currentHunk.lines.push({ type: 'meta', text: line });
      } else {
        // Stop parsing if we hit a non-hunk line after starting a hunk
        currentHunk = null;
      }
    }
  }
  
  if (hunks.length === 0) {
    throw new Error("Invalid diff format");
  }
  
  return hunks;
}

export function CodeDiffViewer({ diff, hunks: propHunks, fileName, wrap = false, maxHeight }: CodeDiffViewerProps) {
  const { parsedHunks, error } = useMemo(() => {
    if (propHunks) {
      return { parsedHunks: propHunks, error: null };
    }
    if (diff) {
      try {
        return { parsedHunks: parseUnifiedDiff(diff), error: null };
      } catch (err) {
        return { parsedHunks: null, error: err instanceof Error ? err.message : String(err) };
      }
    }
    return { parsedHunks: null, error: "No diff provided" };
  }, [diff, propHunks]);

  if (error || !parsedHunks) {
    return (
      <div className="cdv-container cdv-error" style={{ maxHeight }}>
        {fileName && <div className="cdv-header">{fileName}</div>}
        <div className="cdv-error-message">Error parsing diff: {error}</div>
      </div>
    );
  }

  return (
    <div className="cdv-container" style={{ maxHeight }}>
      {fileName && <div className="cdv-header">{fileName}</div>}
      <div className={`cdv-content ${wrap ? 'cdv-wrap' : ''}`}>
        {parsedHunks.map((hunk, hunkIdx) => {
          let oldLineNum = hunk.oldStart;
          let newLineNum = hunk.newStart;

          return (
            <div key={`hunk-${hunkIdx}`} className="cdv-hunk">
              <div className="cdv-hunk-header">
                @@ -{hunk.oldStart},{hunk.oldLines} +{hunk.newStart},{hunk.newLines} @@
              </div>
              <table className="cdv-table">
                <tbody>
                  {hunk.lines.map((line, lineIdx) => {
                    let oldDisplay = '';
                    let newDisplay = '';
                    
                    if (line.type === 'ctx') {
                      oldDisplay = String(oldLineNum++);
                      newDisplay = String(newLineNum++);
                    } else if (line.type === 'add') {
                      newDisplay = String(newLineNum++);
                    } else if (line.type === 'del') {
                      oldDisplay = String(oldLineNum++);
                    }
                    
                    return (
                      <tr key={`line-${hunkIdx}-${lineIdx}`} className={`cdv-row cdv-row-${line.type}`}>
                        <td className="cdv-line-num" data-testid="old-line-num">{oldDisplay}</td>
                        <td className="cdv-line-num" data-testid="new-line-num">{newDisplay}</td>
                        <td className="cdv-line-marker">
                          {line.type === 'add' ? '+' : line.type === 'del' ? '-' : line.type === 'ctx' ? ' ' : ''}
                        </td>
                        <td className="cdv-line-text">{line.text}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
