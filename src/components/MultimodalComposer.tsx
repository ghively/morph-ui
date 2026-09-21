import React, { useState, useRef, useEffect, type KeyboardEvent as RKE } from 'react';
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
  onKeyDown?: (e: RKE<HTMLTextAreaElement>) => void;
  onAttach?: (files: FileList | File[]) => void;
  replyOrEditMode?: boolean;
  /**
   * Optional controlled map of attachment states (keyed by file name).
   * If provided, determines the visual state of each attachment.
   */
  attachmentStatuses?: Record<string, AttachmentStatus>;
  onRetryAttachment?: (fileName: string) => void;
  onRemoveAttachment?: (fileName: string) => void;
  /** Optional externally-controlled textarea ref (e.g. for focus management from a host composer). */
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
}

export function MultimodalComposer({ 
  onSend, 
  className = '',
  disabled = false,
  placeholder = "Message...",
  draftText = "",
  onDraftChange,
  onKeyDown,
  onAttach,
  replyOrEditMode = false,
  attachmentStatuses = {},
  onRetryAttachment,
  onRemoveAttachment,
  textareaRef: externalTextareaRef
}: MultimodalComposerProps) {
  const [text, setText] = useState(draftText);
  const [isFocused, setIsFocused] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const localTextareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = externalTextareaRef ?? localTextareaRef;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync prop changes to local state
  useEffect(() => {
    setText(draftText);
  }, [draftText]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [text, textareaRef]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (onAttach) {
        onAttach(e.dataTransfer.files);
      } else {
        setAttachments(prev => [...prev, ...Array.from(e.dataTransfer.files!)]);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;
    if (e.clipboardData.files && e.clipboardData.files.length > 0) {
      if (onAttach) {
        onAttach(e.clipboardData.files);
      } else {
        setAttachments(prev => [...prev, ...Array.from(e.clipboardData.files)]);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (onDraftChange) {
      onDraftChange(e.target.value);
    }
  };

  const handleSubmit = () => {
    if (disabled) return;
    
    // Filter out failed attachments from blocking the send
    const failedAttachmentNames = new Set(
      Object.entries(attachmentStatuses)
        .filter(([, status]) => status.status === 'failed')
        .map(([name]) => name)
    );
    const validAttachments = attachments.filter(f => !failedAttachmentNames.has(f.name));

    if (text.trim() || validAttachments.length > 0) {
      onSend?.(text, attachments); // Pass original attachments or just valid? The spec says: "failed attachments must not block sending the text remainder." It implies onSend gets called. Usually we send all attachments and let the parent deal with it, or we exclude failed. Let's send all attachments, parent controls the state. Wait, the spec says "failed attachments must not block sending the text remainder." It implies text is sent. Sending attachments is fine.
      if (!onDraftChange) setText(''); // Only clear if not fully controlled
      
      // If we don't have attachment statuses, clear all.
      // If we do, we might leave failed ones? The spec doesn't specify if we clear them from internal state. Let's clear all for simplicity unless controlled.
      if (!onAttach) {
         setAttachments([]);
      }
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleLocalKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
      // Let parent decide if send happens
      return;
    }
    
    // Default behavior if no parent controller
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div 
      className={`mm-composer ${isFocused ? 'focused' : ''} ${isVoiceMode ? 'voice-mode' : ''} ${isDragging ? 'dragging' : ''} ${replyOrEditMode ? 'with-header' : ''} ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {attachments.length > 0 && !onAttach && (
        <div className="mm-attachments">
          {attachments.map((file, i) => {
            const statusObj = attachmentStatuses[file.name] || { status: 'staged' };
            const isFailed = statusObj.status === 'failed';
            const isUploading = statusObj.status === 'uploading';
            
            return (
              <div key={i} className={`mm-attachment-item ${statusObj.status}`}>
                <div className="mm-attachment-info">
                  <span className="mm-attachment-name">{file.name}</span>
                  {isUploading && statusObj.progress !== undefined && (
                    <span className="mm-attachment-progress">{Math.round(statusObj.progress * 100)}%</span>
                  )}
                  {isFailed && <span className="mm-attachment-error">Failed</span>}
                </div>
                
                <div className="mm-attachment-actions">
                  {isFailed && onRetryAttachment && (
                    <button 
                      className="mm-attachment-retry"
                      onClick={() => onRetryAttachment(file.name)}
                      aria-label="Retry upload"
                    >
                      Retry
                    </button>
                  )}
                  <button 
                    className="mm-attachment-remove"
                    onClick={() => {
                      if (onRemoveAttachment) onRemoveAttachment(file.name);
                      setAttachments(prev => prev.filter((_, index) => index !== i));
                    }}
                    aria-label="Remove attachment"
                  >
                    ×
                  </button>
                </div>
                
                {isUploading && (
                  <div className="mm-attachment-progress-bar">
                    <div 
                      className="mm-attachment-progress-fill" 
                      style={{ width: `${(statusObj.progress || 0) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mm-input-row">
        <button 
          className="mm-icon-btn mm-attach-btn" 
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach file"
          disabled={disabled}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
          </svg>
        </button>
        <input 
          type="file" 
          multiple 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          disabled={disabled}
          onChange={(e) => {
            if (e.target.files) {
              if (onAttach) {
                onAttach(e.target.files);
              } else {
                setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
              }
            }
          }} 
        />

        {isVoiceMode ? (
          <div className="mm-voice-container">
            <AgentPresence state="listening" size="md" />
            <span className="mm-voice-text">Listening...</span>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            className="mm-textarea"
            placeholder={placeholder}
            value={text}
            disabled={disabled}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleLocalKeyDown}
            onPaste={handlePaste}
            rows={1}
            role="combobox"
            aria-expanded={false}
          />
        )}

        <div className="mm-actions">
          {text.trim() || (attachments.filter(f => attachmentStatuses[f.name]?.status !== 'failed').length > 0 && !onAttach) ? (
            <button 
              className="mm-send-btn" 
              onClick={handleSubmit} 
              disabled={disabled}
              aria-label="Send message"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          ) : (
            <button 
              className={`mm-icon-btn mm-voice-btn ${isVoiceMode ? 'active' : ''}`}
              onClick={() => setIsVoiceMode(!isVoiceMode)}
              disabled={disabled}
              aria-label={isVoiceMode ? "Stop voice input" : "Start voice input"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {isDragging && (
        <div className="mm-drop-overlay">
          <span>Drop files to attach</span>
        </div>
      )}
    </div>
  );
}
