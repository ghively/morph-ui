import { useState, useRef, useEffect, type KeyboardEvent, type RefObject } from 'react';
import './MultimodalComposer.css';
import { AgentPresence } from './AgentPresence';

export interface AttachmentStatus {
  status: 'staged' | 'uploading' | 'done' | 'failed';
  progress?: number;
}

export interface MultimodalComposerProps {
  onSend?: (text: string, attachments: File[]) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  draftText?: string;
  onDraftChange?: (text: string) => void;
  /** When provided, the host owns Enter-to-send. */
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  /** When provided, files go to the host and the internal tray is not used. */
  onAttach?: (files: FileList | File[]) => void;
  /** Squares the top corners so a reply/edit header can sit on top. */
  replyOrEditMode?: boolean;
  /** Visual state per attachment, keyed by file name. */
  attachmentStatuses?: Record<string, AttachmentStatus>;
  onRetryAttachment?: (fileName: string) => void;
  onRemoveAttachment?: (fileName: string) => void;
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
  /** Seed the internal attachment tray (uncontrolled). */
  defaultAttachments?: File[];
  /** Start in voice mode (uncontrolled). */
  defaultVoiceMode?: boolean;
}

const I = {
  clip: 'M21.4 11.1l-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5',
  mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM19 11a7 7 0 0 1-14 0M12 18v3',
  send: 'M12 19V5M5.5 11.5L12 5l6.5 6.5',
  x: 'M7 7l10 10M17 7L7 17',
  retry: 'M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4',
};
const Ico = ({ d }: { d: string }) => <svg viewBox="0 0 24 24" aria-hidden="true"><path d={d} /></svg>;

const kindOf = (f: File) => {
  const ext = (f.name.split('.').pop() || '').toLowerCase();
  if (/^(png|jpe?g|gif|webp|svg)$/.test(ext) || f.type.startsWith('image/')) return 'img';
  if (/^(json|ts|tsx|js|py|go|rs|sh|ya?ml)$/.test(ext)) return 'code';
  return 'doc';
};
const extOf = (f: File) => (f.name.includes('.') ? f.name.split('.').pop()! : 'file').slice(0, 4).toUpperCase();

export function MultimodalComposer({
  onSend,
  className = '',
  disabled = false,
  placeholder = 'Message…',
  draftText = '',
  onDraftChange,
  onKeyDown,
  onAttach,
  replyOrEditMode = false,
  attachmentStatuses = {},
  onRetryAttachment,
  onRemoveAttachment,
  textareaRef: externalRef,
  defaultAttachments,
  defaultVoiceMode = false,
}: MultimodalComposerProps) {
  const [text, setText] = useState(draftText);
  const [focused, setFocused] = useState(false);
  const [voice, setVoice] = useState(defaultVoiceMode);
  const [files, setFiles] = useState<File[]>(defaultAttachments || []);
  const [dragging, setDragging] = useState(false);
  const localRef = useRef<HTMLTextAreaElement>(null);
  const ta = externalRef ?? localRef;
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => { setText(draftText); }, [draftText]);
  useEffect(() => {
    const el = ta.current;
    if (el) { el.style.height = 'auto'; el.style.height = `${Math.min(el.scrollHeight, 200)}px`; }
  }, [text, ta, voice]);

  const add = (list: FileList | File[]) => {
    if (disabled || !list.length) return;
    if (onAttach) onAttach(list); else setFiles(f => [...f, ...Array.from(list)]);
  };
  const statusOf = (f: File): AttachmentStatus => attachmentStatuses[f.name] || { status: 'staged' };
  // Failed attachments never block sending text, but can't be the only payload.
  const canSend = !disabled && (text.trim().length > 0 || (!onAttach && files.some(f => statusOf(f).status !== 'failed')));
  const send = () => {
    if (!canSend) return;
    onSend?.(text, files);
    if (!onDraftChange) setText('');
    if (!onAttach) setFiles([]);
  };
  const remove = (i: number) => {
    const f = files[i];
    if (f) onRemoveAttachment?.(f.name);
    setFiles(fs => fs.filter((_, k) => k !== i));
  };
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (onKeyDown) { onKeyDown(e); return; }
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const cls = ['mm-composer', focused && 'is-focus focused', voice && 'is-voice voice-mode', dragging && 'is-drag dragging', disabled && 'is-disabled', replyOrEditMode && 'with-header', className].filter(Boolean).join(' ');

  return (
    <div
      className={cls}
      onDragOver={e => { e.preventDefault(); if (!disabled) setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer?.files) add(e.dataTransfer.files); }}
    >
      {files.length > 0 && !onAttach && (
        <div className="mm-tray">
          {files.map((f, i) => {
            const st = statusOf(f);
            const pct = Math.round((st.progress || 0) * 100);
            return (
              <div key={`${f.name}-${i}`} className={`mm-att is-${st.status}`}>
                <span className={`mm-thumb k-${kindOf(f)}`}>{extOf(f)}</span>
                <span className="mm-meta">
                  <span className="mm-name">{f.name}</span>
                  <span className="mm-sub">
                    {st.status === 'uploading' ? <>Uploading <b>{pct}%</b></> : st.status === 'failed' ? 'Failed' : st.status === 'done' ? 'Ready' : 'Staged'}
                  </span>
                </span>
                {st.status === 'failed' && onRetryAttachment && (
                  <button type="button" className="mm-mini" aria-label="Retry upload" onClick={() => onRetryAttachment(f.name)}><Ico d={I.retry} /></button>
                )}
                <button type="button" className="mm-mini" aria-label="Remove attachment" onClick={() => remove(i)}><Ico d={I.x} /></button>
                {st.status === 'uploading' && <span className="mm-prog"><i style={{ width: `${pct}%` }} /></span>}
              </div>
            );
          })}
        </div>
      )}

      <div className="mm-row">
        <button type="button" className="mm-icon" aria-label="Attach file" disabled={disabled} onClick={() => fileInput.current?.click()}><Ico d={I.clip} /></button>
        <input
          ref={fileInput}
          type="file"
          multiple
          hidden
          disabled={disabled}
          onChange={e => { if (e.target.files) add(e.target.files); e.target.value = ''; }}
        />
        {voice ? (
          <div className="mm-voice" aria-live="polite">
            <AgentPresence state="listening" size="sm" />
            <span>Listening…</span>
            <span className="mm-wave">{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ animationDelay: `${(i * 97) % 900}ms` }} />)}</span>
          </div>
        ) : (
          <textarea
            ref={ta}
            className="mm-ta mm-textarea"
            placeholder={placeholder}
            value={text}
            disabled={disabled}
            rows={1}
            role="combobox"
            aria-expanded={false}
            onChange={e => { setText(e.target.value); onDraftChange?.(e.target.value); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={onKey}
            onPaste={e => { if (e.clipboardData.files?.length) add(e.clipboardData.files); }}
          />
        )}
        {canSend ? (
          <button type="button" className="mm-send" aria-label="Send message" onClick={send}><Ico d={I.send} /></button>
        ) : (
          <button
            type="button"
            className={`mm-icon mm-voice-btn ${voice ? 'is-on' : ''}`}
            aria-label={voice ? 'Stop voice input' : 'Start voice input'}
            disabled={disabled}
            onClick={() => setVoice(v => !v)}
          >
            <Ico d={I.mic} />
          </button>
        )}
      </div>

      {dragging && <div className="mm-drop"><span>Drop files to attach</span></div>}
    </div>
  );
}
