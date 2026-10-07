import './MessageTimeline.css';
import { Fragment, type ReactNode } from 'react';
import { MessageTile } from './MessageTile';
import { useTimeline, type MessageTimelineProps, type TimelineMessage } from './chatmsg.shared';

export function MessageTimeline(props: MessageTimelineProps) {
  const t = useTimeline(props);
  const { label, highlightId, inThread = false, actions, renderBody, renderMessage, className = '' } = props;
  const row = (key: string, m: TimelineMessage, tile: ReactNode) =>
    renderMessage ? <Fragment key={key}>{renderMessage(m, tile)}</Fragment> : tile;
  return (
    <div ref={t.scroller} className={'timeline ' + className} data-scroller="" onScroll={t.onScroll} tabIndex={0}>
      <div className="timeline-list" data-turnlist="" role="log" aria-label={label} aria-live="off">
        <div className="timeline-head">
          {t.done
            ? <span className="timeline-begin" data-meta="">Beginning of {inThread ? 'thread' : 'history'}</span>
            : <button type="button" className="timeline-more" data-btn="text" data-state="" data-busy={String(t.loading)} onClick={() => void t.loadOlder()}>Load earlier<i data-spin="" aria-hidden="true" /></button>}
        </div>
        {t.rows.map(r =>
          r.type === 'day' ? (
            <div key={r.key} className="timeline-day" data-daysep="" role="separator"><span data-eyebrow="">{r.label}</span></div>
          ) : r.type === 'fold' ? (
            <details key={r.key} className="timeline-fold" data-stategroup="">
              <summary data-meta="">{r.run.length} group changes</summary>
              {r.run.map(e => { const k = (e.id ?? e.localId)!; return row(k, e, <MessageTile key={k} message={e} accent={t.accent(e.senderId)} actions={actions} renderBody={renderBody} />); })}
            </details>
          ) : (
            row(r.key, r.message, <MessageTile key={r.key} message={r.message} continuation={r.continuation} inThread={inThread} highlighted={highlightId === (r.message.id ?? r.message.localId)} actions={actions} accent={t.accent(r.message.senderId)} renderBody={renderBody} />)
          ),
        )}
      </div>
    </div>
  );
}

export { assignAccents, accentForSender, sameDay, formatDayLabel, formatRelative } from './chatmsg.shared';
export { formatTimeLabel, formatBytes } from './messageFormat';
export type { MessageKind, SendState, MessageReaction, MessageAttachment, TimelineMessage, AccentSlot, MessageTileActions, MessageTimelineProps } from './chatmsg.shared';
