import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import './CodeDiffViewer.css';

export interface CodeDiffViewerProps {
  diff: string;
  filename?: string;
  defaultViewMode?: 'unified' | 'split';
  className?: string;
}

type LineType = 'added' | 'deleted' | 'context';

interface ParsedLine {
  type: LineType;
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

interface Hunk {
  header: string;
  lines: ParsedLine[];
  collapsed: boolean;
}

const MAX_LINES = 2000;

export function CodeDiffViewer({
  diff,
  filename,
  defaultViewMode = 'unified',
  className = '',
}: CodeDiffViewerProps) {
  const [viewMode, setViewMode] = useState<'unified' | 'split'>(defaultViewMode);
  const [hunks, setHunks] = useState<Hunk[]>([]);
  const [isBinary, setIsBinary] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  
  const hunkRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Simple diff parser
  useEffect(() => {
    if (!diff) {
      setHunks([]);
      return;
    }

    if (diff.includes('Binary files') && diff.includes('differ')) {
      setIsBinary(true);
      return;
    }
    
    const lines = diff.split('\n');
    let currentHunk: Hunk | null = null;
    const parsedHunks: Hunk[] = [];
    
    let oldLine = 0;
    let newLine = 0;
    
    let lineCount = 0;
    let truncated = false;

    // Skip git diff headers if present
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (line !== undefined && (line.startsWith('diff ') || line.startsWith('index ') || line.startsWith('--- ') || line.startsWith('+++ '))) {
        i++;
      } else {
        break;
      }
    }

    for (; i < lines.length; i++) {
      const line = lines[i];
      if (line === undefined) continue;
      
      if (lineCount >= MAX_LINES) {
        truncated = true;
        break;
      }

      if (line.startsWith('@@')) {
        if (currentHunk) {
          parsedHunks.push(currentHunk);
        }
        
        // Parse line numbers: @@ -oldStart,oldCount +newStart,newCount @@
        const match = line.match(/@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
        if (match && match[1] !== undefined && match[2] !== undefined) {
          oldLine = parseInt(match[1], 10);
          newLine = parseInt(match[2], 10);
        }
        
        currentHunk = {
          header: line,
          lines: [],
          collapsed: false
        };
      } else if (currentHunk) {
        let type: LineType = 'context';
        let content = line;
        
        if (line.startsWith('+')) {
          type = 'added';
          content = line.substring(1);
          currentHunk.lines.push({ type, content, newLineNumber: newLine++ });
          lineCount++;
        } else if (line.startsWith('-')) {
          type = 'deleted';
          content = line.substring(1);
          currentHunk.lines.push({ type, content, oldLineNumber: oldLine++ });
          lineCount++;
        } else if (line.startsWith(' ')) {
          type = 'context';
          content = line.substring(1);
          currentHunk.lines.push({ type, content, oldLineNumber: oldLine++, newLineNumber: newLine++ });
          lineCount++;
        } else if (line === '\\ No newline at end of file') {
           // Ignore
        } else {
          // Assume context if no prefix but inside hunk
           currentHunk.lines.push({ type: 'context', content: line, oldLineNumber: oldLine++, newLineNumber: newLine++ });
           lineCount++;
        }
      }
    }
    
    if (currentHunk) {
      parsedHunks.push(currentHunk);
    }
    
    setHunks(parsedHunks);
    setIsTruncated(truncated);
  }, [diff]);

  const toggleCollapse = (index: number) => {
    setHunks(prev => {
      const newHunks = [...prev];
      const hunk = newHunks[index];
      if (hunk !== undefined) {
        newHunks[index] = { ...hunk, collapsed: !hunk.collapsed };
      }
      return newHunks;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const handleCopyDiff = () => {
    copyToClipboard(diff);
  };

  const handleCopyHunk = (hunk: Hunk) => {
    const text = hunk.lines.map(l => {
      if (l.type === 'added') return '+' + l.content;
      if (l.type === 'deleted') return '-' + l.content;
      return ' ' + l.content;
    }).join('\n');
    copyToClipboard(text);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'j' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = index + 1;
      if (next < hunks.length && hunkRefs.current[next]) {
        hunkRefs.current[next]?.focus();
      }
    } else if (e.key === 'k' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = index - 1;
      if (prev >= 0 && hunkRefs.current[prev]) {
        hunkRefs.current[prev]?.focus();
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleCollapse(index);
    }
  };

  if (isBinary) {
    return (
      <div className={`code-diff-viewer ${className}`}>
        {filename && (
          <div className="code-diff-header">
            <span className="code-diff-filename">{filename}</span>
          </div>
        )}
        <div className="code-diff-binary">
          Binary file changed.
        </div>
      </div>
    );
  }

  if (hunks.length === 0) {
    return (
      <div className={`code-diff-viewer ${className}`}>
        {filename && (
          <div className="code-diff-header">
            <span className="code-diff-filename">{filename}</span>
          </div>
        )}
        <div className="code-diff-notice">
          No changes.
        </div>
      </div>
    );
  }

  return (
    <div className={`code-diff-viewer ${className}`}>
      <div className="code-diff-header">
        <span className="code-diff-filename">{filename || 'Changes'}</span>
        <div className="code-diff-actions">
          <button onClick={() => setViewMode(prev => prev === 'unified' ? 'split' : 'unified')}>
            {viewMode === 'unified' ? 'Split View' : 'Unified View'}
          </button>
          <button onClick={handleCopyDiff} aria-label="Copy full diff">
            Copy
          </button>
        </div>
      </div>

      <div className="code-diff-content">
        <div className={`code-diff-table code-diff-table-${viewMode}`}>
          {hunks.map((hunk, hIdx) => (
            <div 
              key={hIdx} 
              className="code-diff-hunk-group" 
              tabIndex={0}
              ref={el => { hunkRefs.current[hIdx] = el; }}
              onKeyDown={(e) => handleKeyDown(e, hIdx)}
            >
              <div className="code-diff-hunk-header">
                <span onClick={() => toggleCollapse(hIdx)} style={{cursor: 'pointer'}}>
                  {hunk.collapsed ? '▶ ' : '▼ '}{hunk.header}
                </span>
                <button 
                  className="code-diff-hunk-header-button"
                  onClick={() => handleCopyHunk(hunk)}
                  aria-label="Copy hunk"
                  tabIndex={-1}
                >
                  Copy
                </button>
              </div>
              
              {!hunk.collapsed && viewMode === 'unified' && (
                <div>
                  {hunk.lines.map((line, lIdx) => (
                    <div key={lIdx} className={`code-diff-row code-diff-line-${line.type}`}>
                      <div className="code-diff-line-number">{line.oldLineNumber || ''}</div>
                      <div className="code-diff-line-number">{line.newLineNumber || ''}</div>
                      <div className="code-diff-text">
                        {line.type === 'added' ? '+' : line.type === 'deleted' ? '-' : ' '}
                        {line.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!hunk.collapsed && viewMode === 'split' && (
                <div>
                  {hunk.lines.map((line, lIdx) => {
                    // Simplistic split view alignment
                    if (line.type === 'context') {
                      return (
                        <div key={lIdx} className="code-diff-row code-diff-line-context">
                          <div className="code-diff-side">
                            <div className="code-diff-line-number">{line.oldLineNumber}</div>
                            <div className="code-diff-text"> {line.content}</div>
                          </div>
                          <div className="code-diff-side">
                            <div className="code-diff-line-number">{line.newLineNumber}</div>
                            <div className="code-diff-text"> {line.content}</div>
                          </div>
                        </div>
                      );
                    } else if (line.type === 'deleted') {
                      return (
                        <div key={lIdx} className="code-diff-row">
                          <div className="code-diff-side code-diff-line-deleted">
                            <div className="code-diff-line-number">{line.oldLineNumber}</div>
                            <div className="code-diff-text">-{line.content}</div>
                          </div>
                          <div className="code-diff-side code-diff-side-empty">
                            <div className="code-diff-line-number"></div>
                            <div className="code-diff-text"></div>
                          </div>
                        </div>
                      );
                    } else if (line.type === 'added') {
                       return (
                        <div key={lIdx} className="code-diff-row">
                          <div className="code-diff-side code-diff-side-empty">
                            <div className="code-diff-line-number"></div>
                            <div className="code-diff-text"></div>
                          </div>
                          <div className="code-diff-side code-diff-line-added">
                            <div className="code-diff-line-number">{line.newLineNumber}</div>
                            <div className="code-diff-text">+{line.content}</div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {isTruncated && (
        <div className="code-diff-notice">
          Diff truncated: showing first {MAX_LINES} lines.
        </div>
      )}
    </div>
  );
}
