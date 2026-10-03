import './MessageTimeline.css';
import { MessageTile } from './MessageTile';
import { useTimeline, type MessageTimelineProps } from './chatmsg.shared';

export function MessageTimeline(props: MessageTimelineProps) {
  const t = useTimeline(props);
  const { label, highlightId, inThread = false, actions, className = '' } = props;
  return (
    <div ref={t.scroller} className={'timeline ' + className} data-scroller="" onScroll={t.onScroll}>
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
              {r.run.map(e => <MessageTile key={e.id ?? e.localId} message={e} accent={t.accent(e.senderId)} actions={actions} />)}
            </details>
          ) : (
            <MessageTile key={r.key} message={r.message} continuation={r.continuation} inThread={inThread} highlighted={highlightId === (r.message.id ?? r.message.localId)} actions={actions} accent={t.accent(r.message.senderId)} />
          ),
        )}
      </div>
    </div>
  );
}

export { assignAccents, accentForSender, sameDay, formatDayLabel, formatRelative } from './chatmsg.shared';
export { formatTimeLabel, formatBytes } from './messageFormat';
export type { MessageKind, SendState, MessageReaction, MessageAttachment, TimelineMessage, AccentSlot, MessageTileActions, MessageTimelineProps } from './chatmsg.shared';
