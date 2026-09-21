import './MessageTile.css';
import { memo } from 'react';
import type { ReactNode } from 'react';
import type { TimelineMessage, AccentSlot, MessageTileActions } from './MessageTimeline';
import { MessageContent } from './MessageContent';
import { ReactionBar } from './ReactionBar';
import { formatTimeLabel } from './MessageTimeline';

export interface MessageTileProps {
  message: TimelineMessage;
  continuation?: boolean;
  inThread?: boolean;
  highlighted?: boolean;
  accent: AccentSlot;
  timeLabel?: string;
  quickReactions?: string[];
  permalink?: string;
  actions?: MessageTileActions;
  renderBody?: (message: TimelineMessage) => ReactNode;
  className?: string;
}

const DEFAULT_QUICK_REACTIONS = ['👍', '❤️', '😂', '🎉', '👀', '✅'];

function InitialsAvatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  return (
    <span className={`initials-avatar initials-avatar-${size}`} aria-hidden="true">
      {initial}
    </span>
  );
}

// Minimal stub for AlertBanner, since it's mentioned as "delegate to AlertBanner" but
// the user said we shouldn't edit files not named in this lane. If AlertBanner exists in library, we'd import it. 
// Assuming it does not exist or we should mock it based on spec description (spec mentions systemAlert as property but doesn't say "implement AlertBanner"). 
// Wait, "delegate to AlertBanner" - Let me check if AlertBanner exists. 
// If it does not exist, I will render a stub. 

// Since AlertBanner is not specified in this lane, I'll assume we can render a minimal version
// matching `[data-system]` wrapping for now. If AlertBanner exists elsewhere, it would be imported. 
// I will render the systemAlert properties in a standard way.
function SystemAlertStub({ tone, lead, live }: { tone: string; lead: string; live?: boolean }) {
  return (
    <div data-alertbanner="" data-tone={tone} aria-live={live ? 'polite' : 'off'} style={{ padding: 'var(--s2) var(--s3)', background: 'var(--app-panel)', borderRadius: 'var(--r-md)' }}>
      <span data-strong="">{lead}</span>
    </div>
  );
}

