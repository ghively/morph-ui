import './InlineCommentThread.css';
import { useId, useState } from 'react';
import type { Tone } from '../tone';
import { initials, identityHue, fmtRel } from './canvas.shared';

export interface CommentReply {
  id: string;
  author: string;
  at: string;
  body: string;
}

export interface InlineCommentThreadProps {
  /** Thread subject line, e.g. the quoted text the comment anchors to. */
  subject?: string;
  author: string;
  at: string;
  body: string;
  replies?: CommentReply[];
  resolved?: boolean;
  defaultResolved?: boolean;
  onResolveChange?: (resolved: boolean) => void;
  onReply?: (body: string) => void;
  /** Reference "now" for relative timestamps. */
  now?: string;
  tone?: Tone;
  className?: string;
}

/**
 * A comment thread anchored to a canvas selection or artifact passage. Shows
 * the root comment, the reply list and an add-reply composer; resolves with a
 * single action and collapses to a compact resolved summary.
 */
export function InlineCommentThread({
  subject,
  author,
  at,
  body,
  replies = [],
  resolved: resolvedProp,
  defaultResolved = false,
  onResolveChange,
  onReply,
  now,
  tone = 'neutral',
  className = '',
}: InlineCommentThreadProps) {
  const [innerResolved, setInnerResolved] = useState(defaultResolved);
  const resolved = resolvedProp ?? innerResolved;
  const [draft, setDraft] = useState('');
  const instanceId = useId();
  const hue = identityHue(author);
  const resolve = (v: boolean) => {
    if (resolvedProp === undefined) setInnerResolved(v);
    onResolveChange?.(v);
  };
  const send = () => {
    const text = draft.trim();
    if (!text) return;
    onReply?.(text);
    setDraft('');
  };

  return (
    <div
      className={`cv-comment ${className}`}
      data-comment-thread=""
      data-resolved={resolved ? 'true' : 'false'}
      data-tone={tone}
    >
      {subject && <p className="cv-comment-subject" data-comment-subject="">{subject}</p>}
      <div className="cv-comment-root" data-comment-root="">
        <span className="cv-comment-avatar" data-hue={hue} aria-hidden="true">{initials(author)}</span>
        <div className="cv-comment-main">
          <div className="cv-comment-head">
            <span className="cv-comment-author">{author}</span>
            <time className="cv-comment-time" dateTime={at}>{fmtRel(at, now)}</time>
          </div>
          <p className="cv-comment-body" data-comment-body="">{body}</p>
        </div>
      </div>

      {replies.length > 0 && (
        <ul className="cv-comment-replies" data-comment-replies="">
          {replies.map((r) => (
            <li key={r.id} data-reply-id={r.id}>
              <span className="cv-comment-avatar" data-hue={identityHue(r.author)} aria-hidden="true">{initials(r.author)}</span>
              <div className="cv-comment-main">
                <div className="cv-comment-head">
                  <span className="cv-comment-author">{r.author}</span>
                  <time className="cv-comment-time" dateTime={r.at}>{fmtRel(r.at, now)}</time>
                </div>
                <p className="cv-comment-body">{r.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="cv-comment-composer" data-comment-composer="">
        <label className="cv-comment-sr" htmlFor={`cv-reply-${instanceId}`}>Add a reply</label>
        <input
          id={`cv-reply-${instanceId}`}
          data-reply-input=""
          type="text"
          value={draft}
          placeholder={resolved ? 'Reply…' : 'Add a reply…'}
          disabled={resolved}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); send(); } }}
        />
        <button
          type="button"
          data-reply-send=""
          onClick={send}
          disabled={resolved || !draft.trim()}
          aria-label="Send reply"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M2 8l12-6-6 12L7 9 2 8zM7 9l5-5" /></svg>
        </button>
      </div>

      <div className="cv-comment-foot">
        {resolved ? (
          <button type="button" className="cv-comment-resolve" data-resolve-toggle="" data-resolved-state="true" onClick={() => resolve(false)}>
            Reopen thread
          </button>
        ) : (
          <button type="button" className="cv-comment-resolve" data-resolve-toggle="" data-resolved-state="false" onClick={() => resolve(true)}>
            Resolve
          </button>
        )}
        <span className="cv-comment-count" data-comment-count="">
          {1 + replies.length} {1 + replies.length === 1 ? 'comment' : 'comments'}
        </span>
      </div>
    </div>
  );
}
