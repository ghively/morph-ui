import './MessageTile.css';
import { memo, type ReactNode } from 'react';
import { MessageContent } from './MessageContent';
import { ReactionBar } from './ReactionBar';
import { InitialsAvatar } from './InitialsAvatar';
import { AlertBanner } from './AlertBanner';
import { formatTimeLabel } from './messageFormat';
import { useTile, replies, on, Ico, I, ALERT_TONE, DEFAULT_QUICK_REACTIONS, type MessageTileProps, type TimelineMessage } from './chatmsg.shared';

/** Avatar column + sender row for other people's turns; `continuation` collapses both. */
function Sender({ m, continuation, onShow, notice, children }: { m: TimelineMessage; continuation: boolean; onShow?: (id: string) => void; notice?: boolean; children: ReactNode }) {
  return (
    <>
      {continuation ? <span className="tile-avatar" data-avatarspacer="" aria-hidden="true" /> : <InitialsAvatar name={m.senderName} src={m.senderAvatarUrl} agent={m.isAgent} className="initials-avatar tile-avatar" />}
      <div className="tile-body" data-body="">
        {!continuation && (
          <div className="tile-who">
            <button type="button" className="tile-name" data-strong="" data-sendername="" onClick={() => onShow?.(m.senderId)}>{m.senderName}</button>
            {m.agentLabel && (m.isAgent || m.kind === 'artifact') && <span className="tile-agent" data-chip="" data-solid="" data-tone="ok" data-agentbadge=""><i aria-hidden="true" /><span data-num="">{m.agentLabel}</span></span>}
            {m.agentRole && <span className="tile-tag" data-tiletag="">{m.agentRole}</span>}
            {m.depth !== undefined && <span className="tile-tag" data-tiletag="" title="Agent-to-agent delegation depth">↳ depth {m.depth}</span>}
            {notice && <span className="tile-tag" data-tiletag="">notice</span>}
          </div>
        )}
        {children}
      </div>
    </>
  );
}

