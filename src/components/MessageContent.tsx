import './MessageContent.css';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { MessageKind, MessageAttachment } from './MessageTimeline';

export interface MessageContentProps {
  kind: MessageKind;
  html?: string;
  text?: string;
  htmlIsTrusted?: boolean;
  attachment?: MessageAttachment;
  undecryptableReason?: string;
  undecryptableHint?: ReactNode;
  onMentionSelect?: (id: string) => void;
  parsePillHref?: (href: string) => string | null;
  onOpen?: () => void;
  onDownload?: () => void;
  onCopyCode?: (code: string) => void;
  className?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function linkify(str: string): string {
  // Regex from spec: /\bhttps?:\/\/[^\s<>"']+[^\s<>"'.,;:!?)\]]/g
  return str.replace(/\bhttps?:\/\/[^\s<>"']+[^\s<>"'.,;:!?)\]]/g, (match) => {
    return `<a href="${match}" target="_blank" rel="noopener noreferrer nofollow">${match}</a>`;
  });
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function MessageContent({
  kind,
  html,
  text,
  htmlIsTrusted = false,
  attachment,
  undecryptableReason,
  undecryptableHint,
  onMentionSelect,
  parsePillHref = (href: string) => {
    const parts = href.split('#/');
    if (parts.length > 1) {
      const segs = parts[parts.length - 1].split('/');
      return segs[segs.length - 1];
    }
    return null;
  },
  onOpen,
  onDownload,
  onCopyCode,
  className = ''
}: MessageContentProps) {
  const proseRef = useRef<HTMLDivElement>(null);

  // Note: Mention-pill interception and Code block enhancement are run in an effect
  useEffect(() => {
    const root = proseRef.current;
    if (!root) return;

    // Mention interception
    const clickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const pill = target.closest('a[data-pill]') as HTMLAnchorElement;
      if (pill) {
        const href = pill.getAttribute('href');
        if (href) {
          const id = parsePillHref(href);
          if (id) {
            e.preventDefault();
            if (onMentionSelect) onMentionSelect(id);
          }
        }
      }
    };
    root.addEventListener('click', clickHandler);

    // Code enhancement
    const pres = root.querySelectorAll('pre');
    pres.forEach(pre => {
      if (pre.closest('[data-code]')) return; // already enhanced

      const codeEl = pre.querySelector('code');
      const lang = codeEl?.getAttribute('data-lang') || 'text';

      const wrapper = document.createElement('div');
      wrapper.setAttribute('data-code', '');
      
      const head = document.createElement('div');
      head.setAttribute('data-codehead', '');
      
      const langSpan = document.createElement('span');
      langSpan.setAttribute('data-num', '');
      langSpan.textContent = lang;

      const copyBtn = document.createElement('button');
      copyBtn.setAttribute('data-btn', 'text');
      copyBtn.setAttribute('data-state', '');
      copyBtn.setAttribute('aria-label', 'Copy code');
      copyBtn.setAttribute('style', 'margin-left:auto;padding:3px var(--s3);font-size:var(--t-meta)');
      copyBtn.textContent = 'Copy';

      copyBtn.onclick = () => {
        const codeText = pre.textContent || '';
        navigator.clipboard?.writeText(codeText);
        if (onCopyCode) onCopyCode(codeText);
        copyBtn.textContent = 'Copied';
        window.setTimeout(() => {
          copyBtn.textContent = 'Copy';
        }, 1400);
      };

      head.appendChild(langSpan);
      head.appendChild(copyBtn);
      
      wrapper.appendChild(head);
      
      if (pre.parentNode) {
        pre.parentNode.replaceChild(wrapper, pre);
      }
      wrapper.appendChild(pre);
    });

    return () => {
      root.removeEventListener('click', clickHandler);
    };
  }, [html, htmlIsTrusted, text, onMentionSelect, parsePillHref, onCopyCode]); // re-run on content change

  if (kind === 'deleted') {
    return <div data-meta="" data-redacted="" className={className}>Message deleted</div>;
  }

  if (kind === 'undecryptable') {
    const reasonText = undecryptableReason 
      ? ` (${undecryptableReason.toLowerCase().replace(/_/g, ' ')})` 
      : '';
    return (
      <div data-meta="" data-undecryptable="" role="note" className={className}>
        <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        Unable to decrypt this message{reasonText}
        {undecryptableHint}
      </div>
    );
  }

  if (kind === 'decrypting') {
    return <div data-meta="" className={className}>Decrypting…</div>;
  }

  if (kind === 'image' || kind === 'sticker') {
    const w = attachment?.width;
    const h = attachment?.height;
    return (
      <button 
        type="button" 
        data-media="image" 
        aria-label={`Open image ${attachment?.name || ''}`} 
        style={{ aspectRatio: w && h ? `${w} / ${h}` : undefined }}
        onClick={onOpen}
        className={className}
      >
        {attachment?.url ? (
          <img src={attachment.url} alt={attachment.name} />
        ) : (
          <span data-meta="">{attachment?.error ?? 'Loading image…'}</span>
        )}
      </button>
    );
  }

  if (kind === 'file' || kind === 'video' || kind === 'audio') {
    const sizeStr = attachment?.size ? formatBytes(attachment.size) : null;
    return (
      <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)' }}>
          <button type="button" data-chip="" data-state="" data-filechip="" onClick={onOpen}>
            <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
            {attachment?.name}
            {sizeStr && <span data-num="" style={{ color: 'var(--app-faint)' }}>{sizeStr}</span>}
          </button>
          {attachment?.downloadable && (
            <button data-btn="text" onClick={onDownload}>Download</button>
          )}
        </div>
        {kind === 'audio' && attachment?.url && (
          <audio controls src={attachment.url} preload="metadata" aria-label={attachment.name} />
        )}
      </div>
    );
  }

  // Prose
  const renderHtml = (htmlIsTrusted && html) 
    ? html 
    : linkify(escapeHtml(text || '')).replace(/\n/g, '<br>');

  return (
    <div 
      ref={proseRef}
      data-prose="" 
      data-msgbody="" 
      data-notice={kind === 'notice' ? '' : undefined}
      data-emote={kind === 'emote' ? '' : undefined}
      className={className}
      dangerouslySetInnerHTML={{ __html: renderHtml }} 
    />
  );
}
