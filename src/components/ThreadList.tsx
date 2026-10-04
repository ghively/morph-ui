import './ThreadList.css';
import { CountBadge, Ico, I, defaultThreadTime, threadMeta, plural, type ThreadListProps } from './chatmsg.shared';

export function ThreadList({
  threads, activeId, onSelect, onSelectMain, mainLabel = 'Main timeline', onPromote, label, formatTime = defaultThreadTime,
  emptyMessage = 'Start a thread from any message — agents answer inside it.', className = '',
}: ThreadListProps) {
  return (
    <div className={'threads ' + className} data-rows="" role="list" aria-label={label}>
      <div className="threads-main" role="listitem">
        <div className="threads-row" data-threadrow="" data-on={String(!activeId)}>
          <button type="button" className="threads-btn" data-state="" aria-current={!activeId ? 'page' : undefined} onClick={onSelectMain}>{mainLabel}</button>
        </div>
      </div>
      <div className="threads-eyebrow" data-threadeyebrow="">{plural(threads.length, 'thread', 'threads')}</div>
      {!threads.length && <div className="threads-empty" data-threadmeta="">{emptyMessage}</div>}
      {threads.map(t => {
        const active = t.id === activeId, title = t.title || 'Thread';
        return (
          <div key={t.id} className="threads-row" data-threadrow="" data-threadlink="" data-on={String(active)} role="listitem">
            <button type="button" className="threads-btn" data-state="" aria-current={active ? 'page' : undefined} title={title} onClick={() => onSelect(t.id)}>
              <span className="threads-title">{title}</span>
              <span className="threads-meta" data-threadmeta="">{threadMeta(t, formatTime)}</span>
            </button>
            <div className="threads-side">
              <CountBadge highlight={t.highlight} unread={t.unread} dot />
              {onPromote && (
                <span className="threads-acts" data-threadacts="">
                  <button type="button" className="cm-iconbtn" data-iconbtn="" title="Open in main pane" aria-label="Open this thread in the main pane" onClick={e => { e.stopPropagation(); onPromote(t.id); }}>
                    <Ico d={I.swap} size={13} />
                  </button>
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export type { ThreadSummary, ThreadListProps } from './chatmsg.shared';
