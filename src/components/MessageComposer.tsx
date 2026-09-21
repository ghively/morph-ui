import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { KeyboardEvent, ReactNode, RefObject } from 'react';
import { MultimodalComposer } from './MultimodalComposer';
import { MentionAutocomplete } from './MentionAutocomplete';
import { findMentionTrigger, applyMention, rankMentionCandidates } from './MentionAutocomplete';
import type { MentionCandidate } from './MentionAutocomplete';
import './MessageComposer.css';

export interface ComposerMention {
  id: string;
  name: string;
}

export interface ComposerDraft {
  text: string;
  mentions: ComposerMention[];
}

export interface UploadProgress {
  name: string;
  pct: number;
}

export interface ComposerReplyContext {
  /** 'reply' | 'edit'. */
  mode: 'reply' | 'edit';
  /** Name shown in the chip (reply mode). */
  senderName?: string;
  /** Preview line beside the chip. */
  preview: string;
  onCancel: () => void;
}

export interface MessageComposerProps {
  draft: ComposerDraft;
  onDraftChange: (next: ComposerDraft) => void;
  onSend: (draft: ComposerDraft) => void | Promise<void>;
  placeholder: string;
  /** No permission to post — disables the input and shows the placeholder as the reason. */
  disabled?: boolean;
  /** Renders the offline banner above the composer. */
  offline?: boolean;
  offlineMessage?: ReactNode;
  /** Reply or edit chip row. */
  context?: ComposerReplyContext | null;
  /** Enter sends (Shift+Enter newline) vs Cmd/Ctrl+Enter sends. */
  sendOnEnter?: boolean;                  // default true
  /** ArrowUp on an empty draft. */
  onEditLast?: () => void;
  /** Files dropped or attached. */
  onAttach?: (files: File[] | FileList) => void | Promise<void>;
  uploads?: UploadProgress[];
  /** Throttled typing signal; called at most once per `typingThrottleMs`. */
  onTyping?: (active: boolean) => void;
  typingThrottleMs?: number;              // default 3000
  /** Focus the textarea on mount / when `focusKey` changes. Skipped when `autoFocus` is false. */
  autoFocus?: boolean;
  focusKey?: string;
  /** Max autosize height in px. Default 240. */
  maxHeight?: number;
  /** Rendered inside the composer shell, above the popover layer (mention list slot). */
  overlay?: ReactNode;
  /** Forwarded to the textarea so a parent can drive selection/caret. */
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  /** Caret position reported on every change, for mention detection. */
  onCaretChange?: (text: string, caret: number) => void;
  className?: string;
  
  /** 
   * Host provides these to populate the mention list when a trigger is active.
   * If not provided or empty, the internal MentionAutocomplete won't show.
   */
  mentionCandidates?: MentionCandidate[];
}