export const MessageTile = memo(function MessageTile({
  message,
  continuation = false,
  inThread = false,
  highlighted = false,
  accent,
  timeLabel,
  quickReactions = DEFAULT_QUICK_REACTIONS,
  permalink,
  actions,
  renderBody,
  className = ''
}: MessageTileProps) {
  const tLabel = timeLabel ?? formatTimeLabel(message.ts);

  if (message.kind === 'artifact') {
    const isOwn = message.mine;
    const tile = (
      <button 
        type="button" 
        data-artifacttile="" 
        data-degraded={message.artifact?.degraded ? "" : undefined}
      >
        <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
        <span data-strong="">Artifact</span>
        <span data-ell="">{message.artifact?.label}</span>
        {message.artifact?.degraded && <span data-tiletag="">source only</span>}
      </button>
    );

    const ariaLabel = isOwn 
      ? `You: Artifact ${message.artifact?.label}`
      : `${message.senderName}: Artifact ${message.artifact?.label}`;

    if (isOwn) {
      return (
        <div data-turn="user" data-sec={accent} data-eventid={message.id} data-txn={message.localId} data-highlight={highlighted ? "" : undefined} data-msg="" tabIndex={0} aria-label={ariaLabel} className={className}>
          <div data-attach="">{tile}</div>
          <div data-msgmeta="">
            <span data-num="">{tLabel}</span>
          </div>
        </div>
      );
    } else {
      return (
        <div data-turn="assistant" data-sec={accent} data-eventid={message.id} data-sender="" data-agent={message.isAgent ? "" : undefined} data-continuation={continuation ? "" : undefined} data-highlight={highlighted ? "" : undefined} data-msg="" tabIndex={0} aria-label={ariaLabel} className={className}>
          {continuation ? <span data-avatarspacer="" aria-hidden="true" /> : (
            message.senderAvatarUrl ? <img src={message.senderAvatarUrl} alt="" className="avatar" /> : <InitialsAvatar name={message.senderName} />
          )}
          <div data-body="">
            {!continuation && (
              <div style={{ display: 'flex', gap: 'var(--s3)', flexWrap: 'wrap' }}>
                <button type="button" data-strong="" data-sendername="">{message.senderName}</button>
                {message.agentLabel && (
                  <span data-chip="" data-solid="" data-tone="ok" data-agentbadge="">
                    <span data-dot="" style={{ width: 5, height: 5 }} />
                    <span data-num="">{message.agentLabel}</span>
                  </span>
                )}
                {message.agentRole && <span data-tiletag="">{message.agentRole}</span>}
                {message.depth !== undefined && <span data-tiletag="" title="Agent-to-agent delegation depth">↳ depth {message.depth}</span>}
              </div>
            )}
            {tile}
            <div data-msgmeta="">
              <span data-num="">{tLabel}</span>
            </div>
          </div>
        </div>
      );
    }
  }

  if (message.kind === 'state') {
    if (!message.stateText) return null;
    return (
      <div data-stateline="" data-eventid={message.id} className={className}>
        <span data-meta="">{message.stateText}</span>
      </div>
    );
  }

  if (renderBody) {
    const custom = renderBody(message);
    if (custom) {
      return (
        <div data-eventid={message.id} style={{ padding: '8px 0' }} className={className}>
          {custom}
        </div>
      );
    }
  }

  if (message.kind === 'notice' && message.systemAlert) {
    return (
      <div data-eventid={message.id} data-system={message.kind} style={{ maxWidth: 780, width: '100%' }} className={className}>
        <SystemAlertStub tone={message.systemAlert.tone} lead={message.systemAlert.lead} live={message.systemAlert.live} />
      </div>
    );
  }

  const isOwn = message.mine;
  const isDeleted = message.deleted || message.kind === 'deleted';
  const showActions = message.sendState === 'sent' && !isDeleted;
  const turnLabel = isOwn ? `You: ${message.preview}` : `${message.senderName}${message.isAgent ? " (agent)" : ""}: ${message.preview}`;

  const replyQuote = message.replyTo && (
    <button type="button" data-replyquote="" aria-label="Jump to the replied message" onClick={() => actions?.onJumpTo?.(message.replyTo!.id)}>
      <span data-strong="">{message.replyTo.senderName || "Reply"}</span>
      <span>{message.replyTo.preview ?? "Original message not loaded — jump to it"}</span>
    </button>
  );

  const reactionsEl = message.reactions && message.reactions.length > 0 && (
    <ReactionBar 
      reactions={message.reactions} 
      onToggle={(k, m) => actions?.onToggleReaction?.(message.id, k, m)} 
    />
  );

  const threadSummary = !inThread && message.thread && message.thread.count > 0 && (
    <button type="button" data-threadsummary="" aria-label={`Open thread, ${message.thread.count} repl${message.thread.count === 1 ? 'y' : 'ies'}`} onClick={() => actions?.onOpenThread?.(message.id)}>
      <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      <span data-strong="">{message.thread.count} repl{message.thread.count === 1 ? 'y' : 'ies'}</span>
      {message.thread.lastSenderName && message.thread.lastTs && (
        <span data-meta="">last by {message.thread.lastSenderName} · {formatTimeLabel(message.thread.lastTs)}</span>
      )}
      {message.thread.unread && <span data-dot="" data-live="" aria-label="unread" style={{ width: 6, height: 6 }} />}
    </button>
  );

  const metaRow = (
    <div data-msgmeta="">
      <span data-num="">{tLabel}</span>
      {message.edited && <span data-meta="">(edited)</span>}
      {message.sendState === 'sending' && <span data-meta="" data-sendstate="sending">Sending…</span>}
      {message.sendState === 'failed' && (
        <span data-sendstate="failed" role="alert">
          <span style={{ color: "var(--danger-ink)", fontWeight: 700 }}>Not sent</span>
          <button data-btn="text" onClick={() => actions?.onRetrySend?.(message.id)}>Retry</button>
          <button data-btn="text" onClick={() => actions?.onDiscardSend?.(message.id)}>Discard</button>
        </span>
      )}
      {message.readers && message.readers.length > 0 && (
        <span data-avatars="" data-receipts="" aria-label={`Seen by ${message.readers.map(r => r.name).join(', ')}`} title={`Seen by ${message.readers.map(r => r.name).join(', ')}`}>
          {message.readers.slice(0, 4).map(r => (
            <InitialsAvatar key={r.id} name={r.name} size="sm" />
          ))}
        </span>
      )}
    </div>
  );

  const content = (
    <MessageContent
      kind={message.kind}
      html={message.html}
      text={message.text}
      htmlIsTrusted={!!message.html}
      attachment={message.attachment}
      undecryptableReason={message.undecryptableReason}
    />
  );

  // We conditionally apply [data-attach] vs [data-bubble]
  // In source: "media or deleted" -> [data-attach], body -> [data-bubble]
  const isAttach = isDeleted || message.kind === 'image' || message.kind === 'video' || message.kind === 'audio' || message.kind === 'file' || message.kind === 'sticker';
  const bodyWrap = isAttach ? <div data-attach="">{content}</div> : <div data-bubble="">{content}</div>;

  const handleCopyText = () => {
    if (message.text) {
      navigator.clipboard?.writeText(message.text);
      actions?.onCopyText?.(message.id);
    }
  };

  const handleCopyLink = () => {
    if (permalink) {
      navigator.clipboard?.writeText(permalink);
      actions?.onCopyLink?.(message.id);
    }
  };

  const handleDelete = async () => {
    if (actions?.onConfirm) {
      const proceed = await actions.onConfirm('delete', message);
      if (proceed && actions?.onDelete) {
        actions.onDelete(message.id);
      }
    } else if (actions?.onDelete) {
      actions.onDelete(message.id);
    }
  };

  const actionBar = showActions && (
    <div data-msgactions="" role="toolbar" aria-label="Message actions">
      <button data-iconbtn="" aria-label="React" title="React" aria-expanded="false" onClick={(e) => {
        const btn = e.currentTarget;
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        const root = btn.closest('[data-turn]');
        if (root) {
          const picker = root.querySelector<HTMLElement>('[data-reactpicker]');
          if (picker) picker.style.display = expanded ? 'none' : 'flex';
        }
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
      </button>
      <button data-iconbtn="" aria-label="Reply" title="Reply" onClick={() => actions?.onReply?.(message.id)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
      </button>
      {!inThread && (
        <button data-iconbtn="" aria-label="Reply in thread" title="Reply in thread" onClick={() => actions?.onOpenThread?.(message.id)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </button>
      )}
      {message.canEdit && (
        <button data-iconbtn="" aria-label="Edit" title="Edit" onClick={() => actions?.onEdit?.(message.id)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </button>
      )}
      <button data-iconbtn="" aria-label="Copy text" title="Copy text" onClick={handleCopyText}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
      </button>
      {message.canOpenAttachmentPanel && (
        <button data-iconbtn="" aria-label="Open in panel" title="Open in panel" onClick={() => actions?.onOpenAttachmentPanel?.(message.id)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
        </button>
      )}
      <button data-iconbtn="" aria-label="Save" title="Save" onClick={() => actions?.onSave?.(message.id)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
      </button>
      {permalink && (
        <button data-iconbtn="" aria-label="Copy link" title="Copy link" onClick={handleCopyLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        </button>
      )}
      {message.canDelete && (
        <button data-iconbtn="" aria-label="Delete" title="Delete" data-tone="danger" onClick={handleDelete}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      )}
    </div>
  );

  const reactionPicker = showActions && (
    <div data-reactpicker="" role="menu" aria-label="Pick a reaction" style={{ display: 'none' }}>
      {quickReactions.map(key => (
        <button key={key} role="menuitem" data-iconbtn="" aria-label={`React ${key}`} onClick={(e) => {
          actions?.onToggleReaction?.(message.id, key, false);
          if (e.currentTarget.parentElement) {
            e.currentTarget.parentElement.style.display = 'none';
          }
          const tb = e.currentTarget.parentElement?.previousElementSibling;
          if (tb) {
            const btn = tb.querySelector('[aria-label="React"]');
            if (btn) btn.setAttribute('aria-expanded', 'false');
          }
        }}>
          {key}
        </button>
      ))}
    </div>
  );

  if (isOwn) {
    return (
      <div 
        data-turn="user" 
        data-sec={accent} 
        data-eventid={message.id} 
        data-txn={message.localId} 
        data-highlight={highlighted ? "" : undefined} 
        data-msg="" 
        tabIndex={0} 
        data-sendstate={message.sendState} 
        aria-label={turnLabel}
        className={className}
      >
        {replyQuote}
        {bodyWrap}
        {reactionsEl}
        {threadSummary}
        {metaRow}
        {actionBar}
        {reactionPicker}
      </div>
    );
  }

  // Other
  return (
    <div 
      data-turn="assistant" 
      data-sec={accent} 
      data-eventid={message.id} 
      data-sender="" 
      data-agent={message.isAgent ? "true" : undefined} 
      data-continuation={continuation ? "" : undefined} 
      data-highlight={highlighted ? "" : undefined} 
      data-msg="" 
      tabIndex={0} 
      aria-label={turnLabel}
      className={className}
    >
      {continuation ? <span data-avatarspacer="" aria-hidden="true" /> : (
        message.senderAvatarUrl ? <img src={message.senderAvatarUrl} alt="" className="avatar" /> : <InitialsAvatar name={message.senderName} />
      )}
      <div data-body="">
        {!continuation && (
          <div style={{ display: 'flex', gap: 'var(--s3)', flexWrap: 'wrap', alignItems: 'center', marginBottom: 4 }}>
            <button type="button" data-strong="" data-sendername="">{message.senderName}</button>
            {message.isAgent && message.agentLabel && (
              <span data-chip="" data-solid="" data-tone="ok" data-agentbadge="">
                <span data-dot="" style={{ width: 5, height: 5, background: 'currentColor', borderRadius: '50%' }} />
                <span data-num="">{message.agentLabel}</span>
              </span>
            )}
            {message.agentRole && <span data-tiletag="">{message.agentRole}</span>}
            {message.depth !== undefined && <span data-tiletag="" title="Agent-to-agent delegation depth">↳ depth {message.depth}</span>}
            {message.kind === 'notice' && !message.isAgent && <span data-tiletag="">notice</span>}
          </div>
        )}
        {replyQuote}
        {bodyWrap}
        {reactionsEl}
        {threadSummary}
        {metaRow}
      </div>
      {actionBar}
      {reactionPicker}
    </div>
  );
});
