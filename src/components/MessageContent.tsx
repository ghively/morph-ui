import './MessageContent.css';
import { formatBytes } from './messageFormat';
import { useProse, textToHtml, defaultParsePillHref, Ico, I, type MessageContentProps } from './chatmsg.shared';

export function MessageContent({
  kind, html, text, htmlIsTrusted = false, attachment: a, undecryptableReason, undecryptableHint, onMentionSelect,
  parsePillHref = defaultParsePillHref, onOpen, onDownload, onCopyCode, className = '',
}: MessageContentProps) {
  const body = htmlIsTrusted && html ? html : textToHtml(text);
  // Keyed on kind too: the prose node only mounts for prose kinds, so a kind flip with the same body must re-wire.
  const ref = useProse(kind + '\u0000' + body, { onMentionSelect, parsePillHref, onCopyCode });
  const cls = (x: string) => x + ' ' + className;

  if (kind === 'deleted') return <div className={cls('msgc-note')} data-meta="" data-redacted="">Message deleted</div>;
  if (kind === 'decrypting') return <div className={cls('msgc-note')} data-meta="" data-busy="">Decrypting…</div>;
  if (kind === 'undecryptable') {
    return (
      <div className={cls('msgc-note')} data-meta="" data-undecryptable="" role="note">
        <Ico d={I.lock} size={11} />
        Unable to decrypt this message{undecryptableReason ? ' (' + undecryptableReason.toLowerCase().replace(/_/g, ' ') + ')' : ''}
        {undecryptableHint}
      </div>
    );
  }
  if (kind === 'image' || kind === 'sticker') {
    return (
      <button type="button" className={cls('msgc-media')} data-media="image" data-loaded={a?.url ? '' : undefined} aria-label={'Open image ' + (a?.name || '')}
        style={{ aspectRatio: a?.width && a?.height ? a.width + ' / ' + a.height : undefined }} onClick={onOpen}>
        {a?.url ? <img src={a.url} alt={a.name} /> : <span className="msgc-media-wait" data-meta="">{a?.error ?? 'Loading image…'}</span>}
      </button>
    );
  }
  if (kind === 'file' || kind === 'video' || kind === 'audio') {
    return (
      <div className={cls('msgc-file')}>
        <div className="msgc-file-row">
          <button type="button" className="msgc-filechip" data-chip="" data-state="" data-filechip="" onClick={onOpen}>
            <span className="msgc-file-ico"><Ico d={I.file} size={13} /></span>
            <span className="msgc-file-name">{a?.name}</span>
            {a?.size ? <span className="msgc-file-size" data-num="">{formatBytes(a.size)}</span> : null}
          </button>
          {a?.downloadable && <button type="button" className="msgc-dl" data-btn="text" onClick={onDownload}>Download</button>}
        </div>
        {kind === 'audio' && a?.url && <audio className="msgc-audio" controls src={a.url} preload="metadata" aria-label={a.name} />}
      </div>
    );
  }
  return (
    <div ref={ref} className={cls('msgc-prose')} data-prose="" data-msgbody="" data-notice={kind === 'notice' ? '' : undefined} data-emote={kind === 'emote' ? '' : undefined}
      dangerouslySetInnerHTML={{ __html: body }} />
  );
}

export type { MessageContentProps } from './chatmsg.shared';