export const MessageTile = memo(function MessageTile(props: MessageTileProps) {
  const t = useTile(props);
  const { message: m, continuation = false, inThread = false, highlighted = false, accent, quickReactions = DEFAULT_QUICK_REACTIONS, permalink, actions: a, renderBody, className = '' } = props;
  const root = (turn: 'user' | 'assistant', label: string) => ({
    className: 'tile ' + className, 'data-turn': turn, 'data-sec': accent, 'data-eventid': m.id, 'data-highlight': on(highlighted), 'data-msg': '', tabIndex: 0, 'aria-label': label,
  });

  if (m.kind === 'artifact') {
    const tile = (
      <button type="button" className="tile-artifact" data-artifacttile="" data-degraded={on(m.artifact?.degraded)}>
        <Ico d={I.layers} size={13} />
        <span data-strong="">Artifact</span>
        <span className="tile-ell" data-ell="">{m.artifact?.label}</span>
        {m.artifact?.degraded && <span className="tile-tag" data-tiletag="">source only</span>}
      </button>
    );
    const meta = <div className="tile-meta" data-msgmeta=""><span data-num="">{t.time}</span></div>;
    const label = (m.mine ? 'You' : m.senderName) + ': Artifact ' + m.artifact?.label;
    return m.mine
      ? <div {...root('user', label)} data-txn={m.localId}><div className="tile-attach" data-attach="">{tile}</div>{meta}</div>
      : <div {...root('assistant', label)} data-sender="" data-agent={on(m.isAgent)} data-continuation={on(continuation)}><Sender m={m} continuation={continuation} onShow={a?.onShowSender}>{tile}{meta}</Sender></div>;
  }
  if (m.kind === 'state') return m.stateText ? <div className={'tile-state ' + className} data-stateline="" data-eventid={m.id}><span data-meta="">{m.stateText}</span></div> : null;
  const custom = renderBody?.(m);
  if (custom) return <div className={'tile-custom ' + className} data-eventid={m.id}>{custom}</div>;
  if (m.kind === 'notice' && m.systemAlert) {
    const s = m.systemAlert;
    return <div className={'tile-system ' + className} data-eventid={m.id} data-system={m.kind}><AlertBanner tone={ALERT_TONE[s.tone]} lead={s.lead} live={s.live} role="status" ariaLive={s.live ? 'polite' : 'off'} /></div>;
  }

  const body = (
    <>
      {m.replyTo && (
        <button type="button" className="tile-quote" data-replyquote="" aria-label="Jump to the replied message" onClick={() => a?.onJumpTo?.(m.replyTo!.id)}>
          <span data-strong="">{m.replyTo.senderName || 'Reply'}</span>
          <span className="tile-ell">{m.replyTo.preview ?? 'Original message not loaded — jump to it'}</span>
        </button>
      )}
      <div className={t.attach ? 'tile-attach' : 'tile-bubble'} {...(t.attach ? { 'data-attach': '' } : { 'data-bubble': '' })}>
        <MessageContent kind={m.kind} html={m.html} text={m.text} htmlIsTrusted={!!m.html} attachment={m.attachment} undecryptableReason={m.undecryptableReason} />
      </div>
      {!!m.reactions?.length && <ReactionBar reactions={m.reactions} onToggle={(k, mine) => a?.onToggleReaction?.(m.id, k, mine)} />}
      {!inThread && m.thread && m.thread.count > 0 && (
        <button type="button" className="tile-thread" data-threadsummary="" aria-label={'Open thread, ' + replies(m.thread.count)} onClick={() => a?.onOpenThread?.(m.id)}>
          <Ico d={I.chat} size={13} />
          <span data-strong="">{replies(m.thread.count)}</span>
          {m.thread.lastSenderName && m.thread.lastTs && <span data-meta="">last by {m.thread.lastSenderName} · {formatTimeLabel(m.thread.lastTs)}</span>}
          {m.thread.unread && <span className="tile-unread" data-dot="" data-live="" aria-label="unread" />}
        </button>
      )}
      <div className="tile-meta" data-msgmeta="">
        <span data-num="">{t.time}</span>
        {m.edited && <span data-meta="">(edited)</span>}
        {m.sendState === 'sending' && <span data-meta="" data-sendstate="sending">Sending…</span>}
        {m.sendState === 'failed' && (
          <span className="tile-failed" data-sendstate="failed" role="alert">
            <b>Not sent</b>
            <button type="button" data-btn="text" onClick={() => a?.onRetrySend?.(m.id)}>Retry</button>
            <button type="button" data-btn="text" onClick={() => a?.onDiscardSend?.(m.id)}>Discard</button>
          </span>
        )}
        {t.seenBy && (
          <span className="tile-receipts" data-avatars="" data-receipts="" aria-label={t.seenBy} title={t.seenBy}>
            {m.readers!.slice(0, 4).map(r => <InitialsAvatar key={r.id} name={r.name} src={r.avatarUrl} agent={r.isAgent} size="sm" className="initials-avatar" />)}
          </span>
        )}
      </div>
    </>
  );

  const actions = t.showActions && (
    <>
      <div className="tile-actions" data-msgactions="" role="toolbar" aria-label="Message actions">
        <button ref={t.reactBtn} type="button" className="tile-act" data-iconbtn="" aria-label="React" title="React" aria-haspopup="menu" aria-expanded={t.picking} onClick={t.togglePicker}><Ico d={I.smile} /></button>
        {([
          ['Reply', I.reply, true, () => a?.onReply?.(m.id)],
          ['Reply in thread', I.chat, !inThread, () => a?.onOpenThread?.(m.id)],
          ['Edit', I.edit, m.canEdit, () => a?.onEdit?.(m.id)],
          ['Copy text', I.copy, true, t.copyText],
          ['Open in panel', I.panel, m.canOpenAttachmentPanel, () => a?.onOpenAttachmentPanel?.(m.id)],
          ['Save', I.save, true, () => a?.onSave?.(m.id)],
          ['Copy link', I.link, !!permalink, t.copyLink],
          ['Delete', I.trash, m.canDelete, () => void t.remove()],
        ] as const).map(([label, d, show, fn]) => show && (
          <button key={label} type="button" className="tile-act" data-iconbtn="" data-tone={label === 'Delete' ? 'danger' : undefined} aria-label={label} title={label} onClick={fn}><Ico d={d} /></button>
        ))}
      </div>
      {t.picking && (
        <div ref={t.picker} className="tile-picker" data-reactpicker="" role="menu" aria-label="Pick a reaction" onKeyDown={t.pickerKey}>
          {quickReactions.map(key => <button key={key} type="button" className="tile-emoji" role="menuitem" data-iconbtn="" aria-label={'React ' + key} onClick={() => t.react(key)}>{key}</button>)}
        </div>
      )}
    </>
  );

  return m.mine
    ? <div {...root('user', t.label)} data-txn={m.localId} data-sendstate={m.sendState} data-picking={on(t.picking)}>{body}{actions}</div>
    : (
      <div {...root('assistant', t.label)} data-sender="" data-agent={m.isAgent ? 'true' : undefined} data-continuation={on(continuation)} data-picking={on(t.picking)}>
        <Sender m={m} continuation={continuation} onShow={a?.onShowSender} notice={m.kind === 'notice' && !m.isAgent}>{body}</Sender>
        {actions}
      </div>
    );
});

export type { MessageTileProps } from './chatmsg.shared';
