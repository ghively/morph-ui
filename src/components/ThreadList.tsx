import './ThreadList.css';
import type { ReactNode } from 'react';

export interface ThreadSummary {
  id: string;
  /** Root-message preview; falls back to 'Thread' when empty. */
  title: string;
  replyCount: number;
  lastSenderName?: string;
  lastTs?: number;
  unread?: number;
  /** Mention count — outranks `unread`. */
  highlight?: number;
}

export interface ThreadListProps {
  threads: ThreadSummary[];
  /** Currently-open thread, or null for the main timeline. */
  activeId?: string | null;
  onSelect: (id: string) => void;
  /** The "main timeline" row. */
  onSelectMain: () => void;
  mainLabel?: string;                 // default 'Main timeline'
  /** Promote a thread into the primary pane. Omit to hide the action. */
  onPromote?: (id: string) => void;
  /** Accessible name. */
  label: string;
  /** Pre-formatted relative time per thread; falls back to formatRelative(lastTs). */
  formatTime?: (ts: number | undefined) => string;
  /** Shown when there are no threads. */
  emptyMessage?: ReactNode;
  className?: string;
}

export function ThreadList({
  threads,
  activeId,
  onSelect,
  onSelectMain,
  mainLabel = 'Main timeline',
  onPromote,
  label,
  formatTime,
  emptyMessage = 'Start a thread from any message — agents answer inside it.',
  className,
}: ThreadListProps) {
  const defaultFormatTime = (ts?: number) => {
    if (!ts) return '';
    // Basic fallback if host doesn't provide formatTime
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const timeFormatter = formatTime || defaultFormatTime;

  return (
    <div className={className} data-rows="" role="list" aria-label={label} style={{ display: "flex", flexDirection: "column" }}>
      {/* Main timeline row */}
      <div style={{ padding: "0 var(--s3)", marginTop: "var(--s3)" }} role="listitem">
        <div data-threadrow="" data-on={String(!activeId)}>
          <button 
            data-state="" 
            aria-current={!activeId ? "page" : undefined}
            onClick={onSelectMain}
          >
            {mainLabel}
          </button>
        </div>
      </div>

      {/* Count eyebrow */}
      <div data-eyebrow="" style={{ margin: "var(--s5) var(--s5) var(--s2)" }}>
        {threads.length} thread{threads.length === 1 ? "" : "s"}
      </div>

      {/* Threads */}
      {threads.length === 0 ? (
        <div data-meta="" style={{ padding: "var(--s2) var(--s5)" }}>
          {emptyMessage}
        </div>
      ) : (
        threads.map((thread) => {
          const active = thread.id === activeId;
          const displayTitle = thread.title || 'Thread';
          
          return (
            <div key={thread.id} data-threadrow="" data-on={String(active)} data-threadlink="" role="listitem" style={{ position: "relative" }}>
              <button 
                data-state="" 
                aria-current={active ? "page" : undefined}
                title={displayTitle}
                onClick={() => onSelect(thread.id)}
              >
                <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {displayTitle}
                </span>
                <span data-meta="" style={{ display: "block", fontWeight: 400 }}>
                  {thread.replyCount} repl{thread.replyCount === 1 ? "y" : "ies"}
                  {thread.lastSenderName ? ` · ${thread.lastSenderName}` : ''}
                  {timeFormatter(thread.lastTs) ? ` · ${timeFormatter(thread.lastTs)}` : ''}
                </span>
              </button>
                
              {/* Badges and Actions wrapper for right alignment - Rendered OUTSIDE the button to avoid nested buttons */}
              <div style={{ position: "absolute", right: "var(--s2)", top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: "var(--s2)", pointerEvents: "none" }}>
                  {(thread.highlight || 0) > 0 ? (
                    <span data-count="" data-tone="danger" aria-label={`${thread.highlight} mentions`}>@{thread.highlight}</span>
                  ) : (thread.unread || 0) > 0 ? (
                    <span data-dot="" data-live="" aria-label="Unread replies" style={{ width: 7, height: 7, marginRight: 8 }} />
                  ) : null}

                  {onPromote && (
                    <span data-threadacts="" style={{ pointerEvents: "auto" }}>
                      <button 
                        data-iconbtn="" 
                        title="Open in main pane" 
                        aria-label="Open this thread in the main pane"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent row selection
                          onPromote(thread.id);
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M8 3 4 7l4 4" />
                          <path d="M4 7h16" />
                          <path d="m16 21 4-4-4-4" />
                          <path d="M20 17H4" />
                        </svg>
                      </button>
                    </span>
                  )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