export function MessageComposer({
  draft,
  onDraftChange,
  onSend,
  placeholder,
  disabled = false,
  offline = false,
  offlineMessage,
  context = null,
  sendOnEnter = true,
  onEditLast,
  onAttach,
  uploads = [],
  onTyping,
  typingThrottleMs = 3000,
  autoFocus = true,
  focusKey,
  maxHeight = 240,
  overlay,
  textareaRef: externalTextareaRef,
  onKeyDown,
  onCaretChange,
  className,
  mentionCandidates = [],
}: MessageComposerProps) {
  const defaultTextareaRef = useRef<HTMLTextAreaElement>(null);
  const ta = externalTextareaRef || defaultTextareaRef;
  
  const [dragOver, setDragOver] = useState(false);
  const lastTypingAt = useRef(0);

  // Mention state
  const [acTrigger, setAcTrigger] = useState<{start: number, query: string} | null>(null);
  const [acIndex, setAcIndex] = useState(0);

  // Handle autosize
  useEffect(() => {
    const el = ta.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, [draft.text, maxHeight, ta]);

  // Handle focusKey
  useEffect(() => {
    if (!autoFocus || !ta.current) return;
    
    // Only focus if NOT a narrow screen to avoid raising keyboard on phone when conversation opens
    if (typeof window.matchMedia === 'function') {
      const foldMatch = window.matchMedia('(max-width:720px)');
      if (foldMatch.matches) return;
    }
    
    ta.current.focus({ preventScroll: true });
  }, [focusKey, autoFocus, ta]);

  // Handle reply focus
  useEffect(() => {
    if (context?.mode === 'reply') {
      ta.current?.focus();
    }
  }, [context?.mode, ta]);

  const updateAutocomplete = useCallback((text: string, caret: number) => {
    if (onCaretChange) {
        onCaretChange(text, caret);
    }
    const trigger = findMentionTrigger(text, caret);
    if (trigger) {
      setAcTrigger(trigger);
      setAcIndex(0);
    } else {
      setAcTrigger(null);
    }
  }, [onCaretChange]);

  const rankedCandidates = useMemo(() => {
    if (!acTrigger || mentionCandidates.length === 0) return [];
    return rankMentionCandidates(mentionCandidates, acTrigger.query);
  }, [acTrigger, mentionCandidates]);

  const pickCandidate = useCallback((candidate: MentionCandidate) => {
    if (!acTrigger || !ta.current) return;
    const caret = ta.current.selectionStart ?? draft.text.length;
    const { text, caret: newCaret } = applyMention(draft.text, acTrigger, caret, candidate.name);
    
    onDraftChange({
      text,
      mentions: [
        ...draft.mentions.filter(m => m.id !== candidate.id),
        { id: candidate.id, name: candidate.name }
      ]
    });
    
    setAcTrigger(null);
    
    window.requestAnimationFrame(() => {
      if (ta.current) {
        ta.current.setSelectionRange(newCaret, newCaret);
        ta.current.focus();
      }
    });
  }, [acTrigger, draft, onDraftChange, ta]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // 1. Mention Autocomplete keys
    if (acTrigger && rankedCandidates.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setAcIndex((i) => (i + 1) % rankedCandidates.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setAcIndex((i) => (i - 1 + rankedCandidates.length) % rankedCandidates.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        pickCandidate(rankedCandidates[acIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setAcTrigger(null);
        return;
      }
    }

    // 2. Context / Edit / Escape keys
    if (e.key === 'Escape') {
      if (context?.mode === 'edit') {
        context.onCancel();
        return;
      } else if (context?.mode === 'reply') {
        context.onCancel();
        return;
      }
    }

    if (e.key === 'ArrowUp' && !draft.text && context?.mode !== 'edit') {
      e.preventDefault();
      if (onEditLast) onEditLast();
      return;
    }

    // 3. Send keys
    let isSendKey = false;
    if (sendOnEnter) {
      // The IME `isComposing` guard is mandatory
      isSendKey = e.key === 'Enter' && !e.shiftKey && !(e.nativeEvent as unknown as { isComposing?: boolean }).isComposing;
    } else {
      isSendKey = e.key === 'Enter' && (e.metaKey || e.ctrlKey);
    }

    if (isSendKey) {
      e.preventDefault();
      handleSend();
      return;
    }

    // 4. Forward
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const handleSend = () => {
    if (onTyping) {
        onTyping(false);
    }
    lastTypingAt.current = 0;
    void onSend(draft);
  };

  const handleDraftChange = (text: string) => {
    onDraftChange({ ...draft, text });
    
    // Caret for mentions
    if (ta.current) {
        updateAutocomplete(text, ta.current.selectionStart ?? text.length);
    }

    // Typing throttle
    if (text && onTyping) {
      const now = Date.now();
      if (now - lastTypingAt.current > typingThrottleMs) {
        lastTypingAt.current = now;
        onTyping(true);
      }
    }
  };

  const hasDraft = draft.text.trim().length > 0;
  const isReady = hasDraft || !!context;

  return (
    <div 
        className={className} 
        style={{ flex: "none", padding: "var(--s2) 24px var(--s6)" }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { 
            e.preventDefault(); 
            setDragOver(false); 
            if (e.dataTransfer.files.length && onAttach) {
                void onAttach(Array.from(e.dataTransfer.files)); 
            }
        }}
    >
      {offline && (
        <div data-composeralert="" data-tone="danger" data-enter="" role="status" style={{ maxWidth: 780, margin: "0 auto var(--s3)" }}>
          <span data-dot="" data-live="" />
          <div>
            {offlineMessage || (
              <><strong>Not connected.</strong> You can keep writing — messages wait and send when the connection is back.</>
            )}
          </div>
        </div>
      )}

      <div 
        data-focusring="" 
        data-composer="" 
        data-ready={String(isReady)} 
        data-over={String(dragOver)} 
        style={{ 
            background: "var(--app-elev)", 
            borderRadius: "var(--r-pane)", 
            padding: "var(--s4) var(--s5)", 
            boxShadow: "var(--el2)", 
            position: "relative" 
        }}
      >
        {context && (
          <div data-composermode="" style={{ display: "flex", alignItems: "center", gap: "var(--s2)", paddingBottom: "var(--s3)" }}>
            <span data-chip="" data-solid="">
              {context.mode === 'edit' ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                  Editing
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5A5.5 5.5 0 0 1 14.5 20H11" /></svg>
                  {`Replying to ${context.senderName || 'someone'}`}
                </>
              )}
            </span>
            <span data-meta="" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0, flex: 1 }}>
              {context.preview}
            </span>
            <button 
                data-iconbtn="" 
                onClick={context.onCancel} 
                aria-label={context.mode === 'edit' ? "Cancel edit" : "Cancel reply"}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        )}

        <MultimodalComposer
          disabled={disabled}
          placeholder={disabled ? placeholder : placeholder}
          draftText={draft.text}
          replyOrEditMode={!!context}
          onDraftChange={handleDraftChange}
          onKeyDown={handleKeyDown}
          onSend={handleSend}
          onAttach={onAttach}
          textareaRef={ta}
        />
        
        {/* Overlay node, typically mention autocomplete but controlled by host if `overlay` is provided */}
        {overlay || (acTrigger && rankedCandidates.length > 0 && (
          <MentionAutocomplete
            trigger={acTrigger}
            candidates={rankedCandidates}
            activeIndex={acIndex}
            onActiveIndexChange={setAcIndex}
            onPick={pickCandidate}
          />
        ))}

        {uploads.length > 0 && (
          <div data-morph="" data-open="true">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--s2)", paddingTop: "var(--s3)", flexWrap: "wrap" }}>
                {uploads.map((u) => (
                  <span key={u.name} data-chip="" data-solid="" role="status">
                    {u.name} <span data-num="">{u.pct}%</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
